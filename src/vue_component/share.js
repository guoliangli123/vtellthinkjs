const testComponent = require('./common/test.js');

module.exports = {
  template: `
    <div>
      <span>{{test}}</span>
      <testComponent user='lgl'></testComponent>
    </div>
  `,
  data: {
    test: 'vue测试实例'
  },
  components:{
    testComponent,
  },
  method:{
    
  }
}