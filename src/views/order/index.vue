<template>
  <div class="page-container layout-padding">
    <el-card shadow="hover" class="layout-padding-auto">
      <el-form class="query" :inline="true" size="default" label-width="120px">
        <el-row>
          <el-form-item>
            <el-radio-group v-model="queryData.status" size="default" @change="getListData">
              <el-radio-button :label="0">全部</el-radio-button>
              <el-radio-button :label="1">待付款</el-radio-button>
              <el-radio-button :label="3">已支付</el-radio-button>
              <el-radio-button :label="5">已上链</el-radio-button>
              <el-radio-button :label="6">已售出</el-radio-button>
              <el-radio-button :label="7">已邮寄</el-radio-button>
              <el-radio-button :label="-1">已失效</el-radio-button>
            </el-radio-group>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="订单编号">
            <el-input v-model="queryData.orderNo" size="default" placeholder="请输入订单编号" clearable> </el-input>
          </el-form-item>
          <el-form-item label="用户名称">
            <el-input v-model="queryData.userName" size="default" placeholder="请输入用户名称" clearable> </el-input>
          </el-form-item>
          <el-form-item label="订单类型">
            <el-select v-model="queryData.orderType" size="default" placeholder="订单类型" clearable>
              <el-option label="普通订单" :value="1" />
              <el-option label="积分订单" :value="2" />
            </el-select>
          </el-form-item>
          <el-form-item label="日期">
            <el-date-picker size="default" v-model="timeRange" type="daterange" range-separator="至" start-placeholder="开始时间" end-placeholder="结束时间" format="YYYY-MM-DD" value-format="x" />
          </el-form-item>
          <el-form-item>
            <el-button size="default" type="primary" @click="getListData">
              <el-icon>
                <ele-Search />
              </el-icon>
              查询
            </el-button>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item>
            <el-button size="default" :loading="exportLoading" type="primary" @click="downloadFile">
              <el-icon>
                <ele-Download />
              </el-icon>
              导出
            </el-button>
          </el-form-item>
        </el-row>
      </el-form>
      <el-table :data="list" v-loading="loading" style="width: 100%">
        <el-table-column prop="orderNo" label="订单编号" show-overflow-tooltip></el-table-column>
        <el-table-column label="商品信息" show-overflow-tooltip>
          <template #default="{ row }">
            {{ row.nftType === 10 ? row.nftName : row.mhName }}
          </template>
        </el-table-column>
        <el-table-column label="用户姓名" show-overflow-tooltip width="180">
          <template #default="{ row }">
            {{ row.userName }}(UID:{{ row.uid }})
          </template>
        </el-table-column>
        <el-table-column label="推广人姓名" width="180">
          <template #default="{ row }">
            <span v-if="row.dealerName">{{ row.dealerName }}(UID:{{ row.dealerUid }})</span>
          </template>
        </el-table-column>
        <el-table-column label="订单金额" width="150">
          <template #default="{ row }">
            {{ parseMoney(row.realPay) }}
          </template>
        </el-table-column>
        <el-table-column label="订单类型" width="100">
          <template #default="{ row }">
            <el-tag type="success" v-if="row.nftType === 10">NFT</el-tag>
            <el-tag v-if="row.nftType === 20">盲盒</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="订单状态" width="150">
          <template #default="{ row }">
            {{ formatOrderStatus(row.status) }}
          </template>
        </el-table-column>
        <el-table-column label="创建时间" width="200">
          <template #default="{ row }">
            {{ formatDate(row.createTime, 'YYYY-mm-dd HH:MM:SS') }}
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="100">
          <template #default="{ row }">
            <el-form>
              <el-button size="small" text type="primary" @click="onOpenDetail(row)">详情</el-button>
            </el-form>
          </template>
        </el-table-column>
      </el-table>
      <div class="page-bottom">
        <el-pagination v-model:currentPage="currentPage" background layout="prev, pager, next, jumper" :page-count="totalPage" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
      </div>
    </el-card>
    <detailDialog ref="detailDialogRef" />
  </div>
</template>

<script setup lang="ts">
import {
  defineAsyncComponent,
  reactive,
  onMounted,
  ref,
  toRefs,
  watch,
} from 'vue'
import { formatDate } from '@/utils/formatTime'
import { getOrderList } from '@/api/order/index'
import { formatOrderStatus, parseMoney } from '@/utils/filters'
// 引入组件
const detailDialog = defineAsyncComponent(
  () => import('./component/detail.vue')
)

// 定义变量
const detailDialogRef = ref()
const timeRange = ref('')
const state = reactive({
  list: [],
  loading: false,
  currentPage: 1,
  totalPage: 1,
  queryData: {
    status: 0,
    orderNo: '',
    userName: '',
    orderType: '',
    beginTime: 0,
    endTime: 0,
  },
  submitData: {},
  exportLoading: false,
})

const { list, loading, currentPage, totalPage, queryData, exportLoading } =
  toRefs(state)

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
  getOrderList({
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
const onOpenDetail = (row: any) => {
  detailDialogRef.value.openDialog(row)
}

const handleSizeChange = () => {
  getListData()
}

const handleCurrentChange = () => {
  getListData()
}

//导出表格
const downloadFile = () => {
  import('@/utils/export.js').then((excel) => {
    state.exportLoading = true
    getOrderList({ page: 0, ...state.submitData }).then((data) => {
      const exportJsonToExcel = excel.export_json_to_excel
      const tableHead = ['订单号', '商家名称']
      const filterVal = ['orderNo', 'orgName']
      const tableBody = data.list.map((v: any) => filterVal.map((j) => v[j]))
      state.exportLoading = false
      exportJsonToExcel({
        header: tableHead,
        data: tableBody,
        filename: '订单记录',
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
