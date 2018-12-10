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
    });
    $.ajax({
        url:"/resv",
        method:"get",
        success:function(data){
            var $resv_list_group = $(".reservation_list").find(".list-group");
            $resv_list_group.html("");
            var rows = data.rows;
            
            for(var i = 0; i<rows.length; i++){
                var row = rows[i];
                var resv_html = createReserveBox(row);
                $resv_list_group.append(resv_html);
            }
            //검진 결과 보기
            $(".btn-diag-result").click(function(){
                var resv_id = $(this).find(".resv_id").val();
                location.href="/page/diag/"+resv_id;
            });
            //예약 확정 하기
            $(".btn-diag-approve").click(function(){
                var resv_id = $(this).find(".resv_id").val();
                $.ajax({
                    url:"/resv/"+resv_id,
                    method:"put",
                    data:{
                        approval:"Y"
                    },
                    success:function(data){
                        if(data.result){
                            location.reload();
                        }
                    }
                })
            });
            //검진 시작 하기
            $(".btn-diag-start").click(function(){
                var resv_id = $(this).find(".resv_id").val();
                location.href="/page/diag/"+resv_id;
            });

        }
    })
});

function createReserveBox(resvObj){
    var resvTime = moment(resvObj.reserve_time);
    var resvTimeDisplay = resvTime.format("YYYY년 MM월 DD일 HH:mm");
    var resvSex = resvObj.sex == "M" ? "남":"여";
    var resvRemain = resvTime.fromNow();
    var buttonHTML;
    if(resvObj.diag_done_time){
        buttonHTML = "<button type=\"button\" class=\"btn btn-primary btn-diag-result\">검진 결과 보기"
                    +"<input type='hidden' value='"+resvObj.reserve_id+"' class='resv_id'/>"
                    +"</button>";
    }else{
        if(resvObj.approval == "N"){
            buttonHTML = "<button type=\"button\" class=\"btn btn-danger btn-diag-approve\">예약 확정 하기"
                        +"<input type='hidden' value='"+resvObj.reserve_id+"' class='resv_id'/>"
                        +"</button>";
        }
        else{
            buttonHTML ="<button type=\"button\" class=\"btn btn-info btn-diag-start\">검진 시작 하기"
                        +"<input type='hidden' value='"+resvObj.reserve_id+"' class='resv_id'/>"
                        +"</button>";
        }
    }
    var form = 
    "<div class=\"list-group-item list-group-item-action flex-column align-items-start\">"+
    "<div class=\"d-flex w-100 justify-content-between\">"+
    "<h5 class=\"mb-1\">"+resvTimeDisplay+" 예약 </h5>"+
    "<small>"+resvRemain+"</small>"+
    "<p class=\"mb-1\">"+resvObj.name+" "+resvObj.age+"세 "+resvSex+"</p>"+
    "</div>"+
    buttonHTML+
    "</div>";

    return form;
}