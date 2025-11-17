<template>
  <div class="dialog-container">
    <el-dialog :title="dialog.title" v-model="dialog.isShowDialog" width="800px" :close-on-click-modal="false" :destroy-on-close="true">
      <el-form ref="detailFormRef" :model="ruleForm" :rules="rules" size="default" label-width="120px">
        <el-row :gutter="35">
          <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
            <el-form-item label="机构ID" prop="orgId">
              <el-input v-model="ruleForm.orgId" placeholder="请输入机构ID" clearable style="width:120px"></el-input>
              <el-button size="default" type="success" class="ml10" @click="onOpenAdd()">
                <el-icon>
                  <ele-Search />
                </el-icon>
                选择机构
              </el-button>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
            <el-form-item label="店铺名称" prop="name">
              <el-input v-model="ruleForm.name" placeholder="请输入店铺名称" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
            <el-form-item label="备注">
              <el-input v-model="ruleForm.description" type="textarea" placeholder="请输入备注"></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
            <el-form-item label="联系人" prop="contactName">
              <el-input v-model="ruleForm.contactName" placeholder="请输入联系人" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
            <el-form-item label="联系电话" prop="contactNumber">
              <el-input v-model="ruleForm.contactNumber" placeholder="请输入联系电话" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
            <el-form-item label="联系地址" prop="contactAddress">
              <el-input v-model="ruleForm.contactAddress" placeholder="请输入联系地址" clearable></el-input>
            </el-form-item>
          </el-col>
          <!-- <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
            <el-form-item label="营业执照" prop="licenseImg">
              <upload-img v-model="ruleForm.licenseImg" />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
            <el-form-item label="营业执照号码" prop="licenseNumber">
              <el-input v-model="ruleForm.licenseNumber" placeholder="请输入营业执照号码" clearable></el-input>
            </el-form-item>
          </el-col> -->
          <el-col :xs="24" :sm="8" :md="8" :lg="8" :xl="8" class="mb20">
            <el-form-item label="评分" prop="score">
              <el-input v-model="ruleForm.score" placeholder="请输入评分" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="8" :md="8" :lg="8" :xl="8" class="mb20">
            <el-form-item label="已售数量" prop="soldAmount">
              <el-input v-model="ruleForm.soldAmount" placeholder="请输入已售数量" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="8" :md="8" :lg="8" :xl="8" class="mb20">
            <el-form-item label="起送金额" prop="minToSend">
              <el-input v-model="ruleForm.minToSend" placeholder="请输入起送金额" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="8" :md="8" :lg="8" :xl="8" class="mb20">
            <el-form-item label="配送费" prop="deliveryFee">
              <el-input v-model="ruleForm.minToSend" placeholder="请输入配送费" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="8" :md="8" :lg="8" :xl="8" class="mb20">
            <el-form-item label="配送时间" prop="timeToDeliver">
              <el-input v-model="ruleForm.timeToDeliver" placeholder="请输入配送时间" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="8" :md="8" :lg="8" :xl="8" class="mb20">
            <el-form-item label="经度" prop="lon">
              <el-input v-model="ruleForm.lon" placeholder="请输入经度" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="8" :md="8" :lg="8" :xl="8" class="mb20">
            <el-form-item label="经度" prop="lon">
              <el-input v-model="ruleForm.lon" placeholder="请输入经度" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="8" :md="8" :lg="8" :xl="8" class="mb20">
            <el-form-item label="纬度" prop="lat">
              <el-input v-model="ruleForm.lat" placeholder="请输入纬度" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="8" :md="8" :lg="8" :xl="8" class="mb20">
            <el-form-item label-width="0">
              <el-button type="primary" @click="onOpenMap">
                地图定位
              </el-button>
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
    <selectOrgDialog @select="selectOrigin" ref="selectOrgDialogRef" />
    <tmap ref="tmapRef" @onChange="updateAddress" />
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, defineAsyncComponent, toRefs } from 'vue';
import UploadImg from '@/components/upload/uploadImg.vue'
import { ElForm } from 'element-plus'
import { getShopDetail, addShop, updateShop } from '@/api/shop/index'
import tmap from '@/components/tmap/index.vue'
import { centerLatLng } from '@/config'


