<template>
  <v-app>
    <v-container class="videoContainer" fluid>
      <video id="video" src="../assets/videos/example.mp4" width="500" @resize="resizeCanvas"></video>
      <canvas id="canvas"></canvas>
    </v-container>
    <v-card class="toolbar" max-width="700" height="50" outlined>
      <v-container>
        <v-flex xs12>
          <v-btn class="play btn" color="#37474F" @click="play" dark small>Play</v-btn>
          <v-btn class="pause btn" color="#37474F" @click="pause" dark small>Stop</v-btn>
          <v-icon class="undo btn" color="#37474F" @click="undoHistory">mdi-undo</v-icon>
          <v-icon class="redo btn" color="#37474F" @click="redoHistory">mdi-redo</v-icon>
          <v-btn class="clear btn" color="#c0392b" @click="removeDrawing" dark small>Clear</v-btn>
          <!-- <v-icon class="play" color="#37474F" @click="play">mdi-play-circle</v-icon>
          <v-icon class="stop" color="#37474F" @click="pause">mdi-stop-circle</v-icon> -->
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
    <ColorPicker/>
  </v-app>
</template>

<script>
import ColorPicker from './ColorPicker'
export default {
  name: 'Draw',

  components: {
    ColorPicker
  },

  mounted () {
    this.mouseMove()
    this.draw()
  },

  methods: {
    resizeCanvas () {
        const video = document.getElementById("video")
        const canvas = document.getElementById("canvas")

        // eslint-disable-next-line no-console
        console.log(video.offsetTop)
        // eslint-disable-next-line no-console
        console.log(video.offsetLeft)
  
        const t = video.offsetTop+"px"
        const l = video.offsetLeft+"px"
        const w = video.offsetWidth
        const h = video.offsetHeight
        
        canvas.style.top = t
        canvas.style.left = l
        canvas.width = w
        canvas.height = h
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
      // Canvas
      const canvas = document.getElementById("canvas")
      const ctx = canvas.getContext("2d")

      this.lineFrom = null
      this.lineTo = null
      this.angle.p1 = null
      this.angle.p2 = null
      this.angle.p3 = null

      ctx.clearRect(0, 0, canvas.width, canvas.height)
      this.redraw()
    },

    drawLine (ctx, mousex, mousey) {
      if (this.lineFrom === null) {
            this.lineFrom = [mousex, mousey]
          } else if (this.lineTo === null) {
            this.lineTo = [mousex, mousey]
          } else {
            this.lineFrom = this.lineTo
            this.lineTo = [mousex, mousey]
          }

          if (this.lineFrom !== null && this.lineTo !== null) {
            ctx.beginPath()
            ctx.moveTo(this.lineFrom[0], this.lineFrom[1])
            ctx.lineTo(this.lineTo[0], this.lineTo[1])
            ctx.strokeStyle = this.$store.state.strokeColor
            ctx.lineWidth = this.$store.state.strokeWidth
            ctx.lineJoin = ctx.lineCap = "round"
            ctx.stroke()
            // state 에 그려지는 line 정보를 지속적으로 업데이트
            // 마지막에 state 에 저장된 정보를 마우스 우클릭 이벤트에서 state.storage 에 저장함
            if (this.temp.line === null) {
              this.temp.line = [this.lineFrom, this.lineTo]
            } else {
              this.temp.line.push(this.lineTo)
            }
          }
    },

    drawRect (canvas, ctx, mousex, mousey, lastMousex, lastMousey) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.beginPath()
      let width = mousex - lastMousex
      let height = mousey - lastMousey
      ctx.rect(lastMousex, lastMousey, width, height)
      ctx.strokeStyle = this.$store.state.strokeColor
      ctx.lineWidth = this.$store.state.strokeWidth
      ctx.stroke()
      // state 에 그려지는 rect 정보를 지속적으로 업데이트
      // 마지막에 state 에 저장된 정보를 mouseup 이벤트에서 state.storage 에 저장함
      this.temp.rect = [lastMousex, lastMousey, width, height]

      // 저장된 rectangle 이 있으면 다시 그려주는 코드
      this.redraw()
    },

    drawCircle (canvas, ctx, mousex, mousey, lastMousex, lastMousey) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.save()
      ctx.beginPath()
      // Dynamic scaling
      let scalex = 1*((mousex - lastMousex)/2)
      let scaley = 1*((mousey - lastMousey)/2)
      ctx.scale(scalex, scaley)
      // Create ellipse
      let centerx = (lastMousex/scalex) + 1
      let centery = (lastMousey/scaley) + 1
      ctx.arc(centerx, centery, 1, 0, 2*Math.PI)
      // Restore and draw
      ctx.restore()
      ctx.strokeStyle = this.$store.state.strokeColor
      ctx.lineWidth = this.$store.state.strokeWidth
      ctx.stroke()
      // state 에 그려지는 ciricle 정보를 지속적으로 업데이트
      // 마지막에 state 에 저장된 정보를 mouseup 이벤트에서 state.storage 에 저장함
      this.temp.circle = [scalex, scaley, centerx, centery]

      // 저장된 circle 이 있으면 다시 그려주는 코드
      this.redraw()
    },

    drawFree (ctx, mousex, mousey, lastMousex, lastMousey) {
      ctx.beginPath()
      ctx.moveTo(lastMousex, lastMousey)
      ctx.lineTo(mousex, mousey)
      ctx.strokeStyle = this.$store.state.strokeColor
      ctx.lineWidth = this.$store.state.strokeWidth
      ctx.stroke()
      ctx.closePath()

      // state 에 그려지는 free line 정보를 지속적으로 업데이트
      // 마지막에 state 에 저장된 정보를 mouseup 이벤트에서 state.storage 에 저장함
      this.temp.free.push([lastMousex, lastMousey, mousex, mousey])
    },

    drawAngle (ctx, mousex, mousey) {
      if (this.angle.p1 === null) {
        this.angle.p1 = [mousex, mousey]
      } else if (this.angle.p2 === null) {
        this.angle.p2 = [mousex, mousey]
      } else if (this.angle.p3 === null) {
        this.angle.p3 = [mousex, mousey]
      } else {
        this.angle.p1 = [mousex, mousey]
        this.angle.p2 = null
        this.angle.p3 = null
      }

      if (this.angle.p1 !== null && this.angle.p2 !== null && this.angle.p3 === null) {
        ctx.beginPath()
        ctx.moveTo(this.angle.p1[0], this.angle.p1[1])
        ctx.lineTo(this.angle.p2[0], this.angle.p2[1])
        ctx.strokeStyle = this.$store.state.strokeColor
        ctx.lineWidth = this.$store.state.strokeWidth
        ctx.lineJoin = ctx.lineCap = "round"
        ctx.stroke()
      } else if (this.angle.p1 !== null && this.angle.p2 !== null && this.angle.p3 !== null) {
        ctx.beginPath()
        ctx.moveTo(this.angle.p2[0], this.angle.p2[1])
        ctx.lineTo(this.angle.p3[0], this.angle.p3[1])
        ctx.strokeStyle = this.$store.state.strokeColor
        ctx.lineWidth = this.$store.state.strokeWidth
        ctx.lineJoin = ctx.lineCap = "round"
        ctx.stroke()

        const angle = this.calAngle(this.angle.p1, this.angle.p2, this.angle.p3)
        // this.atanAngle(this.angle.p1, this.angle.p3)

        // 각도 표시를 위한 함수
        this.drawAngleArc(ctx, this.angle.p1, this.angle.p2, this.angle.p3)

        // state 에 그려지는 각도 정보를 지속적으로 업데이트
        // this.$store.getters.angleStorage.push({location: [this.angle.p1, this.angle.p2, this.angle.p3, angle], hidden: "F"})
        this.$store.commit("pushAngle", {location: [this.angle.p1, this.angle.p2, this.angle.p3, angle], hidden: "F", strokeColor: this.$store.state.strokeColor, strokeWidth: this.$store.state.strokeWidth})
        this.addHistory()
        
        const output = document.getElementById("outputAngle")
        output.innerHTML = "angle: "+angle
      }
    },

    drawAngleArc (ctx, p1, p2, p3) {
      const angle1 = Math.atan2(p1[1] - p2[1], p1[0] - p2[0])
      const angle2 = Math.atan2(p3[1] - p2[1], p3[0] - p2[0])

      const plusAngle1 = angle1 > 0 ? angle1 : -angle1
      const plusAngle2 = angle2 > 0 ? angle2 : -angle2

      const smallAngle = angle1 > angle2 ? angle2 : angle1
      const largeAngle = angle1 > angle2 ? angle1 : angle2

      // 평각 이상의 각도에 arc가 그려지는 것에 대한 예외 처리
      if ((angle1 < 0 && angle2 > 0 || angle1 > 0 && angle2 < 0) && (plusAngle1 + plusAngle2) > 3.2) {
        ctx.beginPath()
        ctx.arc(p2[0], p2[1], 20, largeAngle, smallAngle)
        ctx.stroke()
      } else {
        ctx.beginPath()
        ctx.arc(p2[0], p2[1], 20, smallAngle, largeAngle)
        ctx.stroke()
      }
    },

    calAngle (p1, p2, p3) {
      // 각도 계산 함수
      const ab = Math.sqrt(Math.pow(p2[0] - p1[0], 2) + Math.pow(p2[1] - p1[1], 2))
      const bc = Math.sqrt(Math.pow(p2[0] - p3[0], 2) + Math.pow(p2[1] - p3[1], 2))
      const ac = Math.sqrt(Math.pow(p3[0] - p1[0], 2) + Math.pow(p3[1] - p1[1], 2))

      const angle = (Math.acos((bc * bc + ab * ab - ac * ac) / (2 * bc * ab)) * 180) / Math.PI

      return angle
    },

    // atanAngle (p1) {
    //   const angle = Math.atan2(-p1[1], p1[0])

    //   // eslint-disable-next-line no-console
    //   console.log(angle)
    //   // eslint-disable-next-line no-console
    //   console.log(angle * (180/Math.PI))
    // },

    addHistory () {
      // this.$store.state.history.push({drawType: this.drawType, hidden: "F"})
      this.$store.commit("addHistory", {drawType: this.drawType, hidden: "F"})
    },

    undoHistory () {
      // Canvas
      const canvas = document.getElementById("canvas")
      const ctx = canvas.getContext("2d")

      this.$store.commit("undoHistory")

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      this.redraw()
    },

    redoHistory () {
      // Canvas
      const canvas = document.getElementById("canvas")
      const ctx = canvas.getContext("2d")

      this.$store.commit("redoHistory")

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      this.redraw()
    },

    redraw () {
      // Canvas
      const canvas = document.getElementById("canvas")
      const ctx = canvas.getContext("2d")

      // 저장된 line 이 있으면 다시 그려주는 코드
      if (this.$store.getters.lineStorage !== null) {
        this.$store.getters.lineStorage.forEach(entry => {
          if (entry.hidden === "F") {
            let p1 = null
            let p2 = null
            entry.location.forEach(locEntry => {
              if (p1 === null) {
                p1 = locEntry
              } else if (p1 !== null && p2 === null) {
                p2 = locEntry
              } else if (p1 !== null && p2 !== null) {
                p1 = [...p2]
                p2 = locEntry
              }

              if (p1 !== null && p2 !== null) {
                ctx.beginPath()
                ctx.moveTo(p1[0], p1[1])
                ctx.lineTo(p2[0], p2[1])
                ctx.strokeStyle = entry.strokeColor
                ctx.lineWidth = entry.strokeWidth
                ctx.lineJoin = ctx.lineCap = "round"
                ctx.stroke()
              }
            })
          }
        });
      }

      // 저장된 angle 이 있으면 다시 그려주는 코드
      if (this.$store.getters.angleStorage !== []) {
        this.$store.getters.angleStorage.forEach(entry => {
          if (entry.hidden === "F") {
            ctx.beginPath()
            ctx.moveTo(entry.location[0][0], entry.location[0][1])
            ctx.lineTo(entry.location[1][0], entry.location[1][1])
            ctx.moveTo(entry.location[1][0], entry.location[1][1])
            ctx.lineTo(entry.location[2][0], entry.location[2][1])
            ctx.strokeStyle = entry.strokeColor
            ctx.lineWidth = entry.strokeWidth
            ctx.stroke()
          }
        });
      }

      // 저장된 rectangle 이 있으면 다시 그려주는 코드
      if (this.$store.getters.rectStorage !== []) {
        this.$store.getters.rectStorage.forEach(entry => {
          if (entry.hidden === "F") {
            ctx.beginPath()
            ctx.rect(entry.location[0], entry.location[1], entry.location[2], entry.location[3])
            ctx.strokeStyle = entry.strokeColor
            ctx.lineWidth = entry.strokeWidth
            ctx.stroke()
          }
        });
      }

      // 저장된 circle 이 있으면 다시 그려주는 코드
      if (this.$store.getters.cirStorage !== []) {
        this.$store.getters.cirStorage.forEach(entry => {
          if (entry.hidden === "F") {
            ctx.save()
            ctx.beginPath()
            ctx.scale(entry.location[0], entry.location[1])
            ctx.arc(entry.location[2], entry.location[3], 1, 0, 2*Math.PI)
            ctx.restore()
            ctx.strokeStyle = entry.strokeColor
            ctx.lineWidth = entry.strokeWidth
            ctx.stroke()
          }
        });
      }

      // 저장된 free line 이 있으면 다시 그려주는 코드
      if (this.$store.getters.freeStorage !== []) {
        this.$store.getters.freeStorage.forEach(entry => {
          if (entry.hidden === "F") {
            entry.location.forEach(freeEntry => {
              ctx.beginPath()
              ctx.moveTo(freeEntry[0], freeEntry[1])
              ctx.lineTo(freeEntry[2], freeEntry[3])
              ctx.strokeStyle = entry.strokeColor
              ctx.lineWidth = entry.strokeWidth
              ctx.stroke()
              ctx.closePath()
            })
          }
        });
      }
    },

    removeDrawing () {
      // Canvas
      const canvas = document.getElementById("canvas")
      const ctx = canvas.getContext("2d")

      this.lineFrom = null
      this.lineTo = null
      this.angle.p1 = null
      this.angle.p2 = null
      this.angle.p3 = null

      this.$store.commit("initStorage")

      ctx.clearRect(0, 0, canvas.width, canvas.height)
    },

    draw () {
      // eslint-disable-next-line no-console
      console.log("draw mounted")
      // Canvas
      const canvas = document.getElementById("canvas")
      const ctx = canvas.getContext("2d")
      // Variable
      let lastMousex = 0
      let lastMousey = 0
      let mousex = 0
      let mousey = 0
      let mousedown = false

      canvas.addEventListener("mousedown", e => {
        mousedown = true
        let canvasx = canvas.offsetLeft
        let canvasy = canvas.offsetTop
        lastMousex = parseInt(e.clientX - canvasx)
        lastMousey = parseInt(e.clientY - canvasy)

        // drawType 이 자유 그리기인 경우, 마우스 다운 시 작은 사각 점이 찍힘
        if (this.drawType === "free") {
          // eslint-disable-next-line no-console
          console.log(lastMousex, lastMousey, mousex, mousey)
          ctx.beginPath()
          ctx.fillStyle = "red"
          ctx.fillRect(lastMousex, lastMousey, 2, 2)
          ctx.closePath()
        }
      })

      canvas.addEventListener("mouseup", () => {
        mousedown = false
        if (this.temp.rect !== null) {
          this.$store.commit("pushRect", {location: this.temp.rect, hidden: "F", strokeColor: this.$store.state.strokeColor, strokeWidth: this.$store.state.strokeWidth})
          this.addHistory()
          this.temp.rect = null
        } else if (this.temp.circle !== null) {
          this.$store.commit("pushCircle", {location: this.temp.circle, hidden: "F", strokeColor: this.$store.state.strokeColor, strokeWidth: this.$store.state.strokeWidth})
          this.addHistory()
          this.temp.circle = null
        } else if (this.temp.free.length !== 0) {
          this.$store.commit("pushFree", {location: this.temp.free, hidden: "F", strokeColor: this.$store.state.strokeColor, strokeWidth: this.$store.state.strokeWidth})
          this.addHistory()
          this.temp.free = []
        }
      })

      canvas.addEventListener("contextmenu", e => {
        e.preventDefault();
        if (this.drawType === "line" && this.temp.line !== null) {
          // this.$store.getters.lineStorage.push({location: this.temp.line, hidden: "F"})
          this.$store.commit("pushLine", {location: this.temp.line, hidden: "F", strokeColor: this.$store.state.strokeColor, strokeWidth: this.$store.state.strokeWidth})
          this.addHistory()
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
          this.drawLine(ctx, mousex, mousey)
        }

        // 각도 확인
        if (this.drawType === "angle") {
          this.drawAngle(ctx, mousex, mousey)
        }
      })

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
            this.drawRect(canvas, ctx, mousex, mousey, lastMousex, lastMousey)
          }
        }

        // 원 그리기
        if (this.drawType === "circle") {
          if (mousedown) {
            this.drawCircle(canvas, ctx, mousex, mousey, lastMousex, lastMousey)
          }
        }

        // 자유 그리기
        if (this.drawType === "free") {
          if (mousedown) {
            this.drawFree(ctx, mousex, mousey, lastMousex, lastMousey)
          }
        }
      })
    }
  },

  data: () => ({
    drawType: null,
    lineFrom: null,
    lineTo: null,
    angle: {
      p1: null,
      p2: null,
      p3: null
    },
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
    /* top: 0;
    left: 0; */
    z-index: 10;
    background-color: rgba(255, 0, 0, 0);
  }

  .btn {
    position: relative;
    /* top: 335px; */
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