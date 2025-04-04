// Use this store for state and logic about this apps main functions

import { defineStore } from 'pinia'
import { api, ui } from '../stores'

export const useApp = defineStore('app', {
state: () => ({     
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
    // Example of loading state data from the API store's functions
    async loadData() {
        ui.loading = true
        this.appData = await api.fetchBuildings()
        ui.loading = false
    }
}

})