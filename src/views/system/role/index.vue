<template>
  <div class="page-container layout-padding">
    <el-card shadow="hover" class="layout-padding-auto">
      <el-form class="query" :inline="true">
        <el-form-item>
          <el-button size="default" type="success" class="ml10" @click="onOpenAdd('add')">
            <el-icon>
              <ele-Plus />
            </el-icon>
            新增角色
          </el-button>
        </el-form-item>
      </el-form>
      <el-table :data="list" v-loading="loading" style="width: 100%">
        <el-table-column prop="id" label="ID" width="100" />
        <el-table-column prop="groupName" label="角色名称" show-overflow-tooltip></el-table-column>
        <el-table-column prop="description" label="备注" show-overflow-tooltip></el-table-column>
        <el-table-column label="身份" show-overflow-tooltip>
          <template #default="{ row }">
            <el-tag type="success" v-if="row.isAdmin">管理人员</el-tag>
            <el-tag v-else>普通成员</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="300">
          <template #default="{ row }">
            <el-form :disabled="row.groupName === '超级管理员'">
              <el-button size="small" text type="primary" @click="onOpenEdit('edit', row)">编辑</el-button>
              <el-button size="small" text type="primary" @click="openMenu(row.id)">设置菜单</el-button>
              <el-button size="small" text type="primary" @click="openAction(row.id)">设置权限</el-button>
              <el-button size="small" text type="primary" @click="onRowDel(row)">删除</el-button>
            </el-form>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <detailDialog ref="detailDialogRef" @refresh="getListData" />
    <menuDialog ref="menuDialogRef" />
    <actionDialog ref="actionDialogRef" />
  </div>
</template>

<script setup lang="ts">
import { defineAsyncComponent, reactive, onMounted, ref, toRefs } from 'vue'
import { ElMessageBox, ElMessage } from 'element-plus'
import { getRoleList, delRole } from '@/api/system/role/index'
// 引入组件
const detailDialog = defineAsyncComponent(
  () => import('./component/dialog.vue')
)

const menuDialog = defineAsyncComponent(() => import('./component/menu.vue'))

const actionDialog = defineAsyncComponent(
  () => import('./component/action.vue')
)

// 定义变量
const detailDialogRef = ref()
const menuDialogRef = ref()
const actionDialogRef = ref()
const state = reactive({
  list: [],
  loading: false,
})

const { list, loading } = toRefs(state)

// 获取列表
const getListData = () => {
  state.loading = true
  getRoleList().then((data: any) => {
    state.loading = false
    state.list = data.list
  })
}
// 打开新增弹窗
const onOpenAdd = (type: string) => {
  detailDialogRef.value.openDialog(type)
}
// 打开修改弹窗
const onOpenEdit = (type: string, row: any) => {
  detailDialogRef.value.openDialog(type, row)
}
// 打开设置菜单弹窗
const openMenu = (id: number) => {
  menuDialogRef.value.openDialog(id)
}
// 打开设置权限弹窗
const openAction = (id: number) => {
  actionDialogRef.value.openDialog(id)
}

// 删除
const onRowDel = (row: any) => {
  ElMessageBox.confirm(
    `此操作将永久删除角色名称：“${row.groupName}”，是否继续?`,
    '提示',
    {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning',
    }
  )
    .then(() => {
      delRole({
        id: row.id,
      }).then(() => {
        getListData()
        ElMessage.success('删除成功')
      })
    })
    .catch(() => { })
}
// 页面加载时
onMounted(() => {
  getListData()
})
</script>

<style scoped lang="scss"></style>
