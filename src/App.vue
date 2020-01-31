<template>
	<v-app>
		<!-- <Integration /> -->
		<v-container class="d-flex flex-row ma-0" width="1600">
			<div class="pt-10 mt-10">
				<OptionScreen @setScreenOption="setScreen()" style="width: 180px" />
				<OptionZoom style="width: 180px" />
				<OptionDrawing style="width: 180px" />
			</div>
			<div>
				<VideoLayout :pScreenOption="screenOption" ref="videoLayout" />
			</div>
		</v-container>
		<!-- <OptionStroke /> -->
	</v-app>
</template>

<script>
// import Integration from './components/Integration'
import VideoLayout from './components/VideoLayout'
import OptionScreen from './components/OptionScreen'
import OptionZoom from './components/OptionZoom'
import OptionDrawing from './components/OptionDrawing'
// import OptionStroke from './components/OptionStroke'
// eslint-disable-next-line no-unused-vars
import { EventBus } from './eventBus'

export default {
	name: 'App',

	components: {
		// Integration,
		VideoLayout,
		OptionScreen,
		OptionZoom,
		OptionDrawing,
		// OptionStroke,
	},

	data: () => ({
		screenOption: {
			video1: {
				show: false,
				width: null,
				height: null,
			},
			video2: {
				show: false,
				width: null,
				height: null,
			},
			video3: {
				show: false,
				width: null,
				height: null,
			},
			video4: {
				show: false,
				width: null,
				height: null,
			},
			video5: {
				show: false,
				width: null,
				height: null,
			},
			video6: {
				show: false,
				width: null,
				height: null,
			},
		},
		numOfId: null,
	}),

	mounted() {
		this.setScreen()
	},

	methods: {
		async setScreen() {
			console.log('setScreen')
			this.initScreen()
			const currentOption = this.$store.state.screen
			switch (currentOption) {
				case 'oneScreen':
					this.screenOption.video1.show = true
					this.screenOption.video1.width = '1280'
					this.screenOption.video1.height = '720'
					break
				case 'oneByOne':
					this.screenOption.video1.show = true
					this.screenOption.video1.width = '640'
					this.screenOption.video1.height = '720'
					this.screenOption.video2.show = true
					this.screenOption.video2.width = '640'
					this.screenOption.video2.height = '720'
					break
				case 'oneByTwo':
					this.screenOption.video1.show = true
					this.screenOption.video1.width = '480'
					this.screenOption.video1.height = '760'
					this.screenOption.video2.show = true
					this.screenOption.video2.width = '640'
					this.screenOption.video2.height = '360'
					this.screenOption.video3.show = true
					this.screenOption.video3.width = '640'
					this.screenOption.video3.height = '360'
					break
				case 'twoByOne':
					this.screenOption.video1.show = true
					this.screenOption.video1.width = '640'
					this.screenOption.video1.height = '360'
					this.screenOption.video2.show = true
					this.screenOption.video2.width = '640'
					this.screenOption.video2.height = '360'
					this.screenOption.video3.show = true
					this.screenOption.video3.width = '480'
					this.screenOption.video3.height = '760'
					break
				case 'twoByTwo':
					this.screenOption.video1.show = true
					this.screenOption.video1.width = '640'
					this.screenOption.video1.height = '360'
					this.screenOption.video2.show = true
					this.screenOption.video2.width = '640'
					this.screenOption.video2.height = '360'
					this.screenOption.video3.show = true
					this.screenOption.video3.width = '640'
					this.screenOption.video3.height = '360'
					this.screenOption.video4.show = true
					this.screenOption.video4.width = '640'
					this.screenOption.video4.height = '360'
					break
				case 'threeByThree':
					this.screenOption.video1.show = true
					this.screenOption.video1.width = '480'
					this.screenOption.video1.height = '270'
					this.screenOption.video2.show = true
					this.screenOption.video2.width = '480'
					this.screenOption.video2.height = '270'
					this.screenOption.video3.show = true
					this.screenOption.video3.width = '480'
					this.screenOption.video3.height = '270'
					this.screenOption.video4.show = true
					this.screenOption.video4.width = '480'
					this.screenOption.video4.height = '270'
					this.screenOption.video5.show = true
					this.screenOption.video5.width = '480'
					this.screenOption.video5.height = '270'
					this.screenOption.video6.show = true
					this.screenOption.video6.width = '480'
					this.screenOption.video6.height = '270'
					break
				default:
					break
			}
			const numOfVideo = await this.setScreenSize()
			this.setContainer()
			this.setCanvas(numOfVideo)
		},

		setScreenSize() {
			let numOfVideo = 0
			for (let i = 0; i < 6; i++) {
				const video = document.getElementById(`video${i + 1}`)
				if (this.screenOption[`video${i + 1}`].show === true) {
					video.attributes.width.value = this.screenOption[
						`video${i + 1}`
					].width
					video.attributes.height.value = this.screenOption[
						`video${i + 1}`
					].height
					video.parentElement.style = `width: ${video.attributes.width.value}px; height: ${video.attributes.height.value}px;`
					numOfVideo += 1
				}
			}
			return numOfVideo
		},

		setContainer() {
			// this.screenOption.video1.parentElement.width = this.screenOption.video1.width
			// this.screenOption.video2.parentElement.width = this.screenOption.video2.width
			// this.screenOption.video3.parentElement.width = this.screenOption.video3.width
			// this.screenOption.video4.parentElement.width = this.screenOption.video4.width
			// this.screenOption.video5.parentElement.width = this.screenOption.video5.width
			// this.screenOption.video6.parentElement.width = this.screenOption.video6.width
		},

		setCanvas(numOfVideo) {
			// 활성화된 video 컴포넌트의 resizeCanvas 실행
			for (let i = 0; i < numOfVideo; i++) {
				// this.$refs[`video${i + 1}`].resizeCanvas()
				const layoutRef = this.$refs.videoLayout
				layoutRef.$refs[`video${i + 1}`].resizeCanvas()
			}
		},

		initScreen() {
			for (let i = 0; i < 6; i++) {
				this.screenOption[`video${i + 1}`].show = null
				this.screenOption[`video${i + 1}`].width = null
				this.screenOption[`video${i + 1}`].height = null
			}
		},
	},
}
</script>
