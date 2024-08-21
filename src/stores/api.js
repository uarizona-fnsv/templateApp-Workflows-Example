import { defineStore } from 'pinia'
import { user, ui } from '../stores'

export const useApi = defineStore('api', {
state: () => ({ 
    requestCodeReturn: null,
    buildings: null,
}),

// Actions (usually FETCH) specific to this application function, not related to user, or ui.
actions: {    
    // Buildings from Space Database with supporting properties
    fetchBuildings () {
        console.log("Action: fetchBuildings") 
        return fetch('https://api.pdc.arizona.edu/buildings', { headers: this.headers })
        .then(response => response.json())
        .then(data => { 
            this.buildings = data
            console.log("Buildings Fetched")
        })
    },
},

})