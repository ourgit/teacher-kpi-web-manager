<template>
  <el-form ref="formRef" size="default" label-width="100px" class="form-container">
    <el-row :gutter="35">
      <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
        <el-form-item label="规格模板">
          <el-select v-model="currentTemplateId" placeholder="请选择规格模板" size="default">
            <el-option v-for="item in attrTemplateList" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
          <el-button size="default" type="primary" style="margin-left: 5px;" @click="onSelectTemplate">
            确定
          </el-button>
        </el-form-item>
      </el-col>
      <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
        <el-form-item>
          <div class="add-wrap">
            <template v-if="!isAddParame">
              <el-button size="default" type="primary" @click="isAddParame=true">
                <el-icon>
                  <ele-Plus />
                </el-icon>
                新增新参数
              </el-button>
              <el-button size="default" type="primary" @click="isShowDialog=true">
                批量添加参数
              </el-button>
            </template>
            <div v-else class="add-form">
              <el-form-item label="参数名称">
                <el-input v-model="newParameName" placeholder="参数名称" class="input100"></el-input>
              </el-form-item>
              <el-form-item label="参数值">
                <el-input v-model="newParameValue" placeholder="参数值"></el-input>
              </el-form-item>
              <el-form-item style="margin-left: 10px;">
                <el-button type="primary" @click="onAddParame">新增</el-button>
                <el-button @click="isAddParame=false">取消</el-button>
              </el-form-item>
            </div>
          </div>
        </el-form-item>
      </el-col>
      <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
        <el-form-item>
          <el-table :data="formData.param" style="margin-bottom: 30px">
            <el-table-column label="参数名" align="center" min-width="500">
              <template #default="{ row }">
                <el-input v-model="row.name" size="default" placeholder="参数名" style="width:90%" />
              </template>
            </el-table-column>
            <el-table-column label="参数值" align="center" min-width="500">
              <template #default="{ row }">
                <template v-if="row.type === 'select'">
                  <el-select v-model="row.value" style="width:90%" clearable filterable allow-create default-first-option>
                    <el-option v-for="(item, index) in row.list" :key="index" :label="item" :value="item" />
                  </el-select>
                </template>
                <template v-else>
                  <el-input v-model="row.value" size="default" placeholder="参数值" style="width:90%" />
                </template>
              </template>
            </el-table-column>
            <el-table-column label="操作" align="center" min-width="150">
              <template #default="scope">
                <el-button size="small" text type="primary" @click="onMoveUp(scope.$index)">↑上移</el-button>
                <el-button size="small" text type="primary" @click="onMoveDown(scope.$index)">↓下移</el-button>
                <el-button size="small" text type="primary" @click="onDelParame(scope.$index)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
  <el-dialog title="批量导入参数" v-model="isShowDialog" width="500px" :close-on-click-modal="false" :destroy-on-close="true">
    <el-form ref="batchFormRef" :model="ruleForm" :rules="rules" size="default" label-width="0px">
      <el-row :gutter="35">
        <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
          <el-form-item prop="ids">
            <el-input v-model="ruleForm.parameDesc" :rows="15" type="textarea" placeholder=" 一个参数一行，参数名和参数值用“ ：”区分" clearable></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="isShowDialog=false" size="default">取 消</el-button>
        <el-button type="primary" @click="onBatch" size="default">确定导入</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { reactive, toRefs, ref, watch } from 'vue'
import { ElForm, ElMessage } from 'element-plus'

const props = defineProps({
  detailData: {
    type: Object,
    default: Object,
  },
  attrTemplateList: {
    type: Array as any,
    default: Array,
  },
})

// 定义变量内容
const batchFormRef = ref(ElForm)
const state = reactive({
  formData: {
    param: [],
  } as any,
  currentTemplateId: '',
  isAddParame: false, //是否新增参数
  newParameName: '',
  newParameValue: '',
  isShowDialog: false,
  ruleForm: {
    parameDesc: '',
  },
  rules: {
    parameDesc: [
      { required: true, trigger: 'blur', message: '请填写导入信息' },
    ],
  },
})

const {
  currentTemplateId,
  formData,
  isAddParame,
  newParameName,
  newParameValue,
  isShowDialog,
  ruleForm,
  rules,
} = toRefs(state)

watch(
  () => props.detailData,
  (newValue: any) => {
    if (newValue) {
      initFormData(newValue)
    }
  }
)

const initFormData = (val: any) => {
  state.formData = {
    param: val.param,
  }
}

//确认选中规格
const onSelectTemplate = () => {
  if (!state.currentTemplateId) {
    return ElMessage({
      message: '请选择规格模板',
      type: 'error',
    })
  }
  const thisTemplate = props.attrTemplateList.find((item: any) => {
    return item.id === state.currentTemplateId
  })
  const parameList = JSON.parse(thisTemplate.params)
  parameList.forEach((parame: any) => {
    const isExist = state.formData.param.findIndex((item: any) => {
      return item.name === parame.name
    })
    if (isExist === -1) {
      state.formData.param.push({
        name: parame.name,
        type: parame.type,
        value: parame.type === 'select' ? parame.list[0] : parame.list,
        list: parame.type === 'select' ? parame.list : [],
      })
    }
  })
}

// 新增参数
const onAddParame = () => {
  if (!state.newParameName) {
    return ElMessage({
      message: '请输入参数名称',
      type: 'error',
    })
  }
  const isExist = state.formData.param.findIndex((item: any) => {
    return item.name === state.newParameName
  })
  if (isExist !== -1) {
    return ElMessage({
      message: '参数名称已存在',
      type: 'error',
    })
  }
  state.formData.param.push({
    name: state.newParameName,
    value: state.newParameValue,
  })
  state.newParameName = ''
  state.newParameValue = ''
  state.isAddParame = false
}

// 删除参数
const onDelParame = (index: number) => {
  state.formData.param.splice(index, 1)
}

//上移
const onMoveUp = (index: number) => {
  const upDate = state.formData.param[index - 1]
  state.formData.param.splice(index - 1, 1)
  state.formData.param.splice(index, 0, upDate)
}

//上移
const onMoveDown = (index: number) => {
  const downDate = state.formData.param[index + 1]
  state.formData.param.splice(index + 1, 1)
  state.formData.param.splice(index, 0, downDate)
}

// 批量生成
const onBatch = () => {
  batchFormRef.value.validate((valid: boolean) => {
    if (valid) {
      const parameDesc = state.ruleForm.parameDesc.split(/[(\r\n)\r\n]+/)
      parameDesc.forEach((item: any) => {
        if (item) {
          const paramData = item.split(/[:：]/)
          state.formData.param.push({
            name: paramData[0],
            value: paramData[1],
          })
        }
      })
      state.isShowDialog = false
    } else {
      return false
    }
  })
}
//子传父
const transmit = () => {
  return state.formData
}
// 暴露方法
defineExpose({
  transmit,
})
</script>
<style lang="scss" scoped>
.add-wrap {
  width: 100%;
  .add-form {
    display: flex;
  }
}
</style>
