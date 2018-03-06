const Request = require('request');
const noop = ()=>{};
module.exports = function request(ctx,options,config){
  // 获取request参数
  let opt = Object.assign({
    gzip: true, //是否gzip
    timeout: 15000 // 超时时间
  }, options);

  function requestWrapper(resolve){
    return Request(opt,(error,response,body)=>{
      resolve(config.callBack(response,body || error));
    })
  }

  return new Promise((resolve,reject) => {
    let proxyRequest = requestWrapper(resolve);
    if(config.needPipeRes){
      proxyRequest.pipe(ctx.res);
    }
  })
}