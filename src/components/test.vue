<template>
	<div>
		<div id="app">
			<v-app id="inspire">
				<v-sheet class="mx-auto" elevation="8" max-width="800">
					<v-slide-group v-model="model" class="pa-4" center-active show-arrows>
						<v-slide-item
							v-for="n in 15"
							:key="n"
							v-slot:default="{ active, toggle }"
						>
							<v-card
								:color="active ? 'primary' : 'grey lighten-1'"
								class="ma-4"
								height="100"
								width="100"
								@click="toggle"
							>
								<div>{{ active }}=>{{ toggle }}</div>
								<v-row align="center" justify="center">
									<div>{{ n }}</div>
									<v-scale-transition>
										<v-icon
											v-if="active"
											color="white"
											size="48"
											v-text="'mdi-close-circle-outline'"
										></v-icon>
									</v-scale-transition>
								</v-row>
							</v-card>
						</v-slide-item>
					</v-slide-group>

					<v-slide-group v-model="model" class="pa-4" center-active show-arrows>
						<v-slide-item
							v-for="n in 15"
							:key="n"
							v-slot:default="{ active, toggle }"
						>
							<v-card
								:color="active ? 'primary' : 'grey lighten-1'"
								class="ma-4"
								height="100"
								width="100"
								@click="onCardClick(n)"
							>
								<v-row class="fill-height" align="center" justify="center">
									<div>{{ n }}</div>
									<v-scale-transition>
										<v-icon
											v-if="active"
											color="white"
											size="48"
											v-text="'mdi-close-circle-outline'"
										></v-icon>
									</v-scale-transition>
								</v-row>
							</v-card>
						</v-slide-item>
					</v-slide-group>
				</v-sheet>
			</v-app>
		</div>
	</div>
</template>
