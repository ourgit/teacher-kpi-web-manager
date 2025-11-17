<template>
  <div class="dialog-container">
    <el-dialog :title="dialog.title" v-model="dialog.isShowDialog" width="810px" :close-on-click-modal="false" :destroy-on-close="true">
      <el-form ref="dialogFormRef" :model="ruleForm" :rules="rules" size="default" label-width="120px">
        <el-row :gutter="35">
          <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
            <el-form-item label="用户头像">
              <upload-img v-model="ruleForm.avatar" :width="80" :height="80" />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
            <el-form-item label="登录名" prop="userName">
              <el-input v-model="ruleForm.userName" placeholder="请输入登录名" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
            <el-form-item label="用户昵称" prop="realName">
              <el-input v-model="ruleForm.realName" placeholder="请输入用户昵称" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col v-if="dialog.type === 'add'" :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
            <el-form-item label="登录密码" prop="password">
              <el-input type="password" v-model="ruleForm.password" placeholder="请输入登录密码" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col v-if="dialog.type === 'add'" :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
            <el-form-item label="确认密码" prop="checkPassword">
              <el-input type="password" v-model="ruleForm.checkPassword" placeholder="请输入确认密码" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
            <el-form-item label="关联角色" prop="groupIdList">
              <el-select v-model="ruleForm.groupIdList" multiple placeholder="请选择关联角色" clearable class="w100">
                <el-option v-for="(item, index) in roleList" :key="index" :label="item.groupName" :value="item.id"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
            <el-form-item label="管理商家范围" prop="showOrgType">
              <el-select v-model="ruleForm.showOrgType" multiple placeholder="请选择管理商家范围" clearable class="w100">
                <el-option v-for="(item, index) in orgTypeList" :key="index" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
            <el-form-item label="管理区域范围" prop="groupIdList">
              <el-select v-model="ruleForm.showShopPlace" multiple placeholder="请选择管理区域范围" clearable class="w100">
                <el-option v-for="(item, index) in shopPlaceList" :key="index" :label="item.name" :value="item.id"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
            <el-form-item label="用户状态">
              <el-switch v-model="ruleForm.status" inline-prompt :active-value="1" :inactive-value="2" active-text="启" inactive-text="禁"></el-switch>
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
import { addUser, updateUser } from '@/api/system/user/index'
import { getRoleList } from '@/api/system/role/index'
import { getRegionList } from '@/api/base/region/index'
import UploadImg from '@/components/upload/uploadImg.vue'

// 定义子组件向父组件传值/事件
const emit = defineEmits(['refresh'])

function validatePassword(rule: any, value: any, callback: any) {
  if (state.dialog.type === 'add') {
    if (value.trim() === '') {
      callback(new Error('请填写登录密码'))
    } else if (value.length < 6) {
      callback(new Error('请填写最少6位的密码'))
    } else {
      callback()
    }
  } else {
    callback()
  }
}

function validateCheckPassword(rule: any, value: any, callback: any) {
  if (state.dialog.type === 'add') {
    if (value.trim() === '') {
      callback(new Error('请再次输入登录密码'))
    } else if (value !== state.ruleForm.password) {
      callback(new Error('两次输入的密码不一致'))
    } else {
      callback()
    }
  } else {
    callback()
  }
}

// 定义变量内容
const dialogFormRef = ref(ElForm)
const state = reactive({
  loading: false,
  ruleForm: {} as any,
  rules: {
    userName: [{ required: true, trigger: 'blur', message: '请填写登录名' }],
    realName: [{ required: true, trigger: 'blur', message: '请填写用户姓名' }],
    password: [
      { required: true, trigger: 'blur', validator: validatePassword },
    ],
    checkPassword: [
      { required: true, trigger: 'blur', validator: validateCheckPassword },
    ],
    groupIdList: [
      { required: true, trigger: 'blur', message: '请选择关联角色' },
    ],
  },
  dialog: {
    isShowDialog: false,
    type: '',
    title: '',
    submitTxt: '',
  },
  roleList: [] as any,
  orgTypeList: [
    {
      label: '门面',
      value: 1
    },
    {
      label: '后勤',
      value: 2
    },
    {
      label: '校外',
      value: 3
    }
  ],
  shopPlaceList: [] as any
})

const { loading, ruleForm, rules, dialog, roleList, orgTypeList, shopPlaceList } = toRefs(state)

// 打开弹窗
const openDialog = (type: string, row: any) => {
  if (type === 'edit') {
    state.dialog.title = '修改用户'
    state.dialog.submitTxt = '修 改'
    state.ruleForm = {
      id: row.id,
      userName: row.userName,
      realName: row.realName,
      avatar: row.avatar,
      groupIdList: row.groupIdList,
      status: row.status,
      showOrgType: row.showOrgType ? JSON.parse(row.showOrgType) : [],
      showShopPlace: row.showShopPlace ? JSON.parse(row.showShopPlace) : [],
    }
  } else {
    state.dialog.title = '新增用户'
    state.dialog.submitTxt = '新 增'
    state.ruleForm = {
      userName: '',
      realName: '',
      avatar: '',
      password: '',
      checkPassword: '',
      groupIdList: [],
      showOrgType: [],
      showShopPlace: [],
      status: 1,
    }
  }
  getRoleListData()
  getRegionListData()
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

// 获取角色列表
const getRoleListData = () => {
  getRoleList().then((data: any) => {
    state.roleList = data.list
  })
}

// 获取区域列表
const getRegionListData = () => {
  getRegionList({ page: 0 }).then((data: any) => {
    state.shopPlaceList = data.list
  })
}

// 提交
const onSubmit = () => {
  const ruleForm = JSON.parse(JSON.stringify(state.ruleForm))
  ruleForm.showOrgType = JSON.stringify(ruleForm.showOrgType)
  ruleForm.showShopPlace = JSON.stringify(ruleForm.showShopPlace)
  dialogFormRef.value.validate((valid: boolean) => {
    if (valid) {
      state.loading = true
      if (state.dialog.type === 'add') {
        delete ruleForm.checkPassword
        addUser(ruleForm)
          .then(() => {
            state.loading = false
            closeDialog()
            emit('refresh')
          })
          .catch(() => {
            state.loading = false
          })
      } else {
        updateUser(ruleForm)
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
