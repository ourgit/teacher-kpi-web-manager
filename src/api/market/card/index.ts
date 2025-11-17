import request from '@/utils/request'

//获取卡券配置列表
export function getCardList(params: object) {
  return request({
    url: '/v1/cp/card_coupon_config_list/',
    method: 'get',
    params: params,
  })
}

//获取卡券详情
export function getCardDetail(data: any) {
  return request({
    url: `/v1/cp/card_coupon_config/${data.id}/`,
    method: 'get',
    params: {},
  })
}

//添加卡券
export function addCard(data: object) {
  return request({
    url: '/v1/cp/card_coupon_config/new/',
    method: 'post',
    data,
  })
}

//更新卡券
export function updateCard(data: any) {
  return request({
    url: `/v1/cp/card_coupon_config/${data.id}/`,
    method: 'post',
    data,
  })
}

//删除卡券
export function delCard(data: any) {
  return request({
    url: '/v1/cp/card_coupon_config/',
    method: 'post',
    data: {
      id: data.id,
      operation: 'del',
    },
  })
}

//用户卡券
export function mebmerCardList(data: any) {
  return request({
    url: `/v1/cp/member_card_coupons/`,
    method: 'post',
    data,
  })
}
/**
 * 批量送券
 */
export function batchGrantCard(data: any) {
  return request({
    url: '/v1/cp/batch_add_card_coupons/',
    method: 'post',
    data,
  })
}
