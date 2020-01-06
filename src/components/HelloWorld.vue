<template>
  <v-container>
    <v-layout
      text-center
      wrap
    >
      <v-flex xs12>
        <video id="video" src="../assets/videos/example.mp4" width="500" @play="this.resizeCanvas"></video>
        <canvas id="canvas"></canvas>
        <v-icon class="play" color="#37474F" @click="play">mdi-play-circle</v-icon>
        <v-icon class="stop" color="#37474F" @click="pause">mdi-stop-circle</v-icon>
        <div id="output"></div>
        <v-radio-group class="radioGroup" v-model="drawType" row @change="drawInit">
          <v-radio label="Line" color="red" value="line"></v-radio>
          <v-radio label="Rectangle" color="red" value="rect"></v-radio>
          <v-radio label="Circle" color="red" value="circle"></v-radio>
        </v-radio-group>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
export default {
  name: 'HelloWorld',

  mounted () {
    this.mouseMove()
    this.draw()
  },

  methods: {
    resizeCanvas (video) {
      const w = video.target.offsetWidth
      const h = video.target.offsetHeight
      
      const canvas = document.getElementById("canvas")
      // const ctx = canvas.getContext('2d')
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

        output.innerHTML = "current: "+mousex+", "+mousey
      })
    },

    drawInit () {
      // Canvas
      const canvas = document.getElementById("canvas")
      const ctx = canvas.getContext("2d")

      this.lineFrom = null
      this.lineTo = null

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
        lastMousex = parseInt(e.clientX - canvasx)
        lastMousey = parseInt(e.clientY - canvasy)
        mousedown = true
      })

      canvas.addEventListener("click", e => {
        mousex = parseInt(e.clientX - canvasx)
        mousey = parseInt(e.clientY - canvasy)

        // 라인 그리기
        if (this.drawType === "line") {
          // eslint-disable-next-line no-console
          console.log("line click")

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
          }
        // eslint-disable-next-line no-console
        console.log(this.lineFrom)
        // eslint-disable-next-line no-console
        console.log(this.lineTo)
        }
      })

      canvas.addEventListener("mouseup", () => {
        mousedown = false
      })

      canvas.addEventListener("mousemove", e => {
        mousex = parseInt(e.clientX - canvasx)
        mousey = parseInt(e.clientY - canvasy)
        // 사각형 그리기
        if (this.drawType === "rect") {
          if (mousedown) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.beginPath()
            let width = mousex - lastMousex
            let height = mousey - lastMousey
            ctx.rect(lastMousex, lastMousey, width, height)
            ctx.strokeStyle = "red"
            ctx.lineWidth = 3
            ctx.stroke()
          }
        }

        // 원 그리기
        if (this.drawType === "circle") {
          if (mousedown) {
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
          }
        }
      })
    }
  },

  data: () => ({
    drawType: null,
    lineFrom: null,
    lineTo: null
  }),
};
</script>

<style>
  #video {
    width: 50%;
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
    background-color: rgba(0, 0, 0, 0);
  }

  .play {
    position: absolute;
    top: 280px;
    left: 20px;
  }

  .stop {
    position: absolute;
    top: 280px;
    left: 50px;
  }

  #output {
    position: absolute;
    top: 280px;
    left: 400px;
  }

  .radioGroup {
    position: absolute;
    top: 260px;
    left: 100px;
  }
</style>