<template>
  <div class="dialog-container">
    <el-dialog :title="`选择${Text}`" v-model="isShowDialog" width="80%" :close-on-click-modal="false" :destroy-on-close="true">
      <el-form class="query" :inline="true">
        <el-form-item>
          <el-input v-model="queryData.filter" size="default" placeholder="请输入关键字" clearable> </el-input>
        </el-form-item>

        <el-form-item>
          <el-button size="default" type="primary" @click="getListData">
            <el-icon>
              <ele-Search />
            </el-icon>
            查询
          </el-button>
        </el-form-item>
      </el-form>
      <el-table :data="list" v-loading="loading" style="width: 100%" @selection-change="selectedList = $event">
        <el-table-column type="selection" v-if="selectType === 'checkbox'" :selectable="checkDisabled" width="55" />
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="name" :label="`${Text}名称`" min-width="150" show-overflow-tooltip />
        <el-table-column width="100px" label="状态" align="center" v-if="props.type !== 'category'">
          <template #default="{ row }">
            <el-tag type="success" v-if="row.status === 1">上架</el-tag>
            <el-tag type="danger" v-if="row.status === -1">下架</el-tag>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="80">
          <template #default="{ row }">
            <el-button size="small" text type="primary" :disabled="row.disabled" @click="onSelectItem(row)">选择</el-button>
          </template>
        </el-table-column>
      </el-table>
      <template #footer>
        <div class="select-footer">
          <div class="footer-btn" v-if="selectedList.length">
            <el-button type="primary" @click="batchSelect">
              批量选中
            </el-button>
          </div>
          <el-pagination v-model:currentPage="currentPage" background layout="prev, pager, next, jumper" :page-count="totalPage" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { reactive, toRefs } from 'vue'
import { getProductList } from '@/api/product/index'
import { getCategroyList } from '@/api/product/category/index'
import { getShopList } from '@/api/shop/index'
// 定义子组件向父组件传值/事件
const emit = defineEmits(['select'])
const props = defineProps({
  type: {
    type: String,
    default: ''
  },
})
// 定义变量内容
const state = reactive({
  list: [] as any,
  loading: false,
  currentPage: 1,
  totalPage: 1,
  queryData: {
    filter: '',
    categoryId: '',
  },
  submitData: {},
  selectedList: [],
  selectType: '',
  isShowDialog: false,
  Text: "",
  detachList: []
})

const {
  list,
  loading,
  currentPage,
  totalPage,
  queryData,
  selectedList,
  selectType,
  isShowDialog, Text
} = toRefs(state)

// 打开弹窗
const openDialog = (type: string, detachList: any) => {
  state.selectType = type
  state.isShowDialog = true
  if (type === 'checkbox') {
    state.detachList = detachList
  }
  getListData()
}
// 关闭弹窗
const closeDialog = () => {
  state.isShowDialog = false
}

//验证是否可选
const checkDisabled = (row: any) => {
  return !row.disabled
}


//过滤
const filterList = (list: any) => {
  list.map((item: any) => {
    if (state.detachList.some((some: any) => some.productId === item.id)) {
      item.disabled = true
    } else {
      item.disabled = false
    }
    return item
  })
  state.list = list
}
// 获取列表
const getListData = () => {
  state.loading = true
  if (JSON.stringify(state.queryData) !== JSON.stringify(state.submitData)) {
    state.currentPage = 1
  }
  const formData = JSON.parse(JSON.stringify(state.queryData))
  if (props.type == 'product') {
    state.Text = '商品'
    // 获取分类列表
    getProductList({
      page: state.currentPage,
      ...formData,
    }).then((data: any) => {
      state.loading = false
      filterList(data.list)
      if (state.currentPage === 1 && data.pages > 0) {
        state.totalPage = data.pages
      }
    })
  } else if (props.type == 'category') {
    state.Text = '分类'
    getCategroyList().then((data: any) => {
      state.loading = false
      filterList(data.list)
    })
  } else if (props.type == 'shop') {
    state.Text = '店铺'
    getShopList({ page: state.currentPage, ...formData }).then((data) => {
      state.loading = false
      filterList(data.list)
    })
  }

  state.submitData = JSON.parse(JSON.stringify(state.queryData))
}

const handleSizeChange = () => {
  getListData()
}

const handleCurrentChange = () => {
  getListData()
}

// 选中单条
const onSelectItem = (row: any) => {
  closeDialog()
  emit('select', [row])
}

//批量选中
const batchSelect = () => {
  closeDialog()
  emit('select', state.selectedList)
}
// 暴露变量
defineExpose({
  openDialog,
})
</script>
<style lang="scss" scoped>
.select-footer {
  display: flex;

  .footer-btn {
    margin-right: 10px;
  }
}
</style>