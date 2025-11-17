import request from '@/utils/request'

/**
 * 获取指标列表
 */
export function getIndicatorList(data: object) {
  return request({
    url: '/v1/tk/getList/',
    method: 'post',
    data,
  })
}

/**
 * 添加指标
 */
export function addIndicator(data: object) {
  return request({
    url: '/v1/tk/indicator/add/',
    method: 'post',
    data,
  })
}

/**
 * 更新指标
 */
export function updateIndicator(data: object) {
  return request({
    url: '/v1/tk/update/',
    method: 'post',
    data,
  })
}

/**
 * 删除指标
 */
export function deleteKpi(data: object) {
  return request({
    url: '/v1/tk/delete/',
    method: 'post',
    data,
  })
}