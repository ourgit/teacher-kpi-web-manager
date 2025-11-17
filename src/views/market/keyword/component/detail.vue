<template>
  <div class="dialog-container">
    <el-dialog :title="dialog.title" v-model="dialog.isShowDialog" width="500px" :close-on-click-modal="false" :destroy-on-close="true">
      <el-form ref="detailFormRef" :model="ruleForm" :rules="rules" size="default" label-width="90px">
        <el-row :gutter="35">
          <el-col :xs="24" :sm="12" :md="12" :lg="15" :xl="12" class="mb20">
            <el-form-item label="位置" prop="source">
              <el-select v-model="ruleForm.source" class="w100">
                <el-option label="首页" :value="1"></el-option>
                <el-option label="热搜" :value="2"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
            <el-form-item label="关键字" prop="keyword">
              <el-input v-model="ruleForm.keyword" placeholder="请输入关键字" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
            <el-form-item label="排列序号" prop="sort">
              <el-input v-model="ruleForm.sort" placeholder="请输入排列序号，值越大越靠前" clearable></el-input>
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
import { reactive, toRefs, ref } from 'vue'
import { ElForm } from 'element-plus'
import { addKeyword, KeywordDetail, editKeyword } from '@/api/market/keyword/index'

// 定义子组件向父组件传值/事件
const emit = defineEmits(['refresh'])

// 定义变量内容
const detailFormRef = ref(ElForm)
const state = reactive({
  loading: false,
  ruleForm: {} as any,
  rules: {
    keyword: [{ required: true, trigger: 'blur', message: '请填写关键字' }],
    sort: [{ required: true, trigger: 'blur', message: '请填写排列序号' }],
  },
  dialog: {
    isShowDialog: false,
    title: '',
    submitTxt: '',
    type: ''
  },
})

const { loading, ruleForm, rules, dialog } = toRefs(state)

// 打开弹窗
const openDialog = (e: any, id: any) => {
  state.dialog.type = e
  if (!id) {
    state.dialog.title = '新增关键字'
    state.dialog.submitTxt = '新 增'
  } else {
    state.dialog.title = '编辑关键字'
    state.dialog.submitTxt = '编 辑'
    KeywordDetail({ id }).then((data) => {
      state.ruleForm = {
        id: data.id,
        source: data.source,
        keyword: data.keyword,
        sort: data.sort,
      }
    })
  }

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
        addKeyword(ruleForm)
          .then(() => {
            state.loading = false
            closeDialog()
            emit('refresh')
          })
          .catch(() => {
            state.loading = false
          })
      } else {
        state.loading = true
        editKeyword(ruleForm)
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
