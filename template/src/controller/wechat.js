const Base = require('./base')
const sign = require('../service/sign')
const ticketApi = require('../service/ticket')

module.exports = class extends Base {
  async indexAction() {
    // 根据自己app详情填写
    // let appId = 微信appid
    // let secret = 微信secret
    let url = this.post('url')

    let ticket = ticketApi.get()
    if (!ticket) {
      let tokenUrl = `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${appId}&secret=${secret}`

      const accessRes = await this.selfFetch({
        method: 'GET',
        uri: tokenUrl,
      })

      const accessToken = accessRes.access_token

      const tokenExpireTime = Date.now() + 7000000

      let jsApiTicketUrl = `https://api.weixin.qq.com/cgi-bin/ticket/getticket?access_token=${accessToken}&type=jsapi`

      const jsApiRes = await this.selfFetch({
        method: 'GET',
        uri: jsApiTicketUrl,
      })
      const jsApiTicket = jsApiRes['ticket']
      const ticketExpireTime = Date.now() + 7000000
      ticket = jsApiTicket

      ticketApi.set(ticket, ticketExpireTime, accessToken, tokenExpireTime)
    }

    const signInfo = sign(ticket, url)
    this.header('Content-Type', 'application/json')

    this.body = JSON.stringify({
      data: signInfo
    })

  }
}