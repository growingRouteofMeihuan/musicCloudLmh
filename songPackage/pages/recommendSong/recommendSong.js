// pages/recommendSong/recommendSong.js
import request from "../../../utils/request.js"
import PubSub from 'pubsub-js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    day: "",
    month: "",
    recommendLIst: [],
    index: ""// 点击音乐的下标

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    //判断用户是否登录，未登录，直接转跳到登录界面
    let userInfo = wx.getStorageSync('userInfo');
    if (!userInfo) {
      wx.showToast({
        title: "请先登录",
        icon: none,
        success: () => {
          wx.reLaunch({
            url: '/pages/login/login',
          })
        }
      })

    } else {
      // 已登录，更新数据
      //更新日期数据
      this.setData({
        day: new Date().getDate(),
        month: new Date().getMonth() + 1
      });
      //console.log("xxx")
      this.getrecommendLIst()
    }
    //订阅来自歌曲页面发布的消息
    PubSub.subscribe('switchType', (msg, type) => {
      console.log(msg, type);
      let { recommendLIst, index } = this.data
      if (type === "pre") {//如果是上一首,
        // 考虑临界值,如果已经是第一首，按了下一首，就让它切到最后一首
        (index === 0) && (index = recommendLIst.length);
        index -= 1;
      } else {//下一首
        // 考虑临界值，如果最后一首，让它到第一首
        (index === recommendLIst.length - 1) && (index = -1);
        index += 1
      }
      // 切歌了songdetail正在播放的歌曲的index也该改变
      this.setData({ index })
      let musicId = recommendLIst[index].id
      //将音乐id回传给songDetail页面
      PubSub.publish('musicId', musicId);
    });
  },
  //获取推荐歌曲
  async getrecommendLIst() {
    let recommendLIst = await request("/recommend/songs");
    this.setData({
      recommendLIst: recommendLIst.recommend
    })
  },
  // 路由转跳到歌曲详情页
  toSongDetail(event) {
    //接收事件对象传回来的数据
    let { songitem, index } = event.currentTarget.dataset
    this.setData({
      index
    })
    // 路由传参上的数据不能时对象，只能是字符串或json对象，
    //且query传参有长度限制,参数长度过长会截断，导致传过去的数据不完整
    wx.navigateTo({
      url: '/songPackage/pages/songDetail/songDetail?id=' + songitem.id
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