<template>
	<div :style="isPhone ? '' : 'margin-left: 100px;'">
		<v-btn :block="isPhone" v-if="!api.requestCodeReturn" @click="requestCode" class="uabutton" width="200">
			Request Code
			<v-progress-circular size="small" class="ml-2" v-if="loading" indeterminate></v-progress-circular>
		</v-btn>
		<v-card v-if="api.requestCodeReturn" :width="!isPhone ? '500' : 'auto'" class="mt-lg-4 pa-lg-6" :elevation="isPhone ? '0' : '1'">
			<div v-if="goodCode">
				<v-card-title class="pl-2">Your Code </v-card-title>	
				<v-card color="#1E5288">
				<v-card-text align="center" class="text-h5">{{api.requestCodeReturn.code}}</v-card-text>
				</v-card>
				<v-card-text class="mt-14">Emailed to <b>{{user.netid}}@arizona.edu</b></v-card-text>
			</div>
			<div v-else>
				<div v-if="api.requestCodeReturn.errorMessage=='Code Already Reserved'">
					<v-card-title>Error: Code Already Reserved</v-card-title>
					<v-card-text>You have already reserved a code within the allowed timeframe, emailed to {{user.netid}}@arizona.edu.</v-card-text>
					<v-card-title>{{api.requestCodeReturn.previousCode}}</v-card-title>
					<v-card-text>Requested on {{api.requestCodeReturn.previousCodeDate}}</v-card-text>
				</div>
				<div v-if="api.requestCodeReturn.errorMessage=='All Codes Used'">
					<v-card-title>Error: All Codes Used</v-card-title>
					<v-card-text>We're sorry. There are no more codes available at this time.</v-card-text>
				</div>
			</div>
		</v-card>
	</div>
</template>

<script setup>
import { user, api } from '@/stores'
</script>

<script>
export default {
data: () => ({
	loading: null,
}),

computed: {
	isPhone() { return this.$vuetify.display.mobile },  
	goodCode() { return api.requestCodeReturn.status=="OK" ? true : false },
},

methods : {

	async requestCode() {
		this.loading = true
		await api.fetchTIALyftCode() // This will set api.requestCodeReturn
		this.loading = false
	},
},
}

</script>

<style>
</style>