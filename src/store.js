import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export const store = new Vuex.Store({
  state: {
    storage: {
      line: [],
      rect: [],
      circle: [],
      angle: []
    },
    history: []
  },

  getters: {
    lineStorage: function (state) {
      return state.storage.line
    },
    rectStorage: function (state) {
      return state.storage.rect
    },
    cirStorage: function (state) {
      return state.storage.circle
    },
    angleStorage: function (state) {
      return state.storage.angle
    }
  },

  mutations: {
    pushLine: (state, payload) => {
      state.storage.line.push(payload)
    },

    pushRect: (state, payload) => {
      state.storage.rect.push(payload)
    },

    pushCircle: (state, payload) => {
      state.storage.circle.push(payload)
    },

    pushAngle: (state, payload) => {
      state.storage.angle.push(payload)
    },

    initStorage: state => {
      state.storage.line = []
      state.storage.rect = []
      state.storage.circle = []
      state.storage.angle = []
    },

    addHistory: (state, payload) => {
      state.history.push(payload)
    },

    undoHistory: state => {
      state.history.reverse().some(entry => {
        if (entry.hidden === "F") {
          entry.hidden = "T"
          state.history.reverse()
          switch (entry.drawType) {
            case "line":
              state.storage.line.reverse().some(lineEntry => {
                if (lineEntry.hidden === "F") {
                  lineEntry.hidden = "T"
                  state.storage.line.reverse()
                  return true
                }
              })
              break;
            case "rect":
              state.storage.rect.reverse().some(rectEntry => {
                if (rectEntry.hidden === "F") {
                  rectEntry.hidden = "T"
                  state.storage.rect.reverse()
                  return true
                }
              })
              break;
            case "circle":
              state.storage.circle.reverse().some(circleEntry => {
                if (circleEntry.hidden === "F") {
                  circleEntry.hidden = "T"
                  state.storage.circle.reverse()
                  return true
                }
              })
              break;
            case "angle":
            state.storage.angle.reverse().some(angleEntry => {
              if (angleEntry.hidden === "F") {
                angleEntry.hidden = "T"
                state.storage.angle.reverse()
                return true
              }
            })
            break;
            default:
              break;
          }
          return true
        }
      })
    }
  }
})