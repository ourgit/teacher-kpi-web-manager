<template>
  <div>
    <el-table :data="list" v-loading="loading" height="400" style="width: 100%">
      <el-table-column type="expand" width="30">
        <template #default="{ row }">
          <el-table :data="row.detailList">
            <el-table-column align="center" label="商品ID">
              <template #default="scope2">
                {{ scope2.row.productId }}
              </template>
            </el-table-column>
            <el-table-column align="center" label="商品名称">
              <template #default="scope2">
                {{ scope2.row.productName }}
              </template>
            </el-table-column>
            <el-table-column align="center" label="商品单价">
              <template #default="scope2">
                {{ parseMoney(scope2.row.productPrice) }}
              </template>
            </el-table-column>
            <el-table-column align="center" label="商品数量">
              <template #default="scope2">
                {{ scope2.row.number }}
              </template>
            </el-table-column>
            <el-table-column align="center" label="商品总价">
              <template #default="scope2">
                {{ parseMoney(scope2.row.subTotal) }}
              </template>
            </el-table-column>
          </el-table>
        </template>
      </el-table-column>
      <el-table-column prop="orderNo" label="订单编号" min-width="200" show-overflow-tooltip></el-table-column>
      <el-table-column prop="productCount" label="商品数量" width="100"></el-table-column>
      <el-table-column label="订单金额" width="100">
        <template #default="{ row }">
          {{ parseMoney(row.realPay) }}
        </template>
      </el-table-column>
      <el-table-column label="利润" width="100">
        <template #default="{ row }">
          {{ parseMoney(row.profit) }}
        </template>
      </el-table-column>
      <el-table-column prop="shopName" label="店铺" min-width="180" show-overflow-tooltip></el-table-column>
      <el-table-column prop="staffName" label="员工" min-width="150" show-overflow-tooltip></el-table-column>
      <el-table-column prop="operatorName" label="操作人" width="120" />
      <el-table-column label="订单来源" width="120">
        <template #default="{ row }">
          {{ row.source === 1 ? '门店' : '小程序' }}
        </template>
      </el-table-column>
      <el-table-column label="下单时间" width="200">
        <template #default="{ row }">
          {{ formatDate(row.createTime, 'YY-mm-dd HH:MM:SS') }}
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="订单状态" width="100">
        <template #default="{ row }">
          {{ formatOrderStatus(row.status) }}
        </template>
      </el-table-column>
    </el-table>
    <div class="mt20">
      <el-pagination v-model:currentPage="currentPage" background layout="prev, pager, next, jumper" :page-count="totalPage" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, toRefs, onMounted } from 'vue'
import { formatDate } from '@/utils/formatTime'
import { formatOrderStatus, parseMoney } from '@/utils/filters'
import { getOrderList } from '@/api/order/index'

const props = defineProps({
  uid: {
    type: Number,
    default: 0,
  }
})

// 定义变量内容
const state = reactive({
  list: [],
  loading: false,
  currentPage: 1,
  totalPage: 1,
})

const { list, loading, currentPage, totalPage } =
  toRefs(state)


// 获取列表
const getListData = () => {
  state.loading = true
  getOrderList({
    uid: props.uid,
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
<style lang="scss" scoped>
.select-footer {
  display: flex;

  .footer-btn {
    margin-right: 10px;
  }
}
</style>