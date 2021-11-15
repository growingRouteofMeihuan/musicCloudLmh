// pages/songDetail/songDetail.js
import request from "../../../utils/request"
const appInstance = getApp()
import PubSub from 'pubsub-js'
import moment from "moment"

Page({

  /**
   * 页面的初始数据
   */
  data: {
    isplay: false,//音乐是否播放
    song: {},
    musicId: "",
    musicLInk: "",//音乐链接
    durationTime: "",//音乐总时长
    currentTime: "00:00",//当前进度
    currentWidth: 0// 实时进度条的宽度
  },

  /**
   * 生命周期函数--监听页面加载
   */
  // options用于接收路由跳转的参数
  onLoad: function (options) {
    this.setData({
      musicId: options.id
    })
    // 判断当前音乐是否在播放,在播放的是不是当前点进来的这一首，如果是，将一上来的状态
    // 播放状态设为true，
    if (appInstance.globalData.ismusicPlay && appInstance.globalData.musicId === options.id) {
      this.changePlayStatus(true)
    }
    // 获取音乐详情
    this.getSongItem(options.id)
    // 用户操作系统控制音乐播放暂停，导致系统和界面的播放状态不一致
    //所以我们要全局监听暂停和播放、暂停
    // 创建控制音乐的实例，挂在this上，全局都可以用
    this.BackgroundAudioManager = wx.getBackgroundAudioManager()
    this.BackgroundAudioManager.onPlay(() => {
      this.changePlayStatus(true)
      appInstance.globalData.musicId = options.id
    })
    this.BackgroundAudioManager.onPause(() => {
      this.changePlayStatus(false)
    })
    this.BackgroundAudioManager.onStop(() => {
      this.changePlayStatus(false)
    })
    //监听音乐的实时进度
    this.BackgroundAudioManager.onTimeUpdate(() => {
      //this.BackgroundAudioManager.currentTime单位s,
      let currentTime = moment(this.BackgroundAudioManager.currentTime * 1000).format("mm:ss")
      // 计算当前进度条长度,用百分比
      let currentWidth = (this.BackgroundAudioManager.currentTime / (this.data.song.dt / 1000)) * 100
      this.setData({ currentTime, currentWidth })
    })
    //音乐自然结束，应该走跟下一首一样的逻辑，进度条还原为0
    this.BackgroundAudioManager.onEnded(
      () => {
        this.pubsubFn("next")
        // 进度条还原
        this.setData({
          currentTime: "00:00",//当前进度
          currentWidth: 0// 实时进度条的宽度
        })
      }
    )

  },
  //修改播放状态的功能函数
  changePlayStatus(isplay) {
    this.setData({
      isplay
    })
    //修改全局播放状态
    appInstance.globalData.ismusicPlay = isplay
  },
  // 点击播放、暂停或的回调
  musicPlay() {
    let isplay = !this.data.isplay;
    // //修改是否播放状态,监控时已经修改
    // this.setData({
    //   isplay
    // })
    this.musicControl(isplay, this.data.musicLInk)
  },
  //控制音乐播放的功能函数
  async musicControl(isplay, musicLInk) {

    if (!musicLInk) {
      let musicLInk = await request("/song/url", { id: this.data.musicId })
      this.setData({ musicLInk })
    }
    //挂在this上解决跨作用域问题
    this.BackgroundAudioManager.src = this.data.musicLInk.data[0].url
    this.BackgroundAudioManager.title = this.data.song.name
    if (isplay) {//播放
      //创建控制实例
      this.BackgroundAudioManager.play()
    } else {//暂停
      this.BackgroundAudioManager.pause()
    }
  },
  // 获取歌曲详情
  async getSongItem(id) {
    let song = await request("/song/detail", { ids: id })
    //console.log(song)
    let durationTime = moment(song.songs[0].dt).format("mm:ss")
    this.setData({
      song: song.songs[0],
      durationTime//歌曲时长
    })
    wx.setNavigationBarTitle({
      title: this.data.song.name
    })

  },
  // 点击切歌,通过id判断点的是切上一首还是下一首
  handleSwitch(event) {
    let type = event.currentTarget.id
    //关闭当前播放的音乐
    this.BackgroundAudioManager.stop()
    this.pubsubFn(type)
  },
  // 封装页面通讯函数
  pubsubFn(type) {
    //订阅要发生在发布之前
    PubSub.subscribe('musicId', (msg, musicId) => {
      //console.log(musicId)
      this.setData({ musicId })
      // 获取音乐详情(图片)
      this.getSongItem(musicId)
      //请求下一首、上一首歌曲数据
      let isplay = this.data.isplay;
      //歌曲地址
      this.musicControl(isplay, "")
      //取消订阅(注意：订阅会累加，订阅一次就增加一个回调函数)，因此调完可以删掉
      PubSub.unsubscribe('musicId')
    })
    //发布的消息给歌曲推荐页面
    PubSub.publish('switchType', type);
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})