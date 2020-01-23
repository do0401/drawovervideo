<template>
	<div class="d-flex">
		<!-- <v-item-group>
			<v-container class="videoContainer mt-10">
				<div class="d-flex">
					<Video
						videoId="video1"
						canvasId="canvas1"
						v-show="pScreenOption.video1.show"
						ref="video1"
						width="640"
						height="360"
					/>
					<Video
						videoId="video2"
						canvasId="canvas2"
						v-show="pScreenOption.video2.show"
						ref="video2"
						width="640"
						height="360"
						class="pl-5"
					/>
				</div>
			</v-container>
		</v-item-group> -->
		<!-- <Video v-for="item in screenOption" v-bind:key="item">{{ item }}</Video> -->
		<Video
			videoId="video1"
			canvasId="canvas1"
			v-show="pScreenOption.video1.show"
			ref="video1"
		/>
		<Video
			videoId="video2"
			canvasId="canvas2"
			class="pl-12"
			v-show="pScreenOption.video2.show"
			ref="video2"
		/>
		<Video
			videoId="video3"
			canvasId="canvas3"
			class="pl-12"
			v-show="pScreenOption.video3.show"
			ref="video3"
		/>
		<Video
			videoId="video4"
			canvasId="canvas4"
			class="pl-12"
			v-show="pScreenOption.video4.show"
			ref="video4"
		/>
		<Video
			videoId="video5"
			canvasId="canvas5"
			class="pl-12"
			v-show="pScreenOption.video5.show"
			ref="video5"
		/>
		<Video
			videoId="video6"
			canvasId="canvas6"
			class="pl-12"
			v-show="pScreenOption.video6.show"
			ref="video6"
		/>
	</div>
</template>

<script>
import Video from './Video'

export default {
	name: 'App',

	components: {
		// Integration,
		Video,
		// OptionStroke,
	},

	props: ['pScreenOption'],
}
</script>

<style>
.videoContainer {
	max-width: 1300px;
	width: 1300px;
	height: 750px;
}
</style>
