const request = require('../middleware/proxy/request');
var requestPromise = require('request-promise');

const METHOD_TYPES = {
  json: [
    'application/json',
    'application/json-patch+json',
    'application/vnd.api+json',
    'application/csp-report'
  ],
  form: [
    'application/x-www-form-urlencoded',
  ],
  text: [
    'text/plain',
    'text/xml'
  ]
}

module.exports = class extends think.Controller {
  constructor(ctx) {
    super(ctx); // 调用父级的 constructor 方法，并把 ctx 传递进去
  }
  __before() {

  }

  /**
   * 获取原始请求header
   */
  getRequestHeader() {
    let { headers, method } = this.ctx.request;
    let headersCopy = Object.assign({}, headers);
    // console.log(headersCopy)
    // 由于字段参数发生改变，content-length不再可信删除content-length字段
    delete headersCopy['content-length'];
    // 干掉请求中的if-modified-since字段，以防命中服务端缓存，返回304
    delete headersCopy['if-modified-since'];

    // 配置host，先把当前用户host存入user-host,然后把请求host赋值给headers
    headersCopy['user-host'] = headersCopy.host;

    delete headersCopy['host'];
    // result.host = uriObj.host;
    return {
      headers: headersCopy,
      method,
    }
  }

  getRequestPayload() {
    let result = {};
    console.log('原始body', this.ctx.request.body);
    if (this.ctx.request.is(METHOD_TYPES.json)) {
      // result.json = this.ctx.request.body.post
      result.json = this.ctx.request.body.post;
    } else if (this.ctx.request.is(METHOD_TYPES.form)) {
      result.form = this.ctx.request.body
    } else if (this.ctx.request.is(METHOD_TYPES.text)) {
      result.body = this.ctx.request.body
    }
    return result;
  }

  /**
   * 转发并包装请求 
   * @param {*} options {uri,method,headers} 具体参数参见 https://www.npmjs.com/package/request
   */
  proxy(options, config) {
    let origionRequestHeader = this.getRequestHeader();
    let realRequestHeaders = Object.assign({}, origionRequestHeader.headers, options.headers);
    let origionRequestPayLoad = this.getRequestPayload();

    let requestOption = Object.assign({}, origionRequestHeader, origionRequestPayLoad, options, {
      gzip: false,
      encoding: null
    })
    return request(this.ctx, requestOption, {
      callBack: (response, data) => {
        if (typeof data === 'string') {
          try {
            data = JSON.parse(data);
            response.body = data;
          } catch (err) { }
        }
        return response;
      },
      needPipeRes: true,
    });
  }

  fetch(options) {
    return requestPromise(options).then(res => {
      let response = null;
      try {
        response = JSON.parse(res);
      } catch (e) {
      }
      finally {
        return response || res;
      }
    });
  }
};
