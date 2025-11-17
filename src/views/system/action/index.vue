<template>
  <div class="page-container layout-padding">
    <el-card shadow="hover" class="layout-padding-auto">
      <el-form class="query" :inline="true">
        <el-form-item>
          <el-button size="default" type="success" class="ml10" @click="onOpenAdd('add')">
            <el-icon>
              <ele-Plus />
            </el-icon>
            新增权限
          </el-button>
        </el-form-item>
      </el-form>
      <el-scrollbar v-loading="loading" class="scrollbar">
        <el-tree :data="list" default-expand-all>
          <template #default="{data}">
            <div class="node">
              <div>{{ data.title }}</div>
              <div v-if="!data.top">
                <el-button size="small" text type="primary" @click.stop="onOpenEdit('edit',data)">编辑</el-button>
                <el-button size="small" text type="primary" @click.stop="onRowDel(data)">删除</el-button>
              </div>
            </div>
          </template>
        </el-tree>
      </el-scrollbar>
    </el-card>
    <detailDialog ref="detailDialogRef" @refresh="getListData" />
  </div>
</template>

<script setup lang="ts">
import { defineAsyncComponent, reactive, onMounted, ref, toRefs } from 'vue'
import { ElMessageBox, ElMessage } from 'element-plus'
import { getActionList, delAction } from '@/api/system/action/index'
// 引入组件
const detailDialog = defineAsyncComponent(
  () => import('./component/dialog.vue')
)

// 定义变量
const detailDialogRef = ref()
const state = reactive({
  list: [],
  loading: false,
})

const { list, loading } = toRefs(state)

// 获取列表
const getListData = () => {
  state.loading = true
  getActionList().then((data: any) => {
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
// 删除
const onRowDel = (row: any) => {
  ElMessageBox.confirm(
    `此操作将永久删除权限名称：“${row.title}”，是否继续?`,
    '提示',
    {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning',
    }
  )
    .then(() => {
      delAction({
        id: row.id,
      }).then(() => {
        getListData()
        ElMessage.success('删除成功')
      })
    })
    .catch(() => {})
}
// 页面加载时
onMounted(() => {
  getListData()
})
</script>

<style scoped lang="scss">
.node {
  width: 95%;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
</style>
