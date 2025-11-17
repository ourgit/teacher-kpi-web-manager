<template>
  <div class="dialog-container">
    <el-dialog :title="dialog.title" v-model="dialog.isShowDialog" width="600px" :close-on-click-modal="false" :destroy-on-close="true">
      <el-form ref="dialogFormRef" :model="ruleForm" :rules="rules" size="default" label-width="100px">
        <el-row :gutter="35">
          <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
            <el-form-item label="所属校区" prop="areaId">
              <el-select v-model="ruleForm.areaId" placeholder="选择所属校区" @change="getCabinetListData" filterable style="width: 100%;">
                <el-option v-for="item in areaList" :key="item.id" :label="item.name" :value="item.id" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
            <el-form-item label="所属智能柜" prop="cabinetId">
              <el-select v-model="ruleForm.cabinetId" placeholder="选择所属智能柜" filterable style="width: 100%;">
                <el-option v-for="item in cabinetList" :key="item.id" :label="item.name" :value="item.id" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
            <el-form-item label="柜门编号" prop="boxNo">
              <el-input v-model="ruleForm.boxNo" placeholder="请输入柜门编号" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
            <el-form-item label="状态">
              <el-switch v-model="ruleForm.enable" inline-prompt :active-value="true" :inactive-value="false" active-text="启用" inactive-text="禁用"></el-switch>
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
import { getCabinetList } from '@/api/base/cabinet/index'
import { addCabinetBox, updateCabinetBox, getCabinetBoxDetail } from '@/api/base/cabinet/box'
import { getAreaList } from '@/api/base/area/index'

// 定义子组件向父组件传值/事件
const emit = defineEmits(['refresh'])

// 定义变量内容
const dialogFormRef = ref(ElForm)
const state = reactive({
  loading: false,
  ruleForm: {} as any,
  rules: {
    cabinetId: [{ required: true, trigger: 'change', message: '请选择智能柜' }],
    boxNo: [{ required: true, trigger: 'blur', message: '请填写柜门编号' }],
  },
  dialog: {
    isShowDialog: false,
    type: '',
    title: '',
    submitTxt: '',
  },
  areaList: [] as Array<any>,
  cabinetList: [] as Array<any>,
})

const { loading, ruleForm, rules, dialog, areaList, cabinetList } = toRefs(state)

// 打开弹窗
const openDialog = (type: string, row: any) => {
  if (type === 'edit') {
    state.dialog.title = '修改存放点'
    state.dialog.submitTxt = '修 改'
    getCabinetBoxDetail({
      id: row.id,
    }).then((res) => {
      state.ruleForm = {
        id: res.id,
        cabinetId: res.cabinetId,
        boxNo: res.boxNo,
        enable: res.enable,
      }
    })
  } else {
    state.dialog.title = '新增存放点'
    state.dialog.submitTxt = '新 增'
    state.ruleForm = {
      cabinetId: '',
      boxNo: '',
      enable: true,
    }
  }
  getAreaListData()
  getCabinetListData(0)
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

// 获取校区列表
const getAreaListData = () => {
  getAreaList({
    page: 0
  }).then((data: any) => {
    state.areaList = data.list
  })
}


const getCabinetListData = (e: any) => {
  getCabinetList({
    page: 0,
    areaId: e,
  }).then((data: any) => {
    state.cabinetList = data.list
  })
}

// 提交
const onSubmit = () => {
  const ruleForm = JSON.parse(JSON.stringify(state.ruleForm))
  dialogFormRef.value.validate((valid: boolean) => {
    if (valid) {
      state.loading = true
      if (state.dialog.type === 'add') {
        addCabinetBox(ruleForm)
          .then(() => {
            state.loading = false
            closeDialog()
            emit('refresh')
          })
          .catch(() => {
            state.loading = false
          })
      } else {
        updateCabinetBox(ruleForm)
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

<style scoped lang="scss">
.mb20 {
  margin-bottom: 20px;
}
</style>