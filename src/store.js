import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export const store = new Vuex.Store({
	state: {
		drawOptions: {
			strokeColor: '#E62B2B',
			strokeWidth: 3,
			dash: [0, 0],
			arrow: false,
		},
		video1: {
			history: [],
			drawType: null,
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
			history: [],
			drawType: null,
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
			history: [],
			drawType: null,
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
			history: [],
			drawType: null,
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
			let history = state[payload[1].videoId].history
			history.push(payload[0])
			// hidden 이 "T" 인 데이터는 배열 맨 뒤쪽으로 보냄(history undo/redo 문제 때문)
			for (let i = history.length - 1; i >= 0; i -= 1) {
				if (history[i].hidden === 'T') {
					history.push(history[i])
					history.splice(i, 1)
				}
			}
			console.log(state[payload[1].videoId].history)
			state[payload[1].videoId].history = history
		},

		undoHistory: (state, payload) => {
			let history = state[payload[1].videoId].history
			const r = history.find(entry => entry.id === payload[0])
			if (r) {
				r.hidden = 'T'
				state[payload[1].videoId].history = history
			}
		},

		redoHistory: (state, payload) => {
			let history = state[payload[1].videoId].history
			const r = history.find(entry => entry.id === payload[0])
			if (r) {
				r.hidden = 'F'
				state[payload[1].videoId].history = history
			}
		},
	},
})
