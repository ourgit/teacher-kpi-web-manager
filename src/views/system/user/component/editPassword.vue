<template>
  <div class="dialog-container">
    <el-dialog title="修改管理员密码" v-model="isShowDialog" width="500px" :close-on-click-modal="false" :destroy-on-close="true">
      <el-form ref="dialogFormRef" :model="ruleForm" :rules="rules" size="default" label-width="120px">
        <el-row :gutter="35">
          <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
            <el-form-item label="用户名">
              {{userInfo.userName}}
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
            <el-form-item label="用户昵称">
              {{userInfo.realName}}
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
            <el-form-item label="登录密码" prop="loginPassword">
              <el-input type="password" v-model="ruleForm.loginPassword" placeholder="请输入登录密码" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
            <el-form-item label="确认密码" prop="checkPassword">
              <el-input type="password" v-model="ruleForm.checkPassword" placeholder="请输入确认密码" clearable></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="onCancel" size="default">取 消</el-button>
          <el-button type="primary" @click="onSubmit" size="default" :loading="loading">保存</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { reactive, toRefs, ref } from 'vue'
import { ElForm, ElMessage } from 'element-plus'
import { updateUser } from '@/api/system/user/index'

// 定义变量内容
function validatePassword(rule: any, value: any, callback: any) {
  if (value.trim() === '') {
    callback(new Error('请填写登录密码'))
  } else if (value.length < 6) {
    callback(new Error('请填写最少6位的密码'))
  } else {
    callback()
  }
}

function validateCheckPassword(rule: any, value: any, callback: any) {
  if (value.trim() === '') {
    callback(new Error('请再次输入登录密码'))
  } else if (value !== state.ruleForm.loginPassword) {
    callback(new Error('两次输入的密码不一致'))
  } else {
    callback()
  }
}

const dialogFormRef = ref(ElForm)
const state = reactive({
  loading: false,
  userInfo: {} as any,
  ruleForm: {} as any,
  rules: {
    loginPassword: [
      { required: true, trigger: 'blur', validator: validatePassword },
    ],
    checkPassword: [
      { required: true, trigger: 'blur', validator: validateCheckPassword },
    ],
  },
  isShowDialog: false,
})

const { loading, userInfo, ruleForm, rules, isShowDialog } = toRefs(state)

// 打开弹窗
const openDialog = (row: any) => {
  state.isShowDialog = true
  state.userInfo = row
  state.ruleForm = {
    id: row.id,
    loginPassword: '',
    checkPassword: '',
  }
}
// 关闭弹窗
const closeDialog = () => {
  state.isShowDialog = false
}
// 取消
const onCancel = () => {
  closeDialog()
}

// 提交
const onSubmit = () => {
  const ruleForm = JSON.parse(JSON.stringify(state.ruleForm))
  dialogFormRef.value.validate((valid: boolean) => {
    if (valid) {
      state.loading = true
      delete ruleForm.checkPassword
      updateUser(ruleForm)
        .then(() => {
          ElMessage({
            message: '修改成功.',
            type: 'success',
          })
          state.loading = false
          closeDialog()
        })
        .catch(() => {
          state.loading = false
        })
    } else {
      return false
    }
  })
}

// 暴露变量
defineExpose({
  openDialog,
})
</script>
