<template>
  <div class="page-container layout-padding">
    <el-card shadow="hover" class="layout-padding-auto">
      <el-form class="query" :inline="true">
        <el-form-item>
          <el-radio-group v-model="queryData.status" size="default" @change="getListData">
            <el-radio-button :label="0">全部</el-radio-button>
            <el-radio-button :label="1">生效</el-radio-button>
            <el-radio-button :label="2">失效</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="卡券名称">
          <el-input v-model="queryData.filter" placeholder="请输入卡券名称">
            <template #append>
              <el-button @click="getListData">
                <el-icon>
                  <ele-Search />
                </el-icon>
              </el-button>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item>
          <router-link to="/market/card/add">
            <el-button size="default" type="success" class="ml10">
              <el-icon>
                <ele-Plus />
              </el-icon>
              添加卡券
            </el-button>
          </router-link>
        </el-form-item>
      </el-form>
      <el-table :data="list" v-loading="loading" style="width: 100%">
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="title" label="卡券标题" min-width="160" show-overflow-tooltip />
        <el-table-column label="图片" width="180">
          <template #default="{ row }">
            <img :src="row.imgUrl" class="image">
          </template>
        </el-table-column>
        <el-table-column prop="content" label="卡券说明" show-overflow-tooltip />
        <el-table-column width="120px" label="状态">
          <template #default="{ row }">
            <el-tag type="success" v-if="row.status === 1">生效</el-tag>
            <el-tag type="primary" v-if="row.status === 2">失效</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="days" label="有效天数" width="120" show-overflow-tooltip align="center" />
        <el-table-column fixed="right" label="操作" width="240">
          <template #default="{ row }">
            <router-link :to="`/market/card/edit?cardId=${row.id}`" class="mr10">
              <el-button size="small" text type="primary">
                修改 </el-button>
            </router-link>
            <el-button size="small" text type="primary" @click="onSetStatus(row)">{{ row.status === 1 ? '失效' :
              '生效' }}</el-button>
            <el-button size="small" text type="primary" @click="del(row)">删除</el-button>
            <el-button size="small" text type="primary" @click="onOpenGrant(row)">发放</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="page-bottom">
        <div class="page-bottom">
          <el-pagination v-model:currentPage="currentPage" background layout="prev, pager, next, jumper" :page-count="totalPage" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
        </div>
      </div>
    </el-card>
    <grantDialog ref="grantDialogRef" @refresh="getListData" />
  </div>
</template>

<script setup lang="ts">
import { defineAsyncComponent, reactive, onMounted, toRefs, ref } from 'vue'
import {
  getCardList,
  delCard,
  updateCard
} from '@/api/market/card/index'

// 引入组件
const grantDialog = defineAsyncComponent(
  () => import('./component/grant.vue')
)

const grantDialogRef = ref()
// 定义变量
const state = reactive({
  list: [],
  categoryList: [] as any,
  loading: false,
  currentPage: 1,
  totalPage: 1,
  queryData: {
    filter: '',
    status: 0,
  } as any,
  statu: 0,
  submitData: {},
  selectedList: [],
  statusList: [{
    title: '有效',
    value: 1
  }, {
    title: '失效',
    value: 2
  }]
})
const {
  list,
  loading,
  currentPage,
  totalPage,
  queryData,
} = toRefs(state)


// 删除优惠券
const del = (row: any) => {
  delCard(row).then(res => {
    getListData()
  })
}
// 获取列表
const getListData = () => {
  state.loading = true
  console.log(state.queryData.status)
  if (JSON.stringify(state.queryData) !== JSON.stringify(state.submitData)) {
    state.currentPage = 1
  }
  const formData = JSON.parse(JSON.stringify(state.queryData))
  getCardList({
    page: state.currentPage,
    ...formData,
  }).then((data: any) => {
    console.log(data);
    state.loading = false
    state.list = data.list
    if (state.currentPage === 1 && data.pages > 0) {
      state.totalPage = data.pages
    }
    state.submitData = JSON.parse(JSON.stringify(state.queryData))
  })
}
//打开发放弹窗
const onOpenGrant = (row: any) => {
  grantDialogRef.value.openDialog(row)
}

const handleSizeChange = () => {
  getListData()
}

const handleCurrentChange = () => {
  getListData()
}

// 上下架
const onSetStatus = (row: any) => {
  updateCard({
    id: row.id,
    status: row.status === 1 ? 2 : 1,
  }).then(() => {
    getListData()
  })
}


// 页面加载时
onMounted(() => {
  getListData()
})
</script>

<style scoped lang="scss">
::v-deep .el-tabs__nav {
  width: 1000px !important;
  padding: 0 30px;
}
</style>
