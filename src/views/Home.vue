<template>
	<v-container fluid>
		<RequestCode />
	</v-container>
</template>

<script setup>
	import RequestCode from '@/components/RequestCode.vue'
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

