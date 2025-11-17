import request from '@/utils/request'

/**
 * 获取关键字列表
 */
export function getKeywordList(data?: object) {
  return request({
    url: '/v1/cp/search_keywords_list/',
    method: 'post',
    data,
  })
}
//关键字详情
export function KeywordDetail(data: any) {
  return request({
    url: `/v1/cp/search_keywords/${data.id}/`,
    method: 'get',
    data,
  })
}
/**
 * 添加关键字
 */
export function addKeyword(data: object) {
  return request({
    url: '/v1/cp/search_keywords/new/',
    method: 'post',
    data,
  })
}

//更新关键字
export function editKeyword(data: any) {
  return request({
    url: `/v1/cp/search_keywords/${data.id}/`,
    method: 'post',
    data,
  })
}

//删除关键字
export function delKeyword(data: any) {
  return request({
    url: '/v1/cp/search_keywords/',
    method: 'post',
    data: {
      id: data.id,
      operation: 'del',
    },
  })
}
