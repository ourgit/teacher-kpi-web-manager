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

      <!--给用户对于完整/不完整的解释-->
      <div class="explain-container">
        <el-tag size="small" type="info">完整：KPI配置完整，可以进行配置</el-tag>
        <el-tag size="small" type="info">不完整：KPI配置不完整，需要完善配置</el-tag>
      </div>
      <div 
        v-loading="loading" 
        class="card-container scroll-container"
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
              <div class="card-header-tags">
                <el-tag 
                  size="small" 
                  :type="item.isCompleted ? 'success' : 'warning'"
                >
                  {{ item.isCompleted ? '完整' : '不完整' }}
                </el-tag>
                <el-tag size="small" type="info">ID: {{ item.id }}</el-tag>
              </div>
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
            <el-button 
              size="default" 
              type="primary" 
              @click="onConfig(item)"
            >
              配置
            </el-button>
          </div>
        </el-card>
        <div v-if="list.length === 0 && !loading" class="empty-state">
          <el-empty description="暂无数据" />
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { reactive, onMounted, toRefs } from 'vue'
import { getKPIListAll, getKPIListComlpeted } from '@/api/kpi/index'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'

const router = useRouter()

// 定义变量
const state = reactive({
  list: [] as any[],
  loading: false,
  queryData: {
    id: '',
    title: '',
    createTime: '',
    endTime: '',
  } as any,
  submitData: {},
  completedList: [] as any[],
})

const { list, loading, queryData } = toRefs(state)

// 获取列表
const getListData = () => {
  state.loading = true
  
  // 如果查询条件改变，重置列表
  if (JSON.stringify(state.queryData) !== JSON.stringify(state.submitData)) {
    state.list = []
  }
  
  const formData = JSON.parse(JSON.stringify(state.queryData))
  getKPIListAll({
    ...formData,
  }).then((data: any) => {
    console.log(data)
    state.loading = false
    state.list = data.list || []

    //获取KPI完整性,根据id对应上去，在list中多加isCompleted字段
    getKPIListComlpeted({})
    .then((data:any)=>{
      state.completedList=data.list;
      state.completedList.forEach((item:any) => {
        const kpi=state.list.find((kpi:any) => kpi.id === item.kpiId);
        if(kpi){
          kpi.isCompleted=item.isCompleted;
        }
      })
    })

    console.log(state.completedList)
    state.submitData = JSON.parse(JSON.stringify(state.queryData))
  }).catch(() => {
    state.loading = false
  })
}

// 配置按钮 - 跳转到配置页面
const onConfig = (row: any) => {
  // 如果KPI不完整，提示用户完善配置
/*   if (!row.isCompleted) {
    ElMessage.warning('请先完善KPI配置')
    return
  } */
  
  router.push({
    path: '/performance/configure',
    query: {
      id: row.id,
      name: row.title
    }
  })
}

// 页面加载时
onMounted(() => {
  getListData()
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

.explain-container{
  margin-bottom: 10px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 10px;
}

</style>
