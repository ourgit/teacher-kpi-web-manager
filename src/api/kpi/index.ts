import request from '@/utils/request'

/**
 * 获取KPI列表
 */
export function getKPIList(data?: object) {
  return new Promise((resolve) => {
    request({
      url: '/v1/tk/getKpiList/',
      method: 'post',
      data,
    }).then((data)=>{
      resolve(data)
    })
  })
}
export function getKPIListGet(data: object) {
  return request({
    url: '/v1/tk/getKpiList/',
    method: 'get',
    data,
  })
}

export function getKPIListUserId(data: object) {
  return request({
    url: '/v1/tk/teacher/kpi/list/',
    method: 'post',
    data,
  })
}
/**
 * 添加KPI
 */
export function addKpi(data: object) {
  return request({
    url: '/v1/tk/kpi/add/',
    method: 'post',
    data,
  })
}

/**
 * 更新KPI
 */
export function updateKpi(data: object) {
  return request({
    url: '/v1/tk/update/',
    method: 'post',
    data,
  })
}

/**
 * 删除KPI
 */
export function deleteKpi(data: object) {
  return request({
    url: '/v1/tk/delete/',
    method: 'post',
    data,
  })
}

/**
 * 获取教师列表未下发
 */
export function getTeacherListNotDispatch(data: object) {
  return request({
    url: '/v1/tk/teacher/list/not/dispatch/',
    method: 'post',
    data,
  })
}

/**
 * 下发
 */
export function dispatch(data: object) {
  return request({
    url: '/v1/tk/dispatch/',
    method: 'post',
    data,
  })
}

/**
 * 获取教师列表已下发
 */
export function getTeacherListDispatch(data: object) {
  return request({
    url: '/v1/tk/dispatch/list/',
    method: 'post',
    data,
  })
}

/**
 * 撤销下发
 */
export function withDraw(data: object) {
  return request({
    url: '/v1/tk/withDraw/other/',
    method: 'post',
    data,
  })
}