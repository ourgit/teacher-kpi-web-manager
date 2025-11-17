<template>
  <div class="dialog-container">
    <el-dialog title="订单详情" v-model="isShowDialog" width="800px" :close-on-click-modal="false" :destroy-on-close="true">
      <el-descriptions class="margin-top" :column="2" size="default" border>
        <el-descriptions-item>
          <template #label>
            <div class="cell-item">
              订单编号
            </div>
          </template>
          {{detail.orderNo}}
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>
            <div class="cell-item">
              订单状态
            </div>
          </template>
          {{formatOrderStatus(detail.status)}}
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>
            <div class="cell-item">
              用户姓名
            </div>
          </template>
          {{detail.userName}}(UID:{{ detail.uid }})
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>
            <div class="cell-item">
              推广人姓名
            </div>
          </template>
          <span v-if="detail.dealerName">{{detail.dealerName}}(UID:{{ detail.dealerUid }})</span>
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>
            <div class="cell-item">
              订单类型
            </div>
          </template>
          <span v-if="detail.nftType === 10">NFT</span>
          <span v-if="detail.nftType === 20">盲盒</span>
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>
            <div class="cell-item">
              订单金额
            </div>
          </template>
          {{parseMoney(detail.realPay)}}
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>
            <div class="cell-item">
              创建时间
            </div>
          </template>
          {{formatDate(detail.createTime,'YYYY-mm-dd HH:MM:SS')}}
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>
            <div class="cell-item">
              支付时间
            </div>
          </template>
          <span v-if="detail.payTime">{{formatDate(detail.payTime,'YYYY-mm-dd HH:MM:SS')}}</span>
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>
            <div class="cell-item">
              商品名称
            </div>
          </template>
          {{detail.nftType === 10 ?  detail.nftName : detail.mhName }}
        </el-descriptions-item>
      </el-descriptions>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="onCancel" size="default">关 闭</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { reactive, toRefs } from 'vue'
import { getOrderDetail } from '@/api/order/index'
import { formatDate } from '@/utils/formatTime'
import { formatOrderStatus, parseMoney } from '@/utils/filters'

const state = reactive({
  detail: {} as any,
  isShowDialog: false,
})

const { detail, isShowDialog } = toRefs(state)

// 打开弹窗
const openDialog = (row: any) => {
  state.isShowDialog = true
  getOrderDetail({
    id: row.id,
  }).then((res) => {
    state.detail = res
  })
}
// 关闭弹窗
const closeDialog = () => {
  state.isShowDialog = false
}
// 取消
const onCancel = () => {
  closeDialog()
}

// 暴露变量
defineExpose({
  openDialog,
})
</script>
