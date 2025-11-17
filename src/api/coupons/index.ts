import request from '@/utils/request'

//获取优惠券配置列表
export function getCouponsList(params: object) {
  return request({
    url: '/v1/cp/shop_coupon_config_list/',
    method: 'get',
    params: params,
  })
}

//获取优惠券详情
export function getCouponsDetail(data: any) {
  return request({
    url: `/v1/cp/shop_coupon_config/${data.id}/`,
    method: 'get',
    params: {},
  })
}

//添加优惠券
export function addCoupons(data: object) {
  return request({
    url: '/v1/cp/shop_coupon_config/new/',
    method: 'post',
    data,
  })
}

//更新优惠券
export function updateCoupons(data: any) {
  return request({
    url: `/v1/cp/shop_coupon_config/${data.id}/`,
    method: 'post',
    data,
  })
}

//删除优惠券
export function delCoupons(data: any) {
  return request({
    url: '/v1/cp/shop_coupon_config/',
    method: 'post',
    data: {
      id: data.id,
      operation: 'del',
    },
  })
}

//用户领取优惠券
export function userCouponsRecord(data: any) {
  return request({
    url: `/v1/cp/shop_member_coupons/`,
    method: 'post',
    data,
  })
}
/**
 * 批量送券
 */
export function batchGrantCoupons(data: any) {
  return request({
    url: '/v1/cp/shop_batch_give_member_coupons/',
    method: 'post',
    data,
  })
}
