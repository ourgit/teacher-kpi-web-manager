<template>
  <div v-show="visible" class="captcha-mask">
    <div class="slider word-click">
      <div class="slider-move">
        <span class="slider-move-span">请依次点击:</span>
        <img :src="sliderImageUrl" class="tip-img" alt="" />
      </div>
      <div ref="contentRef" class="content" @click="wordClick">
        <div ref="bgImgDivRef" class="bg-img-div">
          <img ref="bgImgRef" alt="" :src="backgroundImageUrl" />
        </div>
        <div class="bg-click-div">
          <span v-for="item in clickPositions" :key="item.number" class="click-span" :style="`left:${item.left}px;top:${item.top}px`">
            {{ item.number }}
          </span>
        </div>
      </div>
      <div class="bottom">
        <div class="close-btn" style="margin-right: 6px" @click="closeCaptcha"></div>
        <div class="refresh-btn" @click="refreshCaptcha"></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { getCaptcha, checkCaptcha } from '@/api/login/index'
import type { CaptchaConfig, Track } from '@/components/Captcha/types'
import Base64 from '@/utils/base64'

const props = defineProps({
  onSuccess: {
    type: Function,
    default() {},
  },
})

// 是否显示验证码
const visible = ref(false)
function showCaptcha() {
  visible.value = true
}
function closeCaptcha() {
  visible.value = false
}

const contentRef = ref()
const bgImgRef = ref()
const bgImgDivRef = ref()
const captchaData = ref()

const backgroundImageUrl = ref()
const sliderImageUrl = ref()
const tpImageUrl = ref()

let startSlidingTime: Date
let entSlidingTime: Date
const trackArr: Track[] = []
// 选中文字次数
const clickCount = ref(0)

type ClickPosition = {
  left: number
  top: number
  number: number
}
const clickPositions = ref<ClickPosition[]>([])

function wordClick(event: PointerEvent) {
  if (clickCount.value >= 4) {
    return
  }
  clickCount.value++
  if (clickCount.value === 1) {
    startSlidingTime = new Date()
    // move 轨迹
    window.addEventListener('mousemove', move)
  }
  trackArr.push({
    x: event.offsetX,
    y: event.offsetY,
    type: 'click',
    t: new Date().getTime() - startSlidingTime.getTime(),
  })
  const left = event.offsetX - 10
  const top = event.offsetY - 10

  clickPositions.value.push({ left: left, top: top, number: clickCount.value })
  if (clickCount.value === 4) {
    // 校验
    entSlidingTime = new Date()
    window.removeEventListener('mousemove', move)
    valid({
      bgImageWidth: bgImgDivRef.value.clientWidth,
      bgImageHeight: contentRef.value.clientHeight,
      sliderImageWidth: -1,
      sliderImageHeight: -1,
      startTime: startSlidingTime,
      stopTime: entSlidingTime,
      trackArr: trackArr,
    })
  }
}

function move(event: MouseEvent) {
  trackArr.push({
    x: event.offsetX,
    y: event.offsetY,
    t: new Date().getTime() - startSlidingTime.getTime(),
    type: 'move',
  })
}

function reset() {
  startSlidingTime = new Date()
  entSlidingTime = new Date()
  trackArr.length = 0
  clickPositions.value = []
  clickCount.value = 0
  window.removeEventListener('mousemove', move)
}

/* 刷新验证码 */
function refreshCaptcha() {
  getCaptcha().then((res: any) => {
    reset()
    captchaData.value = res.id
    backgroundImageUrl.value = res.captcha.backgroundImage
    sliderImageUrl.value = res.captcha.sliderImage
    tpImageUrl.value = res.captcha.sliderImage
  })
}

function valid(config: CaptchaConfig) {
  const captchData = {
    bgImageWidth: config.bgImageWidth,
    bgImageHeight: config.bgImageHeight,
    sliderImageWidth: config.sliderImageWidth,
    sliderImageHeight: config.sliderImageHeight,
    startSlidingTime: config.startTime,
    entSlidingTime: config.stopTime,
    trackList: config.trackArr,
  }
  const captchaId = captchaData.value!
  const base64 = new Base64()
  const baseData = base64.encode(JSON.stringify(captchData))
  checkCaptcha({
    id: captchaId,
    data: baseData,
  }).then((res: any) => {
    if (res.check) {
      props.onSuccess(captchaId)
      closeCaptcha()
    } else {
      refreshCaptcha()
    }
  })
}

defineExpose({
  show() {
    refreshCaptcha()
    showCaptcha()
  },
})
</script>

<style lang="scss" scoped>
.slider {
  background-color: #fff;
  width: 278px;
  height: 285px;
  z-index: 999;
  box-sizing: border-box;
  padding: 9px;
  border-radius: 6px;
  box-shadow: 0 0 11px 0 #999999;
}

.slider .content {
  width: 100%;
  height: 159px;
  position: relative;
}

.bg-img-div {
  width: 100%;
  height: 100%;
  position: absolute;
  transform: translate(0px, 0px);
}

.slider-img-div {
  height: 100%;
  position: absolute;
  transform: translate(0px, 0px);
}

.bg-img-div img {
  width: 100%;
}

.slider-img-div img {
  height: 100%;
}

.slider .slider-move {
  height: 60px;
  width: 100%;
  margin: 11px 0;
  position: relative;
}

.slider .bottom {
  height: 19px;
  width: 100%;
}

.refresh-btn,
.close-btn,
.slider-move-track,
.slider-move-btn {
  background: url(@/assets/sprite.1.2.4.png) no-repeat;
}

.refresh-btn,
.close-btn {
  display: inline-block;
}

.slider-move .slider-move-track {
  line-height: 38px;
  font-size: 14px;
  text-align: center;
  white-space: nowrap;
  color: #88949d;
  -moz-user-select: none;
  -webkit-user-select: none;
  user-select: none;
}

.slider {
  user-select: none;
}

.slider-move .slider-move-btn {
  transform: translate(0px, 0px);
  background-position: -5px 11.79625%;
  position: absolute;
  top: -12px;
  left: 0;
  width: 66px;
  height: 66px;
}

.slider-move-btn:hover,
.close-btn:hover,
.refresh-btn:hover {
  cursor: pointer;
}

.bottom .close-btn {
  width: 20px;
  height: 20px;
  background-position: 0 44.86874%;
}

.bottom .refresh-btn {
  width: 20px;
  height: 20px;
  background-position: 0 81.38425%;
}

.captcha-mask {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  z-index: 1009;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.slider.word-click {
  height: 250px;
  position: relative;
}

.word-click {
  .bg-img-div {
    z-index: 0;
  }
  .slider-move {
    height: 40px;
    margin: 0;
  }
  .bottom {
    margin-top: 10px;
  }
}

.bg-click-div {
  z-index: 1;
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
}

.tip-img {
  width: 130px;
  position: absolute;
  right: 5px;
}

.slider-move-span {
  font-size: 18px;
  display: inline-block;
  height: 40px;
  line-height: 40px;
}

.click-span {
  position: absolute;
  left: 0;
  top: 0;
  border-radius: 50px;
  background-color: #409eff;
  width: 20px;
  height: 20px;
  text-align: center;
  line-height: 20px;
  color: #fff;
  border: 2px solid #fff;
}
</style>
