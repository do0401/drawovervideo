import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export const store = new Vuex.Store({
	state: {
		history: [],
		drawType: null,
		drawOptions: {
			strokeColor: '#E62B2B',
			strokeWidth: 3,
			dash: [0, 0],
			arrow: false,
		},
		video1: {
			stage: {
				canvas: null,
				layer: null,
				r1: null,
				line: null,
				rect: null,
				circle: null,
				angle: null,
			},
			selected: null,
		},
		video2: {
			stage: {
				canvas: null,
				layer: null,
				r1: null,
				line: null,
				rect: null,
				circle: null,
				angle: null,
			},
			selected: null,
		},
		video3: {
			stage: {
				canvas: null,
				layer: null,
				r1: null,
				line: null,
				rect: null,
				circle: null,
				angle: null,
			},
			selected: null,
		},
		video4: {
			stage: {
				canvas: null,
				layer: null,
				r1: null,
				line: null,
				rect: null,
				circle: null,
				angle: null,
			},
			selected: null,
		},
	},

	getters: {
		// canvas: function(state) {
		// 	return state.stage.canvas
		// },
		// layer: function(state) {
		// 	return state.stage.layer
		// },
		// r1: function(state) {
		// 	return state.stage.r1
		// },
		// line: function(state) {
		// 	return state.stage.line
		// },
		// rect: function(state) {
		// 	return state.stage.rect
		// },
		// circle: function(state) {
		// 	return state.stage.circle
		// },
		// angle: function(state) {
		// 	return state.stage.angle
		// },
		strokeColor: function(state) {
			return state.drawOptions.strokeColor
		},
		strokeWidth: function(state) {
			return state.drawOptions.strokeWidth
		},
		dash: function(state) {
			return state.drawOptions.dash
		},
		arrow: function(state) {
			return state.drawOptions.arrow
		},
	},

	mutations: {
		addHistory: (state, payload) => {
			let history = state.history
			history.push(payload)
			// hidden 이 "T" 인 데이터는 배열 맨 뒤쪽으로 보냄(history undo/redo 문제 때문)
			for (let i = history.length - 1; i >= 0; i -= 1) {
				if (history[i].hidden === 'T') {
					history.push(history[i])
					history.splice(i, 1)
				}
			}
			console.log(state.history)
			state.history = history
		},

		undoHistory: (state, payload) => {
			const r = state.history.find(entry => entry.id === payload)
			if (r) {
				r.hidden = 'T'
			}
		},

		redoHistory: (state, payload) => {
			const r = state.history.find(entry => entry.id === payload)
			if (r) {
				r.hidden = 'F'
			}
		},
	},
})
