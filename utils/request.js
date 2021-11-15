//发送ajax请求（封装功能函数、功能组件）
/* 1.封装功能函数
    1.功能点明确
    2.函数内部应保留固定代码（静态的）
    3.将动态数据抽取成参数，由使用者根据自身需求传入
    4.一个良好的函数应该设置形参的默认值（es6的形参默认值）
2.封装功能组件
    1.功能点明确
    2.组件内部保留静态代码
    3.将动态数据抽取成props参数，由使用者以标签属性形式动态传入props数据
    4.一个良好的组件应该设置组件的必要性及数据类型
    props:{
        msg:{
            required:true,
            type:string,
         }
    }
 */
//还要解决异步问题

import config from "./config"
export default (url, data = {}, method = "GET") => {
    return new Promise((resolve, reject) => {
        // 区分登录登录请求和其它请求，登录请求时，把cookies信息保存到本地
        wx.request({
            url: config.host + url,
            data,
            method,
            //判断是否有cookies
            header: {
                cookie: wx.getStorageSync('cookies') ? wx.getStorageSync('cookies').filter((item) => {
                    return item.includes("MUSIC_U")
                })[0] : ""
            },
            success: (res) => {
                resolve(res.data)
                console.log("请求成功", res)
                //判断是否为的登陆请求
                if (data.islogin) {
                    wx.setStorageSync('cookies', res.cookies);
                }
            },
            fail: (err) => {
                reject(err)
                console.log("请求失败")
            }
        })
    }
    )

}