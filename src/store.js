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
      const r = state.history.find(entry => entry.id === payload)
      if (r) {
        r.hidden = "T"
      }
    },

    redoHistory: (state, payload) => {
      const r = state.history.find(entry => entry.id === payload)
      if (r) {
        r.hidden = "F"
      }
    }
  }
})