<template>
  <el-form ref="formRef" :model="formData" size="default" label-width="100px" class="form-container">
    <el-row :gutter="35">
      <el-col :xs="24" :sm="6" :md="6" :lg="6" :xl="6" class="mb20">
        <el-form-item label="所属商家" prop="orgId">
          <el-select v-model="formData.orgId" placeholder="选择商家" @change="onChangeOrg" clearable filterable>
            <el-option v-for="item in orgList" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :xs="24" :sm="6" :md="6" :lg="6" :xl="6" class="mb20">
        <el-form-item label="商品分类" prop="categoryId">
          <el-cascader v-model="formData.categoryId" :options="categoryList" collapse-tags clearable :props="{ value: 'id', label: 'name', multiple: false, emitPath: false }" />
        </el-form-item>
      </el-col>
      <!-- <el-col :xs="24" :sm="6" :md="6" :lg="6" :xl="6" class="mb20">
        <el-form-item label="专区分类" prop="activityCategoryId">
          <el-cascader v-model="formData.activityCategoryId" :options="activitCategoryList" collapse-tags clearable :props="{ value: 'id', label: 'name', multiple: false, emitPath: false }" />
        </el-form-item>
      </el-col> -->
      <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
        <el-form-item label="条形码" prop="barcode">
          <el-input v-model="formData.barcode" placeholder="请输入条形码" clearable></el-input>
        </el-form-item>
      </el-col>
      <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
        <el-form-item label="商品名称" prop="name">
          <el-input v-model="formData.name" placeholder="请输入商品名称" clearable></el-input>
        </el-form-item>
      </el-col>
      <!-- <el-col :xs="24" :sm="6" :md="6" :lg="6" :xl="6" class="mb20">
        <el-form-item label="起订量" prop="minOrderAmount">
          <el-input v-model="formData.minOrderAmount" placeholder="请输入起订量" clearable></el-input>
        </el-form-item>
      </el-col> -->
      <el-col :xs="24" :sm="6" :md="6" :lg="6" :xl="6" class="mb20">
        <el-form-item label="打包费" prop="packingFee">
          <el-input v-model="formData.packingFee" placeholder="请输入打包费" clearable></el-input>
        </el-form-item>
      </el-col>
      <el-col :xs="24" :sm="6" :md="6" :lg="6" :xl="6" class="mb20">
        <el-form-item label="单位" prop="unit">
          <el-autocomplete v-model="formData.unit" :fetch-suggestions="unitList" clearable placeholder="单位" />
        </el-form-item>
      </el-col>
      <el-col :xs="24" :sm="6" :md="6" :lg="6" :xl="6" class="mb20">
        <el-form-item label="排列序号" prop="sort">
          <el-input v-model="formData.sort" placeholder="请输入排列序号" clearable></el-input>
        </el-form-item>
      </el-col>
      <el-col :xs="24" :sm="6" :md="6" :lg="6" :xl="6" class="mb20">
        <el-form-item label="虚拟销量" prop="virtualAmount">
          <el-input v-model="formData.virtualAmount" placeholder="请输入虚拟销量" clearable></el-input>
        </el-form-item>
      </el-col>
      <!-- <el-col :xs="24" :sm="6" :md="6" :lg="6" :xl="6" class="mb20">
        <el-form-item label="计价方式" prop="calcBy">
          <el-radio-group v-model="formData.calcBy">
            <el-radio :label="1">按数量</el-radio>
            <el-radio :label="2">按重量</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-col> -->
      <!-- <el-col :xs="24" :sm="6" :md="6" :lg="6" :xl="6" class="mb20">
        <el-form-item label="库存模式" prop="stockMode">
          <el-radio-group v-model="formData.stockMode">
            <el-radio :label="1">无库存模式</el-radio>
            <el-radio :label="2">库存模式</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-col> -->
      <!-- <el-col :xs="24" :sm="6" :md="6" :lg="6" :xl="6" class="mb20">
        <el-form-item label="仅限收银" prop="onlyPos">
          <el-switch v-model="formData.onlyPos" inline-prompt :active-value="true" :inactive-value="false" active-text="是" inactive-text="否"></el-switch>
        </el-form-item>
      </el-col>
      <el-col :xs="24" :sm="6" :md="6" :lg="6" :xl="6" class="mb20">
        <el-form-item label="支持邮寄" prop="enableMail">
          <el-switch v-model="formData.enableMail" inline-prompt :active-value="true" :inactive-value="false" active-text="是" inactive-text="否"></el-switch>
        </el-form-item>
      </el-col> -->
      <el-col :xs="24" :sm="6" :md="6" :lg="6" :xl="6" class="mb20">
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="formData.status">
            <el-radio :label="1">上架</el-radio>
            <el-radio :label="-1">下架</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-col>
      <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
        <el-form-item label="商品封面" prop="coverImgUrl">
          <upload-img v-model="formData.coverImgUrl" />
        </el-form-item>
      </el-col>
      <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
        <el-form-item label="商品相册" prop="album">
          <upload-drag v-model="formData.album" />
        </el-form-item>
      </el-col>
      <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
        <el-form-item label="购买须知" prop="sketch">
          <el-input v-model="formData.sketch" type="textarea" placeholder="请输入简介"></el-input>
        </el-form-item>
      </el-col>
      <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
        <el-form-item label="关键字" prop="keywords">
          <el-input v-model="formData.keywords" type="textarea" placeholder="请输入关键字"></el-input>
        </el-form-item>
      </el-col>
      <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
        <el-form-item label="详情" prop="details">
          <upload-drag v-model="formData.details" />
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
</template>

