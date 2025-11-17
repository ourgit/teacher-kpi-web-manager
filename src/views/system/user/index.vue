<template>
  <div class="page-container layout-padding">
    <el-card shadow="hover" class="layout-padding-auto">
      <el-form class="query" :inline="true">
        <el-form-item>
          <el-button size="default" type="success" class="ml10" @click="onOpenAdd('add')">
            <el-icon>
              <ele-Plus />
            </el-icon>
            新增管理员
          </el-button>
        </el-form-item>
      </el-form>
      <el-table :data="list" v-loading="loading" style="width: 100%">
        <el-table-column prop="id" label="ID" width="100" />
        <el-table-column prop="userName" label="账户名称" show-overflow-tooltip></el-table-column>
        <el-table-column prop="realName" label="用户昵称" show-overflow-tooltip></el-table-column>
        <el-table-column prop="groupName" label="关联角色" show-overflow-tooltip></el-table-column>
        <el-table-column label="用户状态" show-overflow-tooltip>
          <template #default="{ row }">
            <el-tag type="success" v-if="row.status === 1">启用</el-tag>
            <el-tag type="danger" v-else>锁定</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="创建时间" show-overflow-tooltip>
          <template #default="{ row }">
            {{ formatDate(row.createdTime, 'YYYY-mm-dd HH:MM:SS') }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200">
          <template #default="{ row }">
            <el-button size="small" text type="primary" @click="onOpenEdit('edit', row)">修改</el-button>
            <el-button size="small" text type="primary" @click="onOpenEditPassword(row)">修改密码</el-button>
            <el-button size="small" text type="primary" @click="onRowDel(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <detailDialog ref="detailDialogRef" @refresh="getListData" />
    <editPasswordDialog ref="editPasswordDialogRef" />
  </div>
</template>

<script setup lang="ts">
import { defineAsyncComponent, reactive, onMounted, ref, toRefs } from 'vue'
import { ElMessageBox, ElMessage } from 'element-plus'
import { formatDate } from '@/utils/formatTime'
import { getUserList, delUser } from '@/api/system/user/index'
// 引入组件
const detailDialog = defineAsyncComponent(
  () => import('./component/dialog.vue')
)

const editPasswordDialog = defineAsyncComponent(
  () => import('./component/editPassword.vue')
)

// 定义变量
const detailDialogRef = ref()
const editPasswordDialogRef = ref()
const state = reactive({
  list: [],
  loading: false,
})

const { list, loading } = toRefs(state)

// 获取列表
const getListData = () => {
  state.loading = true
  getUserList().then((data: any) => {
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

// 打开修改密码弹窗
const onOpenEditPassword = (row: any) => {
  editPasswordDialogRef.value.openDialog(row)
}

// 删除
const onRowDel = (row: any) => {
  ElMessageBox.confirm(
    `此操作将永久删除账户：“${row.userName}”，是否继续?`,
    '提示',
    {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning',
    }
  )
    .then(() => {
      delUser({
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
