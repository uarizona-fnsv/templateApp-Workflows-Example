<!-- 
// This component is designed to be used as-is, should not need to modify this.  
// Refer to ExampleApp and many other apps to see how it is implemented
-->

<template >
	<v-autocomplete 
		:model-value="dataProp"	
		v-model:search="search"	
		:name="name"
		class="rounded-0"
		ref="autocomplete"
		:label="label"
		:loading="loading"
		:items="items"
		no-filter
		hide-details
		:variant="variant"
		:readonly="readonly"
		:disabled="disabled"
		@update:modelValue="returnSelection"
		:clearable="!readonly"
		:rules="rules"
		item-title="name"
      item-value="netid"
      :key="key1"
		return-object>
		<template v-slot:no-data>
			<v-list-item>
				Begin typing Name, NetID, Catcard, EmplID
			</v-list-item>
      </template>
		<template v-slot:item="{ props, item }">
			<v-list-item
                  v-bind="props"
                  :title="autocompleteName(item)"
                  :subtitle="item?.raw?.titleHighest">
            </v-list-item>
      </template>
      <template v-slot:selection="{ item }">
         <v-list-item
                  :title="autocompleteName(item)"
                  :subtitle="item?.raw?.titleHighest">
         </v-list-item>        
      </template>
	</v-autocomplete>
</template>

<script setup>
import _ from 'lodash'
import { user } from '@/stores'
</script>


<script>
export default {
data: (props) => ({ 
		loading: false,
		items: props.dataProp ? [props.dataProp] : [], // Prepopulate items list with any existing data
		search: null,
		select: props.dataProp
}),

props: [ 'dataProp', 'label', 'readonly', 'name', 'rules', 'key1', 'variant', 'autoClear', 'disabled'], 

// Only perform search if more than 3 letter characters, or exactly 8 or 16 numeric characters. EmplID / Catcard #
watch: {
  search(val) {
    if (
      val &&
      val !== this.select &&
      ((isNaN(val) && val.length > 3) || (!isNaN(val) && (val.length === 8 || val.length === 16)))
    ) {
      this.querySelections(val);
    }
  }
}, 


methods: {
	autocompleteName(item) {
		return item.raw && item.raw.name + " (" + item.raw.netid + ")"
	},

	returnSelection(value) {
		this.$emit('return-selection', value)
		
		// If using this prop, it will reset for additional entry
		if (this.autoClear) {
			this.$refs.autocomplete.blur()				
			this.search=null
			this.select=null
		}
	},		

	querySelections: _.debounce(function (v) { 
		this.loading = true			
		let payload = { 'search': v }
		fetch("https://api.ba.arizona.edu/common/employeeSearch",			
			{
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json',
					'Authorization': user.token
				},
				method: "POST",
                 body: JSON.stringify(payload)
			})
			.then(response => response.json())
			.then(data => { 
				//this.items = data.filter(item => item.status === "Active") // changed 6/20/2024 to include non actives.
				this.items = data
				this.loading = false
			})
	}, 500),
}
}
</script>

<style>
.v-list__tile--highlighted {
	height: 70px;
}

.v-list-item__content {
	flex-grow: 0;
	flex-shrink: 0;
	flex-basis: auto;
}

</style>

