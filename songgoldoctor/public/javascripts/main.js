$(document).ready(function(){
   $("#logout_btn").click(function(){
        $.ajax({
            url:"/hosp/logout",
            method:"post",
            success:function(data){
                if(data.result){
                    location.href = "/";
                }else{
                    alert(data.err);
                }
            }
        })
   })
})