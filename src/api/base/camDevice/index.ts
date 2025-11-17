import request from '@/utils/request'

//摄像头详情配置信息
export function getDeviceVideo(data: any) {
  return request({
    url: `/v1/cp/device_video/`,
    method: 'post',
    data,
  })
}

//设备信息列表
export function getDeviceList(data: any) {
  return request({
    url: `/v1/cp/cam_device_list/`,
    method: 'post',
    data,
  })
}

//添加设备信息
export function addDevice(data: any) {
  return request({
    url: '/v1/cp/cam_device/new/',
    method: 'post',
    data,
  })
}

//设备信息详情
export function getDeviceDetail(data: any) {
  return request({
    url: `/v1/cp/cam_device/${data.id}/`,
    method: 'get',
    params: {},
  })
}

//更新设备信息
export function updateDevice(data: any) {
  return request({
    url: `/v1/cp/cam_device/${data.id}/`,
    method: 'post',
    data,
  })
}

//删除设备信息
export function delDevice(data: any) {
  return request({
    url: '/v1/cp/cam_device/',
    method: 'post',
    data: {
      id: data.id,
      operation: 'del',
    },
  })
}


//监控列表
export function getDeviceVideoList(data: any) {
  return request({
    url: '/v1/cp/device_video_list/',
    method: 'post',
    data,
  })
}