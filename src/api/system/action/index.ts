import request from '@/utils/request'

/**
 * 获取权限列表
 */
export function getActionList(params?: object) {
  return new Promise((resolve) => {
    request({
      url: '/v1/tk/actions/',
      method: 'get',
      params,
    }).then((data) => {
      var list = []
      for (var key in data) {
        if (key === 'code') {
          continue
        }
        var children = data[key]
        children.forEach((item: any) => {
          item.title = item.actionDesc + '(' + item.actionName + ')'
          item.top = false
        })
        list.push({
          title: data[key][0].moduleDesc,
          top: true,
          id: list.length,
          children,
        })
      }
      data.list = list
      resolve(data)
    })
  })
}

/**
 * 获取权限详情
 */
export function getActionDetail(data: any) {
  return request({
    url: `/v1/tk/action/${data.id}/`,
    method: 'get',
    params: {},
  })
}

/**
 * 添加权限
 */
export function addAction(data: any) {
  return request({
    url: '/v1/tk/action/new/',
    method: 'post',
    data,
  })
}

/**
 * 更新权限
 */
export function updateAction(data: any) {
  return request({
    url: `/v1/tk/action/${data.id}/`,
    method: 'post',
    data,
  })
}

/**
 * 删除权限
 */
export function delAction(data: any) {
  return request({
    url: '/v1/tk/action/',
    method: 'post',
    data: {
      id: data.id,
      operation: 'del',
    },
  })
}
