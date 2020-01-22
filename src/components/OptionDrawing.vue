<template>
	<div>
		<div id="output"></div>
		<div id="outputAngle"></div>
		<div id="selected"></div>
		<!-- <v-radio-group class="radioGroup" v-model="drawType" row @change="drawInit"> -->
		<!-- <v-radio-group class="radioGroup" v-model="setDrawType" row>
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
					</v-radio-group> -->
		<v-card max-width="150" dark>
			<v-subheader>그리기</v-subheader>
			<v-divider dark></v-divider>
			<v-item-group mandatory="" v-model="setDrawType">
				<v-container class="pt-1 pb-0 ml-1">
					<v-row>
						<v-col cols="3" md="3" class="pa-0" @click="setArrow">
							<v-item v-slot:default="{ active, toggle }" value="arrow">
								<v-card
									:color="active ? 'blue-grey lighten-1' : ''"
									class="d-flex flex-row align-center"
									@click="toggle"
									width="30"
									flat
								>
									<v-icon class="ma-auto">
										mdi-arrow-left
									</v-icon>
								</v-card>
							</v-item>
						</v-col>
						<v-col cols="3" md="3" class="pa-0" @click="setLine">
							<v-item v-slot:default="{ active, toggle }" value="line">
								<v-card
									:color="active ? 'blue-grey lighten-1' : ''"
									class="d-flex flex-row align-center"
									@click="toggle"
									width="30"
									flat
								>
									<v-icon class="ma-auto">
										mdi-minus
									</v-icon>
								</v-card>
							</v-item>
						</v-col>
						<v-col cols="3" md="3" class="pa-0">
							<v-item v-slot:default="{ active, toggle }" value="rect">
								<v-card
									:color="active ? 'blue-grey lighten-1' : ''"
									class="d-flex flex-row align-center"
									@click="toggle"
									width="30"
									flat
								>
									<v-icon class="ma-auto">
										mdi-rectangle-outline
									</v-icon>
								</v-card>
							</v-item>
						</v-col>
						<v-col cols="3" md="3" class="pa-0">
							<v-item v-slot:default="{ active, toggle }" value="circle">
								<v-card
									:color="active ? 'blue-grey lighten-1' : ''"
									class="d-flex flex-row align-center"
									@click="toggle"
									width="30"
									flat
								>
									<v-icon class="ma-auto">
										mdi-circle-outline
									</v-icon>
								</v-card>
							</v-item>
						</v-col>
					</v-row>
					<v-row>
						<v-col cols="3" md="3" class="pa-0">
							<v-item v-slot:default="{ active, toggle }" value="free">
								<v-card
									:color="active ? 'blue-grey lighten-1' : ''"
									class="d-flex flex-row align-center"
									@click="toggle"
									width="30"
									flat
								>
									<v-icon class="ma-auto">
										mdi-pencil
									</v-icon>
								</v-card>
							</v-item>
						</v-col>
						<v-col cols="3" md="3" class="pa-0">
							<v-item v-slot:default="{ active, toggle }" value="angle">
								<v-card
									:color="active ? 'blue-grey lighten-1' : ''"
									class="d-flex flex-row align-center"
									@click="toggle"
									width="30"
									flat
								>
									<v-icon class="ma-auto">
										mdi-angle-acute
									</v-icon>
								</v-card>
							</v-item>
						</v-col>
						<v-col cols="3" md="3" class="pa-0">
							<v-item v-slot:default="{ active, toggle }" value="triangle">
								<v-card
									:color="active ? 'blue-grey lighten-1' : ''"
									class="d-flex flex-row align-center"
									@click="toggle"
									width="30"
									flat
								>
									<v-icon class="ma-auto">
										mdi-triangle-outline
									</v-icon>
								</v-card>
							</v-item>
						</v-col>
						<v-col cols="3" md="3" class="pa-0">
							<v-item v-slot:default="{ active, toggle }" value="text">
								<v-card
									:color="active ? 'blue-grey lighten-1' : ''"
									class="d-flex flex-row align-center"
									@click="toggle"
									width="30"
									flat
								>
									<v-icon class="ma-auto">
										mdi-format-text
									</v-icon>
								</v-card>
							</v-item>
						</v-col>
					</v-row>
					<v-row>
						<v-col cols="3" md="3" class="pa-0" @click="undoHistory">
							<v-item v-slot:default="{ active, toggle }">
								<v-card
									:color="active ? 'blue-grey lighten-1' : ''"
									class="d-flex flex-row align-center"
									@click="toggle"
									width="30"
									flat
								>
									<v-icon class="ma-auto">
										mdi-undo
									</v-icon>
								</v-card>
							</v-item>
						</v-col>
						<v-col cols="3" md="3" class="pa-0" @click="redoHistory">
							<v-item v-slot:default="{ active, toggle }">
								<v-card
									:color="active ? 'blue-grey lighten-1' : ''"
									class="d-flex flex-row align-center"
									@click="toggle"
									width="30"
									flat
								>
									<v-icon class="ma-auto">
										mdi-redo
									</v-icon>
								</v-card>
							</v-item>
						</v-col>
						<v-col cols="3" md="3" class="pa-0" @click="removeDrawing">
							<v-item v-slot:default="{ active, toggle }">
								<v-card
									:color="active ? 'blue-grey lighten-1' : ''"
									class="d-flex flex-row align-center"
									@click="toggle"
									width="30"
									flat
								>
									<v-icon class="ma-auto">
										mdi-cached
									</v-icon>
								</v-card>
							</v-item>
						</v-col>
					</v-row>
				</v-container>
			</v-item-group>
			<div class="pa-1">
				<!-- <v-card class="strokeDash--wrap mt-2" outlined>
								<v-container class="d-flex" grid-list-xs>
									<v-slider v-model="setDash" label="Dash" min="0" max="10">{{
										strokeDash
									}}</v-slider>
									<p class="strokeWidth--value font-weight-light">
										{{ strokeDash }}
									</p>
								</v-container>
							</v-card>
							<v-card class="strokeWidth--wrap mt-2" outlined>
								<v-container class="d-flex" grid-list-xs>
									<v-slider
										v-model="setStrokeWidth"
										label="Stroke Width"
										min="1"
										max="10"
										>{{ strokeWidth }}</v-slider
									>
									<p class="strokeWidth--value font-weight-light">
										{{ strokeWidth }}
									</p>
								</v-container>
							</v-card> -->
				<v-card class="colorPicker--wrap mt-0" outlined light>
					<v-container class="colorPicker--container pa-1" grid-list-xs>
						<!-- <v-sheet dark class="strokeText--wrap pa-2">
										<p id="strokeText">Stroke Color: {{ color }}</p>
									</v-sheet>
									<v-spacer></v-spacer> -->
						<v-color-picker
							v-model="setColor"
							hide-canvas
							hide-inputs
							show-swatches
							swatches-max-height="100px"
							flat
						></v-color-picker>
					</v-container>
				</v-card>
				<v-card class="pt-1 pb-1">
					<v-menu offset-y>
						<template v-slot:activator="{ on }">
							<v-btn
								class="pa-2"
								color="blue-grey darken-1"
								dark
								v-on="on"
								style="font-size: 0.8rem; width: 68px;"
							>
								width
							</v-btn>
						</template>
						<v-list>
							<v-list-item v-for="(item, index) in items" :key="index">
								<v-list-item-title>{{ item.title }}</v-list-item-title>
							</v-list-item>
						</v-list>
					</v-menu>
					<v-menu offset-y>
						<template v-slot:activator="{ on }">
							<v-btn
								class="ml-1 pa-2"
								color="blue-grey darken-1"
								dark
								v-on="on"
								style="font-size: 0.8rem; width: 68px;"
							>
								dash
							</v-btn>
						</template>
						<v-list>
							<v-list-item v-for="(item, index) in items" :key="index">
								<v-list-item-title>{{ item.title }}</v-list-item-title>
							</v-list-item>
						</v-list>
					</v-menu>
				</v-card>
			</div>
		</v-card>
		<!-- <v-card class="toolbar mt-1" max-width="700" height="50" outlined>
			<v-container>
				<v-flex xs12>
					<v-btn
						class="delete btn"
						color="#e74c3c"
						@click="removeOne"
						dark
						small
						>remove one</v-btn
					>
					<v-btn class="clone btn" color="#37474F" @click="cloneOne" dark small
						>clone</v-btn
					>
					<v-btn
						class="capture--video btn"
						color="#009432"
						@click="openCVTest"
						dark
						small
						>capture video</v-btn
					>
					<v-btn
						class="capture--image btn"
						color="#009432"
						@click="captureImage"
						dark
						small
						>capture image</v-btn
					>
				</v-flex>
			</v-container>
		</!-->
	</div>
