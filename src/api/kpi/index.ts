import request from '@/utils/request'

/**
 * 获取KPI列表
 */
export function getKPIList(data?: object) {
  return request({
    url: '/v1/tk/kpi/list/',
    method: 'post',
    data,
  })
}
/**
 * 获取KPI完整性
 */
export function getKPIListComlpeted(data?: object) {
  return request({
    url: '/v1/tk/kpi/is/completed/',
    method: 'post',
    data,
  })
}

/**
 * 获取KPI列表（不分页）
 */
export function getKPIListAll(data?: object) {
  return request({
    url: '/v1/tk/kpi/list/noPage/',
    method: 'post',
    data,
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
    url: '/v1/tk/kpi/update/',
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
    url: '/v1/tk/withDraw/',
    method: 'post',
    data,
  })
}

/**
 * kpi下信息的连锁查询
 */
export function getKpiWithOtherList(data: object) {
  return request({
    url: '/v1/tk/kpi/list/all/',
    method: 'post',
    data,
  })
}