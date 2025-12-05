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
        </el-form-item>
      </el-form>
      <div v-loading="loading" class="card-container">
        <el-card 
          v-for="item in list" 
          :key="item.id" 
          shadow="hover" 
          class="kpi-card"
        >
          <template #header>
            <div class="card-header">
              <span class="card-title">{{ item.title || '未命名KPI' }}</span>
              <el-tag size="small" type="info">ID: {{ item.id }}</el-tag>
            </div>
          </template>
          <div class="card-content">
            <div class="card-item">
              <span class="card-label">创建时间：</span>
              <span class="card-value">{{ item.createTime || '-' }}</span>
            </div>
            <div class="card-item">
              <span class="card-label">截至时间：</span>
              <span class="card-value">{{ item.endTime || '-' }}</span>
            </div>
          </div>
          <div class="card-footer">
            <el-button size="default" type="primary" @click="onConfig(item)">配置</el-button>
          </div>
        </el-card>
        <div v-if="list.length === 0 && !loading" class="empty-state">
          <el-empty description="暂无数据" />
        </div>
      </div>
      <div class="page-bottom">
        <el-pagination v-model:currentPage="currentPage" background layout="prev, pager, next, jumper" :page-count="totalPage" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { reactive, onMounted, ref, toRefs } from 'vue'
import { getKPIListAll } from '@/api/kpi/index'
import { useRouter } from 'vue-router'
const router = useRouter() // 创建 router 实例

// 定义变量
const state = reactive({
  list: [] as any[],
  loading: false,
  currentPage: 1,
  totalPage: 1,
  queryData: {
    id: '',
    title:'',
    createTime:'',
    endTime:'',
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
  const formData = JSON.parse(JSON.stringify(state.queryData))
  getKPIListAll({
    //page: state.currentPage,
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
// 配置按钮 - 跳转到配置页面
const onConfig = (row: any) => {
  router.push({
    path: '/performance/configure',
    query: {
      id: row.id
    }
  })
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
.card-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 20px;
  margin-top: 20px;
  min-height: 200px;

  .kpi-card {
    transition: all 0.3s ease;
    cursor: pointer;

    &:hover {
      transform: translateY(-4px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }

    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;

      .card-title {
        font-size: 16px;
        font-weight: 600;
        color: var(--el-text-color-primary);
        flex: 1;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        margin-right: 10px;
      }
    }

    .card-content {
      padding: 16px 0;
      min-height: 80px;

      .card-item {
        display: flex;
        margin-bottom: 12px;
        align-items: center;

        &:last-child {
          margin-bottom: 0;
        }

        .card-label {
          font-size: 14px;
          color: var(--el-text-color-regular);
          min-width: 80px;
        }

        .card-value {
          font-size: 14px;
          color: var(--el-text-color-primary);
          flex: 1;
        }
      }
    }

    .card-footer {
      display: flex;
      justify-content: flex-end;
      padding-top: 12px;
      border-top: 1px solid var(--el-border-color-lighter);
    }
  }

  .empty-state {
    grid-column: 1 / -1;
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 300px;
  }
}

// 响应式设计
@media (max-width: 768px) {
  .card-container {
    grid-template-columns: 1fr;
  }
}

@media (min-width: 769px) and (max-width: 1200px) {
  .card-container {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1201px) {
  .card-container {
    grid-template-columns: repeat(3, 1fr);
  }
}
</style>
