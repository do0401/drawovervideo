<template>
	<v-app>
		<v-container class="videoContainer" fluid>
			<video
				id="video1"
				class="video"
				src="../assets/videos/example.mp4"
				width="500"
				@resize="resizeCanvas($event)"
			></video>
			<video
				id="video2"
				class="video"
				src="../assets/videos/example.mp4"
				width="500"
				@resize="resizeCanvas($event)"
			></video>
			<div id="canvas"></div>
		</v-container>
		<v-card class="toolbar" max-width="700" height="50" outlined>
			<v-container>
				<v-flex xs12>
					<v-btn class="play btn" color="#37474F" @click="play" dark small
						>Play</v-btn
					>
					<v-btn class="pause btn" color="#37474F" @click="pause" dark small
						>Stop</v-btn
					>
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
						<v-radio label="Line" color="red" value="line"></v-radio>
						<v-radio label="Rectangle" color="red" value="rect"></v-radio>
						<v-radio label="Circle" color="red" value="circle"></v-radio>
						<v-radio label="Angle" color="red" value="angle"></v-radio>
						<v-radio label="Free" color="red" value="free"></v-radio>
					</v-radio-group>
				</v-flex>
			</v-container>
		</v-card>
		<v-card class="toolbar mt-1" max-width="700" height="50" outlined>
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
				</v-flex>
			</v-container>
		</v-card>
		<Option />
	</v-app>
</template>

<script>
import Option from './Option'
import Konva from 'konva'

