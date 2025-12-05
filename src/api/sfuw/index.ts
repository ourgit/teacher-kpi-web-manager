import request from '@/utils/request'

/**
 * 获取标准列表
 */
export function getStandardList(data?: object) {
  return request({
    url: '/v1/tk/standard/list/',
    method: 'post',
    data,
  })
}

/**
 * 添加标准
 */
export function addStandard(data: object) {
  return request({
    url: '/v1/tk/standard/add/',
    method: 'post',
    data,
  })
}

/**
 * 更新标准
 */
export function updateStandard(data: object) {
  return request({
    url: '/v1/tk/standard/update/',
    method: 'post',
    data,
  })
}

/**
 * 删除标准
 */
export function deleteStandard(data: object) {
  return request({
    url: '/v1/tk/standard/delete/',
    method: 'post',
    data,
  })
}

