import request from '@/utils/request'

/**
 * 获取内容列表
 */
export function getContentList(data: object) {
  return request({
    url: '/v1/tk/content/list/',
    method: 'post',
    data,
  })
}

/*
 * 添加内容
 */
export function addContent(data: object) {
  return request({
    url: '/v1/tk/content/add/',
    method: 'post',
    data,
  })
}

/**
 * 更新指标
 */
export function updateContent(data: object) {
  return request({
    url: '/v1/tk/content/update/',
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