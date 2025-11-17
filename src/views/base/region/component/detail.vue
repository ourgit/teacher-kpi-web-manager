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
            <el-form-item label="归属区域" prop="district">
              <el-select v-model="ruleForm.districtId" placeholder="选择归属区域" filterable style="width: 100%;">
                <el-option v-for="item in districtList" :key="item.id" :label="item.name" :value="item.id" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
            <el-form-item label="名称" prop="name">
              <el-input v-model="ruleForm.name" placeholder="请输入名称" clearable></el-input>
            </el-form-item>
          </el-col>
          <!-- <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12" class="mb20">
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
          </el-col> -->
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
    <tmap ref="tmapRef" @onChange="updateAddress" />
  </div>
</template>

<script setup lang="ts">
import { reactive, toRefs, ref } from 'vue'
import { ElForm } from 'element-plus'
import { addRegion, updateRegion, getRegionDetail } from '@/api/base/region/index'
import { getAreaList } from '@/api/base/area/index'
import { getDistrictList } from '@/api/base/district/index'
import tmap from '@/components/tmap/index.vue'
import { centerLatLng } from '@/config'

// 定义子组件向父组件传值/事件
const emit = defineEmits(['refresh', 'onAddSuccess'])

// 定义变量内容
const dialogFormRef = ref(ElForm)
const tmapRef = ref()
const state = reactive({
  loading: false,
  ruleForm: {} as any,
  rules: {
    areaId: [{ required: true, trigger: 'change', message: '请选择所属校区' }],
    name: [{ required: true, trigger: 'blur', message: '请填写取餐点名称' }],
    districtId: [{ required: true, trigger: 'change', message: '请选择归属区域' }],
  },
  dialog: {
    isShowDialog: false,
    type: '',
    title: '',
    submitTxt: '',
  },
  areaList: [] as Array<any>,
  districtList: [] as Array<any>,
})

const { loading, ruleForm, rules, dialog, areaList, districtList } = toRefs(state)

// 打开弹窗
const openDialog = (type: string, row: any) => {
  if (type === 'edit') {
    state.dialog.title = '修改取餐点'
    state.dialog.submitTxt = '修 改'
    getRegionDetail({
      id: row.id,
    }).then((res) => {
      state.ruleForm = {
        id: res.id,
        status: res.status,
        name: res.name,
        areaId: res.areaId,
        contactNumber: res.contactNumber,
        contactName: res.contactName,
        address: res.address,
        lat: res.lat, lon: res.lon,
        districtId: res.districtId
      }
      getDistrictListData(res.areaId)
    })
  } else {
    state.dialog.title = '新增取餐点'
    state.dialog.submitTxt = '新 增'
    state.ruleForm = {
      status: 1,
      name: '',
      areaId: '',
      contactNumber: '',
      contactName: '',
      address: '',
      lat: '',
      lon: '',
      districtId: '',
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

// 获取区域列表
const getDistrictListData = (e: any) => {
  getDistrictList({
    page: 0,
    areaId: e
  }).then((data: any) => {
    state.districtList = data.list
  })
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
        addRegion(ruleForm)
          .then((data: any) => {
            state.loading = false
            closeDialog()
            emit('refresh')
            emit('onAddSuccess', data.id)
          })
          .catch(() => {
            state.loading = false
          })
      } else {
        updateRegion(ruleForm)
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