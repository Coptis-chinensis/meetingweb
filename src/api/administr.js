/** 模块 */
import request from './request'

// 获取过滤词库列表
export function ask_getList(params) {
  return request({
    url: '/tabooword/list',
    method: 'get',
    params
  })
}

// 查询日志
export function ask_search(data) {
  return request({
    url: '/syslog/search',
    method: 'post',
    data
  })
}

// 查询采集器列表
export function ask_findAllMicIsOnline(params) {
  return request({
    url: '/mic/findallmicisonline',
    method: 'get',
    params
  })
}

// 更新设备信息
export function ask_updateDevice(data) {
  return request({
    url: '/mic/update',
    method: 'post',
    data
  })
}

// 获取转写状态
export function ask_tranferFileStatus(params) {
  return request({
    url: '/keyValueMap/transferfilestatus',
    method: 'get',
    params
  })
}

// 查询设备列表
export function ask_findAll(params) {
  return request({
    url: '/mic/findall',
    method: 'get',
    params
  })
}

// 本地导入
export function ask_upload(data) {
  return request({
    url: '/tabooword/upload',
    method: 'post',
    data
  })
}

// 删除
export function ask_delete(data) {
  return request({
    url: '/tabooword/delete',
    method: 'post',
    data
  })
}

// 添加词汇
export function ask_save(data) {
  return request({
    url: '/tabooword/save',
    method: 'post',
    data
  })
}

// 编辑词汇
export function ask_update(data) {
  return request({
    url: '/tabooword/update',
    method: 'post',
    data
  })
}

// 
export function ask_compareVoiceByPcm(params) {
  return request({
    url: '/keyValueMap/compareVoiceByPcm',
    method: 'get',
    params
  })
}

export function ask_config(params) {
  return request({
    url: '/config',
    method: 'get',
    params
  })
}

// 删除设备
export function ask_deleteMic(data) {
  return request({
    url: '/mic/delete',
    method: 'post',
    data
  })
}