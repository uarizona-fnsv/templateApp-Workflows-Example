import { defineStore } from 'pinia'
import { user, ui } from '../stores'

// API.JS
// DATASTORE AND ACTIONS SPECIFIC TO THIS APPLICATION'S DATA

export const useApi = defineStore('api', {
state: () => ({ 
    requestCodeReturn: null,
    buildings: null,
}),

actions: {    
    // EXAMPLE FETCH
    // Buildings from Space Database
    fetchBuildings () {
        console.log("Action: fetchBuildings") 
        return fetch('https://api.pdc.arizona.edu/buildings', { headers: user.headers })
        .then(response => response.json())
        .then(data => { 
            this.buildings = data
            console.log("Buildings Fetched")
        })
    },
},

})