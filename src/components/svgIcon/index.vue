<template>
  <i v-if="isShowIconSvg" class="el-icon" :style="setIconSvgStyle">
    <component :is="getIconName" />
  </i>
  <div v-else-if="isShowIconImg" :style="setIconImgOutStyle">
    <img :src="getIconName" :style="setIconSvgInsStyle" />
  </div>
  <div v-else-if="isLocalIcon" class="local-svg" style="display: flex; align-items: center;">
    <svg aria-hidden="true" :width="size" :height="size">
      <use class="svg-use" :xlink:href="getLocalIconName" :fill="color" />
    </svg>
  </div>
  <i v-else :class="getIconName" :style="setIconSvgStyle" />
</template>

<script setup lang="ts" name="svgIcon">
import { computed } from 'vue'

// 定义父组件传过来的值
const props = defineProps({
  // svg 图标组件名字
  name: {
    type: String,
  },
  // svg 大小
  size: {
    type: Number,
    default: () => 14,
  },
  // svg 颜色
  color: {
    type: String,
  },
})

// 在线链接、本地引入地址前缀
const linesString = ['https', 'http', '/src', '/assets', 'data:image']

// 获取 icon 图标名称
const getIconName = computed(() => {
  return props?.name
})

// 获取 icon 图标名称
const getLocalIconName = computed(() => {
  return '#' + props?.name
})

// 用于判断 element plus 自带 svg 图标的显示、隐藏
const isShowIconSvg = computed(() => {
  return props?.name?.startsWith('ele-')
})
// 用于判断在线链接、本地引入等图标显示、隐藏
const isShowIconImg = computed(() => {
  return linesString.find((str) => props.name?.startsWith(str))
})
// 用于判断 本地 svg 图标的显示、隐藏
const isLocalIcon = computed(() => {
  return props?.name?.startsWith('svg-')
})
// 设置图标样式
const setIconSvgStyle = computed(() => {
  return `font-size: ${props.size}px;color: ${props.color};`
})


// 设置图片样式
const setIconImgOutStyle = computed(() => {
  return `width: ${props.size}px;height: ${props.size}px;display: inline-block;overflow: hidden;`
})
// 设置图片样式
const setIconSvgInsStyle = computed(() => {
  const filterStyle: string[] = []
  const compatibles: string[] = ['-webkit', '-ms', '-o', '-moz']
  compatibles.forEach((j) =>
    filterStyle.push(`${j}-filter: drop-shadow(${props.color} 30px 0);`)
  )
  return `width: ${props.size}px;height: ${props.size
    }px;position: relative;left: -${props.size}px;${filterStyle.join('')}`
})
</script>
<style scope>
.svg-use {
  fill: currentColor;
  /* 定义元素的颜色，currentColor是一个变量，这个变量的值就表示当前元素的color值，如果当前元素未设置color值，则从父元素继承 */
}
</style>