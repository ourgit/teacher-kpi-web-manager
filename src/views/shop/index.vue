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
            </el-radio-group>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="关键字">
            <el-input v-model="queryData.filter" size="default" placeholder="请输入关键字" clearable> </el-input>
          </el-form-item>
          <el-form-item label="机构ID">
            <el-input v-model="queryData.orgId" size="default" placeholder="请输入机构ID" clearable> </el-input>
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
        <el-table-column type="id" label="店铺ID" width="80" />
        <el-table-column prop="avatar" label="店铺头像" width="100">
          <template #default="{ row }"><img :src="row.avatar" class="smallImage" /></template>
        </el-table-column>
        <el-table-column prop="name" label="店铺名称" show-overflow-tooltip min-width="180"></el-table-column>
        <el-table-column prop="contactNumber" label="联系电话" width="150"></el-table-column>
        <el-table-column prop="contactName" label="联系人" width="150"></el-table-column>
        <el-table-column prop="contactAddress" label="联系地址" show-overflow-tooltip min-width="200"></el-table-column>
        <el-table-column prop="businessTime" label="营业时间" show-overflow-tooltip width="150"></el-table-column>
        <el-table-column label="创建时间" width="200">
          <template #default="{ row }">
            {{ formatDate(row.createTime, 'YYYY-mm-dd HH:MM:SS') }}
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="150" align="center">
          <template #default="{ row }">
            <el-button size="small" text type="primary" @click="onOpenEdit('edit', row)">修改</el-button>
            <el-button size="small" text type="primary" @click="onRowDel(row)">删除</el-button>
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
import { ElMessageBox, ElMessage } from 'element-plus'
import { getShopList, delShop } from '@/api/shop/index';


const detailDialog = defineAsyncComponent(() => import('./component/detail.vue'))

// 定义变量
const defaultQuery = {
  status: 0,
  filter: '',
  orgId: '',
}


const detailDialogRef = ref()
const state = reactive({
  list: [],
  loading: false,
  currentPage: 1,
  totalPage: 1,
  queryData: Object.assign({}, defaultQuery),
  submitData: {},
  exportLoading: false,
})


const { list, loading, currentPage, totalPage, queryData, exportLoading } =
  toRefs(state)


// 获取店铺列表
const getListData = () => {
  state.loading = true
  if (JSON.stringify(state.queryData) !== JSON.stringify(state.submitData)) {
    state.currentPage = 1
  }
  const formData = JSON.parse(JSON.stringify(state.queryData))
  getShopList({
    page: state.currentPage,
    ...formData,
  }).then((data: any) => {
    state.loading = false
    state.list = data.list
    console.log("list", data.list)
    if (state.currentPage === 1 && data.pages > 0) {
      state.totalPage = data.pages
    }
    state.submitData = JSON.parse(JSON.stringify(state.queryData))
  })
}

const onOpenAdd = () => {
  detailDialogRef.value.openDialog()
}

const handleSizeChange = () => {
  getListData()
}

const handleCurrentChange = () => {
  getListData()
}

//重置搜索条件
const refreshQuery = () => {
  state.queryData = Object.assign({}, defaultQuery)
  getListData()
}


//导出表格
const downloadFile = () => {
  import('@/utils/export.js').then((excel) => {
    state.exportLoading = true
    getShopList({ page: 0, ...state.submitData }).then((data) => {
      const exportJsonToExcel = excel.export_json_to_excel
      const tableHead = ['订单号']
      const filterVal = ['orderNo']
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

// 删除
const onRowDel = (row: any) => {
  ElMessageBox.confirm(`您确定要删除此店铺吗?`, '提示', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(() => {
      delShop({
        id: row.id,
      }).then(() => {
        getListData()
        ElMessage.success('删除成功')
      })
    })
    .catch(() => { })
}




// 打开修改弹窗
const onOpenEdit = (type: string, row: any) => {
  detailDialogRef.value.openDialog(type, row)
}


onMounted(() => {
  getListData()
})

</script>

<style scoped lang="scss">
.system-user-container {
  :deep(.el-card__body) {
    display: flex;
    flex-direction: column;
    flex: 1;
    overflow: auto;

    .el-table {
      flex: 1;
    }
  }
}
</style>
