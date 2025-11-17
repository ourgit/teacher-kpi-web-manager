<template>
  <div class="dialog-container">
    <el-dialog :title="dialog.title" v-model="dialog.isShowDialog" width="800px" :close-on-click-modal="false" :destroy-on-close="true">
      <el-descriptions class="margin-top" :column="2" size="default" border>
        <el-descriptions-item>
          <template #label>
            <div class="cell-item">
              姓名
            </div>
          </template>
          {{ userInfo.name }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>
            <div class="cell-item">
              身份证号码
            </div>
          </template>
          {{ userInfo.num }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>
            <div class="cell-item">
              国籍
            </div>
          </template>
          {{ userInfo.nationality }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>
            <div class="cell-item">
              性别
            </div>
          </template>
          {{ userInfo.sex }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>
            <div class="cell-item">
              出生年月
            </div>
          </template>
          {{ userInfo.birth }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>
            <div class="cell-item">
              发证机构
            </div>
          </template>
          {{ userInfo.issue }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>
            <div class="cell-item">
              证件开始日期
            </div>
          </template>
          {{ userInfo.startDate }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>
            <div class="cell-item">
              证件结束日期
            </div>
          </template>
          {{ userInfo.endDate }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>
            <div class="cell-item">
              通讯地址
            </div>
          </template>
          {{ userInfo.address }}
        </el-descriptions-item>
      </el-descriptions>
      <div class="setcion-wrap">
        <el-row :gutter="35">
          <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
            <el-image style="width: 90%;" :src="authInfo.idCardFrontUrl" :preview-src-list="[authInfo.idCardFrontUrl]" />
          </el-col>
          <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
            <el-image style="width: 90%;" :src="authInfo.idCardBackUrl" :preview-src-list="[authInfo.idCardBackUrl]" />
          </el-col>
        </el-row>
      </div>
      <div v-if="authInfo.status === 10" class="setcion-wrap">
        <el-form ref="detailFormRef" :model="ruleForm" :rules="rules" size="default" label-width="90px">
          <el-row :gutter="35">
            <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
              <el-form-item label="审核状态">
                <el-select v-model="ruleForm.status" placeholder="请选择" class="w100">
                  <el-option label="审核通过" :value="20" />
                  <el-option label="审核拒绝" :value="-10" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
              <el-form-item label="审核意见" prop="auditNote">
                <el-input v-model="ruleForm.auditNote" type="textarea" placeholder="请输入审核意见"></el-input>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
              <el-form-item>
                <el-button type="primary" @click="onSubmit" size="default" :loading="loading">提交</el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <div v-else class="setcion-wrap">
        <el-form size="default" label-width="90px">
          <el-row :gutter="35">
            <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
              <el-form-item label="审核状态">
                <el-tag type="warning" v-if="authInfo.status === 10">待审核</el-tag>
                <el-tag type="success" v-if="authInfo.status === 20">已审核</el-tag>
                <el-tag type="danger" v-if="authInfo.status === -10">审核拒绝</el-tag>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
              <el-form-item label="审核意见">
                {{ authInfo.auditNote }}
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="onCancel" size="default">关 闭</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { reactive, toRefs, ref } from 'vue'
import { ElForm } from 'element-plus'


// 定义子组件向父组件传值/事件
const emit = defineEmits(['refresh'])

// 定义变量内容
const detailFormRef = ref(ElForm)

function validateAuditNote(rule: any, value: any, callback: any) {
  if (state.ruleForm.status === -10 && !value) {
    callback(new Error('请填写审核拒绝理由'))
  } else {
    callback()
  }
}

const state = reactive({
  authInfo: {} as any,
  userInfo: {} as any,
  ruleForm: {
    id: '',
    status: 20,
    auditNote: '',
  },
  rules: {
    auditNote: [
      { required: true, trigger: 'blur', validator: validateAuditNote },
    ],
  },
  loading: false,
  dialog: {
    isShowDialog: false,
    type: '',
    title: '',
  },
})

const { authInfo, userInfo, ruleForm, rules, loading, dialog } = toRefs(state)

// 打开弹窗
const openDialog = (type: string, row: any) => {
  state.dialog.type = type
  state.dialog.isShowDialog = true
  state.dialog.title = '实名认证详情'
  getAuthDetail({
    id: row.id,
  }).then((res) => {
    state.ruleForm.id = row.id
    state.authInfo = res.authApplyLog
    state.userInfo = res.authApplyLog.idCard
  })
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
  detailFormRef.value.validate((valid: boolean) => {
    if (valid) {
      state.loading = true
      applyAudit(state.ruleForm)
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
<style lang="scss" scoped>
.setcion-wrap {
  margin-top: 20px;
}
</style>