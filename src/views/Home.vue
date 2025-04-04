<template>
	<!-- User Fluid to go full width -->
	<v-container fluid>
		
		<!-- Example -->
		<v-row class="fill-height pt-16" >
			<v-col cols="12" class="text-center">
				<h2>We don't do these things because they are easy.</h2>
				<h2>We do them because we thought they would be easy.</h2>
			</v-col>
		</v-row>

	</v-container>
</template>

<script setup>
	import { api } from '@/stores'
</script>

<script>

export default {
data: () => ({}),

mounted() {
	api.fetchBuildings()
},

computed: {},
methods: {},

}
</script>

<style>
</style>

