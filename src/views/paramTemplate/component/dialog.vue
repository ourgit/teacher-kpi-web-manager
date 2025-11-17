<template>
  <div class="dialog-container">
    <el-dialog :title="dialog.title" v-model="dialog.isShowDialog" width="600px" :close-on-click-modal="false" :destroy-on-close="true">
      <el-form ref="dialogFormRef" :model="ruleForm" :rules="rules" size="default" label-width="120px">
        <el-row :gutter="35">
          <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
            <el-form-item label="所属类型" prop="tabName">
              <el-select v-model="ruleForm.tabName" placeholder="请选择所属类型" clearable class="w100">
                <el-option label="基础配置" value="基础配置"></el-option>
                <el-option label="订单配置" value="订单配置"></el-option>
                <el-option label="会员配置" value="会员配置"></el-option>
                <el-option label="桌码配置" value="桌码配置"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
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
            <el-form-item label="是否前台显示" prop="enable">
              <el-switch v-model="ruleForm.enable" inline-prompt :active-value="true" :inactive-value="false" active-text="是" inactive-text="否"></el-switch>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
            <el-form-item label="参数类型" prop="contentType">
              <el-radio-group v-model="ruleForm.contentType">
                <el-radio :label="1">文本</el-radio>
                <el-radio :label="2">图片</el-radio>
                <el-radio :label="3">颜色</el-radio>
                <el-radio :label="4">开关</el-radio>
                <el-radio :label="5">自定义</el-radio>
                <el-radio :label="6">生日打折</el-radio>
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
          <template v-if="ruleForm.contentType === 5">
            <template v-if="ruleForm.key === 'MEMBERDAY'">
              <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
                <el-form-item label="是否开启会员日">
                  <el-switch v-model="memberDay.status" inline-prompt :active-value="true" :inactive-value="false" active-text="是" inactive-text="否"></el-switch>
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
                <el-form-item label="会员日类型">
                  <el-radio-group v-model="memberDay.type">
                    <el-radio label="week">每周</el-radio>
                    <el-radio label="month">每月</el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
                <el-form-item label="日期">
                  <template v-if="memberDay.type === 'week'">
                    <el-radio-group v-model="memberDay.date" size="default">
                      <el-radio-button :label="1">周一</el-radio-button>
                      <el-radio-button :label="2">周二</el-radio-button>
                      <el-radio-button :label="3">周三</el-radio-button>
                      <el-radio-button :label="4">周四</el-radio-button>
                      <el-radio-button :label="5">周五</el-radio-button>
                      <el-radio-button :label="6">周六</el-radio-button>
                      <el-radio-button :label="0">周日</el-radio-button>
                    </el-radio-group>
                  </template>
                  <el-input v-else v-model="memberDay.date" placeholder="日期" />
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
                <el-form-item label="会员折扣">
                  <el-space>
                    <el-input v-model="memberDay.discount" placeholder="会员折扣" />
                    <span>%</span>
                  </el-space>
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
                <el-form-item label="是否弹窗提示">
                  <el-switch v-model="memberDay.isDialog" inline-prompt :active-value="true" :inactive-value="false" active-text="是" inactive-text="否"></el-switch>
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
                <el-form-item label="弹窗图片">
                  <upload-img v-model="memberDay.imgUrl" :width="80" :height="80" />
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
                <el-form-item label="图片宽度">
                  <el-input v-model="memberDay.imgWidth" placeholder="图片宽度" />
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
                <el-form-item label="图片高度">
                  <el-input v-model="memberDay.imgHeight" placeholder="图片高度" />
                </el-form-item>
              </el-col>
            </template>
          </template>
          <template v-if="ruleForm.contentType === 6">
            <template v-if="ruleForm.key === 'BIRTHDAY'">
              <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
                <el-form-item label="是否开启打折">
                  <el-switch v-model="birthDay.status" inline-prompt :active-value="true" :inactive-value="false" active-text="是" inactive-text="否"></el-switch>
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
                <el-form-item label="生日折扣">
                  <el-space>
                    <el-input v-model="birthDay.discount" placeholder="生日折扣" />
                    <span>%</span>
                  </el-space>
                </el-form-item>
              </el-col>
            </template>
          </template>
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
import { addParamTemplate, updateParamTemplate } from '@/api/paramTemplate/index'
import UploadImg from '@/components/upload/uploadImg.vue'
import { ElMessage } from 'element-plus'

// 定义子组件向父组件传值/事件
const emit = defineEmits(['refresh'])

// 定义变量内容
const dialogFormRef = ref(ElForm)
const state = reactive({
  loading: false,
  ruleForm: {} as any,
  rules: {
    key: [{ required: true, trigger: 'blur', message: '请填写参数名' }],
    note: [
      { required: true, trigger: 'blur', message: '请填写参数说明' },
    ],
  },
  memberDay: {
    status: false, //是否开启会员日
    type: 'week', //会员日类型，week为每周，month为每月
    date: 0, //会员日日期，
    discount: '',
    isDialog: false, //是否开启弹窗提示
    imgUrl: '',
    imgWidth: '',
    imgHeight: '',
  },
  birthDay: {
    status: false, //是否开启折扣
    discount: '',
  },
  dialog: {
    isShowDialog: false,
    type: '',
    title: '',
    submitTxt: '',
  },
})

const { loading, ruleForm, rules, memberDay, dialog, birthDay } = toRefs(state)

// 打开弹窗
const openDialog = (type: string, row: any) => {
  if (type === 'edit') {
    state.dialog.title = '修改参数配置'
    state.dialog.submitTxt = '修 改'
    state.ruleForm = {
      id: row.id,
      tabName: row.tabName,
      key: row.key,
      note: row.note,
      enable: row.enable,
      contentType: row.contentType,
      value: row.value,
    }
    if (row.key === 'MEMBERDAY') {
      state.memberDay = JSON.parse(row.value)
    }
    if (row.key === 'BIRTHDAY') {
      state.birthDay = JSON.parse(row.value)
    }
  } else {
    state.dialog.title = '新增参数配置'
    state.dialog.submitTxt = '新 增'
    state.ruleForm = {
      tabName: '',
      key: '',
      note: '',
      enable: true,
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
  if (ruleForm.key === 'MEMBERDAY') {
    if (state.memberDay.type === 'week') {
      if (state.memberDay.date < 0 || state.memberDay.date > 7) {
        return ElMessage({
          message: '请选择正确的会员日日期',
          type: 'error',
        })
      }
    } else {
      if (state.memberDay.date < 1 || state.memberDay.date > 31) {
        return ElMessage({
          message: '请选择正确的会员日日期',
          type: 'error',
        })
      }
    }
    ruleForm.value = JSON.stringify(state.memberDay)
  }
  if (ruleForm.key === 'BIRTHDAY') {
    ruleForm.value = JSON.stringify(state.birthDay)
  }
  dialogFormRef.value.validate((valid: boolean) => {
    if (valid) {
      state.loading = true
      if (state.dialog.type === 'add') {
        addParamTemplate(ruleForm)
          .then(() => {
            state.loading = false
            closeDialog()
            emit('refresh')
          })
          .catch(() => {
            state.loading = false
          })
      } else {
        updateParamTemplate(ruleForm)
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