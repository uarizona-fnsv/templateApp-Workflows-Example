// app.js store
// State and logic for this apps main functions
// Use this store for middleware between the components and the api.js
// in order to keep your components clean and focused on their own logic.

import { defineStore } from 'pinia'
import { api, ui, user } from '../stores'

export const useApp = defineStore('app', {
state: () => ({     
    initialized: 		false,
    appData: [],          // Example array to store data relevant to this app's state
    
}),

getters: {
    // Example getter for Active Buildings
    activeBuildings: (state) => {
        if (!state.appData || state.appData.length === 0) return []
        return state.appData.filter(building => building.status === 'A') // Filter for active buildings only
    },    
},

actions: {
    // This is executed immediately upon login, before going to route
	async initialize() {
        
		if (!this.initialized) {
			console.log("Initializing App")
            
            // Setup Roles into State
            user.parseClaimsFromToken()

            // Show in Console what API is being used
            console.log("useBetaApi ", api.useBetaAPI)
					
			// Fetch Data
            ui.loading = true	
			await Promise.all([ 
                // Initialization Fetchs GO HERE
				//api.fetchSecurityTest(),	// Recommended to keep in place for security testing and health ping
			])
			ui.loading = false		
            
            // Other Initialization Logic
            console.log("App Initialized")
            this.initialized = true	
		}
	},
    
    // Example of loading state data from the API store's functions
    async loadData() {
        ui.loading = true
        this.appData = await api.fetchBuildings()
        ui.loading = false
    }
}

})