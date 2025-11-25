import request from '@/utils/request'

/**
 * 获取用户列表
 */
export function getMemberList(data: object) {
  return request({
    url: '/v1/tk/user/list/',
    method: 'post',
    data,
  })
}

/**
 * 获取角色列表
 */
export function getRoleList(data: object) {
  return request({
    url: '/v1/tk/role/list/',
    method: 'post',
    data,
  })
}

/**
 * 添加用户
 */
export function addMember(data: object) {
  return request({
    url: '/v1/tk/user/new/',
    method: 'post',
    data,
  })
}


/**
 * 获取用户详情
 */
export function getMemberDetail(data: any) {
  return request({
    url: `/v1/cp/members/${data.id}/`,
    method: 'get',
    params: {},
  })
}

//锁定/解锁用户
export function setMemberStatus(data: any) {
  return request({
    url: '/v1/cp/members/status/',
    method: 'post',
    data,
  })
}

//获得用户流水记录
export function getMemberBalance(data: any) {
  return request({
    url: '/v1/cp/members/status/',
    method: 'post',
    data,
  })
}
//获得用户订单
export function getMemberOrder(data: any) {
  return request({
    url: '/v1/cp/customer_orders/',
    method: 'get',
    data,
  })
}
//修改用户详情
export function updateMember(data: any) {
  return request({
    url: `/v1/cp/members/${data.id}/`,
    method: 'post',
    data,
  })
}
//充值/扣款
export function updateBalance(data: any) {
  return request({
    url: '/v1/cp/member_balance/',
    method: 'post',
    data,
  })
}

// 添加会员等级
export function addMemberLevel(data: any) {
  return request({
    url: '/v1/cp/member_level/new/',
    method: 'post',
    data,
  })
}

// 用户等级列表
export function getLevelList(data: any) {
  return request({
    url: '/v1/cp/member_level_list/',
    method: 'get',
    data,
  })
}

// 更新用户等级配置
export function updataMemberLevel(data: any) {
  return request({
    url: `/v1/cp/member_level/${data.id}/`,
    method: 'post',
    data,
  })
}

// 用户等级配置 详情
export function getMemberLevel(data: any) {
  return request({
    url: `/v1/cp/member_level/${data.id}/`,
    method: 'get',
    data,
  })
}

// 删除用户等级配置
export function delMemberLevel(data: any) {
  return request({
    url: `/v1/cp/member_level/`,
    method: 'post',
    data,
  })
}


//获取业务员客户记录
export function getDealerCustomersList(data: any) {
  return request({
    url: '/v1/cp/dealer_customers/',
    method: 'post',
    data,
  })
}

//获取业务员客户订单列表
export function getDealerCustomersOrder(data: any) {
  return request({
    url: '/v1/cp/customer_orders/',
    method: 'get',
    params: data,
  })
}


//生成用户宣传二维码
export function generateBarcode(data: any) {
  return request({
    url: '/v1/cp/member_barcode/',
    method: 'get',
    params: data,
  })
}


//寄存列表
export function getPlaceList(data: any) {
  return request({
    url: '/v1/cp/pos/storage_list/',
    method: 'post',
    data
  })
}

//寄存明细
export function getPlaceLogList(data: any) {
  return request({
    url: '/v1/cp/pos/storage_log_list/',
    method: 'post',
    data,
  })
}

export function deleteUser(data: any){
  return request({
    url: '/v1/tk/user/delete/',
    method: 'post',
    data,
  })
}


//self
export function getLeaderTask(data: any){
  return request({
    url: '/v1/tk/get/leader/task/',
    method: 'post',
    data,
  })
}

export function addLeaderScore(data: any){
  return request({
    url: '/v1/tk/add/leader/score/',
    method: 'post',
    data,
  })
}

export function getTeacherList(){
  return request({
    url: '/v1/tk/teacher/list/',
    method: 'post'
  })
}

export function getTeacherTaskFile(data: any){
  return request({
    url: '/v1/tk/teacher/file/',
    method: 'post',
    data: data
  })
}

export function deleteTeacherTask(data: any){
  return request({
    url: '/v1/tk/teacher/task/delete/',
    method: 'post',
    data,
  })
}

export function getDepartmentList(data: any){
  return request({
    url: '/v1/tk/department/list/',
    method: 'get',
    data: data
  })
}

/**
 * 部门搜索列表
 */
export function searchDepartmentList(params?: object) {
  return request({
    url: '/v1/tk/department/searchlist',
    method: 'get',
    params,
  })
}

/**
 * 新增部门
 */
export function addDepartment(data: object) {
  return request({
    url: '/v1/tk/department/add/',
    method: 'post',
    data,
  })
}

/**
 * 更新部门
 */
export function updateDepartment(data: object) {
  return request({
    url: '/v1/tk/department/update',
    method: 'post',
    data,
  })
}

/**
 * 删除部门
 */
export function deleteDepartment(data: object) {
  return request({
    url: '/v1/tk/department/delete',
    method: 'post',
    data,
  })
}

/**
 * 校区全部列表
 */
export function getCampusList() {
  return request({
    url: '/v1/tk/campus/list/',
    method: 'get'
  })
}

/**
 * 新增校区
 */
export function addCampus(data: object) {
  return request({
    url: '/v1/tk/campus/add/',
    method: 'post',
    data,
  })
}

/**
 * 更新校区
 */
export function updateCampus(data: object) {
  return request({
    url: '/v1/tk/campus/update/',
    method: 'post',
    data,
  })
}

/**
 * 删除校区
 */
export function deleteCampus(data: object) {
  return request({
    url: '/v1/tk/campus/delete/',
    method: 'post',
    data,
  })
}