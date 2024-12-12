<template>
	<v-container>
		<v-row>
			<v-col>
				<v-card width=400 color="UAWarmGray" class="pb-4">

					<!-- CARD HEADER -->
					<v-card color="UABlue" class="pl-1 rounded-lg rounded-b-0 text-white">		
						<v-row no-gutters align="center" class="pa-3">				
							
							<!-- AVATAR -->
							<v-col class="flex-grow-0 flex-shrink-1">
								<v-avatar color="UAMesa" size="x-large" class="white-text text-h6 font-weight-regular rounded-lg" rounded="0" style="letter-spacing: 1px; ">
									<v-icon icon="mdi-account-search"/>
								</v-avatar> 
							</v-col>

							<!-- TITLE AND SUBTITLE -->
							<v-col class="flex-grow-1 flex-shrink-0 ml-1">
								<v-list-item class="listItemAdjust pb-0 text-h5 font-weight-light" style="line-height: 1.2em;">Person Search</v-list-item>
								<div class="px-4 font-weight-light" style="position: relative; top: -5px;">Custom Control</div>
							</v-col>
						</v-row>
					</v-card>

					<!-- CARD CONTENTS -->
					<v-card-text>
						Person Search  works with EDS to return information about employees
					</v-card-text>
					<v-card-text>
						Inputs: netid, name, employeeID or CatCard
					</v-card-text>
					<v-card-text>
						Returns: all that, plus email, title, and Employee Status				
					</v-card-text>

					<v-card-actions>
						<PersonSearch class="px-2" label="Employee Name / NetID / Catcard" variant="outlined" v-on:return-selection="employeeSelected" />
					</v-card-actions>
				</v-card>
			</v-col>
			<v-col>
				<v-card v-if="selectedEmployee" width=400 color="UAWarmGray" class="pb-4">

					<!-- CARD HEADER -->
					<v-card color="UABlue" class="pl-1 rounded-lg rounded-b-0 text-white">		
						<v-row no-gutters align="center" class="pa-3">				
							
							<!-- AVATAR -->
							<v-col class="flex-grow-0 flex-shrink-1">
								<v-avatar color="UAMesa" size="x-large" class="white-text text-h6 font-weight-regular rounded-lg" rounded="0" style="letter-spacing: 1px; ">
									<v-icon icon="mdi-account"/>
								</v-avatar> 
							</v-col>

							<!-- TITLE AND SUBTITLE -->
							<v-col class="flex-grow-1 flex-shrink-0 ml-1">
								<v-list-item class="listItemAdjust pb-0 text-h5 font-weight-light" style="line-height: 1.2em;">{{selectedEmployee.name}}</v-list-item>
								<div class="px-4 font-weight-light" style="position: relative; top: -5px;">{{selectedEmployee.titleHighest}}</div>
							</v-col>
						</v-row>
					</v-card>

					<!-- CARD CONTENTS -->
					<v-card-text>
						{{selectedEmployee}}
					</v-card-text>

				</v-card>
			</v-col>
		</v-row>
	</v-container>
</template>

<script setup>
import { api } from '@/stores'   
import PersonSearch from '@/components/PersonSearch.vue'
</script>

<script>

export default {
data: () => ({
	selectedEmployee: null,
}),

computed: {},
methods: {

	employeeSelected(employee) {
		this.selectedEmployee = employee
	}

},

}
</script>


