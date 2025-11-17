<template>
  <div class="dialog-container">
    <el-form ref="detailFormRef" :model="ruleForm" :rules="rules" size="default" label-width="120px">
      <el-row :gutter="35" class="row">
        <el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
          <el-form-item label="券标题" prop="couponTitle">
            <el-input v-model="ruleForm.couponTitle" placeholder="请输入券标题" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
          <el-form-item label="图片" prop="imgUrl">
            <upload-img v-model="ruleForm.imgUrl" />
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
          <el-form-item label="领取类型" prop="type">
            <el-select v-model="ruleForm.type" placeholder="请选择领取类型" class="w100">
              <el-option label="默认" :value="0" />
              <el-option label="全场赠券" :value="1" />
              <el-option label="注册赠券" :value="2" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
          <el-form-item label="优惠类型">
            <el-select v-model="typeRules.type" placeholder="请选择优惠类型" class="w100">
              <el-option v-for="(item, index) in typeRulesList" :key="index" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
          <el-form-item label="优惠规则" prop="typeRules">
            <el-space>
              满<el-input v-model="typeRules.upto" class="input100"></el-input>
              <span v-if="typeRules.type === 'amountReduce' || typeRules.type === 'amountDiscount'">件</span>
              <span v-else>元</span>
              <span v-if="typeRules.type === 'amountReduce' || typeRules.type === 'priceReduce'">减</span>
              <span v-else>打</span>
              <el-input v-model="typeRules.discount" class="input100"></el-input>
              <span v-if="typeRules.type === 'amountReduce' || typeRules.type === 'priceReduce'">元</span>
              <span v-else>%折</span>
              限<el-input v-model="typeRules.max" class="input100"></el-input>
              <span v-if="typeRules.type === 'amountReduce' || typeRules.type === 'amountDiscount'">件内</span>
              <span v-else>元内</span>
            </el-space>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
          <el-form-item>
            <el-space>
              规则说明：当满额及限额设置为0时,则不限制使用条件
            </el-space>
          </el-form-item>
        </el-col>
        <el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
          <el-form-item label="优惠券分类" prop="idType">
            <el-select v-model="useRules.type" placeholder="请选择分类" class="w100" @change="empty()">
              <el-option v-for="(item, index) in useRulesList" :key="index" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12" class="mb20" v-if="useRules.type !== 'all'">
          <el-form-item>
            <el-button @click="onOpenBind()" size="small" text type="primary">绑定</el-button>
          </el-form-item>
        </el-col>
        <el-col :xs="12" :sm="12" :md="12" :lg="8" :xl="12" class="mb20" v-if="useRules.list.length !== 0">
          <el-form-item>
            <el-table :data="useRules.list">
              <el-table-column width="55" type="index" label="序号" />
              <el-table-column prop="productId" label="ID" width="120" />
              <el-table-column prop="name" label="名称" width="120" show-overflow-tooltip />
              <el-table-column fixed="right" label="操作" width="80">
                <template #default="{ row }">
                  <el-button size="small" text type="primary" @click="onDel(row)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
          <el-form-item label="券内容" prop="couponContent">
            <el-input v-model="ruleForm.couponContent" placeholder="请输入券内容" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
          <el-form-item label="状态" prop="needShow">
            <el-radio-group v-model="ruleForm.status">
              <el-radio :label="1">上架</el-radio>
              <el-radio :label="2">下架</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :xs="8" :sm="8" :md="8" :lg="8" :xl="8" class="mb20">
          <el-form-item label="总数" prop="totalAmount">
            <el-input v-model="ruleForm.totalAmount" placeholder="请输入总数,默认100" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :xs="8" :sm="8" :md="8" :lg="8" :xl="8" class="mb20">
          <el-form-item label="每人限领数" prop="claimLimitPerMember">
            <el-input v-model="ruleForm.claimLimitPerMember" placeholder="请输入每人限领数，默认1" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
          <el-form-item label="过期类型" prop="expireType">
            <el-radio-group v-model="ruleForm.expireType" @click="changeMode()">
              <el-radio :label="1">有效天数</el-radio>
              <el-radio :label="2">使用时间</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col v-if="ruleForm.expireType === 1" :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
          <el-form-item label="有效天数" prop="expireDays">
            <el-input v-model="ruleForm.expireDays" placeholder="有效天数" clearable class="input100"></el-input>
          </el-form-item>
        </el-col>
        <el-col v-if="ruleForm.expireType === 2" :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
          <el-form-item label="过期时间" style="width: 600px;" prop="expireTime">
            <el-date-picker size="default" v-model="expireTimeRange" type="daterange" range-separator="至" start-placeholder="使用开始时间" end-placeholder="使用截止时间" format="YYYY-MM-DD" value-format="x" />
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
          <el-form-item label="领取时间" style="width: 600px;" prop="beginTime">
            <el-date-picker size="default" v-model="drawTimeRange" type="daterange" range-separator="至" start-placeholder="开始时间" end-placeholder="结束时间" format="YYYY-MM-DD" value-format="x" />
          </el-form-item>
          <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
            <el-form-item>
              <el-button type="primary" @click="onSubmit" :loading="loading">{{ dialog.submitTxt }}</el-button>
            </el-form-item>
          </el-col>
        </el-col>
      </el-row>
    </el-form>
    <selectDialog ref="selectDialogRef" :type="useRules.type" @select="bindProduct" />
  </div>
