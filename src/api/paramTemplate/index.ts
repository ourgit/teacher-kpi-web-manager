import request from '@/utils/request'

/**
 * 获取参数模板列表
 */
export function getParamTemplateList(params?: object) {
  return request({
    url: '/v1/cp/param_template_list/',
    method: 'get',
    params: params,
  })
}

//参数模板详情
export function getOrganDetail(data: any) {
  return request({
    url: `/v1/cp/param_template_list/${data.id}/`,
    method: 'get',
    params: {},
  })
}

/**
 * 添加参数模板
 */
export function addParamTemplate(data: any) {
  return request({
    url: '/v1/cp/param_template/new/',
    method: 'post',
    data,
  })
}

/**
 * 更新参数模板
 */
export function updateParamTemplate(data: any) {
  return request({
    url: `/v1/cp/param_template/${data.id}/`,
    method: 'post',
    data,
  })
}

/**
 * 删除参数模板
 */
export function delParamTemplate(data: any) {
  return request({
    url: '/v1/cp/param_template/',
    method: 'post',
    data: {
      id: data.id,
      operation: 'del',
    },
  })
}

/**
 * 同步参数模板
 */
export function syncParamTemplate(data?: any) {
  return request({
    url: '/v1/cp/sync_param_template/',
    method: 'post',
    data,
  })
}
