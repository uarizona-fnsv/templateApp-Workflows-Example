import { defineStore } from 'pinia'

export const useUI = defineStore('ui', {
state: () => ({ 
    //useDevDatabase: false,
    useDevDatabase: import.meta.env.VITE_APP_DEPLOYMENT === 'beta' ? true : false,
    snack: false,
    snackText: null,
    snackColor: "warning",
    pageTitle: "Request Lyft Code"
}),

getters: {
    getDatabase: (state) => {
        console.log("Vite App Deployment: ", import.meta.env.VITE_APP_DEPLOYMENT)
        return state.useDevDatabase == true ? 'dev' : 'not_dev'
    },
},

})