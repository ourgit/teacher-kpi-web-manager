<template>
  <div class="dialog-container">
    <el-dialog :title="dialog.title" v-model="dialog.isShowDialog" width="1000px" :close-on-click-modal="false" :destroy-on-close="true">
      <el-form ref="detailFormRef" :model="ruleForm" :rules="rules" size="default" label-width="80px">
        <el-row :gutter="35">
          <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
            <el-form-item label="所属商家" prop="orgId">
              <el-select v-model="ruleForm.orgId" placeholder="选择商家" clearable filterable>
                <el-option v-for="item in orgList" :key="item.id" :label="item.name" :value="item.id" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
            <el-form-item label="模板名称" prop="name">
              <el-input v-model="ruleForm.name" placeholder="请输入模板名称" clearable class="input200"></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
            <el-form-item label="规格列表">
              <attr v-model="attrList" />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
            <el-form-item label="参数列表">
              <parame v-model="paramsList" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="onCancel" size="default">取 消</el-button>
          <el-button type="primary" @click="onSubmit" size="default" :loading="loading">{{ dialog.submitTxt }}</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { reactive, toRefs, ref } from 'vue'
import { ElForm } from 'element-plus'
import { addTemplate, updateTemplate } from '@/api/product/attr/index'
import { getOrganList } from '@/api/organ/index'
import attr from './attr.vue'
import parame from './parame.vue'

// 定义子组件向父组件传值/事件
const emit = defineEmits(['refresh'])

// 定义变量内容
const detailFormRef = ref(ElForm)
const state = reactive({
  loading: false,
  ruleForm: {} as any,
  rules: {
    orgId: [{ required: true, trigger: 'blur', message: '请选择商家' }],
    name: [{ required: true, trigger: 'blur', message: '请填写模板名称' }],
  },
  attrList: [],
  paramsList: [],
  dialog: {
    isShowDialog: false,
    type: '',
    title: '',
    submitTxt: '',
  },
  orgList: [] as any,
})

const { loading, ruleForm, rules, dialog, attrList, paramsList, orgList } = toRefs(state)

// 打开弹窗
const openDialog = (type: string, row: any) => {
  if (type === 'edit') {
    state.dialog.title = '修改规格模板'
    state.dialog.submitTxt = '修 改'
    state.ruleForm = {
      id: row.id,
      orgId: row.orgId,
      name: row.name,
    }
    state.attrList = row.attr ? JSON.parse(row.attr) : []
    state.paramsList = row.params ? JSON.parse(row.params) : []
  } else {
    state.dialog.title = '新增规格模板'
    state.dialog.submitTxt = '新 增'
    state.ruleForm = {
      orgId: '',
      name: '',
    }
    state.attrList = []
    state.paramsList = []
  }
  getOrganListData()
  state.dialog.type = type
  state.dialog.isShowDialog = true
}
// 关闭弹窗
const closeDialog = () => {
  state.dialog.isShowDialog = false
}
// 取消
const onCancel = () => {
  closeDialog()
}

// 获取商家列表
const getOrganListData = () => {
  getOrganList({
    page: 0,
  }).then((data: any) => {
    state.orgList = data.list
  })
}


// 提交
const onSubmit = () => {
  const arrtList = state.attrList.map((item: any) => {
    return {
      name: item.name,
      list: item.list,
    }
  })
  const paramsList = state.paramsList.map((item: any) => {
    return {
      name: item.name,
      type: item.type,
      list: item.list,
    }
  })
  const ruleForm = JSON.parse(JSON.stringify(state.ruleForm))
  ruleForm.attr = JSON.stringify(arrtList)
  ruleForm.params = JSON.stringify(paramsList)
  detailFormRef.value.validate((valid: boolean) => {
    if (valid) {
      state.loading = true
      if (state.dialog.type === 'add') {
        addTemplate(ruleForm)
          .then(() => {
            state.loading = false
            closeDialog()
            emit('refresh')
          })
          .catch(() => {
            state.loading = false
          })
      } else {
        updateTemplate(ruleForm)
          .then(() => {
            state.loading = false
            closeDialog()
            emit('refresh')
          })
          .catch(() => {
            state.loading = false
          })
      }
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
<style lang="scss" scoped></style>
