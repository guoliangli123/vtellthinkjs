const Base = require('./base.js');

module.exports = class extends Base {
  async reportAction() {
    await this.proxy({
      uri:'http://youxitest.sohucs.com/api/reportvideo'
    });
  }
};
