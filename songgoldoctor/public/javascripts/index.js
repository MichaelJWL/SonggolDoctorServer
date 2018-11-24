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

})