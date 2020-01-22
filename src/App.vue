<template>
	<v-app>
		<!-- <Integration /> -->
		<div class="d-flex">
			<Video
				videoId="video1"
				canvasId="canvas1"
				v-show="screenOption.video1.show"
				ref="video1"
			/>
			<Video
				videoId="video2"
				canvasId="canvas2"
				class="pl-12"
				v-show="screenOption.video2.show"
				ref="video2"
			/>
			<Video
				videoId="video3"
				canvasId="canvas3"
				class="pl-12"
				v-show="screenOption.video3.show"
				ref="video3"
			/>
			<Video
				videoId="video4"
				canvasId="canvas4"
				class="pl-12"
				v-show="screenOption.video4.show"
				ref="video4"
			/>
			<Video
				videoId="video5"
				canvasId="canvas5"
				class="pl-12"
				v-show="screenOption.video5.show"
				ref="video5"
			/>
			<Video
				videoId="video6"
				canvasId="canvas6"
				class="pl-12"
				v-show="screenOption.video6.show"
				ref="video6"
			/>
		</div>
		<OptionScreen @setScreenOption="setScreen()" />
		<OptionDrawing />
		<!-- <OptionStroke /> -->
	</v-app>
</template>

<script>
// import Integration from './components/Integration'
import Video from './components/Video'
import OptionScreen from './components/OptionScreen'
import OptionDrawing from './components/OptionDrawing'
// import OptionStroke from './components/OptionStroke'
// eslint-disable-next-line no-unused-vars
import { EventBus } from './eventBus'

export default {
	name: 'App',

	components: {
		// Integration,
		Video,
		OptionScreen,
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
		display: {
			video1: true,
			video2: false,
		},
	}),

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
					this.screenOption.video1.width = '800'
					this.screenOption.video1.height = '600'
					this.screenOption.video2.show = true
					this.screenOption.video2.width = '800'
					this.screenOption.video2.height = '600'
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
			this.setCanvas(numOfVideo)
		},

		setScreenSize() {
			let numOfVideo = 0
			for (let i = 0; i < 6; i++) {
				const video = document.getElementById(`video${i + 1}`)
				video.attributes.width.value = this.screenOption[`video${i + 1}`].width
				video.attributes.height.value = this.screenOption[
					`video${i + 1}`
				].height
				if (this.screenOption[`video${i + 1}`].show === true) {
					numOfVideo += 1
				}
			}
			return numOfVideo
		},

		setCanvas(numOfVideo) {
			// 활성화된 video 컴포넌트의 resizeCanvas 실행
			for (let i = 0; i < numOfVideo; i++) {
				this.$refs[`video${i + 1}`].resizeCanvas()
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
