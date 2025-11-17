<template>
  <div class="page-container layout-padding">
    <el-card shadow="hover" class="layout-padding-auto">
      <el-form class="query" :inline="true">
        <el-form-item>
          <el-input v-model="queryData.filter" size="default" placeholder="请输入关键字" clearable> </el-input>
        </el-form-item>
        <el-form-item>
          <el-button size="default" type="primary" @click="getListData">
            <el-icon>
              <ele-Search />
            </el-icon>
            查询
          </el-button>
        </el-form-item>
        <el-form-item>
          <el-button size="default" type="success" class="ml10" @click="onOpenAdd('add')">
            <el-icon>
              <ele-Plus />
            </el-icon>
            新增轮播
          </el-button>
        </el-form-item>
      </el-form>
      <el-table :data="list" v-loading="loading" style="width: 100%">
        <el-table-column prop="id" label="ID" width="100" />
        <el-table-column label="轮播图片" width="150">
          <template #default="{ row }">
            <img :src="row.imgUrl" class="image">
          </template>
        </el-table-column>
        <el-table-column prop="name" label="轮播名称" show-overflow-tooltip></el-table-column>
        <el-table-column prop="description" label="备注" show-overflow-tooltip></el-table-column>
        <el-table-column prop="sort" label="排序" show-overflow-tooltip></el-table-column>
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
import { formatDate } from '@/utils/formatTime'
import { getCarouselsList, delCarousels } from '@/api/market/carousels/index'
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
  queryData: {
    filter: '',
    queryType: '',
    bizType: '',
  },
  submitData: {},
})

const { list, loading, currentPage, totalPage, queryData } = toRefs(state)

// 获取列表
const getListData = () => {
  state.loading = true
  if (JSON.stringify(state.queryData) !== JSON.stringify(state.submitData)) {
    state.currentPage = 1
  }
  const formData = JSON.parse(JSON.stringify(state.queryData))
  getCarouselsList({
    page: state.currentPage,
    ...formData,
  }).then((data: any) => {
    console.log(data)
    state.loading = false
    state.list = data.list
    if (state.currentPage === 1 && data.pages > 0) {
      state.totalPage = data.pages
    }
    state.submitData = JSON.parse(JSON.stringify(state.queryData))
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
  ElMessageBox.confirm(`您确定要删除此轮播图吗?`, '提示', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(() => {
      delCarousels({
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
