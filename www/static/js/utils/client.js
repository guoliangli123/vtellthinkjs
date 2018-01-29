/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 5);
/******/ })
/************************************************************************/
/******/ ({

/***/ 0:
/***/ (function(module, exports) {

module.exports = function(module) {
	if(!module.webpackPolyfill) {
		module.deprecate = function() {};
		module.paths = [];
		// module.parent = undefined by default
		if(!module.children) module.children = [];
		Object.defineProperty(module, "loaded", {
			enumerable: true,
			get: function() {
				return module.l;
			}
		});
		Object.defineProperty(module, "id", {
			enumerable: true,
			get: function() {
				return module.i;
			}
		});
		module.webpackPolyfill = 1;
	}
	return module;
};


/***/ }),

/***/ 5:
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(module) {

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

;(function (global, factory) {
  "use strict";

  if (( false ? "undefined" : _typeof(module)) === "object" && _typeof(module.exports) === "object") {
    module.exports = factory();
  } else {
    global.vTellClient = factory();
  }
})(typeof window !== "undefined" ? window : undefined, function () {
  "use strict";

  function callIOSNative(msg, code, callback) {
    client.setupWebViewJavascriptBridge(function (bridge) {
      bridge.callHandler('ObjC Echo', { msg: msg, code: code }, function responseCallback(response) {
        if (typeof callback === 'function') {
          callback(parseResponse(response));
        }
      });
    });
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
    } else {
      callIOSNative(msg, code, callback);
    }
  }

  function parseResponse(res) {
    var json;
    try {
      json = JSON.parse(res);
    } catch (e) {
      json = {};
    }
    return json && json.msg || null;
  }

  var client = {};

  client.isAndroid = function () {
    if (window.VTellAndroidNative) {
      return true;
    } else {
      return false;
    }
  };

  client.weWantYouSubmit = function () {
    return callAndroidNative('提交成功', 75200);
  };

  client.getToken = function (callback) {
    callNative('getTokenInfo', 75202, callback);
  };

  client.getUserId = function (callback) {
    callNative('getUserId', 75210, callback);
  };

  client.tokenTimeOut = function () {
    callNative('tokenTimeOut', 75208);
  };

  client.closePage = function () {
    callNative('关闭页面', 75204);
  };

  client.getVersion = function (callback) {
    callNative('getVersion', 75206);
  };

  client.getDeviceInfo = function (callback) {
    callNative('getDeviceInfo', 75212, callback);
  };

  client.signOut = function (callback) {
    callNative('signOut', 75214, callback);
  };

  client.setupWebViewJavascriptBridge = function (callback) {
    if (window.WebViewJavascriptBridge) {
      return callback(WebViewJavascriptBridge);
    }
    if (window.WVJBCallbacks) {
      return window.WVJBCallbacks.push(callback);
    }
    window.WVJBCallbacks = [callback];
    var WVJBIframe = document.createElement('iframe');
    WVJBIframe.style.display = 'none';
    WVJBIframe.src = 'https://__bridge_loaded__';
    document.documentElement.appendChild(WVJBIframe);
    setTimeout(function () {
      document.documentElement.removeChild(WVJBIframe);
    }, 0);
  };

  return client;
});
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(0)(module)))

/***/ })

/******/ });
//# sourceMappingURL=client.js.map