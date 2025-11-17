import request from '@/utils/request'

/**
 * 获取参数配置列表
 */
export function getConfigList(params?: object) {
  return request({
    url: '/v1/cp/param_config/',
    method: 'get',
    params: params,
  })
}

/**
 * 添加参数配置
 */
export function addConfig(data: any) {
  return request({
    url: '/v1/cp/param_config/new/',
    method: 'post',
    data
  })
}

/**
 * 更新参数配置
 */
export function updateConfig(data: any) {
  return request({
    url: `/v1/cp/param_config/${data.id}/`,
    method: 'post',
    data
  })
}


/**
 * 删除参数配置
 */
export function delConfig(data: any) {
  return request({
    url: '/v1/cp/param_config/',
    method: 'post',
    data: {
      id: data.id,
      operation: 'del'
    }
  })
}