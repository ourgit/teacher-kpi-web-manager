<template>
  <div class="page-container layout-padding">
    <el-card shadow="hover" class="layout-padding-auto">
      <el-descriptions class="margin-top" :column="3" size="default" border>
        <el-descriptions-item>
          <template #label>
            <div class="cell-item">
              用户昵称
            </div>
          </template>
          {{ userInfo.nickName }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>
            <div class="cell-item">
              手机号码
            </div>
          </template>
          {{ userInfo.phoneNumber }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>
            <div class="cell-item">
              姓名
            </div>
          </template>
          {{ userInfo.realName }}
        </el-descriptions-item>
        <!-- <el-descriptions-item>
          <template #label>
            <div class="cell-item">
              身份证号码
            </div>
          </template>
          {{ userInfo.idCardNo }}
        </el-descriptions-item> -->
        <el-descriptions-item>
          <template #label>
            <div class="cell-item">
              备注名
            </div>
          </template>
          {{ userInfo.userNote }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>
            <div class="cell-item">
              会员等级
            </div>
          </template>
          {{ userInfo.levelName || '普通会员' }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>
            <div class="cell-item">
              加入时间
            </div>
          </template>
          {{ formatDate(userInfo.createdTime, 'YYYY-mm-dd HH:MM:SS') }}
        </el-descriptions-item>
      </el-descriptions>
      <el-table :data="userInfo.balanceList" border style="width: 100%;margin-top: 20px;">
        <el-table-column label="余额类型" width="100">
          <template #default="{ row }">
            <span v-if="row.itemId === 1">余额</span>
            <span v-if="row.itemId === 3">积分</span>
          </template>
        </el-table-column>
        <el-table-column label="可用余额">
          <template #default="{ row }">
            <span>{{ parseMoney(row.leftBalance) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="冻结余额">
          <template #default="{ row }">
            <span>{{ parseMoney(row.freezeBalance) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="总余额">
          <template #default="{ row }">
            <span>{{ parseMoney(row.totalBalance) }}</span>
          </template>
        </el-table-column>
      </el-table>
      <el-tabs type="border-card" class="mt20">
        <el-tab-pane label="消费记录">
          <orderList :uid="uid" />
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script setup lang="ts" name="orderDetail">
import { reactive, toRefs, ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getMemberDetail } from '@/api/member/index'
import { formatDate } from '@/utils/formatTime'
import { parseMoney } from '@/utils/filters'
import orderList from './component/orderList.vue'
const router = useRouter()

// 定义变量
const uid: any = ref(router.currentRoute.value.query.uid)
const state = reactive({
  uid: 0,
  userInfo: {} as any,
})

const { userInfo } = toRefs(state)


// 获取订单详情
const getMemberDetailData = () => {
  getMemberDetail({
    id: uid.value,
  }).then((res: any) => {
    state.userInfo = res
  })
}



// 页面加载时
onMounted(() => {
  getMemberDetailData()
})
</script>
<style lang="scss" scoped>
.realPay {
  font-size: 24px;
  font-weight: 700;
}

.row-item {
  display: flex;
  align-items: center;
}
</style>
