<template>
  <v-app>
    <v-container class="videoContainer" fluid>
      <video id="video" src="../assets/videos/example.mp4" width="500" @resize="resizeCanvas"></video>
      <div id="canvas"></div>
    </v-container>
    <v-card class="toolbar" max-width="700" height="50" outlined>
      <v-container>
        <v-flex xs12>
          <v-btn class="play btn" color="#37474F" @click="play" dark small>Play</v-btn>
          <v-btn class="pause btn" color="#37474F" @click="pause" dark small>Stop</v-btn>
          <v-icon class="undo btn" color="#37474F" @click="undoHistory">mdi-undo</v-icon>
          <v-icon class="redo btn" color="#37474F" @click="redoHistory">mdi-redo</v-icon>
          <v-btn class="clear btn" color="#c0392b" @click="removeDrawing" dark small>Clear</v-btn>
          <div id="output"></div>
          <div id="outputAngle"></div>
          <!-- <v-radio-group class="radioGroup" v-model="drawType" row @change="drawInit"> -->
          <v-radio-group class="radioGroup" v-model="drawType" row>
            <v-radio label="Line" color="red" value="line"></v-radio>
            <v-radio label="Rectangle" color="red" value="rect"></v-radio>
            <v-radio label="Circle" color="red" value="circle"></v-radio>
            <v-radio label="Angle" color="red" value="angle"></v-radio>
            <v-radio label="Free" color="red" value="free"></v-radio>
          </v-radio-group>
        </v-flex>
      </v-container>
    </v-card>
    <ColorPicker/>
  </v-app>
</template>

<script>
import ColorPicker from './ColorPicker'
import Konva from 'konva'

