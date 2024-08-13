import { defineStore } from 'pinia'
import { user, ui } from '../stores'

export const useApi = defineStore('api', {
state: () => ({ 
    requestCodeReturn: null,
}),

actions: {    
    // Get a TIA Lyft Code
    fetchTIALyftCode () {
        console.log("Action: fetchTIALyftCode ")
        return fetch('https://api1.ba.arizona.edu/api/lyftcodes/getTIALyftCode', 
            { headers: user.headers })
        .then(response => response.json())
        .then(data => { 
            this.requestCodeReturn = data            
        })  
    },

    fetchCodeHistory (payload) {
        console.log("Action: fetchCodeHistory ")
        return fetch('https://api1.ba.arizona.edu/api/lyftcodes/codeHistory', 
            {   headers: user.headers,
                method: 'POST',
                body: JSON.stringify(payload) 
            })
        .then(response => response.json())
        .then(data => { return data })  
    },

    // Clear Code Reservations for this user.
    postClearMyTIACodes () {
        console.log("Action: postclearMyTIACodes ")
        ui.snack = true 
        ui.snackText = "Reserved Codes Cleared"
        this.requestCodeReturn = null
        return fetch('https://api1.ba.arizona.edu/api/lyftcodes/clearMyTIACodes', 
            {   headers: user.headers            })
    },

    // Upload additional codes
    postUploadCodes (payload) {
        console.log("Action: postclearMyTIACodes ")
        return fetch('https://api1.ba.arizona.edu/api/lyftcodes/upload', 
            {   headers: user.headers,
                method: 'POST',
                body: JSON.stringify(payload) 
            })
        .then(response => response.json())
        .then(data => { return data })
    },
},

})