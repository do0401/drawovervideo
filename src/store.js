import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export const store = new Vuex.Store({
  state: {
    storage: {
      line: [],
      rect: [],
      circle: [],
      angle: [],
      free: []
    },
    history: [],
    strokeColor: '#E62B2B',
    strokeWidth: 3
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
    },
    freeStorage: function (state) {
      return state.storage.free
    },
    strokeColor: function (state) {
      return state.strokeColor
    },
    getUndoHis: function (state) {
      let undoId = null
      state.history.reverse().some(entry => {
        if (entry.hidden === "F") {
          state.history.reverse()
          switch (entry.drawType) {
            case "line":
              state.storage.line.reverse().some(lineEntry => {
                if (lineEntry.hidden === "F") {
                  state.storage.line.reverse()
                  undoId = lineEntry.id
                  return true
                }
              })
              break;
            case "rect":  {
              state.storage.rect.reverse().some(rectEntry => {
                if (rectEntry.hidden === "F") {
                  state.storage.rect.reverse()
                  undoId = rectEntry.id
                  return true
                }
              })
              break;
            }
            case "circle":
              state.storage.circle.reverse().some(circleEntry => {
                if (circleEntry.hidden === "F") {
                  state.storage.circle.reverse()
                  undoId = circleEntry.id
                  return true
                }
              })
              break;
            case "angle":
              state.storage.angle.reverse().some(angleEntry => {
                if (angleEntry.hidden === "F") {
                  state.storage.angle.reverse()
                  undoId = angleEntry.id
                  return true
                }
              })
              break;
            case "free":
              state.storage.free.reverse().some(freeEntry => {
                if (freeEntry.hidden === "F") {
                  state.storage.free.reverse()
                  undoId = freeEntry.id
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
      return undoId
    },
    getRedoHis: function (state) {
      let redoId = null
      state.history.some(entry => {
        if (entry.hidden === "T") {
          switch (entry.drawType) {
            case "line":
              state.storage.line.some(lineEntry => {
                if (lineEntry.hidden === "T") {
                  redoId = lineEntry.id
                  return true
                }
              })
              break;
            case "rect":  {
              state.storage.rect.some(rectEntry => {
                if (rectEntry.hidden === "T") {
                  redoId = rectEntry.id
                  return true
                }
              })
              break;
            }
            case "circle":
              state.storage.circle.some(circleEntry => {
                if (circleEntry.hidden === "T") {
                  redoId = circleEntry.id
                  return true
                }
              })
              break;
            case "angle":
              state.storage.angle.some(angleEntry => {
                if (angleEntry.hidden === "T") {
                  redoId = angleEntry.id
                  return true
                }
              })
              break;
            case "free":
              state.storage.free.some(freeEntry => {
                if (freeEntry.hidden === "T") {
                  redoId = freeEntry.id
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
      return redoId
    }
  },

  mutations: {
    pushLine: (state, payload) => {
      state.storage.line.push(payload)
      // hidden 이 "T" 인 데이터는 배열 맨 뒤쪽으로 보냄(history undo/redo 문제 때문)
      for (let i = state.storage.line.length - 1; i >= 0; i -= 1) {
        if (state.storage.line[i].hidden === "T") {
          state.storage.line.push(state.storage.line[i])
          state.storage.line.splice(i, 1);
        }
      }

      // eslint-disable-next-line no-console
      console.log("linestorage", state.storage.line)
    },

    pushRect: (state, payload) => {
      state.storage.rect.push(payload)
      // hidden 이 "T" 인 데이터는 배열 맨 뒤쪽으로 보냄(history undo/redo 문제 때문)
      for (let i = state.storage.rect.length - 1; i >= 0; i -= 1) {
        if (state.storage.rect[i].hidden === "T") {
          state.storage.rect.push(state.storage.rect[i])
          state.storage.rect.splice(i, 1);
        }
      }

      // eslint-disable-next-line no-console
      console.log("rectstorage", state.storage.rect)
    },

    pushCircle: (state, payload) => {
      state.storage.circle.push(payload)
      // hidden 이 "T" 인 데이터는 배열 맨 뒤쪽으로 보냄(history undo/redo 문제 때문)
      for (let i = state.storage.circle.length - 1; i >= 0; i -= 1) {
        if (state.storage.circle[i].hidden === "T") {
          state.storage.circle.push(state.storage.circle[i])
          state.storage.circle.splice(i, 1);
        }
      }
      // eslint-disable-next-line no-console
      console.log("circlestorage", state.storage.circle)
    },

    pushAngle: (state, payload) => {
      state.storage.angle.push(payload)
      // hidden 이 "T" 인 데이터는 배열 맨 뒤쪽으로 보냄(history undo/redo 문제 때문)
      for (let i = state.storage.angle.length - 1; i >= 0; i -= 1) {
        if (state.storage.angle[i].hidden === "T") {
          state.storage.angle.push(state.storage.angle[i])
          state.storage.angle.splice(i, 1);
        }
      }
      // eslint-disable-next-line no-console
      console.log("anglestorage", state.storage.angle)
    },

    pushFree: (state, payload) => {
      state.storage.free.push(payload)
      // hidden 이 "T" 인 데이터는 배열 맨 뒤쪽으로 보냄(history undo/redo 문제 때문)
      for (let i = state.storage.free.length - 1; i >= 0; i -= 1) {
        if (state.storage.free[i].hidden === "T") {
          state.storage.free.push(state.storage.free[i])
          state.storage.free.splice(i, 1);
        }
      }
      // eslint-disable-next-line no-console
      console.log("freestorage", state.storage.free)
    },

    initStorage: state => {
      state.storage.line = []
      state.storage.rect = []
      state.storage.circle = []
      state.storage.angle = []
      state.storage.free = []
    },

    addHistory: (state, payload) => {
      state.history.push(payload)
      // hidden 이 "T" 인 데이터는 배열 맨 뒤쪽으로 보냄(history undo/redo 문제 때문)
      for (let i = state.history.length - 1; i >= 0; i -= 1) {
        if (state.history[i].hidden === "T") {
          state.history.push(state.history[i])
          state.history.splice(i, 1);
        }
      }
    },

    undoHistory: (state, payload) => {
      state.history.some(entry => {
        if (entry.hidden === "F") {
          entry.hidden = "T"
          switch (entry.drawType) {
            case "line": {
              // 찾아낸 마지막 line history id(payload)를 storage 에서 찾아서 hidden을 "T" 로 변경
              const r = state.storage.line.find(entry => entry.id === payload)
              r.hidden = "T"
              break;
            }
            case "rect":  {
              // 찾아낸 마지막 rect history id(payload)를 storage 에서 찾아서 hidden을 "T" 로 변경
              const r = state.storage.rect.find(entry => entry.id === payload)
              r.hidden = "T"
              break;
            }
            case "circle": {
              // 찾아낸 마지막 circle history id(payload)를 storage 에서 찾아서 hidden을 "T" 로 변경
              const r = state.storage.circle.find(entry => entry.id === payload)
              r.hidden = "T"
              break;
            }
            case "angle": {
              // 찾아낸 마지막 circle history id(payload)를 storage 에서 찾아서 hidden을 "T" 로 변경
              const r = state.storage.angle.find(entry => entry.id === payload)
              r.hidden = "T"
              break;
            }
            case "free":{
              // 찾아낸 마지막 free history id(payload)를 storage 에서 찾아서 hidden을 "T" 로 변경
              const r = state.storage.free.find(entry => entry.id === payload)
              r.hidden = "T"
              break;
            }
            default:
              break;
          }
          return true
        }
      })
    },

    redoHistory: (state, payload) => {
      state.history.some(entry => {
        if (entry.hidden === "T") {
          entry.hidden = "F"
          switch (entry.drawType) {
            case "line": {
              // 찾아낸 마지막 line history id(payload)를 storage 에서 찾아서 hidden을 "T" 로 변경
              const r = state.storage.line.find(entry => entry.id === payload)
              r.hidden = "F"
              break;
            }
            case "rect":  {
              // 찾아낸 마지막 rect history id(payload)를 storage 에서 찾아서 hidden을 "T" 로 변경
              const r = state.storage.rect.find(entry => entry.id === payload)
              r.hidden = "F"
              break;
            }
            case "circle": {
              // 찾아낸 마지막 circle history id(payload)를 storage 에서 찾아서 hidden을 "T" 로 변경
              const r = state.storage.circle.find(entry => entry.id === payload)
              r.hidden = "F"
              break;
            }
            case "angle": {
              // 찾아낸 마지막 circle history id(payload)를 storage 에서 찾아서 hidden을 "T" 로 변경
              const r = state.storage.angle.find(entry => entry.id === payload)
              r.hidden = "F"
              break;
            }
            case "free":{
              // 찾아낸 마지막 free history id(payload)를 storage 에서 찾아서 hidden을 "T" 로 변경
              const r = state.storage.free.find(entry => entry.id === payload)
              r.hidden = "F"
              break;
            }
            default:
              break;
          }
          return true
        }
      })
    }
  }
})