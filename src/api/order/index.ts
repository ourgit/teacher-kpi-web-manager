import request from '@/utils/request'

//获取订单列表
export function getOrderList(data: object) {
  return request({
    url: '/v1/cp/orders/',
    method: 'post',
    data,
  })
}

//获取订单详情
export function getOrderDetail(data: any) {
  return request({
    url: `/v1/cp/orders/${data.id}/`,
    method: 'get',
    params: {},
  })
}

//根据订单ID获取日志
export function getOrderLog(data: any) {
  return request({
    url: `/v1/cp/order_logs/${data.id}/`,
    method: 'get',
    params: {},
  })
}
