// API.JS
// This store is used for external API definitions
// Contains almost entirely boilerplate code for API endpoints, headers, and URL management.
// They might set a state variable for convenience, but should not obscure any important logic. 
// Put logic in app.js store, not here.

import { defineStore } from 'pinia'
import jscookie from 'js-cookie'
export const API_JWT_AUTH = 'templateApp_jwt_auth'

export const useApi = defineStore('api', {
state: () => ({
    token: 			jscookie.get(API_JWT_AUTH),    
   
    useLocalAPI:    false,
    localApiUrl:    "http://localhost:3000/api",                        
    commonApiUrl:   "https://api.ba.arizona.edu/common",                // Common API for shared functionality (like user profile, etc)    
    prodApiUrl:     "https://api.ba.arizona.edu/templateApp/api",       // Production API for this application (templateApp)
    betaApiUrl:     "https://beta.api.ba.arizona.edu/templateApp/api",  // Beta API for this application (templateApp)

      // Sets default database, can be switched at runtime by the user.
    useDevDatabase: import.meta.env.VITE_APP_DEPLOYMENT === 'beta' ? true : false,

    buildings: null,
}),

getters: {
    // Allows convenient switching of API see 'useLocalAPI' above
    apiURLNoLocal() {		
        console.log("useBetaAPI", this.useBetaAPI)
        return this.useBetaAPI ? this.betaApiUrl : this.prodApiUrl;
    },
    
    apiURL() {			
        if (this.useLocalAPI) return this.localApiUrl;
        return this.useBetaAPI ? this.betaApiUrl : this.prodApiUrl;
    },    
    
    // This will resolve based on the app deployment env variable
    // Unless overridden by the forceProdAPI variable
    useBetaAPI() {
        if (import.meta.env.VITE_FORCE_PRODAPI == "true") return false
        if (import.meta.env.VITE_FORCE_BETAAPI == "true") return true
        return window?.location?.hostname.includes('beta') || 
        window?.location?.hostname === 'localhost' ? true : false
    },

    // Default header
    headers: (state) => {
        return {
            'Authorization':    `Bearer ${state.token}`,
            'content-type':     'application/json',
        }
    },

    commonApiHeaders: (state) => {
        return {
            'Authorization':    state.token,         // Common doesnt' take bearer
            'content-type':     'application/json',
        }
    },    
},

actions: {   
    // All Fetches go here.  Prefacing the actionName with "fetch" is recommended for clarity.

    // Security Test
    // But it must be added to each backend API to function
    // Sample .NET Return from decoding the claims | return Ok($"Hello {firstName} {lastName} - {netid} - {emplid}.");
    fetchSecurityTest() {
        console.log("Action: Check Secure Endpoint")
        return fetch(this.apiUrl + '/secure', 
            { headers: { ...this.headers, 'content-type': 'application/text' }
        })
        .then(response => response.text())
        .then(data => console.log("Secure Endpoint:", data))
    },

    fetchRequestAccess() {
        console.log("Action: Request App Permission")
        return fetch(this.commonApiUrl + '/requestAccess', {
            method: 'POST',
            headers: { ...this.headers, 'content-type': 'application/text' },
            body: JSON.stringify({ appName: import.meta.env.VITE_APP_NAME }),
          })
          .then(response => response.json())
          .then(data => console.log("Request Sent"))
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