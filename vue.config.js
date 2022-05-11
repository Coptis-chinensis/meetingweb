/** 全局配置 */
const target = 

module.exports = {
  // 取消eslint
  lintOnSave: false,
  // 打包到相对路径
  assetsDir: "static",
  publicPath: './',
  devServer: {
    progress: false, // npm的时候是否显示进度条
  //   assetsPublicPath: '/',
  //   port: 8080,
  //   host:"localhost",
  //   proxy: {
  //     "/api":{
  //       target:'http://124.71.142.240:10000',
  //       pathRewrite: {
  //           '^/api': ''
  //       }
  //     },
  //     '/v1': {
  //       target,// 要跨域的域名
  //       changeOrigin: true, // 是否开启跨域
  //     },
  //   }
  }
}