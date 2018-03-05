const Base = require('./base.js');

module.exports = class extends Base {
  async sharevideoAction() {
    const videoId = this.get('videoId');

    console.log('执行share控制器')

    const data = await this.selfFetch({
      uri: `${this.config('youxiApi')}/getShareVideInfo`,
      method: 'POST',
      headers: {
        'content-type': 'application/json'
      },
      body: JSON.stringify({ videoId }),
    });

    const recommendList = data.hotVideoList;
    const topVideoList = data.topVideoList;
    const videoInfo = data.videoInfo;
    const verified = videoInfo && videoInfo.verified ? data.videoInfo.verified : 0;
    const videoTitle = videoInfo && videoInfo.caption || '有戏短视频';
    const thumbnailUrl = videoInfo.staticCoverUrl;
    const aspectRatio = videoInfo.playInfos[0].width / videoInfo.playInfos[0].height;
    let arr = thumbnailUrl.split('/');
    arr.splice(3, 1, 'c_cut,g_center,w_300,h_300');
    var shareImgUrl = arr.join('/');

    const shareInfo = {};
    shareInfo.shareImgUrl = shareImgUrl;
    shareInfo.appMessageTitle = `@${videoInfo.author.authorName}发布了一个有戏短视频，快来瞅瞅Ta和哪个爱豆在对戏~`;
    shareInfo.weiboMessageTitle = `#有戏#灯光师看这里,@${videoInfo.author.authorName}正在和爱豆同框对戏，快来瞅瞅~`;
    shareInfo.appMessageDesc = `灯光师看这里，@${videoInfo.author.authorName}讲了个惊天大八卦，快来瞅瞅`;
    shareInfo.timelineTitle = `@${videoInfo.author.authorName}发布了一个有戏短视频，快来瞅瞅Ta和哪个爱豆在对戏~`;

    this.assign({
      title: videoTitle,
      videoInfo,
      recommendList,
      videoId,
      verified,
      topVideoList,
      shareInfo,
      aspectRatio
    })

    this.display('./share')
  }
}
