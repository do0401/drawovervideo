<template>
	<div>
		<!-- 화면 옵션 -->
		<v-card max-width="150" class="" dark>
			<v-list-item>
				<!-- <v-list-item-avatar color="grey"></v-list-item-avatar> -->
				<v-list-item-content class="pa-2">
					<v-list-item-title class="">화면 옵션</v-list-item-title>
				</v-list-item-content>
			</v-list-item>
			<v-divider dark></v-divider>

			<v-item-group>
				<v-container>
					<v-row>
						<v-col cols="12" md="6" class="pa-2">
							<!-- 화면1 -->
							<v-item v-slot:default="{ active, toggle }">
								<v-card
									:color="active ? 'blue-grey lighten-1' : ''"
									class="d-flex flex-row mb-2 align-center"
									height="50"
									@click="toggle"
									flat=""
									light
								>
								</v-card>
							</v-item>
						</v-col>
						<!-- 좌1우1 -->
						<v-col cols="12" md="6" class="pa-2">
							<v-item v-slot:default="{ active, toggle }">
								<v-card
									class="d-flex flex-row mb-2 align-center"
									height="50"
									@click="toggle"
									flat=""
								>
									<v-card
										:color="active ? 'blue-grey lighten-1' : ''"
										class="pa-2 mr-1"
										outlined
										width="29"
										height="50"
										light
									></v-card>
									<v-card
										:color="active ? 'blue-grey lighten-1' : ''"
										class="pa-2"
										outlined
										width="29"
										height="50"
										light
									></v-card>
								</v-card>
							</v-item>
						</v-col>
						<!-- 좌1우2 -->
						<v-col cols="12" md="6" class="pa-2">
							<v-item v-slot:default="{ active, toggle }">
								<v-card
									class="d-flex flex-row mb-2 align-center"
									height="50"
									@click="toggle"
									flat=""
								>
									<v-card
										:color="active ? 'blue-grey lighten-1' : ''"
										class="pa-2 mr-1"
										outlined
										width="29"
										height="50"
										light
									></v-card>
									<div
										class="d-flex flex-column mb-2 align-center"
										width="29"
										height="50"
									>
										<v-card
											:color="active ? 'blue-grey lighten-1' : ''"
											class="pa-2 mb-1 mt-2"
											outlined
											width="29"
											height="23"
											light
										></v-card>
										<v-card
											:color="active ? 'blue-grey lighten-1' : ''"
											class="pa-2"
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
						<v-col cols="12" md="6" class="pa-2">
							<v-item v-slot:default="{ active, toggle }">
								<v-card
									class="d-flex flex-row mb-2 align-center"
									height="50"
									@click="toggle"
									flat=""
								>
									<div
										class="d-flex flex-column mb-2 align-center"
										width="29"
										height="50"
									>
										<v-card
											:color="active ? 'blue-grey lighten-1' : ''"
											class="pa-2 mb-1 mt-2"
											outlined
											width="29"
											height="23"
											light
										></v-card>
										<v-card
											:color="active ? 'blue-grey lighten-1' : ''"
											class="pa-2"
											outlined
											width="29"
											height="23"
											light
										></v-card>
									</div>
									<v-card
										:color="active ? 'blue-grey lighten-1' : ''"
										class="pa-2 ml-1"
										outlined
										width="29"
										height="50"
										light
									></v-card>
								</v-card>
							</v-item>
						</v-col>
						<!-- 좌2우2 -->
						<v-col cols="12" md="6" class="pa-2">
							<v-item v-slot:default="{ active, toggle }">
								<v-card
									class="d-flex flex-row mb-2 align-center"
									height="50"
									@click="toggle"
									flat
								>
									<div
										class="d-flex flex-column align-center"
										width="29"
										height="50"
									>
										<v-card
											:color="active ? 'blue-grey lighten-1' : ''"
											class="pa-2"
											outlined
											width="27"
											height="23"
											light
										></v-card>
										<v-card
											:color="active ? 'blue-grey lighten-1' : ''"
											class="pa-2 mt-1"
											outlined
											width="27"
											height="23"
											light
										></v-card>
									</div>
									<div
										class="d-flex flex-column align-center"
										width="28"
										height="50"
									>
										<v-card
											:color="active ? 'blue-grey lighten-1' : ''"
											class="pa-2 ml-1"
											outlined
											width="28"
											height="23"
											light
										></v-card>
										<v-card
											:color="active ? 'blue-grey lighten-1' : ''"
											class="pa-2 ml-1 mt-1"
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
						<v-col cols="12" md="6" class="pa-2">
							<v-item v-slot:default="{ active, toggle }">
								<v-card
									class="d-flex flex-column mb-2 align-center"
									height="50"
									@click="toggle"
									flat
								>
									<div
										class="d-flex flex-row align-center"
										width="59"
										height="50"
									>
										<v-card
											:color="active ? 'blue-grey lighten-1' : ''"
											class="pa-1"
											outlined
											width="17"
											height="23"
											light
										></v-card>
										<v-card
											:color="active ? 'blue-grey lighten-1' : ''"
											class="pa-1 mr-1 ml-1"
											outlined
											width="17"
											height="23"
											light
										></v-card>
										<v-card
											:color="active ? 'blue-grey lighten-1' : ''"
											class="pa-1"
											outlined
											width="17"
											height="23"
											light
										></v-card>
									</div>
									<div
										class="d-flex flex-row align-center"
										width="59"
										height="50"
									>
										<v-card
											:color="active ? 'blue-grey lighten-1' : ''"
											class="pa-1 mt-1"
											outlined
											width="17"
											height="23"
											light
										></v-card>
										<v-card
											:color="active ? 'blue-grey lighten-1' : ''"
											class="pa-1 mt-1 mr-1 ml-1"
											outlined
											width="17"
											height="23"
											light
										></v-card>
										<v-card
											:color="active ? 'blue-grey lighten-1' : ''"
											class="pa-1 mt-1"
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
