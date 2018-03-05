const Application = require('thinkjs');
const path = require('path');

const instance = new Application({
  ROOT_PATH: path.resolve(__dirname,'../'),
  proxy: true, // use proxy
  env: 'production'
});

instance.run();
