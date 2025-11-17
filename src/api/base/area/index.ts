import request from '@/utils/request'

/**
 * 获取校区列表
 */
export function getAreaList(data?: any) {
  return request({
    url: '/v1/cp/area_list/',
    method: 'post',
    data,
  })
}


/**
 * 获取校区详情
 */
export function getAreaDetail(data: any) {
  return request({
    url: `/v1/cp/area/${data.id}/`,
    method: 'get',
    params: {},
  })
}

/**
 * 添加校区
 */
export function addArea(data: object) {
  return request({
    url: '/v1/cp/area/new/',
    method: 'post',
    data,
  })
}

/**
 * 更新校区信息
 */
export function updateArea(data: any) {
  return request({
    url: `/v1/cp/area/${data.id}/`,
    method: 'post',
    data,
  })
}

//删除校区
export function delArea(data: any) {
  return request({
    url: '/v1/cp/area/',
    method: 'post',
    data: {
      id: data.id,
      operation: 'del',
    },
  })
}