import request from '@/utils/request'

/**
 * 获取存放点列表
 */
export function getPlaceList(data?: any) {
  return request({
    url: '/v1/cp/storage_place_list/',
    method: 'post',
    data,
  })
}


/**
 * 获取存放点详情
 */
export function getPlaceDetail(data: any) {
  return request({
    url: `/v1/cp/storage_place/${data.id}/`,
    method: 'get',
    params: {},
  })
}

/**
 * 添加存放点
 */
export function addPlace(data: object) {
  return request({
    url: '/v1/cp/storage_place/new/',
    method: 'post',
    data,
  })
}

/**
 * 更新存放点信息
 */
export function updatePlace(data: any) {
  return request({
    url: `/v1/cp/storage_place/${data.id}/`,
    method: 'post',
    data,
  })
}

//删除存放点
export function delPlace(data: any) {
  return request({
    url: '/v1/cp/storage_place/',
    method: 'post',
    data: {
      id: data.id,
      operation: 'del',
    },
  })
}