<template>
  <div class="page-container layout-padding">
    <el-card shadow="hover" class="layout-padding-auto">
      <el-form class="query" :inline="true" size="default" label-width="80px">
        <el-row>
          <el-form-item label="所属校区">
            <el-select v-model="queryData.areaId" placeholder="选择所属校区" @change="getCabinetListData" clearable filterable>
              <el-option v-for="item in areaList" :key="item.id" :label="item.name" :value="item.id" />
            </el-select>
          </el-form-item>
          <el-form-item label="智能柜">
            <el-select v-model="queryData.cabinetId" placeholder="选择所属智能柜" clearable filterable>
              <el-option v-for="item in cabinetList" :key="item.id" :label="item.name" :value="item.id" />
            </el-select>
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
              新增智能柜门
            </el-button>
          </el-form-item>
        </el-row>
      </el-form>
      <el-table :data="list" v-loading="loading" style="width: 100%">
        <el-table-column prop="areaName" label="所属校区" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="cabinetName" label="智能柜名称" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="boxNo" label="箱门编号" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="enable" label="状态" show-overflow-tooltip>
          <template #default="{ row }">
            <el-form>
              <el-tag v-if="row.enable" type="success">启用</el-tag>
              <el-tag v-else type="danger">禁用</el-tag>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150" fixed="right">
          <template #default="{ row }">
            <el-button size="small" text type="primary" @click="onOpenEdit('edit', row)">修改</el-button>
            <el-button size="small" text type="primary" @click="onRowDel(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="page-bottom">
        <el-pagination v-model:currentPage="currentPage" background layout="prev, pager, next, jumper" :page-count="totalPage" @size-change="getListData" @current-change="getListData" />
      </div>
    </el-card>
    <detailDialog ref="detailDialogRef" @refresh="getListData" />
  </div>
</template>

<script setup lang="ts">
import { defineAsyncComponent, reactive, onMounted, ref, toRefs } from 'vue'
import { ElMessageBox, ElMessage } from 'element-plus'
import { getCabinetList } from '@/api/base/cabinet/index'
import { getCabinetBoxList, delCabinetBox } from '@/api/base/cabinet/box'
import { getAreaList } from '@/api/base/area/index'
// 引入组件
const detailDialog = defineAsyncComponent(() => import('./component/detail.vue'))


// 定义变量

const defaultQuery = {
  cabinetId: '',
  areaId: '',
}
const detailDialogRef = ref()
const state = reactive({
  list: [],
  loading: false,
  currentPage: 1,
  totalPage: 1,
  queryData: Object.assign({}, defaultQuery),
  submitData: {},
  areaList: [] as Array<any>,
  cabinetList: [] as Array<any>,
})

const { list, loading, currentPage, totalPage, queryData, areaList, cabinetList } = toRefs(state)

// 获取列表数据
const getListData = () => {
  state.loading = true
  if (JSON.stringify(state.queryData) !== JSON.stringify(state.submitData)) {
    state.currentPage = 1
  }
  const formData = JSON.parse(JSON.stringify(state.queryData))
  getCabinetBoxList({
    page: state.currentPage,
    ...formData,
  }).then((data: any) => {
    state.loading = false
    state.list = data.list
    if (state.currentPage === 1) {
      state.totalPage = data.pages
    }
    state.submitData = JSON.parse(JSON.stringify(state.queryData))
  }).catch(() => {
    state.loading = false
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


const getCabinetListData = (e: any) => {
  getCabinetList({
    page: 0,
    areaId: e,
  }).then((data: any) => {
    state.cabinetList = data.list
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

// 删除
const onRowDel = (row: any) => {
  ElMessageBox.confirm(`您确定要删除此智能柜门吗?`, '提示', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(() => {
      delCabinetBox({
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
  getCabinetListData(0)
})
</script>

<style scoped lang="scss"></style>