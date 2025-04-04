import { defineStore } from 'pinia'

export const useUI = defineStore('ui', {
state: () => ({     
    snack:          false,
    snackText:      null,
    snackColor:     "warning",
    pageTitle:      "TemplateApp",  // Default page title, will be overridden by router beforeEnter in router/index.js (if applicable)
    loading:        false,          // Global loading indicator, under the main app bar (top of page) for async operations.
}),

getters: {
    
},

actions: {
    
}

})