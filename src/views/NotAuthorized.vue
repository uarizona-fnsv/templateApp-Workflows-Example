<template>
	<v-container fluid>
		<v-row justify="center">
			<v-col cols="12" sm="8" md="6">
				<v-card color="UACoolGray" class="pb-4" :ripple="false">
					
					<!-- CARD HEADER -->
					<v-card color="UAWarmGray" class="pl-1 rounded-lg rounded-b-0 text-white" :ripple="false">
						<v-row no-gutters align="center" class="pa-3">
							<!-- AVATAR -->
							<v-col class="flex-grow-0 flex-shrink-1">
								<v-avatar size="x-large" color="UAChili" class="text-h6 font-weight-regular rounded-lg"
								rounded="0" style="letter-spacing: 1px;">
								<v-icon icon="mdi-shield-alert" />
							</v-avatar>
						</v-col>
						
						<!-- TITLE AND SUBTITLE -->
						<v-col class="flex-grow-1 flex-shrink-0 ml-1">
							<v-list-item class="listItemAdjust pb-0 text-h5 font-weight-light"
							style="line-height: 1.2em;">Access Denied</v-list-item>
							<div class="px-4 font-weight-light" style="position: relative; top: -5px;">No Permissions for this resource</div>
						</v-col>
					</v-row>
				</v-card>
				
				<!-- CARD CONTENTS -->
				<v-card-text class="mt-4 mx-6">
					Access to this resource is restricted to authorized users only. If you believe you should have access, please request it using the button below.
				</v-card-text>
				<v-card-text>
					<v-row justify="center">
						<v-col align="center">
							<v-btn @click="requestAccess" class="uabutton red" :disabled="loading">
								<span v-if="!loading">Request Access</span>
								<v-progress-circular
									v-if="loading"
									:indeterminate="loading"
									color="white"
									size="24"
									class="ml-2"
								/>
							</v-btn>
						</v-col>
					</v-row>
				</v-card-text>
				<v-card-text class="mt-4 mx-6">You may need to logout in order to activate newly granted access.</v-card-text>
				<v-card-text>
					<v-row justify="center">
						<v-col align="center">
							<v-btn @click="logout" variant="text">
								Log Out
							</v-btn>
						</v-col>
					</v-row>
				</v-card-text>
				
			</v-card>
		</v-col>
	</v-row>
</v-container>
</template>

<script setup>
import { ui, api, user } from '@/stores'
</script>

<script>
export default {
	data: () => ({
		loading: false,
	}),
	mounted() { ui.loading = false },
	methods: {
		logout() {
			user.setToken()
			this.goHome()
		},
		async requestAccess() {
			this.loading = true
			await api.fetchRequestAccess({ 'appName': user.appName })
			this.loading = false
			const confirmed = await ui.confirm({
				title: 'Access Request Sent',
				body: 'Your request for access has been sent.\n You will be notified by email when it is approved.',
				type: 'Ok',  // 'YesNo' or 'Ok'
			})
			if (confirmed) { console.log('Clicked OK or Yes');} 			
		},
		goHome() {
			this.$router.push({ name: "Home" })
		}
	}
}
</script>

<style scoped>
li {
	margin-top: 10px !important
}
</style>
