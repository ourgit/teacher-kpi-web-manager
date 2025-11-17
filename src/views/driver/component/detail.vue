<template>
  <div class="dialog-container">
    <el-dialog :title="dialog.title" v-model="dialog.isShowDialog" width="600px" :close-on-click-modal="false" :destroy-on-close="true">
      <el-form ref="detailFormRef" :model="ruleForm" :rules="rules" size="default" label-width="100px">
        <el-row :gutter="35">
          <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
            <el-form-item label="头像" prop="avatar">
              <upload-img v-model="ruleForm.avatar" :width="80" :height="80" />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
            <el-form-item label="所属校区" prop="areaId">
              <el-select v-model="ruleForm.areaId" placeholder="选择所属校区" filterable style="width: 100%;">
                <el-option v-for="item in areaList" :key="item.id" :label="item.name" :value="item.id" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
            <el-form-item label="类型" prop="type">
              <el-select v-model="ruleForm.type" placeholder="选择类型" clearable>
                <el-option v-for="item in driverType" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
            <el-form-item label="手机号码" prop="phoneNumber">
              <el-input v-model="ruleForm.phoneNumber" placeholder="请输入手机号码" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col ::xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
            <el-form-item label="密码" prop="password">
              <el-input type="password" v-model="ruleForm.password" :placeholder="dialog.type === 'edit' ? '密码为空则不修改' : '请输入密码'" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
            <el-form-item label="姓名" prop="realName">
              <el-input v-model="ruleForm.realName" placeholder="请输入姓名" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
            <el-form-item label="身份证号码" prop="idCardNumber">
              <el-input v-model="ruleForm.idCardNumber" placeholder="请输入身份证号码" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
            <el-form-item label="身份证正面" prop="idCardPicFront">
              <upload-img v-model="ruleForm.idCardPicFront" :width="80" :height="80" />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
            <el-form-item label="身份证反面" prop="idCardPicBack">
              <upload-img v-model="ruleForm.idCardPicBack" :width="80" :height="80" />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
            <el-form-item label="是否管理员">
              <el-switch v-model="ruleForm.isAdmin" inline-prompt :active-value="true" :inactive-value="false" active-text="是" inactive-text="否"></el-switch>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
            <el-form-item label="状态" prop="status">
              <el-select v-model="ruleForm.status" placeholder="选择状态" filterable clearable style="width: 100%;">
                <el-option :key="1" label="正常" :value="1" />
                <el-option :key="2" label="锁定" :value="2" />
                <el-option :key="3" label="待审核" :value="3" />
                <el-option :key="4" label="审核未通过" :value="4" />
              </el-select>
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
import { ElForm, ElMessage } from 'element-plus'
import { getDriverDetail, addDriver, updateDriver } from '@/api/driver/index'
import UploadImg from '@/components/upload/uploadImg.vue'
import { getAreaList } from '@/api/base/area/index'
import { driverType } from '@/dict/driver'
// 定义子组件向父组件传值/事件
const emit = defineEmits(['refresh'])

// 定义变量内容
function validatePhone(rule: any, value: any, callback: any) {
  if (!value) {
    callback(new Error('手机号码不能为空'))
  } else {
    const reg = /^1[3|4|5|7|8][0-9]\d{8}$/
    if (reg.test(value)) {
      callback()
    } else {
      callback(new Error('请填写正确的手机号码'))
    }
  }
}

function validatePassword(rule: any, value: any, callback: any) {
  if (!value && state.dialog.type === 'add') {
    callback(new Error('密码不能为空'))
  } else {
    callback()
  }
}
const detailFormRef = ref(ElForm)
const state = reactive({
  loading: false,
  ruleForm: {} as any,
  rules: {
    areaId: [{ required: true, trigger: 'change', message: '请选择所属校区' }],
    type: [{ required: true, trigger: 'change', message: '请选择类型' }],
    realName: [{ required: true, trigger: 'blur', message: '请填写姓名' }],
    phoneNumber: [
      { required: true, trigger: 'blur', validator: validatePhone },
    ],
    password: [{ required: true, trigger: 'blur', validator: validatePassword }],
  },
  dialog: {
    isShowDialog: false,
    type: '',
    title: '',
    submitTxt: '',
  },
  areaList: [] as Array<any>,
  itemList: [] as Array<any>,
  newTag: '',
  regionList: [] as Array<any>,
  openTime: '',
  closeTime: '',
})

const { loading, ruleForm, rules, dialog, areaList, itemList, newTag, regionList, openTime, closeTime } = toRefs(state)

// 打开弹窗
const openDialog = (type: string, row: any) => {
  if (type === 'edit') {
    state.dialog.title = '修改商家'
    state.dialog.submitTxt = '修 改'
    getDriverDetail({
      id: row.id,
    }).then((res: any) => {
      state.ruleForm = {
        id: row.id,
        areaId: res.areaId,
        avatar: res.avatar,
        phoneNumber: res.phoneNumber,
        type: res.type,
        password: '',
        realName: res.realName,
        idCardNumber: res.idCardNumber,
        idCardPicFront: res.idCardPicFront,
        idCardPicBack: res.idCardPicBack,
        isAdmin: res.isAdmin,
        status: res.status,
      }
    })
  } else {
    state.dialog.title = '新增商家'
    state.dialog.submitTxt = '新 增'
    state.ruleForm = {
      areaId: '',
      avatar: '',
      phoneNumber: '',
      type: '',
      password: '',
      realName: '',
      idCardNumber: '',
      idCardPicFront: '',
      idCardPicBack: '',
      isAdmin: false,
      status: 1,
    }
  }
  getAreaListData()
  state.dialog.type = type
  state.dialog.isShowDialog = true
}

// 获取校区列表
const getAreaListData = () => {
  getAreaList({
    page: 0
  }).then((data: any) => {
    state.areaList = data.list
  })
}



// 关闭弹窗
const closeDialog = () => {
  state.dialog.isShowDialog = false
}

// 取消
const onCancel = () => {
  closeDialog()
}


// 提交
const onSubmit = () => {
  const ruleForm = JSON.parse(JSON.stringify(state.ruleForm))
  detailFormRef.value.validate((valid: boolean) => {
    if (valid) {
      state.loading = true
      if (state.dialog.type === 'add') {
        addDriver(ruleForm)
          .then(() => {
            state.loading = false
            closeDialog()
            emit('refresh')
          })
          .catch(() => {
            state.loading = false
          })
      } else {
        updateDriver(ruleForm)
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