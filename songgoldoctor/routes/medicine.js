var express = require('express');
var router = express.Router();
var dbconnection = require("../database");

/**
 * GET
 */
router.get("/",function(req, res, next){

    var query = "SELECT * FROM medicine_info";
    dbconnection.query(query, function(err, rows, fields){
        if(!err){
            res.json({result:true, rows:rows});
        }else{
            res.json({result:false,error: err});
        }
    });
})
router.get("/:diag_id",function(req, res, next){
    console.log("[select diag medi view]");
    var diag_id = req.params.diag_id;

    var query = "SELECT * FROM diag_medicine_view WHERE diag_id="+diag_id;

    dbconnection.query(query, function(err, rows, fields){
        if(!err){
            res.json({result:true, rows:rows});
        }else{
            res.json({result:false,error: err});
        }
    });
});
/**
 * POST
 */
router.post("/",function(req, res, next){
    console.log("[MEDI] POST insert medicine mapping");
    var diag_id = req.body.diag_id;
    var medicine_ids = req.body.medicine_ids;
    
    var insert_value_arr = [];

    for(var i = 0 ; i < medicine_ids.length ; i++){
        var _string = "("+diag_id+","+medicine_ids[i]+")";
        insert_value_arr.push(_string);
    }


    var query = "INSERT INTO diag_medicine_map VALUES "+insert_value_arr.join(",");
    dbconnection.query(query, function(err, rows, fields){
        if(!err){
            res.json({result:true});
        }else{
            res.json({result:false,error: err});
        }
    });
});

/**
 * DELETE
 */
router.delete("/:diag_id",function(req, res, next){
    var diag_id = req.params.diag_id;

    var query = "DELETE FROM diag_medicine_map WHERE diag_id="+diag_id;
    dbconnection.query(query, function(err, rows, fields){
        if(!err){
            res.json({result:true});
        }else{
            res.json({result:false,error: err});
        }
    });
})
module.exports = router;