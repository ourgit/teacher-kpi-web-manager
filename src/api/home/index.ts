import request from '@/utils/request'

/**
 * 获取教师列表
 */
export function getTeacherList(){
  return request({
    url: '/v1/tk/teacher/list/',
    method: 'post'
  })
}

/**
 * 删除教师
 */
export function deleteTeacher(data:any){
  return request({
    url: '/v1/tk/teacher/delete/',
    method: 'post',
    data:data
  })
}

/**
 * 添加教师
 */
export function addTeacher(data:any){
  return request({
    url: '/v1/tk/teacher/add/',
    method: 'post',
    data:data
  })
}

export function exportPDF(params:any, config:any){
  return request({
    url: '/v1/tk/export/',
    method: 'post',
    data: params,
    responseType: 'blob',
    timeout: 120000, // 增加超时时间
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/pdf',
      ...config.headers
    },
    transformResponse: [(data) => {
      return data
    }],
    ...config
  })
}