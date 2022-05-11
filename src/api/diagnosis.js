/** 模块 */
import request from './request'

// 系统监测
export function ask_checkService(params) {
  return request({
    url: '/syscheck/checkservice',
    method: 'get',
    params
  })
}

// 日志下载
export function ask_downLoadlog(params) {
  return request({
    url: '/syscheck/downloadlog',
    method: 'get',
    params
  })
}

// 重启相关服务
export function ask_rebootService(data) {
  return request({
    url: '/syscheck/rebootservice',
    method: 'post',
    data
  })
}
