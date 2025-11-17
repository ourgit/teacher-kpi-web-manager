<template>
  <div class="dialog-container">
    <el-dialog :title="dialog.title" v-model="dialog.isShowDialog" width="600px" :close-on-click-modal="false" :destroy-on-close="true">
      <el-form ref="dialogFormRef" :model="ruleForm" :rules="rules" size="default" label-width="100px">
        <el-row :gutter="35">
          <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
            <el-form-item label="所属校区" prop="areaId">
              <el-select v-model="ruleForm.areaId" placeholder="选择所属校区" filterable style="width: 100%;">
                <el-option v-for="item in areaList" :key="item.id" :label="item.name" :value="item.id" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
            <el-form-item label="类型" prop="type">
              <el-select v-model="ruleForm.type" placeholder="选择类型" filterable clearable style="width: 100%;">
                <el-option :key="1" label="商家" value="骑手" />
                <el-option :key="2" label="骑手" value="骑手" />
                <el-option :key="2" label="用户" value="用户" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
            <el-form-item label="标题" prop="title">
              <el-input v-model="ruleForm.title" placeholder="请输入名称" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
            <el-form-item label="内容" prop="content">
              <el-input v-model="ruleForm.content" type="textarea" placeholder="请输入内容"></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
            <el-form-item label="状态" prop="status">
              <el-radio-group v-model="ruleForm.status">
                <el-radio :label="1">正常</el-radio>
                <el-radio :label="2">禁用</el-radio>
              </el-radio-group>
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
import { addAnnouncement, updateAnnouncement, getAnnouncementDetail } from '@/api/base/announcement/index'
import { getAreaList } from '@/api/base/area/index'

// 定义子组件向父组件传值/事件
const emit = defineEmits(['refresh'])

// 定义变量内容
const dialogFormRef = ref(ElForm)
const tmapRef = ref()
const state = reactive({
  loading: false,
  ruleForm: {} as any,
  rules: {
    areaId: [{ required: true, trigger: 'change', message: '请选择所属校区' }],
    title: [{ required: true, trigger: 'blur', message: '请填写标题' }],
    content: [{ required: true, trigger: 'blur', message: '请填写内容' }],
    type: [{ required: true, trigger: 'change', message: '请选择类型' }],
  },
  dialog: {
    isShowDialog: false,
    type: '',
    title: '',
    submitTxt: '',
  },
  areaList: [] as Array<any>,
})

const { loading, ruleForm, rules, dialog, areaList } = toRefs(state)

// 打开弹窗
const openDialog = (type: string, row: any) => {
  if (type === 'edit') {
    state.dialog.title = '修改公告'
    state.dialog.submitTxt = '修 改'
    getAnnouncementDetail({
      id: row.id,
    }).then((res) => {
      state.ruleForm = {
        id: res.id,
        status: res.status,
        title: res.title,
        areaId: res.areaId,
        content: res.content,
        type: res.type,
      }
    })
  } else {
    state.dialog.title = '新增公告'
    state.dialog.submitTxt = '新 增'
    state.ruleForm = {
      status: 1,
      title: '',
      areaId: '',
      content: '',
      type: '',
    }
  }
  getAreaListData()
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


// 提交
const onSubmit = () => {
  const ruleForm = JSON.parse(JSON.stringify(state.ruleForm))
  dialogFormRef.value.validate((valid: boolean) => {
    if (valid) {
      state.loading = true
      if (state.dialog.type === 'add') {
        addAnnouncement(ruleForm)
          .then(() => {
            state.loading = false
            closeDialog()
            emit('refresh')
          })
          .catch(() => {
            state.loading = false
          })
      } else {
        updateAnnouncement(ruleForm)
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