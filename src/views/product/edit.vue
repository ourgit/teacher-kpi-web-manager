<template>
  <div class="page-container layout-padding">
    <el-card shadow="hover" class="layout-padding-auto">
      <el-tabs v-model="activeName">
        <el-tab-pane label="商品信息" name="info">
          <product-info ref="infoRef" :detailData="detailData" @onChangeOrg="getAttrTemplateData" />
        </el-tab-pane>
        <el-tab-pane label="商品规格" name="attr">
          <product-attr ref="attrRef" :detailData="detailData" isEidt :attrTemplateList="attrTemplateList" />
        </el-tab-pane>
        <el-tab-pane label="商品参数" name="parame">
          <product-parame ref="parameRef" :detailData="detailData" :attrTemplateList="attrTemplateList" />
        </el-tab-pane>
      </el-tabs>
      <div class="bottom">
        <el-button type="primary" @click="onSubmit" :loading="loading">保存</el-button>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts" name="productEdit">
import { reactive, toRefs, ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { useRoute, useRouter } from 'vue-router'
import mittBus from '@/utils/mitt'
import productInfo from './component/productInfo.vue'
import productAttr from './component/productAttr.vue'
import productParame from './component/productParame.vue'
import { getTemplateList } from '@/api/product/attr/index'
import { getProductDetail, updateProduct } from '@/api/product/index'

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
  detailData: {} as any,
})

const { attrTemplateList, loading, detailData } = toRefs(state)

// 获取列表
const getAttrTemplateData = (e: any) => {
  getTemplateList({
    orgId: e
  }).then((data: any) => {
    state.attrTemplateList = data.list
  })
}

// 获取详情
const getDetailData = () => {
  const productId = router.currentRoute.value.query.productId
  getProductDetail({
    id: productId,
  }).then((res) => {
    state.detailData = {
      id: res.id,
      orgId: res.orgId,
      categoryId: res.categoryId,
      activityCategoryId: res.activityCategoryId,
      barcode: res.barcode,
      name: res.name,
      unit: res.unit,
      oldPrice: res.oldPrice / 100,
      stock: res.stock,
      sketch: res.sketch,
      details: res.details ? JSON.parse(res.details) : [],
      status: res.status,
      coverImgUrl: res.coverImgUrl,
      album: res.album ? JSON.parse(res.album) : [],
      sort: res.sort,
      sku: res.sku ? JSON.parse(res.sku) : {},
      attr: res.attr ? JSON.parse(res.attr) : [],
      param: res.param ? JSON.parse(res.param) : [],
      stockMode: res.stockMode,
      minOrderAmount: res.minOrderAmount,
      calcBy: res.calcBy,
      keywords: res.keywords,
      onlyPos: res.onlyPos,
      enableMail: res.enableMail,
      packingFee: res.packingFee / 100
    }
    getAttrTemplateData(res.orgId)
  })
}

//更新商品
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
        console.log(skuPriceList)
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
          (a: any, b: any) => b.price - a.price
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
  formData.id = router.currentRoute.value.query.productId

  delete formData.attrType
  delete formData.skuList
  delete formData.stepPrice
  delete formData.priceModel
  delete formData.uniPrice
  delete formData.uniOldPrice
  delete formData.uniBidPrice
  delete formData.uniPurchasingPrice
  delete formData.simpleProudct
  updateProduct(formData)
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
  getDetailData()
})
</script>