export default {
	name: 'Integration',

	components: {
		Option,
	},

	computed: {
		setDrawType: {
			get() {
				return this.drawType
			},
			set(v) {
				this.drawType = v
				this.$store.state.drawType = v
			},
		},
	},

	methods: {
		setStage(w, h) {
			// Set up the canvas and shapes
			this.canvas = new Konva.Stage({
				container: 'canvas',
				width: w,
				height: h,
			})
			this.layer = new Konva.Layer({ draggable: false })
			this.canvas.add(this.layer)
			// draw a background rect to catch events.
			this.r1 = new Konva.Rect({
				width: w,
				height: h,
				fill: 'gold',
				opacity: 0.3,
				id: 'eventArea',
			})
			this.layer.add(this.r1)

			// draw a line to be used as the rubber area
			this.line = new Konva.Line({
				points: [],
				stroke: this.$store.getters.strokeColor,
				dash: [2, 2],
				id: 'rubberArea',
			})
			// draw a rectangle to be used as the rubber area
			this.rect = new Konva.Rect({
				x: 0,
				y: 0,
				width: 0,
				height: 0,
				stroke: this.$store.getters.strokeColor,
				dash: [2, 2],
				id: 'rubberArea',
			})
			// draw a circle to be used as the rubber area
			this.circle = new Konva.Ellipse({
				x: 0,
				y: 0,
				radiusX: 0,
				radiusY: 0,
				stroke: this.$store.getters.strokeColor,
				dash: [2, 2],
				id: 'rubberArea',
			})
			// draw a angle to be used as the rubber area
			this.angle = new Konva.Line({
				points: [],
				stroke: this.$store.getters.strokeColor,
				dash: [2, 2],
				id: 'rubberArea',
			})
			this.angle.listening(false)
			this.line.listening(false)
			this.rect.listening(false)
			this.circle.listening(false)

			this.layer.add(this.angle)
			this.layer.add(this.line)
			this.layer.add(this.rect)
			this.layer.add(this.circle)

			this.canvas.draw()
		},

		resizeCanvas(event) {
			// eslint-disable-next-line no-console
			console.log('resizeCanvas mounted')
			console.log(event)

			const videoId = event.target.id
			const video = document.getElementById(videoId)
			let canvas = document.getElementById('canvas')
			// let videoOffset = [{}]

			const t = video.offsetTop
			const l = video.offsetLeft
			const w = video.offsetWidth
			const h = video.offsetHeight

			this.setStage(w, h)

			canvas.style.top = t + 'px'
			canvas.style.left = l + 'px'

			// console.log(videoOffset)

			// videoOffset.forEach(entry => {
			// 	this.setStage(entry.w, entry.h)
			// 	canvas.style.top = entry.t + 'px'
			// 	canvas.style.left = entry.l + 'px'
			// })

			this.draw()
			this.mouseMove()
		},

		mouseMove() {
			const output = document.getElementById('output')

			this.canvas.on('mousemove', e => {
				let canvasx = this.r1.x()
				let canvasy = this.r1.y()
				let mousex = parseInt(e.evt.clientX - canvasx)
				let mousey = parseInt(e.evt.clientY - canvasy)

				output.innerHTML = 'location: ' + mousex + ', ' + mousey
			})
		},

		play() {
			const videoPlayer = document.getElementById('video')

			videoPlayer.play()
		},

		pause() {
			const videoPlayer = document.getElementById('video')

			videoPlayer.pause()
		},

		draw() {
			// start the rubber drawing on mouse down.
			this.r1.on('mousedown', e => {
				if (this.drawType === 'rect') {
					this.mode = 'drawing'
					this.startDrag({ x: e.evt.layerX, y: e.evt.layerY })
				} else if (this.drawType === 'circle') {
					this.mode = 'drawing'
					this.startDrag({ x: e.evt.layerX, y: e.evt.layerY })
				} else if (this.drawType === 'free') {
					this.mode = 'drawing'
					let pos = this.canvas.getPointerPosition()
					this.free = new Konva.Line({
						points: [pos.x, pos.y],
						stroke: this.$store.getters.strokeColor,
						strokeWidth: this.$store.getters.strokeWidth,
					})
					this.layer.add(this.free)
				}
			})

			// update the rubber rect on mouse move - note use of 'mode' var to avoid drawing after mouse released.
			this.r1.on('mousemove', e => {
				if (this.drawType === 'rect' && this.mode === 'drawing') {
					this.updateDrag({ x: e.evt.layerX, y: e.evt.layerY })
				} else if (this.drawType === 'circle' && this.mode === 'drawing') {
					this.updateDrag({ x: e.evt.layerX, y: e.evt.layerY })
				} else if (this.drawType === 'line' && this.mode === 'drawing') {
					this.updateDrag({ x: e.evt.layerX, y: e.evt.layerY })
				} else if (this.drawType === 'free') {
					if (this.mode === 'drawing') {
						if (this.mode !== 'drawing') return
						const pos = this.canvas.getPointerPosition()
						const newPoints = this.free.points().concat([pos.x, pos.y])
						this.free.points(newPoints)
						this.layer.batchDraw()
					}
				} else if (this.drawType === 'angle' && this.mode === 'drawing') {
					this.updateDrag({ x: e.evt.layerX, y: e.evt.layerY })
				}
			})

			// here we create the new rect using the location and dimensions of the drawing rect.
			this.r1.on('mouseup', e => {
				// eslint-disable-next-line no-console
				console.log('mouseup')
				let shapeId = null
				// Rect
				if (this.drawType === 'rect') {
					this.mode = ''
					this.rect.visible(false)
					const newRect = new Konva.Rect({
						x: this.rect.x(),
						y: this.rect.y(),
						width: this.rect.width(),
						height: this.rect.height(),
						stroke: this.$store.getters.strokeColor,
						strokeWidth: this.$store.getters.strokeWidth,
						dash: this.$store.getters.dash,
						// listening: false,
						draggable: true,
					})
					this.layer.add(newRect)
					// undo / redo 시 해당 rect 객체를 찾기 위해 id 부여
					newRect.id(String(newRect._id))
					shapeId = String(newRect._id)
					// Circle
				} else if (this.drawType === 'circle') {
					this.mode = ''
					this.circle.visible(false)
					const newCircle = new Konva.Ellipse({
						x: this.circle.x(),
						y: this.circle.y(),
						radiusX: this.circle.radiusX(),
						radiusY: this.circle.radiusY(),
						stroke: this.$store.getters.strokeColor,
						strokeWidth: this.$store.getters.strokeWidth,
						dash: this.$store.getters.dash,
						// listening: false,
						draggable: true,
					})
					this.layer.add(newCircle)
					// undo / redo 시 해당 circle 객체를 찾기 위해 id 부여
					newCircle.id(String(newCircle._id))
					shapeId = String(newCircle._id)
					// Line
				} else if (this.drawType === 'line') {
					if (e.evt.which === 1) {
						this.mode = 'drawing'
						this.startDrag({ x: e.evt.layerX, y: e.evt.layerY })
						if (this.temp.line === null) {
							if (!this.$store.getters.arrow) {
								this.temp.line = new Konva.Line({
									points: [
										this.posStart.x,
										this.posStart.y,
										this.posNow.x,
										this.posNow.y,
									],
									stroke: this.$store.getters.strokeColor,
									strokeWidth: this.$store.getters.strokeWidth,
									dash: this.$store.getters.dash,
									draggable: false,
								})
							} else {
								this.temp.line = new Konva.Arrow({
									points: [
										this.posStart.x,
										this.posStart.y,
										this.posNow.x,
										this.posNow.y,
									],
									stroke: this.$store.getters.strokeColor,
									strokeWidth: this.$store.getters.strokeWidth,
									dash: this.$store.getters.dash,
									// listening: false,
									draggable: false,
									// tension: 1,
									pointerLength: 5,
									pointerWidth: 6,
								})
							}
							this.layer.add(this.temp.line)
						} else if (this.temp.line !== null) {
							const newPoints = this.temp.line
								.points()
								.concat([this.posNow.x, this.posNow.y])
							this.temp.line.points(newPoints)
							this.layer.batchDraw()
						}
					} else if (e.evt.which === 3) {
						// 우클릭 이벤트
						// eslint-disable-next-line no-console
						console.log('right mouseup')
						this.mode = ''
						this.line.visible(false)
						this.temp.line.draggable(true)
						// undo / redo 시 해당 line 객체를 찾기 위해 id 부여
						this.temp.line.id(String(this.temp.line._id))
						shapeId = String(this.temp.line._id)
						this.temp.line = null
					}
					// Free
				} else if (this.drawType === 'free') {
					this.mode = ''
					// undo / redo 시 해당 free 객체를 찾기 위해 id 부여
					this.free.id(String(this.free._id))
					this.free.draggable(true)
					shapeId = String(this.free._id)
					this.free = null
					// Angle
				} else if (this.drawType === 'angle') {
					// 좌클릭일 때만 그려지도록
					if (e.evt.which === 1) {
						this.mode = 'drawing'
						this.startDrag({ x: e.evt.layerX, y: e.evt.layerY })
						// 첫번째 좌표를 찍었을 때
						if (this.temp.angle.line === null) {
							this.temp.angle.group = new Konva.Group({
								draggable: true,
							})
							this.temp.angle.line = new Konva.Line({
								points: [this.posNow.x, this.posNow.y],
								stroke: this.$store.getters.strokeColor,
								strokeWidth: this.$store.getters.strokeWidth,
								dash: this.$store.getters.dash,
								id: 'angle',
							})
							// 각도 line과 각 표시 arc를 드래그 시 같이 이동시키기 위해 group에 넣어준다.
							this.temp.angle.group.add(this.temp.angle.line)
							this.layer.add(this.temp.angle.group)
							// 두번째 또는 세번째 좌표를 찍었을 때
						} else if (
							this.temp.angle.line !== null &&
							this.temp.angle.line.points().length < 7
						) {
							const newPoints = this.temp.angle.line
								.points()
								.concat([this.posNow.x, this.posNow.y])
							this.temp.angle.line.points(newPoints)
							this.layer.batchDraw()
							if (this.temp.angle.line.points().length === 6) {
								this.mode = ''
								this.angle.visible(false)
								// 각도 계산
								const angle = this.calAngle(this.temp.angle.line.points())
								// 각도 표시를 위한 함수
								this.drawAngleArc(angle, this.temp.angle.line.points())
								// 각도 텍스트 표시를 위한 함수
								this.drawAngleText(
									this.temp.angle.line.points()[2],
									this.temp.angle.line.points()[3],
									angle,
								)
								// group id 생성 및 shapeId에 group id 삽입
								this.temp.angle.group.id(String(this.temp.angle.group._id))
								shapeId = String(this.temp.angle.group._id)
								const output = document.getElementById('outputAngle')
								output.innerHTML = 'angle: ' + angle

								// 변수 초기화
								this.temp.angle.line = null
								this.temp.angle.group = null
								this.temp.angle.arc = null
								this.temp.angle.text = null
							}
						}
					}
				}
				this.canvas.draw()
				if (shapeId) this.addHistory(shapeId)
			})

			this.canvas.on('click', e => {
				const selectedDiv = document.getElementById('selected')
				this.selected =
					e.target.attrs.id === 'angle'
						? e.target.parent
						: e.target.attrs.id === 'eventArea'
						? null
						: e.target
				selectedDiv.innerHTML = this.selected
					? 'selected: ' + this.selected.attrs.id
					: 'selected: ' + null
			})

			this.layer.on('dragstart', () => {
				// eslint-disable-next-line no-console
				console.log('dragstart')
				this.drag = 'T'
			})

			this.layer.on('dragend', () => {
				// eslint-disable-next-line no-console
				console.log('dragend')
				this.drag = 'F'
			})

			// 우클릭 이벤트(메뉴 팝업) 삭제
			this.layer.on('contextmenu', e => {
				e.evt.preventDefault()
			})
		},

		startDrag(posIn) {
			this.posStart = { x: posIn.x, y: posIn.y }
			this.posNow = { x: posIn.x, y: posIn.y }
		},

		updateDrag(posIn) {
			this.posNow = { x: posIn.x, y: posIn.y }
			if (this.drawType === 'rect') {
				// update rubber rect position
				const posRect = this.reverse(this.posStart, this.posNow)
				this.rect.x(posRect.x1)
				this.rect.y(posRect.y1)
				this.rect.width(posRect.x2 - posRect.x1)
				this.rect.height(posRect.y2 - posRect.y1)
				this.rect.visible(true)
			} else if (this.drawType === 'circle') {
				// update rubber circle position
				const posCircle = this.reverse(this.posStart, this.posNow)
				this.circle.x(posCircle.x1)
				this.circle.y(posCircle.y1)
				this.circle.radiusX(posCircle.x2 - posCircle.x1)
				this.circle.radiusY(posCircle.y2 - posCircle.y1)
				this.circle.visible(true)
			} else if (this.drawType === 'line') {
				// update rubber line position
				this.line.points([
					this.posStart.x,
					this.posStart.y,
					this.posNow.x,
					this.posNow.y,
				])
				this.line.visible(true)
			} else if (this.drawType === 'angle') {
				// update rubber line position
				this.angle.points([
					this.posStart.x,
					this.posStart.y,
					this.posNow.x,
					this.posNow.y,
				])
				this.angle.visible(true)
			}

			this.canvas.draw() // redraw any changes.
		},

		// reverse co-ords if user drags left / up
		reverse(r1, r2) {
			let r1x = r1.x
			let r1y = r1.y
			let r2x = r2.x
			let r2y = r2.y
			let d = null

			if (r1x > r2x) {
				d = Math.abs(r1x - r2x)
				r1x = r2x
				r2x = r1x + d
			}
			if (r1y > r2y) {
				d = Math.abs(r1y - r2y)
				r1y = r2y
				r2y = r1y + d
			}
			return { x1: r1x, y1: r1y, x2: r2x, y2: r2y } // return the corrected rect.
		},

		addHistory(id) {
			// this.$store.state.history.push({drawType: this.drawType, hidden: "F"})
			this.$store.commit('addHistory', {
				drawType: this.drawType,
				id,
				hidden: 'F',
			})
		},

		undoHistory() {
			// eslint-disable-next-line no-console
			console.log('undoHistory')

			// history array
			const historyArray = this.$store.state.history

			// undo할 shape 의 id를 찾아서 id를 받아옴
			let undoId = null
			historyArray.reverse().some(entry => {
				if (entry.hidden === 'F') {
					historyArray.reverse()
					undoId = entry.id
					return true
				}
			})
			// 받아온 id로 history를 찾아서 hidden을 "T" 로 변경
			this.$store.commit('undoHistory', undoId)

			// canvas 에서 undo id를 검색해서 shape을 찾음
			const undoShape = this.canvas.find(`#${undoId}`)
			// 찾은 shape의 visible 값을 "false" 로 변경
			undoShape.visible(false)
			this.canvas.draw() // redraw any changes.
		},

		redoHistory() {
			// eslint-disable-next-line no-console
			console.log('redoHistory')

			// history array
			const historyArray = this.$store.state.history

			// redo할 shape 의 id를 찾아서 id를 받아옴
			let redoId = null
			historyArray.some(entry => {
				if (entry.hidden === 'T') {
					redoId = entry.id
					return true
				}
			})
			// 받아온 id로 history를 찾아서 hidden을 "T" 로 변경
			this.$store.commit('redoHistory', redoId)

			// canvas 에서 redo id를 검색해서 shape을 찾음
			const redoShape = this.canvas.find(`#${redoId}`)
			// 찾은 shape의 visible 값을 "false" 로 변경
			redoShape.visible(true)
			this.canvas.draw() // redraw any changes.
		},

		removeDrawing() {
			// layer 의 chlildren 삭제
			this.layer.destroyChildren()
			this.resizeCanvas()
		},

		removeOne() {
			if (this.selected) {
				const selectedId = this.selected.attrs.id
				const historyArray = this.$store.state.history

				this.$store.state.history = historyArray.filter(function(item) {
					return item.id !== selectedId
				})

				this.selected.remove()
				this.canvas.draw()
			}
		},

		calAngle(points) {
			// 각도 계산 함수
			const ab = Math.sqrt(
				Math.pow(points[2] - points[0], 2) + Math.pow(points[3] - points[1], 2),
			)
			const bc = Math.sqrt(
				Math.pow(points[2] - points[4], 2) + Math.pow(points[3] - points[5], 2),
			)
			const ac = Math.sqrt(
				Math.pow(points[4] - points[0], 2) + Math.pow(points[5] - points[1], 2),
			)

			const angle =
				(Math.acos((bc * bc + ab * ab - ac * ac) / (2 * bc * ab)) * 180) /
				Math.PI

			return angle
		},

		drawAngleArc(angle, anglePath) {
			// 각도 arc 그려주는 함수
			const p1 = [anglePath[0], anglePath[1]]
			const p2 = [anglePath[2], anglePath[3]]
			const p3 = [anglePath[4], anglePath[5]]
			// 각 라인 각도
			const angle1 = Math.atan2(p1[1] - p2[1], p1[0] - p2[0]) * (180 / Math.PI)
			const angle2 = Math.atan2(p3[1] - p2[1], p3[0] - p2[0]) * (180 / Math.PI)

			// 각 라인 양수 각도
			const plusAngle1 = angle1 > 0 ? angle1 : angle1 + 360
			const plusAngle2 = angle2 > 0 ? angle2 : angle2 + 360

			// 각 라인 양수 각도 크기 판별
			const smallAngle = plusAngle1 > plusAngle2 ? plusAngle2 : plusAngle1
			const largeAngle = plusAngle1 > plusAngle2 ? plusAngle1 : plusAngle2

			let rotateAngle = null

			if (largeAngle - smallAngle > 180) {
				rotateAngle = largeAngle
			} else {
				rotateAngle = smallAngle
			}

			// 평각 이상의 각도에 arc가 그려지는 것에 대한 예외 처리
			this.temp.angle.arc = new Konva.Arc({
				x: p2[0],
				y: p2[1],
				innerRadius: 20,
				outerRadius: 20,
				angle,
				rotation: rotateAngle,
				stroke: this.$store.state.drawOptions.strokeColor,
				strokeWidth: this.$store.getters.strokeWidth,
				dash: this.$store.state.drawOptions.dash,
				id: 'angle',
			})
			this.temp.angle.group.add(this.temp.angle.arc)
		},

		drawAngleText(x, y, angle) {
			this.temp.angle.text = new Konva.Text({
				text: `${angle.toFixed(1)}`,
				x,
				y,
				fontSize: 10,
				fill: this.$store.state.drawOptions.strokeColor,
				draggable: true,
			})
			this.temp.angle.group.add(this.temp.angle.text)
			this.canvas.draw()
		},

		cloneOne() {
			if (this.selected) {
				const clone = this.selected.clone({
					x: 5,
					y: 5,
				})

				this.layer.add(clone)

				console.log(this.selected)
				console.log(clone)

				this.canvas.draw()
			}
		},
	},

	data: () => ({
		canvas: null,
		layer: null,
		r1: null,
		posStart: null,
		posNow: null,
		mode: '',
		drag: 'F',
		drawType: null,
		line: null,
		rect: null,
		circle: null,
		free: null,
		angle: null,
		temp: {
			line: null,
			angle: {
				group: null,
				line: null,
				arc: null,
				text: null,
			},
		},
		selected: null,
	}),
}
</script>

<style>
.videoContainer {
	height: 365px;
	padding: 0 !important;
}

#video1 {
	width: 700px;
	height: auto;
	position: absolute;
}

#video2 {
	left: 750px;
	width: 700px;
	height: auto;
	position: absolute;
}

#canvas {
	position: absolute;
	z-index: 10;
	background-color: rgba(255, 0, 0, 0);
}

.btn {
	position: relative;
}

.pause {
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
	top: -46px;
	left: 140px;
	width: 55%;
}

.radioGroup label {
	font-size: 0.8rem;
}

.radioGroup .v-radio {
	margin-right: 8px;
}
</style>
