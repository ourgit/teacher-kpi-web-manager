import request from '@/utils/request'

/**
 * 获取规格模板列表
 */
export function getTemplateList(params?: object) {
  return request({
    url: '/v1/cp/sku_template/',
    method: 'get',
    params: params,
  })
}

/**
 * 添加规格模板
 */
export function addTemplate(data: object) {
  return request({
    url: '/v1/cp/sku_template/new/',
    method: 'post',
    data,
  })
}

/**
 * 更新规格模板
 */
export function updateTemplate(data: any) {
  return request({
    url: `/v1/cp/sku_template/${data.id}/`,
    method: 'post',
    data,
  })
}

//删除规格模板
export function delTemplate(data: any) {
  return request({
    url: '/v1/cp/sku_template/',
    method: 'post',
    data: {
      id: data.id,
      operation: 'del',
    },
  })
}
