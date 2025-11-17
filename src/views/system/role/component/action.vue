<template>
  <div class="dialog-container">
    <el-dialog title="设置权限" v-model="isShowDialog" width="500px" :close-on-click-modal="false" :destroy-on-close="true">
      <el-scrollbar v-loading="listLoading" class="scrollbar">
        <el-tree :data="actionList" :props="{label: 'title'}" node-key="id" show-checkbox default-expand-all :default-checked-keys="selectedList" @check="onCheck" />
      </el-scrollbar>
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
import { reactive, toRefs } from 'vue'
import { getActionList } from '@/api/system/action/index'
import { getActionByRole, setActionForRole } from '@/api/system/role/index'

// 定义变量内容
const state = reactive({
  listLoading: false,
  loading: false,
  roleId: 0,
  actionList: [] as any,
  selectedList: [] as any,
  isShowDialog: false,
})

const { listLoading, loading, actionList, selectedList, isShowDialog } =
  toRefs(state)

// 打开弹窗
const openDialog = (id: number) => {
  state.roleId = id
  state.actionList = []
  state.selectedList = []
  getActionListData()
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

// 获取列表
const getActionListData = () => {
  state.listLoading = true
  getActionList().then((data: any) => {
    state.listLoading = false
    state.actionList = data.list
    getRoleAction()
  })
}

// 获取列表
const getRoleAction = () => {
  getActionByRole({
    id: state.roleId,
  }).then((data: any) => {
    state.selectedList = data.list.map((item: any) => {
      return item.id
    })
  })
}

// 更改选中的权限
const onCheck = (checkedNodes: any, checkedKeys: any) => {
  state.selectedList = checkedKeys.checkedKeys
}

// 提交
const onSubmit = () => {
  state.loading = true
  const actionId = state.selectedList
    .filter((item: any) => {
      return item.length === 32
    })
    .join(',')
  setActionForRole({
    groupId: state.roleId,
    actionId,
  })
    .then(() => {
      state.loading = false
      closeDialog()
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
