<template>
  <div class="login-container flex">
    <div class="login-warp flex-margin">
      <span class="login-warp-one"></span>
      <span class="login-warp-two"></span>
      <div class="login-warp-mian">
        <div class="login-warp-main-logo">
          <img src="@/assets/logo.png" />
        </div>
        <div class="login-warp-main-title">{{ getThemeConfig.globalTitle }}</div>
        <div class="login-warp-main-form">
          <Account />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts" name="login">
import { onMounted, computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useThemeConfig } from '@/stores/themeConfig'
import { NextLoading } from '@/utils/loading'
// 引入组件
import Account from './component/account.vue'

// 定义变量内容
const storesThemeConfig = useThemeConfig()
const { themeConfig } = storeToRefs(storesThemeConfig)

// 获取布局配置信息
const getThemeConfig = computed(() => {
  return themeConfig.value
})
// 页面加载时
onMounted(() => {
  NextLoading.done()
})
</script>

<style scoped lang="scss">
.login-container {
  height: 100%;
  background: linear-gradient(to bottom, #68eacc 0%, #497be8 100%);
  justify-content: center;
  align-items: center;
  .login-warp {
    border: 1px solid var(--el-color-primary-light-3);
    border-radius: 3px;
    width: 500px;
    height: 430px;
    position: relative;
    overflow: hidden;
    background-color: var(--el-color-white);
    .login-warp-one,
    .login-warp-two {
      position: absolute;
      display: block;
      width: inherit;
      height: inherit;
      &::before,
      &::after {
        content: '';
        position: absolute;
        z-index: 1;
      }
    }
    .login-warp-one {
      &::before {
        filter: hue-rotate(0deg);
        top: 0px;
        left: 0;
        width: 100%;
        height: 3px;
        background: linear-gradient(
          90deg,
          transparent,
          var(--el-color-primary)
        );
        animation: loginLeft 3s linear infinite;
      }
      &::after {
        filter: hue-rotate(60deg);
        top: -100%;
        right: 2px;
        width: 3px;
        height: 100%;
        background: linear-gradient(
          180deg,
          transparent,
          var(--el-color-primary)
        );
        animation: loginTop 3s linear infinite;
        animation-delay: 0.7s;
      }
    }
    .login-warp-two {
      &::before {
        filter: hue-rotate(120deg);
        bottom: 2px;
        right: -100%;
        width: 100%;
        height: 3px;
        background: linear-gradient(
          270deg,
          transparent,
          var(--el-color-primary)
        );
        animation: loginRight 3s linear infinite;
        animation-delay: 1.4s;
      }
      &::after {
        filter: hue-rotate(300deg);
        bottom: -100%;
        left: 0px;
        width: 3px;
        height: 100%;
        background: linear-gradient(
          360deg,
          transparent,
          var(--el-color-primary)
        );
        animation: loginBottom 3s linear infinite;
        animation-delay: 2.1s;
      }
    }
    .login-warp-mian {
      display: flex;
      flex-direction: column;
      height: 100%;
      .login-warp-main-logo {
        text-align: center;
        animation: logoAnimation 0.3s ease;
        animation-delay: 0.3s;
        padding-top: 20px;
        img {
          width: 60px;
          height: 60px;
        }
      }
      .login-warp-main-title {
        height: 80px;
        line-height: 80px;
        font-size: 24px;
        text-align: center;
        letter-spacing: 3px;
        animation: logoAnimation 0.3s ease;
        animation-delay: 0.3s;
        color: var(--el-text-color-primary);
      }
      .login-warp-main-form {
        flex: 1;
        padding: 0 40px 40px;
      }
    }
  }
}
</style>
