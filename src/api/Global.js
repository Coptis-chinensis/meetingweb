/** 环境配置 */

  // const serverSrcMQ = 'ws://127.0.0.1:61614/'
  // const domain = 'http://192.168.0.49:8081/meetingsystem'
  // const domain = 'http://192.168.0.149:8081/meetingsystem'
  const domain = 'http://192.168.0.215:8081/meetingsystem'
  // const domain = 'http://192.168.0.216:8081/meetingsystem'
  // const domain = 'http://192.168.88.16:8081/meetingsystem'
  // const domain = 'http://192.168.0.44:8081/meetingsystem'
  // const domain = 'http://172.21.62.62:8081/meetingsystem'
  // const domain = 'http://192.168.0.206:18081/meetingsystem'
  // const domain = 'http://192.168.0.188:8081/meetingsystem'
  // const domain = 'http://192.168.0.65:8081/meetingsystem'
  // const domain = 'http://127.0.0.1:8081/meetingsystem'
  const roleID = 1
  const clicktabIndex = 1
  const servertimeout = 500000
  const navIndex = 2
  const pageSize = 9
  export default {
    clicktabIndex,      // 左侧tab区点击
    // serverSrcMQ,        // 服务器地址
    pageSize,
    roleID,              // 用户登录角色
    navIndex,
    servertimeout,       // ajax超时时间设置，单位毫秒
    domain,
  }