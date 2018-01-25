; (function (global, factory) {
  "use strict";
  if (typeof module === "object" && typeof module.exports === "object") {
    module.exports = factory();
  } else {
    global.vTellClient = factory();
  }
})(typeof window !== "undefined" ? window : this, function () {
  "use strict";

  function callIOSNative(msg, code, callback) {
    client.setupWebViewJavascriptBridge(function (bridge) {
      bridge.callHandler('ObjC Echo', { msg: msg, code: code }, function responseCallback(response) {
        if (typeof callback === 'function') {
          callback(parseResponse(response));
        }
      })
    })
  }

  function callAndroidNative(msg, code, callback) {
    var retval = VTellAndroidNative.callNative(JSON.stringify({ msg: msg, code: code }));
    if (typeof callback === 'function') {
      callback(parseResponse(retval));
    }
  }

  function callNative(msg, code, callback) {
    if (client.isAndroid()) {
      callAndroidNative(msg, code, callback);
    }
    else {
      callIOSNative(msg, code, callback);
    }
  }

  function parseResponse(res) {
    var json;
    try {
      json = JSON.parse(res)
    }
    catch (e) {
      json = {};
    }
    return json && json.msg || null;
  }

  var client = {};

  client.isAndroid = function () {
    if (window.VTellAndroidNative) {
      return true;
    }
    else {
      return false;
    }
  }

  client.weWantYouSubmit = function () {
    return callAndroidNative('提交成功', 75200);
  }

  client.getToken = function (callback) {
    callNative('getTokenInfo', 75202, callback);
  }

  client.getUserId = function (callback) {
    callNative('getUserId', 75210, callback);
  }

  client.tokenTimeOut = function () {
    callNative('tokenTimeOut', 75208);
  };

  client.closePage = function () {
    callNative('关闭页面', 75204);
  }

  client.getVersion = function (callback) {
    callNative('getVersion', 75206);
  }

  client.getDeviceInfo = function (callback) {
    callNative('getDeviceInfo', 75212, callback);
  }

  client.signOut = function(callback){
    callNative('signOut', 75214, callback);
  }

  client.setupWebViewJavascriptBridge = function (callback) {
    if (window.WebViewJavascriptBridge) { return callback(WebViewJavascriptBridge); }
    if (window.WVJBCallbacks) { return window.WVJBCallbacks.push(callback); }
    window.WVJBCallbacks = [callback];
    var WVJBIframe = document.createElement('iframe');
    WVJBIframe.style.display = 'none';
    WVJBIframe.src = 'https://__bridge_loaded__';
    document.documentElement.appendChild(WVJBIframe);
    setTimeout(function () { document.documentElement.removeChild(WVJBIframe) }, 0)
  }

  return client;
});