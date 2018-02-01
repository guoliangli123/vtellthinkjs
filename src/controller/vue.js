const Vue = require('vue')
const {createRenderer}= require('vue-server-renderer');
const shareComponent = require('../vue_component/share');

const Base = require('./base.js');

module.exports = class extends Base {
  indexAction(){
    const app = new Vue(shareComponent);

    const renderer = createRenderer({
      template: require('fs').readFileSync(think.ROOT_PATH + '/src/view/pages/share.html', 'utf-8')
    });
    
    renderer.renderToString(app, (err, html) => {
      this.body = html;
    })
  }
};
