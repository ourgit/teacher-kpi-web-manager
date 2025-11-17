<template>
  <div class="dialog-container">
    <el-dialog :title="dialog.title" v-model="dialog.isShowDialog" width="500px" :close-on-click-modal="false" :destroy-on-close="true">
      <el-form ref="dialogFormRef" :model="ruleForm" :rules="rules" size="default" label-width="120px">
        <el-row :gutter="35">
          <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
            <el-form-item label="权限中文名" prop="actionDesc">
              <el-input v-model="ruleForm.actionDesc" placeholder="请输入权限中文名" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
            <el-form-item label="权限英文名" prop="actionName">
              <el-input v-model="ruleForm.actionName" placeholder="请输入权限英文名" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
            <el-form-item label="模块中文名" prop="moduleDesc">
              <el-input v-model="ruleForm.moduleDesc" placeholder="请输入模块中文名" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
            <el-form-item label="模块英文名" prop="moduleName">
              <el-input v-model="ruleForm.moduleName" placeholder="请输入模块英文名" clearable></el-input>
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
import { addAction, updateAction } from '@/api/system/action/index'

// 定义子组件向父组件传值/事件
const emit = defineEmits(['refresh'])

// 定义变量内容
const dialogFormRef = ref(ElForm)
const state = reactive({
  loading: false,
  ruleForm: {} as any,
  rules: {
    actionDesc: [
      { required: true, trigger: 'blur', message: '请填写权限中文名' },
    ],
    actionName: [
      { required: true, trigger: 'blur', message: '请填写权限英文名' },
    ],
    moduleDesc: [
      { required: true, trigger: 'blur', message: '请填写模块中文名' },
    ],
    moduleName: [
      { required: true, trigger: 'blur', message: '请填写模块英文名' },
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
    state.dialog.title = '修改权限'
    state.dialog.submitTxt = '修 改'
    state.ruleForm = {
      id: row.id,
      actionDesc: row.actionDesc,
      actionName: row.actionName,
      moduleDesc: row.moduleDesc,
      moduleName: row.moduleName,
    }
  } else {
    state.dialog.title = '新增权限'
    state.dialog.submitTxt = '新 增'
    state.ruleForm = {
      actionDesc: '',
      actionName: '',
      moduleDesc: '',
      moduleName: '',
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
        addAction(ruleForm)
          .then(() => {
            state.loading = false
            state.ruleForm.actionDesc = ''
            state.ruleForm.actionName = ''
            emit('refresh')
          })
          .catch(() => {
            state.loading = false
          })
      } else {
        updateAction(ruleForm)
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
