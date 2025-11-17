import request from '@/utils/request'

/**
 * 获取智能柜列表
 */
export function getCabinetList(data?: any) {
  return request({
    url: '/v1/cp/shop_cabinets/',
    method: 'get',
    params: data,
  })
}


/**
 * 获取智能柜详情
 */
export function getCabinetDetail(data: any) {
  return request({
    url: `/v1/cp/shop_cabinets/${data.id}/`,
    method: 'get',
    params: {},
  })
}

/**
 * 添加智能柜
 */
export function addCabinet(data: object) {
  return request({
    url: '/v1/cp/shop_cabinet/new/',
    method: 'post',
    data,
  })
}

/**
 * 更新智能柜信息
 */
export function updateCabinet(data: any) {
  return request({
    url: `/v1/cp/shop_cabinet/${data.id}/`,
    method: 'post',
    data,
  })
}

//删除智能柜
export function delCabinet(data: any) {
  return request({
    url: '/v1/cp/shop_cabinet/',
    method: 'post',
    data: {
      id: data.id,
      operation: 'del',
    },
  })
}