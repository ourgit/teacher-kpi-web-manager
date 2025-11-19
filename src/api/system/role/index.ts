import request from '@/utils/request'

/**
 * 获取角色列表
 */
export function getRoleList(params?: object) {
  return request({
    url: '/v1/tk/groups/',
    method: 'get',
    params: params,
  })
}

/**
 * 添加角色
 */
export function addRole(data: any) {
  return request({
    url: '/v1/tk/group/new/',
    method: 'post',
    data,
  })
}

/**
 * 更新角色
 */
export function updateRole(data: any) {
  return request({
    url: `/v1/tk/group/${data.id}/`,
    method: 'post',
    data,
  })
}

/**
 * 删除角色
 */
export function delRole(data: any) {
  return request({
    url: '/v1/tk/group/',
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
    url: `/v1/tk/actions_by_filter/${params.id}/`,
    method: 'get',
    params: {},
  })
}

/**
 * 设置角色权限
 */
export function setActionForRole(data: any) {
  return request({
    url: '/v1/tk/group_action/',
    method: 'post',
    data,
  })
}


/**
 * 获取角色菜单
 */
export function getMenuByRole(params: any) {
  return request({
    url: '/v1/tk/group_menu/',
    method: 'get',
    params
  })
}

/**
 * 设置角色菜单
 */
export function setMenuForRole(data: any) {
  return request({
    url: `/v1/tk/batch_update_menu_to_group/${data.id}/`,
    method: 'post',
    data,
  })
}