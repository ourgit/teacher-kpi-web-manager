<template>
  <div class="page-container layout-padding">
    <el-card shadow="hover" class="layout-padding-auto">
      <el-form class="query" :inline="true" size="default" label-width="90px">
        <el-row>
          <el-form-item label="所属商家">
            <el-select v-model="queryData.orgId" placeholder="选择商家" clearable filterable>
              <el-option v-for="item in orgList" :key="item.id" :label="item.name" :value="item.id" />
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
              新增规格模板
            </el-button>
          </el-form-item>
        </el-row>
      </el-form>
      <el-table :data="list" v-loading="loading" style="width: 100%">
        <el-table-column prop="id" label="ID" width="100" />
        <el-table-column prop="name" label="模板名称" show-overflow-tooltip></el-table-column>
        <el-table-column label="操作" width="100">
          <template #default="{ row }">
            <el-button size="small" text type="primary" @click="onOpenEdit('edit', row)">修改</el-button>
            <el-button size="small" text type="primary" @click="onRowDel(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <detailDialog ref="detailDialogRef" @refresh="getListData" />
  </div>
</template>

<script setup lang="ts">
import { defineAsyncComponent, reactive, onMounted, ref, toRefs } from 'vue'
import { ElMessageBox, ElMessage } from 'element-plus'
import { getTemplateList, delTemplate } from '@/api/product/attr/index'
import { getOrganList } from '@/api/organ/index'
// 引入组件
const detailDialog = defineAsyncComponent(
  () => import('./component/detail.vue')
)

// 定义变量
const defaultQuery = {
  orgId: '',
}
const detailDialogRef = ref()
const state = reactive({
  list: [],
  loading: false,
  queryData: Object.assign({}, defaultQuery),
  orgList: [] as Array<any>,
})

const { list, loading, queryData, orgList } = toRefs(state)

// 获取列表
const getListData = () => {
  state.loading = true
  getTemplateList({
    ...state.queryData
  }).then((data: any) => {
    state.loading = false
    state.list = data.list
  })
}


//重置搜索条件
const refreshQuery = () => {
  state.queryData = Object.assign({}, defaultQuery)
  getListData()
}

// 获取商家列表
const getOrganListData = () => {
  getOrganList({
    page: 0,
  }).then((data: any) => {
    state.orgList = data.list
  })
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
  ElMessageBox.confirm(`您确定要删除此规格模板吗?`, '提示', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(() => {
      delTemplate({
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
  getOrganListData()
  getListData()
})
</script>

<style scoped lang="scss"></style>
