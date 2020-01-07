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
    }
  }
})