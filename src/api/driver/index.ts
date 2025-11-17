import request from '@/utils/request'


//获取骑手列表
export function getDriverList(data: object) {
  return request({
    url: '/v1/cp/driver_list/',
    method: 'post',
    data,
  })
}

//骑手详情
export function getDriverDetail(data: any) {
  return request({
    url: `/v1/cp/driver/${data.id}/`,
    method: 'get',
    params: {},
  })
}

//添加骑手
export function addDriver(data: object) {
  return request({
    url: '/v1/cp/driver/new/',
    method: 'post',
    data,
  })
}


//更新骑手
export function updateDriver(data: any) {
  return request({
    url: `/v1/cp/driver/${data.id}/`,
    method: 'post',
    data,
  })
}



//删除骑手
export function delDriver(data: any) {
  return request({
    url: '/v1/cp/driver/',
    method: 'post',
    data: {
      id: data.id,
      operation: 'del',
    },
  })
}

//更新骑手配送费
export function updateDriverFee(data: any) {
  return request({
    url: `/v1/cp/driver_delivery_fee/`,
    method: 'post',
    data,
  })
}

