<template>
  <div class="page-container layout-padding">
    <el-card shadow="hover" class="layout-padding-auto">
      <el-form class="query" :inline="true" size="default" label-width="90px">
        <el-row>
          <el-form-item>
            <el-button size="default" type="success" class="ml10" @click="onOpenAdd('add')">
              <el-icon>
                <ele-Plus />
              </el-icon>
              新增用户等级
            </el-button>
          </el-form-item>
        </el-row>
      </el-form>
      <el-table :data="list" v-loading="loading" style="width: 100%">
        <el-table-column prop="level" label="等级值" width="80" />
        <el-table-column prop="levelName" label="等级" show-overflow-tooltip />
        <el-table-column label="解锁金额" width="100" show-overflow-tooltip>
          <template #default="{ row }">
            {{ parseMoney(row.needScore) }}
          </template>
        </el-table-column>
        <el-table-column label="绑定卡券" min-width="80" show-overflow-tooltip>
          <template #default="{ row }">
            <div v-for="(item, index) in row.couponGift" :key="index">
              {{ item.couponTitle }} * {{ item.count }}
            </div>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="200">
          <template #default="{ row }">
            <el-button size="small" text type="primary" @click="onOpenEdit('edit', row)">编辑</el-button>
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
import { reactive, onMounted, toRefs, defineAsyncComponent, ref } from 'vue'
import { ElMessageBox, ElMessage } from 'element-plus'
import {
  getLevelList,
  delMemberLevel
} from '@/api/member/index'
import { parseMoney } from '@/utils/filters'
const detailDialog = defineAsyncComponent(
  () => import('./component/dialog.vue')
)
// 定义变量
const detailDialogRef = ref()
const defaultQuery = {
  status: 0,
  filter: '',
  categoryId: '',
}
const state = reactive({
  list: [],
  categoryList: [] as any,
  loading: false,
  currentPage: 1,
  totalPage: 1,
  queryData: Object.assign({}, defaultQuery),
  submitData: {},
})

const {
  list,
  loading,
  currentPage,
  totalPage,
} = toRefs(state)

// 获取列表
const getListData = () => {
  state.loading = true
  if (JSON.stringify(state.queryData) !== JSON.stringify(state.submitData)) {
    state.currentPage = 1
  }
  const formData = JSON.parse(JSON.stringify(state.queryData))

  getLevelList({
    page: state.currentPage,
    ...formData,
  }).then((data: any) => {
    console.log(data)
    state.loading = false
    state.list = data.list.map((item: any) => {
      item.couponGift = item.couponGift ? JSON.parse(item.couponGift) : []
      return item
    })
    if (state.currentPage === 1 && data.pages > 0) {
      state.totalPage = data.pages
    }
    state.submitData = JSON.parse(JSON.stringify(state.queryData))
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
    `此操作将永久删除Tab名称：“${row.levelName}”，是否继续?`,
    '提示',
    {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning',
    }
  )
    .then(() => {
      delMemberLevel({
        id: row.id,
        operation: 'del'
      }).then(() => {
        getListData()
        ElMessage.success('删除成功')
      })
    })
    .catch(() => { })
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

// 暴露变量
defineExpose({
  getListData,
})
</script>
<style scoped></style>
