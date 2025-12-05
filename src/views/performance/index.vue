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
      <div 
        v-loading="loading" 
        class="card-container scroll-container"
        ref="scrollContainer"
      >
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
        <div v-if="loadingMore" class="loading-more">
          <el-icon class="is-loading">
            <ele-Loading />
          </el-icon>
          <span>加载中...</span>
        </div>
        <div v-if="noMore && list.length > 0" class="no-more">
          <span>没有更多数据了</span>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { reactive, onMounted, onUnmounted, ref, toRefs } from 'vue'
import { getKPIList } from '@/api/kpi/index'
import { useRouter } from 'vue-router'
const router = useRouter()

// 定义变量
const state = reactive({
  list: [] as any[],
  loading: false,
  loadingMore: false,
  noMore: false,
  currentPage: 1,
  totalPage: 1,
  pageSize: 10,
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

const { list, loading, loadingMore, noMore, currentPage, totalPage, queryData, levelList, totalBalance } = toRefs(state)
const scrollContainer = ref<HTMLElement>()

// 获取列表
const getListData = (isLoadMore = false) => {
  // 如果是加载更多，显示加载更多状态
  if (isLoadMore) {
    state.loadingMore = true
  } else {
    state.loading = true
    // 如果不是加载更多，重置状态
    if (JSON.stringify(state.queryData) !== JSON.stringify(state.submitData)) {
      state.currentPage = 1
      state.list = []
      state.noMore = false
    }
  }
  
  const formData = JSON.parse(JSON.stringify(state.queryData))
  getKPIList({
    page: state.currentPage,
    size: state.pageSize,
    ...formData,
  }).then((data: any) => {
    state.loading = false
    state.loadingMore = false
    
    if (isLoadMore) {
      // 追加数据
      state.list = [...state.list, ...(data.list || [])]
    } else {
      // 替换数据
      state.list = data.list || []
    }
    
    if (state.currentPage === 1 && data.pages > 0) {
      state.totalPage = data.pages
    }
    
    // 判断是否还有更多数据
    if (state.currentPage >= state.totalPage || (data.list && data.list.length < state.pageSize)) {
      state.noMore = true
    } else {
      state.noMore = false
    }
    
    state.submitData = JSON.parse(JSON.stringify(state.queryData))
  }).catch(() => {
    state.loading = false
    state.loadingMore = false
  })
}

// 滚动处理
const handleScroll = () => {
  // 如果已经加载完或正在加载，不继续加载
  if (state.noMore || state.loadingMore || state.loading) {
    return
  }
  
  // 计算是否滚动到底部（距离底部100px时触发）
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop
  const scrollHeight = document.documentElement.scrollHeight
  const clientHeight = document.documentElement.clientHeight
  
  // 距离底部100px时加载更多
  if (scrollTop + clientHeight >= scrollHeight - 100) {
    if (state.currentPage < state.totalPage) {
      state.currentPage++
      getListData(true)
    }
  }
}
// 配置按钮 - 跳转到配置页面
const onConfig = (row: any) => {
  router.push({
    path: '/performance/configure',
    query: {
      id: row.id,
      name: row.title
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
  // 监听页面滚动
  window.addEventListener('scroll', handleScroll)
})

// 页面卸载时移除滚动监听
onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<style scoped lang="scss">
.card-container {
  display: grid;
  gap: 20px;
  margin-top: 20px;
  padding: 10px 0;
  width: 100%;

  .kpi-card {
    width: 100%;
    transition: all 0.3s ease;
    cursor: pointer;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;

    &:hover {
      transform: translateY(-4px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }

    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      flex-wrap: wrap;
      gap: 8px;

      .card-title {
        font-size: 16px;
        font-weight: 600;
        color: var(--el-text-color-primary);
        flex: 1;
        min-width: 0;
        word-break: break-word;
        overflow-wrap: break-word;
        line-height: 1.5;
      }
    }

    .card-content {
      padding: 16px 0;
      min-height: 80px;
      width: 100%;
      box-sizing: border-box;
      flex: 1;
      display: flex;
      flex-direction: column;

      .card-item {
        display: flex;
        margin-bottom: 12px;
        align-items: flex-start;
        width: 100%;
        box-sizing: border-box;

        &:last-child {
          margin-bottom: 0;
        }

        .card-label {
          font-size: 14px;
          color: var(--el-text-color-regular);
          min-width: 80px;
          flex-shrink: 0;
        }

        .card-value {
          font-size: 14px;
          color: var(--el-text-color-primary);
          flex: 1;
          word-break: break-word;
          overflow-wrap: break-word;
        }
      }
    }

    .card-footer {
      display: flex;
      justify-content: flex-end;
      padding-top: 12px;
      border-top: 1px solid var(--el-border-color-lighter);
      flex-shrink: 0;
    }
  }

  .empty-state {
    grid-column: 1 / -1;
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 300px;
  }

  .loading-more,
  .no-more {
    grid-column: 1 / -1;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 20px;
    color: var(--el-text-color-regular);
    font-size: 14px;

    .el-icon {
      margin-right: 8px;
      font-size: 16px;
    }
  }
}

// 响应式设计 - 使用百分比布局，grid 会自动处理 gap
@media (max-width: 640px) {
  .card-container {
    grid-template-columns: 100%;
  }
}

@media (min-width: 641px) and (max-width: 960px) {
  .card-container {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 961px) and (max-width: 1280px) {
  .card-container {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (min-width: 1281px) {
  .card-container {
    grid-template-columns: repeat(4, 1fr);
  }
}
</style>
