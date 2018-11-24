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
            req.session.hosp_info = rows;
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
  //예약 정보 조회
  router.get("/resv/:reserve_id", function(req, res, next){
    var query = "SELECT * FROM hospital_reservation_view "+
                "WHERE reserve_id = '"+req.params.reserve_id+"'";
    dbconnection.query(query,function(err,rows,fields){
        if(!err){
            if(rows.length>0){
                res.json({result:true}, rows);
            }else{
                res.json({result:false});
            }
        }else{  
            res.json({result:false, error: err});
        }
    })
  })
  /**
   * INSERT
   */
  //예약정보 등록
  router.post("/resv",function(req, res, next){
    var hosp_id = req.body.hosp_id;
    var user_id = req.body.user_id;
    var reserve_time = req.body.reserve_time;
    var diag_done_time = null;
    var approval = "N";

    var query = "INSERT INTO hospital_reservation VALUES "+
                "('"+hosp_id+"','"+user_id+"','"+reserve_time+"','"+diag_done_time+"','"+approval+"')";
    dbconnection.query(query, function(err, rows, fields){
        if(!err){
            res.json({result:true});
        }else{
            res.json({result:false});
        }
    });
  });

  //진단 등록 **반드시 예약정보도 함께 업데이트 되어야함
  router.post("/diag",function(req, res, next){
      var reserve_id = req.body.reserve_id;
      var comment = req.body.comment;

      var query = "INSERT INTO diag_info VALUES "+
                  "('"+reserve_id+","+comment+")";
      dbconnection.query(query, function(err, rows, fields){
        if(!err){
            res.json({result:true});
        }else{
            res.json({result:false,error: err});
        }
      });
  });
  /**
   * UPDATE
   */
  //예약 정보 수정 approval, reserve_time, approval
  router.put("/resv/:reserve_id",function(req, res, next){
      var reserve_id = req.params.reserve_id;

      var reserve_time = req.body.reserve_time;
      var diag_done_time = req.body.diag_done_time;
      var approval = req.body.approval;
      
      var query = "UPDATE hospital_reservation "+
                  "SET reserve_time='"+reserve_time+"',"+
                  "diag_done_time='"+diag_done_time+"',"+
                  "approaval='"+approval+"'"+
                  "WHERE reserve_id='"+reserve_id+"'";

      dbconnection.query(query,function(err, rows, fields){
          if(!err){
            res.json({result:true});
          }else{
            res.json({result:false, error:err});
          }
      })
  });

  module.exports = router;