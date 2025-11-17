import request from '@/utils/request'

/**
 * 获取区域列表
 */
export function getRegionList(data?: any) {
  return request({
    url: '/v1/cp/shop_place_list/',
    method: 'post',
    data,
  })
}


/**
 * 获取区域详情
 */
export function getRegionDetail(data: any) {
  return request({
    url: `/v1/cp/shop_place/${data.id}/`,
    method: 'get',
    params: {},
  })
}

/**
 * 添加区域
 */
export function addRegion(data: object) {
  return request({
    url: '/v1/cp/shop_place/new/',
    method: 'post',
    data,
  })
}

/**
 * 更新区域信息
 */
export function updateRegion(data: any) {
  return request({
    url: `/v1/cp/shop_place/${data.id}/`,
    method: 'post',
    data,
  })
}

//删除区域
export function delRegion(data: any) {
  return request({
    url: '/v1/cp/shop_place/',
    method: 'post',
    data: {
      id: data.id,
      operation: 'del',
    },
  })
}

/**
 * 获取配送费列表
 */
export function getDeliveryFeeList(data?: any) {
  return request({
    url: '/v1/cp/delivery_fee_list/',
    method: 'post',
    data,
  })
}

/**
 * 设置配送费
 */
export function setDeliveryFee(data?: any) {
  return request({
    url: '/v1/cp/batch_add_delivery_fee/',
    method: 'post',
    data,
  })
}