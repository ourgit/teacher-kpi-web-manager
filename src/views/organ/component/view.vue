<template>
  <div class="dialog-container">
    <el-dialog title="商家详情" v-model="isShowDialog" width="800px" :close-on-click-modal="false" :destroy-on-close="true">
      <div class="view-page">
        <div class="view-page-row">
          <div class="view-page-item">
            <div class="label">
              商家头像
            </div>
            <div class="value">
              <el-image style="width: 80px;height: 80px;" :src="detail.avatar" :preview-src-list="[detail.avatar]" />
            </div>
          </div>
          <div class="view-page-item">
            <div class="label">
              商家LOGO
            </div>
            <div class="value">
              <el-image style="width: 80px;height: 80px;" :src="detail.rectLogo" :preview-src-list="[detail.rectLogo]" />
            </div>
          </div>
        </div>
        <div class="view-page-row">
          <div class="view-page-item">
            <div class="label">
              商家名称
            </div>
            <div class="value">
              {{ detail.name }}
            </div>
          </div>
        </div>
        <div class="view-page-row">
          <div class="view-page-item">
            <div class="label">
              商家状态
            </div>
            <div class="value">
              <el-tag v-if="detail.status === 1" type="success">正常</el-tag>
              <el-tag v-if="detail.status === 2" type="danger">锁定</el-tag>
              <el-tag v-if="detail.status === 3" type="warning">已过期</el-tag>
            </div>
          </div>
        </div>
        <div class="view-page-row">
          <div class="view-page-item">
            <div class="label">
              联系人
            </div>
            <div class="value">
              {{ detail.contactName }}
            </div>
          </div>
          <div class="view-page-item">
            <div class="label">
              联系电话
            </div>
            <div class="value">
              {{ detail.contactNumber }}
            </div>
          </div>
        </div>
        <div class="view-page-row">
          <div class="view-page-item">
            <div class="label">
              联系地址
            </div>
            <div class="value">
              {{ detail.contactAddress }}
            </div>
          </div>
        </div>
        <div class="view-page-row">
          <div class="view-page-item">
            <div class="label">
              营业执照号码
            </div>
            <div class="value">
              {{ detail.licenseNumber }}
            </div>
          </div>
        </div>
        <div class="view-page-row">
          <div class="view-page-item">
            <div class="label">
              营业执照
            </div>
            <div class="value">
              <el-image style="width: 80px;height: 80px;" :src="detail.licenseImg" :preview-src-list="[detail.licenseImg]" />
            </div>
          </div>
        </div>
        <div class="view-page-row">
          <div class="view-page-item">
            <div class="label">
              入驻时间
            </div>
            <div class="value">
              {{ formatDate(detail.createTime, 'YYYY-mm-dd HH:MM:SS') }}
            </div>
          </div>
        </div>
        <!-- <div class="view-page-row">
          <div class="view-page-item">
            <div class="label">
              最近缴费时间
            </div>
            <div class="value">
              {{ detail.chargeTime > 0 ? formatDate(detail.chargeTime, 'YYYY-mm-dd HH:MM:SS') : '--' }}
            </div>
          </div>
          <div class="view-page-item">
            <div class="label">
              续费时间
            </div>
            <div class="value">
              {{ detail.renewTime > 0 ? formatDate(detail.renewTime, 'YYYY-mm-dd HH:MM:SS') : '--' }}
            </div>
          </div>
        </div> -->
        <div class="view-page-row">
          <div class="view-page-item">
            <div class="label">
              备注
            </div>
            <div class="value">
              {{ detail.description }}
            </div>
          </div>
        </div>
      </div>
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
import { formatDate } from '@/utils/formatTime'
import { getOrganDetail } from '@/api/organ/index'

// 定义变量内容
const state = reactive({
  detail: {} as any,
  isShowDialog: false,
})

const { detail, isShowDialog } = toRefs(state)

// 打开弹窗
const openDialog = (row: any) => {
  state.isShowDialog = true
  getOrganDetail({
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
<style lang="scss" scoped>
.view-page {
  display: flex;
  flex-direction: column;

  .view-page-row {
    display: flex;
    margin-bottom: 20px;

    .view-page-item {
      flex: 1;
      display: flex;
      align-items: center;

      .label {
        width: 100px;
        text-align: right;
        color: #666;
      }

      .value {
        flex: 1;
        margin-left: 10px;
        color: #212121;
      }
    }
  }
}
</style>