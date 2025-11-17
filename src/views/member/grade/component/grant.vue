<template>
  <div class="dialog-container">
    <el-dialog title="添加折扣" v-model="isShowDialog" width="800px" :close-on-click-modal="false" :destroy-on-close="true">
      <el-form ref="dialogFormRef" size="default" label-width="90px">
        <el-row :gutter="35">
          <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
            <el-table :data="list" v-loading="loading" style="width: 100%" row-key="id" @selection-change="selectedList = $event">
              <el-table-column type="selection" width="55" />
              <el-table-column label="分类Id" width="200">
                <template #default="{ row }">
                  {{ row.id }}
                </template>
              </el-table-column>
              <el-table-column label="分类名称" show-overflow-tooltip>
                <template #default="{ row }">
                  {{ row.name }}
                </template>
              </el-table-column>
              <el-table-column label="折扣">
                <template #default="{ row }">
                  <el-input placeholder="95折填95" v-model="row.discount" style="width: 90px; "></el-input>
                </template>
              </el-table-column>
            </el-table>
          </el-col>
        </el-row>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="onCancel" size="default">取 消</el-button>
          <el-button type="primary" @click="onSubmit" size="default" :loading="loading">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { defineAsyncComponent, reactive, toRefs, ref } from 'vue'
import { ElForm, ElMessage } from 'element-plus'
import { getCategroyList } from '@/api/product/category/index'

// 定义子组件向父组件传值/事件
const emit = defineEmits(['refresh'])
const state = reactive({
  loading: false,
  coupon: {} as any,
  amount: 1,
  memberList: [] as any,
  isShowDialog: false,
  queryData: {
    filter: '',
    id: '',
  },
  currentPage: 1,
  totalPage: 1,
  submitData: {},
  list: [] as any,
  selectedList: [],
})

const { loading, list, selectedList, isShowDialog } = toRefs(state)
// 获取列表
const getListData = () => {
  state.loading = true
  getCategroyList().then((data: any) => {
    state.loading = false
    state.list = data.list.map((item: any) => {
      item.discount = ''
      return item
    })
  })
}

// 打开弹窗
const openDialog = () => {
  state.isShowDialog = true
  getListData()
}

// 关闭弹窗
const closeDialog = () => {
  state.isShowDialog = false
}
// 取消
const onCancel = () => {
  closeDialog()
}
// 提交
const onSubmit = () => {
  console.log(state.selectedList);
  let discountList = [] as any
  state.selectedList.map((item: any) => {
    discountList.push({
      categoryId: item.id,
      discount: item.discount,
      categoryName: item.name
    })
  })
  emit('refresh', discountList)
  state.isShowDialog = false
}

// 暴露变量
defineExpose({
  openDialog,
})
</script>
