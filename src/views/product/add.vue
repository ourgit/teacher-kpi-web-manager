<template>
  <div class="page-container layout-padding">
    <el-card shadow="hover" class="layout-padding-auto">
      <el-tabs v-model="activeName">
        <el-tab-pane label="商品信息" name="info">
          <product-info ref="infoRef" @onChangeImg="onChangeImg" @onChangeOrg="getAttrTemplateData" />
        </el-tab-pane>
        <el-tab-pane label="商品规格" name="attr">
          <product-attr ref="attrRef" :attrTemplateList="attrTemplateList" :defaultImg="defaultImg" />
        </el-tab-pane>
        <el-tab-pane label="商品参数" name="parame">
          <product-parame ref="parameRef" :attrTemplateList="attrTemplateList" />
        </el-tab-pane>
      </el-tabs>
      <div class="bottom">
        <el-button type="primary" @click="onSubmit" :loading="loading">保存</el-button>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts" name="productAdd">
import { reactive, toRefs, ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { useRoute, useRouter } from 'vue-router'
import mittBus from '@/utils/mitt'
import productInfo from './component/productInfo.vue'
import productAttr from './component/productAttr.vue'
import productParame from './component/productParame.vue'
import { getTemplateList } from '@/api/product/attr/index'
import { addProduct } from '@/api/product/index'

// 定义变量内容
const route = useRoute()
const router = useRouter()
const activeName = ref('info')
const infoRef = ref()
const attrRef = ref()
const parameRef = ref()
// 定义变量内容
const state = reactive({
  attrTemplateList: [],
  loading: false,
  defaultImg: ''
})

const { attrTemplateList, loading, defaultImg } = toRefs(state)

// 获取列表
const getAttrTemplateData = (e: any) => {
  getTemplateList({
    orgId: e
  }).then((data: any) => {
    state.attrTemplateList = data.list
  })
}

//更新默认图片
const onChangeImg = (val: string) => {
  state.defaultImg = val
}

//增加商品
const onSubmit = () => {
  const infoData = infoRef.value.transmit()
  const attrData = attrRef.value.transmit()
  const parameData = parameRef.value.transmit()
  const groupData = Object.assign(infoData, attrData, parameData)
  const formData = JSON.parse(JSON.stringify(groupData))
  let sku = {
    ver: 1,
    attrType: formData.attrType,
    priceModel: formData.priceModel,
    skuList: [],
  } as any
  //根据规格类型生成SKULIST
  if (formData.attrType === 1) {
    let simpleProudct = formData.simpleProudct
    simpleProudct.price = Math.round(simpleProudct.price * 100)
    simpleProudct.oldPrice = Math.round(simpleProudct.oldPrice * 100)
    simpleProudct.bidPrice = Math.round(simpleProudct.bidPrice * 100)
    simpleProudct.purchasingPrice = Math.round(
      simpleProudct.purchasingPrice * 100
    )
    if (formData.priceModel === 3) {
      if (!formData.stepPrice.length) {
        return ElMessage({
          message: '请最少填写一条阶梯价',
          type: 'error',
        })
      }
      const stepPrice = formData.stepPrice.sort(
        (a: any, b: any) => a.price - b.price
      )
      sku.stepPrice = stepPrice.map((item: any) => {
        item.price = Math.round(item.price * 100)
        return item
      })
      simpleProudct.price = stepPrice[0].price
      formData.minPrice = Math.round(stepPrice[stepPrice.length - 1].price * 1)
      formData.maxPrice = Math.round(
        stepPrice[0].price * 1
      )
    } else {
      const price = simpleProudct.price
      formData.minPrice = price
      formData.maxPrice = price
      formData.stepPrice = []
    }
    sku.skuList = [formData.simpleProudct]
    formData.oldPrice = simpleProudct.oldPrice
    formData.purchasingPrice = simpleProudct.purchasingPrice
    formData.attr = []
  } else {
    if (formData.skuList.length) {
      if (formData.priceModel === 1) {
        const skuList = JSON.parse(JSON.stringify(formData.skuList))
        const skuPriceList = skuList.sort((a: any, b: any) => a.price - b.price)
        formData.minPrice = Math.round(skuPriceList[0].price * 100)
        formData.maxPrice = Math.round(
          skuPriceList[skuPriceList.length - 1].price * 100
        )
        formData.oldPrice = Math.round(skuPriceList[0].oldPrice * 100)
        sku.skuList = formData.skuList.map((item: any) => {
          item.price = Math.round(item.price * 100)
          item.oldPrice = Math.round(item.oldPrice * 100)
          item.purchasingPrice = Math.round(item.purchasingPrice * 100)
          item.bidPrice = Math.round(item.bidPrice * 100)
          return item
        })
      } else if (formData.priceModel === 2) {
        if (!formData.uniPrice) {
          return ElMessage({
            message: '请填写统一商品价格',
            type: 'error',
          })
        }
        const uinPrice = Math.round(formData.uniPrice * 100)
        const uniOldPrice = Math.round(formData.uniOldPrice * 100)
        const uniPurchasingPrice = Math.round(formData.uniPurchasingPrice * 100)
        const uniBidPrice = Math.round(formData.uniBidPrice * 100)
        sku.skuList = formData.skuList.map((item: any) => {
          item.price = uinPrice
          item.oldPrice = uniOldPrice
          item.purchasingPrice = uniPurchasingPrice
          item.bidPrice = uniBidPrice
          return item
        })
        formData.minPrice = uinPrice
        formData.maxPrice = uinPrice
        formData.oldPrice = uniOldPrice
      } else if (formData.priceModel === 3) {
        if (!formData.stepPrice.length) {
          return ElMessage({
            message: '请最少填写一条阶梯价',
            type: 'error',
          })
        }
        const stepPrice = formData.stepPrice.sort(
          (a: any, b: any) => a.price - b.price
        )
        sku.stepPrice = stepPrice.map((item: any) => {
          item.price = Math.round(item.price * 100)
          return item
        })
        sku.skuList = formData.skuList.map((item: any) => {
          item.price = stepPrice[0].price
          item.oldPrice = Math.round(item.oldPrice * 100)
          item.purchasingPrice = Math.round(item.purchasingPrice * 100)
          item.bidPrice = Math.round(item.bidPrice * 100)
          return item
        })
        formData.minPrice = Math.round(stepPrice[stepPrice.length - 1].price * 1)
        formData.maxPrice = Math.round(
          stepPrice[0].price * 1
        )
        formData.oldPrice = sku.skuList[0].oldPrice
      }
    }
  }
  formData.sort = formData.sort || 1
  formData.packingFee = Math.round(formData.packingFee * 100)
  if (!formData.name) {
    return ElMessage({
      message: '请填写商品名称',
      type: 'error',
    })
  }
  if (formData.status === 1) {
    if (!formData.unit) {
      return ElMessage({
        message: '请填写商品单位',
        type: 'error',
      })
    }
    if (!formData.coverImgUrl) {
      return ElMessage({
        message: '请上传商品主图',
        type: 'error',
      })
    }
    if (!formData.album.length) {
      return ElMessage({
        message: '请上传商品相册',
        type: 'error',
      })
    }
    if (!formData.details.length) {
      return ElMessage({
        message: '请上传商品详情',
        type: 'error',
      })
    }
    if (!sku.skuList.length) {
      return ElMessage({
        message: '请至少生成一条商品规格',
        type: 'error',
      })
    }
  }
  formData.sku = JSON.stringify(sku)
  const attr = formData.attr.map((item: any) => {
    return {
      name: item.name,
      list: item.list,
    }
  })
  const param = formData.param.map((item: any) => {
    return {
      name: item.name,
      value: item.value,
    }
  })
  formData.attr = JSON.stringify(attr)
  formData.param = JSON.stringify(param)
  formData.album = JSON.stringify(formData.album)
  formData.details = JSON.stringify(formData.details)
  delete formData.attrType
  delete formData.skuList
  delete formData.stepPrice
  delete formData.priceModel
  delete formData.uniPrice
  delete formData.uniOldPrice
  delete formData.uniBidPrice
  delete formData.uniPurchasingPrice
  delete formData.simpleProudct
  addProduct(formData)
    .then(() => {
      state.loading = false
      router.push('/product/index')
      closeCurrentTagsView()
    })
    .catch(() => {
      state.loading = false
    })
}

// 关闭当前 tagsView
const closeCurrentTagsView = () => {
  mittBus.emit(
    'onCurrentContextmenuClick',
    Object.assign({}, { contextMenuClickId: 1, ...route })
  )
}

// 页面加载时
onMounted(() => {
})
</script>
