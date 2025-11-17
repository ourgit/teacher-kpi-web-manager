<template>
  <div class="dialog-container">
    <el-dialog title="设置菜单" v-model="isShowDialog" width="500px" :close-on-click-modal="false" :destroy-on-close="true">
      <el-scrollbar v-loading="listLoading" class="scrollbar">
        <el-tree :data="menuList" :props="{label: 'title'}" node-key="id" show-checkbox default-expand-all :default-checked-keys="selectedList" @check="onCheck" />
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
import { getMenuList } from '@/api/system/menu/index'
import { getMenuByRole, setMenuForRole } from '@/api/system/role/index'

// 定义变量内容
const state = reactive({
  listLoading: false,
  loading: false,
  roleId: 0,
  menuList: [] as any,
  selectedList: [] as any,
  halfSelectedList: [] as any,
  isShowDialog: false,
})

const { listLoading, loading, menuList, selectedList, isShowDialog } =
  toRefs(state)

// 打开弹窗
const openDialog = (id: number) => {
  state.roleId = id
  state.menuList = []
  state.selectedList = []
  state.halfSelectedList = []
  getMenuListData()
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
const getMenuListData = () => {
  state.listLoading = true
  getMenuList().then((data: any) => {
    state.listLoading = false
    state.menuList = data.list
    getRoleMenu()
  })
}

// 获取列表
const getRoleMenu = () => {
  getMenuByRole({
    groupId: state.roleId,
  }).then((data: any) => {
    let selectedList = data.list.map((item: any) => {
      return item.menuId
    })
    selectedList = selectedList.filter((item: any, index: any, arr: any) => {
      return !state.menuList.some((menu: any) => {
        return menu.id === item && menu.children
      })
    })
    state.selectedList = selectedList
  })
}

// 更改选中的权限
const onCheck = (checkedNodes: any, checkedKeys: any) => {
  state.selectedList = checkedKeys.checkedKeys
  state.halfSelectedList = checkedKeys.halfCheckedKeys
}

// 提交
const onSubmit = () => {
  state.loading = true
  const list = state.selectedList.concat(state.halfSelectedList)
  console.log(list)
  state.menuList.forEach((item: any) => {
    item.children = item.children || []
    if (list.indexOf(item.id) === -1) {
      const have = item.children.some((item2: any) => {
        if (list.indexOf(item2.id) !== -1) {
          return true
        }
      })
      if (have) {
        list.push(item.id)
      }
    }
  })

  setMenuForRole({
    id: state.roleId,
    list,
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
