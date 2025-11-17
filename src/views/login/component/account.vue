<template>
  <el-form ref="loginFormRef" :model="loginForm" :rules="loginRules" size="large" class="login-content-form">
    <el-form-item class="login-animation1" prop="phone">
      <el-input text placeholder="手机号" v-model="loginForm.phone" clearable autocomplete="off">
        <template #prefix>
          <el-icon class="el-input__icon">
            <ele-User />
          </el-icon>
        </template>
      </el-input>
    </el-form-item>
    <el-form-item class="login-animation2" prop="password">
      <el-input :type="isShowPassword ? 'text' : 'password'" placeholder="密码" v-model="loginForm.password" autocomplete="off">
        <template #prefix>
          <el-icon class="el-input__icon">
            <ele-Unlock />
          </el-icon>
        </template>
        <template #suffix>
          <i class="iconfont el-input__icon login-content-password" :class="isShowPassword ? 'icon-yincangmima' : 'icon-xianshimima'" @click="isShowPassword = !isShowPassword">
          </i>
        </template>
      </el-input>
    </el-form-item>
    <el-form-item class="login-animation4">
      <el-button type="primary" class="login-content-submit" round v-waves @click="handleSubmit" :loading="loading">
        <span>登 录</span>
      </el-button>
    </el-form-item>
    <!-- <login-captcha ref="loginCaptchaRef" @success="handleSubmit" /> -->
  </el-form>
</template>

<script setup lang="ts">
import { reactive, toRefs, ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElForm } from 'element-plus'
import { useUserInfo } from '@/stores/userInfo'
import LoginCaptcha from '@/components/captcha/WordClickCaptcha.vue'

function validateUserName(rule: any, value: any, callback: any) {
  if (!value) {
    callback(new Error('手机号码不能为空'))
  } else {
    const reg = /^1[3|4|5|7|8][0-9]\d{8}$/
    if (reg.test(value)) {
      callback()
    } else {
      callback(new Error('请填写正确的手机号码'))
    }
  }
}

function validatePassword(rule: any, value: any, callback: any) {
  if (value.length < 6) {
    callback(new Error('请填写最少6位数的密码'))
  } else {
    callback()
  }
}

// 定义变量内容
const router = useRouter()
const loginFormRef = ref(ElForm)
const storesUserInfo = useUserInfo()
const loginCaptchaRef = ref()

//定义变量
const state = reactive({
  isShowPassword: false,
  loading: false,
  loginForm: {
    phone: '',
    password: '',
    vcode: '',
  }, //登录表单
  loginRules: {
    phone: [
      { required: true, trigger: 'blur', validator: validateUserName },
    ],
    password: [
      { required: true, trigger: 'blur', validator: validatePassword },
    ],
  },
})

const { isShowPassword, loading, loginForm, loginRules } = toRefs(state)

// 登录
const onLogin = async () => {
  loginFormRef.value.validate((valid: boolean) => {
    if (valid) {
      loginCaptchaRef.value?.show()
    } else {
      return false
    }
  })
}

//确认登录
const handleSubmit = async (captchaId: any) => {
  state.loginForm.vcode = captchaId || ''
  state.loading = true
  storesUserInfo
    .login(state.loginForm)
    .then(() => {
      state.loading = false
      router.push('/')
    })
    .catch(() => {
      state.loading = false
    })
}
</script>

<style scoped lang="scss">
.login-content-form {
  margin-top: 20px;

  @for $i from 1 through 4 {
    .login-animation#{$i} {
      opacity: 0;
      animation-name: error-num;
      animation-duration: 0.5s;
      animation-fill-mode: forwards;
      animation-delay: calc($i/10) + s;
    }
  }

  .login-content-password {
    display: inline-block;
    width: 20px;
    cursor: pointer;

    &:hover {
      color: #909399;
    }
  }

  .login-content-code {
    width: 100%;
    padding: 0;
    font-weight: bold;
    letter-spacing: 5px;
  }

  .login-content-submit {
    width: 100%;
    letter-spacing: 2px;
    font-weight: 300;
    margin-top: 15px;
  }
}
</style>
