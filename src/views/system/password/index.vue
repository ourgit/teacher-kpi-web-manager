<template>
  <div class="page-container layout-padding">
    <el-card shadow="hover" class="layout-padding-auto">
      <div class="form-wrap">
        <el-form ref="formRef" :model="ruleForm" :rules="rules" size="default" label-width="90px">
          <el-row :gutter="35">
            <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
              <el-form-item label="当前密码" prop="oldPassword">
                <el-input type="password" v-model="ruleForm.oldPassword" placeholder="请输入当前密码" clearable></el-input>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
              <el-form-item label="新密码" prop="newPassword">
                <el-input type="password" v-model="ruleForm.newPassword" placeholder="请输入新密码" clearable></el-input>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
              <el-form-item label="确认密码" prop="checkPassword">
                <el-input type="password" v-model="ruleForm.checkPassword" placeholder="请输入确认密码" clearable></el-input>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20" style="text-align: center;">
              <el-button type="primary" @click="onSubmit" size="default" :loading="loading">修改</el-button>
            </el-col>
          </el-row>
        </el-form>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { reactive, toRefs, ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElForm, ElMessage } from 'element-plus'
import { updatePassword } from '@/api/login/index'
import mittBus from '@/utils/mitt'

function validatePassword(rule: any, value: any, callback: any) {
  if (value.trim() === '') {
    callback(new Error('请填写新密码'))
  } else if (value.length < 6) {
    callback(new Error('请填写最少6位的新密码'))
  } else {
    callback()
  }
}

function validateCheckPassword(rule: any, value: any, callback: any) {
  if (value.trim() === '') {
    callback(new Error('请再次输入新密码'))
  } else if (value !== state.ruleForm.newPassword) {
    callback(new Error('两次输入的密码不一致'))
  } else {
    callback()
  }
}

// 定义变量
const router = useRouter()
const formRef = ref(ElForm)
const state = reactive({
  ruleForm: {
    oldPassword: '',
    newPassword: '',
    checkPassword: '',
  },
  rules: {
    oldPassword: [
      { required: true, trigger: 'blur', message: '请填写当前密码' },
    ],
    newPassword: [
      { required: true, trigger: 'blur', validator: validatePassword },
    ],
    checkPassword: [
      { required: true, trigger: 'blur', validator: validateCheckPassword },
    ],
  },
  loading: false,
})

const { ruleForm, rules, loading } = toRefs(state)

// 提交
const onSubmit = () => {
  const ruleForm = JSON.parse(JSON.stringify(state.ruleForm))
  formRef.value.validate((valid: boolean) => {
    if (valid) {
      state.loading = true
      updatePassword(ruleForm)
        .then(() => {
          state.loading = false
          ElMessage({
            message: '修改成功',
            type: 'success',
          })
          router.push('/')
          closeCurrentTagsView()
        })
        .catch(() => {
          state.loading = false
        })
    } else {
      return false
    }
  })
}

// 关闭当前 tagsView
const closeCurrentTagsView = () => {
  const params = { contextMenuClickId: 1, ...router }
  mittBus.emit('onCurrentContextmenuClick', Object.assign({}, params))
}
</script>

<style scoped lang="scss">
.form-wrap {
  width: 300px;
  margin: 20px auto;
}
</style>
