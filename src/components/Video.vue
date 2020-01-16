<template>
	<div>
		<v-container class="videoContainer" fluid>
			<video
				id="video"
				class="video"
				src="../assets/videos/example.mp4"
				width="500"
				@resize="resizeCanvas"
			></video>
			<div id="canvas"></div>
		</v-container>
		<Draw ref="draw" />
		<Toolbar :resizeCanvas="resizeCanvas" />
	</div>
</template>

<script>
import Konva from 'konva'
import Draw from './Draw'
import Toolbar from './Toolbar'

export default {
	name: 'Video',

	components: {
		Draw,
		Toolbar,
	},

	methods: {
		setStage(w, h) {
			// Set up the canvas and shapes
			this.$store.state.stage.canvas = new Konva.Stage({
				container: 'canvas',
				width: w,
				height: h,
			})
			this.$store.state.stage.layer = new Konva.Layer({ draggable: false })
			this.$store.state.stage.canvas.add(this.$store.getters.layer)
			// draw a background rect to catch events.
			this.$store.state.stage.r1 = new Konva.Rect({
				width: w,
				height: h,
				fill: 'gold',
				opacity: 0.3,
				id: 'eventArea',
			})
			this.$store.state.stage.layer.add(this.$store.getters.r1)

			// draw a line to be used as the rubber area
			this.$store.state.stage.line = new Konva.Line({
				points: [],
				stroke: this.$store.getters.strokeColor,
				dash: [2, 2],
				id: 'rubberArea',
			})
			// draw a rectangle to be used as the rubber area
			this.$store.state.stage.rect = new Konva.Rect({
				x: 0,
				y: 0,
				width: 0,
				height: 0,
				stroke: this.$store.getters.strokeColor,
				dash: [2, 2],
				id: 'rubberArea',
			})
			// draw a circle to be used as the rubber area
			this.$store.state.stage.circle = new Konva.Ellipse({
				x: 0,
				y: 0,
				radiusX: 0,
				radiusY: 0,
				stroke: this.$store.getters.strokeColor,
				dash: [2, 2],
				id: 'rubberArea',
			})
			// draw a angle to be used as the rubber area
			this.$store.state.stage.angle = new Konva.Line({
				points: [],
				stroke: this.$store.getters.strokeColor,
				dash: [2, 2],
				id: 'rubberArea',
			})
			this.$store.state.stage.angle.listening(false)
			this.$store.state.stage.line.listening(false)
			this.$store.state.stage.rect.listening(false)
			this.$store.state.stage.circle.listening(false)

			this.$store.state.stage.layer.add(this.$store.getters.angle)
			this.$store.state.stage.layer.add(this.$store.getters.line)
			this.$store.state.stage.layer.add(this.$store.getters.rect)
			this.$store.state.stage.layer.add(this.$store.getters.circle)

			this.$store.getters.canvas.draw()
		},

		resizeCanvas() {
			// eslint-disable-next-line no-console
			console.log('resizeCanvas mounted')
			console.log()

			const video = document.getElementById('video')
			let canvas = document.getElementById('canvas')

			const t = video.offsetTop
			const l = video.offsetLeft
			const w = video.offsetWidth
			const h = video.offsetHeight

			this.setStage(w, h)

			canvas.style.top = t + 'px'
			canvas.style.left = l + 'px'

			// this.draw()
			this.$refs.draw.draw()
			this.mouseMove()
		},

		mouseMove() {
			const output = document.getElementById('output')

			this.$store.getters.canvas.on('mousemove', e => {
				let canvasx = this.$store.getters.r1.x()
				let canvasy = this.$store.getters.r1.y()
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
	height: 365px;
	padding: 0 !important;
}

#video {
	width: 700px;
	height: auto;
	position: absolute;
}

#canvas {
	position: absolute;
	z-index: 10;
	background-color: rgba(255, 0, 0, 0);
}
</style>