<script setup lang="ts">
import { reactive, toRefs, onMounted, watch } from 'vue'
import UploadDrag from '@/components/upload/uploadDrag.vue'
import UploadImg from '@/components/upload/uploadImg.vue'
import { getOrganList } from '@/api/organ/index'
import { getCategroyList } from '@/api/product/category/index'

const emit = defineEmits(['onChangeImg', 'onChangeOrg'])

const props = defineProps({
  detailData: {
    type: Object,
    default: Object,
  },
  attrTemplateList: {
    type: Array as any,
    default: Array,
  },
})

// 定义变量内容
const state = reactive({
  orgList: [] as any,
  categoryList: [],
  formData: {
    ordId: '',
    name: '',
    barcode: '',
    categoryId: '',
    activityCategoryId: '',
    unit: '',
    sketch: '',
    details: [],
    status: 1,
    coverImgUrl: '',
    album: [],
    sort: 1,
    keywords: '',
    stockMode: 1,
    calcBy: 1,
    minOrderAmount: 1,
    virtualAmount: 0,
    onlyPos: false,
    enableMail: false,
    packingFee: ''
  } as any,
  unitList: [
    {
      value: '件',
    },
    {
      value: '杯',
    },
    {
      value: '个',
    },
    {
      value: '袋',
    },
    {
      value: '只',
    },
    {
      value: '包',
    },
    {
      value: '支',
    },
    {
      value: '把',
    },
    {
      value: '盒',
    },
    {
      value: '箱',
    },
    {
      value: '桶',
    },
    {
      value: '套',
    },
    {
      value: '手',
    },
    {
      value: '瓶',
    },
    {
      value: '米',
    },
    {
      value: '捆',
    },
    {
      value: '卷',
    },
    {
      value: '张',
    },
  ],
})
const { orgList, categoryList, formData, unitList } = toRefs(state)

watch(
  () => props.detailData,
  (newValue: any) => {
    if (newValue) {
      initFormData(newValue)
    }
  }
)

watch(
  () => state.formData.coverImgUrl,
  (newValue: any) => {
    if (newValue) {
      emit('onChangeImg', newValue)
    }
  }
)

// 获取商家列表
const getOrganListData = () => {
  getOrganList({
    page: 0,
  }).then((data: any) => {
    state.orgList = data.list
  })
}

const onChangeOrg = (e: any) => {
  state.formData.categoryId = ''
  state.categoryList = []
  emit('onChangeOrg', e)
  getCategoryListData(e)
}

// 获取商品分类列表
const getCategoryListData = (e: any) => {
  getCategroyList({
    orgId: e
  }).then((data: any) => {
    state.categoryList = data.list
  })
}

const initFormData = (val: any) => {
  state.formData = {
    orgId: val.orgId,
    name: val.name,
    categoryId: val.categoryId,
    activityCategoryId: val.activityCategoryId,
    barcode: val.barcode,
    unit: val.unit,
    sketch: val.sketch,
    details: val.details,
    status: val.status,
    coverImgUrl: val.coverImgUrl,
    album: val.album,
    sort: val.sort,
    keywords: val.keywords,
    stockMode: val.stockMode,
    calcBy: val.calcBy,
    minOrderAmount: val.minOrderAmount,
    virtualAmount: val.virtualAmount || 0,
    onlyPos: val.onlyPos,
    enableMail: val.enableMail,
    packingFee: val.packingFee
  }
  getCategoryListData(val.orgId)
}

//子传父
const transmit = () => {
  return state.formData
}
// 页面加载时
onMounted(() => {
  getOrganListData()
})
defineExpose({
  transmit,
})
</script>
<style lang="scss" scoped></style>
