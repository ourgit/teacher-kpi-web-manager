<template>
  <div class="dialog-container">
    <el-dialog
      title="修改KPI"
      v-model="isShowDialog"
      width="500px"
      :close-on-click-modal="false"
      :destroy-on-close="true"
      @closed="handleDialogClosed"
    >
      <el-form ref="dialogFormRef" :model="ruleForm" :rules="rules" label-width="120px">
        <el-row :gutter="35">
          <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
            <el-form-item label="KPI标题" prop="title">
              <el-input v-model="ruleForm.title" placeholder="请输入KPI标题" clearable />
            </el-form-item>
            <el-form-item label="时间范围" prop="timeRange">
              <el-date-picker
                v-model="ruleForm.timeRange"
                type="datetimerange"
                start-placeholder="创建时间"
                end-placeholder="截止时间"
                range-separator="-"
                value-format="YYYY-MM-DD HH:mm:ss"
                format="YYYY-MM-DD HH:mm:ss"
                style="width: 100%"
                clearable
              />
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
import { reactive, ref, nextTick, watch } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import { ElMessage } from 'element-plus'
import { updateKpi } from '@/api/kpi/index'

// 定义子组件向父组件传值/事件
const emit = defineEmits(['refresh'])

interface EditForm {
  id: number | null
  title: string
  timeRange: [string, string] | []
  createTime: string
  endTime: string
}

const dialogFormRef = ref<FormInstance>()
const isShowDialog = ref(false)
const loading = ref(false)
const ruleForm = reactive<EditForm>({
  id: null,
  title: '',
  timeRange: [],
  createTime: '',
  endTime: ''
})

const rules = reactive<FormRules>({
  title: [{ required: true, message: '请输入KPI标题', trigger: 'blur' }],
  timeRange: [{ type: 'array', required: true, message: '请选择时间范围', trigger: 'change' }]
})

const resetForm = () => {
  ruleForm.id = null
  ruleForm.title = ''
  ruleForm.timeRange = []
  ruleForm.createTime = ''
  ruleForm.endTime = ''
}

watch(
  () => ruleForm.timeRange,
  (val) => {
    if (Array.isArray(val) && val.length === 2) {
      ruleForm.createTime = val[0]
      ruleForm.endTime = val[1]
    } else {
      ruleForm.createTime = ''
      ruleForm.endTime = ''
    }
  },
  { deep: true }
)

// 打开弹窗
const openDialog = (row: any) => {
  if (row) {
    ruleForm.id = row.id
    ruleForm.title = row.title || ''
    ruleForm.createTime = row.createTime || ''
    ruleForm.endTime = row.endTime || ''
    if (row.createTime && row.endTime) {
      ruleForm.timeRange = [row.createTime, row.endTime]
    } else {
      ruleForm.timeRange = []
    }
  }
  isShowDialog.value = true
  nextTick(() => dialogFormRef.value?.clearValidate())
}

// 关闭弹窗
const closeDialog = () => {
  isShowDialog.value = false
}

const handleDialogClosed = () => {
  resetForm()
  dialogFormRef.value?.clearValidate()
}

// 取消
const onCancel = () => {
  closeDialog()
}

// 提交
const onSubmit = async () => {
  if (!dialogFormRef.value) return
  try {
    await dialogFormRef.value.validate()
  } catch {
    return
  }

  if (!ruleForm.createTime || !ruleForm.endTime) {
    ElMessage.warning('请选择完整的时间范围')
    return
  }

  if (ruleForm.createTime > ruleForm.endTime) {
    ElMessage.warning('截止时间不能早于开始时间')
    return
  }

  const payload = {
    id: ruleForm.id,
    title: ruleForm.title,
    createTime: ruleForm.createTime,
    endTime: ruleForm.endTime
  }

  try {
    loading.value = true
    await updateKpi(payload)
    ElMessage.success('更新成功')
    closeDialog()
    emit('refresh')
  } catch (error) {
    ElMessage.error('更新失败')
  } finally {
    loading.value = false
  }
}

// 暴露变量
defineExpose({
  openDialog
})
</script>