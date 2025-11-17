import request from '@/utils/request'

/**
 * 获取版本列表
 */
export function getVesionList(params?: object) {
  return request({
    url: '/v1/cp/update_configs/',
    method: 'get',
    params: params,
  })
}

/**
 * 获取版本详情
 */
export function getVesionDetail(data: any) {
  return request({
    url: `/v1/cp/update_configs/${data.id}/`,
    method: 'get',
    params: {},
  })
}

/**
 * 添加版本
 */
export function addVesion(data: any) {
  return request({
    url: '/v1/cp/update_config/new/',
    method: 'post',
    data,
  })
}

/**
 * 更新版本
 */
export function updateVesion(data: any) {
  return request({
    url: `/v1/cp/update_config/${data.id}/`,
    method: 'post',
    data,
  })
}

//删除版本
export function delVesion(data: any) {
  return request({
    url: '/v1/cp/update_config/',
    method: 'post',
    data: {
      id: data.id,
      operation: 'del',
    },
  })
}
