import request from '@/utils/request'

/**
 * 获取用户列表
 */
export function getUserList(params?: object) {
  return new Promise((resolve) => {
    request({
      url: '/v1/tk/admin_members/',
      method: 'get',
      params,
    }).then((data) => {
      data.list.forEach((item: any) => {
        const groupNameList = item.groupUserList.map((item: any) => {
          return item.groupName
        })
        const groupIdList = item.groupUserList.map((item: any) => {
          return item.groupId
        })
        item.groupName = groupNameList.join(',')
        item.groupIdList = groupIdList
      })
      resolve(data)
    })
  })
}

/**
 * 添加新用户
 */
export function addUser(data: object) {
  return request({
    url: '/v1/tk/admin_member/new/',
    method: 'post',
    data,
  })
}

/**
 * 更新用户信息
 */
export function updateUser(data: any) {
  return request({
    url: `/v1/tk/admin_member/${data.id}/`,
    method: 'post',
    data,
  })
}

//删除用户
export function delUser(data: any) {
  return request({
    url: '/v1/tk/admin_member/',
    method: 'post',
    data: {
      id: data.id,
      operation: 'del',
    },
  })
}
