<template>
  <div class="page-container layout-padding">
    <el-card shadow="hover" class="layout-padding-auto">
      <el-form class="query" :inline="true">
        <el-form-item>
          <el-select v-model="queryData.orgId" size="default" placeholder="选择机构" filterable>
            <el-option label="全部" value="0" />
            <el-option v-for="item in orgList" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-input v-model="queryData.filter" size="default" placeholder="请输入关键字"> </el-input>
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
        <el-form-item>
          <router-link to="/printTemplate/add">
            <el-button size="default" type="success" class="ml10">
              <el-icon>
                <ele-Plus />
              </el-icon>
              新增模板
            </el-button>
          </router-link>
        </el-form-item>
      </el-form>
      <el-table :data="list" v-loading="loading" style="width: 100%">
        <el-table-column prop="id" label="ID" width="100" />
        <el-table-column prop="orgName" label="机构名称" show-overflow-tooltip />
        <el-table-column prop="title" label="模板名称" show-overflow-tooltip min-width="150" />
        <el-table-column label="操作" width="150">
          <template #default="{ row }">
            <el-form>
              <router-link :to="`/printTemplate/edit?templateId=${row.id}`" class="mr10">
                <el-button size="small" text type="primary">编辑</el-button>
              </router-link>
              <router-link :to="`/printTemplate/edit?templateId=${row.id}&copy=1`" class="mr10">
                <el-button size="small" text type="primary">复制</el-button>
              </router-link>
              <el-button size="small" text type="primary" @click="onRowDel(row)">删除</el-button>
            </el-form>
          </template>
        </el-table-column>
      </el-table>
      <div class="page-bottom">
        <el-pagination v-model:currentPage="currentPage" background layout="prev, pager, next, jumper" :page-count="totalPage" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
      </div>
    </el-card>
  </div>
</template>

<script lang="ts">
export default {
  name: 'printTemplateIndex',
  beforeRouteEnter(to, from, next) {
    next((vm: any) => {
      if (from.name === 'printTemplateAdd' || from.name === 'printTemplateEdit') {
        vm.getListData()
      }
    })
  },
}
</script>
<script setup lang="ts">
import { reactive, onMounted, toRefs } from 'vue'
import { ElMessageBox, ElMessage } from 'element-plus'
import { getPrintTemplateList, delPrintTemplate } from '@/api/printTemplate/index'
import { getOrganList } from '@/api/organ/index'

// 定义变量
const defaultQuery = {
  orgId: '',
  filter: '',
}

const state = reactive({
  orgList: [] as any,
  list: [],
  loading: false,
  currentPage: 1,
  totalPage: 1,
  queryData: Object.assign({}, defaultQuery),
  submitData: {},
})

const { orgList, list, loading, currentPage, totalPage, queryData } =
  toRefs(state)


// 获取列表
const getListData = () => {
  state.loading = true
  if (JSON.stringify(state.queryData) !== JSON.stringify(state.submitData)) {
    state.currentPage = 1
  }
  const formData = JSON.parse(JSON.stringify(state.queryData))
  getPrintTemplateList({
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


// 获取机构列表
const getOrganListData = () => {
  getOrganList({
    page: 0
  }).then((data: any) => {
    state.orgList = data.list
  })
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
  ElMessageBox.confirm(`您确定要删除此模板吗?`, '提示', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(() => {
      delPrintTemplate({
        id: row.id,
        operation: 'del',
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
  getOrganListData()
})

// 暴露变量
defineExpose({
  getListData
})
</script>

<style scoped lang="scss"></style>
