import request from '@/utils/request'

/**
 * 获取文件列表
 */
export function getFileList(data: object) {
  return request({
    url: '/v1/tk/file/list/',
    method: 'post',
    data,
  })
}

/**
 * 添加文件
 */
export function addFile(data: object) {
  return request({
    url: '/v1/tk/file/add/',
    method: 'post',
    data,
  })
}

/**
 * 删除文件
 */
export function deleteFile(data: object) {
  return request({
    url: '/v1/tk/file/delete/',
    method: 'post',
    data,
  })
}