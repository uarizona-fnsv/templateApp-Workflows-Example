<template>
	<v-container fluid>
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

