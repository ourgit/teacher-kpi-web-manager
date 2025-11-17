<template>
  <el-form ref="formRef" size="default" label-width="100px" class="form-container">
    <el-row :gutter="35">
      <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
        <el-form-item label="商品规格">
          <el-radio-group v-model="formData.attrType">
            <el-radio :label="1">单规格</el-radio>
            <el-radio :label="2">多规格</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-col>
      <template v-if="formData.attrType === 1">
        <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
          <el-form-item label="图片">
            <upload-img v-model="formData.simpleProudct.imgUrl" :width="50" :height="50" />
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
          <el-form-item label="原价" prop="oldPrice">
            <el-input v-model="formData.simpleProudct.oldPrice" placeholder="原价" clearable class="input200"></el-input>
          </el-form-item>
        </el-col>
        <!-- <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
          <el-form-item label="要货价" prop="bidPrice">
            <el-input v-model="formData.simpleProudct.purchasingPrice" placeholder="要货价" clearable class="input200"></el-input>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
          <el-form-item label="成本价" prop="bidPrice">
            <el-input v-model="formData.simpleProudct.bidPrice" placeholder="成本价" clearable class="input200"></el-input>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
          <el-form-item label="内含数量" prop="bidPrice">
            <el-input v-model="formData.simpleProudct.quantity" placeholder="寄存值" clearable class="input200"></el-input>
          </el-form-item>
        </el-col> -->
        <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
          <el-form-item label="库存" prop="stock">
            <el-input v-model="formData.simpleProudct.stock" placeholder="库存" clearable class="input200"></el-input>
          </el-form-item>
        </el-col>
        <!-- <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
          <el-form-item label="价格类型">
            <el-radio-group v-model="formData.priceModel">
              <el-radio :label="1">单一价</el-radio>
              <el-radio :label="3">阶梯价</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col> -->
        <el-col v-if="formData.priceModel === 1" :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
          <el-form-item label="价格" prop="price">
            <el-input v-model="formData.simpleProudct.price" placeholder="价格" clearable class="input200"></el-input>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
          <el-form-item>
            <div class="price-wrap">
              <div v-if="formData.priceModel === 3" class="price-level">
                <div v-for="(item, index) in formData.stepPrice" :key="index">
                  <div class="level-item">
                    满
                    <el-input v-model="item.upto" size="small" style="width:100px;margin:0 5px" />件,价格
                    <el-input v-model="item.price" size="small" style="width:100px;margin:0 5px" />元
                    <el-icon style="margin-left: 10px;" color="#F56C6C" @click="delStepPrice(index)">
                      <ele-Delete />
                    </el-icon>
                  </div>
                </div>
                <el-button plain size="small" @click="addStepPrice">
                  <el-icon>
                    <ele-Plus />
                  </el-icon>
                  添加一条
                </el-button>
              </div>
            </div>
          </el-form-item>
        </el-col>

      </template>
      <template v-else>
        <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
          <el-form-item label="规格模板">
            <el-select v-model="currentTemplateId" placeholder="请选择规格模板" size="default">
              <el-option v-for="item in attrTemplateList" :key="item.id" :label="item.name" :value="item.id" />
            </el-select>
            <el-button size="default" type="primary" style="margin-left: 5px;" @click="onSelectTemplate">
              确定
            </el-button>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
          <el-form-item>
            <div class="section-wrap">
              <div v-for="(item, attrIndex) in formData.attr" :key="attrIndex" class="section-item">
                <div class="name">
                  {{ item.name }}
                  <el-icon style="margin-left: 10px;" color="#F56C6C" @click="onDelAttr(attrIndex)">
                    <ele-Delete />
                  </el-icon>
                </div>
                <div class="list">
                  <draggable v-model="item.list" @start="drag = true" @end="drag = false" item-key="index">
                    <template #item="{ element, index }">
                      <el-tag class="item" size="large" closable @close="onDelAttrValue(attrIndex, index)">{{ element }}</el-tag>
                    </template>
                  </draggable>
                  <el-input v-model="item.newAttrValue" placeholder="规格值" class="input100" style="margin-right: 5px;" />
                  <el-button size="default" type="primary" @click="onAddSingleAttr(attrIndex)">
                    确定
                  </el-button>
                </div>
              </div>
              <div class="add-wrap">
                <el-button v-if="!isAddAttr" size="default" type="primary" @click="isAddAttr = true">
                  <el-icon>
                    <ele-Plus />
                  </el-icon>
                  新增新规格
                </el-button>
                <div v-else class="add-form">
                  <el-form-item label="规格名称">
                    <el-input v-model="newAttrName" placeholder="规格名称" class="input100"></el-input>
                  </el-form-item>
                  <el-form-item label="规格值">
                    <el-input v-model="newAttrList" placeholder="规格值,多个规格用“|”隔开"></el-input>
                  </el-form-item>
                  <el-form-item style="margin-left: 10px;">
                    <el-button type="primary" @click="onAddAttr">新增</el-button>
                    <el-button @click="isAddAttr = false">取消</el-button>
                  </el-form-item>
                </div>
              </div>
            </div>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
          <el-form-item label="价格类型">
            <el-radio-group v-model="formData.priceModel">
              <el-radio :label="1">SKU定价</el-radio>
              <el-radio :label="2">统一定价</el-radio>
              <!-- <el-radio :label="3">阶梯价</el-radio> -->
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
          <el-form-item>
            <div class="price-wrap">
              <div v-if="formData.priceModel === 2" class="uni-price">
                <el-form-item label="现价" label-width="60px">
                  <el-input v-model="formData.uniPrice" placeholder="现价" class="input100"></el-input>
                </el-form-item>
                <el-form-item label="原价" label-width="60px">
                  <el-input v-model="formData.uniOldPrice" class="input100"></el-input>
                </el-form-item>
                <!-- <el-form-item label="要货价" label-width="60px">
                  <el-input v-model="formData.uniPurchasingPrice" class="input100"></el-input>
                </el-form-item>
                <el-form-item label="成本价" label-width="70px">
                  <el-input v-model="formData.uniBidPrice" class="input100"></el-input>
                </el-form-item> -->
              </div>
              <div v-if="formData.priceModel === 3" class="price-level">
                <div v-for="(item, index) in formData.stepPrice" :key="index">
                  <div class="level-item">
                    满
                    <el-input v-model="item.upto" size="small" style="width:100px;margin:0 5px" />件,价格
                    <el-input v-model="item.price" size="small" style="width:100px;margin:0 5px" />元
                    <el-icon style="margin-left: 10px;" color="#F56C6C" @click="delStepPrice(index)">
                      <ele-Delete />
                    </el-icon>
                  </div>
                </div>
                <el-button plain size="small" @click="addStepPrice">
                  <el-icon>
                    <ele-Plus />
                  </el-icon>
                  添加一条
                </el-button>
              </div>
            </div>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
          <el-form-item>
            <el-table :data="formData.skuList" height="300">
              <el-table-column label="规格名称">
                <template #default="{ row }">
                  <span>{{ row.skuName }}</span>
                </template>
              </el-table-column>
              <el-table-column label="图片" align="center" width="80">
                <template #header>
                </template>
                <template #default="scope">
                  <div class="sku-img">
                    <upload-img v-model="scope.row.imgUrl" :width="40" :height="40" />
                    <el-button style="margin-top: 2px;" v-if="scope.$index > 0" type="primary" size="small" @click="syncSkuImg(scope.$index)">同上</el-button>
                  </div>
                </template>
              </el-table-column>
              <el-table-column v-if="formData.priceModel === 1" align="center" width="150">
                <template #header>
                  现价
                </template>
                <template #default="{ row }">
                  <el-input v-model="row.price" placeholder="现价" size="small" />
                </template>
              </el-table-column>
              <el-table-column v-if="formData.priceModel === 1" align="center" width="150" style="display: none;">
                <template #header>
                  原价
                </template>
                <template #default="{ row }">
                  <el-input v-model="row.oldPrice" placeholder="原价" size="small" />
                </template>
              </el-table-column>
              <!-- <el-table-column v-if="formData.priceModel === 1 || formData.priceModel === 3" align="center" width="150" style="display: none;">
                <template #header>
                  要货价
                </template>
                <template #default="{ row }">
                  <el-input v-model="row.purchasingPrice" placeholder="要货价" size="small" />
                </template>
              </el-table-column>
              <el-table-column v-if="formData.priceModel === 1 || formData.priceModel === 3" align="center" width="150" style="display: none;">
                <template #header>
                  成本价
                </template>
                <template #default="{ row }">
                  <el-input v-model="row.bidPrice" placeholder="成本价" size="small" />
                </template>
              </el-table-column>
              <el-table-column align="center" width="150">
                <template #header>
                  内含数量
                </template>
                <template #default="{ row }">
                  <el-input v-model="row.quantity" placeholder="内含数量" size="small" />
                </template>
              </el-table-column> -->
              <el-table-column align="center" width="150">
                <template #header>
                  库存
                </template>
                <template #default="{ row }">
                  <el-input v-model="row.stock" placeholder="库存" size="small" />
                </template>
              </el-table-column>
              <el-table-column label="启用" align="center" width="150">
                <template #default="{ row }">
                  <el-switch v-model="row.enable" />
                </template>
              </el-table-column>
            </el-table>
          </el-form-item>
        </el-col>
      </template>
    </el-row>
  </el-form>
