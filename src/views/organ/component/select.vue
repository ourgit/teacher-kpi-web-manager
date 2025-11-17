<template>
  <div class="dialog-container">
    <el-dialog title="选择机构" v-model="isShowDialog" width="80%" @open="getListData" :close-on-click-modal="false" :destroy-on-close="true">
      <el-form class="query" :inline="true">
        <el-form-item>
          <el-input v-model="queryData.filter" size="default" placeholder="请输入关键字"> </el-input>
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
        <el-table-column v-if="selectType === 'checkbox'" type="selection" :selectable="checkDisabled" width="55" />
        <el-table-column prop="id" label="机构ID" show-overflow-tooltip width="100"></el-table-column>
        <el-table-column prop="name" label="名称" show-overflow-tooltip></el-table-column>
        <el-table-column fixed="right" label="操作" width="80" align="center">
          <template #default="{ row }">
            <el-button size="small" text type="primary" @click="onSelectItem(row)">选择</el-button>
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
import { getOrganList } from '@/api/organ/index'

// 定义子组件向父组件传值/事件
const emit = defineEmits(['select'])

// 定义变量内容
const state = reactive({
  list: [],
  categoryList: [] as any,
  loading: false,
  currentPage: 1,
  totalPage: 1,
  queryData: {
    filter: ''
  },
  submitData: {},
  selectedList: [],
  detachList: [],
  selectType: '',
  isShowDialog: false,
})



const {
  list,
  loading,
  currentPage,
  totalPage,
  queryData,
  selectedList,
  selectType,
  isShowDialog,
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



// 获取列表
const getListData = () => {
  state.loading = true
  if (JSON.stringify(state.queryData) !== JSON.stringify(state.submitData)) {
    state.currentPage = 1
  }
  const formData = JSON.parse(JSON.stringify(state.queryData))
  getOrganList({
    page: state.currentPage,
    ...formData,
  }).then((data: any) => {
    state.loading = false
    data.list.map((item: any) => {
      if (state.detachList.some((some: any) => some.id === item.id)) {
        item.disabled = true
      } else {
        item.disabled = false
      }
      return item
    })
    state.list = data.list
    if (state.currentPage === 1 && data.pages > 0) {
      state.totalPage = data.pages
    }
    state.submitData = JSON.parse(JSON.stringify(state.queryData))
  })
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