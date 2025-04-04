<template>
	<!-- User Fluid to go full width -->
	<v-container fluid>
		
		<!-- Example -->
		<v-row class="fill-height pt-16" >
			<v-col cols="12" class="text-center text-h5">
				<div>We don't do these things</div>
				<div>because they are easy.</div>

				<div class="mt-4">We do them because we</div>
				<div>thought they would be easy.</div>
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

