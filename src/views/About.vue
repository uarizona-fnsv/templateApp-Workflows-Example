<template>
	<v-container fluid>
		<v-row justify="center">
			<v-col cols="12" sm="8" md="6">
				<v-card color="UAAzurite" class="pb-4" :ripple="false">

					<!-- CARD HEADER -->
					<v-card color="UABlue" class="pl-1 rounded-lg rounded-b-0 text-white" :ripple="false">
						<v-row no-gutters align="center" class="pa-3">
							<!-- AVATAR -->
							<v-col class="flex-grow-0 flex-shrink-1">
								<v-avatar size="x-large" color="UAChili" class="text-h6 font-weight-regular rounded-lg"
									rounded="0" style="letter-spacing: 1px;">
									<v-icon icon="mdi-information" />
								</v-avatar>
							</v-col>

							<!-- TITLE AND SUBTITLE -->
							<v-col class="flex-grow-1 flex-shrink-0 ml-1">
								<v-list-item class="listItemAdjust pb-0 text-h5 font-weight-light"
									style="line-height: 1.2em;">University
									Information Technlogy Services (UITS)</v-list-item>
								<div class="px-4 font-weight-light" style="position: relative; top: -5px;">Administrative Operations</div>
							</v-col>
						</v-row>

					</v-card>

					<!-- CARD CONTENTS -->
					<v-card-text class="mt-4">
						This application has various functions.
					</v-card-text>
				</v-card>
			</v-col>
		</v-row>
	</v-container>
</template>


<script>
export default {
	data: () => ({}),


	methods: {
		goHome() { this.$router.push({ name: "Home" }) },
	}

}
</script>

<style scoped>
li { margin-top: 10px !important}
</style>

