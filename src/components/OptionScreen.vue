<template>
	<div>
		<!-- 화면 옵션 -->
		<v-card max-width="150" class="" dark>
			<v-subheader>화면 옵션</v-subheader>
			<v-divider dark></v-divider>

			<v-item-group mandatory>
				<v-container class="pt-1 pb-0" height="200px">
					<v-row>
						<v-col
							cols="6"
							md="6"
							class="oneScreen pa-2 pt-1 pb-1"
							@click="setScreenOption"
						>
							<!-- 화면1 -->
							<v-item v-slot:default="{ active, toggle }">
								<v-card
									:color="active ? 'blue-grey lighten-1' : ''"
									class="d-flex flex-row oneScreen mb-2 align-center"
									height="50"
									@click="toggle"
									flat=""
									light
								>
								</v-card>
							</v-item>
						</v-col>
						<!-- 좌1우1 -->
						<v-col
							cols="6"
							md="6"
							class="oneByOne pa-2 pt-1 pb-1"
							@click="setScreenOption"
						>
							<v-item v-slot:default="{ active, toggle }">
								<v-card
									class="d-flex flex-row oneByOne mb-2 align-center"
									height="50"
									@click="toggle"
									flat=""
								>
									<v-card
										:color="active ? 'blue-grey lighten-1' : ''"
										class="oneByOne pa-2 mr-1"
										outlined
										width="29"
										height="50"
										light
									></v-card>
									<v-card
										:color="active ? 'blue-grey lighten-1' : ''"
										class="oneByOne pa-2"
										outlined
										width="29"
										height="50"
										light
									></v-card>
								</v-card>
							</v-item>
						</v-col>
						<!-- 좌1우2 -->
						<v-col
							cols="6"
							md="6"
							class="oneByTwo pa-2 pt-1 pb-1"
							@click="setScreenOption"
						>
							<v-item v-slot:default="{ active, toggle }">
								<v-card
									class="d-flex flex-row oneByTwo mb-2 align-center"
									height="50"
									@click="toggle"
									flat=""
								>
									<v-card
										:color="active ? 'blue-grey lighten-1' : ''"
										class="oneByTwo pa-2 mr-1"
										outlined
										width="29"
										height="50"
										light
									></v-card>
									<div
										class="d-flex flex-column oneByTwo mb-2 align-center"
										width="29"
										height="50"
									>
										<v-card
											:color="active ? 'blue-grey lighten-1' : ''"
											class="oneByTwo pa-2 mb-1 mt-2"
											outlined
											width="29"
											height="23"
											light
										></v-card>
										<v-card
											:color="active ? 'blue-grey lighten-1' : ''"
											class="oneByTwo pa-2"
											outlined
											width="29"
											height="23"
											light
										></v-card>
									</div>
								</v-card>
							</v-item>
						</v-col>
						<!-- 좌2우1 -->
						<v-col
							cols="6"
							md="6"
							class="twoByOne pa-2 pt-1 pb-1"
							@click="setScreenOption"
						>
							<v-item v-slot:default="{ active, toggle }">
								<v-card
									class="d-flex flex-row twoByOne mb-2 align-center"
									height="50"
									@click="toggle"
									flat=""
								>
									<div
										class="d-flex flex-column twoByOne mb-2 align-center"
										width="29"
										height="50"
									>
										<v-card
											:color="active ? 'blue-grey lighten-1' : ''"
											class="twoByOne pa-2 mb-1 mt-2"
											outlined
											width="29"
											height="23"
											light
										></v-card>
										<v-card
											:color="active ? 'blue-grey lighten-1' : ''"
											class="twoByOne pa-2"
											outlined
											width="29"
											height="23"
											light
										></v-card>
									</div>
									<v-card
										:color="active ? 'blue-grey lighten-1' : ''"
										class="twoByOne pa-2 ml-1"
										outlined
										width="29"
										height="50"
										light
									></v-card>
								</v-card>
							</v-item>
						</v-col>
						<!-- 좌2우2 -->
						<v-col
							cols="6"
							md="6"
							class="twoByTwo pa-2 pt-1 pb-1"
							@click="setScreenOption"
						>
							<v-item v-slot:default="{ active, toggle }">
								<v-card
									class="d-flex flex-row twoByTwo mb-2 align-center"
									height="50"
									@click="toggle"
									flat
								>
									<div
										class="d-flex flex-column twoByTwo align-center"
										width="29"
										height="50"
									>
										<v-card
											:color="active ? 'blue-grey lighten-1' : ''"
											class="twoByTwo pa-2"
											outlined
											width="27"
											height="23"
											light
										></v-card>
										<v-card
											:color="active ? 'blue-grey lighten-1' : ''"
											class="twoByTwo -2 mt-1"
											outlined
											width="27"
											height="23"
											light
										></v-card>
									</div>
									<div
										class="d-flex flex-column twoByTwo align-center"
										width="28"
										height="50"
									>
										<v-card
											:color="active ? 'blue-grey lighten-1' : ''"
											class="twoByTwo pa-2 ml-1"
											outlined
											width="28"
											height="23"
											light
										></v-card>
										<v-card
											:color="active ? 'blue-grey lighten-1' : ''"
											class="twoByTwo pa-2 ml-1 mt-1"
											outlined
											width="28"
											height="23"
											light
										></v-card>
									</div>
								</v-card>
							</v-item>
						</v-col>
						<!-- 위3아래3 -->
						<v-col
							cols="6"
							md="6"
							class="threeByThree pa-2 pt-1"
							@click="setScreenOption"
						>
							<v-item v-slot:default="{ active, toggle }">
								<v-card
									class="d-flex flex-column threeByThree mb-2 align-center"
									height="50"
									@click="toggle"
									flat
								>
									<div
										class="d-flex flex-row threeByThree align-center"
										width="59"
										height="50"
									>
										<v-card
											:color="active ? 'blue-grey lighten-1' : ''"
											class="threeByThree pa-1"
											outlined
											width="17"
											height="23"
											light
										></v-card>
										<v-card
											:color="active ? 'blue-grey lighten-1' : ''"
											class="threeByThree pa-1 mr-1 ml-1"
											outlined
											width="17"
											height="23"
											light
										></v-card>
										<v-card
											:color="active ? 'blue-grey lighten-1' : ''"
											class="threeByThree pa-1"
											outlined
											width="17"
											height="23"
											light
										></v-card>
									</div>
									<div
										class="d-flex flex-row threeByThree align-center"
										width="59"
										height="50"
									>
										<v-card
											:color="active ? 'blue-grey lighten-1' : ''"
											class="threeByThree pa-1 mt-1"
											outlined
											width="17"
											height="23"
											light
										></v-card>
										<v-card
											:color="active ? 'blue-grey lighten-1' : ''"
											class="threeByThree pa-1 mt-1 mr-1 ml-1"
											outlined
											width="17"
											height="23"
											light
										></v-card>
										<v-card
											:color="active ? 'blue-grey lighten-1' : ''"
											class="threeByThree pa-1 mt-1"
											outlined
											width="17"
											height="23"
											light
										></v-card>
									</div>
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
	// data: () => {},

	methods: {
		setScreenOption(e) {
			// console.log(e)
			let classList = e.target.classList
			if (
				!classList.contains('v-item--active') &&
				classList.contains('v-sheet')
			) {
				classList =
					e.target.parentNode.attributes.tabindex !== undefined
						? e.target.parentNode.classList
						: e.target.parentNode.parentNode.classList
			}

			if (!classList.contains('v-item--active')) return

			const checkOption = [
				'oneScreen',
				'oneByOne',
				'oneByTwo',
				'twoByOne',
				'twoByTwo',
				'threeByThree',
			]
			// eslint-disable-next-line no-unused-vars
			let selectOption = null
			checkOption.forEach(entry => {
				for (let i = 0; i < classList.length; i++) {
					if (entry === classList[i]) {
						selectOption = entry
					}
				}
			})
			this.$store.state.screen = selectOption
			this.$emit('setScreenOption')
		},
	},
}
</script>
