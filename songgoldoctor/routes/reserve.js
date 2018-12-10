var express = require('express');
var router = express.Router();
var dbconnection = require("../database");

/**
 * SELECT
 */

/**
 * GET
 */
//모든 예약 정보 조회
router.get("/", function(req, res, next){
    if(req.session.hosp_info==null){
        res.redirect('/');
        return;
    }

    var hosp_id = req.session.hosp_info.hosp_id;

    var query = "SELECT * FROM hospital_reservation_view WHERE hosp_id='"+hosp_id+"'";

    dbconnection.query(query,function(err,rows,fields){
        console.log(rows);
        if(!err){
            if(rows.length>0){
                res.status(200).json({result:true,rows:rows});
            }else{
                res.status(200).json({result:false});
            }
            
        }else{  
            res.status(500).json({result:false, error: err});
        }
        return;
    });
    
});
//특정 예약 정보 조회
router.get("/:reserve_id", function(req, res, next){
    
    var query = "SELECT * FROM hospital_reservation_view "+
                "WHERE reserve_id = '"+req.params.reserve_id+"'";
    dbconnection.query(query,function(err,rows,fields){
        if(!err){
            if(rows.length>0){
                res.status(200).json({result:true,rows:rows});
            }else{
                res.status(200).json({result:false});
            }
        }else{  
            res.status(500).json({result:false, error: err});
        }
    })
});
/**
 * INSERT
 */
 //예약정보 등록
 router.post("/",function(req, res, next){
    var hosp_id = req.body.hosp_id;
    var user_id = req.body.user_id;
    var reserve_time = req.body.reserve_time;
    var diag_done_time = null;
    var approval = "N";

    var query = "INSERT INTO hospital_reservation VALUES "+
                "('"+hosp_id+"','"+user_id+"','"+reserve_time+"','"+diag_done_time+"','"+approval+"')";
    dbconnection.query(query, function(err, rows, fields){
        if(!err){
            res.status(200).json({result:true});
        }else{
            res.status(500).json({result:false});
        }
    });
});
/**
 * UPDATE
 */
//예약 정보 수정 approval, reserve_time, approval
router.put("/:reserve_id",function(req, res, next){
    
    var reserve_id = req.params.reserve_id;

    var reserve_time = req.body.reserve_time;
    var diag_done_time = req.body.diag_done_time;
    var approval = req.body.approval;

    var set_string_arr = [];

    if(reserve_time!=null){
        set_string_arr.push("reserve_time='"+reserve_time+"'");
    }
    if(diag_done_time!=null){
        set_string_arr.push("diag_done_time=now()");
    }
    if(approval!=null){
        set_string_arr.push("approval='"+approval+"'");
    }
    if(set_string_arr.length>0){
        var query = "UPDATE hospital_reservation "+
        "SET "+
        set_string_arr.join(",")+
        " WHERE reserve_id='"+reserve_id+"'";
        
        dbconnection.query(query,function(err, rows, fields){
            if(!err){
                res.status(200).json({result:true});
            }else{
                res.status(500).json({result:false, error:err});
            }
        });
    }else{
        
        res.status(500).json({result:false, error:"[ERROR]no parameters"});
    }
    
});
module.exports = router;