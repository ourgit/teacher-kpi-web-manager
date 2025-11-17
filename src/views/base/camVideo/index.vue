<template>
  <div class="page-container">
    <el-loading v-model:lock="loading" :full-screen="false" text="加载中..." background="rgba(255, 255, 255, 0.7)" />
    <div class="left-panel">
      <el-form :model="queryData" class="search-form">
        <el-form-item>
          <el-input v-model="queryData.deviceName" size="default" placeholder="请输入名字" clearable style="width: 200px; margin-right: 20px">
          </el-input>
          <el-button size="default" type="primary" @click="search">
            <el-icon>
              <ele-Search />
            </el-icon>
            查询
          </el-button>
        </el-form-item>

        <div class="screen-selector">
          <div class="title">选择分屏数</div>
          <div class="screen-options">
            <div :class="[
              'screen-option',
              { active: selectedScreen === 4 },
            ]" @click="changeScreen(4)">
              4屏
            </div>
            <div :class="[
              'screen-option',
              { active: selectedScreen === 6 },
            ]" @click="changeScreen(6)">
              6屏
            </div>
            <div :class="[
              'screen-option',
              { active: selectedScreen === 8 },
            ]" @click="changeScreen(8)">
              8屏
            </div>
          </div>
        </div>
      </el-form>

      <div class="pagination-container">
        <el-pagination v-model:currentPage="currentPage" background layout="prev, pager, next" :page-count="totalPage" :pager-count="6" @current-change="handleCurrentChange" />
      </div>
    </div>

    <div class="right-panel">
      <el-empty description="暂无视频" v-if="!videoList.length" style="margin-top: 20%" />
      <div class="video-grid" :class="'grid-' + selectedScreen">
        <div v-for="(video, index) in videoList" :key="index" class="video-container" :data-name="video?.deviceName" v-loading="video?.vedioLoading">
          <div ref="ezvizPlayer" :id="'ezviz-player-' + (index + 1)" class="ezviz-player">
          </div>
          <div class="img2" v-if="video?.deviceName" @click="onfullsScreen(index)">
            <img src="@/assets/fullsScreen.png" />
          </div>
          <div class="img" v-if="video?.deviceName" @click="onOpenView('edit', video, index)">
            <img src="@/assets/backF.png" />
          </div>
        </div>
      </div>
    </div>
    <detailDialog ref="detailDialogRef" @playVideo="playVideo" />
  </div>
</template>

<script setup lang="ts">
import {
  defineAsyncComponent,
  reactive,
  onMounted,
  onUnmounted,
  ref,
  toRefs,
  watch,
  nextTick,
} from 'vue'
import { getDeviceVideoList } from '@/api/base/camDevice/index'
import { ElMessage } from 'element-plus'

const detailDialog = defineAsyncComponent(
  () => import('./component/detail.vue')
)
const detailDialogRef = ref()
interface StreetItem {
  itemName: string
  itemValue: string
}

interface VideoDevice {
  id: Number
  accessToken: string
  url: string
  deviceName: string
  deviceCode: string
  vedioLoading: boolean // 添加视频加载状态
}

interface StateType {
  queryData: {
    street: string
    deviceName: string // Add deviceName field
  }
  streetList: StreetItem[]
  videoList: VideoDevice[]
  selectedScreen: number
  currentPage: number
  totalPage: number
  videoIndex: any,
  players: any[]
  loading: boolean // Add loading state
  vedioLoading: boolean // Add loading state
}

// 定义变量
const defaultQuery = {
  street: '',
  deviceName: '',
}
const EZUIKitPlayer = ref()
const state = reactive<StateType>({
  queryData: Object.assign({}, defaultQuery),
  selectedScreen: 4,
  currentPage: 1,
  videoIndex: '',
  totalPage: 1,
  streetList: [],
  videoList: [],
  players: [],
  loading: false,
  vedioLoading: false,
})

const {
  queryData,
  selectedScreen,
  currentPage,
  videoIndex,
  totalPage,
  streetList,
  videoList,
  loading,
  vedioLoading,
} = toRefs(state)

