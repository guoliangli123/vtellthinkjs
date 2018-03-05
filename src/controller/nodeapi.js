const md5 = require('md5')
const Base = require('./base.js')

module.exports = class extends Base {
  async reportAction() {
    function generateSign(method, url, time) {
      var signstring = method + url + '?t=' + time + '&key=Rs7Fqd4lfyS8apgfqsZRlUlOpt7cK4AyMEarPQYJbVlQiHMPAUVpx8PvTo26vzYW';
      var sign = '01' + md5(signstring).toUpperCase().substr(8, 16);
      return sign;
    }

    let ts = Date.parse(new Date()) / 1000;
    const sign = generateSign('POST', '/api/reportvideo', ts)

    await this.proxy({
      uri: `${this.config('youxiApi')}/reportvideo`,
      headers: { sign, t: ts }
    })
  }

  async sayyouwantAction() {
    await this.proxy({
      uri: `${this.config('youxiApi')}/material/createMaterialAdvice`
    })
  }

  async getWechatOldUserListAction() {
    await this.proxy({
      uri: `${this.config('youxiApi')}/login/getWechatOldUserList`
    })
  }

  async applyArtificialMergeLoginInfoAction() {
    await this.proxy({
      uri: `${this.config('youxiApi')}/login/applyArtificialMergeLoginInfo`
    })
  }

  async addplaycountAction() {
    await this.proxy({
      uri: `${this.config('youxiApi')}/video/play`
    })
  }


}
