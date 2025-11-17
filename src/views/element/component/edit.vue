<template>
  <div class="dialog-container">
    <el-dialog title="更新要素" v-model="isShowDialog" width="500px" :close-on-click-modal="false" :destroy-on-close="true">
      <el-form ref="dialogFormRef" :model="ruleForm" :rules="rules" size="default" label-width="120px">
        <el-row :gutter="35">
          <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
            <el-form-item label="评价要素" prop="element">
              <el-input v-model="ruleForm.data[0].element" placeholder="请输入评价要素" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
            <el-form-item label="评价标准" prop="criteria">
              <el-input v-model="ruleForm.data[0].criteria" placeholder="请输入评价标准" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
            <el-form-item label="模式" prop="type">
              <el-input v-model="ruleForm.data[0].type" placeholder="请输入模式类型(暂定)" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
            <el-form-item label="分值" prop="score">
              <el-input v-model="ruleForm.data[0].score" placeholder="请输入分值" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
            <el-form-item label="指标" prop="indicatorId">
              <el-select v-model="ruleForm.data[0].indicatorId" placeholder="选择指标" clearable>
                <el-option label="选择指标" :value="0" />
                <el-option v-for="item in state.indicatorList" :label="item.indicatorName" :value="item.id" />
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
import { updateElement } from '@/api/element/index'
import { getIndicatorList } from '@/api/indicator/index'


// 定义子组件向父组件传值/事件
const emit = defineEmits(['refresh'])

function validateKpiId(rule: any, value: any, callback: any) {
  if(value<=0){
    callback(new Error('请填写指标'))
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
  indicatorList:[] as any,
  isShowDialog: false
})

const { loading, ruleForm, rules, isShowDialog } = toRefs(state)

const getIndicator=()=>{
  getIndicatorList({})
  .then((data: any) => {
    state.indicatorList=data.data.list
  })
  .catch((e) => {
    console.error(e);
  })
}

// 打开弹窗
const openDialog = (row: any) => {
  state.isShowDialog = true
  getIndicator()
  state.ruleForm = {
    type:1,
    data:[{
      id: row.id,
      element: row.element,
      criteria: row.criteria,
      type: row.type,
      score: row.score,
      indicatorId: row.indicatorId
    }]
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
      updateElement([state.ruleForm])
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