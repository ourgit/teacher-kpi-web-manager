<template>
  <div class="page-container layout-padding">
    <el-card shadow="hover" class="layout-padding-auto">
      <el-form class="query" :inline="true">
        <el-form-item label="ID">
          <el-input v-model="queryData.id" size="default" placeholder="请输入ID" clearable> </el-input>
        </el-form-item>
        <el-form-item label="KPI标题">
          <el-input v-model="queryData.title" size="default" placeholder="请输入标题" clearable> </el-input>
        </el-form-item>
        <el-form-item>
          <el-button size="default" type="primary" @click="getListData">
            <el-icon>
              <ele-Search />
            </el-icon>
            查询
          </el-button>
          <el-button size="success" type="primary" @click="onOpenAdd">
            <el-icon>
              <ele-Plus />
            </el-icon>
            添加
          </el-button>
        </el-form-item>
      </el-form>
      <el-table :data="list" v-loading="loading" style="width: 100%">
        <el-table-column prop="id" label="Id" style="text-align: center;"/>
        <el-table-column prop="title" label="标题" style="text-align: center;"/>
        <el-table-column label="创建时间" style="text-align: center;">
          <template #default="{ row }">
            {{ formatDate(row.createTime, 'YYYY-mm-dd HH:MM:SS') }}
          </template>
        </el-table-column>
        <el-table-column label="截至时间" style="text-align: center;">
          <template #default="{ row }">
            {{ formatDate(row.endTime, 'YYYY-mm-dd HH:MM:SS') }}
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" style="text-align: center;">
          <template #default="{ row }">
            <el-button size="small" text type="primary" @click="onOpenEdit(row)">修改</el-button>
            <el-button size="small" text type="primary" @click="onDelete(row)">删除</el-button>
            <el-button size="small" text type="primary" @click="onOpenDispatch(row)">下发</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="page-bottom">
        <el-pagination v-model:currentPage="currentPage" background layout="prev, pager, next, jumper" :page-count="totalPage" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
      </div>
    </el-card>
    <updateBalanceDialog ref="updateBalanceDialogRef" @refresh="getListData" />
    <editDialog ref="editDialogRef" @refresh="getListData" />
    <addDialog ref="addDialogRef" @refresh="getListData"/>
    <deleteDialog ref="deleteDialogRef" @refresh="getListData"/>
    <dispatchDialog ref="dispatchDialogRef" @refresh="getListData"/>
  </div>
</template>

<script setup lang="ts">
import { defineAsyncComponent, reactive, onMounted, ref, toRefs } from 'vue'
import { formatDate } from '@/utils/formatTime'
import { getKPIList,getKPIListGet } from '@/api/kpi/index'


// 引入组件
const updateBalanceDialog = defineAsyncComponent(
  () => import('./component/updateBalance.vue')
)

const editDialog = defineAsyncComponent(
  () => import('./component/edit.vue')
)

const addDialog = defineAsyncComponent(
  () => import('./component/add.vue')
)

const deleteDialog = defineAsyncComponent(
  () => import('./component/delete.vue')
)

const dispatchDialog = defineAsyncComponent(
  () => import('./component/dispatch.vue')
)

// 定义变量
const editDialogRef = ref()
const updateBalanceDialogRef = ref()
const addDialogRef=ref()
const deleteDialogRef=ref()
const dispatchDialogRef=ref()
const state = reactive({
  list: [],
  loading: false,
  currentPage: 1,
  totalPage: 1,
  queryData: {
    id: '',
    title:''
  } as any,
  submitData: {},
  levelList: [] as any,
  totalBalance: 0
})

const { list, loading, currentPage, totalPage, queryData, levelList, totalBalance } = toRefs(state)

// 获取列表
const getListData = () => {
  state.loading = true
  if (JSON.stringify(state.queryData) !== JSON.stringify(state.submitData)) {
    state.currentPage = 1
  }
  const formData = state.queryData
  getKPIList({
    currentPage:1,
    pageSize:10,
    ...formData,
  }).then((data: any) => {
    state.loading = false
    state.list = data.list
    if (state.currentPage === 1 && data.pages > 0) {
      state.totalPage = data.pages
    }
    state.submitData = JSON.parse(JSON.stringify(state.queryData))
  }).catch(() => {
    state.loading = false

  })
}

const onOpenDispatch =(row:any)=>{
  dispatchDialogRef.value.openDialog(row)
}

const onOpenAdd=()=>{
    addDialogRef.value.openDialog()
}

const onDelete = (row:any)=>{
    deleteDialogRef.value.openDialog(row)
}

//设置用户角色
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
.el-dropdown-link {
  cursor: pointer;
  color: var(--el-color-primary);
  display: flex;
  align-items: center;
  font-size: 12px;
}

.list {
  width: 400px;
  height: 100%;
  display: flex;
  align-items: center;

  .img {
    width: 120px;
    height: 100%;
    margin-left: 10px;
    display: flex;
    align-items: center;
    justify-content: center;

    img {
      width: 100px;
      height: 110px;
    }
  }

  .text {
    flex: 1;
    display: flex;
    flex-direction: column;
    font-size: 18px;
    padding: 10px;
    box-sizing: border-box;

    .name {
      width: 100%;
      height: 18px;
      overflow: hidden;
    }
  }
}
</style>
