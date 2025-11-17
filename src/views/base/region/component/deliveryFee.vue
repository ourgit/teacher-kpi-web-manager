<template>
  <div class="dialog-container">
    <el-dialog :title="dialog.title" v-model="dialog.isShowDialog" width="500px" :close-on-click-modal="false" :destroy-on-close="true">
      <el-table :data="feeList" v-loading="loading" style="width: 100%">
        <el-table-column prop="storagePlaceName" label="存放点" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="status" label="配送费" show-overflow-tooltip>
          <template #default="{ row }">
            <el-input v-model="row.defaultFee" size="small" placeholder="请输入配送费" clearable></el-input>
          </template>
        </el-table-column>
      </el-table>
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
import { reactive, toRefs, ref } from 'vue'
import { ElForm } from 'element-plus'
import { getDeliveryFeeList, setDeliveryFee, getRegionDetail } from '@/api/base/region/index'
import { getPlaceList } from '@/api/base/place/index'

// 定义子组件向父组件传值/事件
const emit = defineEmits(['refresh'])

// 定义变量内容
const dialogFormRef = ref(ElForm)
const state = reactive({
  loading: false,
  shopPlaceId: '',
  shopPlaceName: '',
  dialog: {
    isShowDialog: false,
    title: '',
    submitTxt: '',
  },
  feeList: [] as Array<any>,
})

const { loading, dialog, feeList } = toRefs(state)

// 打开弹窗
const openDialog = (row: any) => {
  state.shopPlaceId = row
  getRegionDetail({
    id: row,
  }).then((res) => {
    state.shopPlaceName = res.name
    state.dialog.title = res.name + '--配送费配置'
  })
  state.dialog.submitTxt = '保 存'
  state.dialog.isShowDialog = true
  getPlaceListData()
}
// 关闭弹窗
const closeDialog = () => {
  state.dialog.isShowDialog = false
}
// 取消
const onCancel = () => {
  closeDialog()
}

// 获取配送费列表
const getDeliveryFeeData = () => {
  getDeliveryFeeList({
    page: 0,
    shopPlaceId: state.shopPlaceId
  }).then((data: any) => {
    data.list.forEach((item: any) => {
      const feeItem = state.feeList.find((fee: any) => fee.storagePlaceId === item.storagePlaceId)
      if (feeItem) {
        feeItem.defaultFee = item.defaultFee / 100
      }
    })
  })
}

// 获取存放点列表
const getPlaceListData = () => {
  getPlaceList({
    page: 0
  }).then((data: any) => {
    state.feeList = data.list.map((item: any) => {
      return {
        shopPlaceId: state.shopPlaceId,
        shopPlaceName: state.shopPlaceName,
        storagePlaceId: item.id,
        storagePlaceName: item.name,
        defaultFee: ''
      }
    })
    getDeliveryFeeData()
  })
}



// 提交
const onSubmit = () => {
  state.loading = true
  const feeList = JSON.parse(JSON.stringify(state.feeList))
  const list = feeList.map((item: any) => {
    item.defaultFee = Math.round(item.defaultFee * 100)
    return item
  })
  setDeliveryFee({
    shopPlaceId: state.shopPlaceId,
    list: list
  })
    .then(() => {
      state.loading = false
      closeDialog()
      emit('refresh')
    })
    .catch(() => {
      state.loading = false
    })
}


// 暴露变量
defineExpose({
  openDialog,
})
</script>

<style scoped lang="scss">
.mb20 {
  margin-bottom: 20px;
}
</style>