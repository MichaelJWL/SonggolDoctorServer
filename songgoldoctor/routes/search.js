var express = require('express');
var router = express.Router();
var https = require('https');
var APIKEY = "AIzaSyAAm6XaiuQL0Pcc75RilRL9j2PEaEUgI7I";
/**
 * 검색결과는 최대 20개 이며
 * 그보다 많을 시 next_page_token 값을 반환해준다.
 * 
 * 더 많은 정보를 가져오고 싶다면 next_page_token을 
 * pagetoken으로 post바디에 포함시켜 검색하면 그다음 검색 결과가 주어진다.
 */
router.post("/hospital",function(req, res, next){
    var lat = req.body.lat;
    var lng = req.body.lng;
    var radius = req.body.radius;
    var pagetoken = req.body.pagetoken;

    getPlaceData("hospital",lat,lng,radius,pagetoken,function(data){
        res.json(data);
    });
});
router.post("/pharmacy",function(req, res, next){
    var lat = req.body.lat;
    var lng = req.body.lng;
    var radius = req.body.radius;
    var pagetoken = req.body.pagetoken;

    getPlaceData("pharmacy",lat,lng,radius,pagetoken,function(data){
        res.json(data);
    });
});

function getPlaceData(type, lat, lng, radius,pagetoken,_callback){
    var url = 'https://maps.googleapis.com/maps/api/place/search/json?location='+lat+','+lng+'&radius='+radius+'&types='+type+'&sensor=true&key='+APIKEY;
    if(pagetoken!=null){
        url += '&pagetoken='+pagetoken;
    }
    
    https.get(url,function(resp){
        // console.log(resp);
        var data = '';
        resp.on('data',function(chunk){
            data += chunk;
        })
        resp.on('end', () => {
            _callback(JSON.parse(data));
        });
    })
}
module.exports = router;