function merge(target, ...args) {
  args.forEach(arg => {
    for (let key in arg) {
      if (arg[key] && typeof arg[key] === 'object') {
        if(!target[key]){
          target[key] = Object.prototype.toString.call(arg[key]) == '[object Array]' ? [] : {}
        }
        merge(target[key], arg[key])
      } else {
        target[key] = arg[key];
      }
    }
  })
  return target
}

module.exports = {
  merge: merge
}