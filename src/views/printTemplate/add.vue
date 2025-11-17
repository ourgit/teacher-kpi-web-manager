<template>
  <div class="page-container layout-padding">
    <el-card shadow="hover" class="layout-padding-auto">
      <detail />
    </el-card>
  </div>
</template>

<script setup lang="ts">
import detail from './component/detail.vue'
</script>
<style lang="scss" scoped>
:deep(.el-card__body) {
  padding: 0;
}
</style>