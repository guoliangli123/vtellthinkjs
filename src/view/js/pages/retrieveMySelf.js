import vTellClient from "../utils/client"
import toast from "../utils/toast"

Zepto(function ($) {
  var myHeaders = new Headers({
    "Content-Type": "application/json",
    "data-Type": "application/json",
  })
  var oldUserID, deviceInfo;

  async function getUser() {
    let userInfo = await vTellClient.getUserId();
    oldUserID = userInfo.user_id;
    deviceInfo = await vTellClient.getDeviceInfo();
    var queryObj = {
      userId: oldUserID,
      deviceInfos: deviceInfo,
    };
    $.ajax({
      type: 'POST',
      url: '/nodeapi/getWechatOldUserList',
      data: JSON.stringify(queryObj),
      dataType: 'json',
      contentType: 'application/json',
      success: function (response) {
        if (response.commonResp.errorCode != 'OK') {
          $('.user-list').html('<li style="text-align:center;margin-top:.6rem;">sorry,暂未到获取相匹配用户</li>');
          return toast(response.commonResp.detail);
        }
        if (response.userProfile && response.userProfile.length) {
          var res = '';
          response.userProfile.forEach(function (item, index) {
            res += `<li>
          <label for="${item.basic.userId}">
            <div class="checkbox-wrap">
              <input type="radio" name="username" id="${item.basic.userId}" value="${item.basic.userId}">
              <span class="check-box"></span>
            </div>
            <div class="user-img-wrap">
              <img src="${item.basic.avatarUrl}" alt="${item.basic.nickName}" class="avatar">
            </div>
            <div class="nickname-wrap">
              <span>${item.basic.nickName}</span>  
            </div>
          </label>
        </li>`
          });
          $('.user-list').html(res);
        } else {
          $('.user-list').html('<li style="text-align:center;margin-top:.6rem;">sorry,暂未到获取相匹配用户</li>');
        }
      },
      error: function (xhr, type, err) {
        $('.user-list').html('<li style="text-align:center;margin-top:.6rem;">sorry,暂未到获取相匹配用户</li>');
        toast('网络状态稍差，请稍后', { duration: 1000 });
      },
    })
  }

  getUser();

  $('#mergeButton').click(function () {
    // console.log($("input[name='username']:checked").val());
    if (!$("input[name='username']:checked").val()) {
      return toast('请选择与您相匹配的微信号。', { duration: 3000 });
    }
    $('#mergeButton')[0].disabled = true;
    var sendObj = {
      oldUserID: $("input[name='username']:checked").val(),
      currentUserID: oldUserID,
    }

    $.ajax({
      type: 'POST',
      url: '/nodeapi/mergeWechatUser',
      data: JSON.stringify(sendObj),
      dataType: 'json',
      contentType: 'application/json',
      success: function (response) {
        if (response.commonResp.errorCode == 'OK') {
          toast('已经与之前的账号绑定成功，请重新登录', { duration: 3000 })
            .then(function () {
              vTellClient.signOut();
              vTellClient.closePage();
            });
        }
        else {
          toast(response.commonResp.detail, { duration: 3000 })
        }
      },
      error: function (xhr, type, err) {
        // alert(type);
        console.log(xhr.responseText);
        toast(xhr.responseText, { duration: 40000 });
      },
      complete: function (xhr, status) {
        $('#mergeButton')[0].disabled = false;
      }
    })
  });

  var form = document.getElementById('manmadeForm');

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var inputs = form.querySelectorAll([
      '#nickname',
      'input[name="gender"]:checked',
      '#sign',
      '#date',
    ].join(','));

    var data = { currentUserID: oldUserID };

    [].slice.call(inputs).forEach(function (input) {
      if (input.name == 'createTime') {
        data[input.name] = new Date(input.value).valueOf() / 1000;
      } else {
        data[input.name] = input.value;
      }
    });

    var errorMessage = '';
    if (!data.oldNickname || !data.gender) errorMessage = '请填写完整';
    if (data.oldNickname.length > 15) errorMessage = '昵称不能超过15个字符';
    if (data.signature.length > 40) errorMessage = '签名不能超过40个字符';
    if (errorMessage) {
      // alert(errorMessage);
      toast(errorMessage, { duration: 3000 });
      return
    }
    $('#manmadeFormButton')[0].disabled = true;

    $.ajax({
      type: 'POST',
      url: '/nodeapi/applyArtificialMergeLoginInfo',
      data: JSON.stringify(data),
      dataType: 'json',
      contentType: 'application/json',
      success: function (response) {
        if (response.commonResp.errorCode == 'OK') {
          toast('提交成功，请等待我们工作人员联系你', { duration: 3000 }).then(function () {
            vTellClient.closePage();
          })
        }
        else {
          toast(response.commonResp.detail, { duration: 3000 })
        }
      },
      error: function (xhr, type, err) {
        toast(err.responseText, { duration: 1000 });
      },
      complete: function (xhr, status) {
        $('#manmadeFormButton')[0].disabled = false;
      }
    })
  });

});