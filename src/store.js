import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export const store = new Vuex.Store({
  state: {
    line: null,
    rect: null,
    circle: null,
    angle: null,
    storage: {
      line: [],
      rect: [],
      circle: [],
      angle: []
    }
  }
})