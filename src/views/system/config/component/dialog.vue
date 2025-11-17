<template>
  <div class="dialog-container">
    <el-dialog :title="dialog.title" v-model="dialog.isShowDialog" width="500px" :close-on-click-modal="false" :destroy-on-close="true">
      <el-form ref="dialogFormRef" :model="ruleForm" :rules="rules" size="default" label-width="90px">
        <el-row :gutter="35">
          <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
            <el-form-item label="参数名" prop="key">
              <el-input v-model="ruleForm.key" placeholder="请输入参数名" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
            <el-form-item label="参数说明">
              <el-input v-model="ruleForm.note" type="textarea" placeholder="请输入参数说明"></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
            <el-form-item label="使用位置" prop="source">
              <el-select v-model="ruleForm.source" placeholder="请选择" clearable class="w100">
                <el-option label="前台" :value="1"></el-option>
                <el-option label="后台" :value="2"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
            <el-form-item label="参数类型" prop="contentType">
              <el-radio-group v-model="ruleForm.contentType">
                <el-radio :label="1">文本</el-radio>
                <el-radio :label="2">图片</el-radio>
                <el-radio :label="3">颜色</el-radio>
                <el-radio :label="4">开关</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
            <el-form-item v-if="ruleForm.contentType === 1" label="参数值" prop="value">
              <el-input v-model="ruleForm.value" placeholder="请输入参数值" />
            </el-form-item>
            <el-form-item v-if="ruleForm.contentType === 2" label="上传图片" prop="value">
              <upload-img v-model="ruleForm.value" :width="80" :height="80" />
            </el-form-item>
            <el-form-item v-if="ruleForm.contentType === 3" label="输入颜色值" prop="value">
              <el-color-picker v-model="ruleForm.value" />
            </el-form-item>
            <el-form-item v-if="ruleForm.contentType === 4" label="是否开启" prop="value">
              <el-switch v-model="ruleForm.value" inline-prompt :active-value="true" :inactive-value="false" active-text="启" inactive-text="禁"></el-switch>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="onCancel" size="default">取 消</el-button>
          <el-button type="primary" @click="onSubmit" size="default" :loading="loading">{{ dialog.submitTxt }}</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, toRefs } from 'vue'
import { ElForm } from 'element-plus'
import { addConfig, updateConfig } from '@/api/system/config/index'
import UploadImg from '@/components/upload/uploadImg.vue'

// 定义子组件向父组件传值/事件
const emit = defineEmits(['refresh'])

// 定义变量内容
const dialogFormRef = ref(ElForm)
const state = reactive({
  loading: false,
  ruleForm: {} as any,
  rules: {
    key: [{ required: true, trigger: 'blur', message: '请填写参数名' }],
    description: [
      { required: true, trigger: 'blur', message: '请填写角色描述' },
    ],
  },
  dialog: {
    isShowDialog: false,
    type: '',
    title: '',
    submitTxt: '',
  },
})

const { loading, ruleForm, rules, dialog } = toRefs(state)

// 打开弹窗
const openDialog = (type: string, row: any) => {
  if (type === 'edit') {
    state.dialog.title = '修改参数配置'
    state.dialog.submitTxt = '修 改'
    state.ruleForm = {
      id: row.id,
      key: row.key,
      note: row.note,
      source: row.source,
      contentType: row.contentType,
      value: row.value,
    }
  } else {
    state.dialog.title = '新增参数配置'
    state.dialog.submitTxt = '新 增'
    state.ruleForm = {
      key: '',
      note: '',
      source: 2,
      contentType: 1,
      value: '',
    }
  }
  state.dialog.type = type
  state.dialog.isShowDialog = true
}
// 关闭弹窗
const closeDialog = () => {
  state.dialog.isShowDialog = false
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
      if (state.dialog.type === 'add') {
        addConfig(ruleForm)
          .then(() => {
            state.loading = false
            closeDialog()
            emit('refresh')
          })
          .catch(() => {
            state.loading = false
          })
      } else {
        updateConfig(ruleForm)
          .then(() => {
            state.loading = false
            closeDialog()
            emit('refresh')
          })
          .catch(() => {
            state.loading = false
          })
      }
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