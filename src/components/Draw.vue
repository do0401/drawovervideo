<template>
  <v-app>
    <v-container fluid>
      <video id="video" src="../assets/videos/example.mp4" width="500" @resize="resizeCanvas"></video>
      <canvas id="canvas"></canvas>
    </v-container>
    <v-container>
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
      </v-radio-group>
    </v-container>
  </v-app>
</template>

<script>
export default {
  name: 'Draw',

  mounted () {
    this.mouseMove()
    this.draw()
  },

  methods: {
    resizeCanvas () {
        const video = document.getElementById("video")
        const canvas = document.getElementById("canvas")
  
        const w = video.offsetWidth
        const h = video.offsetHeight
        
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
            ctx.strokeStyle = "red"
            ctx.lineWidth = 3
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
        ctx.strokeStyle = "red"
        ctx.lineWidth = 3
        ctx.lineJoin = ctx.lineCap = "round"
        ctx.stroke()
      } else if (this.angle.p1 !== null && this.angle.p2 !== null && this.angle.p3 !== null) {
        ctx.beginPath()
        ctx.moveTo(this.angle.p2[0], this.angle.p2[1])
        ctx.lineTo(this.angle.p3[0], this.angle.p3[1])
        ctx.strokeStyle = "red"
        ctx.lineWidth = 3
        ctx.lineJoin = ctx.lineCap = "round"
        ctx.stroke()

        // 각도 계산 함수
        const ab = Math.sqrt(Math.pow(this.angle.p2[0] - this.angle.p1[0], 2) + Math.pow(this.angle.p2[1] - this.angle.p1[1], 2))
        const bc = Math.sqrt(Math.pow(this.angle.p2[0] - this.angle.p3[0], 2) + Math.pow(this.angle.p2[1] - this.angle.p3[1], 2))
        const ac = Math.sqrt(Math.pow(this.angle.p3[0] - this.angle.p1[0], 2) + Math.pow(this.angle.p3[1] - this.angle.p1[1], 2))

        const angle = (Math.acos((bc * bc + ab * ab - ac * ac) / (2 * bc * ab)) * 180) / Math.PI

        // state 에 그려지는 각도 정보를 지속적으로 업데이트
        // this.$store.getters.angleStorage.push({location: [this.angle.p1, this.angle.p2, this.angle.p3, angle], hidden: "F"})
        this.$store.commit("pushAngle", {location: [this.angle.p1, this.angle.p2, this.angle.p3, angle], hidden: "F"})
        this.addHistory()
        
        const output = document.getElementById("outputAngle")
        output.innerHTML = "angle: "+angle
      }
    },

    drawRect (canvas, ctx, mousex, mousey, lastMousex, lastMousey) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.beginPath()
      let width = mousex - lastMousex
      let height = mousey - lastMousey
      ctx.rect(lastMousex, lastMousey, width, height)
      ctx.strokeStyle = "red"
      ctx.lineWidth = 3
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
      ctx.strokeStyle = "red"
      ctx.lineWidth = 3
      ctx.stroke()
      // state 에 그려지는 ciricle 정보를 지속적으로 업데이트
      // 마지막에 state 에 저장된 정보를 mouseup 이벤트에서 state.storage 에 저장함
      this.temp.circle = [scalex, scaley, centerx, centery]

      // 저장된 circle 이 있으면 다시 그려주는 코드
      this.redraw()
    },

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
                ctx.stroke()
              }
            })
          }
        });
      }

      // 저장된 angle 이 있으면 다시 그려주는 코드
      if (this.$store.getters.angleStorage !== null) {
        this.$store.getters.angleStorage.forEach(entry => {
          if (entry.hidden === "F") {
            ctx.beginPath()
            ctx.moveTo(entry.location[0][0], entry.location[0][1])
            ctx.lineTo(entry.location[1][0], entry.location[1][1])
            ctx.moveTo(entry.location[1][0], entry.location[1][1])
            ctx.lineTo(entry.location[2][0], entry.location[2][1])
            ctx.stroke()
          }
        });
      }

      // 저장된 rectangle 이 있으면 다시 그려주는 코드
      if (this.$store.getters.rectStorage !== null) {
        this.$store.getters.rectStorage.forEach(entry => {
          if (entry.hidden === "F") {
            ctx.beginPath()
            ctx.rect(entry.location[0], entry.location[1], entry.location[2], entry.location[3])
            ctx.stroke()
          }
        });
      }

      // 저장된 circle 이 있으면 다시 그려주는 코드
      if (this.$store.getters.cirStorage !== null) {
        this.$store.getters.cirStorage.forEach(entry => {
          if (entry.hidden === "F") {
            ctx.save()
            ctx.beginPath()
            ctx.scale(entry.location[0], entry.location[1])
            ctx.arc(entry.location[2], entry.location[3], 1, 0, 2*Math.PI)
            ctx.restore()
            ctx.stroke()
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

      // this.$store.getters.lineStorage = []
      // this.$store.getters.rectStorage = []
      // this.$store.getters.cirStorage = []
      // this.$store.getters.angleStorage = []
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
      const canvasx = canvas.offsetLeft
      const canvasy = canvas.offsetTop
      let lastMousex = 0;
      let lastMousey = 0;
      let mousex = 0
      let mousey = 0
      let mousedown = false

      canvas.addEventListener("mousedown", e => {
        mousedown = true
        lastMousex = parseInt(e.clientX - canvasx)
        lastMousey = parseInt(e.clientY - canvasy)
      })

      canvas.addEventListener("mouseup", () => {
        mousedown = false
        if (this.temp.rect !== null) {
          // this.$store.getters.rectStorage.push({location: this.temp.rect, hidden: "F"})
          this.$store.commit("pushRect", {location: this.temp.rect, hidden: "F"})
          this.addHistory()
          this.temp.rect = null
        } else if (this.temp.circle !== null) {
          // this.$store.getters.cirStorage.push({location: this.temp.circle, hidden: "F"})
          this.$store.commit("pushCircle", {location: this.temp.circle, hidden: "F"})
          this.addHistory()
          this.temp.circle = null
        }
      })

      canvas.addEventListener("contextmenu", e => {
        e.preventDefault();
        if (this.drawType === "line" && this.temp.line !== null) {
          // this.$store.getters.lineStorage.push({location: this.temp.line, hidden: "F"})
          this.$store.commit("pushLine", {location: this.temp.line, hidden: "F"})
          this.addHistory()
          this.temp.line = null
          this.lineFrom = null
          this.lineTo = null
        }
        return false
      })

      canvas.addEventListener("click", e => {
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
      circle: null
    }
  }),
};
</script>

<style>
  #video {
    width: 700px;
    height: auto;
    position: absolute;
    top: 0;
    left: 0;
  }

  #canvas {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 10;
    background-color: rgba(255, 0, 0, 0);
  }

  .btn {
    position: relative;
    top: 335px;
  }

  .pause {
    left: 5px;
  }

  .undo {
    left: 25px;
  }

  .redo {
    left: 45px;
  }

  .clear {
    left: 65px;
  }

  #output {
    position: absolute;
    top: 345px;
    left: 600px;
    font-size: 0.7rem;
    color: white;
  }

  #outputAngle {
    position: absolute;
    top: 345px;
    left: 10px;
    font-size: 0.7rem;
    color: white;
  }

  .radioGroup {
    position: relative;
    top: 290px;
    left: 320px;
  }
</style>