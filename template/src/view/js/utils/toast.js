if (typeof Object.assign != 'function') {
  Object.defineProperty(Object, "assign", {
    value: function assign(target, varArgs) { // .length of function is 2
      'use strict';
      if (target == null) { // TypeError if undefined or null
        throw new TypeError('Cannot convert undefined or null to object');
      }

      var to = Object(target);

      for (var index = 1; index < arguments.length; index++) {
        var nextSource = arguments[index];

        if (nextSource != null) { // Skip over if undefined or null
          for (var nextKey in nextSource) {
            // Avoid bugs when hasOwnProperty is shadowed
            if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {
              to[nextKey] = nextSource[nextKey];
            }
          }
        }
      }
      return to;
    },
    writable: true,
    configurable: true
  });
}

function toast(message, options) {
  var CLASS_ACTIVE = 'active';
  var durations = {
    long: 3000,
    short: 2000
  };
  options = Object.assign({ duration: 'short' }, options || {});
  options = options || {};
  if (typeof options.duration === 'number') {
    duration = options.duration > 0 ? options.duration : durations['short'];
  }
  else {
    duration = durations[options.duration];
  }
  if (!duration) {
    duration = durations[short];
  }
  var toastContainer = document.createElement('div');
  toastContainer.classList.add('toast-container');
  toastContainer.innerHTML = '<div class="toast-message">' + message + '</div>';
  toastContainer.addEventListener('webkitTransitionEnd', function () {
    if (!toastContainer.classList.contains(CLASS_ACTIVE)) {
      toastContainer.parentNode.removeChild(toastContainer);
      toastContainer = null;
    }
  });
  toastContainer.addEventListener('click', function () {
    toastContainer.parentNode.removeChild(toastContainer);
    toastContainer = null;
  });

  document.body.appendChild(toastContainer);
  toastContainer.offsetHeight;
  toastContainer.classList.add(CLASS_ACTIVE);

  var p = new Promise(function (resolve, reject) {
    setTimeout(function () {
      toastContainer && toastContainer.classList.remove(CLASS_ACTIVE);
      resolve('done');
    }, duration)
  })

  return p;
}

export default toast;

