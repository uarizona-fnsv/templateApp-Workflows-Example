<template>
	<v-autocomplete
		 :autofocus="autofocus"
	    :model-value="selectedBuilding"
        ref="buildingAutocomplete"
        class="buildingAutocomplete"
        :items="buildingItems"        
        item-title="name"
        item-value="bldgAlpha"        
        variant="outlined"
        :custom-filter="customFilter"
        hide-details
        clearable
        :placeholder="placeholder"
        :disabled="disabled"
        @update:modelValue="returnSelection"
        @keyup.enter="directEnter"
        :readonly="readonly"
        return-object>
       	<template v-slot:item="{ props, item }">
      		<v-row no-gutters align="center" class="pl-4 pb-1">
	      		<v-col class="flex-grow-0 flex-shrink-1">
	      			<v-avatar color="grey-darken-3" class="white-text rounded" rounded="0">
	      				{{item?.raw.bldgAlpha}}
	      			</v-avatar> 
	      		</v-col>
	      		<v-col class="flex-grow-1 flex-shrink-0">
	      			<v-list-item
		              	v-bind="props"
		              	:title="item?.raw.name"
		              	:subtitle="item?.raw.address">
	   				</v-list-item>
	   			 </v-col>
      		</v-row>            	 
        	</template>

         <template v-slot:selection="{ item }">
            <v-row no-gutters align="center">
	      		<v-col class="flex-grow-0 flex-shrink-1">
	      			<v-avatar color="grey-darken-3" class="white-text rounded" rounded="0">
	      				{{item?.raw.bldgAlpha}}
	      			</v-avatar> 
	      		</v-col>
	      		<v-col class="flex-grow-1 flex-shrink-0">
	      			<v-list-item
		              	:title="item?.raw.name"
		              	:subtitle="item?.raw.address">
	   				</v-list-item>
	   			 </v-col>
      		</v-row>         	
         </template>
      </v-autocomplete>
</template>

<script setup>
import { api } from '@/stores'
</script>

<script>

export default {

props: {
    selectedBuilding: 	{ type: Object },
    placeholder: 			{ type: String },
    readonly: 				{ type: Boolean },
    autofocus: 			{ type: Boolean },
    disabled: 				{ type: Boolean },
    bmBuildings:			{ type: Boolean }
},

computed : {
	
	// If using bmBuildings prop, use only buildings with building managers
	buildingItems() {		
		// Filtered Buildings are one that are present in the building manager list
		const filteredBuildings = api.buildings.filter(building => {
        return api.buildingManagerList.some(manager => manager.bldgAlpha === building.bldgAlpha);
      })
		return this.bmBuildings ? filteredBuildings : api.buildings
	}
},

methods : {

	returnSelection(value) {
		this.$refs.buildingAutocomplete.blur();
		this.$emit('return-selection', value)	
	},	

	directEnter(e) {
    	const foundBuilding = api.buildings.find(building => building.bldgAlpha === e.target.value.toUpperCase())
    	if (foundBuilding) { this.$emit('return-selection', foundBuilding) }

    	this.$refs.buildingAutocomplete.blur()
	},

   customFilter (itemText, queryText, item) {
		//console.log(itemText, queryText, item.raw)
		
        const bldgAlpha = item.raw.bldgAlpha.toLowerCase()
        const searchBlob = 	item.raw.bldgAlpha + item.raw.name + item.raw.address + item.raw.city + item.raw.state + item.raw.abbrev + 
        					item.raw.commonName + item.raw.shortName + item.raw.aliasName

        // If Search is 3 or less, use only the bldgAlpha.  Otherwise search the blob.
        if (queryText.length > 3 ) {
        	return searchBlob.toLowerCase().indexOf(queryText.toLowerCase()) > -1
        } else {
        	return bldgAlpha.indexOf(queryText.toLowerCase()) > -1 
        }
    },
},
}

</script>

<style>


</style>
