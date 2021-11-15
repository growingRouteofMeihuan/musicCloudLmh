// pages/personal/personal.js
// 定义全局变量
let startY = 0;//手指起始坐标
let moveY = 0;//移动的坐标
let moveDistance = 0;//移动的距离
import request from "../../utils/request.js"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //移动距离
    coverTransform: "translateY(0)",
    coverTransition: " ",
    userInfo: {},
    recentPlayList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 读取用户基本信息
    let user_Info = wx.getStorageSync('userInfo');
    if (user_Info) {
      //更新用户数据状态
      this.setData({
        userInfo: JSON.parse(user_Info)
      })
      //获取用户播放记录
      this.getUserPlayList(this.data.userInfo.userId)

    }
  },
  //获取用户播放记录(避免直接将生命周期变成异步函数)
  async getUserPlayList(userId) {
    let recentList = await request("/user/record", {
      uid: userId,
      type: 1
    })
    // 需要便利的对象没有唯一值可以做key，可以自己添加一个属性(用.map)
    let index = 0;
    let recentListData = recentList.weekData.splice(0, 10).map((item) => {
      item.id = index++
      return item
    })
    this.setData({
      recentPlayList: recentListData
    })
  },
  // 个人中心内容模块滑动效果
  handleTouchStart(event) {
    startY = event.touches[0].clientY
    this.setData({ coverTransition: " " })
  },
  handleMoveStart(event) {
    moveY = event.touches[0].clientY
    moveDistance = moveY - startY;
    if (moveDistance <= 0) {
      return
    }
    if (moveDistance >= 80) {
      moveDistance = 80
    }
    this.setData({
      coverTransform: `translateY(${moveDistance}rpx)`,

    })
  },
  handleTouchEnd() {
    this.setData({
      coverTransform: `translateY(0)`,
      coverTransition: "transform 1s linear"
    })
  },
  // 跳转至登录页面
  toLogin() {
    wx.reLaunch({
      url: "/pages/login/login",
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