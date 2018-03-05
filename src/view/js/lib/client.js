function isAndroid () {
  if (window.VTellAndroidNative) {
    return true;
  }
  else {
    return false;
  }
}

function setupWebViewJavascriptBridge(callback) {
  if (window.WebViewJavascriptBridge) { return callback(WebViewJavascriptBridge); }
  if (window.WVJBCallbacks) { return window.WVJBCallbacks.push(callback); }
  window.WVJBCallbacks = [callback];
  var WVJBIframe = document.createElement('iframe');
  WVJBIframe.style.display = 'none';
  WVJBIframe.src = 'https://__bridge_loaded__';
  document.documentElement.appendChild(WVJBIframe);
  setTimeout(function () { document.documentElement.removeChild(WVJBIframe) }, 0)
}

function callIOSNative(msg, code, callback) {
  setupWebViewJavascriptBridge(function (bridge) {
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


function callNative(msg, code) {
  if (isAndroid()) {
    return new Promise((resolve,reject)=>{
      callAndroidNative(msg, code, resolve);
    })
  }
  else {
    return new Promise((resolve,reject)=>{
      callIOSNative(msg, code, resolve);
    })
  }
}

var client = {};

client.weWantYouSubmit = function () {
  return callAndroidNative('提交成功', 75200);
}

client.getToken = function () {
  return callNative('getTokenInfo', 75202);
}

client.getUserId = function () {
  return callNative('getUserId', 75210);
}

client.tokenTimeOut = function () {
  return callNative('tokenTimeOut', 75208);
};

client.closePage = function () {
  return callNative('关闭页面', 75204);
}

client.getVersion = function () {
  return callNative('getVersion', 75206);
}

client.getDeviceInfo = function () {
  return callNative('getDeviceInfo', 75212);
}

client.signOut = function () {
  return callNative('signOut', 75214);
}

export default client;
