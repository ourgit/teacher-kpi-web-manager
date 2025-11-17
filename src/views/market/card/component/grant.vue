<template>
  <div class="dialog-container">
    <el-dialog title="发放卡券券" v-model="isShowDialog" width="800px" :close-on-click-modal="false" :destroy-on-close="true">
      <el-form ref="dialogFormRef" size="default" label-width="90px">
        <el-row :gutter="35">
          <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
            <el-form-item label="卡券名称">
              {{ cardInfo.title }}
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
            <el-form-item label="发放用户" prop="ids">
              <el-table :data="memberList" style="width: 100%">
                <el-table-column prop="uid" label="用户ID" width="100" />
                <el-table-column prop="nickName" label="用户昵称" show-overflow-tooltip />
                <el-table-column prop="phoneNumber" label="手机号码" show-overflow-tooltip />
                <el-table-column fixed="right" label="操作" width="80">
                  <template #default="scope">
                    <el-button size="small" text type="primary" @click="removeMember(scope.$index)">删除</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
            <el-form-item>
              <el-button type="primary" size="default" @click="onOpenSelectMember">选择用户</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="onCancel" size="default">取 消</el-button>
          <el-button type="primary" @click="onSubmit" size="default" :loading="loading">确定发放</el-button>
        </span>
      </template>
    </el-dialog>
    <selectMemberDialog ref="selectMemberDialogRef" @select="onSelectMember" />
  </div>
</template>

<script setup lang="ts">
import { defineAsyncComponent, reactive, toRefs, ref } from 'vue'
import { ElForm, ElMessage } from 'element-plus'
import { batchGrantCard } from '@/api/market/card/index'

// 引入组件
const selectMemberDialog = defineAsyncComponent(
  () => import('@/views/member/component/select.vue')
)

// 定义子组件向父组件传值/事件
const emit = defineEmits(['refresh'])

const selectMemberDialogRef = ref()
const state = reactive({
  loading: false,
  cardInfo: {} as any,
  amount: 1,
  memberList: [] as any,
  isShowDialog: false,
})

const { loading, cardInfo, memberList, isShowDialog } = toRefs(state)

// 打开弹窗
const openDialog = (row: any) => {
  state.memberList = []
  state.cardInfo = row
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

// 打开选择用户弹窗
const onOpenSelectMember = () => {
  selectMemberDialogRef.value.openDialog('checkbox', state.memberList)
}

//绑定选择用户
const onSelectMember = (val: any) => {
  val.map((item: any) => {
    state.memberList.push({
      uid: item.id,
      nickName: item.nickName,
      phoneNumber: item.phoneNumber,
    })
  })
}

// 删除选择用户
const removeMember = (index: number) => {
  state.memberList.splice(index, 1)
}


// 提交
const onSubmit = () => {
  if (!state.memberList.length) {
    ElMessage({
      message: '请选择要发送的用户.',
      type: 'warning',
    })
    return
  }
  state.loading = true
  batchGrantCard({
    configId: state.cardInfo.id,
    amount: state.amount,
    ids: state.memberList.map((item: any) => item.uid),
  })
    .then(() => {
      ElMessage({
        message: '发放成功.',
        type: 'success',
      })
      state.loading = false
      closeDialog()
      emit('refresh')
    })
    .catch(() => {
      state.loading = false
    })
}

// 暴露变量
defineExpose({
  openDialog,
})
</script>
