<template>
  <div class="page-container layout-padding">
    <el-card shadow="hover" class="layout-padding-auto">
      <div class="mb15">
        <el-button size="default" type="success" @click="onOpenAdd('add')">
          <el-icon><ele-Plus /></el-icon>
          新增类目
        </el-button>
      </div>
      <el-table :data="list" v-loading="loading" style="width: 100%">
        <el-table-column prop="id" label="ID" width="100">
        </el-table-column>
        <el-table-column prop="name" label="类目名字" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="show" label="是否显示" show-overflow-tooltip>
          <template #default="{ row }">
            <el-form>
              <el-tag v-if="row.show === 1" type="success">正常</el-tag>
              <el-tag v-if="row.show === 2" type="danger">禁用</el-tag>
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

    </el-card>
    <detailDialog ref="detailDialogRef" @refresh="getListData" />
  </div>
</template>

<script setup lang="ts">
import { defineAsyncComponent, reactive, onMounted, ref, toRefs } from 'vue'
import { ElMessageBox, ElMessage } from 'element-plus'
import { getItemList, delItem } from '@/api/base/item/index'

// 引入组件
const detailDialog = defineAsyncComponent(() => import('./component/detail.vue'))

// 定义变量
const detailDialogRef = ref()
const state = reactive({
  list: [],
  loading: false,
})

const { list, loading } = toRefs(state)

// 获取列表数据
const getListData = () => {
  state.loading = true
  getItemList({ page: 0 }).then((data: any) => {
    state.loading = false
    state.list = data.list
  }).catch(() => {
    state.loading = false
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
  ElMessageBox.confirm(`您确定要删除此类目吗?`, '提示', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(() => {
      delItem({
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
})
</script>

<style scoped lang="scss"></style>