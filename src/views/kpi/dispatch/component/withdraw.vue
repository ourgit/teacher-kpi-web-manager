<template>
  <div class="dialog-container">
    <el-dialog title="撤销列表" v-model="isShowDialog" width="500px" :close-on-click-modal="false" :destroy-on-close="true">
      <el-form ref="dialogFormRef" :model="ruleForm" :rules="rules" size="default" label-width="120px">
        <el-table 
          :data="state.kpiList" 
          v-loading="loading" 
          style="width: 100%;height: 200px"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="55" align="center"/>
          <el-table-column prop="title" label="KPI名称" align="center"/>
        </el-table>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="onCancel" size="default">取 消</el-button>
          <el-button type="primary" @click="onSubmit" size="default" :loading="loading">确 认</el-button>
        </span>
      </template>
    </el-dialog>
    
  </div>
</template>

<script setup lang="ts">
import { reactive, toRefs, ref } from 'vue'
import { ElForm, ElMessage } from 'element-plus'
import { withDraw,getKPIListUserId } from '@/api/kpi/index'

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
  selectedKpiList:[] as any,
  isShowDialog: false
})

const { loading, ruleForm, rules, isShowDialog } = toRefs(state)

const getKPIList=()=>{
  getKPIListUserId({
    userId:state.ruleForm.teacherId
  })
  .then((data:any)=>{
    state.kpiList=data.list;
  }).catch(()=>{
    console.error("系统出错");
  })
}

const handleSelectionChange = (selectedRows: []) => {
  state.selectedKpiList = selectedRows
}

// 打开弹窗
const openDialog = (row: any) => {
  state.isShowDialog = true
  state.ruleForm = {
    teacherId:row.id
  }
  getKPIList();
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
const onSubmit = () => {
  if (state.selectedKpiList.length === 0) {
        ElMessage.warning('请至少选择一个KPI');
        return
  }
  const selectedIds = state.selectedKpiList.map((kpi:any) => kpi.id);
  state.ruleForm.kpiIds=selectedIds.join(',');
  dialogFormRef.value.validate((valid: boolean) => {
    if (valid) {
      state.loading = true
      withDraw([state.ruleForm])
        .then(() => {
          ElMessage({
            message: '撤销成功',
            type: 'success',
          })
          state.loading = false
          closeDialog()
          emit('refresh')
        })
        .catch(() => {
          state.loading = false
        })
    } else {
      return false
    }
  })
}

// 暴露变量
defineExpose({
  openDialog,
})
</script>

<style scoped>
.confirm-content {
  display: flex;
  align-items: center;
  gap: 12px;
}

.confirm-message {
  color: #606266;
  font-size: 14px;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}
</style>