import request from '@/utils/request'

/**
 * 获取智能柜门列表
 */
export function getCabinetBoxList(data?: any) {
  return request({
    url: '/v1/cp/shop_cabinet_box_list/',
    method: 'get',
    params: data,
  })
}


/**
 * 获取智能柜门详情
 */
export function getCabinetBoxDetail(data: any) {
  return request({
    url: `/v1/cp/shop_cabinets/${data.id}/`,
    method: 'get',
    params: {},
  })
}

/**
 * 添加智能柜门
 */
export function addCabinetBox(data: object) {
  return request({
    url: '/v1/cp/shop_cabinet/new/',
    method: 'post',
    data,
  })
}

/**
 * 更新智能柜门信息
 */
export function updateCabinetBox(data: any) {
  return request({
    url: `/v1/cp/shop_cabinet/${data.id}/`,
    method: 'post',
    data,
  })
}

//删除智能柜门
export function delCabinetBox(data: any) {
  return request({
    url: '/v1/cp/shop_cabinet/',
    method: 'post',
    data: {
      id: data.id,
      operation: 'del',
    },
  })
}