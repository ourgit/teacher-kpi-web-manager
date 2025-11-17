import request from '@/utils/request'
import { AnyAaaaRecord } from 'dns'


export function getShopList(data: object) {
  return request({
    url: '/v1/cp/shops/',
    method: 'post',
    data,
  })
}

export function addShop(data: object) {
  return request({
    url: '/v1/cp/shop/new/',
    method: 'post',
    data,
  })
}


export function getShopDetail(data: any) {
  return request({
    url: `/v1/cp/shop/${data.id}/`,
    method: 'get',
    params: {},
  })
}


export function delShop(data: any) {
  return request({
    url: '/v1/cp/shop/',
    method: 'post',
    data: {
      id: data.id,
      operation: 'del'
    }
  })
}

export function updateShop(data: any) {
  return request({
    url: `/v1/cp/shop/${data.id}/`,
    method: 'post',
    data,
  })
}