</template>

<script setup lang="ts">
import { reactive, toRefs, ref, watch, computed, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { ElMessage } from 'element-plus'
import { useUserInfo } from '@/stores/userInfo'
import { customAlphabet } from 'nanoid/non-secure'
import draggable from 'vuedraggable'
import UploadImg from '@/components/upload/uploadImg.vue'

const props = defineProps({
  isEidt: {
    type: Boolean,
    default: false,
  },
  detailData: {
    type: Object,
    default: Object,
  },
  attrTemplateList: {
    type: Array as any,
    default: Array,
  },
  defaultImg: {
    type: String,
    default: '',
  },
})

// 定义变量内容
const nanoid = customAlphabet('1234567890', 13)
const storesUserInfo = useUserInfo()
const { userInfos } = storeToRefs(storesUserInfo) as any
const state = reactive({
  skuIndex: 0,
  formData: {
    attrType: 1, //规格类型，1为单规格，2为多规格
    priceModel: 1, //价格类型，1为SKU定价，2为统一定价，3为阶梯价
    uniPrice: '',
    uniOldPrice: '',
    uniPurchasingPrice: '',
    uniBidPrice: '',
    stepPrice: [],
    skuList: [],
    attr: [] as any,
    simpleProudct: {
      skuId: '',
      skuName: '默认规格',
      price: '',
      oldPrice: '',
      purchasingPrice: '',
      bidPrice: '',
      imgUrl: '',
      stock: '',
    },
  } as any,
  currentTemplateId: '',
  drag: false,
  isAddAttr: false, //是否新增规格
  newAttrName: '',
  newAttrList: '',
  syncItem: {} as any,
})

const {
  currentTemplateId,
  formData,
  drag,
  isAddAttr,
  newAttrName,
  newAttrList,
} = toRefs(state)

const attrState = computed(() => {
  const list = state.formData.attr.map((item: any) => {
    return {
      name: item.name,
      list: item.list,
    }
  })
  return JSON.stringify(list)
})

watch(attrState, () => {
  updateSkuList()
})

watch(
  () => props.detailData,
  (newValue: any) => {
    if (newValue) {
      initFormData(newValue)
    }
  }
)

watch(
  () => state.formData.attrType,
  (newValue: any) => {
    if (newValue) {
      if (newValue === 1 && !state.formData.simpleProudct.skuId) {
        state.formData.simpleProudct.skuId = nanoid()
      }
      if (newValue === 1 && state.formData.priceModel === 2) {
        state.formData.priceModel = 1
      }
    }
  }
)

watch(
  () => props.defaultImg,
  (newValue: any, oldValue: any) => {
    if (state.formData.attrType === 1) {
      if (state.formData.simpleProudct.imgUrl === oldValue) {
        state.formData.simpleProudct.imgUrl = newValue
      }
    } else {
      state.formData.skuList.map((item: any) => {
        if (item.imgUrl === oldValue) {
          item.imgUrl = newValue
        }
        return
      })
    }
  }
)


const initFormData = (val: any) => {
  state.formData.attr = val.attr
  const skuData = val.sku
  state.formData.attrType = skuData.attrType
  state.formData.priceModel = skuData.priceModel
  skuData.skuList.map((item: any) => {
    item.price /= 100
    item.oldPrice /= 100
    item.purchasingPrice /= 100
    item.bidPrice /= 100
    return item
  })

  if (skuData.attrType === 1) {
    if (skuData.skuList.length) {
      state.formData.simpleProudct = skuData.skuList[0]
    }
  } else {
    //单规格赋值
    if (skuData.priceModel === 2 && skuData.skuList.length) {
      const firstSku = skuData.skuList[0]
      state.formData.uniPrice = firstSku.price
      state.formData.uniOldPrice = firstSku.oldPrice
      state.formData.uniPurchasingPrice = firstSku.purchasingPrice
      state.formData.uniBidPrice = firstSku.bidPrice
    }
    state.formData.skuList = skuData.skuList
  }

  //阶梯价赋值
  if (skuData.priceModel === 3) {
    state.formData.stepPrice = skuData.stepPrice.map((item: any) => {
      item.price = item.price / 100
      return item
    })
  }


}

//确认选中规格
const onSelectTemplate = () => {
  if (!state.currentTemplateId) {
    return ElMessage({
      message: '请选择规格模板',
      type: 'error',
    })
  }
  const thisTemplate = props.attrTemplateList.find((item: any) => {
    return item.id === state.currentTemplateId
  })
  const attrList = JSON.parse(thisTemplate.attr)
  attrList.forEach((arrt: any) => {
    const isExist = state.formData.attr.findIndex((item: any) => {
      return item.name === arrt.name
    })
    if (isExist === -1) {
      state.formData.attr.push(arrt)
    }
  })
}

// 新增规格
const onAddAttr = () => {
  if (!state.newAttrName) {
    return ElMessage({
      message: '请输入规格名称',
      type: 'error',
    })
  }
  const isExist = state.formData.attr.findIndex((item: any) => {
    return item.name === state.newAttrName
  })
  if (isExist !== -1) {
    return ElMessage({
      message: '规格名称已存在',
      type: 'error',
    })
  }
  if (!state.newAttrList) {
    return ElMessage({
      message: '请输入规格值',
      type: 'error',
    })
  }
  state.formData.attr.push({
    name: state.newAttrName,
    list: state.newAttrList.split('|'),
  })
  state.newAttrName = ''
  state.newAttrList = ''
  state.isAddAttr = false
}

// 删除规格
const onDelAttr = (index: number) => {
  state.formData.attr.splice(index, 1)
}

// 删除规格值
const onDelAttrValue = (attrIndex: number, index: number) => {
  state.formData.attr[attrIndex].list.splice(index, 1)
}

// 新增单项规格
const onAddSingleAttr = (index: number) => {
  const newAttrValue = state.formData.attr[index].newAttrValue
  if (!newAttrValue) {
    return ElMessage({
      message: '请输入规格值',
      type: 'error',
    })
  }
  const isExist = state.formData.attr[index].list.findIndex((item: any) => {
    return item === newAttrValue
  })
  if (isExist !== -1) {
    return ElMessage({
      message: '规格值已存在',
      type: 'error',
    })
  }
  state.formData.attr[index].list.push(newAttrValue)
  state.formData.attr[index].newAttrValue = ''
}

//根据规格生成SKU列表
const generateSkuList = () => {
  // 规格列表
  const attrList = state.formData.attr
  // 当前规格名索引
  let attrIndex = 0
  // 当前规格值索引
  let valueIndex = 0
  // 跳转下一个规格名前纪录当前规格值的索引
  const indexList = [] as any
  // 跳转下一个规格名前纪录当前已合成的标签
  const tagList = [] as any
  // 结果列表
  const resList = [] as any
  // 创建递归规格函数
  function recursion(): any {
    if (!attrList[attrIndex] || !attrList[attrIndex].list[valueIndex]) {
      if (indexList.length) {
        attrIndex -= 1
        valueIndex = indexList[0] + 1
        tagList.shift()
        indexList.shift()
        return recursion()
      } else {
        return resList
      }
    }
    const value = attrList[attrIndex].list[valueIndex]
    const str = (tagList[0] ? tagList[0] + '/' : '') + value
    if (attrList[attrIndex + 1]) {
      tagList.unshift(str)
      indexList.unshift(valueIndex)
      attrIndex += 1
      valueIndex = 0
      return recursion()
    } else {
      resList.push(str)
      if (attrList[attrIndex].list[valueIndex + 1]) {
        valueIndex += 1
        return recursion()
      } else {
        attrIndex -= 1
        valueIndex = indexList[0] + 1
        tagList.shift()
        indexList.shift()
        return recursion()
      }
    }
  }
  // 返回递归函数结果
  return recursion()
}

//更新SKU列表
const updateSkuList = () => {
  const resList = generateSkuList()
  const skuList = state.formData.skuList
  const arr = [] as any
  resList.forEach((item: any) => {
    const flag = skuList.some((sku: any) => {
      if (sku.skuName === item) {
        arr.push(sku)
        return true
      }
    })
    if (!flag) {
      addSku(item, arr)
    }
  })
  skuList.forEach((sku: any) => {
    const flag = resList.some((item: any) => {
      return item === sku.skuName
    })
    if (!flag) {
      delSku(sku, arr)
    }
  })
  state.formData.skuList = arr
}

//新增SKU
const addSku = (e: any, arr: any) => {
  arr.push({
    skuId: nanoid(),
    skuName: e,
    imgUrl: props.defaultImg,
    enable: true,
  })
}

//删除SKu
const delSku = (e: any, arr: any) => {
  arr.some((item: any, index: number, arr: any) => {
    if (item.name === e.skuName) {
      arr.splice(index, 1)
      return true
    }
  })
}

//生成SKUID
const createSkuId = () => {
  state.skuIndex++
  const orgId = userInfos.value.orgId
  const d = new Date()
  const year = d.getFullYear().toString()
  let month: number | string = d.getMonth() + 1
  let date: number | string = d.getDate()
  let hours: number | string = d.getHours()
  let minutes: number | string = d.getMinutes()
  let seconds: number | string = d.getSeconds()
  if (month <= 9) {
    month = '0' + month
  }
  if (date <= 9) {
    date = '0' + date
  }
  if (hours <= 9) {
    hours = '0' + hours
  }
  if (minutes <= 9) {
    minutes = '0' + minutes
  }
  if (seconds <= 9) {
    seconds = '0' + seconds
  }
  const num = Math.ceil(Math.random() * 100)
  const skuId =
    orgId +
    year +
    month +
    date +
    hours +
    minutes +
    seconds +
    num +
    state.skuIndex
  return skuId
}

//同步SKU内容
const setSyncItem = (e: string) => {
  const synItem = JSON.parse(JSON.stringify(state.syncItem))
  state.formData.skuList.map((item: any) => {
    item[e] = synItem[e]
    return item
  })
}

//同步SKU图片
const syncSkuImg = (index: number) => {
  const imgUrl = state.formData.skuList[index - 1].imgUrl
  state.formData.skuList[index].imgUrl = imgUrl
}

//添加阶梯价
const addStepPrice = () => {
  if (state.formData.stepPrice.length < 3) {
    state.formData.stepPrice.push({})
  } else {
    return ElMessage({
      message: '最多只能生成三条阶梯价',
      type: 'error',
    })
  }
}

//删除阶梯价
const delStepPrice = (index: number) => {
  state.formData.stepPrice.splice(index, 1)
}

//子传父
const transmit = () => {
  return state.formData
}
// 暴露方法
defineExpose({
  transmit,
})

// 页面加载时
onMounted(() => {
  if (!props.isEidt) {
    state.formData.simpleProudct.skuId = nanoid()
  }
})
</script>
<style lang="scss" scoped>
.section-wrap {
  width: 100%;

  .section-item {
    margin-bottom: 10px;

    .name {
      display: flex;
      align-items: center;
    }

    .list {
      margin-top: 5px;
      display: flex;
      flex-wrap: wrap;

      .item {
        margin-right: 10px;
        cursor: pointer;
      }
    }
  }

  .add-wrap {
    .add-form {
      display: flex;
    }
  }
}

.sku-img {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.price-wrap {
  .uni-price {
    display: flex;
  }

  .price-level {
    font-size: 14px;

    .level-item {
      margin-bottom: 10px;
    }
  }
}
</style>
