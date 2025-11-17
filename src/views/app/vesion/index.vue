<template>
  <div class="page-container layout-padding">
    <el-card shadow="hover" class="layout-padding-auto">
      <el-form class="query" :inline="true">
        <el-form-item>
          <el-button size="default" type="success" class="ml10" @click="onOpenAdd('add')">
            <el-icon>
              <ele-Plus />
            </el-icon>
            新增版本
          </el-button>
        </el-form-item>
      </el-form>
      <el-table :data="list" v-loading="loading" style="width: 100%">
        <el-table-column prop="id" label="ID" width="100" />
        <el-table-column prop="platform" label="系统平台" width="150"></el-table-column>
        <el-table-column label="版本类型" width="150">
          <template #default="{ row }">
            <span v-if="row.versionType === 1">正式版本</span>
            <span v-if="row.versionType === 2">灰度版本</span>
          </template>
        </el-table-column>
        <el-table-column label="更新类型" width="150">
          <template #default="{ row }">
            <span v-if="row.updateType === 1">热更新</span>
            <span v-if="row.updateType === 2">整包更新</span>
          </template>
        </el-table-column>
        <el-table-column label="提示类型" width="150">
          <template #default="{ row }">
            <span v-if="row.updateType === 1">静默</span>
            <span v-if="row.updateType === 2">弹窗</span>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="版本名" width="100"></el-table-column>
        <el-table-column prop="versionNumber" label="版本号" width="100"></el-table-column>
        <el-table-column prop="normalUpdateRule" label="普通更新规则"></el-table-column>
        <el-table-column prop="forceUpdateRule" label="强制更新规则"></el-table-column>
        <el-table-column label="状态" width="100">
          <template #default="{ row }">
            <el-tag type="success" v-if="row.enable">启用</el-tag>
            <el-tag v-else>禁用</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="100">
          <template #default="{ row }">
            <el-form>
              <el-button size="small" text type="primary" @click="onOpenEdit('edit', row)">编辑</el-button>
              <el-button size="small" text type="primary" @click="onRowDel(row)">删除</el-button>
            </el-form>
          </template>
        </el-table-column>
      </el-table>
      <div class="page-bottom">
        <el-pagination v-model:currentPage="currentPage" background layout="prev, pager, next, jumper" :page-count="totalPage" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
      </div>
    </el-card>
    <detailDialog ref="detailDialogRef" @refresh="getListData" />
  </div>
</template>

<script setup lang="ts">
import { defineAsyncComponent, reactive, onMounted, ref, toRefs } from 'vue'
import { ElMessageBox, ElMessage } from 'element-plus'
import { getVesionList, delVesion } from '@/api/app/vesion/index'

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
  totalPage: 1,
})

const { list, loading, currentPage, totalPage } = toRefs(state)

// 获取列表
const getListData = () => {
  state.loading = true
  getVesionList({
    page: state.currentPage,
  }).then((data: any) => {
    state.loading = false
    state.list = data.list
    if (state.currentPage === 1 && data.pages > 0) {
      state.totalPage = data.pages
    }
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
const handleSizeChange = () => {
  getListData()
}

const handleCurrentChange = () => {
  getListData()
}

// 删除
const onRowDel = (row: any) => {
  ElMessageBox.confirm(`您确定要删除此版本吗?`, '提示', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(() => {
      delVesion({
        id: row.id,
      }).then(() => {
        getListData()
        ElMessage.success('删除成功')
      })
    })
    .catch(() => {})
}

// 页面加载时
onMounted(() => {
  getListData()
})
</script>

<style scoped lang="scss">
</style>
