// pages/search/search.js
import request from "../../utils/request.js"

Page({
  /**
   * 页面的初始数据
   */
  data: {
    placehoder: "",
    hotlist: [],//获取热搜列表
    inputValue: "",
    searchList: [],//模糊匹配的数据
    searchHistory: []//搜索历史记录
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.isSend = false//this身上绑定一个this.isSend，用于判断是否已发请求
    this.getInitData()//初始化placehoder的值
    this.getHotlist()//获取hotlist
    this.gethistory()//获取搜索记录
  },
  //获取placehoder默认数据
  async getInitData() {
    let placehoderDta = await request("/search/default");
    this.setData({
      placehoder: placehoderDta.data.showKeyword
    })
  },
  //获取热搜列表
  async getHotlist() {

    let hotListData = await request("/search/hot/detail");
    this.setData({
      hotlist: hotListData.data
    })
  },
  //清空搜索框
  clearInputValue() {
    this.setData({
      inputValue: "",
      searchList: []
    })
  },
  //删除历史记录
  clearHistory() {
    wx.showModal({
      title: '你真的要删除历史记录吗',
      success: (res) => {
        if (res.confirm) {
          // 清空历史记录data、移除本地历史记录
          this.setData({ searchHistory: [] });
          wx.removeStorageSync("searchHistory")
        }
      },

    })
  },

  //表单内容发生改变是都回调
  inputData(event) {
    console.log("input", event)
    //更新input的状态数据
    this.setData({
      inputValue: event.detail.value.trim()
    })
    //如果清除输入框内容，search的内容也应该清掉
    if (!this.data.inputValue) {
      this.setData({
        searchList: []
      })
      return
    }
    if (event.type === "input") {
      // 函数节流:每300ms发送一次请求
      if (this.isSend) {//请求已发
        return
      }
      this.isSend = true//如果没有发，重置为true
      // 发请求获取数据模糊匹配
      this.getSearchList()
      let sendTime = setTimeout(() => {
        this.isSend = false//300ms以后重置为false，就可以发送下一次了
        clearTimeout("sendTime")
      }, 3000)
    }
    if (event.type === "change") {//失去焦点，再发一次请求并添加进历史记录
      this.getSearchList();
      //增加到本地历史记录
      this.addhistory()

    }

  },
  //添加历史记录
  addhistory() {
    //添加搜索历史记录(存到本地),确保时唯一值
    let { inputValue, searchHistory } = this.data;
    if (searchHistory.includes(inputValue)) {//如果已经有了，删除掉
      searchHistory.splice(searchHistory.indexOf(inputValue), 1)
    }
    //将搜索词加入
    searchHistory.unshift(inputValue)
    wx.setStorageSync('searchHistory', searchHistory)
    this.gethistory()//获取本地历史记录,更新至页面
  },
  //获取本地历史记录,更新至页面
  gethistory() {
    let searchHistory = wx.getStorageSync('searchHistory')
    if (searchHistory) {
      this.setData({
        searchHistory
      })
    }
  },
  // 发请求获取数据模糊匹配
  async getSearchList() {
    if (!this.data.inputValue) {
      return
    }//输入内容为空时不发请求
    let searchListData = await request("/search", { keywords: this.data.inputValue, limit: 10 })
    this.setData({
      searchList: searchListData.result.songs
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