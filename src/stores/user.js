import { defineStore } from 'pinia'
import { ui, api } from '../stores'
import jscookie from 'js-cookie'
export const API_JWT_AUTH = 'templateApp_jwt_auth'

export const useUser = defineStore('userStore', {
state: () => ({
	isSuperUser: true,
	token: jscookie.get(API_JWT_AUTH), 
	netid: null,
}),

actions: {
	// Token is stored inside cookie, lasts one day
	setToken(payload) {
		console.log("Setting Token", payload)
		jscookie.set(API_JWT_AUTH, payload, {expires: 1})
		this.token = payload
		if (!payload) { jscookie.remove(API_JWT_AUTH) }
	},

	// User Profile (Name, email etc)
	async fetchUserNetID () {
    	console.log("Action: fetchUserNetID ")
    	await fetch('https://api1.ba.arizona.edu/api/lyftcodes/mynetid', { headers: this.headers })
    	.then(response => response.json())
    	.then(data => { this.netid = data.netid })
	},

	// Superuser has all rights.  Handy in simple rights scenarios. Designed per application.
    fetchIsSuperUser () {
        console.log("Action: fetchIsSuperUser ")
        return fetch('https://api1.ba.arizona.edu/api/lyftcodes/isSuperUser', { headers: this.headers })
        .then(response => response.json())
        .then(data => { 
        	//this.isSuperUser = data

        	// This optional code can be used to make everyone a SuperUser in beta deployment
        	/*if (import.meta.env.VITE_APP_DEPLOYMENT === 'beta') {
        		this.isSuperUser = true
        	} else { this.isSuperUser = data }*/
        })  
    },

	// Token used for API authentication/permissions
	getToken(payload) {
		console.log("Get Token")
		return fetch('https://api1.ba.arizona.edu/api/jwt/getJWT/', {
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json'
			},
			method: 'POST',
			body: JSON.stringify(payload)})
		.then((response) => {
			if (response.ok) { 
				return response.json()
			} else { 
				router.push({ name: 'ServiceDown' }) 
			}})
		.then((data) => {
			this.setToken(data.token)
			return data })
		.catch((error) => {
			router.push({ name: 'ServiceDown' })
		})
	},

	async initialize() {
		ui.loading = true
		await Promise.all([ 
			//this.fetchIsSuperUser(),
			this.fetchUserNetID()			
		])
		ui.loading = false
	},
},

getters: {
	headers: (state) => {
		return {
			'Authorization': state.token,
			'database': ui.getDatabase,
			'content-type': 'application/json',
			'impersonate': state.impersonate
		}
	},
},
})
