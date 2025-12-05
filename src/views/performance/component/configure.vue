<template>
  <div class="page-container layout-padding">
    <el-card shadow="hover" class="layout-padding-auto">
      <div class="mb20">
        <el-button size="default" @click="goBack">
          <el-icon>
            <ele-ArrowLeft />
          </el-icon>
          返回
        </el-button>
      </div>
      <el-form :model="formData" label-width="120px" v-loading="loading">
        <el-row :gutter="35">
          <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12" class="mb20">
            <el-form-item label="KPI ID">
              <el-input v-model="formData.id" disabled />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12" class="mb20">
            <el-form-item label="KPI标题">
              <el-input v-model="formData.title" disabled />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="35">
          <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12" class="mb20">
            <el-form-item label="创建时间">
              <el-input v-model="formData.createTime" disabled />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12" class="mb20">
            <el-form-item label="截至时间">
              <el-input v-model="formData.endTime" disabled />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="35">
          <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
            <el-form-item label="配置内容">
              <el-input
                v-model="formData.config"
                type="textarea"
                :rows="6"
                placeholder="请输入配置内容"
              />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div class="mt20">
        <el-button type="primary" @click="onSave" :loading="saving">保存</el-button>
        <el-button @click="goBack">取消</el-button>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
// import { getKpiDetail, updateKpiConfig } from '@/api/kpi/index'

const route = useRoute()
const router = useRouter()

const loading = ref(false)
const saving = ref(false)
const formData = reactive({
  id: '',
  title: '',
  createTime: '',
  endTime: '',
  config: ''
})

// 返回上一页
const goBack = () => {
  router.back()
}

// 获取详情数据
const getDetail = () => {
  const id = route.query.id as string
  if (!id) {
    ElMessage.warning('缺少ID参数')
    goBack()
    return
  }
  
  formData.id = id
  loading.value = true
  
  // TODO: 调用API获取详情
  // getKpiDetail({ id }).then((data: any) => {
  //   formData.title = data.title || ''
  //   formData.createTime = data.createTime || ''
  //   formData.endTime = data.endTime || ''
  //   formData.config = data.config || ''
  //   loading.value = false
  // }).catch(() => {
  //   loading.value = false
  // })
  
  // 临时模拟数据
  setTimeout(() => {
    formData.title = '示例KPI标题'
    formData.createTime = '2024-01-01 00:00:00'
    formData.endTime = '2024-12-31 23:59:59'
    loading.value = false
  }, 500)
}

// 保存配置
const onSave = () => {
  saving.value = true
  
  // TODO: 调用API保存配置
  // updateKpiConfig({
  //   id: formData.id,
  //   config: formData.config
  // }).then(() => {
  //   ElMessage.success('保存成功')
  //   saving.value = false
  //   goBack()
  // }).catch(() => {
  //   saving.value = false
  // })
  
  // 临时模拟保存
  setTimeout(() => {
    ElMessage.success('保存成功')
    saving.value = false
    // goBack()
  }, 500)
}

onMounted(() => {
  getDetail()
})
</script>

<style scoped lang="scss">
.mb20 {
  margin-bottom: 20px;
}

.mt20 {
  margin-top: 20px;
}
</style>