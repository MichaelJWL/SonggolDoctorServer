var MEDICINE_ARR = [];

$(document).ready(function(){
    var $medicine_list = $("#medicine_list");
    var $select_medicine = $("#select_medicine");
    var $diagnosis_comment = $("#diagnosis_comment");
    var resv_id = $("#page_resv_id").val();
    getReservInfo(resv_id, function(data){
        if(data.result){
            var row = data.rows[0];
            var html = createInfoBox(row);

            $(".wrapper").find(".info_box").append(html);

            if(row.diag_done_time==null){
                $(".btn-diag-start").click(function(){
                    if($diagnosis_comment.val()==null || $diagnosis_comment.val()==""){
                        alert("comment를 작성해주세요!");
                        return;
                    }
                    insertDiagnosis(resv_id,$diagnosis_comment.val(),function(data){
                        if(!data.result){
                            alert("병원 정보 저장 실패!");
                            return;
                        }
                        var row = data.rows[0];
                        var flag = false;
                        if(MEDICINE_ARR.length>0)
                            insertMedicine(row.diag_id, MEDICINE_ARR, function(data){
                                if(data.result){
                                    alert("저장 완료!");
                                }else{
                                    alert("약 정보 저장에 실패하였습니다.");
                                }
                                if(flag){
                                    location.href="/page/main";
                                }else{
                                    flag = true;
                                }
                            });
                        updateResvDiagTime(resv_id, moment().format(),function(data){
                            if(data.result){
                                        
                            }else{
                                alert("검진 정보 업데이트 실패!");
                            }
                            if(flag){
                                location.href="/page/main";
                            }else{
                                flag = true;
                            }
                        });
                        
                    })
                });
            }else{
                getDiagInfo(row.reserve_id, function(data){
                    var diag_data = data.rows[0];
                    $diagnosis_comment.val(diag_data.comment);
                    getDiagMedicineInfo(diag_data.diag_id, function(data){
                        var rows = data.rows;
                        for(var i = 0; i<rows.length; i++){
                            var medi_data = rows[i];
                            var li_string = "<li class='list-group-item' value='"+MEDICINE_ARR.length+"'>"+medi_data.medicine_name+"</li>";
                            $medicine_list.append(li_string);
                            MEDICINE_ARR.push(medi_data.medicine_id);
                            bindMedicineEvent();
                        }
                    });

                    $(".btn-diag-result").click(function(){
                        var flag = false;
                        deleteMedicine(diag_data.diag_id, function(data){
                            if(data.result){
                                if(MEDICINE_ARR.length>0)
                                    insertMedicine(diag_data.diag_id, MEDICINE_ARR, function(data){
                                        if(data.result){
                                            alert("저장 완료!");
                                        }else{
                                            console.log(data);
                                            alert("약 정보 저장에 실패하였습니다.");
                                        }
                                        if(flag){
                                            location.href="/page/main";
                                        }else{
                                            flag = true;
                                        }
                                    });
                            }else{
                                alert("데이터 업데이트 실패!");
                                return;
                            }
                        });
                        updateDiagnosisComment(diag_data.diag_id, $diagnosis_comment.val(), function(data){
                            if(data.result){
                                updateResvDiagTime(resv_id, moment().format(),function(data){
                                    if(data.result){
                                                
                                    }else{
                                        alert("검진 정보 업데이트 실패!");
                                    }
                                    if(flag){
                                        location.href="/page/main";
                                    }else{
                                        flag = true;
                                    }
                                }); 
                            }else{
                                alert("comment 업데이트 실패!");
                            }
                        });
                        
                        
                    });
                });
            }

            
        }
    });
    getMedicineInfo(function(data){
        if(data.result){
            var option_strings = "";
            for(var i = 0 ; i < data.rows.length; i++){
                var row_data = data.rows[i];
                var option_string = "<option value='"+row_data.medicine_id+"'>"+row_data.medicine_name+"</option>";
                option_strings+=option_string;
            }
            $select_medicine.append(option_strings);
        }else{
            alert("약 정보를 로드하는데 실패하였습니다.");
        }
    });
    

    $(".btn-add-medicine").click(function(){
        var selected_medi_id = $select_medicine.val();
        var selected_text = $select_medicine.find("option:selected").text();
        
        var li_string = "<li class='list-group-item' value='"+MEDICINE_ARR.length+"'>"+selected_text+"</li>";
        $medicine_list.append(li_string);
        MEDICINE_ARR.push(selected_medi_id);
        bindMedicineEvent();
    });

    
});
function createInfoBox(resvObj){
    var resvTime = moment(resvObj.reserve_time);
    var resvTimeDisplay = resvTime.format("YYYY년 MM월 DD일 HH:mm");
    var resvSex = resvObj.sex == "M" ? "남":"여";
    var resvRemain = resvTime.fromNow();
    var buttonHTML;
    if(resvObj.diag_done_time){
        buttonHTML = "<button type=\"button\" class=\"btn btn-primary btn-diag-result\">검진 결과 수정 하기"
                    +"<input type='hidden' value='"+resvObj.reserve_id+"' class='resv_id'/>"
                    +"</button>";
    }else{
        buttonHTML ="<button type=\"button\" class=\"btn btn-info btn-diag-start\">검진 저장 하기"
                    +"<input type='hidden' value='"+resvObj.reserve_id+"' class='resv_id'/>"
                    +"</button>";
    }
    var form = 
    "<div class=\"d-flex w-100 justify-content-between\">"+
    "<h5 class=\"mb-1\">"+resvTimeDisplay+" 예약 </h5>"+
    "<small>"+resvRemain+"</small>"+
    "<p class=\"mb-1\">"+resvObj.name+" "+resvObj.age+"세 "+resvSex+"</p>"+
    "</div>"+
    buttonHTML;

    return form;
}
function bindMedicineEvent(){
    var $medicine_list = $("#medicine_list");
    $("#medicine_list").find(".list-group-item").unbind("click").click(function(){
        var index = $(this).attr("value");
        var medi_name = $(this).text();
        var confirm = window.confirm("'"+medi_name+"'을 삭제하시겠습니까?");
        if(confirm){
            MEDICINE_ARR.splice(index,1);
            $(this).remove();
            for(var i = 0 ; i < MEDICINE_ARR.length; i++){
                $medicine_list.find(".list-group-item:eq("+i+")").attr("value",i);
            }
        }
    });
}
function getDiagInfo(reserve_id, callback){
    $.ajax({
        url:"/diag/"+reserve_id,
        method:"get",
        success:callback
    })
}
function getMedicineInfo(callback){
    $.ajax({
        url:"/medi",
        method:"get",
        success:callback
    });
}
function getDiagMedicineInfo(diag_id, callback){
    $.ajax({
        url:"/medi/"+diag_id,
        method:"get",
        success:callback
    });
}
function getReservInfo(reserve_id, callback){
    $.ajax({
        url:"/resv/"+reserve_id,
        method:"get",
        success:callback
    });
}
function insertDiagnosis(reserve_id, comment, callback){
    $.ajax({
        url:"/diag",
        method:"post",
        data:{
            reserve_id:reserve_id,
            comment:comment
        },
        success:callback
    });
}
function insertMedicine(diag_id, medicine_ids, callback){
    $.ajax({
        url:"/medi",
        method:"post",
        data:{
            diag_id:diag_id,
            medicine_ids:medicine_ids
        },
        success:callback
    });
}
function deleteMedicine(diag_id, callback){
    $.ajax({
        url:"/medi/"+diag_id,
        method:"delete",
        success:callback
    });
}
function updateResvDiagTime(resv_id,diag_done_time,callback){
    $.ajax({
        url:"/resv/"+resv_id,
        method:"put",
        data:{
            reserve_id: resv_id,
            diag_done_time: diag_done_time
        },
        success:callback
    });
}
function updateDiagnosisComment(diag_id, comment, callback){
    $.ajax({
        url:"/diag",
        method:"put",
        data:{
            diag_id: diag_id,
            comment: comment
        },
        success:callback
    });
}