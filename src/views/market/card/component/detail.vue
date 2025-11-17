<template>
  <div class="dialog-container">
    <el-form ref="detailFormRef" :model="ruleForm" :rules="rules" size="default" label-width="120px">
      <el-row :gutter="35" class="row">
        <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
          <el-form-item label="图片" prop="imgUrl">
            <upload-img v-model="ruleForm.imgUrl" />
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
          <el-form-item label="卡券名称" prop="title">
            <el-input v-model="ruleForm.title" placeholder="请输入卡券名称" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
          <el-form-item label="卡券类型" prop="cardType ">
            <el-select v-model="ruleForm.cardType" placeholder="请选择卡券类型" class="w100">
              <el-option label="普通" :value="10" />
              <el-option label="次卡" :value="20" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
          <el-form-item label="卡券说明" prop="content">
            <el-input v-model="ruleForm.content" placeholder="请输入卡券说明" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
          <el-form-item label="有效天数" prop="days">
            <el-input v-model="ruleForm.days" placeholder="有效天数" clearable class="input100"></el-input>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
          <el-form-item label="状态" prop="status">
            <el-radio-group v-model="ruleForm.status">
              <el-radio :label="1">上架</el-radio>
              <el-radio :label="2">下架</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
          <el-form-item>
            <el-button type="primary" @click="onSubmit" :loading="loading">{{ dialog.submitTxt }}</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import { defineAsyncComponent, onMounted, reactive, ref, toRefs, watch } from 'vue'
import { ElForm } from 'element-plus'
import {
  getCardDetail, updateCard, addCard
} from '@/api/market/card/index'
import UploadImg from '@/components/upload/uploadImg.vue'
import { useRouter } from 'vue-router'


const props = defineProps({
  isEidt: {
    type: Boolean,
    default: false,
  },
})
// 定义变量内容
const detailFormRef = ref(ElForm)
const router = useRouter()
const state = reactive({
  loading: false,
  ruleForm: {} as any,
  rules: {
    title: [{ required: true, trigger: 'blur', message: '请填写卡券名称' }],
  },
  dialog: {
    isShowDialog: false,
    type: '',
    title: '',
    submitTxt: '',
  },
})

const { loading, ruleForm, rules, dialog } =
  toRefs(state)


// 打开弹窗
const openDialog = () => {
  if (props.isEidt) {
    state.dialog.title = '修改卡券券'
    state.dialog.submitTxt = '修 改'
    state.dialog.type = 'edit'
    const cardId = router.currentRoute.value.query.cardId
    getCardDetail({
      id: cardId,
    }).then((res: any) => {
      state.ruleForm = {
        id: res.id,
        title: res.title,
        content: res.content,
        status: res.status,
        cardType: res.cardType,
        imgUrl: res.imgUrl,
        days: res.days
      }
    })
  } else {
    state.dialog.type = 'add'
    state.dialog.title = '新增卡券券'
    state.dialog.submitTxt = '新 增'
    state.ruleForm = {
      title: '',
      content: '',
      status: 1,
      cardType: 10,
      imgUrl: '',
      days: '',
    }
  }
}
// 提交
const onSubmit = () => {
  const ruleForm = JSON.parse(JSON.stringify(state.ruleForm))
  detailFormRef.value.validate((valid: boolean) => {
    if (valid) {
      state.loading = true
      if (state.dialog.type === 'add') {
        addCard(ruleForm)
          .then(() => {
            state.loading = false
            router.push('/market/card/list')
          })
          .catch(() => {
            state.loading = false
          })
      } else {
        updateCard(ruleForm)
          .then(() => {
            state.loading = false
            router.push('/market/card/list')
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
onMounted(() => {
  openDialog()
})

</script>
<style lang="scss" scoped></style>