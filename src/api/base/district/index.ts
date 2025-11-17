import request from '@/utils/request'

/**
 * 获取区域列表
 */
export function getDistrictList(data?: any) {
  return request({
    url: '/v1/cp/district_list/',
    method: 'post',
    data,
  })
}


/**
 * 获取区域详情
 */
export function getDistrictDetail(data: any) {
  return request({
    url: `/v1/cp/district/${data.id}/`,
    method: 'get',
    params: {},
  })
}

/**
 * 添加区域
 */
export function addDistrict(data: object) {
  return request({
    url: '/v1/cp/district/new/',
    method: 'post',
    data,
  })
}

/**
 * 更新区域信息
 */
export function updateDistrict(data: any) {
  return request({
    url: `/v1/cp/district/${data.id}/`,
    method: 'post',
    data,
  })
}

//删除区域
export function delDistrict(data: any) {
  return request({
    url: '/v1/cp/district/',
    method: 'post',
    data: {
      id: data.id,
      operation: 'del',
    },
  })
}