</template>

<script setup lang="ts">
import { defineAsyncComponent, onMounted, reactive, ref, toRefs, watch } from 'vue'
import { ElForm } from 'element-plus'
import {
  getCouponsDetail, updateCoupons, addCoupons
} from '@/api/coupons/index'
import UploadImg from '@/components/upload/uploadImg.vue'
import { useRouter } from 'vue-router'


const selectDialog = defineAsyncComponent(
  () => import('./select.vue')
)

const props = defineProps({
  isEidt: {
    type: Boolean,
    default: false,
  },
})
// 定义变量内容
const detailFormRef = ref(ElForm)
const selectDialogRef = ref()
const router = useRouter()
const expireTimeRange = ref('') as any
const drawTimeRange = ref('') as any
const state = reactive({
  loading: false,
  linkType: 0,
  tiem: '',
  ruleForm: {} as any,
  rules: {
    couponTitle: [{ required: true, trigger: 'blur', message: '请填写优惠券名称' }],
    amount: [{ required: true, trigger: 'blur', message: '请填写面值' }],
    beginTime: [{ required: true, trigger: 'blur', message: '请填写开始领取时间' }],
    endTimeStr: [{ required: true, trigger: 'blur', message: '请填写开始领取时间' }],
  },
  //商品规则
  useRulesList: [{
    label: '全场',
    value: 'all',
  },
  {
    label: '商品',
    value: 'product',
  },
  {
    label: '分类',
    value: 'category',
  },
  {
    label: '店铺',
    value: 'shop',
  }
  ],
  typeRulesList: [
    {
      label: '满量立减',
      value: 'amountReduce',
    },
    {
      label: '满额立减',
      value: 'priceReduce',
    },
    {
      label: '满量立折',
      value: 'amountDiscount',
    },
    {
      label: '满额立折',
      value: 'priceDiscount',
    },
  ],
  typeRules: {} as any,
  useRules: { type: 'all', list: [] } as any,
  dialog: {
    isShowDialog: false,
    type: '',
    title: '',
    submitTxt: '',
  },
})

const { loading, ruleForm, rules, dialog, useRulesList, typeRulesList, useRules, typeRules } =
  toRefs(state)

watch(drawTimeRange, (newValue: any) => {
  if (newValue && newValue[0] && newValue[1]) {
    state.ruleForm.beginTime = newValue[0] / 1000 || 0
    state.ruleForm.endTime =
      (newValue[1] + 24 * 60 * 60 * 1000 - 1000) / 1000 || 0
  } else {
    state.ruleForm.beginTime = ''
    state.ruleForm.endTime = ''
  }
})

watch(expireTimeRange, (newValue: any) => {
  if (newValue && newValue[0] && newValue[1]) {
    state.ruleForm.beginUseTime = newValue[0] / 1000 || 0
    state.ruleForm.expireTime =
      (newValue[1] + 24 * 60 * 60 * 1000 - 1000) / 1000 || 0
  } else {
    state.ruleForm.beginUseTime = ''
    state.ruleForm.expireTime = ''
  }
})


