<template>
  <div class="dialog-container">
    <el-dialog
      title="修改标准"
      v-model="isShowDialog"
      width="600px"
      :close-on-click-modal="false"
      :destroy-on-close="true"
      @closed="handleDialogClosed"
    >
      <el-form ref="dialogFormRef" :model="ruleForm" :rules="rules" label-width="120px">
        <el-row :gutter="35">
          <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
            <el-form-item label="标准名" prop="name">
              <el-input v-model="ruleForm.name" placeholder="请输入标准名" clearable />
            </el-form-item>
            <el-form-item label="等级" prop="level">
              <el-select v-model="ruleForm.level" placeholder="请选择等级" clearable style="width: 100%">
                <el-option label="1 (最低)" :value="1" />
                <el-option label="2" :value="2" />
                <el-option label="3" :value="3" />
                <el-option label="4" :value="4" />
                <el-option label="5 (最高)" :value="5" />
              </el-select>
            </el-form-item>
            <el-form-item label="分数规则" class="formula-form-item">
              <div class="formula-container">
                <el-form-item prop="leftLimitScore" class="inline-form-item">
                  <el-input-number 
                    v-model="ruleForm.leftLimitScore" 
                    :precision="2" 
                    :step="0.1" 
                    :min="0" 
                    :max="100"
                    placeholder="分数" 
                    style="width: 120px" 
                    clearable 
                  />
                </el-form-item>
                <el-form-item prop="leftOperator" class="inline-form-item">
                  <el-select v-model="ruleForm.leftOperator" placeholder="符号" style="width: 100px">
                    <el-option label="<=" value="<=" />
                    <el-option label=">=" value=">=" />
                  </el-select>
                </el-form-item>
                <span class="formula-label">分数</span>
                <el-form-item prop="op" class="inline-form-item">
                  <el-select v-model="ruleForm.op" placeholder="连接符" style="width: 100px">
                    <el-option label="AND" value="AND" />
                    <el-option label="OR" value="OR" />
                  </el-select>
                </el-form-item>
                <el-form-item prop="rightLimitScore" class="inline-form-item">
                  <el-input-number 
                    v-model="ruleForm.rightLimitScore" 
                    :precision="2" 
                    :step="0.1" 
                    :min="0" 
                    :max="100"
                    placeholder="分数" 
                    style="width: 120px" 
                    clearable 
                  />
                </el-form-item>
                <el-form-item prop="rightOperator" class="inline-form-item">
                  <el-select v-model="ruleForm.rightOperator" placeholder="符号" style="width: 100px">
                    <el-option label="<=" value="<=" />
                    <el-option label=">=" value=">=" />
                  </el-select>
                </el-form-item>
                <span class="formula-label">分数</span>
              </div>
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
import { reactive, ref, nextTick } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import { ElMessage } from 'element-plus'
import { updateStandard } from '@/api/sfuw/index'

// 定义子组件向父组件传值/事件
const emit = defineEmits(['refresh'])

interface EditForm {
  id: number | string | null
  name: string
  level: number | null
  leftLimitScore: number | null
  leftOperator: string
  op: string
  rightLimitScore: number | null
  rightOperator: string
}

const dialogFormRef = ref<FormInstance>()
const isShowDialog = ref(false)
const loading = ref(false)
const ruleForm = reactive<EditForm>({
  id: null,
  name: '',
  level: null,
  leftLimitScore: null,
  leftOperator: '',
  op: '',
  rightLimitScore: null,
  rightOperator: ''
})

const rules = reactive<FormRules>({
  name: [{ required: true, message: '请输入标准名', trigger: 'blur' }],
  level: [{ required: true, message: '请选择等级', trigger: 'change' }],
  leftLimitScore: [
    { required: true, message: '请输入左临界分', trigger: 'blur' },
    { type: 'number', min: 0, max: 100, message: '分数范围0-100', trigger: 'blur' }
  ],
  leftOperator: [{ required: true, message: '请选择左符号', trigger: 'change' }],
  op: [{ required: true, message: '请选择连接符', trigger: 'change' }],
  rightLimitScore: [
    { required: true, message: '请输入右临界分', trigger: 'blur' },
    { type: 'number', min: 0, max: 100, message: '分数范围0-100', trigger: 'blur' }
  ],
  rightOperator: [{ required: true, message: '请选择右符号', trigger: 'change' }]
})

const resetForm = () => {
  ruleForm.id = null
  ruleForm.name = ''
  ruleForm.level = null
  ruleForm.leftLimitScore = null
  ruleForm.leftOperator = ''
  ruleForm.op = ''
  ruleForm.rightLimitScore = null
  ruleForm.rightOperator = ''
}

// 打开弹窗
const openDialog = (row: any) => {
  if (row) {
    ruleForm.id = row.id
    ruleForm.name = row.name || ''
    ruleForm.level = row.level ?? null
    ruleForm.leftLimitScore = row.leftLimitScore ?? null
    ruleForm.leftOperator = row.leftOperator || ''
    ruleForm.op = row.op || ''
    ruleForm.rightLimitScore = row.rightLimitScore ?? null
    ruleForm.rightOperator = row.rightOperator || ''
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

  const payload = {
    id: ruleForm.id,
    name: ruleForm.name,
    level: ruleForm.level,
    leftLimitScore: ruleForm.leftLimitScore,
    leftOperator: ruleForm.leftOperator,
    op: ruleForm.op,
    rightLimitScore: ruleForm.rightLimitScore,
    rightOperator: ruleForm.rightOperator
  }

  try {
    loading.value = true
    await updateStandard(payload)
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

<style scoped lang="scss">
.formula-container {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
  width: 100%;
}

.formula-label {
  font-size: 14px;
  color: #606266;
  white-space: nowrap;
  margin: 0;
  line-height: 32px;
}

.formula-form-item :deep(.el-form-item__content) {
  margin-left: 0 !important;
}

.inline-form-item {
  margin: 0 !important;
  margin-bottom: 0 !important;
}

.inline-form-item :deep(.el-form-item__content) {
  margin-left: 0 !important;
}

.inline-form-item :deep(.el-form-item__error) {
  position: absolute;
  top: 100%;
  left: 0;
  padding-top: 2px;
}
</style>

