var express = require('express');
var router = express.Router();
var dbconnection = require("../database");
/**
 * GET
 */
router.get("/:reserve_id",function(req, res, next){
    var reserve_id = req.params.reserve_id;

    var query = "SELECT * FROM diag_info WHERE reserve_id="+reserve_id+"";
    dbconnection.query(query, function(err, rows, fields){
        if(!err){
            res.json({result:true, rows:rows});
        }else{
            res.json({result:false,error: err});
        }
      });
})
/**
 * INSERT
 */
//진단 등록 **반드시 예약정보도 함께 업데이트 되어야함
router.post("/",function(req, res, next){
    var reserve_id = req.body.reserve_id;
    var comment = req.body.comment;

    var query = "INSERT INTO diag_info (reserve_id,comment) VALUES "+
                "("+reserve_id+",'"+comment+"')";
    dbconnection.query(query, function(err, rows, fields){
      if(!err){
          res.redirect("/diag/"+reserve_id);
      }else{
          res.json({result:false,error: err});
      }
    });
});

/**
 * PUT
 */
router.put("/",function(req, res, next){
    var diag_id = req.body.diag_id;
    var comment = req.body.comment;

    var query = "UPDATE diag_info "+
                "SET comment='"+comment+"'"+
                "WHERE diag_id="+diag_id+"";
    dbconnection.query(query, function(err, rows, fields){
        if(!err){
            res.json({result:true});
        }else{
            res.json({result:false,error: err});
        }
    });
})
module.exports = router;