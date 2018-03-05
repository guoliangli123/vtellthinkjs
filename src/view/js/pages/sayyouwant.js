import vTellClient from "../utils/client";

Zepto(function ($) {
  $('#sayyouwantform').on('submit', function (e) {
    e.preventDefault();
    e.stopPropagation();

    if ($('#inputText').val().length === 0) return mui.toast('请填写内容', { duration: 1000 });

    $('button')[0].disabled = true;

    $.ajax({
      type: 'POST',
      url: '/nodeapi/sayyouwant',
      data: JSON.stringify({ "info": { "detail": $('#inputText').val() } }),
      dataType: 'json',
      contentType: 'application/json',
      timeout: 10000,
      success: function (data) {
        mui.toast('提交成功', { duration: 1000 });
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
        $('button')[0].disabled = false;
      }
    })
  })
})