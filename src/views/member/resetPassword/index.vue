<template>
  <div class="page-container layout-padding">
    <el-card shadow="hover" class="layout-padding-auto">
      <template #header>
        <div class="card-header">
          <span class="card-header-title">重置登录密码</span>
        </div>
      </template>
      <el-form
        ref="formRef"
        :model="formData"
        :rules="rules"
        label-width="120px"
        size="default"
        style="max-width: 600px"
      >
        <el-form-item label="手机号码" prop="phone">
          <el-input
            v-model="formData.phone"
            placeholder="请输入手机号码"
            clearable
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item label="新密码" prop="newPassword">
          <el-input
            v-model="formData.newPassword"
            type="password"
            placeholder="请输入新密码"
            show-password
            clearable
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSubmit" :loading="loading">
            重置密码
          </el-button>
          <el-button @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { ElMessage, ElForm } from 'element-plus'
import { resetLoginPassword } from '@/api/member/index'

const formRef = ref<InstanceType<typeof ElForm>>()
const loading = ref(false)

const formData = reactive({
  phone: '',
  newPassword: '',
})

const rules = {
  phone: [
    { required: true, message: '请输入手机号码', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号码', trigger: 'blur' },
  ],
  newPassword: [
    { required: true, message: '请输入新密码', trigger: 'blur' },
    { min: 6, message: '密码长度不能少于6位', trigger: 'blur' },
  ],
}

const handleSubmit = () => {
  formRef.value?.validate((valid: boolean) => {
    if (!valid) return

    loading.value = true
    resetLoginPassword({
      phone: formData.phone,
      newPassword: formData.newPassword,
    })
      .then((res: any) => {
        if (res.code === 200) {
          ElMessage.success('密码重置成功')
          handleReset()
        } else {
          ElMessage.error(res.message || '密码重置失败')
        }
        loading.value = false
      })
      .catch((error: any) => {
        ElMessage.error(error.message || '密码重置失败')
        loading.value = false
      })
  })
}

const handleReset = () => {
  formRef.value?.resetFields()
  formData.phone = ''
  formData.newPassword = ''
}
</script>

<style scoped lang="scss">
.page-container {
  .card-header {
    display: flex;
    align-items: center;
    justify-content: space-between;

    .card-header-title {
      font-size: 18px;
      font-weight: 600;
      color: var(--el-text-color-primary);
    }
  }
}
</style>

