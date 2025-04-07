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
		body: 'We dont do these things\n because they are easy.\n\nWe do them because we\n thought they would be easy.',
		type: 'Ok',  // 'YesNo' or 'Ok'
	})
	if (confirmed) {
			console.log('Cliked OK or Yes');
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

