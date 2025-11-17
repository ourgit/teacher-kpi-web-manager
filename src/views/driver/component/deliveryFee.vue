<template>
  <div class="dialog-container">
    <el-dialog :title="dialog.title" v-model="dialog.isShowDialog" width="800px" :close-on-click-modal="false" :destroy-on-close="true">
      <el-tabs v-model="activeName" class="demo-tabs">
        <el-tab-pane v-for="item in feeList" :key="item.shopPlaceId" :label="item.shopPlaceName" :name="item.shopPlaceId">
          <el-table :data="item.list" v-loading="loading" style="width: 100%">
            <el-table-column prop="storagePlaceName" label="存放点" show-overflow-tooltip>
            </el-table-column>
            <el-table-column prop="status" label="基础配送费" show-overflow-tooltip>
              <template #default="{ row }">
                {{ row.defaultFee }}
              </template>
            </el-table-column>
            <el-table-column prop="status" label="骑手配送费" show-overflow-tooltip>
              <template #header>
                骑手配送费<el-input style="width: 60px;margin-left: 5px;" v-model="syncFee" placeholder="配送费" size="small" /> <el-button size="small" type="primary" @click="onSyncFee">同步</el-button>
              </template>
              <template #default="{ row }">
                <el-input v-model="row.newDriverFee" size="small" placeholder="骑手配送费" clearable></el-input>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="onCancel" size="default">关 闭</el-button>
          <el-button type="primary" @click="onSubmit" size="default" :loading="loading">{{ dialog.submitTxt }}</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { reactive, toRefs, ref } from 'vue'
import { getDeliveryFeeList } from '@/api/base/region/index'
import { updateDriverFee } from '@/api/driver/index'

// 定义子组件向父组件传值/事件
const emit = defineEmits(['refresh'])

// 定义变量内容
const state = reactive({
  loading: false,
  driverId: 0,
  driverName: '',
  activeName: '',
  dialog: {
    isShowDialog: false,
    title: '',
    submitTxt: '',
  },
  feeList: [] as Array<any>,
  syncFee: '',
})

const { activeName, loading, dialog, feeList, syncFee } = toRefs(state)

// 打开弹窗
const openDialog = (row: any) => {
  state.driverId = row.id
  state.driverName = row.realName
  state.dialog.title = row.realName + '配送费'
  state.dialog.submitTxt = '保 存'
  state.dialog.isShowDialog = true
  getDeliveryFeeData()
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
  }).then((data: any) => {
    const groupedMap = new Map();

    data.list.forEach((item: any) => {
      const shopPlaceId = item.shopPlaceId;
      // 如果该 shopPlaceId 尚未在 Map 中，创建新分组
      if (!groupedMap.has(shopPlaceId)) {
        groupedMap.set(shopPlaceId, {
          shopPlaceId: shopPlaceId,
          shopPlaceName: item.shopPlaceName,
          list: []
        });
      }
      let driverFee = 0;
      const feeArray = item.driverFeeJson ? JSON.parse(item.driverFeeJson) : []
      const driverFeeItem = feeArray.find((feeItem: any) => feeItem.id === state.driverId);
      driverFee = driverFeeItem ? driverFeeItem.fee / 100 : 0;
      groupedMap.get(shopPlaceId).list.push({
        id: item.id,
        areaId: item.areaId,
        shopPlaceId: item.shopPlaceId,
        shopPlaceName: item.shopPlaceName,
        storagePlaceId: item.storagePlaceId,
        storagePlaceName: item.storagePlaceName,
        defaultFee: item.defaultFee / 100,
        driverFee: driverFee,
        newDriverFee: driverFee,
      });
    });
    state.feeList = Array.from(groupedMap.values());
    state.activeName = state.feeList[0].shopPlaceId;
  })
}

const onSyncFee = () => {
  const fee = parseFloat(state.syncFee);
  if (isNaN(fee)) {
    return;
  }
  const activePlace = state.feeList.findIndex((item: any) => item.shopPlaceId == state.activeName);
  state.feeList[activePlace].list.forEach((item: any) => {
    item.newDriverFee = fee;
  });
}


// 提交
const onSubmit = () => {
  state.loading = true
  const list: any = []
  state.feeList.forEach((place: any) => {
    place.list.forEach((item: any) => {
      if (Math.round(item.newDriverFee * 100) !== Math.round(item.driverFee * 100)) {
        list.push({
          deliveryFeeId: item.id,
          driverId: state.driverId,
          money: Math.round(item.newDriverFee * 100),
        })
      }
    })
  })
  updateDriverFee({
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