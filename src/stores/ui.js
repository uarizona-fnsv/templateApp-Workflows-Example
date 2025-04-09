// ui.js store
// Use this store for UI state management.  "showUploadDialog", loading indicators, etc
// This store should not contain any business logic or API calls. 

import { defineStore } from 'pinia'

export const useUI = defineStore('ui', {
state: () => ({     
    snack:          false,
    snackText:      null,
    snackColor:     "warning",
    pageTitle:      "TemplateApp",  // Default page title, will be overridden by router beforeEnter in router/index.js (if applicable)
    loading:        true,          // Global loading indicator, under the main app bar (top of page) for async operations.

    // Confirm Dialog Properties
    showConfirmDialog:      false,
    confirmDialogType:      'YesNo', // "YesNo" | "Ok"
	confirmDialogTitle:     '',
	confirmDialogBody:      '',
	confirmDialogResolve:   null,
}),

getters: {
    
},

actions: {
    async confirm({ title, body, type = 'YesNo' }) {
		this.confirmDialogTitle = title
		this.confirmDialogBody = body
		this.confirmDialogType = type
		this.showConfirmDialog = true

		return new Promise((resolve) => {
			this.confirmDialogResolve = resolve
		})
	},

    resolveConfirm(result) {
        this.showConfirmDialog = false
        if (this.confirmDialogResolve) {
            this.confirmDialogResolve(result)
            this.confirmDialogResolve = null
        }
    },
}

})