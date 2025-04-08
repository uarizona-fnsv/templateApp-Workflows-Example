// user.js Store
// This is the user store which handles authentication, token management, and user-related actions.
// Token store in api.js to avoid circular references
// Be careful not to import app.js here or create other circular references.

import { defineStore } from 'pinia'
import { api } from '../stores' // Adding more stores here can cause circular references.
import jscookie from 'js-cookie'
import router from '../router'
export const API_JWT_AUTH = 'templateApp_jwt_auth'

export const useUser = defineStore('userStore', {
state: () => ({
	
	netid: 				null,
	emplId: 			null,
	isUser: 			false,
	isAdmin: 			false,
}),

getters: {

},

actions: {
	// Token is stored inside cookie, lasts one day
	setToken(payload) {
		console.log("Setting Token", payload)
		api.token = payload
	},

	setCookie(payload) {
		console.log("Setting Cookie")
		jscookie.set(API_JWT_AUTH, payload, {expires: 1})
		if (!payload) { jscookie.remove(API_JWT_AUTH) }
	},

	// Token used for API authentication/permissions
	getToken(payload) {
		console.log("Get Token")
		return fetch(api.commonApiUrl + '/getBATSJwt/', {
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
			return data })
		.catch((error) => {
			router.push({ name: 'ServiceDown' })
		})
	},

	parseJwt(token) {
		try {
			const base64Payload = token.split('.')[1]
			const payload = atob(base64Payload)
			return JSON.parse(payload)
		} catch (e) {
			console.error("Invalid JWT:", e)
			return {}
		}
	},

	// This function is called when the user logs in and the token is set
	// It parses the token and sets the user roles in the store
	// It also sets the netid and emplId in the store
	// it will take claims such as "role:templateApp:user" and set isUser to true
	parseClaimsFromToken() {
		if (!api.token) return;
	
		const claims = this.parseJwt(api.token);
		console.log("Parsed Claims:", claims);
	
		// Store the netid and emplId in the store
		this.netId = claims.netid;
		this.emplId = claims.emplid;
	
		const appId = import.meta.env.VITE_APP_ID_PROD;
		const rolePrefix = `role:${appId}`; // To check for roles related to this app
	
		// Iterate through claims and dynamically set properties for each role:<appId> claim
		Object.keys(claims).forEach(roleClaim => {
			if (roleClaim.startsWith(rolePrefix)) {
				const roleValue = claims[roleClaim]; // The value of the claim will be a single string (like "user")
				
				// Dynamically create the property name based on the role value (e.g., "user" -> "isUser")
				const propertyName = `is${roleValue.charAt(0).toUpperCase() + roleValue.slice(1)}`;
				this[propertyName] = true;
			}
		});
	
		console.log("isUser:", this.isUser);
		console.log("isAdmin:", this.isAdmin);
	}
	
	
	
	  
	  
	  

	
},


})
