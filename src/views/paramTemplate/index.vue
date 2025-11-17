<template>
  <div class="page-container layout-padding">
    <el-card shadow="hover" class="layout-padding-auto">
      <row class="mb20">
        <el-button size="default" type="success" class="ml10" @click="onOpenAdd('add')">
          <el-icon>
            <ele-Plus />
          </el-icon>
          新增配置
        </el-button>
        <el-button size="default" type="success" class="ml10" @click="onSyncParam()">
          <el-icon>
            <ele-Refresh />
          </el-icon>
          同步配置
        </el-button>
      </row>
      <el-table :data="list" v-loading="loading" style="width: 100%" @selection-change="selectedList = $event">
        <el-table-column type="selection" width="30" />>
        <el-table-column prop="id" label="ID" width="100" />
        <el-table-column prop="key" label="key" show-overflow-tooltip></el-table-column>
        <el-table-column label="参数值" show-overflow-tooltip width="100">
          <template #default="{ row }">
            <span v-if="row.contentType === 1">{{ row.value }}</span>
            <span v-if="row.contentType === 4">{{ row.value ? '启用' : '停用' }}</span>
          </template>
        </el-table-column>>
        <el-table-column prop="tabName" label="所属类型" show-overflow-tooltip></el-table-column>
        <el-table-column label="参数类型" show-overflow-tooltip width="100">
          <template #default="{ row }">
            <span v-if="row.contentType === 1">文本</span>
            <span v-if="row.contentType === 2">图片</span>
            <span v-if="row.contentType === 3">颜色</span>
            <span v-if="row.contentType === 4">开关</span>
            <span v-if="row.contentType === 5">自定义</span>
            <span v-if="row.contentType === 6">生日折扣</span>
          </template>
        </el-table-column>
        <el-table-column prop="note" label="备注" show-overflow-tooltip></el-table-column>
        <el-table-column label="操作" width="100">
          <template #default="{ row }">
            <el-form>
              <el-button size="small" text type="primary" @click="onOpenEdit('edit', row)">编辑</el-button>
              <el-divider direction="vertical" />
              <el-button size="small" text type="primary" @click="onRowDel(row)">删除</el-button>
            </el-form>
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
import { getParamTemplateList, delParamTemplate, syncParamTemplate } from '@/api/paramTemplate/index'
// 引入组件
const detailDialog = defineAsyncComponent(
  () => import('./component/dialog.vue')
)

// 定义变量
const detailDialogRef = ref()
const state = reactive({
  list: [],
  loading: false,
  selectedList: []
})

const { list, loading, selectedList } = toRefs(state)

// 获取列表
const getListData = () => {
  state.loading = true
  getParamTemplateList().then((data: any) => {
    state.loading = false
    state.list = data.list
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

// 同步
const onSyncParam = () => {
  ElMessageBox.confirm(`您确认要同步配置吗?`, '提示', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(() => {
      syncParamTemplate({
        list: state.selectedList.map((item: any) => item.id)
      }).then(() => {
        ElMessage.success('同步成功')
      })
    })
    .catch(() => { })
}

// 删除
const onRowDel = (row: any) => {
  ElMessageBox.confirm(`您确认要删除此配置吗?`, '提示', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(() => {
      delParamTemplate({
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
