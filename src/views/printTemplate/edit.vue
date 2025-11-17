<template>
  <div class="page-container layout-padding">
    <el-card shadow="hover" class="layout-padding-auto">
      <detail :isEidt="true" />
    </el-card>
  </div>
</template>

<script setup lang="ts">
import detail from './component/detail.vue'
</script>

