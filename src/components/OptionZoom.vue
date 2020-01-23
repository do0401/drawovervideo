<template>
	<div>
		<!-- 확대축소 옵션 -->
		<v-card max-width="150" class="" dark>
			<v-subheader>도구</v-subheader>
			<v-divider dark></v-divider>

			<v-item-group>
				<v-container class="pt-1 pb-0" height="200px">
					<v-row>
						<!-- zoom in tool -->
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

						<!-- zoom out tool -->
						<v-col cols="4" md="4" class="pa-2 pt-1 pb-1" @click="setZoomout">
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

						<!-- move tool -->
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
			</v-item-group>
		</v-card>
	</div>
</template>

<script>
export default {
	data: () => ({
		state: null,
	}),

	watch: {
		state: function(e) {
			console.log(e)
			const video = document.querySelectorAll('.video')
			switch (e) {
				// case '': {
				// 	video.forEach(entry => {
				// 		entry.nextElementSibling.style.display = ''
				// 		entry.style.cursor = ''
				// 	})
				// 	break
				// }

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
	},

	methods: {
		setZoomin() {
			if (this.state === 'zoomin') return (this.state = '')
			this.state = 'zoomin'
		},
		setZoomout() {
			if (this.state === 'zoomout') return (this.state = '')
			this.state = 'zoomout'
		},
		setMove() {
			if (this.state === 'move') return (this.state = '')
			this.state = 'move'
		},
	},
}
</script>
