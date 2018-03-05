Zepto(function ($) {
  function setPlayInfo() {
    if (Math.abs(_config.aspectRatio - 1.3) < 0.1) {
      $('.video-playing-info .head-img').css('top', document.documentElement.clientHeight / 2 - document.documentElement.clientWidth / 4 * 3 / 2 - 40);
      $('.right-area').css('top', document.documentElement.clientHeight / 2 + document.documentElement.clientWidth / 4 * 3 / 2 + 15);
    }
    else if (_config.aspectRatio = 0.5625) {
      $('.right-area').css('top', document.documentElement.clientHeight - 100);
      $('.video-playing-info .head-img').css('display', 'none');
    }
  }

  (function init() {
    $('.video-thumb-img').height(document.documentElement.clientWidth);
    $('.video-container').height(document.documentElement.clientHeight);
    $('video').width(document.documentElement.clientWidth);
    setPlayInfo();
  })();

  window.addEventListener('resize', function (event) {
    var deviceWidth = document.documentElement.clientWidth < 750 ? document.documentElement.clientWidth : 750;
    document.documentElement.style.fontSize = deviceWidth / 7.5 + 'px';
    $('.video-container').height(document.documentElement.clientHeight);
    setPlayInfo();
  });

  $.fn.touchClick = function (callback) {
    this.each(function () {
      var obj = $(this);
      obj.on("touchstart", function () {
        obj.data("move", false);
      }).on("touchmove", function () {
        obj.data("move", true);
      }).on("touchend", function (event) {
        if (obj.data("move")) {
          return;
        } else {
          if (typeof callback === "function") {
            callback(obj, event);
          }
        }
        obj.data("move", false);
      });
    });
  };
  var totalTime, currentTime, paused, userAgent = navigator.userAgent, addplaycount = true;

  //判断手机类型
  var isIos = !!userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
  var isAndroid = userAgent.indexOf('Android') > -1 || userAgent.indexOf('Adr') > -1; //android终端
  var isQQ = (/qq/ig).test(userAgent);
  var isWeiXin = (/MicroMessenger/ig).test(userAgent);
  var isWeiBo = (/weibo/ig).test(userAgent);

  var schemeStr = 'vtell://video/' + _config.videoId + '?from=args_from_h5';
  var initPhonetype = (function () {
    if (isAndroid) {
      $('.download-link').data('href', 'http://a.app.qq.com/o/simple.jsp?pkgname=com.sohu.vtell');
    }
    else if (isIos) {
      $('.download-link').data('href', 'http://a.app.qq.com/o/simple.jsp?pkgname=com.sohu.vtell');
    }
    if (isWeiXin) {
      $('.stop-recommend-list').addClass('weixin');
    }
  })();

  function pause() {
    $('#videoDom')[0].pause();
    $('#videoControl').removeClass('play');
  }

  function play() {
    $('#videoDom')[0].play();
    $('#videoDom').css('top', 0);
    $('#videoControl').addClass('play');
    $('.header').addClass('play');
  }

  $('#showVideo').click(function (e) {
    if (_config.verified === '1' || _config.verified === '0') {
      $('.video-content').addClass('play');
      $('.header').addClass('play');
      // $('.video-container .videoplayer-thumb-img').show();
      play();
    }
    else {
      mui.toast('视频已被删除', { duration: 1000 });
    }
  });

  //video事件
  $('#videoDom')[0].addEventListener("durationchange", function () {
    totalTime = $('#videoDom')[0].duration;//获取总时长
  });


  $('#videoDom')[0].addEventListener('timeupdate', function () {
    currentTime = $('#videoDom')[0].currentTime;
    if (currentTime > 0.05) {
      // $('.video-container .videoplayer-thumb-img').hide();
    }
    if (currentTime > 1 && addplaycount) {
      $.ajax({
        type: 'POST',
        url: '/nodeapi/addplaycount',
        data: JSON.stringify({ "videoId": _config.videoId }),
        dataType: 'json',
        contentType: 'application/json',
        timeout: 10000,
        success: function (data) {
          addplaycount = false;
          console.log('add playcount success');
        },
        error: function (xhr, type, err) {
          addplaycount = false;
          console.log('add playcount error');
        }
      })
    }
  });

  $('#videoDom')[0].addEventListener('ended', function () {
    $(this).css('top', '9999px');
    $('.header').removeClass('play');
    $('.weixin-share-container').hide();
    $('.video-playing-info').show();
    $('.stop-recommend-list').css({ 'opacity': 1, 'zIndex': 90 });
    this.currentTime = 0;
  });
  //微信浏览器video事件
  $('#videoDom')[0].addEventListener("x5videoenterfullscreen", function () {
    $('.share-arrow').css('top', '.5rem');
    $('.share-tip').css('top', '2.4rem');
    $('.right-area').show();
    play();
  })

  $('#videoDom')[0].addEventListener("x5videoexitfullscreen", function () {
    $('.share-arrow').css('top', '0');
    $('.share-tip').css('top', '2rem');
    $(this).css('top', '0');

    $('.header').removeClass('play');
    $('.right-area').hide();
    pause();
  })

  $('#videoDom').touchClick(function (self, e) {
    e.preventDefault();
    if ($('#videoDom')[0].paused) {
      play();
    }
    else {
      pause();
    }
  });

  $('#videoControl').touchClick(function (self, e) {
    e.preventDefault();
    if ($('#videoDom')[0].paused) {
      play();
    }
    else {
      pause();
    }
  });

  $('.replay').touchClick(function (self, e) {
    $('.stop-recommend-list').css({ 'opacity': 0, 'zIndex': -1 });
    $('.header').addClass('play');
    play();
  });

  $('.close').on('touchend', function (e) {
    $('.download-container').removeClass('bounceInDown');
    $('.download-container').addClass('bounceOutUp');
    setTimeout(function () { $('.download-container-mask').hide(); }, 1000)
    if (!paused) {
      play();
    }
  });

  $('.js_download_dialog_button').touchClick(function (self, e) {
    paused = $('#videoDom')[0].paused;
    $('.download-container').removeClass('bounceOutUp');
    $('.download-container').addClass('bounceInDown');
    $('.download-container-mask').show();
    pause();
  });

  function openNativeApp(scheme, callback) {
    var _clickTime = +(new Date());
    window.location = scheme;
    var _count = 0, intHandle, opened = false;
    intHandle = setInterval(function () {
      _count++;
      var elsTime = +(new Date()) - _clickTime;
      if (_count >= 100) {
        clearInterval(intHandle);
        if (elsTime > 8500 || document.hidden || document.webkitHidden) {
          return
        }
        else {
          callback();
        }
      }
    }, 80);
  }

  $('.js_open_app').on('touchend', function (e) {
    if (isWeiXin) {
      window.location = 'http://a.app.qq.com/o/simple.jsp?pkgname=com.sohu.vtell&android_scheme=' + schemeStr;
    }
    else if (isWeiBo) {
      $('.weibo-open-container').show();
      pause();
    }
    else {
      openNativeApp(schemeStr, function () { window.location = $('.download-link').data('href'); });
    }

  });

  $('.weibo-open-container').on('touchend', function (e) {
    $(this).hide();
    play();
  })

  $('.js_share_button').touchClick(function (self, e) {
    $('.weixin-share-container').show();
    $('.video-playing-info').hide();
    pause();
  });

  $('.weixin-share-container').touchClick(function (self, e) {
    $(self).hide();
    $('.video-playing-info').show();
    play();
  })


  if (isWeiXin) {
    $.ajax({
      type: 'POST',
      url: '/wechat',
      data: JSON.stringify({ url: location.href }),
      contentType: 'application/json',
      success: function (res) {
        var wechatConfig = res.data
        wx.config({
          debug: false,
          appId: 'wx18a9676834551c7c', // 必填，公众号的唯一标识
          timestamp: Number(wechatConfig.timestamp), // 必填，生成签名的时间戳
          nonceStr: wechatConfig.nonceStr, // 必填，生成签名的随机串
          signature: wechatConfig.signature,// 必填，签名，见附录1
          jsApiList: [
            'onMenuShareTimeline',
            'onMenuShareAppMessage',
            'onMenuShareQQ',
            'onMenuShareWeibo',
            'onMenuShareQZone',
          ] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
        });

        wx.ready(function () {
          wx.onMenuShareTimeline({
            title: _base_config.timelineTitle, // 分享标题
            link: wechatConfig.url, // 分享链接，该链接域名必须与当前企业的可信域名一致
            imgUrl: _base_config.shareImgUrl, // 分享图标
            success: function () {
              // 用户确认分享后执行的回调函数
            },
            cancel: function () {
              // 用户取消分享后执行的回调函数
            }
          });

          wx.onMenuShareAppMessage({
            title: _base_config.appMessageTitle, // 分享标题
            // desc: _base_config.appMessageDesc, // 分享描述
            link: wechatConfig.url, // 分享链接，该链接域名必须与当前企业的可信域名一致
            imgUrl: _base_config.shareImgUrl, // 分享图标
            type: 'link', // 分享类型,music、video或link，不填默认为link
            dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
            success: function () {
              // 用户确认分享后执行的回调函数
            },
            cancel: function () {
              // 用户取消分享后执行的回调函数
            }
          });

          wx.onMenuShareQZone({
            title: _base_config.timelineTitle, // 分享标题
            link: wechatConfig.url, // 分享链接，该链接域名必须与当前企业的可信域名一致
            imgUrl: _base_config.shareImgUrl, // 分享图标
            success: function () {
              // 用户确认分享后执行的回调函数
            },
            cancel: function () {
              // 用户取消分享后执行的回调函数
            }
          });

          wx.onMenuShareQQ({
            title: _base_config.appMessageTitle, // 分享标题
            // desc: _base_config.appMessageDesc, // 分享描述
            link: wechatConfig.url, // 分享链接，该链接域名必须与当前企业的可信域名一致
            imgUrl: _base_config.shareImgUrl, // 分享图标
            success: function () {
              // 用户确认分享后执行的回调函数
            },
            cancel: function () {
              // 用户取消分享后执行的回调函数
            }
          });

          wx.onMenuShareWeibo({
            title: _base_config.weiboMessageTitle, // 分享标题
            // desc: _base_config.appMessageDesc, // 分享描述
            link: wechatConfig.url, // 分享链接，该链接域名必须与当前企业的可信域名一致
            imgUrl: _base_config.shareImgUrl, // 分享图标
            success: function () {
              // 用户确认分享后执行的回调函数
            },
            cancel: function () {
              // 用户取消分享后执行的回调函数
            }
          });

        });
      },
      error: function (error) {
        console.dir(error);
      }
    })
  }
})