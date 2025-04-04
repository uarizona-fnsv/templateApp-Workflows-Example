import { defineStore } from 'pinia'
import { ui, api } from '../stores'
import jscookie from 'js-cookie'
import router from '../router'
export const API_JWT_AUTH = 'templateApp_jwt_auth'

export const useUser = defineStore('userStore', {
state: () => ({
	token: 				jscookie.get(API_JWT_AUTH), 
	netid: 				null,
	user: 				null,
	initialized: 		false,
	roles:              null,
}),

getters: {
	// TODO: modify these to work with cerberus / token claims
	isUser: 	(state) => { return state.roles?.includes("user") },
	isAdmin: 	(state) => { return state.roles?.includes("admin") },
	isSigma: 	(state) => { return state.roles?.includes("sigma") } // Tests access denied
},

actions: {
	// Token is stored inside cookie, lasts one day
	setToken(payload) {
		console.log("Setting Token", payload)
		this.token = payload
	},

	setCookie(payload) {
		console.log("Setting Cookie", payload)
		jscookie.set(API_JWT_AUTH, payload, {expires: 1})
		if (!payload) { jscookie.remove(API_JWT_AUTH) }
	},

	// User Profile from EDS (Enterprise Directory Service)
	async fetchUserProfile () {
    	console.log("Action: fetchUserProfile lookupPerson ")
    	await fetch(api.commonApiUrl + '/lookupMyself', { headers: api.headers })
    	.then(response => response.json())
    	.then(data => { this.user = data })
	},

	// Token used for API authentication/permissions
	getToken(payload) {
		console.log("Get Token")
		return fetch(api.commonApiUrl + '/getDoggoJwt/', {
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

	// This is executed immediately upon login, before going to route
	async initialize() {
		if (!this.initialized) {
			this.initialized = true			
					
			// Parallel fetching, faster than a chain of awaits.  Will wait for them all to finish.
			ui.loading = true	
			await Promise.all([ 
				//this.fetchSecurityTest(),	// Example - Security Test (ensure token is valid, show some claims)
				this.fetchUserProfile(),	// Example - Fetch user information		
			])
			ui.loading = false			
		}
	},
},


})
