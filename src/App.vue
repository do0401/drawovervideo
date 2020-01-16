<template>
	<v-app>
		<!-- <Integration /> -->
		<Video />
		<Option />
	</v-app>
</template>

<script>
// import Integration from './components/Integration'
import Video from './components/Video'
import Option from './components/Option'

export default {
	name: 'App',

	components: {
		// Integration,
		Video,
		Option,
	},

	data: () => ({
		//
	}),
}
</script>
