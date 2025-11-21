import request from '@/utils/request'

/**
 * 添加JSON
 */
export function addJson(data: object) {
  return request({
    url: '/v1/tk/type/json/add/',
    method: 'post',
    data,
  })
}

/**
 * 获取JSON列表
 */
export function getJsonList(data: object) {
  return request({
    url: '/v1/tk/type/json/list/',
    method: 'post',
    data,
  })
}

/**
 * 删除JSON
 */
export function deleteJson(data: object) {
  return request({
    url: '/v1/tk/type/json/delete/',
    method: 'post',
    data,
  })
}

