import { defineStore } from 'pinia'
import { user, ui } from '../stores'

// API.JS
// DATASTORE AND ACTIONS SPECIFIC TO THIS APPLICATION'S DATA

export const useApi = defineStore('api', {
state: () => ({ 
    requestCodeReturn: null,
    buildings: null,
    useBetaAPI: false,
    commonApiUrl: "https://api.ba.arizona.edu/common"
}),

getters: {
    apiURL() {
        // Example of Switching APIs
        /*return this.useBetaAPI ? 'https://api.ba.arizona.edu/betalyft' :
        'https://api.ba.arizona.edu/lyft'*/
    },

    headers: (state) => {
        return {
            'Authorization':    user.token,
            'database':         ui.getDatabase,
            'content-type':     'application/json',
            'impersonate':      user.impersonate
        }
    },
},

actions: {    
    // EXAMPLE FETCH
    // Buildings from Space Database
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