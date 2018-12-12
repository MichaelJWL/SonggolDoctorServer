var express = require('express');
var router = express.Router();
var dbconnection = require("../database");

router.get("/data/test/connection",function(req, res, next){
  dbconnection.destroy();
  res.json({result:"complete"});
});
router.post("/data/test/query",function(req, res, next){
    var query = req.body.query;

    dbconnection.query(query, function(err, rows, fields){
      if(!err){
          res.json({result:true, rows:rows});
      }else{
          res.json({result:false,error: err});
      }
    });
})

/* GET home page. */
router.get('/', function(req, res, next) {
  if(req.session.hosp_info){
    res.redirect('/page/main');
  }else{
    res.render('index.html');
  }
  
});
router.get('/page/main',function(req, res, next){
  if(!req.session.hosp_info){
    res.redirect('/');
  }else{
    res.render('main.html');
  }
  
});
router.get('/page/diag/:resv_id',function(req, res, next){
  var resv_id = req.params.resv_id;
  if(!req.session.hosp_info){
    res.redirect('/');
  }else{
    res.render('diagnosis.ejs',{resv_id:resv_id});
  }
});
module.exports = router;