const changeScreen = (screens: number) => {
  state.selectedScreen = screens
  state.currentPage = 1 // 切换分屏数时重置页码
  getListData()
}
const search = () => {
  state.currentPage = 1
  // state.totalPage = 1
  getListData()
}
const handleCurrentChange = () => {
  getListData()
}
// 打开修改弹窗
const onOpenView = (type: string, row: any, index: any) => {
  if (state.players[index]) {
    const stopPromise = state.players[index].pause();
    stopPromise.then((data: any) => {
      console.log("停止了", data);
    });
  }
  state.videoIndex = index
  detailDialogRef.value.openDialog(type, row)
}
// 获取视频列表
const getListData = () => {
  const formData = JSON.parse(JSON.stringify(state.queryData))
  // 先清空现有列表，触发容器渲染
  state.videoList = new Array(state.selectedScreen).fill(null)

  getDeviceVideoList({
    page: state.currentPage,
    size: state.selectedScreen,
    ...formData,
  }).then((data: any) => {
    // 更新真实数据
    state.videoList = data.list.map((item: any, index: number) => ({
      ...item,
      id: index,
      vedioLoading: true // 初始化时设置加载状态为 true
    }))
    if (state.currentPage === 1 && data.pages > 0) {
      state.totalPage = data.pages
    }
    // 等待DOM更新后初始化播放器
    nextTick(() => {
      initializePlayers()
    })
  })
}
const onfullsScreen = (index: any) => {
  if (state.players[index]) {
    state.players[index].fullScreen()
  }
}
const destroyPlayers = () => {
  // 销毁所有现有播放器
  state.players.forEach((player) => {
    if (player) {
      try {
        player.destroy()
      } catch (error) {
        console.error('Failed to destroy player:', error)
      }
    }
  })
  state.players = []
}

const initializePlayers = async () => {
  try {
    // 先销毁现有播放器
    destroyPlayers()
    state.loading = true

    if (typeof EZUIKitPlayer === 'undefined') {
      throw new Error('EZUIKitPlayer SDK not loaded')
    }
    // 初始化新的播放器
    for (let index = 0;index < state.videoList.length;index++) {
      if (index >= state.selectedScreen) break

      const video = state.videoList[index]
      if (!video) continue

      // 设置初始加载状态
      video.vedioLoading = true

      const playerId = `ezviz-player-${index + 1}`
      const container = document.getElementById(playerId)
      if (!container) continue

      try {
        // 清空容器
        container.innerHTML = ''
        const player = new EZUIKitPlayer.value.EZUIKitPlayer({
          id: playerId,
          url: video.ezopenUrl,
          useMSE: false,
          debug: false,
          accessToken: video.accessToken,
          autoPlay: true,
          template: "replay",
          audio: 0,
          decoder: 'decoder.js', // 软解解码资源 （wasm 要和js 在同一个文件夹中）
          width: container.clientWidth,
          height: container.clientHeight,
        })
        state.players.push(player)
        // 监听播放器事件
        player.on('play', () => {
          video.vedioLoading = false
          console.log('播放器初始化成功:', video.deviceName)
        })

        player.on('error', (e: any) => {
          video.vedioLoading = false
          console.error('播放器错误:', e)
          let errorMsg = '播放器错误'
          if (typeof e === 'string') {
            if (e.includes('认证失败')) {
              errorMsg = 'AccessToken无效或已过期，请更新Token'
            } else if (e.includes('设备不在线')) {
              errorMsg = '摄像头设备不在线，请检查设备状态'
            } else if (e.includes('取流超时')) {
              errorMsg = '视频流获取超时，请检查网络连接'
            } else {
              errorMsg = e
            }
          }
          // ElMessage.error(`${video.deviceName}: ${errorMsg}`)
        })
      } catch (error) {
        video.vedioLoading = false
        console.error(`播放器 ${video.deviceName} 初始化失败:`, error)
      }
    }
  } catch (error) {
    console.error('初始化播放器列表失败:', error)
    ElMessage.error('初始化播放器列表失败，请刷新重试')
  } finally {
    state.loading = false
  }
}
const playVideo = (val: any) => {
  if (state.players[state.videoIndex]) {
    const playPromise = state.players[state.videoIndex].play();
    playPromise.then((data: any) => {
      console.log("播放了啊啊啊啊啊", data);
    });
  }
}
// 监听屏幕数量变化，重新初始化播放器
watch(
  () => state.selectedScreen,
  () => {
    nextTick(() => {
      initializePlayers()
    })
  }
)
const streetChange = (e: any) => {
  state.currentPage = 1
  getListData()
}


