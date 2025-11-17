<template>
  <div class="page-container layout-padding">
    <el-card shadow="hover" class="layout-padding-auto">
      <el-form class="query" :inline="true">
        <el-form-item>
          <el-button size="default" type="success" class="ml10" @click="onOpenAdd()">
            <el-icon>
              <ele-Plus />
            </el-icon>
            新增关键字
          </el-button>
        </el-form-item>
      </el-form>
      <el-table :data="list" v-loading="loading" style="width: 100%">
        <el-table-column prop="id" label="ID" width="100" />
        <el-table-column label="位置" width="100">
          <template #default="{ row }">
            <span v-if="row.source === 1">首页</span>
            <span v-if="row.source === 2">热搜</span>
          </template>
        </el-table-column>
        <el-table-column prop="keyword" label="关键字" show-overflow-tooltip></el-table-column>
        <el-table-column label="操作" width="100">
          <template #default="{ row }">
            <el-button size="small" text type="primary" @click="editRowDel(row)">编辑</el-button>
            <el-button size="small" text type="primary" @click="onRowDel(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <detailDialog ref="detailDialogRef" @refresh="getListData" />
  </div>
</template>

<script setup lang="ts">
import { defineAsyncComponent, reactive, onMounted, ref, toRefs } from 'vue'
import { ElMessageBox, ElMessage } from 'element-plus'
import { getKeywordList, delKeyword } from '@/api/market/keyword/index'
import { formatDate } from '@/utils/formatTime'
// 引入组件
const detailDialog = defineAsyncComponent(
  () => import('./component/detail.vue')
)

// 定义变量
const detailDialogRef = ref()
const state = reactive({
  list: [],
  loading: false,
  currentPage: 1,
})

const { list, loading } = toRefs(state)

// 获取列表
const getListData = () => {
  state.loading = true
  getKeywordList({
  }).then((data: any) => {
    state.loading = false
    state.list = data.list

  })
}
// 打开新增弹窗
const onOpenAdd = () => {
  detailDialogRef.value.openDialog('add')
}
//打开修改
const editRowDel = (row: any) => {
  detailDialogRef.value.openDialog('edit', row.id)
}
// 删除
const onRowDel = (row: any) => {
  ElMessageBox.confirm(
    `此操作将永久删除关键字：“${row.keyword}”，是否继续?`,
    '提示',
    {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning',
    }
  )
    .then(() => {
      delKeyword({
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
