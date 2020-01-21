import Vue from 'vue'
import App from './App.vue'
import { store } from './store'
import vuetify from './plugins/vuetify'
import opencv from './plugins/opencv'
import '@babel/polyfill'
import 'roboto-fontface/css/roboto/roboto-fontface.css'
import '@mdi/font/css/materialdesignicons.css'

Vue.config.productionTip = false

new Vue({
	vuetify,
	opencv,
	store,
	render: h => h(App),
}).$mount('#app')
