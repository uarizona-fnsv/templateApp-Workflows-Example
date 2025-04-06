// API.JS
// This store is used for external API definitions
// Contains almost entirely boilerplate code for API endpoints, headers, and URL management.
// They might set a state variable for convenience, but should not obscure any important logic. 
// Keep logic in app.js store.

import { defineStore } from 'pinia'
import jscookie from 'js-cookie'
export const API_JWT_AUTH = 'templateApp_jwt_auth'

export const useApi = defineStore('api', {
state: () => ({
    token: 			jscookie.get(API_JWT_AUTH),    
   
    useLocalAPI:    false,
    localApiUrl:    "http://localhost:3000/api",                        // Local API for development/testing (if using a local backend with this)
    commonApiUrl:   "https://api.ba.arizona.edu/common",                // Common API for shared functionality (like user profile, etc)    
    prodApiUrl:     "https://api.ba.arizona.edu/templateApp/api",       // Production API for this application (templateApp)
    betaApiUrl:     "https://beta.api.ba.arizona.edu/templateApp/api",  // Beta API for this application (templateApp)

      // Sets default database, can be switched at runtime by the user.
    useDevDatabase: import.meta.env.VITE_APP_DEPLOYMENT === 'beta' ? true : false,

    buildings: null,
}),

getters: {
    // Allows convenient switching of API using combinations of 'useLocalAPI' and VITE_APP_DEPLOYMENT
    apiUrl() {
        if (this.useLocalAPI) return this.localApiUrl;
        return import.meta.env.VITE_APP_DEPLOYMENT === 'beta' ? this.betaApiUrl : this.prodApiUrl;
      },

    // Default header
    headers: (state) => {
        return {
            'Authorization':    `Bearer ${state.token}`,
            'database':         state.getDatabase,  // This can be implemented on the backned to switch databases based on the value of this header (dev vs not_dev)
            'content-type':     'application/json',
        }
    },

    commonApiHeaders: (state) => {
        return {
            'Authorization':    state.token,         // Common doesnt' take bearer
            'database':         state.getDatabase,  // This can be implemented on the backned to switch databases based on the value of this header (dev vs not_dev)
            'content-type':     'application/json',
        }
    },

    getDatabase: (state) => {
        return state.useDevDatabase == true ? 'dev' : 'not_dev'
    },

    appId: (state) => {
        return import.meta.env.VITE_APP_DEPLOYMENT === 'beta' 
          ? import.meta.env.VITE_APP_ID_BETA 
          : import.meta.env.VITE_APP_ID_PROD
    },
},

actions: {   
    // Security Test
    fetchSecurityTest() {
        console.log("Action: Check Secure Endpoint")
        return fetch(this.apiUrl + '/secure', { headers: this.headers })
          .then(response => response.json())
          .then(data => console.log("Secure Endpoint:", data))
      },

    // EXAMPLE FETCH - Buildings from Space Database
    fetchBuildings () {
        console.log("Example of an Action")
        console.log("Action: fetchBuildings")
        console.log('https://api.pdc.arizona.edu/buildings') 
        return fetch('https://api.pdc.arizona.edu/buildings', { headers: this.headers })
        .then(response => response.json())
        .then(data => { 
            console.log("Example of Return Confirmation")
            console.log("Buildings Fetched", data)
            return data            
        })
    },
},

})