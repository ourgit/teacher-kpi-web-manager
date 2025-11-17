<template>
  <div class="page-container layout-padding">
    <el-card shadow="hover" class="layout-padding-auto">
      <el-table :data="list" v-loading="loading" style="width: 100%">
        <el-table-column prop="id" label="ID" width="100" />
        <el-table-column label="操作时间" show-overflow-tooltip width="200">
          <template #default="{ row }">
            {{ formatDate(row.createTime,'YYYY-mm-dd HH:MM:SS') }}
          </template>
        </el-table-column>
        <el-table-column prop="adminId" label="管理员id" show-overflow-tooltip width="100" />
        <el-table-column prop="adminName" label="管理员姓名" show-overflow-tooltip width="150" />
        <el-table-column prop="note" label="操作说明" show-overflow-tooltip />
      </el-table>
      <div class="page-bottom">
        <el-pagination v-model:currentPage="currentPage" background layout="prev, pager, next, jumper" :page-count="totalPage" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { reactive, onMounted, toRefs } from 'vue'
import { formatDate } from '@/utils/formatTime'
import { getLogList } from '@/api/system/log/index'

// 定义变量
const state = reactive({
  list: [],
  loading: false,
  currentPage: 1,
  totalPage: 1,
})

const { list, loading, currentPage, totalPage } = toRefs(state)

// 获取用户列表
const getListData = () => {
  state.loading = true
  getLogList({
    page: state.currentPage,
  }).then((data: any) => {
    state.loading = false
    state.list = data.list
    if (state.currentPage === 1 && data.pages > 0) {
      state.totalPage = data.pages
    }
  })
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
</style>
