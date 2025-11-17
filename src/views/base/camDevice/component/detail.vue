<template>
  <div class="dialog-container">
    <el-dialog :title="dialog.title" v-model="dialog.isShowDialog" width="500px" :close-on-click-modal="false" :destroy-on-close="true">
      <el-form ref="detailFormRef" :model="ruleForm" :rules="rules" size="default" label-width="100px">
        <el-row :gutter="35">
          <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
            <el-form-item label="设备编号" prop="deviceCode">
              <el-input v-model="ruleForm.deviceCode" placeholder="请输入设备编号" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
            <el-form-item label="设备名称" prop="deviceName">
              <el-input v-model="ruleForm.deviceName" placeholder="请输入设备名称" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
            <el-form-item label="摄像头url" prop="url">
              <el-input v-model="ruleForm.url" placeholder="请输入摄像头url" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
            <el-form-item label="sim卡号" prop="simCard">
              <el-input v-model="ruleForm.simCard" placeholder="请输入sim卡号" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
            <el-form-item label="备注" prop="remark">
              <el-input v-model="ruleForm.remark" placeholder="请输入备注" clearable></el-input>
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
import {
  reactive,
  ref,
  toRefs,
} from 'vue'
import { ElForm } from 'element-plus'
import {
  getDeviceDetail,
  updateDevice,
  addDevice,
} from '@/api/base/camDevice/index'

// 定义子组件向父组件传值/事件
const emit = defineEmits(['refresh'])
// 定义变量内容
const detailFormRef = ref(ElForm)
const state = reactive({
  loading: false,
  ruleForm: {} as any,
  rules: {
    deviceCode: [
      { required: true, trigger: 'blur', message: '请填写设备编号' },
    ],
    deviceName: [
      { required: true, trigger: 'blur', message: '请填写设备名称' },
    ]
  },
  dialog: {
    isShowDialog: false,
    type: '',
    title: '',
    submitTxt: '',
  },
})

const {
  loading,
  ruleForm,
  rules,
  dialog,
} = toRefs(state)

// 打开弹窗
const openDialog = (type: any, row: any) => {
  if (type === 'edit') {
    state.dialog.title = '修改摄像头'
    state.dialog.submitTxt = '修 改'
    getDeviceDetail({
      id: row.id,
    }).then((res: any) => {
      state.ruleForm = {
        id: res.id,
        deviceCode: res.deviceCode,
        deviceName: res.deviceName,
        url: res.url,
        simCard: res.simCard,
        installationStatus: res.installationStatus,
        remark: res.remark,
      }
    })
  } else {
    state.dialog.title = '新增摄像头'
    state.dialog.submitTxt = '新 增'
    state.ruleForm = {
      deviceCode: '',
      deviceName: '',
      url: '',
      simCard: '',
      remark: '',
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
  detailFormRef.value.validate((valid: boolean) => {
    if (valid) {
      state.loading = true
      if (state.dialog.type === 'add') {
        addDevice(ruleForm)
          .then(() => {
            state.loading = false
            closeDialog()
            emit('refresh')
          })
          .catch(() => {
            state.loading = false
          })
      } else {
        updateDevice(ruleForm)
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