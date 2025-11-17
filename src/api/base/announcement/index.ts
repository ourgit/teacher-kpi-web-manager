import request from '@/utils/request'

/**
 * 获取公告列表
 */
export function getAnnouncementList(data?: any) {
  return request({
    url: '/v1/cp/announcement_list/',
    method: 'post',
    data,
  })
}


/**
 * 获取公告详情
 */
export function getAnnouncementDetail(data: any) {
  return request({
    url: `/v1/cp/announcement/${data.id}/`,
    method: 'get',
    params: {},
  })
}

/**
 * 添加公告
 */
export function addAnnouncement(data: object) {
  return request({
    url: '/v1/cp/announcement/new/',
    method: 'post',
    data,
  })
}

/**
 * 更新公告信息
 */
export function updateAnnouncement(data: any) {
  return request({
    url: `/v1/cp/announcement/${data.id}/`,
    method: 'post',
    data,
  })
}

//删除公告
export function delAnnouncement(data: any) {
  return request({
    url: '/v1/cp/announcement/',
    method: 'post',
    data: {
      id: data.id,
      operation: 'del',
    },
  })
}