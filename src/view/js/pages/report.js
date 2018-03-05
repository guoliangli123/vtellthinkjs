import vTellClient from "../utils/client";

Zepto(function ($) {
  $('.table-view-cell').tap(function (e) {
    $('.table-view-cell').removeClass('active');
    $(this).addClass('active');
  })

  var token ;
  try{
    vTellClient.getToken().then(res=>{
      token = res.token;
    });
  }catch(e){
    console.log(e);
  }

  $('.submitButton').on('touchend',function (e) {
    e.preventDefault();
    e.stopPropagation();
    if ($('.table-view-cell.active').length == 0) {
      mui.toast('请选择举报理由', { duration: 1000 });
      return;
    }
    var cause = $('.table-view-cell.active').data('value');
    
    var header = {
      token: token,
    }
    
    $('.submitButton')[0].disabled = true;
    $.ajax({
      type: 'POST',
      url: '/nodeapi/report',
      data: JSON.stringify({ "cause": cause, "videoId": _config.videoId }),
      headers: header,
      dataType: 'json',
      contentType: 'application/json',
      timeout: 10000,
      success: function (data) {
        mui.toast('举报成功', { duration: 1000 });
        setTimeout(function () {
          vTellClient.closePage();
        }, 1500);
      },
      error: function (xhr, type, err) {
        if (xhr.status == 401) {
          mui.toast('token失效,请重新登陆', { duration: 1000 });
          vTellClient.tokenTimeOut();
        }
        else {
          mui.toast('网络状态稍差，请稍后', { duration: 1000 });
        }
      },
      complete: function () {
        $('.submitButton')[0].disabled = false;
      }
    })
  })
})
