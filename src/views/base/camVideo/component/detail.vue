<template>
	<div class="dialog-container">
		<el-dialog :title="dialog.title" destroy-on-close v-model="dialog.isShowDialog" width="1000px"
			:close-on-click-modal="false" :destroy-on-close="true" @close="closeDialog">
			<div class="container" id="ezviz-player" v-loading="loading">
			</div>
		</el-dialog>
	</div>
</template>

<script setup lang="ts">
	import { reactive, ref, defineAsyncComponent, toRefs, onUnmounted } from 'vue'
	import { ElForm } from 'element-plus'
	import { EZUIKitPlayer } from "ezuikit-js";

	// 定义子组件向父组件传值/事件
	const emit = defineEmits(['playVideo'])

	// 定义变量内容
	const detailFormRef = ref(ElForm)
	const state = reactive({
		loading: false,
		video: {},
		player: null,
		dialog: {
			isShowDialog: false,
			type: '',
			title: '',
			submitTxt: '',
		},
	})

	const { loading, dialog, video, player } = toRefs(state)

	// 打开弹窗
	const openDialog = (type : string, row : any) => {
		state.dialog.title = row.deviceName + '视频回放'
		state.dialog.submitTxt = '修 改'
		state.dialog.type = type
		state.dialog.isShowDialog = true
		state.loading = true
		state.video = row
		setTimeout(() => {
			initializePlayers()
		}, 600)
	}
	// 定义子组件向父组件传值/事件
	// 关闭弹窗
	const closeDialog = () => {
		console.log(state.player, '------------------------------')
		state.dialog.isShowDialog = false
		if (state.player) {
			state.player.destroy()
			state.player = null
			emit('playVideo', true)
		}
	}
	const initializePlayers = () => {
		try {
			// 先销毁现有播放器
			if (state.player) {
				state.player.destroy()
				state.player = null
			}

			// 初始化新的播放器
			const playerId = `ezviz-player`
			const container = document.getElementById(playerId)

			try {
				// 清空容器
				container.innerHTML = ''

				// 创建播放器实例
				state.player = new EZUIKitPlayer({
					id: playerId,
					url: state.video.ezopenUrlRec,
					useMSE: true,
					accessToken: state.video.accessToken,
					autoPlay: true,
					template: "pcRec",
					audio: 0,
					decoder: 'decoder.js', // 软解解码资源 （wasm 要和js 在同一个文件夹中）
					width: container.clientWidth,
					height: container.clientHeight,
				})

				// 监听播放器事件
				state.player.on('play', (res) => {
					console.log('播放器初始化成功:', state.video.deviceName, res)
				})
			} catch (error) {
				console.error(`播放器 ${state.video.deviceName} 初始化失败:`, error)
			}
		} catch (error) {
			console.error('初始化播放器列表失败:', error)
		} finally {
			state.loading = false
		}
	}
	onUnmounted(() => {
		if (state.player) {
			const destroyPromise = state.player.destroy();
			destroyPromise.then((data : any) => {
				console.log("销毁成功", data);
			});
			state.player = null
		}
	})
	// 暴露变量
	defineExpose({
		openDialog,
	})
</script>
<style scoped lang="scss">
	.dialog-container {
		.container {
			height: 600px;
		}
	}
</style>