<template>
  <div class="dialog-container">
    <el-dialog title="充值/扣款" v-model="isShowDialog" width="500px" :close-on-click-modal="false" :destroy-on-close="true">
      <el-form ref="dialogFormRef" :model="ruleForm" :rules="rules" size="default" label-width="120px">
        <el-row :gutter="35">
          <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
            <el-form-item label="用户昵称">
              {{ userInfo.nickName }}
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
            <el-form-item label="手机号码">
              {{ userInfo.phoneNumber }}
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
            <el-form-item label="余额类型">
              <el-select v-model="ruleForm.itemId" placeholder="请选择余额类型" class="w100">
                <el-option label="余额" :value="1"></el-option>
                <el-option label="积分" :value="2"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
            <el-form-item label="充值金额" prop="amount">
              <el-input v-model="ruleForm.amount" placeholder="请输入充值金额，扣款为负数" clearable></el-input>
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
import { reactive, toRefs, ref } from 'vue'
import { ElForm, ElMessage } from 'element-plus'
import { updateBalance } from '@/api/member/index'

// 定义变量内容
const dialogFormRef = ref(ElForm)
const state = reactive({
  loading: false,
  userInfo: {} as any,
  ruleForm: {
    itemId: 1,
    amount: '',
  },
  rules: {
    amount: [{ required: true, trigger: 'blur', message: '请输入充值金额' }],
  },
  isShowDialog: false,
})

const { loading, userInfo, ruleForm, rules, isShowDialog } = toRefs(state)

// 打开弹窗
const openDialog = (row: any) => {
  state.isShowDialog = true
  state.userInfo = row
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
      updateBalance({
        uid: state.userInfo.id,
        itemId: ruleForm.itemId,
        amount: ruleForm.itemId === 1 ? Math.round(ruleForm.amount * 100) : ruleForm.amount,
      })
        .then(() => {
          ElMessage({
            message: '操作成功.',
            type: 'success',
          })
          state.loading = false
          closeDialog()
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
