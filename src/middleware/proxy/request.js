const Request = require('request');
const noop = ()=>{};
module.exports = function request(ctx,options,callback=noop){
  // 获取request参数
  let opt = Object.assign({
    gzip: true, //是否gzip
    timeout: 15000 // 超时时间
  }, options);

  function requestWrapper(resolve){
    return Request(opt,(error,response,body)=>{
      // console.log('返回response',response)
      // console.log('返回body',body);
      // console.log(response,body);
      let status = response && response.statusCode || 'NULL';
      resolve(callback(response,body || error));
    })
  }

  return new Promise((resolve,reject) => {
    let proxyRequest = requestWrapper(resolve);
    proxyRequest.pipe(ctx.res);
  })

}