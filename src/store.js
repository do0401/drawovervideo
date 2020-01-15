import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export const store = new Vuex.Store({
	state: {
		history: [],
		storage: {
			line: [],
			rect: [],
			circle: [],
			angle: [],
			free: [],
		},
		drawType: null,
		drawOptions: {
			strokeColor: '#E62B2B',
			strokeWidth: 3,
			dash: [0, 0],
			arrow: false,
		},
	},

	getters: {
		strokeColor: function(state) {
			return state.drawOptions.strokeColor;
		},
		strokeWidth: function(state) {
			return state.drawOptions.strokeWidth;
		},
		dash: function(state) {
			return state.drawOptions.dash;
		},
		arrow: function(state) {
			return state.drawOptions.arrow;
		},
	},

	mutations: {
		pushLine: (state, payload) => {
			state.storage.line.push(payload);
			// hidden 이 "T" 인 데이터는 배열 맨 뒤쪽으로 보냄(history undo/redo 문제 때문)
			for (let i = state.storage.line.length - 1; i >= 0; i -= 1) {
				if (state.storage.line[i].hidden === 'T') {
					state.storage.line.push(state.storage.line[i]);
					state.storage.line.splice(i, 1);
				}
			}

			// eslint-disable-next-line no-console
			console.log('linestorage', state.storage.line);
		},

		pushRect: (state, payload) => {
			state.storage.rect.push(payload);
			// hidden 이 "T" 인 데이터는 배열 맨 뒤쪽으로 보냄(history undo/redo 문제 때문)
			for (let i = state.storage.rect.length - 1; i >= 0; i -= 1) {
				if (state.storage.rect[i].hidden === 'T') {
					state.storage.rect.push(state.storage.rect[i]);
					state.storage.rect.splice(i, 1);
				}
			}

			// eslint-disable-next-line no-console
			console.log('rectstorage', state.storage.rect);
		},

		pushCircle: (state, payload) => {
			state.storage.circle.push(payload);
			// hidden 이 "T" 인 데이터는 배열 맨 뒤쪽으로 보냄(history undo/redo 문제 때문)
			for (let i = state.storage.circle.length - 1; i >= 0; i -= 1) {
				if (state.storage.circle[i].hidden === 'T') {
					state.storage.circle.push(state.storage.circle[i]);
					state.storage.circle.splice(i, 1);
				}
			}
			// eslint-disable-next-line no-console
			console.log('circlestorage', state.storage.circle);
		},

		pushAngle: (state, payload) => {
			state.storage.angle.push(payload);
			// hidden 이 "T" 인 데이터는 배열 맨 뒤쪽으로 보냄(history undo/redo 문제 때문)
			for (let i = state.storage.angle.length - 1; i >= 0; i -= 1) {
				if (state.storage.angle[i].hidden === 'T') {
					state.storage.angle.push(state.storage.angle[i]);
					state.storage.angle.splice(i, 1);
				}
			}
			// eslint-disable-next-line no-console
			console.log('anglestorage', state.storage.angle);
		},

		pushFree: (state, payload) => {
			state.storage.free.push(payload);
			// hidden 이 "T" 인 데이터는 배열 맨 뒤쪽으로 보냄(history undo/redo 문제 때문)
			for (let i = state.storage.free.length - 1; i >= 0; i -= 1) {
				if (state.storage.free[i].hidden === 'T') {
					state.storage.free.push(state.storage.free[i]);
					state.storage.free.splice(i, 1);
				}
			}
			// eslint-disable-next-line no-console
			console.log('freestorage', state.storage.free);
		},

		initStorage: state => {
			state.storage.line = [];
			state.storage.rect = [];
			state.storage.circle = [];
			state.storage.angle = [];
			state.storage.free = [];
		},

		addHistory: (state, payload) => {
			state.history.push(payload);
			// hidden 이 "T" 인 데이터는 배열 맨 뒤쪽으로 보냄(history undo/redo 문제 때문)
			for (let i = state.history.length - 1; i >= 0; i -= 1) {
				if (state.history[i].hidden === 'T') {
					state.history.push(state.history[i]);
					state.history.splice(i, 1);
				}
			}
		},

		undoHistory: (state, payload) => {
			const r = state.history.find(entry => entry.id === payload);
			if (r) {
				r.hidden = 'T';
			}
		},

		redoHistory: (state, payload) => {
			const r = state.history.find(entry => entry.id === payload);
			if (r) {
				r.hidden = 'F';
			}
		},
	},
});
