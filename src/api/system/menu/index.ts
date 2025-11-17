import request from '@/utils/request'

/**
 * 获取菜单列表
 */
export function getMenuList(params?: object) {
  return request({
    url: '/v1/cp/menu/',
    method: 'get',
    params: params,
  })
}

/**
 * 添加菜单
 */
export function addMenu(data: any) {
  return request({
    url: '/v1/cp/menu/new/',
    method: 'post',
    data,
  })
}

/**
 * 更新菜单
 */
export function updateMenu(data: any) {
  return request({
    url: `/v1/cp/menu/${data.id}/`,
    method: 'post',
    data,
  })
}

/**
 * 删除角色
 */
export function delMenu(data: any) {
  return request({
    url: '/v1/cp/menu/',
    method: 'post', 
    data: {
      id: data.id,
      operation: 'del',
    },
  })
}

/**
 * 获取角色权限
 */
export function getActionByRole(params: any) {
  return request({
    url: `/v1/cp/actions_by_filter/${params.id}/`,
    method: 'get',
    params: {},
  })
}

/**
 * 设置角色权限
 */
export function setActionForRole(data: any) {
  return request({
    url: '/v1/cp/group_action/',
    method: 'post',
    data,
  })
}



