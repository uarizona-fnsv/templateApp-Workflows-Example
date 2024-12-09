<template>
	<v-container v-if="codeHistory" class="pt-8" >	
		<v-row class='text-h5 mb-6'>Sample Page Demonstrating Data Table w Search</v-row>
		<v-row>
			<v-col cols=2 align="center"><div class='text-h6'>FALL 2024</div></v-col>
			<v-col><v-text-field 
			        v-model="search"
			        label="Search"
			        prepend-inner-icon="mdi-magnify"
			        variant="outlined"
			        hide-details
			        density="compact"
			        single-line
			      ></v-text-field>
			  </v-col>
		</v-row>
		<v-row class="mt-0">
			<v-col cols=2 align="center">
				<div class="mt-3">Used</div>
				<v-progress-circular :model-value="codeHistory[0].pctUsed" 
					:size="100" :width="15" color="teal"
					class="mt-4">
		      		<template v-slot:default> {{ codeHistory[0].pctUsed }}%</template>
		    	</v-progress-circular>		    	
    		</v-col>
    		<v-col>    			
				<v-data-table density="comfortable" 
					:items="codeHistory[0].details" 
					:headers="headers"
					:search="search">
				</v-data-table>
			</v-col>
		</v-row>
	</v-container>
</template>

<script setup>
import { api } from '@/stores'   
import codeHistory from '@/sampleData/codeHistory.js'
</script>

<script>


export default {
data: () => ({

	codeType: { codeType: "TIA" },
	search: null,
	headers: [
	  	{ title: "Code", 		value: "code" },
	  	{ title: "NetID", 		value: "netID" },
	  	{ title: "Issued", 		value: "acquired" },
	  	{
          	title: 'Validity ',
          	align: 'center',
          	children: [
            	{ title: 'Start Date', 	value: 'validFrom' },
            	{ title: 'End Date', 		value: 'validTo', align:'end' },
          	],
        },
	],
}),

async mounted() {
	//this.codeHistory = await api.fetchCodeHistory(this.codeType)
	this.calculatePctUsed()
},

computed: {},

methods: {
	calculatePctUsed() {
        codeHistory.forEach(item => {
            let totalCodes = item.details.length
            let usedCodes = item.details.filter(detail => detail.netID).length
            item.pctUsed = Math.floor((usedCodes / totalCodes) * 100)
        })
    },
},

}
</script>

<style>
</style>

