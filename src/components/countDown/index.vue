<template>
  <div class="count-down">
    <el-button v-if="type === 1" class="btn" @click="$emit('onTap')">获取验证码</el-button>
    <el-button v-if="type === 2" class="btn" :style="{ color }">{{ count }}s</el-button>
    <el-button v-if="type === 3" class="btn" @click="$emit('onTap')">重新获取</el-button>
  </div>
</template>

<script setup lang="ts">
import { reactive, toRefs } from 'vue'
const props = defineProps({
  color: {
    type: String,
    default: '#14cfa6',
  },
})

const state = reactive({
  type: 1,
  count: 60,
})

const { type, count } = toRefs(state)

function start() {
  state.type = 2
  const times = setInterval(() => {
    state.count--
    if (state.count <= 0) {
      state.type = 3
      state.count = 60
      clearInterval(times)
    }
  }, 1000)
}
defineExpose({ start })
</script>

<style lang="scss" scoped>
.count-down {
  width: 100%;
  .btn {
    width: 100%;
  }
}
</style>
