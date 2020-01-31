<template>
	<div>
		<!-- 확대축소 옵션 -->
		<v-card max-width="150" class="" dark>
			<v-subheader>도구</v-subheader>
			<v-divider dark></v-divider>

			<!-- <v-item-group>
				<v-container class="pt-1 pb-0" height="200px">
					<v-row>
						<v-col cols="4" md="4" class="pa-2 pt-1 pb-1" @click="setZoomin">
							<v-item v-slot:default="{ active, toggle }">
								<v-card
									:color="active ? 'blue-grey lighten-1' : ''"
									class="d-flex flex-row oneScreen mb-2 align-center"
									width="30"
									height="30"
									@click="toggle"
									flat=""
									light
								>
									<v-icon class="ma-auto">
										mdi-magnify-plus
									</v-icon>
								</v-card>
							</v-item>
						</v-col>

						<v-col cols="4" md="4" class="pa-2 pt-1 pb-1">
							<v-item v-slot:default="{ active, toggle }">
								<v-card
									:color="active ? 'blue-grey lighten-1' : ''"
									class="d-flex flex-row oneScreen mb-2 align-center"
									width="30"
									height="30"
									@click="toggle"
									flat=""
									light
								>
									<v-icon class="ma-auto">
										mdi-magnify-minus
									</v-icon>
								</v-card>
							</v-item>
						</v-col>

						<v-col cols="4" md="4" class="pa-2 pt-1 pb-1" @click="setMove">
							<v-item v-slot:default="{ active, toggle }">
								<v-card
									:color="active ? 'blue-grey lighten-1' : ''"
									class="d-flex flex-row oneScreen mb-2 align-center"
									width="30"
									height="30"
									@click="toggle"
									flat=""
									light
								>
									<v-icon class="ma-auto">
										mdi-cursor-move
									</v-icon>
								</v-card>
							</v-item>
						</v-col>
					</v-row>
				</v-container>
			</v-item-group> -->

			<v-item-group v-model="action">
				<v-container class="pt-1 pb-0" height="200px">
					<v-row>
						<!-- zoom in tool -->
						<v-col
							cols="4"
							md="12"
							class="d-flex flex-row justify-space-between pa-2 pt-1 pb-1"
						>
							<v-item v-for="n in 4" :key="n" v-slot:default="{ active }">
								<v-card
									:color="active ? 'blue-grey lighten-1' : ''"
									class="oneScreen text-md-center"
									width="30"
									height="30"
									@click="setAction(n)"
									flat=""
									light
								>
									<!-- <div>{{ active }}=>{{ toggle }}</div> -->
									<v-icon v-if="n === 1" class="ma-auto">
										mdi-magnify-plus
									</v-icon>
									<v-icon v-if="n === 2" class="ma-auto">
										mdi-magnify-minus
									</v-icon>
									<v-icon v-if="n === 3" class="ma-auto">
										mdi-cursor-move
									</v-icon>
									<v-icon v-if="n === 4" class="ma-auto">
										mdi-restore
									</v-icon>
								</v-card>
							</v-item>
						</v-col>
					</v-row>
				</v-container>
			</v-item-group>
		</v-card>
	</div>
</template>

