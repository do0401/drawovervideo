<template>
	<div></div>
</template>

<script>
import Konva from 'konva'
import { mapState } from 'vuex'

export default {
	name: 'Draw',

	props: ['videoId'],

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

	data: () => ({
		mode: '',
		drag: 'F',
		posStart: null,
		posNow: null,
		free: null,
		temp: {
			line: null,
			angle: {
				rotate: null,
				group: null,
				line: null,
				arc: null,
				text: null,
			},
		},
	}),

	methods: {
		draw() {
			console.log(this[this.videoId].stage)
			// start the rubber drawing on mouse down.
			this[this.videoId].stage.r1.on('mousedown', e => {
				if (this.$store.state.drawType === 'rect') {
					this.mode = 'drawing'
					this.startDrag({ x: e.evt.layerX, y: e.evt.layerY })
				} else if (this.$store.state.drawType === 'circle') {
					this.mode = 'drawing'
					this.startDrag({ x: e.evt.layerX, y: e.evt.layerY })
				} else if (this.$store.state.drawType === 'free') {
					this.mode = 'drawing'
					let pos = this[this.videoId].stage.canvas.getPointerPosition()
					this.free = new Konva.Line({
						points: [pos.x, pos.y],
						stroke: this.$store.getters.strokeColor,
						strokeWidth: this.$store.getters.strokeWidth,
					})
					this[this.videoId].stage.layer.add(this.free)
				}
			})

			// update the rubber rect on mouse move - note use of 'mode' var to avoid drawing after mouse released.
			this[this.videoId].stage.r1.on('mousemove', e => {
				if (this.$store.state.drawType === 'rect' && this.mode === 'drawing') {
					this.updateDrag({ x: e.evt.layerX, y: e.evt.layerY })
				} else if (
					this.$store.state.drawType === 'circle' &&
					this.mode === 'drawing'
				) {
					this.updateDrag({ x: e.evt.layerX, y: e.evt.layerY })
				} else if (
					(this.$store.state.drawType === 'line' ||
						this.$store.state.drawType === 'arrow') &&
					this.mode === 'drawing'
				) {
					this.updateDrag({ x: e.evt.layerX, y: e.evt.layerY })
				} else if (this.$store.state.drawType === 'free') {
					if (this.mode === 'drawing') {
						if (this.mode !== 'drawing') return
						const pos = this[this.videoId].stage.canvas.getPointerPosition()
						const newPoints = this.free.points().concat([pos.x, pos.y])
						this.free.points(newPoints)
						this[this.videoId].stage.layer.batchDraw()
					}
				} else if (
					this.$store.state.drawType === 'angle' &&
					this.mode === 'drawing'
				) {
					this.updateDrag({ x: e.evt.layerX, y: e.evt.layerY })
				}
			})

			// here we create the new rect using the location and dimensions of the drawing rect.
			this[this.videoId].stage.r1.on('mouseup', e => {
				// eslint-disable-next-line no-console
				console.log('mouseup')
				let shapeId = null
				// Rect
				if (this.$store.state.drawType === 'rect') {
					this.mode = ''
					this[this.videoId].stage.rect.visible(false)
					const newRect = new Konva.Rect({
						x: this[this.videoId].stage.rect.x(),
						y: this[this.videoId].stage.rect.y(),
						width: this[this.videoId].stage.rect.width(),
						height: this[this.videoId].stage.rect.height(),
						stroke: this.$store.getters.strokeColor,
						strokeWidth: this.$store.getters.strokeWidth,
						dash: this.$store.getters.dash,
						// listening: false,
						draggable: true,
					})
					this[this.videoId].stage.layer.add(newRect)
					// undo / redo 시 해당 rect 객체를 찾기 위해 id 부여
					newRect.id(String(newRect._id))
					shapeId = String(newRect._id)
					// Circle
				} else if (this.$store.state.drawType === 'circle') {
					this.mode = ''
					this[this.videoId].stage.circle.visible(false)
					const newCircle = new Konva.Ellipse({
						x: this[this.videoId].stage.circle.x(),
						y: this[this.videoId].stage.circle.y(),
						radiusX: this[this.videoId].stage.circle.radiusX(),
						radiusY: this[this.videoId].stage.circle.radiusY(),
						stroke: this.$store.getters.strokeColor,
						strokeWidth: this.$store.getters.strokeWidth,
						dash: this.$store.getters.dash,
						// listening: false,
						draggable: true,
					})
					this[this.videoId].stage.layer.add(newCircle)
					// undo / redo 시 해당 circle 객체를 찾기 위해 id 부여
					newCircle.id(String(newCircle._id))
					shapeId = String(newCircle._id)
					// Line
				} else if (
					this.$store.state.drawType === 'line' ||
					this.$store.state.drawType === 'arrow'
				) {
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
							this[this.videoId].stage.layer.add(this.temp.line)
						} else if (this.temp.line !== null) {
							const newPoints = this.temp.line
								.points()
								.concat([this.posNow.x, this.posNow.y])
							this.temp.line.points(newPoints)
							this[this.videoId].stage.layer.batchDraw()
						}
					} else if (e.evt.which === 3) {
						// 우클릭 이벤트
						// eslint-disable-next-line no-console
						console.log('right mouseup')
						this.mode = ''
						this[this.videoId].stage.line.visible(false)
						this.temp.line.draggable(true)
						// undo / redo 시 해당 line 객체를 찾기 위해 id 부여
						this.temp.line.id(String(this.temp.line._id))
						shapeId = String(this.temp.line._id)
						this.temp.line = null
					}
					// Free
				} else if (this.$store.state.drawType === 'free') {
					this.mode = ''
					// undo / redo 시 해당 free 객체를 찾기 위해 id 부여
					this.free.id(String(this.free._id))
					this.free.draggable(true)
					shapeId = String(this.free._id)
					this.free = null
					// Angle
				} else if (this.$store.state.drawType === 'angle') {
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
							this[this.videoId].stage.layer.add(this.temp.angle.group)
							// 두번째 또는 세번째 좌표를 찍었을 때
						} else if (
							this.temp.angle.line !== null &&
							this.temp.angle.line.points().length < 7
						) {
							const newPoints = this.temp.angle.line
								.points()
								.concat([this.posNow.x, this.posNow.y])
							this.temp.angle.line.points(newPoints)
							this[this.videoId].stage.layer.batchDraw()
							if (this.temp.angle.line.points().length === 6) {
								this.mode = ''
								this[this.videoId].stage.angle.visible(false)
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
								// // rotate
								// this.temp.angle.rotate = new Konva.Transformer({
								// 	node: this.temp.angle.group,
								// 	centeredScaling: true,
								// 	rotationSnaps: [0, 90, 180, 270],
								// 	resizeEnabled: false,
								// 	anchorFill: '#f6b93b',
								// 	anchorStroke: '#f6b93b',
								// 	anchorCornerRadius: 1,
								// 	anchorStrokeWidth: 2,
								// 	anchorSize: 10,
								// 	borderStroke: '#f6b93b',
								// 	borderEnabled: true,
								// })

								// this[this.videoId].stage.layer.add(this.temp.angle.rotate)

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
								this.temp.angle.rotate = null
							}
						}
					} else {
						if (!this.temp.angle.group) {
							return true
						}
						// 그리는 도중 우클릭 시 초기화
						this.mode = ''
						this[this.videoId].stage.angle.visible(false)

						this.temp.angle.group.remove()

						// 변수 초기화
						this.temp.angle.line = null
						this.temp.angle.group = null
						this.temp.angle.arc = null
						this.temp.angle.text = null
						this.temp.angle.rotate = null
					}
					// Text
				} else if (this.$store.state.drawType === 'text') {
					console.log('text')
					if (this.mode === 'edit') return
					const newText = new Konva.Text({
						text: 'Double Click',
						x: e.evt.layerX,
						y: e.evt.layerY,
						fontSize: 12,
						fill: this.$store.getters.strokeColor,
						draggable: true,
					})
					this[this.videoId].stage.layer.add(newText)
					// undo / redo 시 해당 rect 객체를 찾기 위해 id 부여
					newText.id(String(newText._id))
					shapeId = String(newText._id)

					// text 수정을 위한 이벤트 등록
					newText.on('dblclick', () => {
						console.log('dblclick')
						this.mode = 'edit'

						const textPosition = newText.getAbsolutePosition()

						// then lets find position of stage container on the page:
						const stageBox = this[this.videoId].stage.canvas
							.container()
							.getBoundingClientRect()

						// so position of textarea will be the sum of positions above:
						const areaPosition = {
							x: stageBox.left + textPosition.x,
							y: stageBox.top + textPosition.y,
						}

						// create textarea and style it
						const textarea = document.createElement('textarea')
						document.body.appendChild(textarea)

						textarea.value = newText.text()
						textarea.style.position = 'absolute'
						textarea.style.top = areaPosition.y + 'px'
						textarea.style.left = areaPosition.x + 'px'
						textarea.style.width = newText.width()
						textarea.style.zIndex = 10
						textarea.style.resize = 'none'
						textarea.style.backgroundColor = 'white'

						textarea.focus()

						textarea.addEventListener('keydown', e => {
							// hide on enter
							if (e.keyCode === 13) {
								newText.text(textarea.value)
								this.$store.state[this.videoId].stage.layer.draw()
								document.body.removeChild(textarea)
								this.mode = ''
							}
						})
					})
				}
				this[this.videoId].stage.canvas.draw()
				if (shapeId) this.addHistory(shapeId, this.videoId)
			})

			this[this.videoId].stage.canvas.on('click', e => {
				const selectedDiv = document.getElementById('selected')
				this[this.videoId].selected =
					e.target.attrs.id === 'angle'
						? e.target.parent
						: e.target.attrs.id === 'eventArea'
						? null
						: e.target
				selectedDiv.innerHTML = this[this.videoId].selected
					? 'selected: ' + this[this.videoId].selected.attrs.id
					: 'selected: ' + null
			})

			this[this.videoId].stage.canvas.on('dblclick', e => {
				console.log(e)
			})

			this[this.videoId].stage.layer.on('dragstart', () => {
				// eslint-disable-next-line no-console
				console.log('dragstart')
				this.drag = 'T'
			})

			this[this.videoId].stage.layer.on('dragend', () => {
				// eslint-disable-next-line no-console
				console.log('dragend')
				this.drag = 'F'
			})

			// 우클릭 이벤트(메뉴 팝업) 삭제
			this[this.videoId].stage.layer.on('contextmenu', e => {
				e.evt.preventDefault()
			})
		},

		startDrag(posIn) {
			this.posStart = { x: posIn.x, y: posIn.y }
			this.posNow = { x: posIn.x, y: posIn.y }
		},

		updateDrag(posIn) {
			this.posNow = { x: posIn.x, y: posIn.y }
			if (this.$store.state.drawType === 'rect') {
				// update rubber rect position
				const posRect = this.reverse(this.posStart, this.posNow)
				this[this.videoId].stage.rect.x(posRect.x1)
				this[this.videoId].stage.rect.y(posRect.y1)
				this[this.videoId].stage.rect.width(posRect.x2 - posRect.x1)
				this[this.videoId].stage.rect.height(posRect.y2 - posRect.y1)
				this[this.videoId].stage.rect.visible(true)
			} else if (this.$store.state.drawType === 'circle') {
				// update rubber circle position
				const posCircle = this.reverse(this.posStart, this.posNow)
				this[this.videoId].stage.circle.x(posCircle.x1)
				this[this.videoId].stage.circle.y(posCircle.y1)
				this[this.videoId].stage.circle.radiusX(posCircle.x2 - posCircle.x1)
				this[this.videoId].stage.circle.radiusY(posCircle.y2 - posCircle.y1)
				this[this.videoId].stage.circle.visible(true)
			} else if (
				this.$store.state.drawType === 'line' ||
				this.$store.state.drawType === 'arrow'
			) {
				// update rubber line position
				this[this.videoId].stage.line.points([
					this.posStart.x,
					this.posStart.y,
					this.posNow.x,
					this.posNow.y,
				])
				this[this.videoId].stage.line.visible(true)
			} else if (this.$store.state.drawType === 'angle') {
				// update rubber line position
				this[this.videoId].stage.angle.points([
					this.posStart.x,
					this.posStart.y,
					this.posNow.x,
					this.posNow.y,
				])
				this[this.videoId].stage.angle.visible(true)
			}

			this[this.videoId].stage.canvas.draw() // redraw any changes.
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

		addHistory(id, videoId) {
			// this.$store.state.history.push({drawType: this.$store.state.drawType, hidden: "F"})
			this.$store.commit('addHistory', {
				drawType: this.$store.state.drawType,
				id,
				hidden: 'F',
				videoId,
			})
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
				stroke: this.$store.getters.strokeColor,
				strokeWidth: this.$store.getters.strokeWidth,
				dash: this.$store.getters.dash,
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
				fill: this.$store.getters.strokeColor,
				draggable: true,
			})
			this.temp.angle.group.add(this.temp.angle.text)
			// this[this.videoId].stage.canvas.draw()
		},
	},
}
</script>
