<template>
	<div>
		<v-card id="toolbar" class="toolbar" max-width="150" height="500" outlined>
			<v-container>
				<v-flex xs12>
					<!-- <v-btn class="play btn" color="#37474F" @click="play" dark small
						>Play</v-btn
					>
					<v-btn class="pause btn" color="#37474F" @click="pause" dark small
						>Stop</v-btn
					> -->
					<v-icon class="undo btn" color="#37474F" @click="undoHistory"
						>mdi-undo</v-icon
					>
					<v-icon class="redo btn" color="#37474F" @click="redoHistory"
						>mdi-redo</v-icon
					>
					<v-btn
						class="clear btn"
						color="#c0392b"
						@click="removeDrawing"
						dark
						small
						>Clear</v-btn
					>
					<div id="output"></div>
					<div id="outputAngle"></div>
					<div id="selected"></div>
					<!-- <v-radio-group class="radioGroup" v-model="drawType" row @change="drawInit"> -->
					<v-radio-group class="radioGroup" v-model="setDrawType" row>
						<v-radio
							label="Arrow"
							color="red"
							value="arrow"
							@change="setArrow"
						></v-radio>
						<v-radio
							label="Line"
							color="red"
							value="line"
							@change="setLine"
						></v-radio>
						<v-radio label="Rectangle" color="red" value="rect"></v-radio>
						<v-radio label="Circle" color="red" value="circle"></v-radio>
						<v-radio label="Angle" color="red" value="angle"></v-radio>
						<v-radio label="Free" color="red" value="free"></v-radio>
						<v-radio label="Text" color="red" value="text"></v-radio>
					</v-radio-group>
				</v-flex>
			</v-container>
		</v-card>
		<v-card class="toolbar mt-1" max-width="700" height="50" outlined>
			<v-container>
				<v-flex xs12>
					<!-- <v-btn
						class="delete btn"
						color="#e74c3c"
						@click="removeOne"
						dark
						small
						>remove one</v-btn
					> -->
					<!-- <v-btn class="clone btn" color="#37474F" @click="cloneOne" dark small
						>clone</v-btn
					> -->
					<!-- <v-btn
						class="capture--video btn"
						color="#009432"
						@click="openCVTest"
						dark
						small
						>capture video</v-btn
					> -->
					<!-- <v-btn
						class="capture--image btn"
						color="#009432"
						@click="captureImage"
						dark
						small
						>capture image</v-btn
					> -->
				</v-flex>
			</v-container>
		</v-card>
	</div>
</template>

<script>
import { mapState } from 'vuex'
// import html2canvas from 'html2canvas'
// import { test } from '../plugins/opencv'
// eslint-disable-next-line no-undef
// const cv = require('opencv4nodejs')
import { EventBus } from '../eventBus'

