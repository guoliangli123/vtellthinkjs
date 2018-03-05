const Base = require('./base.js');

module.exports = class extends Base {
  async indexAction() {
    let videoId = this.get("videoId");
    let { platform,version } = this.ctx.query;

    //给模板赋
    this.assign({
      videoId
    });
    if( Number(version) > 10){
      return this.display('./reportNew'); 
    } else {
      return this.display('./report'); 
    }
  }
};
