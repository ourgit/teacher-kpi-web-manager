<template>
  <div class="dialog-container">
    <el-dialog title="添加支付方式" v-model="isShowDialog" width="500px" :close-on-click-modal="false" :destroy-on-close="true">
      <el-form ref="dialogFormRef" :model="ruleForm" :rules="rules" size="default" label-width="120px">
        <el-row :gutter="35">
          <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
            <el-form-item label="支付方式名称" prop="name">
              <el-input v-model="ruleForm.name" placeholder="支付方式名称" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
            <el-form-item label="支付方式值" prop="attrValue">
              <el-input v-model="ruleForm.attrValue" placeholder="请输入支付方式值" clearable></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="onCancel" size="default">取 消</el-button>
          <el-button type="primary" @click="onSubmit" size="default" :loading="loading">确 定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { reactive, toRefs, ref } from 'vue'
import { ElForm } from 'element-plus'
import { addPayMethod } from '@/api/system/payMethod/index'

// 定义子组件向父组件传值/事件
const emit = defineEmits(['refresh'])


// 定义变量内容
const dialogFormRef = ref(ElForm)
const state = reactive({
  loading: false,
  ruleForm: {} as any,
  rules: {
    name: [{ required: true, trigger: 'blur', message: '请填写支付方式名称' }],
    attrValue: [{ required: true, trigger: 'blur', message: '请填写支付方式值' }]
  },
  isShowDialog: false
})

const { loading, ruleForm, rules, isShowDialog } = toRefs(state)

// 打开弹窗
const openDialog = () => {
  state.ruleForm = {
    name: '',
    attrValue: '',
  }
  state.isShowDialog = true
}
// 关闭弹窗
const closeDialog = () => {
  state.isShowDialog = false
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
      addPayMethod(ruleForm)
        .then(() => {
          state.loading = false
          closeDialog()
          emit('refresh')
        })
        .catch(() => {
          state.loading = false
        })
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
