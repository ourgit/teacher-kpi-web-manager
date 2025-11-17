<template>
  <div class="page-container layout-padding">
    <el-card shadow="hover" class="layout-padding-auto">
      <el-form class="query" :inline="true" size="default" label-width="80px">
        <el-row>
          <el-form-item>
            <el-radio-group v-model="queryData.status" size="default" @change="getListData">
              <el-radio-button :label="0">全部</el-radio-button>
              <el-radio-button :label="1">正常</el-radio-button>
              <el-radio-button :label="2">锁定</el-radio-button>
              <el-radio-button :label="3">待审核</el-radio-button>
              <el-radio-button :label="4">审核未通过</el-radio-button>
            </el-radio-group>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="所属校区">
            <el-select v-model="queryData.areaId" placeholder="选择所属校区" clearable filterable>
              <el-option v-for="item in areaList" :key="item.id" :label="item.name" :value="item.id" />
            </el-select>
          </el-form-item>
          <el-form-item label="关键字">
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
            <el-button size="default" @click="refreshQuery">
              <el-icon>
                <ele-Refresh />
              </el-icon>
              重置
            </el-button>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item>
            <el-button size="default" type="success" class="ml10" @click="onOpenAdd('add')">
              <el-icon>
                <ele-Plus />
              </el-icon>
              新增
            </el-button>
          </el-form-item>
        </el-row>
      </el-form>
      <el-table :data="list" v-loading="loading" style="width: 100%">
        <el-table-column prop="id" label="ID" width="80"></el-table-column>
        <el-table-column label="头像" width="120">
          <template #default="{ row }">
            <img v-if="row.avatar" :src="row.avatar" class="smallImage">
          </template>
        </el-table-column>
        <el-table-column prop="phoneNumber" label="手机号码" show-overflow-tooltip min-width="180" />
        <el-table-column prop="realName" label="姓名" min-width="150" show-overflow-tooltip />
        <el-table-column label="加入时间" width="180">
          <template #default="{ row }">
            {{ formatDate(row.createdTime, 'YYYY-mm-dd HH:MM:SS') }}
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="状态" width="100">
          <template #default="{ row }">
            <el-form>
              <el-tag v-if="row.status === 1" type="success">正常</el-tag>
              <el-tag v-if="row.status === 2" type="danger">锁定</el-tag>
              <el-tag v-if="row.status === 3" type="danger">待审核</el-tag>
              <el-tag v-if="row.status === 4" type="danger">审核未通过</el-tag>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="200">
          <template #default="{ row }">
            <el-form>
              <el-button size="small" text type="primary" @click="onOpenDeliveryFee(row)">配送费配置</el-button>
              <el-button v-if="row.status === 1 || row.status === 2" size="small" text type="primary" @click="onSetStatus(row)">{{ row.status === 1 ? '锁定' : '正常'
              }}</el-button>
              <el-button size="small" text type="primary" @click="onOpenEdit('edit', row)">编辑</el-button>
              <el-button size="small" text type="primary" @click="onRowDel(row)">删除</el-button>
            </el-form>
          </template>
        </el-table-column>
      </el-table>
      <div class="page-bottom">
        <el-pagination v-model:currentPage="currentPage" background layout="prev, pager, next, jumper" :page-count="totalPage" @size-change="getListData" @current-change="getListData" />
      </div>
    </el-card>
    <detailDialog ref="detailDialogRef" @refresh="getListData" />
    <viewDialog ref="viewDialogRef" />
    <deliveryFeeDialog ref="deliveryFeeDialogRef" />
  </div>
</template>

<script setup lang="ts">
import { defineAsyncComponent, reactive, onMounted, toRefs, ref } from 'vue'
import { ElMessageBox, ElMessage } from 'element-plus'
import { formatDate } from '@/utils/formatTime'
import { getDriverList, delDriver, updateDriver } from '@/api/driver/index'
import { getAreaList } from '@/api/base/area/index'
// 引入组件
const detailDialog = defineAsyncComponent(
  () => import('./component/detail.vue')
)

const deliveryFeeDialog = defineAsyncComponent(() => import('./component/deliveryFee.vue'))


const defaultQuery = {
  status: 0,
  filter: '',
  areaId: '',
}

// 定义变量
const detailDialogRef = ref()
const viewDialogRef = ref()
const deliveryFeeDialogRef = ref()
const state = reactive({
  list: [],
  loading: false,
  currentPage: 1,
  totalPage: 1,
  queryData: Object.assign({}, defaultQuery),
  submitData: {},
  areaList: [] as Array<any>,
})

const { list, loading, currentPage, totalPage, queryData, areaList } =
  toRefs(state)

// 获取列表
const getListData = () => {
  state.loading = true
  if (JSON.stringify(state.queryData) !== JSON.stringify(state.submitData)) {
    state.currentPage = 1
  }
  const formData = JSON.parse(JSON.stringify(state.queryData))
  getDriverList({
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

// 获取校区列表
const getAreaListData = () => {
  getAreaList({
    page: 0
  }).then((data: any) => {
    state.areaList = data.list
  })
}


//重置搜索条件
const refreshQuery = () => {
  state.queryData = Object.assign({}, defaultQuery)
  getListData()
}

// 打开修改配送费弹窗
const onOpenDeliveryFee = (row: any) => {
  deliveryFeeDialogRef.value.openDialog(row)
}

// 打开新增弹窗
const onOpenAdd = (type: string) => {
  detailDialogRef.value.openDialog(type)
}
// 打开修改弹窗
const onOpenEdit = (type: string, row: any) => {
  detailDialogRef.value.openDialog(type, row)
}


// 上下架
const onSetStatus = (row: any) => {
  updateDriver({
    id: row.id,
    status: row.status === 1 ? 2 : 1,
  }).then(() => {
    getListData()
  })
}

// 删除
const onRowDel = (row: any) => {
  ElMessageBox.confirm(`您确定要删除此骑手吗?`, '提示', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(() => {
      delDriver({
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
  getAreaListData()
})
</script>

<style scoped lang="scss"></style>
