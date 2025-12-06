<template>
  <div class="page-container layout-padding">
    <el-card shadow="hover" class="layout-padding-auto">
      <el-form class="query" :inline="true">
        <el-form-item>
<!--           <el-button size="default" type="primary" @click="getListData">
            <el-icon>
              <ele-Search />
            </el-icon>
            查询
          </el-button> -->
          <el-button size="success" type="primary" @click="onOpenAdd">
            <el-icon>
              <ele-Plus />
            </el-icon>
            添加
          </el-button>
        </el-form-item>
      </el-form>
      <el-table :data="list" v-loading="loading" style="width: 100%">
        <el-table-column prop="id" label="ID" style="text-align: center;" />
        <el-table-column prop="name" label="标准名" style="text-align: center;" />
        <el-table-column prop="level" label="等级" style="text-align: center;">
          <template #default="{ row }">
            <el-tag :type="getLevelTagType(row.level)">{{ row.level }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="分数规则" style="text-align: center;">
          <template #default="{ row }">
            {{ formatScoreRule(row) }}
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" style="text-align: center;">
          <template #default="{ row }">
            <el-button size="small" text type="primary" @click="onOpenEdit(row)">修改</el-button>
            <el-button size="small" text type="primary" @click="onDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="page-bottom">
        <el-pagination v-model:currentPage="currentPage" background layout="prev, pager, next, jumper" :page-count="totalPage" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
      </div>
    </el-card>
    <addDialog ref="addDialogRef" @refresh="getListData" />
    <editDialog ref="editDialogRef" @refresh="getListData" />
    <deleteDialog ref="deleteDialogRef" @refresh="getListData" />
  </div>
</template>

<script setup lang="ts">
import { defineAsyncComponent, reactive, onMounted, ref, toRefs } from 'vue'
import { getStandardList } from '@/api/sfuw/index'

// 引入组件
const addDialog = defineAsyncComponent(
  () => import('./component/add.vue')
)

const editDialog = defineAsyncComponent(
  () => import('./component/edit.vue')
)

const deleteDialog = defineAsyncComponent(
  () => import('./component/delete.vue')
)

// 定义变量
const editDialogRef = ref()
const addDialogRef = ref()
const deleteDialogRef = ref()
const state = reactive({
  list: [] as any[],
  loading: false,
  currentPage: 1,
  totalPage: 1,
  submitData: {},
})

const { list, loading, currentPage, totalPage } = toRefs(state)

// 格式化分数规则显示（公式形式）
const formatScoreRule = (row: any) => {
  const parts = []
  if (row.leftLimitScore !== null && row.leftLimitScore !== undefined && row.leftOperator) {
    parts.push(`${row.leftLimitScore} ${row.leftOperator} 分数`)
  }
  if (row.op) {
    parts.push(row.op)
  }
  if (row.rightLimitScore !== null && row.rightLimitScore !== undefined && row.rightOperator) {
    parts.push(`${row.rightLimitScore} ${row.rightOperator} 分数`)
  }
  return parts.length > 0 ? parts.join(' ') : '-'
}

// 获取等级标签类型
const getLevelTagType = (level: number) => {
  if (level >= 5) return 'danger'
  if (level >= 4) return 'warning'
  if (level >= 3) return 'info'
  if (level >= 2) return 'success'
  return ''
}

// 获取列表
const getListData = () => {
  state.loading = true
  getStandardList({
    page: state.currentPage,
  }).then((data: any) => {
    state.loading = false
    state.list = data.list || []
    if (state.currentPage === 1 && data.pages > 0) {
      state.totalPage = data.pages
    }
  }).catch(() => {
    state.loading = false
  })
}

const onOpenAdd = () => {
  addDialogRef.value.openDialog()
}

const onDelete = (row: any) => {
  deleteDialogRef.value.openDialog(row)
}

// 设置用户角色
const onOpenEdit = (row: any) => {
  editDialogRef.value.openDialog(row)
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
.page-bottom {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}
</style>