</template>

<script>
import { mapState } from 'vuex'
// import html2canvas from 'html2canvas'
// import { test } from '../plugins/opencv'
// eslint-disable-next-line no-undef
// const cv = require('opencv4nodejs')
import { EventBus } from '../eventBus'
// import OptionStroke from '../components/OptionStroke'

export default {
	name: 'Toolbar',

	components: {
		// Integration,
		// OptionStroke,
	},

	props: ['videoId', 'canvasId'],

	data: () => ({
		color: '#E62B2B',
		strokeWidth: 3,
		strokeDash: 0,
		arrow: false,
		items: [
			{ title: 'Click Me' },
			{ title: 'Click Me' },
			{ title: 'Click Me' },
			{ title: 'Click Me 2' },
		],
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

		setColor: {
			get() {
				return this.color
			},
			set(v) {
				this.color = v
				this.$store.state.drawOptions.strokeColor = v
			},
		},

		setStrokeWidth: {
			get() {
				return this.strokeWidth
			},
			set(v) {
				this.strokeWidth = v
				this.$store.state.drawOptions.strokeWidth = v
			},
		},

		setDash: {
			get() {
				return this.strokeDash
			},
			set(v) {
				this.strokeDash = v
				this.$store.state.drawOptions.dash = [v, v]
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
			video5: state => {
				return state.video5
			},
			video6: state => {
				return state.video6
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
			for (let i = 0; i < 6; i++) {
				if (this[`video${i + 1}`].stage.layer !== null) {
					this[`video${i + 1}`].stage.layer.destroyChildren()
				}
			}
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
		setStrokeColorState() {
			const strokeText = document.getElementById('strokeText')

			strokeText.addEventListener('change', () => {
				// eslint-disable-next-line no-console
				console.log('change')
			})
		},

		getDrawType() {
			// eslint-disable-next-line no-console
			console.log(this.$store.state.drawType)
		},
	},
}
</script>

<style>
.v-color-picker__controls {
	display: none !important;
}

.v-color-picker__color {
	width: 25px !important;
}
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
