<template>
  <div class="dialog-container">
    <el-dialog :title="dialog.title" v-model="dialog.isShowDialog" width="800px" :close-on-click-modal="false" :destroy-on-close="true">
      <el-form ref="dialogFormRef" :model="ruleForm" :rules="rules" size="default" label-width="100px">
        <el-row :gutter="35">
          <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12" class="mb20">
            <el-form-item label="头像" prop="avatar">
              <upload-img v-model="ruleForm.avatar" />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12" class="mb20">
            <el-form-item label="logo" prop="rectLogo">
              <upload-img v-model="ruleForm.rectLogo" />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
            <el-form-item label="学校名称" prop="name">
              <el-input v-model="ruleForm.name" placeholder="请输入学校名称" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
            <el-form-item label="校区简介" prop="digest">
              <el-input v-model="ruleForm.digest" type="textarea" :rows="3" placeholder="请输入校区简介" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12" class="mb20">
            <el-form-item label="联系电话" prop="contactNumber">
              <el-input v-model="ruleForm.contactNumber" placeholder="请输入联系电话" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12" class="mb20">
            <el-form-item label="联系人" prop="contactName">
              <el-input v-model="ruleForm.contactName" placeholder="请输入联系人" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
            <el-form-item label="地址" prop="address">
              <el-input v-model="ruleForm.address" placeholder="请输入地址" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="8" :md="8" :lg="8" :xl="8" class="mb20">
            <el-form-item label="经度" prop="lon">
              <el-input v-model="ruleForm.lon" placeholder="请输入经度" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="8" :md="8" :lg="8" :xl="8" class="mb20">
            <el-form-item label="纬度" prop="lat">
              <el-input v-model="ruleForm.lat" placeholder="请输纬度" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="8" :md="8" :lg="8" :xl="8" class="mb20">
            <el-form-item label-width="0">
              <el-button type="primary" @click="onOpenMap">
                地图定位
              </el-button>
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
          <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
            <el-form-item label="备注" prop="description">
              <el-input v-model="ruleForm.description" type="textarea" :rows="3" placeholder="请输入备注" clearable></el-input>
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
    <tmap ref="tmapRef" @onChange="updateAddress" />
  </div>
</template>

<script setup lang="ts">
import { reactive, toRefs, ref } from 'vue'
import { ElForm } from 'element-plus'
import { addArea, updateArea, getAreaDetail } from '@/api/base/area/index'
import uploadImg from '@/components/upload/uploadImg.vue'
import tmap from '@/components/tmap/index.vue'
import { centerLatLng } from '@/config'

// 定义子组件向父组件传值/事件
const emit = defineEmits(['refresh'])

// 定义变量内容
const dialogFormRef = ref(ElForm)
const tmapRef = ref()
const state = reactive({
  loading: false,
  ruleForm: {} as any,
  rules: {
    name: [{ required: true, trigger: 'blur', message: '请填写学校名称' }],
    contactNumber: [{ required: true, trigger: 'blur', message: '请填写联系电话' }],
    contactName: [{ required: true, trigger: 'blur', message: '请填写联系人' }],
    address: [{ required: true, trigger: 'blur', message: '请填写地址' }],
  },
  dialog: {
    isShowDialog: false,
    type: '',
    title: '',
    submitTxt: '',
  }
})

const { loading, ruleForm, rules, dialog } = toRefs(state)

// 打开弹窗
const openDialog = (type: string, row: any) => {
  if (type === 'edit') {
    state.dialog.title = '修改校区'
    state.dialog.submitTxt = '修 改'
    // 从API详情接口获取数据
    getAreaDetail({
      id: row.id,
    }).then((res) => {
      state.ruleForm = {
        id: res.id,
        status: res.status,
        name: res.name,
        digest: res.digest,
        contactNumber: res.contactNumber,
        contactName: res.contactName,
        address: res.address,
        description: res.description,
        lat: res.lat, lon: res.lon,
        avatar: res.avatar,
        rectLogo: res.rectLogo
      }
    })
  } else {
    state.dialog.title = '新增校区'
    state.dialog.submitTxt = '新 增'
    state.ruleForm = {
      status: 1,
      name: '',
      digest: '',
      contactNumber: '',
      contactName: '',
      address: '',
      description: '',
      lat: '',
      lon: '',
      avatar: '',
      rectLogo: ''
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

//打开地图弹窗
const onOpenMap = () => {
  const latitude = state.ruleForm.lat || centerLatLng.lat
  const longitude = state.ruleForm.lon || centerLatLng.lng
  tmapRef.value.openDialog(latitude, longitude, state.ruleForm.address)
}

//更新地址信息
const updateAddress = (val: any) => {
  state.ruleForm.address = val.address
  state.ruleForm.lat = val.latitude
  state.ruleForm.lon = val.lngitude
}


// 提交
const onSubmit = () => {
  const ruleForm = JSON.parse(JSON.stringify(state.ruleForm))
  dialogFormRef.value.validate((valid: boolean) => {
    if (valid) {
      state.loading = true
      if (state.dialog.type === 'add') {
        addArea(ruleForm)
          .then(() => {
            state.loading = false
            closeDialog()
            emit('refresh')
          })
          .catch(() => {
            state.loading = false
          })
      } else {
        updateArea(ruleForm)
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