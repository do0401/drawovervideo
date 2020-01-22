<template>
	<div>
		<v-container id="videoContainer" class="videoContainer" fluid>
			<video
				v-bind:id="this.videoId"
				class="video"
				src="../assets/videos/example.mp4"
				width=""
				height=""
				controls
			></video>
			<div v-bind:id="this.canvasId" class="canvas"></div>
		</v-container>
		<Draw ref="draw" :videoId="this.videoId" />
		<!-- <Toolbar
			:resizeCanvas="resizeCanvas"
			v-bind:videoId="this.videoId"
			v-bind:canvasId="this.canvasId"
		/> -->
	</div>
</template>

<script>
import Konva from 'konva'
import Draw from './Draw'
import { mapState } from 'vuex'
import { EventBus } from '../eventBus'

export default {
	name: 'Video',

	components: {
		Draw,
	},

	props: ['videoId', 'canvasId'],

	created() {
		EventBus.$on('eventBus__resizeCanvas', () => {
			this.resizeCanvas()
		})
	},

	computed: mapState({
		video1: state => {
			return state.video1
		},
		video2: state => {
			return state.video2
		},
		video3: state => {
			return state.video3
		},
		video4: state => {
			return state.video4
		},
		video5: state => {
			return state.video5
		},
		video6: state => {
			return state.video6
		},
	}),

	methods: {
		setStage(w, h) {
			console.log(this[this.videoId].stage)
			// Set up the canvas and shapes
			this[this.videoId].stage.canvas = new Konva.Stage({
				container: this.canvasId,
				width: w,
				height: h,
			})
			this[this.videoId].stage.layer = new Konva.Layer({
				draggable: false,
			})
			this[this.videoId].stage.canvas.add(this[this.videoId].stage.layer)
			// draw a background rect to catch events.
			this[this.videoId].stage.r1 = new Konva.Rect({
				width: w,
				height: h,
				fill: 'gold',
				opacity: 0.3,
				id: 'eventArea',
			})
			this[this.videoId].stage.layer.add(this[this.videoId].stage.r1)

			// draw a line to be used as the rubber area
			this[this.videoId].stage.line = new Konva.Line({
				points: [],
				stroke: this.$store.getters.strokeColor,
				dash: [2, 2],
				id: 'rubberArea',
			})
			// draw a rectangle to be used as the rubber area
			this[this.videoId].stage.rect = new Konva.Rect({
				x: 0,
				y: 0,
				width: 0,
				height: 0,
				stroke: this.$store.getters.strokeColor,
				dash: [2, 2],
				id: 'rubberArea',
			})
			// draw a circle to be used as the rubber area
			this[this.videoId].stage.circle = new Konva.Ellipse({
				x: 0,
				y: 0,
				radiusX: 0,
				radiusY: 0,
				stroke: this.$store.getters.strokeColor,
				dash: [2, 2],
				id: 'rubberArea',
			})
			// draw a angle to be used as the rubber area
			this[this.videoId].stage.angle = new Konva.Line({
				points: [],
				stroke: this.$store.getters.strokeColor,
				dash: [2, 2],
				id: 'rubberArea',
			})
			this[this.videoId].stage.angle.listening(false)
			this[this.videoId].stage.line.listening(false)
			this[this.videoId].stage.rect.listening(false)
			this[this.videoId].stage.circle.listening(false)

			this[this.videoId].stage.layer.add(this[this.videoId].stage.angle)
			this[this.videoId].stage.layer.add(this[this.videoId].stage.line)
			this[this.videoId].stage.layer.add(this[this.videoId].stage.rect)
			this[this.videoId].stage.layer.add(this[this.videoId].stage.circle)
		},

		resizeCanvas() {
			// eslint-disable-next-line no-console
			console.log('resizeCanvas mounted')
			const video = document.getElementById(this.videoId)
			let canvas = document.getElementById(this.canvasId)

			const t = video.offsetTop
			const l = video.offsetLeft
			// eslint-disable-next-line no-unused-vars
			const w = video.offsetWidth
			// eslint-disable-next-line no-unused-vars
			const h = video.offsetHeight

			this.setStage(w, h)

			canvas.style.top = t + 'px'
			canvas.style.left = l + 'px'

			// this.draw()
			this.$refs.draw.draw()
			this.mouseMove()

			this[this.videoId].stage.canvas.draw()
		},

		mouseMove() {
			const output = document.getElementById('output')

			this[this.videoId].stage.canvas.on('mousemove', e => {
				let canvasx = this[this.videoId].stage.r1.x()
				let canvasy = this[this.videoId].stage.r1.y()
				let mousex = parseInt(e.evt.clientX - canvasx)
				let mousey = parseInt(e.evt.clientY - canvasy)

				output.innerHTML = 'location: ' + mousex + ', ' + mousey
			})
		},
	},
}
</script>

<style>
.videoContainer {
	/* height: 365px; */
	padding: 0 !important;
}

.canvas {
	position: absolute;
	z-index: 10;
	background-color: rgba(255, 0, 0, 0);
}
</style>
