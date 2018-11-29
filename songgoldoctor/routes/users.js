var express = require('express');
var router = express.Router();
var dbconnection = require("../database");

/* GET users listing. */
router.get('/', function(req, res, next) {
  // req.query.test
  dbconnection.query('SELECT * from user_info', function(err, rows, fields) {
    if (!err){
      console.log('The solution is: ', rows);
      res.json(rows);
    }
    else{
      console.log('Error while performing Query.', err);
      res.send('resource error');
    }
      
  });
  
});
//특정회원 정보조회
router.get("/:user_id", function(req, res, next){
  var user_id = req.params.user_id;
  var query = "SELECT * FROM user_info_view WHERE user_id = '"+user_id+"'";

  dbconnection.query(query, function(err, rows, fields){
    if(!err){
      res.json({result: true, data: rows});
    }else{
      res.json({result: false, error: err});
    }
  })
});
//로그인
router.post("/login",function(req, res, next){
  var user_id = req.body.user_id;
  var password = req.body.password;

  var query = "SELECT user_id FROM user_info "+
              "WHERE user_id = '"+user_id+"' and "+
                "password = '"+password+"'";

  dbconnection.query(query, function(err, rows, fields){
    if(!err){
      if(rows.length > 0){
        res.json({result: true});
      }else{
        res.json({result: false});
      }
    }else{
      res.json({result: false, error: err});
    }
  })
});
router.post("/logout",function(req, res, next){
//TODO: Logout process for android devices

  res.json({result:true});
});
/* SELECT users */


/* INSERT users */
router.post("/",function(req, res, next){
  //회원가입
  var user_id = req.body.user_id;
  var name = req.body.name;
  var age = req.body.age;
  var sex = req.body.sex;
  var contact = req.body.contact;
  var email = req.body.email;
  var password = req.body.password;

  var query = "INSERT INTO user_info "+
              "VALUES ('"+user_id+"','"+name+"','"+age+"','"+sex+"','"+contact+"','"+email+"','"+password+"')";

  dbconnection.query(query,function(err,row,fields){
    if (!err){
      res.json({result:true});
    }
    else{
      res.json({result:false, error: err});
    }
  })
});
module.exports = router;
