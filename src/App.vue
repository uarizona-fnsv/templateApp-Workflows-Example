<template>
	<v-app id="app"> 

		<!-- UA MARCOMM BAR -->
		<v-app-bar height="53" class="text-white elevation-0" color="UARed">
				<v-row class="pl-6">					
					<img class="arizona-line-logo" alt="A Logo" src="@/assets/ua_wordmark_line_logo_white_rgb.min.svg">
				</v-row>
		</v-app-bar>
		
		<!-- APPLICATION BAR -->
		<v-app-bar class="pr-lg-8 elevation-0" 
			:height="isPhone ? 70 : 100" :class="isPhone ? 'pl-5' : ''">
				<v-row style="width: 100%;" :class="isPhone ? 'text-h6' : 'text-h4'" class="justify-center align-center font-weight-light">

					<!-- MENU HAMBURGER -- COMMENT OUT IF NO MENU FOR THIS APP -->
					<v-app-bar-nav-icon class="ml-4" size="x-large" @click.stop="drawer = !drawer">
					</v-app-bar-nav-icon>
					
					<!-- BLOCK A AND APPLICATION TITLE -->
					<v-col v-if="!isPhone" class="flex-grow-0 flex-shrink-1 pr-0">
						<img class="ml-4" :height="isPhone ? 40 : 60" alt="A Logo" src="@/assets/BlockA_w_line.png"></v-col>
		            <v-col class="ml-1" :class="isPhone ? 'text-h6' : ''"
		            	align="start">{{ui.pageTitle}}</v-col>

		            <!-- DATABASE INDICATOR -->
		            <v-col v-if="user.isSuperUser && !isPhone" class="flex-grow-0 flex-shrink-1 pr-9 text-body-1 text-no-wrap font-weight-light" >
		            	
		            	<div class="pt-1">{{ui.useDevDatabase ? 'Dev Database' : 'Production Database'}}</div>
		            </v-col>
	        	</v-row>
		</v-app-bar>
		
		<!-- MAIN MENU -->
		<v-navigation-drawer v-model="drawer" temporary width="375"  color="blue-grey-lighten-4">    
			<v-list nav dense>	
								
				<v-list-item to="/" title="Home" prepend-icon="mdi-home"></v-list-item>
				<v-list-item to="/About" title="About" prepend-icon="mdi-information"></v-list-item>

				<v-divider class="mt-4 mb-4"></v-divider>
				<v-spacer></v-spacer>

				<!-- LOGO -->
				<v-list-item>
					<img :height="isPhone ? 40 : 50" alt="A Logo" src="@/assets/IT-Logo.png">
				</v-list-item>
			</v-list>
		</v-navigation-drawer>

		<!-- MAIN LAYOUT INCLUDING ROUTER-VIEW.  ALL ROUTES APPEAR THERE -->
		<v-main>
			<v-divider></v-divider>	
			<v-progress-linear color="blue-grey-lighten-1" height="5" indeterminate v-if="ui.loading"></v-progress-linear>      
			<router-view />
			<SnackMessageBar />	<!-- See SnackMessageBar.vue for implementation  -->
		</v-main>		

	</v-app>
</template>

<script>
import SnackMessageBar from './components/SnackMessageBar.vue'

export default {
name: 'App',

data: () => ({
	drawer: false,
}),

mounted() {
	console.log("Vite App Deployment: ", import.meta.env.VITE_APP_DEPLOYMENT)
},

computed: {
	isPhone() { return this.$vuetify.display.mobile },  // A SHORTER HELPER FUNCTION
},

methods: {	
},
	
}
</script>

<script setup>
	import { ui, user } from '@/stores'
</script>

<!-- SOME APPLICATION WIDE STYLES -->
<style>
::-webkit-scrollbar               { width: 16px; }
::-webkit-scrollbar-track         { background: #dde5ed; }
::-webkit-scrollbar-thumb         { background: #1E5288; }
::-webkit-scrollbar-thumb:hover   { background: #555; }

.uabutton {
    border: 2px solid !important;
    border-radius: 0 !important;
    cursor: pointer !important;
    background-color: #ffffff88;
    transition: background-color 0.3s, color 0.3s;
}

.uabutton.red {
    border-color: #8b0015;
    color: #8b0015 !important;
}

.uabutton.red:hover {
    background-color: #8b0015;
    color: #fff !important;
}

.uabutton.blue {
    border-color: #0C234B;
    color: #0C234B !important;
}

.uabutton.blue:hover {
    background-color: #0C234B;
    color: #fff !important;
}

.arizona-line-logo {
    width: 266.41px;
    height: 19.8px;
    margin: 15.11px 20px 15.1px 10px;
}
</style>