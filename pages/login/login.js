// pages/login/login.js
/* 登录流程
1.收集表单项数据
2.前端验证
1）用户信息（账号、密码）是否合法
2）前端验证不通过，不需要发请求到后端
3）前端验证通过，发请求（携带账号密码）给服务端
3.后端验证
1）验证用户是否存在
2）用户不存在 ，告诉前端用户不存在
3）用户存在，需要验证密码是否正确
4）密码不正确，返回给前端显示密码不正确
5）密码正确，提示用户登录成功（会携带用户的相关信息*/
import request from "../../utils/request.js"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    phone: "",
    password: ""

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  //表单下内容发生改变时的行为（向事件对象传值）
  //一个事件绑定两个元素，通过id标识事件由哪个元素触发，再相应赋值
  handleInput(event) {
    //let type = event.currentTarget.id;//id传值
    let type = event.currentTarget.dataset.type;//data-key传值
    this.setData({
      //由于type名称跟需要改变的key名一致，加[],省去了判断，提高性能
      [type]: event.detail.value
    })
  },
  // 登录回调

  async login() {
    //1.收集表单项数据
    let { phone, password } = this.data;
    //2.前端验证
    //手机号验证（内容为空、格式不正确、格式正确通过验证）
    if (!phone) {
      wx.showToast({
        title: "号码不能为空",
        icon: "none"
      })
      return
    }
    //正则表达式
    let phoneReg = /^1(3|4|5|6|7|8|9)\d{9}$/;
    if (!phoneReg.test(phone)) {
      wx.showToast({
        title: "手机号不正确",
        icon: "none"
      })
      return
    }
    // 验证密码不能为空
    if (!password) {
      wx.showToast({
        title: "密码不能为空",
        icon: "none"
      })
      return
    }
    //后端验证(先判断成功的，因为失败的状态很多)
    let result = await request("/login/cellphone", { phone, password, islogin: true })
    console.log(result)
    if (result.code === 200) {
      wx.showToast({
        title: "登录成功",
        icon: "none"
      })
      //将用户的信息存储到本地
      wx.setStorageSync("userInfo", JSON.stringify(result.profile))
      //跳转到个人中心页
      wx.switchTab({
        url: '/pages/personal/personal',
      })
    } else if (result.code === 400) {
      wx.showToast({
        title: "手机号错误",
        icon: "none"
      })
    } else if (result.code === 502) {
      wx.showToast({
        title: "密码错误",
        icon: "none"
      })
    } else {
      wx.showToast({
        title: "登录失败，请重新登陆",
        icon: "none"
      })
    }
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