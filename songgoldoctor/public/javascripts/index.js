$(document).ready(function(){
    $("#hospital_login").click(function(){
        var id = $("#hosp_id").val();
        var password = $("#hosp_pwd").val();
        // alert("password:"+password);
        $.ajax({
            url:"/hosp/login/"+id+"/"+password,
            method:"post",
            success:function(obj){
                
                console.log(obj);

                if(obj.result){
                    alert("login success");
                    location.href = "/page/main";
                }else{
                    alert("login failed");
                }
                
            }
        })
    });
    $("#get_hospital_info").click(function(){
        $.ajax({
            url:"/data/test/query",
            method:"post",
            data:{
                query:"SELECT * FROM diag_medicine_view"
            },
            success:function(data){
                console.log(data);
                // if(data.next_page_token){
                //     pagetoken = data.next_page_token;
                // }
            }
        })
    })
});
var pagetoken = null;