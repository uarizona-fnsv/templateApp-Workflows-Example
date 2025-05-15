<template>
	<v-autocomplete
		:model-value="dataProp"
		v-model:search="search"
		:name="name"
		class="rounded-0"
		ref="autocomplete"
		autofocus
		:label="label"
		:loading="loading"
		:items="items"
		no-filter
		hide-details
		:variant="variant"
		:readonly="readonly"
		:disabled="disabled"
		:density="density"
		@update:modelValue="returnSelection"
		@keydown.enter.prevent="handleEnterKey"
		:clearable="!readonly"
		:rules="rules"
		item-title="name"
		item-value="netid"
		:key="key1"
		return-object>

		<template v-slot:no-data>
			<v-list-item>
				Begin typing Name, NetID, EmplID, or Tap Device
			</v-list-item>
		</template>

		<template v-slot:item="{ props, item }">
			<v-list-item v-bind="props" :title="autocompleteName(item)" :subtitle="item?.raw?.titleHighest">
			</v-list-item>
		</template>

		<template v-slot:selection="{ item }">
			<v-list-item :title="autocompleteName(item)" :subtitle="item?.raw?.titleHighest">
			</v-list-item>
		</template>
	</v-autocomplete>
</template>

<script setup>
import _ from 'lodash'
import { app, api } from '@/stores'  // Import api from the store
</script>

<script>
export default {
	data: (props) => ({
		loading: false,
		items: props.dataProp ? [props.dataProp] : [], // Prepopulate items list with any existing data
		search: null,
		select: props.dataProp,
		fetchCounter: 0, // Counter to track fetch calls
	}),

	watch: {
		// This handles search as you type, it handles name, netid, and emplid(if its exactly 8 digits)
		search(val) {
			if (
				val &&
				val !== this.select &&
				val.length > 3
			) {	this.querySelections(val); }
		}
	},

	props: [
		'dataProp', 'label', 'readonly', 'name', 'rules', 'key1',
		'variant', 'autoClear', 'disabled', 'density'
	],

	methods: {
		autocompleteName(item) {
			return item.raw && item.raw.name + " (" + item.raw.netid + ")"
		},

		returnSelection(value) {
			console.log("Returning selection: ", value)
			if (value.employeeID) { value.emplid = value.employeeID } // A mapping to help the next step
			this.$emit('return-selection', value)

			// If using this prop, it will reset for additional entry
			if (this.autoClear) {
				this.$refs.autocomplete.blur()
				this.search = null
				this.select = null
			}
		},

		querySelections: _.debounce(function (v) { 
			this.fetchEmployeeSearch(v);
		}, 500),

		async fetchEmployeeSearch(v) {
			this.loading = true;
			const currentFetchId = ++this.fetchCounter; // Increment and store the current fetch ID
			let payload = { search: v };
			const response = await fetch("https://api.ba.arizona.edu/common/personSearch", {
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json',
					'Authorization': "Bearer " + api.token
				},
				method: "POST",
				body: JSON.stringify(payload)
			});
			const data = await response.json();
			
			// Only update items if this is the latest fetch
			if (currentFetchId === this.fetchCounter) {
				this.items = data;
				this.loading = false;
			}
			return data;

		},

		// For device number search from a card reader which hits Enter automatically after number
		// Can be 11, or 16.
		async handleEnterKey() {
			if (/^\d+$/.test(this.search)) {
				app.checkedInPerson = null
				this.loading = true
				
				// If an 11, or 16 digit number is entered, go directly to the employee search
				if (!isNaN(this.search) && [11, 16].includes(this.search.length)) {
					const people = await this.fetchEmployeeSearch(this.search)
					this.loading = false				
					console.log("Person found by card number: ", people);

					let person = Array.isArray(people) && people.length > 0 ? people[0] : undefined;

					if (person) {
						if (person.employeeID) { person.emplid = person.employeeID }
						this.returnSelection(person);
						this.$refs.autocomplete.blur();
						this.$nextTick(() => {
							this.$refs.autocomplete.focus();
						});
					} else { 
						this.returnSelection({name: 'Not Found'})
					}
				}
			}
		}
	}
}
</script>