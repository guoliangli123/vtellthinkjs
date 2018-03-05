const fs = require('fs')

const ticketApi = {
  get: function () {
    console.log('get ticket')
    let cache = {};
    try {
      cache = JSON.parse(fs.readFileSync('cache.json'));
    } catch (err) {
    }
    if (cache.ticket && cache.ticketExpiredAt > Date.now()) {
      return cache.ticket;
    } else {
      return false
    }
  },
  set: function (ticket, ticketExpiredAt, accessToken, tokenExpiredAt) {
    console.log('set ticket')
    fs.writeFileSync('cache.json', JSON.stringify({
      ticket,
      ticketExpiredAt,
      accessToken,
      tokenExpiredAt,
    }));
  }
}
module.exports = ticketApi