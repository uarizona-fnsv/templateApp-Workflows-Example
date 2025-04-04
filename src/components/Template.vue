<!-- 
// This is a Vue component template that demonstrates a basic layout using Vuetify's grid system. It includes a container with two rows, each containing three columns.
// You can SaveAs this file to get started with a new component 
-->
<template>
	<v-container>
		<v-row>
			<v-col class="pa-2 ma-2">COLUMN 1</v-col>
			<v-col class="pa-2 ma-2">COLUMN 2</v-col>
			<v-col class="pa-2 ma-2">COLUMN 3</v-col>			
		</v-row>
		<v-row>
			<v-col class="pa-2 ma-2">COLUMN 1</v-col>
			<v-col class="pa-2 ma-2">COLUMN 2</v-col>
			<v-col class="pa-2 ma-2">COLUMN 3</v-col>			
		</v-row>
	</v-container>
</template>

<script setup>
import { user } from '@/stores'
</script>

<script>
export default {
data: () => ({
	exampleVariable: null
}),

computed: {
	exampleComputed() {		
		return exampleVariable
	},
},

methods : {
	clickHandler() {
		console.log("Clicked")
	},
},
}

</script>

<style>
</style>