// 组件卸载时清理资源
onUnmounted(() => {
  destroyPlayers()
})

// 在组件挂载时初始化
onMounted(async () => {
  try {
    const ezuikit = await import('ezuikit-js');
    EZUIKitPlayer.value = ezuikit
  } catch (error) {
    console.error('加载EZUIKitPlayer失败:', error);
  }
  getListData()
})
</script>

<style scoped lang="scss">
.page-container {
  display: flex;
  box-sizing: border-box;
  background-color: #f5f7fa;
  position: relative; // Add this for loading positioning
  height: 90vh; // Add this to ensure full height coverage
}

// Add loading styles
:deep(.el-loading-mask) {
  z-index: 1000;
}

.left-panel {
  width: 400px;
  padding: 20px;
  background-color: #fff;
  color: #333;
  border-right: 1px solid #e4e7ed;
  height: 90vh;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
}

.screen-selector {
  margin-bottom: 20px;

  .title {
    margin-bottom: 10px;
    font-size: 14px;
    color: #606266;
  }

  .screen-options {
    display: flex;
    gap: 10px;

    .screen-option {
      padding: 8px 16px;
      background-color: #f4f4f5;
      border-radius: 4px;
      cursor: pointer;
      transition: all 0.3s;
      color: #606266;

      &:hover {
        background-color: #e6e8eb;
      }

      &.active {
        background-color: #409eff;
        color: #fff;
      }
    }
  }
}

.pagination-container {
  margin-top: auto;
  padding: 15px 0;
  border-top: 1px solid #e4e7ed;
  display: flex;
  justify-content: center;
  box-sizing: border-box;
}

.right-panel {
  box-sizing: border-box;
  flex: 1;
  padding: 20px;
  box-sizing: border-box;
  border-right: 1px solid #e4e7ed;
  height: 90vh;
  overflow: hidden;
  background-color: #fff;

  .video-grid {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    height: 100%;
    align-content: flex-start; // 从顶部开始排列
    position: relative;

    .img {
      position: absolute;
      right: 5px;
      bottom: 5px;
      z-index: 88;

      img {
        width: 30px;
        height: 30px;
      }
    }

    .img2 {
      position: absolute;
      right: 60px;
      bottom: 5px;
      z-index: 88;

      img {
        width: 30px;
        height: 30px;
      }
    }


    &.grid-4 {
      .video-container {
        width: calc(50% - 5px); // 2列布局，减去间隔的一半
        height: calc(50% - 5px); // 2行布局，减去间隔的一半
      }
    }

    &.grid-6 {
      .video-container {
        width: calc(33.333% - 7px); // 3列布局，减去间隔
        height: calc(50% - 5px); // 2行布局
      }
    }

    &.grid-8 {
      .video-container {
        width: calc(25% - 8px); // 4列布局
        height: calc(50% - 5px); // 2行布局
      }
    }
  }

  .video-container {
    background-color: #f4f4f5;
    border-radius: 4px;
    overflow: hidden;
    border: 1px solid #e4e7ed;
    position: relative;

    .ezviz-player {
      width: 100%;
      height: 100%;
      background: #000;
      position: relative; // 添加这行以支持loading定位

      :deep(.el-loading-mask) {
        z-index: 2000;
      }

      video {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }

    // 添加设备名称显示
    &::after {
      content: attr(data-name);
      position: absolute;
      left: 0;
      bottom: 0;
      width: 100%;
      padding: 4px 8px;
      background: rgba(0, 0, 0, 0.5);
      color: #fff;
      font-size: 12px;
    }
  }
}
</style>