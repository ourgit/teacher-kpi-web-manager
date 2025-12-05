<template>
  <div class="dialog-container">
    <el-dialog title="更新内容" v-model="isShowDialog" width="500px" :close-on-click-modal="false" :destroy-on-close="true">
      <el-form ref="dialogFormRef" :model="ruleForm" :rules="rules" size="default" label-width="120px">
        <el-row :gutter="35">
          <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
            <el-form-item label="内容名" prop="content">
              <el-input v-model="ruleForm.content" placeholder="请输入内容名" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
            <el-form-item label="分权" prop="score">
              <el-input v-model="ruleForm.score" placeholder="请输入分权" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
            <el-form-item label="得分类型" prop="typeId">
              <el-select v-model="ruleForm.typeId" placeholder="请选择得分类型" clearable>
                <el-option label="请选择得分类型" :value="0" />
                <el-option
                  v-for="item in state.scoreTypeList"
                  :key="item.id"
                  :label="formatScoreTypeLabel(item)"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
            <el-form-item label="要素" prop="elementId">
              <el-select v-model="ruleForm.elementId" placeholder="选择要素" clearable>
                <el-option label="选择要素" :value="0" />
                <el-option v-for="item in state.kpiList" :label="item.element" :value="item.id" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
            <el-form-item label="封顶" prop="topScore">
              <el-input v-model="ruleForm.topScore" placeholder="请输入封顶" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
            <el-form-item label="封底" prop="bottomScore">
              <el-input v-model="ruleForm.bottomScore" placeholder="请输入封底" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
            <el-form-item label="文件上传" prop="type">
              <el-radio-group v-model="ruleForm.type">
                <el-radio :label="0">无需文件</el-radio>
                <el-radio :label="1">需要文件</el-radio>
              </el-radio-group>
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
import { updateContent } from '@/api/content/index'
import { getElementList } from '@/api/element/index'
import { getJsonList } from '@/api/tool/index'

// 定义子组件向父组件传值/事件
const emit = defineEmits(['refresh'])

function createSelectValidator(message: string) {
  return (rule: any, value: any, callback: any) => {
    if (value === undefined || value === null || value <= 0) {
      callback(new Error(message))
    } else {
      callback()
    }
  }
}

// 定义变量内容
const createDefaultData = () => ({
  id: 0,
  content: '',
  score: '',
  elementId: 0,
  typeId: 0,
  topScore: '',
  bottomScore: '',
  type: 0,
})

const dialogFormRef = ref(ElForm)
const validateUploadFlag = (rule: any, value: number, callback: any) => {
  if (value !== 0 && value !== 1) {
    callback(new Error('请选择是否需要文件'))
  } else {
    callback()
  }
}

const state = reactive({
  loading: false,
  ruleForm: {} as any,
  rules: {
    typeId:[{ required: true, validator: createSelectValidator('请选择得分类型')}],
    elementId:[{ required: true, validator: createSelectValidator('请选择要素')}],
    type:[{ required: true, validator: validateUploadFlag }]
  },
  kpiList:[] as any,
  scoreTypeList: [] as any,
  isShowDialog: false
})

const { loading, ruleForm, rules, isShowDialog } = toRefs(state)

const getElement=()=>{
  getElementList({})
  .then((data: any) => {
    state.kpiList=data.list
  })
  .catch((e) => {
    console.error(e);
  })
}

const getScoreTypeList = () => {
  getJsonList({})
    .then((data: any) => {
      state.scoreTypeList = data.list || []
    })
    .catch((e: any) => {
      console.error(e)
    })
}

const formatScoreTypeLabel = (item: any) => {
  if (!item) return ''
  if (item.description) return `${item.description}（ID: ${item.id}）`
  return `类型ID：${item.id}`
}

// 打开弹窗
const openDialog = (row: any) => {
  state.isShowDialog = true
  getElement()
  getScoreTypeList()
  state.ruleForm = {
    id: row.id,
    content: row.content,
    score: row.score,
    elementId: row.elementId,
    typeId: row.typeId || 0,
    topScore: row.topScore,
    bottomScore: row.bottomScore,
    type: row.type ?? 0,
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
      updateContent(state.ruleForm)
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