export default {
	name: 'Toolbar',

	props: ['videoId', 'canvasId'],

	data: () => ({
		arrow: false,
	}),

	computed: {
		setDrawType: {
			get() {
				return this.$store.state.drawType
			},
			set(v) {
				this.$store.state.drawType = v
			},
		},
		...mapState({
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
		}),
	},

	methods: {
		setArrow() {
			this.$store.state.drawOptions.arrow = true
		},

		setLine() {
			this.$store.state.drawOptions.arrow = false
		},

		play() {
			const videoPlayer = document.getElementById(this.videoId)

			videoPlayer.play()
		},

		pause() {
			const videoPlayer = document.getElementById(this.videoId)

			videoPlayer.pause()
		},

		undoHistory() {
			// eslint-disable-next-line no-console
			console.log('undoHistory')
			// history array
			const historyArray = this.$store.state.history
			// undo할 shape 의 id를 찾아서 id를 받아옴
			let undoId = null
			let videoNum = null
			historyArray.reverse().some(entry => {
				if (entry.hidden === 'F') {
					historyArray.reverse()
					undoId = entry.id
					videoNum = entry.videoId
					return true
				}
			})
			if (!undoId) return
			// 받아온 id로 history를 찾아서 hidden을 "T" 로 변경
			this.$store.commit('undoHistory', undoId)

			// canvas 에서 undo id를 검색해서 shape을 찾음
			// const undoShape = this[this.videoId].stage.canvas.find(`#${undoId}`)
			console.log(this[videoNum])
			const undoShape = this[videoNum].stage.canvas.find(`#${undoId}`)
			// 찾은 shape의 visible 값을 "false" 로 변경
			undoShape.visible(false)
			this[videoNum].stage.canvas.draw() // redraw any changes.
		},

		redoHistory() {
			// eslint-disable-next-line no-console
			console.log('redoHistory')
			// history array
			const historyArray = this.$store.state.history
			// redo할 shape 의 id를 찾아서 id를 받아옴
			let redoId = null
			let videoNum = null
			historyArray.some(entry => {
				if (entry.hidden === 'T') {
					redoId = entry.id
					videoNum = entry.videoId
					return true
				}
			})
			if (!redoId) return
			// 받아온 id로 history를 찾아서 hidden을 "T" 로 변경
			this.$store.commit('redoHistory', redoId)

			// canvas 에서 redo id를 검색해서 shape을 찾음
			const redoShape = this[videoNum].stage.canvas.find(`#${redoId}`)
			// 찾은 shape의 visible 값을 "false" 로 변경
			redoShape.visible(true)
			this[videoNum].stage.canvas.draw() // redraw any changes.
		},

		removeDrawing() {
			// layer 의 chlildren 삭제
			this.video1.stage.layer.destroyChildren()
			this.video2.stage.layer.destroyChildren()
			this.video3.stage.layer.destroyChildren()
			this.video4.stage.layer.destroyChildren()
			// this.resizeCanvas()
			// this.$props.resizeCanvas()
			EventBus.$emit('eventBus__resizeCanvas')
		},

		// removeOne() {
		// 	if (this[this.videoId].selected) {
		// 		const selectedId = this[this.videoId].selected.attrs.id
		// 		const historyArray = this[this.videoId].history

		// 		this[this.videoId].history = historyArray.filter(function(item) {
		// 			return item.id !== selectedId
		// 		})

		// 		this[this.videoId].selected.remove()
		// 		this[this.videoId].stage.canvas.draw()
		// 	}
		// },

		// cloneOne() {
		// 	if (this[this.videoId].selected) {
		// 		const clone = this[this.videoId].selected.clone({
		// 			x: 5,
		// 			y: 5,
		// 		})

		// 		this[this.videoId].stage.layer.add(clone)

		// 		console.log(this[this.videoId].selected)
		// 		console.log(clone)

		// 		this[this.videoId].stage.canvas.draw()
		// 	}
		// },

		// captureImage() {
		// 	const canvas = document.createElement('canvas')
		// 	const ctx = canvas.getContext('2d')
		// 	const video = document.getElementById(this.videoId)
		// 	const shape = document.querySelector(`#${this.canvasId} canvas`)
		// 	const w = video.offsetWidth
		// 	const h = video.offsetHeight

		// 	canvas.width = w
		// 	canvas.height = h

		// 	ctx.fillRect(0, 0, w, h)
		// 	ctx.drawImage(video, 0, 0, w, h)
		// 	ctx.drawImage(shape, 0, 0, w, h)
		// 	video.style.backgroundImage = `url(${canvas.toDataURL()})`
		// 	video.style.backgroundSize = 'cover'
		// 	ctx.clearRect(0, 0, w, h)

		// 	html2canvas(document.getElementById(this.videoId), {
		// 		allowTaint: true,
		// 		useCORS: true,
		// 	}).then(canvas => {
		// 		let a = document.createElement('a')
		// 		a.href = canvas
		// 			.toDataURL('image/png')
		// 			.replace(/^data:image\/png/, 'data:application/octet-stream')
		// 		a.download = 'videoCapture.jpg'
		// 		a.click()
		// 	})
		// },

		// async openCVTest() {
		// 	try {
		// 		let video = document.getElementById(this.videoId)
		// 		// let src = new cv.Mat(video.height, video.width, cv.CV_8UC4)

		// 		// let cap = new cv.VideoCapture(video.currentSrc)
		// 		let cap = new cv.VideoCapture(video.currentSrc)
		// 		// console.log(video.currentSrc)
		// 		console.log(cap)
		// 	} catch (error) {
		// 		console.log('error', error)
		// 	}
		// },
	},
}
</script>

<style>
.btn {
	position: relative;
}

/* .pause {
	left: 5px;
}

.undo {
	left: 400px;
}

.redo {
	left: 420px;
}

.clear {
	left: 440px;
}

.clone {
	left: 5px;
} */

.capture--video,
.capture--image {
	float: right;
}

.capture--image {
	right: 5px;
}

#output,
#outputAngle,
#selected {
	position: absolute;
	left: 700px;
	font-size: 0.7rem;
	color: black;
}

#output {
	top: -30px;
}

#outputAngle {
	top: -80px;
}

#selected {
	top: -130px;
}

.radioGroup {
	position: relative;
	/* top: -46px;
	left: 140px; */
	width: 55%;
}

.radioGroup label {
	font-size: 0.8rem;
}

/* .radioGroup .v-radio {
	margin-right: 8px;
} */
</style>
