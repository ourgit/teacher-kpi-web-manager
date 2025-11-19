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