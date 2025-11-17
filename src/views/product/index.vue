<template>
  <div class="page-container layout-padding">
    <el-card shadow="hover" class="layout-padding-auto">
      <el-form class="query" :inline="true" size="default" label-width="90px">
        <el-row>
          <el-form-item>
            <el-radio-group v-model="queryData.status" size="default" @change="getListData">
              <el-radio-button :label="0">全部</el-radio-button>
              <el-radio-button :label="1">已上架</el-radio-button>
              <el-radio-button :label="-1">已下架</el-radio-button>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="所属商家">
            <el-select v-model="queryData.orgId" placeholder="选择商家" @change="onChangeOrg" clearable filterable>
              <el-option v-for="item in orgList" :key="item.id" :label="item.name" :value="item.id" />
            </el-select>
          </el-form-item>
          <el-form-item label="商品分类">
            <el-cascader v-model="queryData.categoryId" :options="categoryList" clearable collapse-tags :props="{ value: 'id', label: 'name', checkStrictly: true, multiple: false, emitPath: false }" style="width: 100%" placeholder="商品分类" @change="getListData" />
          </el-form-item>
          <el-form-item label="条形码">
            <el-input v-model="queryData.barcode" size="default" placeholder="条形码" clearable> </el-input>
          </el-form-item>
          <el-form-item label="关键字">
            <el-input v-model="queryData.filter" size="default" placeholder="关键字" clearable> </el-input>
          </el-form-item>
          <el-form-item>
            <el-button size="default" type="primary" @click="getListData">
              <el-icon>
                <ele-Search />
              </el-icon>
              查询
            </el-button>
          </el-form-item>
          <el-form-item>
            <el-button size="default" @click="refreshQuery">
              <el-icon>
                <ele-Refresh />
              </el-icon>
              重置
            </el-button>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item>
            <router-link to="/product/add">
              <el-button size="default" type="success" class="ml10">
                <el-icon>
                  <ele-Plus />
                </el-icon>
                新增商品
              </el-button>
            </router-link>
          </el-form-item>
          <el-form-item>
            <el-button :disabled="!selectedList.length" type="success" @click="batchStatus(1)">
              <el-icon>
                <ele-Upload />
              </el-icon>
              上架
            </el-button>
          </el-form-item>
          <el-form-item>
            <el-button :disabled="!selectedList.length" type="danger" @click="batchStatus(-1)">
              <el-icon>
                <ele-Download />
              </el-icon>
              下架
            </el-button>
          </el-form-item>
          <el-form-item>
            <el-upload ref="upload" action="" style="margin: 0 10px" :on-change="onImport" :auto-upload="false" :show-file-list="false">
              <el-button type="success">
                <el-icon>
                  <ele-CirclePlus />
                </el-icon>
                导入
              </el-button>
            </el-upload>
          </el-form-item>
          <el-form-item>
            <el-button size="default" :loading="exportLoading" type="primary" @click="downloadFile">
              <el-icon>
                <ele-Download />
              </el-icon>
              导出
            </el-button>
          </el-form-item>
        </el-row>
      </el-form>
      <el-table :data="list" v-loading="loading" style="width: 100%" @selection-change="selectedList = $event">
        <el-table-column type="selection" width="30" />
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="coverImgUrl" label="图片" width="100">
          <template #default="{ row }"><img :src="row.coverImgUrl" class="smallImage"></template>
        </el-table-column>
        <!-- <el-table-column prop="barcode" label="条形码" min-width="100" show-overflow-tooltip /> -->
        <el-table-column prop="name" label="名称" min-width="100" show-overflow-tooltip />
        <el-table-column prop="unit" label="单位" width="80" show-overflow-tooltip />
        <el-table-column label="价格" width="150">
          <template #default="{ row }">
            <span v-if="row.minPrice === row.maxPrice"> {{ parseMoney(row.minPrice) }} </span>
            <span v-else> {{ parseMoney(row.minPrice) }} ~ {{ parseMoney(row.maxPrice) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="原价" width="80">
          <template #default="{ row }">
            {{ parseMoney(row.oldPrice) }}
          </template>
        </el-table-column>
        <el-table-column prop="sort" label="排列序号" width="100" />
        <el-table-column fixed="right" width="100px" label="状态" align="center">
          <template #default="{ row }">
            <el-tag type="success" v-if="row.status === 1">上架</el-tag>
            <el-tag type="danger" v-if="row.status === -1">下架</el-tag>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="200">
          <template #default="{ row }">
            <router-link :to="`/product/edit?productId=${row.id}`" class="mr10">
              <el-button size="small" text type="primary">修改</el-button>
            </router-link>
            <el-button size="small" text type="primary" @click="onSetStatus(row)">{{ row.status === 1 ? '下架' : '上架'
            }}</el-button>
            <el-button size="small" text type="primary" @click="delProduct(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="page-bottom">
        <el-pagination v-model:currentPage="currentPage" background layout="prev, pager, next, jumper" :page-count="totalPage" @size-change="getListData" @current-change="getListData" />
      </div>
    </el-card>
  </div>
</template>
<script lang="ts">
export default {
  name: 'productIndex',
  beforeRouteEnter(to, from, next) {
    next((vm: any) => {
      if (from.name === 'productAdd' || from.name === 'productEdit') {
        vm.getListData()
      }
    })
  },
}
</script>
<script setup lang="ts">
import { reactive, onMounted, toRefs } from 'vue'
import { parseMoney } from '@/utils/filters'
import { ElMessageBox, ElMessage } from 'element-plus'
import {
  getProductList,
  setStatus,
  batchSetStatus,
  deleteProduct,
  batchUpdateProduct
} from '@/api/product/index'
import { getCategroyList } from '@/api/product/category/index'
import { getOrganList } from '@/api/organ/index'
import XLSX from 'xlsx'

// 定义变量
const defaultQuery = {
  status: 0,
  orgId: '',
  filter: '',
  barcode: '',
  categoryId: '',
}
const state = reactive({
  list: [],
  categoryList: [] as any,
  loading: false,
  currentPage: 1,
  totalPage: 1,
  queryData: Object.assign({}, defaultQuery),
  submitData: {},
  selectedList: [],
  exportLoading: false,
  orgList: [] as any,
})

const {
  list,
  categoryList,
  loading,
  currentPage,
  totalPage,
  queryData,
  selectedList,
  exportLoading,
  orgList
} = toRefs(state)

const onChangeOrg = (e: any) => {
  state.queryData.categoryId = ''
  state.categoryList = []
  getCategoryListData(e)
}

// 获取分类列表
const getCategoryListData = (e: any) => {
  getCategroyList({
    orgId: e
  }).then((data: any) => {
    state.categoryList = data.list
  })
}

// 获取列表
const getListData = () => {
  state.loading = true
  if (JSON.stringify(state.queryData) !== JSON.stringify(state.submitData)) {
    state.currentPage = 1
  }
  const formData = JSON.parse(JSON.stringify(state.queryData))
  getProductList({
    page: state.currentPage,
    ...formData,
  }).then((data: any) => {
    state.loading = false
    state.list = data.list
    if (state.currentPage === 1 && data.pages > 0) {
      state.totalPage = data.pages
    }

    state.submitData = JSON.parse(JSON.stringify(state.queryData))
  })
}

//重置搜索条件
const refreshQuery = () => {
  state.queryData = Object.assign({}, defaultQuery)
  getListData()
}

// 获取商家列表
const getOrganListData = () => {
  getOrganList({
    page: 0,
  }).then((data: any) => {
    state.orgList = data.list
  })
}

//导出表格
const downloadFile = () => {
  import('@/utils/export.js').then((excel) => {
    state.exportLoading = true
    getProductList({ page: 0, ...state.submitData }).then((data) => {
      data.list.map((item: any) => {
        item.price =
          item.minPrice === item.maxPrice
            ? item.minPrice / 100
            : item.minPrice / 100 + ' ~ ' + item.maxPrice / 100
        item.oldPrice = item.oldPrice / 100
        item.status = item.status ? '上架' : '下架'
        return item
      })
      const exportJsonToExcel = excel.export_json_to_excel
      const tableHead = [
        'ID',
        '条形码',
        '名称',
        '单位',
        '价格',
        '原价',
        '排列序号',
        '购物须知',
        '状态',
      ]
      const filterVal = [
        'id',
        'barcode',
        'name',
        'unit',
        'price',
        'oldPrice',
        'sort',
        'sketch',
        'status',
      ]
      const tableBody = data.list.map((v: any) => filterVal.map((j) => v[j]))
      state.exportLoading = false
      exportJsonToExcel({
        header: tableHead,
        data: tableBody,
        filename: '商品列表',
        autoWidth: true,
      })
    })
  })
}


//导入
const onImport = (file: any) => {
  const files = { 0: file.raw }
  if (!/\.(xls|xlsx)$/.test(files[0].name.toLowerCase())) {
    ElMessage.error('文件格式不正确,只支持xls和xlsx.')
    return false
  }
  const fileReader = new FileReader()
  fileReader.onload = (e: any) => {
    try {
      const data = e.target.result
      const workbook = XLSX.read(data, {
        type: 'binary',
      })
      const wsname = workbook.SheetNames[0]
      const ws = XLSX.utils.sheet_to_json(workbook.Sheets[wsname])
      ElMessageBox.confirm(`此操作将批量更新商品记录, 是否继续?`, '提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          const dataList = [] as any
          ws.map((item: any) => {
            if (item['名称']) {
              dataList.push({
                id: item['ID'],
                name: item['名称'],
                barcode: item['条形码'],
                categoryName: item['分类名称'],
                unit: item['单位'],
                sort: item['排列序号'] || 1,
                sketch: item['购物须知'],
                status: item['状态']
              })
            }
          })
          batchUpdateProduct({
            list: dataList,
          }).then(() => {
            getListData()
            ElMessage.success('导入成功')
          })
        })
        .catch(() => { })
    } catch (e) {
      ElMessage.error('解析失败.')
      return false
    }
  }
  fileReader.readAsBinaryString(files[0])
}

//删除
const delProduct = (row: any) => {
  ElMessageBox.confirm(
    `此操作将永久删除商品名称：“${row.name}”，是否继续?`,
    '提示',
    {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning',
    }
  )
    .then(() => {
      deleteProduct({
        id: [row.id],
      }).then(() => {
        getListData()
        ElMessage.success('删除成功')
      })
    })
    .catch(() => { })
}
// 上下架
const onSetStatus = (row: any) => {
  setStatus({
    id: row.id,
    status: row.status === 1 ? -1 : 1,
  }).then(() => {
    getListData()
  })
}

// 批量上下架
const batchStatus = (status: number) => {
  batchSetStatus({
    list: state.selectedList.map((item: any) => item.id),
    status: status,
  }).then(() => {
    getListData()
    ElMessage.success(status === 1 ? '上架成功' : '下架成功')
  })
}


// 页面加载时
onMounted(() => {
  getListData()
  getOrganListData()
})

// 暴露变量
defineExpose({
  getListData,
})
</script>
<style scoped></style>
