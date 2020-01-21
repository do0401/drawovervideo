<template>
	<v-app>
		<!-- <Integration /> -->
		<div class="d-flex">
			<Video videoId="video1" canvasId="canvas1" />
			<Video class="pl-12" videoId="video2" canvasId="canvas2" />
		</div>
		<OptionScreen />
		<OptionDrawing />
		<OptionStroke />
	</v-app>
</template>

<script>
// import Integration from './components/Integration'
import Video from './components/Video'
import OptionScreen from './components/OptionScreen'
import OptionDrawing from './components/OptionDrawing'
import OptionStroke from './components/OptionStroke'

export default {
	name: 'App',

	components: {
		// Integration,
		Video,
		OptionScreen,
		OptionDrawing,
		OptionStroke,
	},

	data: () => ({
		numOfId: null,
		display: {
			video1: true,
			video2: false,
		},
	}),

	methods: {
		idCounter() {
			if (this.numOfId === null) {
				this.numOfId = 1
			} else {
				this.numOfId = this.numOfId + 1
			}
			return this.numOfId
		},
	},
}
</script>
