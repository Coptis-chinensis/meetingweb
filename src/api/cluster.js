/** 模块 */
import request from './request'

// 获取音频信息
export function ask_findClusterAll(params) {
  return request({
    url: '/cluster/findall',
    method: 'get',
    params
  })
}

// 开始录音
export function ask_recordCluster(data) {
  return request({
    url: '/cluster/recordcluster',
    method: 'POST',
    data
  })
}

// 结束录音
export function ask_endRecord(data) {
  return request({
    url: '/cluster/endrecord',
    method: 'POST',
    data
  })
}

// 取消录音
export function ask_cancelRecord(data) {
  return request({
    url: '/cluster/cancelrecord',
    method: 'POST',
    data
  })
}

// 向网关发送创建声纹对象消息
export function ask_addCluster(data) {
  return request({
    url: '/cluster/addcluster',
    method: 'POST',
    data
  })
}

// 更新声纹对象
export function ask_update(data) {
  return request({
    url: '/cluster/update',
    method: 'POST',
    data
  })
}

// 搜索声纹对象列表
export function ask_findAll(params) {
  return request({
    url: '/cluster/findall',
    method: 'GET',
    params
  })
}

// 删除声纹对象
export function ask_deleteCluster(data) {
  return request({
    url: '/cluster/delete',
    method: 'POST',
    data
  })
}

// 删除音频
export function ask_deleteVoice(data) {
  return request({
    url: '/cluster/deletevoice',
    method: 'POST',
    data
  })
}

// 训练声纹
export function ask_trialCluster(data) {
  return request({
    url: '/cluster/trialcluster',
    method: 'POST',
    data
  })
}

// 创建声纹对象
export function ask_registCluster(data) {
  return request({
    url: '/cluster/registcluster',
    method: 'POST',
    data
  })
}

// 查询声纹对象对应的音频列表
export function ask_getClusterVoiceInfo(params) {
  return request({
    url: '/cluster/getclustervoiceinfo',
    method: 'GET',
    params
  })
}

// 获取音频的地址
export function ask_getVoice(data) {
  return request({
    url: '/cluster/getvoice',
    method: 'POST',
    data
  })
}

// 上传文件
export function ask_uploadFile(data) {
  return request({
    url: '/cluster/uploadfile',
    method: 'POST',
    data
  })
}

// 获取声纹人员
export function ask_findClusterList(params) {
  return request({
    url: '/cluster/findclusterlist',
    method: 'GET',
    params
  })
}

// 选择好声纹对象后添加
export function ask_addVoicePrint(data) {
  return request({
    url: '/cluster/addvoiceprint',
    method: 'POST',
    data
  })
}

// 更新声纹库
export function ask_updateDb(data) {
  return request({
    url: '/cluster/updatedb',
    method: 'post',
    data
  })
}

// 查找当前用户是否创建了声纹库
export function ask_findClusterdbList(params) {
  return request({
    url: '/cluster/findclusterdblist',
    method: 'get',
    params
  })
}

// 删除空白声纹
export function ask_deleteUnreg(data) {
  return request({
    url: '/cluster/deleteunreg',
    method: 'post',
    data
  })
}

// 添加声纹库
export function ask_addClusterdbr(data) {
  return request({
    url: '/cluster/addclusterdb',
    method: 'post',
    data
  })
}

// 一键禁用/复原
export function ask_setAllDisable(data) {
  return request({
    url: '/cluster/setAllDisable',
    method: 'post',
    data
  })
}