// 打开弹窗
const openDialog = () => {
  if (props.isEidt) {
    state.dialog.title = '修改优惠券'
    state.dialog.submitTxt = '修 改'
    state.dialog.type = 'edit'
    const couponsId = router.currentRoute.value.query.couponsId
    getCouponsDetail({
      id: couponsId,
    }).then((res: any) => {
      const typeRulesData = JSON.parse(res.typeRules)
      let upto = typeRulesData.upto
      let max = typeRulesData.max || 0
      if (typeRulesData.type === 'priceReduce' || typeRulesData.type === 'priceDiscount') {
        upto = Math.round(upto / 100)
        max = Math.round(max / 100)
      }
      let discount = typeRulesData.discount
      if (typeRulesData.type === 'amountReduce' || typeRulesData.type === 'priceReduce') {
        discount = Math.round(discount / 100)
      }
      state.typeRules = {
        type: typeRulesData.type,
        upto: upto,
        discount: discount,
        max: max
      }
      state.useRules = JSON.parse(res.useRules)
      state.tiem = res.beginTime
      state.ruleForm = {
        id: res.id,
        couponTitle: res.couponTitle,
        couponContent: res.couponContent,
        status: res.status,
        amount: res.amount,
        beginTime: res.beginTime,
        endTime: res.endTime,
        expireDays: res.expireDays,
        claimLimitPerMember: res.claimLimitPerMember,
        expireType: res.expireDays ? 1 : 2,
        beginUseTime: res.beginUseTime,
        expireTime: res.expireTime,
        totalAmount: res.totalAmount,
        idType: res.idType,
        merchantIds: res.merchantIds,
        brandIds: res.brandIds,
        ruleContent: res.ruleContent,
        imgUrl: res.imgUrl,
        needShow: res.needShow,
        type: res.type
      }
      drawTimeRange.value = [res.beginTime * 1000, res.endTime * 1000]
      if (res.beginUseTime) {
        expireTimeRange.value = [res.beginUseTime * 1000, res.expireTime * 1000]
      }
    })
  } else {
    state.dialog.type = 'add'
    state.dialog.title = '新增优惠券'
    state.dialog.submitTxt = '新 增'
    state.ruleForm = {
      couponTitle: '',
      couponContent: '',
      amount: '',
      beginTime: '',
      endTime: '',
      expireDays: '',
      beginUseTime: '',
      expireTime: '',
      claimLimitPerMember: '',
      totalAmount: '',
      idType: '',
      merchantIds: '',
      brandIds: '',
      ruleContent: '',
      imgUrl: '',
      type: 0,
      needShow: true,
      status: 1,
      expireType: 1
    }
    state.typeRules = {
      type: 'priceReduce',
      upto: '',
      discount: '',
      max: ''
    }
    state.useRules = {
      type: 'all',
      list: []
    }
  }
}

//删除 
const onDel = (row: any) => {
  state.useRules.list = state.useRules.list.filter((item: any) => {
    if (item.productId !== row.productId) {
      return item
    }
  })
}
//状态改变清空useRles.list
const empty = () => {
  state.useRules.list = []
}
//状态改变清空过期类型数据
const changeMode = () => {
  state.ruleForm.expireDays = []
  expireTimeRange.value = []
}
//绑定弹出框
const onOpenBind = () => {
  selectDialogRef.value.openDialog('checkbox', state.useRules.list)
}
const bindProduct = (val: any) => {
  val.forEach((item: any) => {
    state.useRules.list.push({
      id: item.id,
      name: item.name,
    })
  })
}

// 提交
const onSubmit = () => {
  let upto = state.typeRules.upto
  let max = state.typeRules.max
  if (state.typeRules.type === 'priceReduce' || state.typeRules.type === 'priceDiscount') {
    upto = Math.round(upto * 100)
    max = Math.round(max * 100)
  }
  let discount = state.typeRules.discount
  if (state.typeRules.type === 'amountReduce' || state.typeRules.type === 'priceReduce') {
    discount = Math.round(discount * 100)
  }
  const typeRules = {
    type: state.typeRules.type,
    upto: upto,
    discount: discount,
    max: max
  }
  const ruleForm = JSON.parse(JSON.stringify(state.ruleForm))
  ruleForm.typeRules = JSON.stringify(typeRules)
  ruleForm.useRules = JSON.stringify(state.useRules)
  detailFormRef.value.validate((valid: boolean) => {
    if (valid) {
      state.loading = true
      ruleForm.amount = parseInt(ruleForm.amount)
      ruleForm.oldPrice = parseInt(ruleForm.oldPrice)
      ruleForm.currentPrice = parseInt(ruleForm.currentPrice)
      ruleForm.expireDays = parseInt(ruleForm.expireDays)
      ruleForm.claimLimitPerMember = parseInt(ruleForm.claimLimitPerMember)
      ruleForm.totalAmount = parseInt(ruleForm.totalAmount)
      ruleForm.idType = parseInt(ruleForm.idType)
      ruleForm.beginTime = ruleForm.beginTime
      ruleForm.endTime = ruleForm.endTime
      if (state.dialog.type === 'add') {
        addCoupons(ruleForm)
          .then(() => {
            state.loading = false
            router.push('/market/coupons/list')
          })
          .catch(() => {
            state.loading = false
          })
      } else {
        updateCoupons(ruleForm)
          .then(() => {
            state.loading = false
            router.push('/market/coupons/list')
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