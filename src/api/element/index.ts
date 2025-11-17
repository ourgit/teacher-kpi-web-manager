import request from '@/utils/request'

/**
 * 获取要素列表
 */
export function getElementList(data: object) {
  return request({
    url: '/v1/tk/getElementList/',
    method: 'post',
    data,
  })
}

/**
 * 添加要素
 */
export function addElement(data: object) {
  return request({
    url: '/v1/tk/element/add/',
    method: 'post',
    data,
  })
}

/**
 * 更新要素
 */
export function updateElement(data: object) {
  return request({
    url: '/v1/tk/update/',
    method: 'post',
    data,
  })
}

/**
 * 删除要素
 */
export function deleteElement(data: object) {
  return request({
    url: '/v1/tk/delete/',
    method: 'post',
    data,
  })
}