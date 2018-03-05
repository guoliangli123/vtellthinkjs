const Base = require('./base.js');

module.exports = class extends Base {
  indexAction() {
    let { platform,version } = this.ctx.query;
    if( Number(version) > 10){
      return this.display('./agreementNew'); 
    } else {
      return this.display('./agreement'); 
    }
  }
};
