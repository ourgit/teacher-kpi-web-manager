import request from '@/utils/request'

/**
 * 获取类目列表
 */
export function getItemList(data?: any) {
  return request({
    url: '/v1/cp/item_list/',
    method: 'post',
    data,
  })
}


/**
 * 获取类目详情
 */
export function getItemDetail(data: any) {
  return request({
    url: `/v1/cp/item/${data.id}/`,
    method: 'get',
    params: {},
  })
}

/**
 * 添加类目
 */
export function addItem(data: object) {
  return request({
    url: '/v1/cp/item/new/',
    method: 'post',
    data,
  })
}

/**
 * 更新类目信息
 */
export function updateItem(data: any) {
  return request({
    url: `/v1/cp/item/${data.id}/`,
    method: 'post',
    data,
  })
}

//删除类目
export function delItem(data: any) {
  return request({
    url: '/v1/cp/item/',
    method: 'post',
    data: {
      id: data.id,
      operation: 'del',
    },
  })
}