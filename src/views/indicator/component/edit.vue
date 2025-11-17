<template>
  <div class="dialog-container">
    <el-dialog title="修改指标" v-model="isShowDialog" width="500px" :close-on-click-modal="false" :destroy-on-close="true">
      <el-form ref="dialogFormRef" :model="ruleForm" :rules="rules" size="default" label-width="120px">
        <el-row :gutter="35">
          <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
            <el-form-item label="指标名称" prop="indicatorName">
              <el-input v-model="ruleForm.data[0].indicatorName" placeholder="请输入指标名称" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
            <el-form-item label="指标附属名称" prop="subName">
              <el-input v-model="ruleForm.data[0].subName" placeholder="请输入指标附属名称" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
            <el-form-item label="KPI" prop="kpiId">
              <el-select v-model="ruleForm.data[0].kpiId" placeholder="选择KPI" clearable>
                <el-option v-for="item in state.kpiList" :label="item.title" :value="item.id" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="onCancel" size="default">取 消</el-button>
          <el-button type="primary" @click="onSubmit" size="default" :loading="loading">保存</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { reactive, toRefs, ref } from 'vue'
import { ElForm, ElMessage } from 'element-plus'
import { updateIndicator } from '@/api/indicator/index'
import { getKPIList } from '@/api/kpi/index'


// 定义子组件向父组件传值/事件
const emit = defineEmits(['refresh'])

function validateKpiId(rule: any, value: any, callback: any) {
  if(value<=0){
    callback(new Error('请填写KPI'))
  }else{
    callback()
  }
}

// 定义变量内容
const dialogFormRef = ref(ElForm)
const state = reactive({
  loading: false,
  ruleForm: {} as any,
  rules: {
    kpiId:[{ required: true, validator: validateKpiId}]
  },
  kpiList:[] as any,
  isShowDialog: false
})

const { loading, ruleForm, rules, isShowDialog } = toRefs(state)

const getKpiList=()=>{
  getKPIList({})
  .then((data: any) => {
    state.kpiList=data.data.list
  })
  .catch((e) => {
    console.error(e);
  })
}

// 打开弹窗
const openDialog = (row: any) => {
  state.isShowDialog = true
  getKpiList()
  state.ruleForm = {
    data:[{
      id: row.id,
      indicatorName: row.indicatorName,
      subName: row.subName,
      kpiId: row.kpiId
    }],
    type:3
  }
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
  dialogFormRef.value.validate((valid: boolean) => {
    if (valid) {
      state.loading = true
      updateIndicator([state.ruleForm])
        .then(() => {
          ElMessage({
            message: '更新成功',
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
