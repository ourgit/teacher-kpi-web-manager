import request from '@/utils/request'

/**
 * 登录
 */
export function login(data: object) {
  return request({
    url: '/v1/tk/login/',
    method: 'post',
    data,
  })
}

//验证是否登录 
export function getIsLogin(data: object) {
  return request({
    url: '/v1/tk/is_login/',
    method: 'post',
    data
  })
}

//获取用户信息
export function getUserInfo() {
  return request({
    url: '/v1/tk/admin_member/info/',
    method: 'get'
  })
}

//登出
export function logout() {
  return request({
    url: '/v1/tk/logout/',
    method: 'post'
  })
}

export function getVcode(data: object) {
  return request({
    url: '/v1/user/request_vcode/',
    method: 'post',
    data
  })
}


//获取验证码
export function getCaptcha() {
  return request({
    url: '/v1/tk/captcha/gen/',
    method: 'get'
  })
}


//验证验证码
export function checkCaptcha(data:object) {
  return request({
    url: '/v1/tk/captcha/check/',
    method: 'post',
    data
  })
}

//修改登录密码
export function updatePassword(data:object) {
  return request({
    url: '/v1/tk/admin_member_password/',
    method: 'post',
    data
  })
}

//获取当前登录角色菜单
export function getRoutes() {
  return new Promise((resolve) => {
    request({
      url: '/v1/tk/member_menu/',
      method: 'get',
      params: {},
    }).then((data) => {
      resolve(data.list)
    })
  })
}
