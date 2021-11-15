// pages/video/video.js
import request from "../../utils/request.js"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    navList: [],//导航栏标签数据
    navId: "",
    videoList: [],//视频数据
    playVideoId: "", //播放视频的的id
    updatePlayTime: [],//记录播放时间
    istriggered: false//下拉刷新是否触发
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    this.getNavData();

  },
  //跳转至搜索页面
  toSearch() {
    wx.navigateTo({
      url: '/pages/search/search'
    })
  },
  // 获取导航栏数据
  async getNavData() {
    let navdata = await request("/video/group/list")
    //console.log(data)
    this.setData({
      navList: navdata.data.slice(0, 14),
      navId: navdata.data.slice(0, 14)[0].id
    })
    // 确保是拿到navId再取视频数据
    this.getVideoLiatData(this.data.navId)
  },
  //切换导航栏样式，同时更新视频
  changeNavFn(event) {
    console.log(event)
    let id = event.currentTarget.id;
    this.setData({
      navId: id,
      //清空原视频数据
      videoList: []
    })
    // 提示用户正在加载
    wx.showLoading({
      title: "正在加载"
    })
    //动态获取视频数据
    this.getVideoLiatData(this.data.navId)
  },
  // 获取视频列表数据
  async getVideoLiatData(navid) {
    let videoData = await request("/video/group", {
      id: navid
    })
    let videoId = 0;
    this.setData({
      videoList: videoData.datas.map((item) => {
        item["id"] = videoId++;
        return item
      })
    })
    //关闭消息加载提示框
    wx.hideLoading()
    // 关闭下拉刷新
    this.setData({ istriggered: false })
  },
  //点击播放、继续播放回调
  handlePlay(event) {
    // 需求：
    // 1.在点击下一个播放视频前，找到上一个播放的视频
    // 2.在播放之前关掉上一个视频

    /*  let videoId = event.currentTarget.id;
     if (!this.data.playVideoId) {
       // 处理第一次，如果为空，只赋值保留本次播放的视频id
       this.setData({
         playVideoId: videoId
       })
     } else {
       // 不为空，判断是不是同一个视频，是的话，不执行，不是才执行，停止上一次视频
       if (videoId != this.data.playVideoId) {
         //创建控制video标签的实例
         let vedioContext = wx.createVideoContext(this.data.playVideoId);
         vedioContext.pause()
         // 然后重置用本次播放的视频id替代上一次的视频id
         this.setData({
           playVideoId: videoId
         })
       }
 
     } */

    // 使用单例模式：始终需要创建多个对象的场景下，通过一个变量接收，始终保持只有一个对象
    let videoId = event.currentTarget.id;

    //  if (this.videoId != videoId) {
    //    if (this.vedioContext) {
    //      this.vedioContext.stop
    //    }
    //  }
    //以上判断的简化写法
    this.videoId != videoId && this.vedioContext && this.vedioContext.stop();
    this.videoId = videoId;
    // 控制图片
    this.setData({
      playVideoId: videoId
    })
    this.vedioContext = wx.createVideoContext(videoId)
    // 判断此前是否有播放记录，如果有，转跳指定位置，如果没有从头播放
    let { updatePlayTime } = this.data;
    let item = updatePlayTime.find((item) => { return item.vid === videoId })
    if (item) {
      this.vedioContext.seek(item.currentTime)
    } else { this.vedioContext.play() }

  },
  //监听视频播放进度的回调
  handleTimeupdate(event) {
    let videoTimeObj = {
      vid: event.currentTarget.id,
      currentTime: event.detail.currentTime
    }
    // 要判断播放时长数组中，是否有记录
    // 如果有
    let { updatePlayTime } = this.data;
    let videoItem = updatePlayTime.find(item => item.vid === videoTimeObj.vid)
    if (videoItem) {//之前有，更新时间
      videoItem.currentTime = videoTimeObj.currentTime
    } else {//之前没有,push进去
      updatePlayTime.push(videoTimeObj)
    }
    // 更新updatePlayTime状态
    this.setData({
      updatePlayTime
    })
  },
  //视频播放结束，删除时长记录
  handleEnd(event) {

    let vid = event.currentTarget.id
    let { updatePlayTime } = this.data;
    let index = updatePlayTime.findIndex(item => { return item.vid == vid })
    updatePlayTime.splice(index, 1)
    this.setData({ updatePlayTime })
  },
  //自定义下拉刷新回调
  handleRefresh() {
    // 获取新的数据
    this.getVideoLiatData(this.data.navId)
  },
  //自定义上拉触底针对scroll-view的，刷新回调
  handlePullDown() {
    // 数据分页：1.后端分页，2前端分页
    console.log("发送请求|或截取数据")
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    console.log("上拉触底")
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function ({ from, target }) {
    //区分按了哪个分享按钮，做不同的处理
    console.log(from, target)
    if (from === "button") {
      return {
        title: "来自button转发内容",
        path: "/pages/video/video",
        imageUrl: "/static/images/nvsheng.jpg"
      }
    }
    if (from === "menu") {
      return {
        title: "来自menu的转发内容",
        path: "/pages/index/index",
        imageUrl: "/static/images/nvsheng.jpg"
      }
    }

  }
})