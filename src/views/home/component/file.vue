<template>
  <el-dialog
    v-model="state.isShowDialog"
    title="KPI数据导出"
    width="600px"
    :close-on-click-modal="false"
    :destroy-on-close="true"
    @close="onCancel"
  >
    <!-- 表单内容 -->
    <el-form
      ref="dialogFormRef"
      :model="state.ruleForm"
      :rules="state.rules"
      label-width="100px"
      size="default"
    >
      <!-- KPI选择 -->
      <el-form-item label="KPI名称" prop="kpiId">
        <el-select
          v-model="state.ruleForm.kpiId"
          placeholder="请选择KPI"
          clearable
          filterable
          style="width: 100%"
        >
          <el-option
            v-for="kpi in state.kpiList"
            :key="kpi.id"
            :label="kpi.title"
            :value="kpi.id"
          />
        </el-select>
      </el-form-item>
    </el-form>

    <template #footer>
      <span class="dialog-footer">
        <el-button @click="onCancel" size="default">取 消</el-button>
        <el-button 
            type="primary" 
            @click="handleDownloadPdf"
            :loading="loading"
        >
      {{ loading ? '下载中...' : '下载PDF' }}
    </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { ElForm, ElMessage,ElLoading  } from 'element-plus'
import { downloadPdfFromStream } from '@/utils/fileDownload'
import { exportPDF } from '@/api/home/index'
import { getKPIListGet } from '@/api/kpi/index'
import { fa } from 'element-plus/es/locale'

const loading = ref(false)
const loadingWithProgress = ref(false)
const progress = ref(0)


// 定义子组件向父组件传值/事件
const emit = defineEmits(['refresh'])

// 定义变量内容
const dialogFormRef = ref(ElForm)
const state = reactive({
  loading: false,
  ruleForm: {} as any,
  rules: {
  },
  kpiList:[] as any,
  isShowDialog: false
})

const getKPI=()=>{
    getKPIListGet({
    }).then((data:any)=>{
        state.kpiList=data.list;
    }).catch(()=>{
        console.error("出错");
    })
}

// 打开弹窗
const openDialog = (row: any) => {
    state.isShowDialog = true
    state.ruleForm={
        userId:row.id,
    }
    getKPI()
}

// 关闭弹窗
const closeDialog = () => {
  state.isShowDialog = false
}
// 取消
const onCancel = () => {
  closeDialog()
}

// 提交
const handleDownloadPdf = async () => {
  const loadingInstance = ElLoading.service({
    lock: true,
    text: '文件下载中...',
    background: 'rgba(0, 0, 0, 0.7)'
  })
  
  loading.value = true
  
  try {
    // 调用API获取PDF流
    const data = await exportPDF(state.ruleForm, {
      responseType: 'blob' // 重要：设置响应类型为blob
    })
    
    // 从响应头获取文件名
    const filename = "教师绩效.pdf"
    if(data.code==40001){
        ElMessage.error(data.reason);
        loading.value = false;
        loadingInstance.close()
        return;
    }

    // 下载文件
    const success =await downloadPdfFromStream(data, filename)
    
    if (success) {
      ElMessage.success('文件下载成功')
    }
  } catch (error:any) {
    console.error('下载失败:', error)
    ElMessage.error('文件下载失败: ' + (error.message || '未知错误'))
  } finally {
    loading.value = false
    loadingInstance.close()
  }
}
// 暴露变量
defineExpose({
  openDialog,
})
</script>

<style scoped>
.kpi-info-card {
  margin-bottom: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.kpi-details {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.detail-item {
  display: flex;
  align-items: center;
}

.detail-item .label {
  font-weight: 600;
  color: #606266;
  margin-right: 8px;
  min-width: 80px;
}

.detail-item .value {
  color: #303133;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .kpi-details {
    grid-template-columns: 1fr;
  }
  
  .detail-item {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .detail-item .label {
    margin-bottom: 4px;
  }
}
</style>