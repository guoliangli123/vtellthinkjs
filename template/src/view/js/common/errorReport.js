import glDate from "date-library"

let appName = '';
if(process.env == 'development'){
  appName =  'vtellthinkjsTest';
}
else{
  appName = 'vtellthinkjs';
}

let defaults = {
  appName,
  msg: '',  //错误的具体信息
  url: '',  //错误所在的url
  line: '', //错误所在的行
  col: '',  //错误所在的列
  error: {}, //具体的error对象
  timeStamp: 0,//时间戳
  navigator: {
    appVersion: '',
    userAgent: '',
  }
}

let post = (url, data) => {
  let xhr = new XMLHttpRequest();
  xhr.open("POST", url, true);
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.send(data);
}

// window.addEventListener('error', function (msg, url, line, col, error) {
window.onerror = function (msg, url, line, col, error) {
  setTimeout(function () {
    defaults.url = url
    defaults.col = col || (window.event && window.event.errorCharacter) || 0
    defaults.line = line || 0
    defaults.col = col || 0
    defaults.timeStamp = new glDate().timeStamp
    defaults.navigator.appVersion = window.navigator.appVersion
    defaults.navigator.userAgent = window.navigator.userAgent
    defaults.error = {
      message:error.message || '',
      stack:error.stack || ''
    }
    
    if (error && error.stack) {
      //如果浏览器有堆栈信息，直接使用
      defaults.msg =  error.stack
    } else if (arguments.callee) {
      //尝试通过callee拿堆栈信息
      let ext = []
      let fn = arguments.callee.caller
      let floor = 3;  //这里只拿三层堆栈信息
      while (fn && (--floor > 0)) {
        ext.push(fn.toString());
        if (fn === fn.caller) {
          break;//如果有环
        }
        fn = fn.caller
      }
      ext = ext.join(",")
      defaults.msg = ext
    }

    post('/errorHandler',JSON.stringify(defaults))

  }, 0)
  return true
}