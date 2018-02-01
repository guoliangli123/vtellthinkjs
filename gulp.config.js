const path = require('path');
const fs = require('fs');

let cwd = `${__dirname}/src`;
let jsPath = `${cwd}/view/js`;

exports.path = {
  // js: `${cwd}/view/js/**/*.js`,
  js: [`${cwd}/view/js/**/*.js`,`${cwd}/view/js/vue_pages/*.vue`],
  html: `${cwd}/view/pages/*.html`,

  css:[`${cwd}/view/css/**/*.css`,`${cwd}/view/css/**/*.scss`],
  img:[`${cwd}/view/images/*`],

  //dest
  dest: `${__dirname}/www`,
  jsdest: `${__dirname}/www/static/js`,
  htmldest: `${__dirname}/www/views`,
  cssdest: `${__dirname}/www/static/css`,
  libjsdest: `${__dirname}/www/static/js/lib`,
  imgdest:`${__dirname}/www/static/images`,

  cwd: `${cwd}/view`,

  filter: {
    scss: '**/*.scss',
    js: ['**/*.js', `!**/lib/**`,'*.vue'],
  }
}

exports.webpackEntry = (function (path) {
  let getFiles = function (jspath) {
    let fileres = [];
    let dirs = fs.readdirSync(jspath);
    dirs.forEach((ele, index) => {
      if (ele == 'lib' || ele == 'vue_components') return;
      let fileInfo = fs.statSync(jspath + "/" + ele);
      if (fileInfo.isDirectory()) {
        fileres.push(...getFiles(jspath + '/' + ele));
      }
      else {
        fileres.push(jspath + "/" + ele);
      }
    })
    return fileres;
  }
  let fileList = getFiles(path);
  // console.log(fileList);
  return fileList.reduce((pre,file)=>{
    pre[file.match(/((?=\/js\/)(.*)(?=\.(js|vue)))/g)[0].substr(3)] = file;
    return pre;
  },{});
})(jsPath);

exports.debugEntrance = 'report/12312789?version=100';