export default {
  name: 'Draw',

  components: {
    ColorPicker
  },

  mounted () {
  },

  methods: {
    setStage (w, h) {
      // Set up the canvas and shapes
      this.canvas = new Konva.Stage({
        container: 'canvas',
        width: w,
        height: h
      })
      this.layer = new Konva.Layer({draggable: false})
      this.canvas.add(this.layer)
      // draw a background rect to catch events.
      this.r1 = new Konva.Rect({
        width: w,
        height: h,
        fill: "gold",
        id: "eventArea"
      })
      this.layer.add(this.r1)

      // draw a line to be used as the rubber area
      this.line = new Konva.Line({
        points: [],
        stroke: this.$store.state.strokeColor,
        dash: [2, 2],
        id: "lineRubberArea"
      })
      // draw a rectangle to be used as the rubber area
      this.rect = new Konva.Rect({
        x: 0,
        y: 0,
        width: 0,
        height: 0,
        stroke: this.$store.state.strokeColor,
        dash: [2, 2],
        id: "rectRubberArea"
      })
      // draw a circle to be used as the rubber area
      this.circle = new Konva.Ellipse({
        x: 0,
        y: 0,
        radiusX: 0,
        radiusY: 0,
        stroke: this.$store.state.strokeColor,
        dash: [2, 2],
        id: "circleRubberArea"
      })
      // draw a angle to be used as the rubber area
      this.angle = new Konva.Line({
        points: [],
        stroke: this.$store.state.strokeColor,
        dash: [2, 2],
        id: "angleRubberArea"
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

    resizeCanvas () {
      setTimeout(() => {
        // eslint-disable-next-line no-console
        console.log("resizeCanvas mounted")
        const video = document.getElementById("video")
        let canvas = document.getElementById("canvas")
  
        const t = video.offsetTop
        const l = video.offsetLeft
        const w = video.offsetWidth
        const h = video.offsetHeight
        
        this.setStage(w, h)

        canvas.style.top = t + "px"
        canvas.style.left = l + "px"

        this.draw()
        this.mouseMove()
      }, 500);
    },

    mouseMove () {
      const output = document.getElementById("output")

      this.canvas.on("mousemove", e => {
        let canvasx = this.r1.x()
        let canvasy = this.r1.y()
        let mousex = parseInt(e.evt.clientX - canvasx)
        let mousey = parseInt(e.evt.clientY - canvasy)

        output.innerHTML = "location: "+mousex+", "+mousey
      })
    },

    play () {
      const videoPlayer = document.getElementById("video")

      videoPlayer.play()
    },

    pause () {
      const videoPlayer = document.getElementById("video")

      videoPlayer.pause()
    },

    draw () {
      // start the rubber drawing on mouse down.
      this.r1.on("mousedown", e => {
        if (this.drawType === "rect") {
          this.mode = "drawing"
          this.startDrag({x: e.evt.layerX, y: e.evt.layerY})
        } else if (this.drawType === "circle") {
          this.mode = "drawing"
          this.startDrag({x: e.evt.layerX, y: e.evt.layerY})
        } else if (this.drawType === "free") {
          this.mode = "drawing"
          let pos = this.canvas.getPointerPosition()
          this.free = new Konva.Line({
            points: [pos.x, pos.y],
            stroke: this.$store.state.strokeColor,
            strokeWidth: this.$store.state.strokeWidth
          })
          this.layer.add(this.free)
        }
      })

      // update the rubber rect on mouse move - note use of 'mode' var to avoid drawing after mouse released.
      this.r1.on("mousemove", e => { 
        if (this.drawType === "rect" && this.mode === "drawing"){
          this.updateDrag({x: e.evt.layerX, y: e.evt.layerY})
        } else if (this.drawType === "circle" && this.mode === "drawing") {
          this.updateDrag({x: e.evt.layerX, y: e.evt.layerY})
        } else if (this.drawType === "line" && this.mode === "drawing") {
          this.updateDrag({x: e.evt.layerX, y: e.evt.layerY})
        } else if (this.drawType === "free") {
          if (this.mode === "drawing") {
            if (this.mode !== "drawing") return
            const pos = this.canvas.getPointerPosition()
            const newPoints = this.free.points().concat([pos.x, pos.y])
            this.free.points(newPoints)
            this.layer.batchDraw()
          }
        } else if (this.drawType === "angle" && this.mode === "drawing") {
          this.updateDrag({x: e.evt.layerX, y: e.evt.layerY})
        }
      })

      // here we create the new rect using the location and dimensions of the drawing rect.
      this.r1.on("mouseup", e => { 
        // eslint-disable-next-line no-console
        console.log("mouseup")
        let shapeId = null
        if (this.drawType === "rect") {
          this.mode = ''
          this.rect.visible(false)
          const newRect = new Konva.Rect({
            x: this.rect.x(),
            y: this.rect.y(),
            width: this.rect.width(),
            height: this.rect.height(),
            stroke: this.$store.state.strokeColor,
            strokeWidth: this.$store.state.strokeWidth,
            // listening: false,
            draggable: true
          })
          this.layer.add(newRect)
          // undo / redo 시 해당 rect 객체를 찾기 위해 id 부여
          newRect.id(String(newRect._id))
          shapeId = String(newRect._id)
        } else if (this.drawType === "circle") {
          this.mode = ''
          this.circle.visible(false)
          const newCircle = new Konva.Ellipse({
            x: this.circle.x(),
            y: this.circle.y(),
            radiusX: this.circle.radiusX(),
            radiusY: this.circle.radiusY(),
            stroke: this.$store.state.strokeColor,
            strokeWidth: this.$store.state.strokeWidth,
            // listening: false,
            draggable: true
          })
          this.layer.add(newCircle)
          // undo / redo 시 해당 circle 객체를 찾기 위해 id 부여
          newCircle.id(String(newCircle._id))
          shapeId = String(newCircle._id)
        } else if (this.drawType === "line") {
          if (e.evt.which === 1) {
            this.mode = "drawing"
            this.startDrag({x: e.evt.layerX, y: e.evt.layerY})
            if (this.temp.line === null) {
              this.temp.line = new Konva.Line({
                points: [this.posStart.x, this.posStart.y, this.posNow.x, this.posNow.y],
                stroke: this.$store.state.strokeColor,
                strokeWidth: this.$store.state.strokeWidth,
                // listening: false,
                draggable: false
              })
              this.layer.add(this.temp.line)
            } else if (this.temp.line !== null) {
              const newPoints = this.temp.line.points().concat([this.posNow.x, this.posNow.y])
              this.temp.line.points(newPoints)
              this.layer.batchDraw()
            }
          } else if (e.evt.which === 3) {
            // 우클릭 이벤트
            // eslint-disable-next-line no-console
            console.log("right mouseup")
            this.mode = ""
            this.line.visible(false)
            this.temp.line.draggable(true)
            // undo / redo 시 해당 line 객체를 찾기 위해 id 부여
            this.temp.line.id(String(this.temp.line._id))
            shapeId = String(this.temp.line._id)
            this.temp.line = null
          }
        } else if (this.drawType === "free") {
          this.mode = ""
          // undo / redo 시 해당 free 객체를 찾기 위해 id 부여
          this.free.id(String(this.free._id))
          this.free.draggable(true)
          shapeId = String(this.free._id)
          this.free = null
        } else if (this.drawType === "angle") {
          if (e.evt.which === 1) {
            this.mode = "drawing"
            this.startDrag({x: e.evt.layerX, y: e.evt.layerY})
            if (this.temp.angle.line === null) {
              this.temp.angle.group = new Konva.Group({
                draggable: true
              })
              this.temp.angle.line = new Konva.Line({
                points: [this.posNow.x, this.posNow.y],
                stroke: this.$store.state.strokeColor,
                strokeWidth: this.$store.state.strokeWidth,
              })
              // 각도 line과 각 표시 arc를 드래그 시 같이 이동시키기 위해 group에 넣어준다.
              this.temp.angle.group.add(this.temp.angle.line)
              this.layer.add(this.temp.angle.group)
            } else if (this.temp.angle.line !== null && this.temp.angle.line.points().length < 7) {
              const newPoints = this.temp.angle.line.points().concat([this.posNow.x, this.posNow.y])
              this.temp.angle.line.points(newPoints)
              this.layer.batchDraw()
              if (this.temp.angle.line.points().length === 6) {
                this.mode = ''
                this.angle.visible(false)
                // 각도 계산
                const angle = this.calAngle(this.temp.angle.line.points())
                // 각도 표시를 위한 함수
                this.drawAngleArc(angle, this.temp.angle.line.points())

                const output = document.getElementById("outputAngle")
                output.innerHTML = "angle: "+angle
                this.temp.angle.line = null
              }
            }
          }
        }
        this.canvas.draw()
        this.addHistory(shapeId)
      })

      this.layer.on("dragstart", e => {
        // eslint-disable-next-line no-console
        console.log("dragstart")
        // eslint-disable-next-line no-console
        console.log(e)
        this.drag = "T"
      })

      this.layer.on("dragend", e => {
        // eslint-disable-next-line no-console
        console.log("dragend")
        // eslint-disable-next-line no-console
        console.log(e.target.className)
        this.drag = "F"
      })

      this.layer.on("contextmenu", e => {
        e.evt.preventDefault()
      })
    },

    startDrag (posIn) {
      this.posStart = {x: posIn.x, y: posIn.y}
      this.posNow = {x: posIn.x, y: posIn.y}
    },

    updateDrag (posIn) {
      this.posNow = {x: posIn.x, y: posIn.y};
      if (this.drawType === "rect") {
        // update rubber rect position
        const posRect = this.reverse(this.posStart, this.posNow);
        this.rect.x(posRect.x1);
        this.rect.y(posRect.y1);
        this.rect.width(posRect.x2 - posRect.x1);
        this.rect.height(posRect.y2 - posRect.y1);
        this.rect.visible(true);  
      } else if (this.drawType === "circle") {
        // update rubber circle position
        const posCircle = this.reverse(this.posStart, this.posNow);
        this.circle.x(posCircle.x1);
        this.circle.y(posCircle.y1);
        this.circle.radiusX(posCircle.x2 - posCircle.x1);
        this.circle.radiusY(posCircle.y2 - posCircle.y1);
        this.circle.visible(true); 
      } else if (this.drawType === "line") {
        // update rubber line position
        this.line.points([this.posStart.x, this.posStart.y, this.posNow.x, this.posNow.y])
        this.line.visible(true); 
      } else if (this.drawType === "angle") {
        // update rubber line position
        this.angle.points([this.posStart.x, this.posStart.y, this.posNow.x, this.posNow.y])
        this.angle.visible(true);
      }
      
      this.canvas.draw(); // redraw any changes.
    },

    // reverse co-ords if user drags left / up
    reverse (r1, r2){
      let r1x = r1.x
      let r1y = r1.y
      let r2x = r2.x
      let r2y = r2.y
      let d = null;

      if (r1x > r2x ){
        d = Math.abs(r1x - r2x);
        r1x = r2x; r2x = r1x + d;
      }
      if (r1y > r2y ){
        d = Math.abs(r1y - r2y);
        r1y = r2y; r2y = r1y + d;
      }
      return ({x1: r1x, y1: r1y, x2: r2x, y2: r2y}); // return the corrected rect.     
    },

    addHistory (id) {
      // this.$store.state.history.push({drawType: this.drawType, hidden: "F"})
      this.$store.commit("addHistory", {drawType: this.drawType, id, hidden: "F"})
    },

    undoHistory () {
      // eslint-disable-next-line no-console
      console.log("undoHistory")

      // history array
      const historyArray = this.$store.state.history

      // undo할 shape 의 id를 찾아서 id를 받아옴
      let undoId = null
      historyArray.reverse().some(entry => {
        if (entry.hidden === "F") {
          historyArray.reverse()
          undoId = entry.id
          return true
        }
      })
      // 받아온 id로 history를 찾아서 hidden을 "T" 로 변경
      this.$store.commit("undoHistory", undoId)

      // canvas 에서 undo id를 검색해서 shape을 찾음
      const undoShape = this.canvas.find(`#${undoId}`)
      // 찾은 shape의 visible 값을 "false" 로 변경
      undoShape.visible(false)
      this.canvas.draw(); // redraw any changes.
    },

    redoHistory () {
      // eslint-disable-next-line no-console
      console.log("redoHistory")
      
      // history array
      const historyArray = this.$store.state.history

      // redo할 shape 의 id를 찾아서 id를 받아옴
      let redoId = null
      historyArray.some(entry => {
        if (entry.hidden === "T") {
          redoId = entry.id
          return true
        }
      })
      // 받아온 id로 history를 찾아서 hidden을 "T" 로 변경
      this.$store.commit("redoHistory", redoId)

      // canvas 에서 redo id를 검색해서 shape을 찾음
      const redoShape = this.canvas.find(`#${redoId}`)
      // 찾은 shape의 visible 값을 "false" 로 변경
      redoShape.visible(true)
      this.canvas.draw(); // redraw any changes.
    },

    removeDrawing () {
      // layer 의 chlildren 삭제
      this.layer.destroyChildren()
      this.resizeCanvas()
      // this.$store.commit("initStorage")

      // this.drawInit()
    },

    calAngle (points) {
      // 각도 계산 함수
      const ab = Math.sqrt(Math.pow(points[2] - points[0], 2) + Math.pow(points[3] - points[1], 2))
      const bc = Math.sqrt(Math.pow(points[2] - points[4], 2) + Math.pow(points[3] - points[5], 2))
      const ac = Math.sqrt(Math.pow(points[4] - points[0], 2) + Math.pow(points[5] - points[1], 2))

      const angle = (Math.acos((bc * bc + ab * ab - ac * ac) / (2 * bc * ab)) * 180) / Math.PI

      return angle
    },

    drawAngleArc (angle, anglePath) {
      const p1 = [anglePath[0], anglePath[1]]
      const p2 = [anglePath[2], anglePath[3]]
      const p3 = [anglePath[4], anglePath[5]]
      // 각 라인 각도
      const angle1 = Math.atan2(p1[1] - p2[1], p1[0] - p2[0])*(180/Math.PI)
      const angle2 = Math.atan2(p3[1] - p2[1], p3[0] - p2[0])*(180/Math.PI)

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
        stroke: this.$store.state.strokeColor,
        strokeWidth: this.$store.state.strokeWidth
      })
      this.temp.angle.group.add(this.temp.angle.arc)
      this.layer.add(this.temp.angle.group)
      this.canvas.add(this.layer)
      this.canvas.draw()

      this.temp.angle.group = null
      this.temp.angle.arc = null
    },

    // drawInit () {
    //   this.angle.path = null
    //   this.angle.arc = null
    //   this.angle.p1 = null
    //   this.angle.p2 = null
    //   this.angle.p3 = null

    //   this.line = null
    //   this.rect = null
    //   this.circle = null
    //   this.free = null

    //   this.temp.line = null
    //   this.temp.rect = null
    //   this.temp.circle = null
    //   this.temp.free = []

    //   // layer 의 chlildren 삭제
    //   this.layer.destroyChildren()
    //   this.canvas.draw()
    // },

    // drawLine (mousex, mousey) {
    //   // state 에 그려지는 line 정보를 지속적으로 업데이트
    //   // 마지막에 state 에 저장된 정보를 마우스 우클릭 이벤트에서 state.storage 에 저장함
    //   if (this.temp.line === null) {
    //     this.temp.line = [mousex, mousey]
    //   } else {
    //     this.temp.line.push(mousex)
    //     this.temp.line.push(mousey)
    //     if (this.line !== null) {
    //       this.line.remove()
    //     }
        
    //     this.line = new Konva.Line({
    //       points: this.temp.line,
    //       stroke: this.$store.state.strokeColor,
    //       strokeWidth: this.$store.state.strokeWidth,
    //       lineCap: 'round',
    //       lineJoin: 'round',
    //       draggable: true
    //     })

    //     this.layer.add(this.line)
    //     this.canvas.add(this.layer)
    //   }
    // },

    // drawRect (mousex, mousey, lastMousex, lastMousey) {
    //   if (this.rect !== null) {
    //     this.rect.remove()
    //   }
    //   let width = mousex - lastMousex
    //   let height = mousey - lastMousey

    //   this.rect = new Konva.Rect({
    //     x: lastMousex,
    //     y: lastMousey,
    //     width,
    //     height,
    //     stroke: this.$store.state.strokeColor,
    //     strokeWidth: this.$store.state.strokeWidth,
    //     draggable: true
    //   })

    //   // state 에 그려지는 rect 정보를 지속적으로 업데이트
    //   // 마지막에 state 에 저장된 정보를 mouseup 이벤트에서 state.storage 에 저장함
    //   this.temp.rect = [lastMousex, lastMousey, width, height]

    //   this.layer.add(this.rect)
    //   this.layer.remove()
    // },

    // drawCircle (mousex, mousey, lastMousex, lastMousey) {
    //   if (this.circle !== null) {
    //     this.circle.remove()
    //   }

    //   // Dynamic scaling
    //   let scalex = Math.abs(mousex - lastMousex)
    //   let scaley = Math.abs(mousey - lastMousey)

    //   this.circle = new Konva.Ellipse({
    //     x: lastMousex,
    //     y: lastMousey,
    //     radiusX: scalex,
    //     radiusY: scaley,
    //     stroke: this.$store.state.strokeColor,
    //     strokeWidth: this.$store.state.strokeWidth,
    //     draggable: true
    //   })

    //   this.layer.add(this.circle)
    //   this.canvas.add(this.layer)

    //   // state 에 그려지는 ciricle 정보를 지속적으로 업데이트
    //   // 마지막에 state 에 저장된 정보를 mouseup 이벤트에서 state.storage 에 저장함
    //   this.temp.circle = [scalex, scaley, lastMousex, lastMousey]
    // },

    // drawFree (mousedown) {
    //   if (!mousedown) {
    //     return;
    //   }

    //   const pos = this.canvas.getPointerPosition()

    //   const newPoints = this.free.points().concat([pos.x, pos.y])
    //   this.free.points(newPoints)
    //   this.layer.batchDraw()

    //   // state 에 그려지는 free line 정보를 지속적으로 업데이트
    //   // 마지막에 state 에 저장된 정보를 mouseup 이벤트에서 state.storage 에 저장함
    //   this.temp.free = this.free.points()
    // },

    // drawAngle (mousex, mousey) {
    //   // state 에 그려지는 line 정보를 지속적으로 업데이트
    //   // 마지막에 state 에 저장된 정보를 마우스 우클릭 이벤트에서 state.storage 에 저장함
    //   if (this.angle.p1 === null) {
    //     this.angle.p1 = [mousex, mousey]
    //     this.temp.angle = [mousex, mousey]
    //   } else if (this.angle.p2 === null) {
    //     this.angle.p2 = [mousex, mousey]
    //     this.temp.angle.push(mousex)
    //     this.temp.angle.push(mousey)
    //   } else if (this.angle.p3 === null) {
    //     this.angle.p3 = [mousex, mousey]
    //     this.temp.angle.push(mousex)
    //     this.temp.angle.push(mousey)
    //   } else {
    //     this.angle.p1 = [mousex, mousey]
    //     this.angle.p2 = null
    //     this.angle.p3 = null
    //     this.temp.angle = [mousex, mousey]
    //   }

    //   this.angle.path = new Konva.Line({
    //     points: this.temp.angle,
    //     stroke: this.$store.state.strokeColor,
    //     strokeWidth: this.$store.state.strokeWidth,
    //     lineCap: 'round',
    //     lineJoin: 'round',
    //     draggable: true
    //   })

    //   this.layer.add(this.angle.path)
    //   this.canvas.add(this.layer)

    //   if (this.angle.p3) {
    //     const angle = this.calAngle(this.angle.p1, this.angle.p2, this.angle.p3)

    //     // 각도 표시를 위한 함수
    //     this.drawAngleArc(angle, [...this.angle.p1, ...this.angle.p2, ...this.angle.p3])

    //     // state 에 그려지는 각도 정보를 지속적으로 업데이트
    //     this.$store.commit("pushAngle", {location: [[...this.angle.p1, ...this.angle.p2, ...this.angle.p3], angle], hidden: "F", strokeColor: this.$store.state.strokeColor, strokeWidth: this.$store.state.strokeWidth})
    //     this.addHistory()

    //     // this.redraw()
        
    //     const output = document.getElementById("outputAngle")
    //     output.innerHTML = "angle: "+angle
    //   }
    // },

    // drawAngleArc (angle, anglePath) {
    //   const p1 = [anglePath[0], anglePath[1]]
    //   const p2 = [anglePath[2], anglePath[3]]
    //   const p3 = [anglePath[4], anglePath[5]]
    //   // 각 라인 각도
    //   const angle1 = Math.atan2(p1[1] - p2[1], p1[0] - p2[0])*(180/Math.PI)
    //   const angle2 = Math.atan2(p3[1] - p2[1], p3[0] - p2[0])*(180/Math.PI)

    //   // 각 라인 양수 각도
    //   const plusAngle1 = angle1 > 0 ? angle1 : angle1 + 360
    //   const plusAngle2 = angle2 > 0 ? angle2 : angle2 + 360

    //   // 각 라인 양수 각도 크기 판별
    //   const smallAngle = plusAngle1 > plusAngle2 ? plusAngle2 : plusAngle1
    //   const largeAngle = plusAngle1 > plusAngle2 ? plusAngle1 : plusAngle2

    //   let rotateAngle = null

    //   if (largeAngle - smallAngle > 180) {
    //     rotateAngle = largeAngle
    //   } else {
    //     rotateAngle = smallAngle
    //   }

    //   // 평각 이상의 각도에 arc가 그려지는 것에 대한 예외 처리
    //   this.angle.arc = new Konva.Arc({
    //     x: p2[0],
    //     y: p2[1],
    //     innerRadius: 20,
    //     outerRadius: 20,
    //     angle,
    //     rotation: rotateAngle,
    //     stroke: this.$store.state.strokeColor,
    //     strokeWidth: this.$store.state.strokeWidth
    //   })
      
    //   this.layer.add(this.angle.arc)
    //   this.canvas.add(this.layer)
    // },

    // calAngle (p1, p2, p3) {
    //   // 각도 계산 함수
    //   const ab = Math.sqrt(Math.pow(p2[0] - p1[0], 2) + Math.pow(p2[1] - p1[1], 2))
    //   const bc = Math.sqrt(Math.pow(p2[0] - p3[0], 2) + Math.pow(p2[1] - p3[1], 2))
    //   const ac = Math.sqrt(Math.pow(p3[0] - p1[0], 2) + Math.pow(p3[1] - p1[1], 2))

    //   const angle = (Math.acos((bc * bc + ab * ab - ac * ac) / (2 * bc * ab)) * 180) / Math.PI

    //   return angle
    // },

    // addHistory () {
    //   // this.$store.state.history.push({drawType: this.drawType, hidden: "F"})
    //   this.$store.commit("addHistory", {drawType: this.drawType, hidden: "F"})
    // },

    // undoHistory () {
    //   this.$store.commit("undoHistory")

    //   // layer 의 chlildren 삭제
    //   this.layer.destroyChildren()
    //   this.canvas.draw()

    //   this.drawInit()
    // },

    // redoHistory () {
    //   this.$store.commit("redoHistory")

    //   // layer 의 chlildren 삭제
    //   this.layer.destroyChildren()
    //   this.canvas.draw()

    //   this.drawInit()
    // },

    // removeDrawing () {
    //   // layer 의 chlildren 삭제
    //   this.layer.destroyChildren()
    //   this.canvas.draw()

    //   this.$store.commit("initStorage")

    //   this.drawInit()
    // },

    // redraw () {
    //   // eslint-disable-next-line no-console
    //   console.log("redraw")

    //   // layer 의 chlildren 삭제
    //   this.layer.destroyChildren()

    //   // 저장된 line 이 있으면 다시 그려주는 코드
    //   if (this.$store.getters.lineStorage !== null) {
    //     this.$store.getters.lineStorage.forEach(entry => {
    //       if (entry.hidden === "F") {
    //         this.line = new Konva.Line({
    //           points: entry.location,
    //           stroke: entry.strokeColor,
    //           strokeWidth: entry.strokeWidth,
    //           lineCap: 'round',
    //           lineJoin: 'round'
    //         })

    //         this.layer.add(this.line)
    //         this.canvas.add(this.layer)
    //       }
    //     });
    //   }

    //   // 저장된 rectangle 이 있으면 다시 그려주는 코드
    //   if (this.$store.getters.rectStorage !== []) {
    //     this.$store.getters.rectStorage.forEach(entry => {
    //       if (entry.hidden === "F") {
    //         this.rect = new Konva.Rect({
    //           x: entry.location[0],
    //           y: entry.location[1],
    //           width: entry.location[2],
    //           height: entry.location[3],
    //           stroke: entry.strokeColor,
    //           strokeWidth: entry.strokeWidth,
    //           draggable: true
    //         })

    //         this.layer.add(this.rect)
    //         this.canvas.add(this.layer)
    //       }
    //     });
    //   }

    //   // 저장된 circle 이 있으면 다시 그려주는 코드
    //   if (this.$store.getters.cirStorage !== []) {
    //     this.$store.getters.cirStorage.forEach(entry => {
    //       if (entry.hidden === "F") {
    //         this.circle = new Konva.Ellipse({
    //           x: entry.location[2],
    //           y: entry.location[3],
    //           radiusX: entry.location[0],
    //           radiusY: entry.location[1],
    //           stroke: entry.strokeColor,
    //           strokeWidth: entry.strokeWidth
    //         })

    //         this.layer.add(this.circle)
    //         this.canvas.add(this.layer)
    //       }
    //     });
    //   }

    //   // 저장된 free line 이 있으면 다시 그려주는 코드
    //   if (this.$store.getters.freeStorage !== []) {
    //     this.$store.getters.freeStorage.forEach(entry => {
    //       if (entry.hidden === "F") {
    //         this.free = new Konva.Line({
    //           points: entry.location,
    //           stroke: entry.strokeColor,
    //           strokeWidth: entry.strokeWidth,
    //           lineCap: 'round',
    //           lineJoin: 'round'
    //         })

    //         this.layer.add(this.free)
    //         this.canvas.add(this.layer)
    //       }
    //     });
    //   }

    //   // 저장된 angle 이 있으면 다시 그려주는 코드
    //   if (this.$store.getters.angleStorage !== []) {
    //     this.$store.getters.angleStorage.forEach(entry => {
    //       if (entry.hidden === "F") {
    //         this.angle.path = new Konva.Line({
    //           points: entry.location[0],
    //           stroke: entry.strokeColor,
    //           strokeWidth: entry.strokeWidth,
    //           lineCap: 'round',
    //           lineJoin: 'round'
    //         })

    //         // 각도 표시를 위한 함수
    //         this.drawAngleArc(entry.location[1], entry.location[0])

    //         this.layer.add(this.angle.path)
    //         this.canvas.add(this.layer)
    //       }
    //     });
    //   }
    //   this.canvas.draw()
    // },

    // dragEvent () {
    //   if (this.layer) {
    //     this.layer.on("dragstart", e => {
    //       // eslint-disable-next-line no-console
    //       console.log("dragstart")
    //       // eslint-disable-next-line no-console
    //       console.log(e.target)
    //     })
    //   }
    // },

  //   draw () {
  //     // eslint-disable-next-line no-console
  //     console.log("draw mounted")

  //     // Stage
  //     const canvas = document.getElementById("canvas")
      
  //     // Variable
  //     let lastMousex = 0
  //     let lastMousey = 0
  //     let mousex = 0
  //     let mousey = 0
  //     let mousedown = false
  //     // let drag = false

  //     // this.dragEvent()
  //     this.layer.on("dragstart", e => {
  //       // eslint-disable-next-line no-console
  //       console.log("dragstart")
  //       // eslint-disable-next-line no-console
  //       console.log(e.target)
  //       e.target.moveToTop();
  //       this.layer.draw();
  //       // eslint-disable-next-line no-console
  //       console.log(this.layer)
  //     })
        
  //     this.canvas.on("mousedown", e => {
  //       mousedown = true
  //       let canvasx = canvas.offsetLeft
  //       let canvasy = canvas.offsetTop
        
  //       lastMousex = parseInt(e.evt.clientX - canvasx)
  //       lastMousey = parseInt(e.evt.clientY - canvasy)

  //       // 자유 그리기
  //       if (this.drawType === "free") {
  //         if (mousedown) {
  //           let pos = this.canvas.getPointerPosition()

  //           this.free = new Konva.Line({
  //             stroke: this.$store.state.strokeColor,
  //             strokeWidth: this.$store.state.strokeWidth,
  //             points: [pos.x, pos.y]
  //           })
            
  //           this.layer.add(this.free)

  //           // state 에 그려지는 free line 정보를 지속적으로 업데이트
  //           // 마지막에 state 에 저장된 정보를 mouseup 이벤트에서 state.storage 에 저장함
  //           this.temp.free.push([lastMousex, lastMousey, mousex, mousey])
  //         }
  //       }
  //     })

  //     this.canvas.on("mouseup", () => {
  //       mousedown = false
  //       if (this.temp.rect !== null) {
  //         this.layer.add(this.rect)
  //         this.canvas.add(this.layer)

  //         this.$store.commit("pushRect", {location: this.temp.rect, hidden: "F", strokeColor: this.$store.state.strokeColor, strokeWidth: this.$store.state.strokeWidth})
  //         this.addHistory()
  //         this.temp.rect = null
  //         this.redraw()
  //       } else if (this.temp.circle !== null) {
  //         this.$store.commit("pushCircle", {location: this.temp.circle, hidden: "F", strokeColor: this.$store.state.strokeColor, strokeWidth: this.$store.state.strokeWidth})
  //         this.addHistory()
  //         this.temp.circle = null
  //         // this.redraw()
  //       } else if (this.temp.free.length !== 0) {
  //         this.$store.commit("pushFree", {location: this.temp.free, hidden: "F", strokeColor: this.$store.state.strokeColor, strokeWidth: this.$store.state.strokeWidth})
  //         this.addHistory()
  //         this.temp.free = []
  //         // this.redraw()
  //       }
  //     })

  //     // 우클릭 팝업 이벤트 삭제
  //     this.canvas.on("contextmenu", e => {
  //       e.evt.preventDefault();
  //     })

  //     this.canvas.on("click", e => {
  //       // e.evt.which 가 1 이면 좌클릭, 3 이면 우클릭
  //       if (e.evt.which === 1) {
  //         let canvasx = canvas.offsetLeft
  //         let canvasy = canvas.offsetTop
  //         mousex = parseInt(e.evt.clientX - canvasx)
  //         mousey = parseInt(e.evt.clientY - canvasy)
  
  //         // 라인 그리기
  //         if (this.drawType === "line") {
  //           this.drawLine(mousex, mousey)
  //         }
  
  //         // 각도 확인
  //         if (this.drawType === "angle") {
  //           this.drawAngle(mousex, mousey)
  //         }
  //       } else {
  //         if (this.drawType === "line" && this.temp.line !== null) {
  //           this.$store.commit("pushLine", {location: this.temp.line, hidden: "F", strokeColor: this.$store.state.strokeColor, strokeWidth: this.$store.state.strokeWidth})
  //           this.addHistory()
  //           this.temp.line = null
  //           // this.redraw()
  //         }
  //       }
  //     })

  //     this.canvas.on("mousemove", e => {
  //       let canvasx = canvas.offsetLeft
  //       let canvasy = canvas.offsetTop
  //       if (this.drawType === "free") {
  //         lastMousex = mousex
  //         lastMousey = mousey
  //       }
  //       mousex = parseInt(e.evt.clientX - canvasx)
  //       mousey = parseInt(e.evt.clientY - canvasy)
  //       // 사각형 그리기
  //       if (this.drawType === "rect") {
  //         if (mousedown) {
  //           // eslint-disable-next-line no-console
  //           console.log("mousemove rect in")
  //           this.drawRect(mousex, mousey, lastMousex, lastMousey)
  //         }
  //       }

  //       // 원 그리기
  //       if (this.drawType === "circle") {
  //         if (mousedown) {
  //           this.drawCircle(mousex, mousey, lastMousex, lastMousey)
  //         }
  //       }

  //       // 자유 그리기
  //       if (this.drawType === "free") {
  //         if (mousedown) {
  //           this.drawFree(mousex, mousey, lastMousex, lastMousey)
  //         }
  //       }
  //     })
  //   }
  },

  data: () => ({
    canvas: null,
    layer: null,
    r1: null,
    posStart: null,
    posNow: null,
    mode: "",
    drag: "F",
    drawType: null,
    line: null,
    rect: null,
    circle: null,
    free: null,
    angle: null,
    
    angleGroup: null,
    temp: {
      line: null,
      rect: null,
      circle: null,
      angle: {
        group: null,
        line: null,
        arc: null
      },
      free: []
    }
  })
};
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

  #output {
    position: absolute;
    top: -30px;
    left: 700px;
    font-size: 0.7rem;
    color: black;
  }

  #outputAngle {
    position: absolute;
    top: -80px;
    left: 700px;
    font-size: 0.7rem;
    color: black;
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