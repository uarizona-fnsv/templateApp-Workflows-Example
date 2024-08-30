import { defineStore } from 'pinia'
import { ui, api } from '../stores'
import jscookie from 'js-cookie'
import router from '../router'
export const API_JWT_AUTH = 'templateApp_jwt_auth'

export const useUser = defineStore('userStore', {
state: () => ({
	isSuperUser: 		true,
	token: 				jscookie.get(API_JWT_AUTH), 
	netid: 				null,
	user: 				null,
	initialized: 		false,
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
	async fetchUserProfile () {
    	console.log("Action: fetchUserProfile lookupPerson ")
    	await fetch(api.commonApiUrl + '/lookupPerson', { headers: api.headers })
    	.then(response => response.json())
    	.then(data => { this.user = data })
	},

	// Superuser has all rights.  Handy in simple rights scenarios. Designed per application.
    fetchIsSuperUser () {
        console.log("Action: fetchIsSuperUser ")
        return fetch(api.commonApiUrl + '/isSuperUser', { headers: api.headers })
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
		return fetch(api.commonApiUrl + '/getJWT/', {
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
		if (!this.initialized) {
			this.initialized = true
			ui.loading = true
			
			// Parallel fetching, but wait for them all to finish
			await Promise.all([ 
				this.fetchIsSuperUser(),
				this.fetchUserProfile(),			
			])

			ui.loading = false			
		}
	},
},


})
