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
          <!-- <v-icon class="undo btn" color="#37474F" @click="undoHistory">mdi-undo</v-icon>
          <v-icon class="redo btn" color="#37474F" @click="redoHistory">mdi-redo</v-icon>
          <v-btn class="clear btn" color="#c0392b" @click="removeDrawing" dark small>Clear</v-btn> -->
          <div id="output"></div>
          <div id="outputAngle"></div>
          <v-radio-group class="radioGroup" v-model="drawType" row @change="drawInit">
            <v-radio label="Line" color="red" value="line"></v-radio>
            <v-radio label="Rectangle" color="red" value="rect"></v-radio>
            <v-radio label="Circle" color="red" value="circle"></v-radio>
            <v-radio label="Angle" color="red" value="angle"></v-radio>
            <v-radio label="Free" color="red" value="free"></v-radio>
          </v-radio-group>
        </v-flex>
      </v-container>
    </v-card>
    <!-- <ColorPicker/> -->
  </v-app>
</template>

<script>
// import ColorPicker from './ColorPicker'
import Konva from 'konva'

export default {
  name: 'Draw',

  // components: {
  //   ColorPicker
  // },

  mounted () {
    this.mouseMove()
    this.draw()
  },

  methods: {
    resizeCanvas () {
        const video = document.getElementById("video")

        // const t = video.offsetTop+"px"
        // const l = video.offsetLeft+"px"
        const w = video.offsetWidth
        const h = video.offsetHeight
        
        this.canvas = new Konva.Stage({
          container: 'canvas'
        })

        // stage.offsetX(l)
        // stage.offsetY(t)
        this.canvas.width(w)
        this.canvas.height(h)

        this.layer = new Konva.Layer()
        this.canvas.add(this.layer)
    },

    play () {
      const videoPlayer = document.getElementById("video")

      videoPlayer.play()
    },

    pause () {
      const videoPlayer = document.getElementById("video")

      videoPlayer.pause()
    },

    mouseMove () {
      const canvas = document.getElementById("canvas")
      const output = document.getElementById("output")

      canvas.addEventListener("mousemove", e => {
        let canvasx = canvas.offsetLeft
        let canvasy = canvas.offsetTop
        let mousex = parseInt(e.clientX - canvasx)
        let mousey = parseInt(e.clientY - canvasy)

        output.innerHTML = "location: "+mousex+", "+mousey
      })
    },

    drawInit () {
      this.lineFrom = null
      this.lineTo = null
      this.angle.p1 = null
      this.angle.p2 = null
      this.angle.p3 = null

      // this.redraw()
    },

    drawLine (mousex, mousey) {
      // state 에 그려지는 line 정보를 지속적으로 업데이트
      // 마지막에 state 에 저장된 정보를 마우스 우클릭 이벤트에서 state.storage 에 저장함
      if (this.temp.line === null) {
        this.temp.line = [mousex, mousey]
      } else {
        this.temp.line.push(mousex)
        this.temp.line.push(mousey)
        if (this.line !== null) {
          this.line.remove()
        }
        
        this.line = new Konva.Line({
          points: this.temp.line,
          stroke: this.$store.state.strokeColor,
          strokeWidth: this.$store.state.strokeWidth,
          lineCap: 'round',
          lineJoin: 'round'
        })

        this.layer.add(this.line)
        this.canvas.add(this.layer)
      }
    },

    drawRect (mousex, mousey, lastMousex, lastMousey) {
      if (this.rect !== null) {
        this.rect.remove()
      }

      let width = mousex - lastMousex
      let height = mousey - lastMousey

      this.rect = new Konva.Rect({
        x: lastMousex,
        y: lastMousey,
        width,
        height,
        stroke: this.$store.state.strokeColor,
        strokeWidth: this.$store.state.strokeWidth
      })

      // state 에 그려지는 rect 정보를 지속적으로 업데이트
      // 마지막에 state 에 저장된 정보를 mouseup 이벤트에서 state.storage 에 저장함
      this.temp.rect = [lastMousex, lastMousey, width, height]

      this.layer.add(this.rect)
      this.canvas.add(this.layer)

      // 저장된 rectangle 이 있으면 다시 그려주는 코드
      // this.redraw()
    },

    drawCircle (mousex, mousey, lastMousex, lastMousey) {
      if (this.circle !== null) {
        this.circle.remove()
      }

      // Dynamic scaling
      let scalex = Math.abs(mousex - lastMousex)
      let scaley = Math.abs(mousey - lastMousey)

      this.circle = new Konva.Ellipse({
        x: lastMousex,
        y: lastMousey,
        radiusX: scalex,
        radiusY: scaley,
        stroke: this.$store.state.strokeColor,
        strokeWidth: this.$store.state.strokeWidth
      })

      this.layer.add(this.circle)
      this.canvas.add(this.layer)

      // state 에 그려지는 ciricle 정보를 지속적으로 업데이트
      // 마지막에 state 에 저장된 정보를 mouseup 이벤트에서 state.storage 에 저장함
      this.temp.circle = [scalex, scaley, lastMousex, lastMousey]

      // 저장된 circle 이 있으면 다시 그려주는 코드
      // this.redraw()
    },

    drawFree (mousedown) {
      if (!mousedown) {
        return;
      }

      const pos = this.canvas.getPointerPosition()

      const newPoints = this.free.points().concat([pos.x, pos.y])
      this.free.points(newPoints)
      this.layer.batchDraw()

      // state 에 그려지는 free line 정보를 지속적으로 업데이트
      // 마지막에 state 에 저장된 정보를 mouseup 이벤트에서 state.storage 에 저장함
      this.temp.free = this.free.points()
    },

    drawAngle (mousex, mousey) {
      // state 에 그려지는 line 정보를 지속적으로 업데이트
      // 마지막에 state 에 저장된 정보를 마우스 우클릭 이벤트에서 state.storage 에 저장함
      if (this.angle.p1 === null) {
        this.angle.p1 = [mousex, mousey]
        this.temp.angle = [mousex, mousey]
      } else if (this.angle.p2 === null) {
        this.angle.p2 = [mousex, mousey]
        this.temp.angle.push(mousex)
        this.temp.angle.push(mousey)
      } else if (this.angle.p3 === null) {
        this.angle.p3 = [mousex, mousey]
        this.temp.angle.push(mousex)
        this.temp.angle.push(mousey)
      } else {
        this.angle.p1 = [mousex, mousey]
        this.angle.p2 = null
        this.angle.p3 = null
        this.temp.angle = [mousex, mousey]
      }

      this.angle.path = new Konva.Line({
        points: this.temp.angle,
        stroke: this.$store.state.strokeColor,
        strokeWidth: this.$store.state.strokeWidth,
        lineCap: 'round',
        lineJoin: 'round'
      })

      this.layer.add(this.angle.path)
      this.canvas.add(this.layer)

      if (this.angle.p3) {
        const angle = this.calAngle(this.angle.p1, this.angle.p2, this.angle.p3)

        // 각도 표시를 위한 함수
        this.drawAngleArc(angle, this.angle.p1, this.angle.p2, this.angle.p3)

        // // state 에 그려지는 각도 정보를 지속적으로 업데이트
        // this.$store.commit("pushAngle", {location: [this.angle.p1, this.angle.p2, this.angle.p3, angle], hidden: "F", strokeColor: this.$store.state.strokeColor, strokeWidth: this.$store.state.strokeWidth})
        // this.addHistory()
        
        const output = document.getElementById("outputAngle")
        output.innerHTML = "angle: "+angle
      }
    },

    drawAngleArc (angle, p1, p2, p3) {
      // 각 라인 각도
      const angle1 = Math.atan2(p1[1] - p2[1], p1[0] - p2[0])*(180/Math.PI)
      const angle2 = Math.atan2(p3[1] - p2[1], p3[0] - p2[0])*(180/Math.PI)

      // 각 라인 양수 각도
      const plusAngle1 = angle1 > 0 ? angle1 : angle1 + 360
      const plusAngle2 = angle2 > 0 ? angle2 : angle2 + 360

      // 각 라인 양수 각도 크기 판별
      const smallAngle = plusAngle1 > plusAngle2 ? plusAngle2 : plusAngle1
      const largeAngle = plusAngle1 > plusAngle2 ? plusAngle1 : plusAngle2

      // 평각 이상의 각도에 arc가 그려지는 것에 대한 예외 처리
      if (largeAngle - smallAngle > 180) {
        this.angle.arc = new Konva.Arc({
          x: p2[0],
          y: p2[1],
          innerRadius: 20,
          outerRadius: 20,
          angle,
          rotation: largeAngle,
          stroke: this.$store.state.strokeColor,
          strokeWidth: this.$store.state.strokeWidth
        })
      } else {
        this.angle.arc = new Konva.Arc({
          x: p2[0],
          y: p2[1],
          innerRadius: 20,
          outerRadius: 20,
          angle,
          rotation: smallAngle,
          stroke: this.$store.state.strokeColor,
          strokeWidth: this.$store.state.strokeWidth
        })
      }
      
      this.layer.add(this.angle.arc)
      this.canvas.add(this.layer)
    },

    calAngle (p1, p2, p3) {
      // 각도 계산 함수
      const ab = Math.sqrt(Math.pow(p2[0] - p1[0], 2) + Math.pow(p2[1] - p1[1], 2))
      const bc = Math.sqrt(Math.pow(p2[0] - p3[0], 2) + Math.pow(p2[1] - p3[1], 2))
      const ac = Math.sqrt(Math.pow(p3[0] - p1[0], 2) + Math.pow(p3[1] - p1[1], 2))

      const angle = (Math.acos((bc * bc + ab * ab - ac * ac) / (2 * bc * ab)) * 180) / Math.PI

      return angle
    },

    // addHistory () {
    //   // this.$store.state.history.push({drawType: this.drawType, hidden: "F"})
    //   this.$store.commit("addHistory", {drawType: this.drawType, hidden: "F"})
    // },

    // undoHistory () {
    //   // Canvas
    //   const canvas = document.getElementById("canvas")
    //   const ctx = canvas.getContext("2d")

    //   this.$store.commit("undoHistory")

    //   ctx.clearRect(0, 0, canvas.width, canvas.height);
    //   this.redraw()
    // },

    // redoHistory () {
    //   // Canvas
    //   const canvas = document.getElementById("canvas")
    //   const ctx = canvas.getContext("2d")

    //   this.$store.commit("redoHistory")

    //   ctx.clearRect(0, 0, canvas.width, canvas.height);
    //   this.redraw()
    // },

    // redraw () {
    //   // Canvas
    //   const canvas = document.getElementById("canvas")
    //   const ctx = canvas.getContext("2d")

    //   // 저장된 line 이 있으면 다시 그려주는 코드
    //   if (this.$store.getters.lineStorage !== null) {
    //     this.$store.getters.lineStorage.forEach(entry => {
    //       if (entry.hidden === "F") {
    //         let p1 = null
    //         let p2 = null
    //         entry.location.forEach(locEntry => {
    //           if (p1 === null) {
    //             p1 = locEntry
    //           } else if (p1 !== null && p2 === null) {
    //             p2 = locEntry
    //           } else if (p1 !== null && p2 !== null) {
    //             p1 = [...p2]
    //             p2 = locEntry
    //           }

    //           if (p1 !== null && p2 !== null) {
    //             ctx.beginPath()
    //             ctx.moveTo(p1[0], p1[1])
    //             ctx.lineTo(p2[0], p2[1])
    //             ctx.strokeStyle = entry.strokeColor
    //             ctx.lineWidth = entry.strokeWidth
    //             ctx.lineJoin = ctx.lineCap = "round"
    //             ctx.stroke()
    //           }
    //         })
    //       }
    //     });
    //   }

    //   // 저장된 angle 이 있으면 다시 그려주는 코드
    //   if (this.$store.getters.angleStorage !== []) {
    //     this.$store.getters.angleStorage.forEach(entry => {
    //       if (entry.hidden === "F") {
    //         ctx.beginPath()
    //         ctx.moveTo(entry.location[0][0], entry.location[0][1])
    //         ctx.lineTo(entry.location[1][0], entry.location[1][1])
    //         ctx.moveTo(entry.location[1][0], entry.location[1][1])
    //         ctx.lineTo(entry.location[2][0], entry.location[2][1])
    //         ctx.strokeStyle = entry.strokeColor
    //         ctx.lineWidth = entry.strokeWidth
    //         ctx.stroke()
    //       }
    //     });
    //   }

    //   // 저장된 rectangle 이 있으면 다시 그려주는 코드
    //   if (this.$store.getters.rectStorage !== []) {
    //     this.$store.getters.rectStorage.forEach(entry => {
    //       if (entry.hidden === "F") {
    //         ctx.beginPath()
    //         ctx.rect(entry.location[0], entry.location[1], entry.location[2], entry.location[3])
    //         ctx.strokeStyle = entry.strokeColor
    //         ctx.lineWidth = entry.strokeWidth
    //         ctx.stroke()
    //       }
    //     });
    //   }

    //   // 저장된 circle 이 있으면 다시 그려주는 코드
    //   if (this.$store.getters.cirStorage !== []) {
    //     this.$store.getters.cirStorage.forEach(entry => {
    //       if (entry.hidden === "F") {
    //         ctx.save()
    //         ctx.beginPath()
    //         ctx.scale(entry.location[0], entry.location[1])
    //         ctx.arc(entry.location[2], entry.location[3], 1, 0, 2*Math.PI)
    //         ctx.restore()
    //         ctx.strokeStyle = entry.strokeColor
    //         ctx.lineWidth = entry.strokeWidth
    //         ctx.stroke()
    //       }
    //     });
    //   }

    //   // 저장된 free line 이 있으면 다시 그려주는 코드
    //   if (this.$store.getters.freeStorage !== []) {
    //     this.$store.getters.freeStorage.forEach(entry => {
    //       if (entry.hidden === "F") {
    //         entry.location.forEach(freeEntry => {
    //           ctx.beginPath()
    //           ctx.moveTo(freeEntry[0], freeEntry[1])
    //           ctx.lineTo(freeEntry[2], freeEntry[3])
    //           ctx.strokeStyle = entry.strokeColor
    //           ctx.lineWidth = entry.strokeWidth
    //           ctx.stroke()
    //           ctx.closePath()
    //         })
    //       }
    //     });
    //   }
    // },

    // removeDrawing () {
    //   // Canvas
    //   const canvas = document.getElementById("canvas")
    //   const ctx = canvas.getContext("2d")

    //   this.lineFrom = null
    //   this.lineTo = null
    //   this.angle.p1 = null
    //   this.angle.p2 = null
    //   this.angle.p3 = null

    //   this.$store.commit("initStorage")

    //   ctx.clearRect(0, 0, canvas.width, canvas.height)
    // },

    draw () {
      // eslint-disable-next-line no-console
      console.log("draw mounted")

      // Stage
      const canvas = document.getElementById("canvas")

      // Variable
      let lastMousex = 0
      let lastMousey = 0
      let mousex = 0
      let mousey = 0
      // eslint-disable-next-line no-unused-vars
      let mousedown = false

      canvas.addEventListener("mousedown", e => {
        mousedown = true
        let canvasx = canvas.offsetLeft
        let canvasy = canvas.offsetTop
        lastMousex = parseInt(e.clientX - canvasx)
        lastMousey = parseInt(e.clientY - canvasy)

        // 자유 그리기
        if (this.drawType === "free") {
          if (mousedown) {
            let pos = this.canvas.getPointerPosition()

            this.free = new Konva.Line({
              stroke: this.$store.state.strokeColor,
              strokeWidth: this.$store.state.strokeWidth,
              points: [pos.x, pos.y]
            })
            
            this.layer.add(this.free)

            // state 에 그려지는 free line 정보를 지속적으로 업데이트
            // 마지막에 state 에 저장된 정보를 mouseup 이벤트에서 state.storage 에 저장함
            this.temp.free.push([lastMousex, lastMousey, mousex, mousey])
          }
        }
      })

      canvas.addEventListener("mouseup", () => {
        mousedown = false
        // if (this.temp.rect !== null) {
        //   this.$store.commit("pushRect", {location: this.temp.rect, hidden: "F", strokeColor: this.$store.state.strokeColor, strokeWidth: this.$store.state.strokeWidth})
        //   this.addHistory()
        //   this.temp.rect = null
        // } else if (this.temp.circle !== null) {
        //   this.$store.commit("pushCircle", {location: this.temp.circle, hidden: "F", strokeColor: this.$store.state.strokeColor, strokeWidth: this.$store.state.strokeWidth})
        //   this.addHistory()
        //   this.temp.circle = null
        // } else if (this.temp.free.length !== 0) {
        //   this.$store.commit("pushFree", {location: this.temp.free, hidden: "F", strokeColor: this.$store.state.strokeColor, strokeWidth: this.$store.state.strokeWidth})
        //   this.addHistory()
        //   this.temp.free = []
        // }
      })

      canvas.addEventListener("contextmenu", e => {
        e.preventDefault();
        if (this.drawType === "line" && this.temp.line !== null) {
          // this.$store.commit("pushLine", {location: this.temp.line, hidden: "F", strokeColor: this.$store.state.strokeColor, strokeWidth: this.$store.state.strokeWidth})
          // this.addHistory()
          this.temp.line = null
          this.lineFrom = null
          this.lineTo = null
        }
        return false
      })

      canvas.addEventListener("click", e => {
        let canvasx = canvas.offsetLeft
        let canvasy = canvas.offsetTop
        mousex = parseInt(e.clientX - canvasx)
        mousey = parseInt(e.clientY - canvasy)

        // 라인 그리기
        if (this.drawType === "line") {
          // eslint-disable-next-line no-console
          console.log("line click")
          this.drawLine(mousex, mousey)
        }

        // 각도 확인
        if (this.drawType === "angle") {
          this.drawAngle(mousex, mousey)
        }
      })

      // eslint-disable-next-line no-unused-vars
      canvas.addEventListener("mousemove", e => {
        let canvasx = canvas.offsetLeft
        let canvasy = canvas.offsetTop
        if (this.drawType === "free") {
          lastMousex = mousex
          lastMousey = mousey
        }
        mousex = parseInt(e.clientX - canvasx)
        mousey = parseInt(e.clientY - canvasy)
        // 사각형 그리기
        if (this.drawType === "rect") {
          if (mousedown) {
            this.drawRect(mousex, mousey, lastMousex, lastMousey)
          }
        }

        // 원 그리기
        if (this.drawType === "circle") {
          if (mousedown) {
            this.drawCircle(mousex, mousey, lastMousex, lastMousey)
          }
        }

        // 자유 그리기
        if (this.drawType === "free") {
          if (mousedown) {
            this.drawFree(mousex, mousey, lastMousex, lastMousey)
          }
        }
      })
    }
  },

  data: () => ({
    canvas: null,
    layer: null,
    drawType: null,
    angle: {
      path: null,
      arc: null,
      p1: null,
      p2: null,
      p3: null
    },
    line: null,
    rect: null,
    circle: null,
    free: null,
    temp: {
      line: null,
      rect: null,
      circle: null,
      free: []
    }
  }),
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
    top: 0px;
    left: 0px;
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
    left: 600px;
    font-size: 0.7rem;
    color: white;
  }

  #outputAngle {
    position: absolute;
    top: -30px;
    left: 10px;
    font-size: 0.7rem;
    color: white;
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