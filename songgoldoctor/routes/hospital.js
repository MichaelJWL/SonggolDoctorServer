var express = require('express');
var router = express.Router();
var dbconnection = require("../database");

/**
 * SELECT
 */
//병원 로그인
router.post("/login/:id/:password",function(req, res, next){
    var id = req.params.id;
    var pwd = req.params.password;
    
    dbconnection.query(
      "SELECT hosp_id from hospital_info " +
      "where hosp_id = '" + id +
        "' and password = '" + pwd + "'",
  
      function(err, rows, fields){
        if(!err){
          if(rows.length > 0){
            console.log("[LOG]Login success!");
            req.session.hosp_info = {
              hosp_id:rows[0].hosp_id
            };
            res.json({"result":true});
            
          }else{
            console.log("[LOG]Login failed!");
            res.json({"result":false});
          }
        }else{
          res.json({"result":false,"error":err});
        }
    });
    
  });
  //병원 로그아웃
  router.post("/logout",function(req, res, next){
    var sess = req.session;
    console.log("[LOG]logout");
    if(sess.hosp_info){
        req.session.destroy(function(err){
            if(err){
                res.json({result:false, err: err});
                console.log(err);
            }else{
                res.json({result:true});
            }
        });
    }else{
        res.json({result:true});
    }
  });


  /**
   * GET
   */
  //병원 정보 조회
  router.get("/:hosp_id",function(req, res, next){
    var query = "SELECT * FROM hospital_info_view WHERE hosp_id = '"+req.params.hosp_id+"'";
    dbconnection.query( query,
        function(err, rows, fields){
          if(!err){
            if(rows.length > 0){
              res.json({"result":true,"data":rows});
              
            }else{
              console.log("[LOG] failed!");
              res.json({"result":false});
            }
          }else{
            res.json({"result":false,"error":err});
          }
      });
  });
  
 
  /**
   * INSERT
   */
 
  /**
   * UPDATE
   */
  
  module.exports = router;