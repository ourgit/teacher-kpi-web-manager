<template>
  <div class="dialog-container">
    <el-dialog title="下发列表" v-model="isShowDialog" width="500px" :close-on-click-modal="false" :destroy-on-close="true">
      <el-form ref="dialogFormRef" :model="ruleForm" :rules="rules" size="default" label-width="120px">
        <el-table 
          :data="state.teacherList" 
          v-loading="loading" 
          style="width: 100%;height: 200px"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="55" align="center"/>
          <el-table-column prop="userName" label="教师名称" align="center"/>
          <el-table-column prop="typeName" label="教师职位" align="center"/>
        </el-table>
        
        <!-- 显示已选教师数量 -->
        <div style="margin-top: 10px; text-align: center;">
          <el-text type="primary">已选择 {{ state.selectedTeachers.length }} 位教师</el-text>
        </div>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="onCancel" size="default">取 消</el-button>
          <el-button 
            type="primary" 
            @click="onSubmit" 
            size="default" 
            :loading="loading"
            :disabled="state.selectedTeachers.length === 0"
          >
            下 发 ({{ state.selectedTeachers.length }})
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { reactive, toRefs, ref } from 'vue'
import { ElForm, ElMessage } from 'element-plus'
import { dispatch, getTeacherListNotDispatch } from '@/api/kpi/index'

// 定义接口
interface Teacher {
  id: string | number
  userName: string
  typeName: string
}

// 定义子组件向父组件传值/事件
const emit = defineEmits(['refresh', 'confirm'])

// 定义变量内容
const dialogFormRef = ref(ElForm)
const state = reactive({
  loading: false,
  ruleForm: {} as any,
  rules: {
  },
  teacherList: [] as Teacher[],
  selectedTeachers: [] as Teacher[], // 存储选中的教师对象
  isShowDialog: false
})

const { loading, ruleForm, rules, isShowDialog } = toRefs(state)

// 获取教师列表
const getKpiList = () => {
  state.loading = true
  getTeacherListNotDispatch({
    kpiId:state.ruleForm.kpiId
  }).then((data: any) => {
      state.teacherList = data.data
      state.loading = false
    })
    .catch((e) => {
      console.error(e)
      state.loading = false
    })
}

// 处理复选框选择变化
const handleSelectionChange = (selectedRows: Teacher[]) => {
  state.selectedTeachers = selectedRows
}

// 打开弹窗
const openDialog = (row: any) => {
  state.isShowDialog = true
  state.selectedTeachers = [] // 清空已选
  state.ruleForm = {
    kpiId:row.id
  }
   getKpiList()
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
    if (state.selectedTeachers.length === 0) {
        ElMessage.warning('请至少选择一位教师')
        return
    }

    // 提取选中教师的ID数组
    const selectedTeacherIds = state.selectedTeachers.map(teacher => teacher.id)

    dialogFormRef.value.validate((valid: boolean) => {
    if (valid) {
        state.loading = true
      
        // 这里可以调用你的下发API，传递 selectedTeacherIds
        // 例如：distributeToTeachers(selectedTeacherIds)
        state.ruleForm.ids=selectedTeacherIds.join(',')
        dispatch(state.ruleForm)
        .then((data: any) => {
            ElMessage({
                message: `成功下发至 ${state.selectedTeachers.length} 位教师`,
                type: 'success',
            })
            state.loading = false
            closeDialog()
        
            // 向父组件传递选中的教师ID数组
            emit('confirm', selectedTeacherIds)
            emit('refresh')
        })
        .catch((e) => {
            console.error(e);
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

<style>
.scrollbar-demo-item {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 50px;
  margin: 10px;
  text-align: center;
  border-radius: 4px;
  background: var(--el-color-primary-light-9);
  color: var(--el-color-primary);
}
</style>