// 定义子组件向父组件传值/事件
const emit = defineEmits(['refresh']);

// 机构列表弹出框
const selectOrgDialog = defineAsyncComponent(() => import('@/views/organ/component/select.vue'))

// 定义变量内容
function validatePhone(rule: any, value: any, callback: any) {
  if (!value) {
    callback(new Error('联系手机号码不能为空'))
  } else {
    const reg = /^1[3|4|5|7|8][0-9]\d{8}$/
    if (reg.test(value)) {
      callback()
    } else {
      callback(new Error('请填写正确的手机号码'))
    }
  }
}
const selectOrgDialogRef = ref();
const detailFormRef = ref(ElForm)
const tmapRef = ref()
const state = reactive({
  loading: false,
  ruleForm: {} as any,
  rules: {
    orgId: [{ required: true, trigger: 'blur', message: '请填写机构ID' }],
    name: [{ required: true, trigger: 'blur', message: '请填写店铺名称' }],
    contactName: [{ required: true, trigger: 'blur', message: '请填写联系人' }],
    contactNumber: [
      { required: true, trigger: 'blur', validator: validatePhone },
    ],
    contactAddress: [
      { required: true, trigger: 'blur', message: '请填写联系地址' },
    ]
  },
  dialog: {
    isShowDialog: false,
    type: '',
    title: '',
    submitTxt: '',
  },
})


const { loading, ruleForm, rules, dialog } = toRefs(state)

// 打开弹窗
const openDialog = (type: string, row: any) => {
  if (type === 'edit') {
    state.dialog.title = '修改店铺'
    state.dialog.submitTxt = '修 改'
    getShopDetail({
      id: row.id,
    }).then((res: any) => {
      state.ruleForm = {
        id: row.id,
        orgId: res.orgId,
        name: res.name, // 名称
        contactNumber: res.contactNumber, // 联系电话
        contactName: res.contactName, // 联系人
        contactAddress: res.contactAddress, // 联系地址
        licenseNumber: res.licenseNumber, // 营业执照号
        licenseImg: res.licenseImg, // 营业执照图片
        description: res.description, // 备注
        lat: res.lat, // 纬度
        lon: res.lon,// 经度
      }
    })
  } else {
    state.dialog.title = '新增店铺'
    state.dialog.submitTxt = '新 增'
    state.ruleForm = {
      orgId: '',
      name: '', // 名称
      contactNumber: '', // 联系电话
      contactName: '', // 联系人
      contactAddress: '', // 联系地址
      licenseNumber: '', // 营业执照号
      licenseImg: '', // 营业执照图片
      description: '', // 备注
      lat: '', // 纬度
      lon: '',// 经度
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


// 打开选择机构弹窗
const onOpenAdd = () => {
  selectOrgDialogRef.value.openDialog('radio', [])
}

const selectOrigin = (val: any) => {
  state.ruleForm.orgId = val[0].id
}

//打开地图弹窗
const onOpenMap = () => {
  const latitude = state.ruleForm.lat || centerLatLng.lat
  const longitude = state.ruleForm.lon || centerLatLng.lng
  tmapRef.value.openDialog(latitude, longitude, state.ruleForm.contactAddress)
}

//更新地址信息
const updateAddress = (val: any) => {
  state.ruleForm.contactAddress = val.address
  state.ruleForm.lat = val.latitude
  state.ruleForm.lon = val.lngitude
}



// 提交
const onSubmit = () => {
  const ruleForm = JSON.parse(JSON.stringify(state.ruleForm))
  detailFormRef.value.validate((valid: boolean) => {
    if (valid) {
      state.loading = true
      if (state.dialog.type === 'add') {
        addShop(ruleForm)
          .then(() => {
            state.loading = false
            closeDialog()
            emit('refresh')
          })
          .catch(() => {
            state.loading = false
          })
      } else {
        updateShop(ruleForm)
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
});
</script>
