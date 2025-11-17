import request from '@/utils/request'

/**
 * 获取轮播图列表
 */
export function getCarouselsList(data: any) {
  return request({
    url: '/v1/cp/carousels/',
    method: 'get',
    data
  })
}

/**
 * 获取轮播图详情
 */
export function getCarouselsDetail(data: any) {
  return request({
    url: `/v1/cp/carousels/${data.id}/`,
    method: 'get',
    params: {},
  })
}

/**
 * 添加轮播图
 */
export function addCarousels(data: any) {
  return request({
    url: '/v1/cp/carousels/new/',
    method: 'post',
    data,
  })
}

/**
 * 更新轮播图
 */
export function updateCarousels(data: any) {
  return request({
    url: `/v1/cp/carousels/${data.id}/`,
    method: 'post',
    data,
  })
}

//删除轮播图
export function delCarousels(data: any) {
  return request({
    url: '/v1/cp/carousels/',
    method: 'post',
    data: {
      id: data.id,
      operation: 'del',
    },
  })
}
