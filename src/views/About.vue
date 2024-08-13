<template>
	<v-container fluid >
		<v-row justify="center" >
			<v-col cols="12" sm="8" md="6" >
				<v-card elevation="2" class="pa-4" >
					<v-card-title class="headline font-weight-bold">About</v-card-title>
					<v-divider class="mx-4"></v-divider>
					<v-card-text class="mt-4">
						A service from Parking & Transportation Services for distributing Lyft Event Codes
					</v-card-text>
					<v-card-actions>
						<v-btn @click="goHome" color="primary">Ok</v-btn>
					</v-card-actions>
				</v-card>
			</v-col>
		</v-row>
	</v-container>
</template>

		
<script>
export default {
data: () => ({ 
}),


methods: {
	goHome() { this.$router.push({name: "Home"}) },
}

}
</script>

