const Base = require('./base.js');

module.exports = class extends Base {
  indexAction() {
    return this.display('./index');
  }
  testAction(){
    return this.display('./oo/test');
  }
  test2Action(){
    return this.display('./oo/test2');
  }
};
