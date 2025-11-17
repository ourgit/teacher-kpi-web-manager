import request from '@/utils/request'


//获取机构列表
export function getOrganList(data: object) {
  return request({
    url: '/v1/cp/org_list/',
    method: 'post',
    data,
  })
}

//机构详情
export function getOrganDetail(data: any) {
  return request({
    url: `/v1/cp/org/${data.id}/`,
    method: 'get',
    params: {},
  })
}

//添加机构
export function addOrgan(data: object) {
  return request({
    url: '/v1/cp/org/new/',
    method: 'post',
    data,
  })
}


//更新机构
export function updateOrgan(data: any) {
  return request({
    url: `/v1/cp/org/${data.id}/`,
    method: 'post',
    data,
  })
}



//删除机构
export function delOrgan(data: any) {
  return request({
    url: '/v1/cp/org/',
    method: 'post',
    data: {
      id: data.id,
      operation: 'del',
    },
  })
}


