module.exports = class extends think.Controller{
  async indexAction(){
    let errorInfo = this.ctx.request.body.post
    
    const errorModel = this.model('error');

    let res = await errorModel.addError({...errorInfo});

    if(res){
      this.success('insert success');
    } else{
      this.error('insert error')
    }
  }
}