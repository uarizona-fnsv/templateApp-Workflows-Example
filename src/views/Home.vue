<template>
	<!-- User Fluid to go full width -->
	<v-container fluid>
		
	</v-container>
</template>

<script setup>
	import { api, ui } from '@/stores'
</script>

<script>

export default {
data: () => ({}),

async mounted() {
	api.fetchBuildings()
	const confirmed = await ui.confirm({
		title: 'Confirm',
		body: 'Everything is Fine',
		type: 'Ok',  // 'YesNo' or 'Ok'
	})
	if (confirmed) {
		console.log('Clicked OK or Yes');
	} else {
		console.log('Clicked No');
	}
},

computed: {},
methods: {},

}
</script>

<style>
</style>

