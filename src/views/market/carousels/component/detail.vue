<template>
  <div class="dialog-container">
    <el-dialog :title="dialog.title" v-model="dialog.isShowDialog" width="600px" :close-on-click-modal="false" :destroy-on-close="true">
      <el-form ref="detailFormRef" :model="ruleForm" :rules="rules" size="default" label-width="120px">
        <el-row :gutter="35">
          <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
            <el-form-item label="轮播类型" prop="bizType">
              <el-select v-model="ruleForm.bizType" placeholder="请选择轮播类型" class="w100">
                <el-option label="首页轮播" :value="1"></el-option>
                <el-option label="分类轮播" :value="2"></el-option>
                <el-option label="首页弹出" :value="3"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
            <el-form-item label="轮播名称" prop="name">
              <el-input v-model="ruleForm.name" placeholder="请输入轮播名称" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
            <el-form-item label="备注" prop="description">
              <el-input v-model="ruleForm.description" type="textarea" placeholder="请输入轮播备注"></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
            <el-form-item label="排序" prop="sort">
              <el-input v-model="ruleForm.sort" placeholder="请输入排序"></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
            <el-form-item label="轮播图片" prop="imgUrl">
              <upload-img v-model="ruleForm.imgUrl" />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
            <el-form-item label="链接地址" prop="linkUrl">
              <el-input v-model="ruleForm.linkUrl" type="textarea" placeholder="请输入链接地址"></el-input>
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
import { reactive, ref, toRefs } from 'vue'
import { ElForm } from 'element-plus'
import {
  getCarouselsDetail,
  addCarousels,
  updateCarousels,
} from '@/api/market/carousels/index'
import UploadImg from '@/components/upload/uploadImg.vue'

// 定义子组件向父组件传值/事件
const emit = defineEmits(['refresh'])

// 定义变量内容
const detailFormRef = ref()

const state = reactive({
  loading: false,
  linkType: 0,
  linkTypeOption: [],
  ruleForm: {} as any,
  rules: {
    name: [{ required: true, trigger: 'blur', message: '请填写轮播名称' }],
    imgUrl: [{ required: true, trigger: 'blur', message: '请上传轮播图片' }],
    displayOrder: [
      { required: true, trigger: 'blur', message: '请填写排列序号' },
    ],
  },
  dialog: {
    isShowDialog: false,
    type: '',
    title: '',
    submitTxt: '',
  },
})

const { loading, linkType, ruleForm, rules, dialog } = toRefs(state)

// 打开弹窗
const openDialog = (type: string, row: any) => {
  if (type === 'edit') {
    state.dialog.title = '修改轮播图'
    state.dialog.submitTxt = '修 改'
    getCarouselsDetail({
      id: row.id,
    }).then((res) => {
      if (res.linkUrl) {
        const arr = res.linkUrl.split('?')
        if (arr.length > 1) {
          const pageUrl = arr[0]
          state.linkTypeOption.forEach((item: any) => {
            if (item.value === pageUrl) {
              state.linkType = item.type
            }
          })
          if (!state.linkType) {
            state.linkType = 99
          }
        } else {
          state.linkType = 99
        }
      } else {
        state.linkType = 0
      }
      state.ruleForm = {
        id: row.id,
        clientType: res.clientType,
        bizType: res.bizType,
        name: res.name,
        imgUrl: res.imgUrl,
        linkUrl: res.linkUrl,
        description: res.description,
        displayOrder: res.displayOrder,
        needShow: res.needShow,
      }
    })
  } else {
    state.dialog.title = '新增轮播图'
    state.dialog.submitTxt = '新 增'
    state.ruleForm = {
      clientType: 2,
      bizType: 1,
      name: '',
      imgUrl: '',
      linkUrl: '',
      description: '',
      displayOrder: 1,
      needShow: true,
    }
  }
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

// 更改链接类型
const changeType = (val: any) => {
  state.ruleForm.linkUrl = ''
  state.ruleForm.description = ''
}

// 提交
const onSubmit = () => {
  const ruleForm = JSON.parse(JSON.stringify(state.ruleForm))
  detailFormRef.value.validate((valid: boolean) => {
    if (valid) {
      state.loading = true
      if (state.dialog.type === 'add') {
        addCarousels(ruleForm)
          .then(() => {
            state.loading = false
            closeDialog()
            emit('refresh')
          })
          .catch(() => {
            state.loading = false
          })
      } else {
        updateCarousels(ruleForm)
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
