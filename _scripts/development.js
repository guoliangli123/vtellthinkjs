const Application = require('thinkjs')
const watcher = require('think-watcher')
const path = require('path')

const instance = new Application({
  // ROOT_PATH: `../${__dirname}`,
  ROOT_PATH: path.resolve(__dirname,'../'),
  watcher: watcher,
  env: 'development'
});

instance.run();
