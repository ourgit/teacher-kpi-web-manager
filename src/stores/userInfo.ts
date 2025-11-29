import { defineStore } from 'pinia'
import Cookies from 'js-cookie'
import { Session } from '@/utils/storage'
import { login } from '@/api/login/index'


/**
 * 用户信息
 * @methods setUserInfos 设置用户信息
 */
export const useUserInfo = defineStore('userInfo', {
  state: (): UserInfoState => ({
    userInfos: {
      uid: '',
      token: '',
      realName: '',
      roles: ['admin'],
      authBtnList: [],
    },
  }),
  actions: {
    async setUserInfos() {
      // 存储用户信息到浏览器缓存
      if (Session.get('userInfo')) {
        this.userInfos = Session.get('userInfo')
      }
    },
    async login(loginData: any) {
      const { phone, password } = loginData
      return new Promise((resolve, reject) => {
        login({
          phone: phone.trim(),
          password: password.trim()
        }).then((response: any) => {
            if(response.role.nickName == '管理员'){
              this.userInfos.roles = ['admin']
            }
            else{
              this.userInfos.roles = ['common']
            }
            const { token, id, realName } = response
            Session.setString('token', token)
            Session.setString('uid', id)
            resolve(response)
          })
          .catch((error) => {
            reject(error)
          })
      })
      
    },
  },
})
