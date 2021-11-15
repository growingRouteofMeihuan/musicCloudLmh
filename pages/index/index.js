// pages/index/index.js
import request from "../../utils/request"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //轮播图数据
    bannerList: [],
    //推荐歌单data
    recommmendList: [],
    //排行榜数据
    topList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    //请求轮播图数据
    let bannerData = await request("/banner", { type: 2 });
    this.setData({ bannerList: bannerData.banners })
    //获取推荐歌单对象
    let recommendData = await request("/personalized", { limit: 10 });
    this.setData({ recommmendList: recommendData.result })
    //获取推荐歌单对象
    /* 需求分析：
    1.需要index的值获取对应的数据
    2.index的取值范围时0 - 20；
    3.需要发送5次请求 */
    let index = 0
    let topResultArray = []
    while (index < 5) {
      let topData = await request("/top/list", { idx: index++ });
      let topListTtem = {
        name: topData.playlist.name,
        tracks: topData.playlist.tracks.slice(0, 3),
        id: topData.playlist.id
      }
      topResultArray.push(topListTtem)
    }
    //放在此处更新，需等待五次请求结束后，才渲染，用户体验差，可以考虑放进循环体内,
    //但是性能会变差，注意用户体验和性能
    this.setData({
      topList: topResultArray
    })
  },
  //转跳到每日推荐也页
  toRecommendSong() {
    wx.navigateTo({
      url: '/songPackage/pages/recommendSong/recommendSong'
    })
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