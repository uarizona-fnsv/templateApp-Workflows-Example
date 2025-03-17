import { defineStore } from 'pinia'

export const useUI = defineStore('ui', {
state: () => ({ 
    // Found in .env files (.env.development and .env.production)
    useDevDatabase: import.meta.env.VITE_APP_DEPLOYMENT === 'beta' ? true : false,
    snack: false,
    snackText: null,
    snackColor: "warning",
    pageTitle: "TemplateApp"
}),

getters: {
    getDatabase: (state) => {
        return state.useDevDatabase == true ? 'dev' : 'not_dev'
    },
    appId: (state) => {
        return import.meta.env.VITE_APP_DEPLOYMENT === 'beta' 
          ? import.meta.env.VITE_DOGGO_APP_ID_DEV 
          : import.meta.env.VITE_DOGGO_APP_ID_PROD
    },
},

})