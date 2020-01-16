const draw = (() => {
	let draw = {
		_draw: () => {
			// start the rubber drawing on mouse down.
			this.r1.on('mousedown', e => {
				if (this.$store.state.drawType === 'rect') {
					this.mode = 'drawing'
					draw._startDrag({ x: e.evt.layerX, y: e.evt.layerY })
				} else if (this.$store.state.drawType === 'circle') {
					this.mode = 'drawing'
					draw._startDrag({ x: e.evt.layerX, y: e.evt.layerY })
				} else if (this.$store.state.drawType === 'free') {
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
				if (this.$store.state.drawType === 'rect' && this.mode === 'drawing') {
					this._updateDrag({ x: e.evt.layerX, y: e.evt.layerY })
				} else if (
					this.$store.state.drawType === 'circle' &&
					this.mode === 'drawing'
				) {
					this._updateDrag({ x: e.evt.layerX, y: e.evt.layerY })
				} else if (
					this.$store.state.drawType === 'line' &&
					this.mode === 'drawing'
				) {
					this._updateDrag({ x: e.evt.layerX, y: e.evt.layerY })
				} else if (this.$store.state.drawType === 'free') {
					if (this.mode === 'drawing') {
						if (this.mode !== 'drawing') return
						const pos = this.canvas.getPointerPosition()
						const newPoints = this.free.points().concat([pos.x, pos.y])
						this.free.points(newPoints)
						this.layer.batchDraw()
					}
				} else if (
					this.$store.state.drawType === 'angle' &&
					this.mode === 'drawing'
				) {
					this._updateDrag({ x: e.evt.layerX, y: e.evt.layerY })
				}
			})

			// here we create the new rect using the location and dimensions of the drawing rect.
			this.r1.on('mouseup', e => {
				// eslint-disable-next-line no-console
				console.log('mouseup')
				let shapeId = null
				// Rect
				if (this.$store.state.drawType === 'rect') {
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
				} else if (this.$store.state.drawType === 'circle') {
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
				} else if (this.$store.state.drawType === 'line') {
					if (e.evt.which === 1) {
						this.mode = 'drawing'
						this._startDrag({ x: e.evt.layerX, y: e.evt.layerY })
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
						this._startDrag({ x: e.evt.layerX, y: e.evt.layerY })
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
								const angle = this._calAngle(this.temp.angle.line.points())
								// 각도 표시를 위한 함수
								this._drawAngleArc(angle, this.temp.angle.line.points())
								// 각도 텍스트 표시를 위한 함수
								this._drawAngleText(
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
				if (shapeId) this._addHistory(shapeId)
			})

			this.canvas.on('click', e => {
				const selectedDiv = document.getElementById('selected')
				this.$store.state.selected =
					e.target.attrs.id === 'angle'
						? e.target.parent
						: e.target.attrs.id === 'eventArea'
						? null
						: e.target
				selectedDiv.innerHTML = this.$store.state.selected
					? 'selected: ' + this.$store.state.selected.attrs.id
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

		_startDrag: posIn => {
			this.posStart = { x: posIn.x, y: posIn.y }
			this.posNow = { x: posIn.x, y: posIn.y }
		},

		_updateDrag: posIn => {
			this.posNow = { x: posIn.x, y: posIn.y }
			if (this.$store.state.drawType === 'rect') {
				// update rubber rect position
				const posRect = this._reverse(this.posStart, this.posNow)
				this.rect.x(posRect.x1)
				this.rect.y(posRect.y1)
				this.rect.width(posRect.x2 - posRect.x1)
				this.rect.height(posRect.y2 - posRect.y1)
				this.rect.visible(true)
			} else if (this.$store.state.drawType === 'circle') {
				// update rubber circle position
				const posCircle = this._reverse(this.posStart, this.posNow)
				this.circle.x(posCircle.x1)
				this.circle.y(posCircle.y1)
				this.circle.radiusX(posCircle.x2 - posCircle.x1)
				this.circle.radiusY(posCircle.y2 - posCircle.y1)
				this.circle.visible(true)
			} else if (this.$store.state.drawType === 'line') {
				// update rubber line position
				this.line.points([
					this.posStart.x,
					this.posStart.y,
					this.posNow.x,
					this.posNow.y,
				])
				this.line.visible(true)
			} else if (this.$store.state.drawType === 'angle') {
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
		_reverse: (r1, r2) => {
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

		_addHistory: id => {
			// this.$store.state.history.push({drawType: this.$store.state.drawType, hidden: "F"})
			this.$store.commit('addHistory', {
				drawType: this.$store.state.drawType,
				id,
				hidden: 'F',
			})
		},

		_calAngle: points => {
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

		_drawAngleArc: (angle, anglePath) => {
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

		_drawAngleText: (x, y, angle) => {
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
	}

	return {
		draw: () => draw._draw(),
	}
})()

export default draw
