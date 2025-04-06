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
			this.initialized = true			
					
			// Parallel fetching, faster than a chain of awaits.  Will wait for them all to finish.
			ui.loading = true	
			await Promise.all([ 
				//this.fetchSecurityTest(),	// Example - Security Test (ensure token is valid, show some claims)
			])
			ui.loading = false			
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