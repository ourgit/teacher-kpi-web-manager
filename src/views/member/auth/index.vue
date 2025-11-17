<template>
  <div class="page-container layout-padding">
    <el-card shadow="hover" class="layout-padding-auto">
      <el-form class="query" :inline="true">
        <el-form-item>
          <el-radio-group v-model="queryData.status" size="default" @change="getListData">
            <el-radio-button :label="0">全部</el-radio-button>
            <el-radio-button :label="10">待审核</el-radio-button>
            <el-radio-button :label="20">已审核</el-radio-button>
            <el-radio-button :label="-10">审核拒绝</el-radio-button>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <el-table :data="list" v-loading="loading" style="width: 100%">
        <el-table-column prop="id" label="Id" width="100" />
        <el-table-column prop="uid" label="UID" width="100"></el-table-column>
        <el-table-column prop="userName" label="姓名"></el-table-column>
        <el-table-column label="申请时间" show-overflow-tooltip width="180">
          <template #default="{ row }">
            {{ formatDate(row.createTime, 'YYYY-mm-dd HH:MM:SS') }}
          </template>
        </el-table-column>
        <el-table-column prop="auditorName" label="审核人"></el-table-column>
        <el-table-column label="审核时间" show-overflow-tooltip width="180">
          <template #default="{ row }">
            <span v-if="row.auditTime">{{ formatDate(row.auditTime, 'YYYY-mm-dd HH:MM:SS') }}</span>
          </template>
        </el-table-column>
        <el-table-column label="状态" width="150">
          <template #default="{ row }">
            <el-tag type="warning" v-if="row.status === 10">待审核</el-tag>
            <el-tag type="success" v-if="row.status === 20">已审核</el-tag>
            <el-tag type="danger" v-if="row.status === -10">审核拒绝</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="100">
          <template #default="{ row }">
            <el-form>
              <el-button size="small" text type="primary" @click="onOpenDetail('view', row)">详情</el-button>
              <el-button v-if="row.status === 10" size="small" text type="primary" @click="onOpenDetail('audit', row)">审核</el-button>
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
  totalPage: 1,
  queryData: {
    status: 0,
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
  getAuthList({
    page: state.currentPage,
    ...formData,
  }).then((data: any) => {
    state.loading = false
    state.list = data.list
    if (state.currentPage === 1 && data.pages > 0) {
      state.totalPage = data.pages
    }
    state.submitData = JSON.parse(JSON.stringify(state.queryData))
  })
}

// 打开详情弹窗
const onOpenDetail = (type: string, row: any) => {
  detailDialogRef.value.openDialog(type, row)
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

<style scoped lang="scss">
.el-dropdown-link {
  cursor: pointer;
  color: var(--el-color-primary);
  display: flex;
  align-items: center;
  font-size: 12px;
}
</style>