<script>
import { mapState } from 'vuex'
export default {
	computed: mapState({
		video1: state => {
			return state.video1
		},
		video2: state => {
			return state.video2
		},
		video3: state => {
			return state.video3
		},
		video4: state => {
			return state.video4
		},
		video5: state => {
			return state.video5
		},
		video6: state => {
			return state.video6
		},
	}),

	data: () => ({
		action: null,
		state: '',
		selectedVideo: '',
		zoom: 1,
		isDown: false,
		moveOffset: [0, 0],
	}),

	watch: {
		state: function(e) {
			this.setCursor(e)
		},
	},

	mounted() {
		this.setSelectedVideo()
	},

	methods: {
		setAction(n) {
			if (this.action === n - 1) {
				this.action = null
				this.state = null
			} else {
				this.action = n - 1
				switch (this.action) {
					case 0:
						this.state = 'zoomin'
						break
					case 1:
						this.state = 'zoomout'
						break
					case 2:
						this.state = 'move'
						break
					default:
						this.state = 'reset'
						this.setReset()
						break
				}
			}
		},

		setCursor(state) {
			const video = document.querySelectorAll('.video')
			switch (state) {
				case 'zoomin': {
					video.forEach(entry => {
						entry.nextElementSibling.style.display = 'none'
						entry.style.cursor = 'zoom-in'
					})
					break
				}

				case 'zoomout': {
					video.forEach(entry => {
						entry.nextElementSibling.style.display = 'none'
						entry.style.cursor = 'zoom-out'
					})
					break
				}

				case 'move': {
					video.forEach(entry => {
						entry.nextElementSibling.style.display = 'none'
						entry.style.cursor = 'move'
					})
					break
				}

				default: {
					video.forEach(entry => {
						entry.nextElementSibling.style.display = ''
						entry.style.cursor = ''
					})
					break
				}
			}
		},

		setSelectedVideo() {
			const videoArray = document.querySelectorAll('.video')
			// eslint-disable-next-line no-unused-vars
			const self = this

			videoArray.forEach(function(video) {
				video.addEventListener('mousedown', function(e) {
					self.selectedVideo = e.target
					if (self.state === 'move') {
						self.isDown = true
						self.moveOffset = [
							self.selectedVideo.offsetLeft - e.clientX,
							self.selectedVideo.offsetTop - e.clientY,
						]
					}
					if (self.state === 'zoomin' || self.state === 'zoomout') {
						self.setCentering(e)
						self.setPressing()
					}
				})
			})

			videoArray.forEach(video => {
				video.addEventListener('mouseup', function() {
					if (self.state === 'move') self.isDown = false
					self.selectedVideo = ''
					if (self.state === 'reset') {
						// self.selectedVideo.style.left = 0
						// self.selectedVideo.style.top = 0
					}
				})
			})

			videoArray.forEach(video => {
				video.addEventListener('mouseout', function() {
					console.log('mouseout')
					if (self.state === 'move') self.isDown = false
					self.selectedVideo = ''
				})
			})

			videoArray.forEach(video => {
				video.addEventListener('mousemove', function(e) {
					e.preventDefault()
					if (self.state === 'move' && self.isDown === true) {
						self.selectedVideo.style.left = `${e.clientX +
							self.moveOffset[0]}px`
						self.selectedVideo.style.top = `${e.clientY + self.moveOffset[1]}px`
					}
				})
			})
		},

		setPressing() {
			if (this.selectedVideo) {
				switch (this.state) {
					case 'zoomin': {
						console.log('zoomin')
						this.zoom = this.zoom + 0.1
						this.selectedVideo.style.transform = `scale(${this.zoom})`
						break
					}
					case 'zoomout': {
						console.log('zoomout')
						this.zoom = this.zoom - 0.1
						this.selectedVideo.style.transform = `scale(${this.zoom})`
						break
					}
					case 'move': {
						console.log('move')
						break
					}
					default:
						break
				}
				setTimeout(() => {
					this.setPressing()
				}, 200)
			}
		},

		setCentering(evt) {
			if (this.state === 'zoomin' || this.state === 'zoomout') {
				console.log('setCentering')
				const vContainer = this.selectedVideo.parentElement
				const vcCenterX = vContainer.offsetWidth / 2
				const vcCenterY = vContainer.offsetHeight / 2
				const transformX = vcCenterX - evt.layerX
				const transformY = vcCenterY - evt.layerY
				this.selectedVideo.style.left = 0
				this.selectedVideo.style.top = 0
				this.selectedVideo.style.left = `${parseInt(
					this.selectedVideo.style.left.replace('px', ''),
					10,
				) + transformX}px`
				this.selectedVideo.style.top = `${parseInt(
					this.selectedVideo.style.top.replace('px', ''),
					10,
				) + transformY}px`
			}
		},

		setReset() {
			const videoArray = document.querySelectorAll('.video')
			// eslint-disable-next-line no-unused-vars
			const self = this
			console.log('setReset')
			videoArray.forEach(function(video) {
				console.log(video.attributes.style)
				if (!video.attributes.style || video.attributes.style !== '') {
					video.removeAttribute('style')
				}
			})
		},
	},
}
</script>
