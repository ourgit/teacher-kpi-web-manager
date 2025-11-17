<template>
  <div class="page-container layout-padding">
    <el-card shadow="hover" class="layout-padding-auto">
      <el-form class="query" :inline="true">
        <el-form-item>
          <el-button size="default" type="success" class="ml10" @click="onOpenAdd('add')">
            <el-icon>
              <ele-Plus />
            </el-icon>
            新增配置
          </el-button>
        </el-form-item>
      </el-form>
      <el-table :data="list" v-loading="loading" style="width: 100%">
        <el-table-column prop="id" label="ID" width="100" />
        <el-table-column prop="key" label="key" show-overflow-tooltip></el-table-column>
        <el-table-column label="使用位置" show-overflow-tooltip width="100">
          <template #default="{ row }">
            <span type="success" v-if="row.source === 1">前台</span>
            <span type="primary" v-if="row.source === 2">后台</span>
          </template>
        </el-table-column>
        <el-table-column label="参数类型" show-overflow-tooltip width="100">
          <template #default="{ row }">
            <span v-if="row.contentType === 1">文本</span>
            <span v-if="row.contentType === 2">图片</span>
            <span v-if="row.contentType === 3">颜色</span>
            <span v-if="row.contentType === 4">开关</span>
          </template>
        </el-table-column>
        <el-table-column prop="note" label="备注" show-overflow-tooltip></el-table-column>
        <el-table-column label="操作" width="100">
          <template #default="{ row }">
            <el-form>
              <el-button size="small" text type="primary" @click="onOpenEdit('edit', row)">编辑</el-button>
              <el-divider direction="vertical" />
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
import { getConfigList, delConfig } from '@/api/system/config/index'
// 引入组件
const detailDialog = defineAsyncComponent(
  () => import('./component/dialog.vue')
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
  getConfigList({
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
// 删除
const onRowDel = (row: any) => {
  ElMessageBox.confirm(`您确认要删除此配置吗?`, '提示', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(() => {
      delConfig({
        id: row.id,
      }).then(() => {
        getListData()
        ElMessage.success('删除成功')
      })
    })
    .catch(() => { })
}

const handleSizeChange = () => {
  getListData()
}

const handleCurrentChange = () => {
  getListData()
}

// 页面加载时
onMounted(() => {
  getListData()
})
</script>

<style scoped lang="scss"></style>
