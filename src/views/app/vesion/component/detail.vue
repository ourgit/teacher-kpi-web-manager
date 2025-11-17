<template>
  <div class="dialog-container">
    <el-dialog :title="dialog.title" v-model="dialog.isShowDialog" width="810px" :close-on-click-modal="false" :destroy-on-close="true">
      <el-form ref="detailFormRef" :model="ruleForm" :rules="rules" size="default" label-width="120px">
        <el-row :gutter="35">
          <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
            <el-form-item label="系统平台" prop="platform">
              <el-select v-model="ruleForm.platform" placeholder="请选择系统平台" class="w100">
                <el-option value="android" label="android" />
                <el-option value="ios" label="ios" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
            <el-form-item label="版本类型" prop="versionType">
              <el-select v-model="ruleForm.versionType" placeholder="请选择系统平台" class="w100">
                <el-option :value="1" label="正式版本" />
                <el-option :value="2" label="灰度版本" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
            <el-form-item label="更新类型" prop="updateType">
              <el-select v-model="ruleForm.updateType" placeholder="请选择更新类型" class="w100">
                <el-option :value="1" label="在线更新" />
                <el-option :value="2" label="整包更新" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
            <el-form-item label="提示类型" prop="tipType">
              <el-select v-model="ruleForm.tipType" placeholder="请选择提示类型" class="w100">
                <el-option :value="1" label="静默" />
                <el-option :value="2" label="弹窗" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
            <el-form-item label="升级包地址" prop="updateUrl">
              <el-input v-model="ruleForm.updateUrl" placeholder="请输入升级包地址" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
            <el-form-item label="版本名" prop="name">
              <el-input v-model="ruleForm.name" placeholder="请输入版本名,如：1.0.1" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
            <el-form-item label="版本号" prop="versionNumber">
              <el-input v-model="ruleForm.versionNumber" placeholder="请输入版本名,如：101" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
            <el-form-item label="普通更新规则" prop="normalUpdateRule">
              <el-input v-model="ruleForm.normalUpdateRule" placeholder="请输入普通更新规则,如:<=101" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
            <el-form-item label="强制更新规则" prop="forceUpdateRule">
              <el-input v-model="ruleForm.forceUpdateRule" type="textarea" placeholder="请输入强制更新规则,如:<=101"></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
            <el-form-item label="升级说明" prop="note">
              <el-input v-model="ruleForm.note" type="textarea" placeholder="请输入升级说明"></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
            <el-form-item label="状态">
              <el-switch v-model="ruleForm.enable" inline-prompt :active-value="true" :inactive-value="false" active-text="启" inactive-text="禁"></el-switch>
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
import {
  getVesionDetail,
  addVesion,
  updateVesion,
} from '@/api/app/Vesion/index'

// 定义子组件向父组件传值/事件
const emit = defineEmits(['refresh'])

// 定义变量内容
const detailFormRef = ref(ElForm)
const state = reactive({
  loading: false,
  ruleForm: {} as any,
  rules: {
    updateUrl: [
      { required: true, trigger: 'blur', message: '请填写升级包地址' },
    ],
    name: [{ required: true, trigger: 'blur', message: '请填写版本名' }],
    versionNumber: [
      { required: true, trigger: 'blur', message: '请填写版本号' },
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
    state.dialog.title = '修改版本'
    state.dialog.submitTxt = '修 改'
    getVesionDetail({
      id: row.id,
    }).then((res) => {
      state.ruleForm = {
        id: row.id,
        platform: row.platform,
        versionType: row.versionType,
        updateType: row.updateType,
        tipType: row.tipType,
        updateUrl: row.updateUrl,
        name: row.name,
        versionNumber: row.versionNumber,
        note: row.note,
        normalUpdateRule: row.normalUpdateRule,
        forceUpdateRule: row.forceUpdateRule,
        enable: row.enable,
      }
    })
  } else {
    state.dialog.title = '新增版本'
    state.dialog.submitTxt = '新 增'
    state.ruleForm = {
      platform: 'android',
      versionType: 1,
      updateType: 2,
      tipType: 2,
      updateUrl: '',
      name: '',
      versionNumber: '',
      note: '',
      normalUpdateRule: '',
      forceUpdateRule: '',
      enable: true,
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
        addVesion(ruleForm)
          .then(() => {
            state.loading = false
            closeDialog()
            emit('refresh')
          })
          .catch(() => {
            state.loading = false
          })
      } else {
        updateVesion(ruleForm)
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
