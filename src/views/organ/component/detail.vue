<template>
  <div class="dialog-container">
    <el-dialog :title="dialog.title" v-model="dialog.isShowDialog" width="1000px" :close-on-click-modal="false" :destroy-on-close="true">
      <el-form ref="detailFormRef" :model="ruleForm" :rules="rules" size="default" label-width="130px">
        <el-row :gutter="35">
          <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
            <el-form-item label="商家头像" prop="avatar">
              <upload-img v-model="ruleForm.avatar" :width="80" :height="80" />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
            <el-form-item label="商家LOGO" prop="rectLogo">
              <upload-img v-model="ruleForm.rectLogo" :width="80" :height="80" />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
            <el-form-item label="所属校区" prop="areaId">
              <el-select v-model="ruleForm.areaId" placeholder="选择所属校区" @change="getRegionListData" filterable style="width: 100%;">
                <el-option v-for="item in areaList" :key="item.id" :label="item.name" :value="item.id" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
            <el-form-item label="入驻类目" prop="businessItems">
              <el-select v-model="ruleForm.businessItems" multiple placeholder="选择入驻类目" filterable style="width: 100%;">
                <el-option v-for="item in itemList" :key="item.id" :label="item.name" :value="item.id" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
            <el-form-item label="商家名称" prop="name">
              <el-input v-model="ruleForm.name" placeholder="请输入商家名称" clearable></el-input>
            </el-form-item>
          </el-col>
          <!-- <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
            <el-form-item label="授权店铺数" prop="shopMaxAmount">
              <el-input v-model="ruleForm.shopMaxAmount" placeholder="请输入授权店铺数" clearable></el-input>
            </el-form-item>
          </el-col> -->
          <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
            <el-form-item label="标签" prop="tag">
              <el-space wrap>
                <el-tag size="large" v-for="(tag, index) in ruleForm.tag" :key="index" closable @close="delTag(index)">{{ tag }}</el-tag>
                <el-input v-model="newTag" placeholder="标签名" style="margin-right: 5px;width: 80px;" />
                <el-button size="default" type="primary" @click="onAddTag">
                  确认
                </el-button>
              </el-space>
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
              <el-space wrap>
                <el-select v-model="ruleForm.shopPlaceId" placeholder="选择位置" filterable style="width: 100%;">
                  <el-option v-for="item in regionList" :key="item.id" :label="item.name" :value="item.id" />
                </el-select>
                <el-select v-model="ruleForm.floor" placeholder="选择楼层" filterable clearable style="width: 100%;">
                  <el-option :key="0" label="无" value="" />
                  <el-option :key="1" label="一楼" value="一楼" />
                  <el-option :key="2" label="二楼" value="二楼" />
                  <el-option :key="3" label="三楼" value="三楼" />
                  <el-option :key="4" label="四楼" value="四楼" />
                  <el-option :key="5" label="五楼" value="五楼" />
                </el-select>
                <el-input v-model="ruleForm.contactAddress" placeholder="详细地址" clearable></el-input>
              </el-space>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
            <el-form-item label="商家公告" prop="announcement">
              <el-input v-model="ruleForm.announcement" type="textarea" placeholder="请输入商家公告"></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
            <el-form-item label="营业时间">
              <el-space>
                <el-time-select v-model="openTime" start="00:00" step="00:15" end="24:00" placeholder="营业开始时间" />
                <el-time-select v-model="closeTime" start="00:00" step="00:15" end="24:00" placeholder="营业结束时间" />
              </el-space>
            </el-form-item>
          </el-col>
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
            <el-form-item label="打包费" prop="packingFee">
              <el-input v-model="ruleForm.packingFee" placeholder="请输入打包费" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="8" :md="8" :lg="8" :xl="8" class="mb20">
            <el-form-item label="打包盒单价" prop="packingBoxPrice">
              <el-input v-model="ruleForm.packingBoxPrice" placeholder="请输入打包盒单价" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="8" :md="8" :lg="8" :xl="8" class="mb20">
            <el-form-item label="起送金额" prop="minToSend">
              <el-input v-model="ruleForm.minToSend" placeholder="请输入起送金额" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="8" :md="8" :lg="8" :xl="8" class="mb20">
            <el-form-item label="配送费" prop="deliveryFee">
              <el-input v-model="ruleForm.deliveryFee" placeholder="请输入配送费" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="8" :md="8" :lg="8" :xl="8" class="mb20">
            <el-form-item label="配送时间" prop="timeToDeliver">
              <el-space wrap>
                <el-input v-model="ruleForm.timeToDeliver" placeholder="配送时间" clearable style="width: 80px;"></el-input>
                分钟
              </el-space>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="8" :md="8" :lg="8" :xl="8" class="mb20">
            <el-form-item label="佣金费率" prop="commissionPercent">
              <el-input v-model="ruleForm.commissionPercent" placeholder="佣金费率,0.1=10%" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="8" :md="8" :lg="8" :xl="8" class="mb20">
            <el-form-item label="月服务费" prop="serviceFee">
              <el-input v-model="ruleForm.serviceFee" placeholder="请输入月服务费" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="8" :md="8" :lg="8" :xl="8" class="mb20">
            <el-form-item label="同区配送费" prop="sameDistrictDeliverFee">
              <el-input v-model="ruleForm.sameDistrictDeliverFee" placeholder="请输入同区配送费" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="8" :md="8" :lg="8" :xl="8" class="mb20">
            <el-form-item label="跨区配送费" prop="diffDistrictDeliverFee">
              <el-input v-model="ruleForm.diffDistrictDeliverFee" placeholder="请输入跨区配送费" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
            <el-form-item label="营业状态">
              <el-switch v-model="ruleForm.enable" inline-prompt :active-value="1" :inactive-value="0" active-text="营业中" inactive-text="休息中"></el-switch>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
            <el-form-item label="商家状态">
              <el-switch v-model="ruleForm.status" inline-prompt :active-value="1" :inactive-value="2" active-text="上架" inactive-text="下架"></el-switch>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
            <el-form-item label="企业类型" prop="companyType">
              <el-radio-group v-model="ruleForm.companyType">
                <el-radio :label="1">企业</el-radio>
                <el-radio :label="2">个体工商户</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
            <el-form-item label="企业名称" prop="companyName">
              <el-input v-model="ruleForm.companyName" placeholder="请输入企业名称，需与工商部门登记信息一致" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
            <el-form-item label="营业执照" prop="licenseImg">
              <upload-img v-model="ruleForm.licenseImg" />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
            <el-form-item label="营业执照代码类型" prop="licenseType">
              <el-radio-group v-model="ruleForm.licenseType">
                <el-radio :label="1">统一社会信用代码</el-radio>
                <el-radio :label="2">组织商家代码</el-radio>
                <el-radio :label="3">营业执照注册号</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
            <el-form-item label="营业执照号码" prop="licenseNumber">
              <el-input v-model="ruleForm.licenseNumber" placeholder="请输入营业执照号码" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
            <el-form-item label="备注">
              <el-input v-model="ruleForm.description" type="textarea" placeholder="请输入备注"></el-input>
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
import { getOrganDetail, addOrgan, updateOrgan } from '@/api/organ/index'
import UploadImg from '@/components/upload/uploadImg.vue'
import { getAreaList } from '@/api/base/area/index'
import { getItemList } from '@/api/base/item/index'
import { getRegionList } from '@/api/base/region/index'
// 定义子组件向父组件传值/事件
const emit = defineEmits(['refresh'])

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
const detailFormRef = ref(ElForm)
const state = reactive({
  loading: false,
  ruleForm: {} as any,
  rules: {
    areaId: [{ required: true, trigger: 'change', message: '请选择所属校区' }],
    businessItems: [{ required: true, trigger: 'change', message: '请选择入驻类目' }],
    name: [{ required: true, trigger: 'blur', message: '请填写商家名称' }],
    contactName: [{ required: true, trigger: 'blur', message: '请填写联系人' }],
    contactNumber: [
      { required: true, trigger: 'blur', validator: validatePhone },
    ],
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
    getOrganDetail({
      id: row.id,
    }).then((res: any) => {
      state.ruleForm = {
        id: row.id,
        name: res.name, // 名称
        contactNumber: res.contactNumber, // 联系电话
        contactName: res.contactName, // 联系人
        contactAddress: res.contactAddress, // 联系地址
        licenseNumber: res.licenseNumber, // 营业执照号
        licenseImg: res.licenseImg, // 营业执照图片
        avatar: res.avatar, // 商家头像
        rectLogo: res.rectLogo, // 方形头像
        description: res.description, // 备注
        allowPos: res.allowPos, // 是否允许使用收银系统
        allowMiniApp: res.allowMiniApp, // 是否允许使用小程序
        allowWebManager: res.allowWebManager, // 是否允许使用管理台
        shopMaxAmount: res.shopMaxAmount,
        lawyerName: res.lawyerName,
        lawyerWechatId: res.lawyerWechatId,
        miniAppId: res.miniAppId,
        companyName: res.companyName,
        companyType: res.companyType,
        licenseType: res.licenseType,
        allowDealer: res.allowDealer,
        orderPath: res.orderPath,
        needSms: res.needSms,
        areaId: res.areaId,
        businessItems: res.businessItems ? JSON.parse(res.businessItems) : [],
        score: res.score,
        soldAmount: res.soldAmount,
        minToSend: res.minToSend / 100,
        deliveryFee: res.deliveryFee / 100,
        timeToDeliver: res.timeToDeliver,
        tag: res.tag ? JSON.parse(res.tag) : [],
        shopPlaceId: res.shopPlaceId,
        floor: res.floor,
        packingFee: res.packingFee / 100,
        announcement: res.announcement,
        enable: res.enable,
        status: res.status,
        packingBoxPrice: res.packingBoxPrice / 100,
        serviceFee: res.serviceFee / 100,
        commissionPercent: res.commissionPercent,
        sameDistrictDeliverFee: res.sameDistrictDeliverFee / 100,
        diffDistrictDeliverFee: res.diffDistrictDeliverFee / 100,
      }
      //判断返回分钟
      if (res.openTimeMinute < 10) {
        if (res.openTime < 10) {
          state.openTime = `0${res.openTime}:0${res.openTimeMinute}`
        } else {
          state.openTime = `${res.openTime}:0${res.openTimeMinute}`
        }
      } else {
        if (res.openTime < 10) {
          state.openTime = `0${res.openTime}:${res.openTimeMinute}`
        } else {
          state.openTime = `${res.openTime}:${res.openTimeMinute}`
        }
      }

      if (res.closeTimeMinute < 10) {
        if (res.closeTime < 10) {
          state.closeTime = `0${res.closeTime}:0${res.closeTimeMinute}`
        } else {
          state.closeTime = `${res.closeTime}:0${res.closeTimeMinute}`
        }
      } else {
        if (res.closeTime < 10) {
          state.closeTime = `0${res.closeTime}:${res.closeTimeMinute}`
        } else {
          state.closeTime = `${res.closeTime}:${res.closeTimeMinute}`
        }
      }
      getRegionListData(res.areaId)
    })
  } else {
    state.dialog.title = '新增商家'
    state.dialog.submitTxt = '新 增'
    state.ruleForm = {
      areaId: '',
      name: '', // 名称
      contactNumber: '', // 联系电话
      contactName: '', // 联系人
      contactAddress: '', // 联系地址
      licenseNumber: '', // 营业执照号
      licenseImg: '', // 营业执照图片
      avatar: '', // 商家头像
      rectLogo: '', // 方形头像
      description: '', // 备注
      allowPos: true, // 是否允许使用收银系统
      allowMiniApp: true, // 是否允许使用小程序
      allowWebManager: true, // 是否允许使用管理台
      shopMaxAmount: 1,
      lawyerName: '',
      lawyerWechatId: '',
      miniAppId: '',
      companyName: '',
      companyType: 1,
      licenseType: 1,
      allowDealer: false,
      orderPath: '',
      needSms: false,
      businessItems: [],
      score: 50,
      soldAmount: 0,
      minToSend: '',
      deliveryFee: '',
      timeToDeliver: '',
      tag: [],
      shopPlaceId: '',
      floor: '',
      packingFee: '',
      announcement: '',
      enable: 1,
      status: 1,
      packingBoxPrice: '',
      commissionPercent: '',
      serviceFee: '',
      sameDistrictDeliverFee: '',
      diffDistrictDeliverFee: ''
    }
  }
  getAreaListData()
  getItemListData()
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


// 获取类目列表
const getItemListData = () => {
  getItemList({
    page: 0
  }).then((data: any) => {
    state.itemList = data.list
  })
}

// 获取区域列表数据
const getRegionListData = (e: any) => {
  getRegionList({
    areaId: e,
  }).then((data: any) => {
    state.regionList = data.list
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

// 删除标签
const delTag = (index: number) => {
  state.ruleForm.tag.splice(index, 1)
}


// 新增标签
const onAddTag = () => {
  if (!state.newTag) {
    return ElMessage({
      message: '请输入标签值',
      type: 'error',
    })
  }
  state.ruleForm.tag.push(state.newTag)
  state.newTag = ''
}

// 提交
const onSubmit = () => {
  const ruleForm = JSON.parse(JSON.stringify(state.ruleForm))
  let open = state.openTime.toString()
  ruleForm.openTimeMinute = open.slice(3)
  ruleForm.openTime = open.slice(0, 2)
  let close = state.closeTime.toString()
  ruleForm.closeTimeMinute = close.slice(3)
  ruleForm.closeTime = close.slice(0, 2)
  ruleForm.businessItems = JSON.stringify(ruleForm.businessItems)
  ruleForm.tag = JSON.stringify(ruleForm.tag)
  ruleForm.minToSend = Math.round(ruleForm.minToSend * 100)
  ruleForm.deliveryFee = Math.round(ruleForm.deliveryFee * 100)
  ruleForm.packingFee = Math.round(ruleForm.packingFee * 100)
  ruleForm.packingBoxPrice = Math.round(ruleForm.packingBoxPrice * 100)
  ruleForm.serviceFee = Math.round(ruleForm.serviceFee * 100)
  ruleForm.sameDistrictDeliverFee = Math.round(ruleForm.sameDistrictDeliverFee * 100)
  ruleForm.diffDistrictDeliverFee = Math.round(ruleForm.diffDistrictDeliverFee * 100)
  detailFormRef.value.validate((valid: boolean) => {
    if (valid) {
      state.loading = true
      if (state.dialog.type === 'add') {
        addOrgan(ruleForm)
          .then(() => {
            state.loading = false
            closeDialog()
            emit('refresh')
          })
          .catch(() => {
            state.loading = false
          })
      } else {
        updateOrgan(ruleForm)
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