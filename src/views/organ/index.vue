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
              <!-- <el-radio-button :label="3">已过期</el-radio-button> -->
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
        <el-table-column prop="id" label="商家ID" width="80"></el-table-column>
        <el-table-column label="商家LOGO" width="120">
          <template #default="{ row }">
            <img :src="row.rectLogo" class="smallImage">
          </template>
        </el-table-column>
        <el-table-column prop="name" label="商家名称" show-overflow-tooltip min-width="180" />
        <el-table-column prop="contactName" label="联系人" width="150" show-overflow-tooltip />
        <el-table-column prop="contactNumber" label="联系电话" width="150" show-overflow-tooltip />
        <el-table-column prop="contactAddress" label="联系地址" min-width="250" show-overflow-tooltip />
        <el-table-column label="入驻时间" width="180">
          <template #default="{ row }">
            {{ formatDate(row.createTime, 'YYYY-mm-dd HH:MM:SS') }}
          </template>
        </el-table-column>
        <!-- <el-table-column label="最近缴费时间" width="200">
          <template #default="{ row }">
            {{ row.chargeTime > 0 ? formatDate(row.chargeTime, 'YYYY-mm-dd HH:MM:SS') : '--' }}
          </template>
        </el-table-column>
        <el-table-column label="续费时间" width="200">
          <template #default="{ row }">
            {{ row.renewTime > 0 ? formatDate(row.renewTime, 'YYYY-mm-dd HH:MM:SS') : '--' }}
          </template>
        </el-table-column> -->
        <el-table-column fixed="right" label="状态" width="100">
          <template #default="{ row }">
            <el-form>
              <el-tag v-if="row.status === 1" type="success">上架</el-tag>
              <el-tag v-if="row.status === 2" type="danger">下架</el-tag>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="200">
          <template #default="{ row }">
            <el-form>
              <el-button size="small" text type="primary" @click="onSetStatus(row)">{{ row.status === 1 ? '下架' : '上架'
              }}</el-button>
              <el-button size="small" text type="primary" @click="onOpenView(row)">详情</el-button>
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
  </div>
</template>

<script setup lang="ts">
import { defineAsyncComponent, reactive, onMounted, toRefs, ref } from 'vue'
import { ElMessageBox, ElMessage } from 'element-plus'
import { formatDate } from '@/utils/formatTime'
import { getOrganList, delOrgan, updateOrgan } from '@/api/organ/index'
import { getAreaList } from '@/api/base/area/index'
// 引入组件
const detailDialog = defineAsyncComponent(
  () => import('./component/detail.vue')
)

const viewDialog = defineAsyncComponent(() => import('./component/view.vue'))



const defaultQuery = {
  status: 0,
  filter: '',
  areaId: '',
}

// 定义变量
const detailDialogRef = ref()
const viewDialogRef = ref()
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
  getOrganList({
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


// 打开新增弹窗
const onOpenAdd = (type: string) => {
  detailDialogRef.value.openDialog(type)
}
// 打开修改弹窗
const onOpenEdit = (type: string, row: any) => {
  detailDialogRef.value.openDialog(type, row)
}

// 打开详情弹窗
const onOpenView = (row: any) => {
  viewDialogRef.value.openDialog(row)
}

// 上下架
const onSetStatus = (row: any) => {
  updateOrgan({
    id: row.id,
    status: row.status === 1 ? 2 : 1,
  }).then(() => {
    getListData()
  })
}

// 删除
const onRowDel = (row: any) => {
  ElMessageBox.confirm(`您确定要删除此商家吗?`, '提示', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(() => {
      delOrgan({
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
