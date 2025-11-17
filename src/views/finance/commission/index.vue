<template>
  <div class="page-container layout-padding">
    <el-card shadow="hover" class="layout-padding-auto">
      <el-form class="query" :inline="true" size="default" label-width="90px">
        <el-row>
          <el-form-item label="日期">
            <el-date-picker size="default" v-model="timeRange" type="daterange" range-separator="至" start-placeholder="开始时间" end-placeholder="结束时间" format="YYYY-MM-DD" value-format="x" />
          </el-form-item>
          <el-form-item>
            <el-button size="default" :loading="loading" type="primary" @click="getListData">
              <el-icon>
                <ele-Download />
              </el-icon>
              导出佣金明细
            </el-button>
          </el-form-item>
        </el-row>
      </el-form>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { reactive, toRefs, ref, watch } from 'vue'
import { formatDate } from '@/utils/formatTime'
import { getCommissionExportList } from '@/api/finance/index'

// 引入组件

const defaultQuery = {
  start: 0,
  end: 0,
}

// 定义变量
const beginTime = new Date(new Date().toLocaleDateString()).getTime()
const timeRange = ref([beginTime, beginTime])
const state = reactive({
  loading: false,
  queryData: Object.assign({}, defaultQuery),
})

const {
  loading
} = toRefs(state)

watch(timeRange, (newValue: any) => {
  if (newValue && newValue[0] && newValue[1]) {
    state.queryData.start = newValue[0] || 0
    state.queryData.end =
      (newValue[1] + 24 * 60 * 60 * 1000 - 1000) || 0
  } else {
    state.queryData.start = 0
    state.queryData.end = 0
  }
},
  {
    immediate: true,
  })



const getListData = async () => {
  state.loading = true
  const formData = JSON.parse(JSON.stringify(state.queryData))
  try {
    const res: any = await getCommissionExportList({
      ...formData,
    }, { responseType: 'arraybuffer' })

    const payload = res && res.data ? res.data : res

    if (
      payload instanceof Blob ||
      payload instanceof ArrayBuffer ||
      (typeof Uint8Array !== 'undefined' && payload instanceof Uint8Array) ||
      (payload && payload.type && /(excel|sheet|octet-stream|application\/vnd.openxmlformats-officedocument.spreadsheetml.sheet)/i.test(payload.type)) ||
      (typeof payload === 'string' && payload.indexOf('PK') === 0)
    ) {
      let blob: Blob

      if (payload instanceof Blob) {
        blob = payload
      } else if (payload instanceof ArrayBuffer) {
        blob = new Blob([payload], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
      } else if (typeof Uint8Array !== 'undefined' && payload instanceof Uint8Array) {
        blob = new Blob([payload as any], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
      } else if (typeof payload === 'string' && payload.indexOf('PK') === 0) {
        const binary = payload as string
        const len = binary.length
        const bytes = new Uint8Array(len)
        for (let i = 0;i < len;i++) {
          bytes[i] = binary.charCodeAt(i) & 0xff
        }
        blob = new Blob([bytes], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
      } else {
        // 兜底：尝试直接用 payload 构造 Blob
        blob = new Blob([payload as any], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
      }

      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      const filename = `佣金记录_${formatDate(Date.now(), 'YYYY-mm-dd')}.xlsx`
      a.href = url
      a.download = filename
      document.body.appendChild(a)
      a.click()
      a.remove()
      URL.revokeObjectURL(url)
      state.loading = false
      return
    }
    if (!(payload instanceof Blob || payload instanceof ArrayBuffer || (payload && payload.type))) {
      console.warn('getListData: response is not a file stream; skipped JSON list handling.')
    }
    state.loading = false
  } catch (err) {
    state.loading = false
    console.error('getListData error:', err)
  }
}

</script>

<style scoped lang="scss"></style>
