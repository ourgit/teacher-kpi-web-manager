<template>
  <div class="page-container layout-padding">
    <el-card shadow="hover" class="layout-padding-auto">
      <el-form class="query" :inline="true" size="default" label-width="80px">
        <el-row>
          <el-form-item>
            <el-input v-model="queryData.deviceName" size="default" placeholder="请输入设备名称" clearable>
            </el-input>
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
      <el-table :data="list" v-loading="loading" style="width: 100%" @selection-change="selectedList = $event">
        <el-table-column prop="id" label="ID" width="200" />
        <el-table-column prop="deviceCode" label="设备编号" min-width="200"></el-table-column>
        <el-table-column prop="deviceName" label="设备名称" min-width="200"></el-table-column>
        <el-table-column prop="url" label="摄像头url" width="300"></el-table-column>
        <el-table-column prop="simCard" label="sim卡号" min-width="200"></el-table-column>
        <el-table-column fixed="right" label="操作" width="300" align="center">
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
import {
  defineAsyncComponent,
  reactive,
  onMounted,
  ref,
  toRefs,
  watch,
} from 'vue'
import { ElMessageBox, ElMessage } from 'element-plus'
import {
  getDeviceList,
  delDevice,
} from '@/api/base/camDevice/index'
const detailDialog = defineAsyncComponent(
  () => import('./component/detail.vue')
)

// 定义变量
const defaultQuery = {
  deviceName: '',
}
const detailDialogRef = ref()
const itemDetailDialogRef = ref()
const state = reactive({
  list: [],
  selectedList: [],
  loading: false,
  currentPage: 1,
  totalPage: 1,
  queryData: Object.assign({}, defaultQuery),
  submitData: {},
  cameraConfig: {
    url: '',
    accessToken: '',
  },
  exportLoading: false,
})

const {
  list,
  selectedList,
  loading,
  currentPage,
  totalPage,
  queryData,
} = toRefs(state)


// 获取列表
const getListData = () => {
  state.loading = true
  if (JSON.stringify(state.queryData) !== JSON.stringify(state.submitData)) {
    state.currentPage = 1
  }
  const formData = JSON.parse(JSON.stringify(state.queryData))
  getDeviceList({
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

const onOpenAdd = (type: string) => {
  detailDialogRef.value.openDialog(type)
}

const openItem = (row: any) => {
  itemDetailDialogRef.value.openDialog(row)
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

// 删除
const onRowDel = (row: any) => {
  ElMessageBox.confirm(`您确定要删除此设备信息?`, '提示', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(() => {
      delDevice({
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
