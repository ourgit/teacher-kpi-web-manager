<template>
  <div class="page-container layout-padding">
    <el-card shadow="hover" class="layout-padding-auto">
      <el-form class="query" :inline="true">
        <el-form-item>
          <el-radio-group v-model="queryData.status" size="default" @change="getListData">
            <el-radio-button :label="0">全部</el-radio-button>
            <el-radio-button :label="1">未使用</el-radio-button>
            <el-radio-button :label="2">已使用</el-radio-button>
            <el-radio-button :label="3">失效</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item>
          <el-input v-model="queryData.uid" size="default" placeholder="用户UID" clearable> </el-input>
        </el-form-item>
        <el-form-item>
          <el-input v-model="queryData.couponId" size="default" placeholder="优惠券ID" clearable> </el-input>
        </el-form-item>
        <el-form-item>
          <el-date-picker size="default" v-model="timeRange" type="monthrange" range-separator="至"
            start-placeholder="开始时间" end-placeholder="结束时间" format="YYYY-MM-DD" value-format="x" />
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
          <el-button size="default" @click="refreshQuery">
            <el-icon>
              <ele-Refresh />
            </el-icon>
            重置
          </el-button>
        </el-form-item>
        <el-form-item>
          <el-button size="default" :loading="exportLoading" type="primary" @click="downloadFile">
            <el-icon>
              <ele-Download />
            </el-icon>
            导出
          </el-button>
        </el-form-item>
      </el-form>
      <el-table :data="list" v-loading="loading" style="width: 100%">
        <el-table-column prop="uid" label="用户ID" width="150" />
        <el-table-column prop="userName" label="用户名称" width="150" />
        <el-table-column prop="couponName" label="优惠券名称" width="150" show-overflow-tooltip />
        <el-table-column label="领取时间" show-overflow-tooltip>
          <template #default="{ row }">
            {{ formatDate(row.beginTime, 'YYYY-mm-dd HH:MM:SS') }}
          </template>
        </el-table-column>
        <el-table-column label="过期时间" show-overflow-tooltip>
          <template #default="{ row }">
            {{ formatDate(row.endTime, 'YYYY-mm-dd HH:MM:SS') }}
          </template>
        </el-table-column>
        <el-table-column label="使用时间" show-overflow-tooltip>
          <template #default="{ row }">
            <span v-if="row.useTime">{{ formatDate(row.useTime, 'YYYY-mm-dd HH:MM:SS') }}</span>
          </template>
        </el-table-column>
        <el-table-column label="状态" show-overflow-tooltip>
          <template #default="{ row }">
            <el-tag v-if="row.status == 1">未使用</el-tag>
            <el-tag v-if="row.status == 2" type="success">已使用</el-tag>
            <el-tag v-if="row.status == 3" type="danger">已失效</el-tag>
          </template>
        </el-table-column>
      </el-table>
      <div class="page-bottom">
        <el-pagination v-model:currentPage="currentPage" background layout="prev, pager, next, jumper"
          :page-count="totalPage" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { reactive, onMounted, toRefs, ref, watch } from 'vue'
import { formatDate } from '@/utils/formatTime'
import { userCouponsRecord } from '@/api/coupons/index'

// 定义变量
const defaultQuery = {
  status: 0,
  uid: '',
  couponId: '',
  beginTime: 0,
  endTime: 0
}
const timeRange = ref('')
const state = reactive({
  list: [],
  loading: false,
  currentPage: 1,
  totalPage: 1,
  queryData: Object.assign({}, defaultQuery),
  submitData: {},
  exportLoading: false,
})

const { list, loading, currentPage, totalPage, queryData, exportLoading } = toRefs(state)

watch(timeRange, (newValue: any) => {
  if (newValue && newValue[0] && newValue[1]) {
    state.queryData.beginTime = newValue[0] / 1000 || 0
    state.queryData.endTime =
      (newValue[1] + 24 * 60 * 60 * 1000 - 1000) / 1000 || 0
  } else {
    state.queryData.beginTime = 0
    state.queryData.endTime = 0
  }
})

// 获取列表
const getListData = () => {
  state.loading = true
  if (JSON.stringify(state.queryData) !== JSON.stringify(state.submitData)) {
    state.currentPage = 1
  }
  const formData = JSON.parse(JSON.stringify(state.queryData))
  userCouponsRecord({
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

//重置搜索条件
const refreshQuery = () => {
  state.queryData = Object.assign({}, defaultQuery)
  timeRange.value = ''
  getListData()
}


const handleSizeChange = () => {
  getListData()
}

const handleCurrentChange = () => {
  getListData()
}

//格式化状态
const formatStatus = (status: number) => {
  let statusName = ''
  switch (status) {
    case 1:
      statusName = '未使用'
      break
    case 2:
      statusName = '已使用'
      break
    case 3:
      statusName = '已失效'
      break
  }
  return statusName
}

//导出表格
const downloadFile = () => {
  import('@/utils/export.js').then((excel) => {
    state.exportLoading = true
    userCouponsRecord({ page: 0, ...state.submitData }).then((data: any) => {
      data.list.map((item: any) => {
        item.beginTime = formatDate(item.beginTime, 'YYYY-mm-dd HH:MM:SS')
        item.endTime = formatDate(item.endTime, 'YYYY-mm-dd HH:MM:SS')
        item.useTime = item.useTime ? formatDate(item.useTime, 'YYYY-mm-dd HH:MM:SS') : ''
        item.status = formatStatus(item.status)
        return item
      })
      const exportJsonToExcel = excel.export_json_to_excel
      const tableHead = [
        '用户ID',
        '用户名称',
        '优惠券名称',
        '领取时间',
        '过期时间',
        '使用时间',
        '状态',
      ]
      const filterVal = [
        'uid',
        'userName',
        'couponName',
        'beginTime',
        'endTime',
        'useTime',
        'status',
      ]
      const tableBody = data.list.map((v: any) => filterVal.map((j) => v[j]))
      state.exportLoading = false
      exportJsonToExcel({
        header: tableHead,
        data: tableBody,
        filename: '用户优惠券列表',
        autoWidth: true,
      })
    })
  })
}

// 页面加载时
onMounted(() => {
  getListData()
})
</script>

<style scoped lang="scss"></style>
