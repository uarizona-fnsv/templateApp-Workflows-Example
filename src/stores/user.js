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

	parseClaimsFromToken() {
		if (!api.token) return;
	  
		console.log("Parsing Claims from Token");
		const claims = this.parseJwt(api.token);
		console.log("Parsed Claims:", claims);
	  
		this.netId = claims.netid;
		this.emplId = claims.emplid;
		console.log("Store netId:", this.netId);
		console.log("Store emplId:", this.emplId);
	  
		const appId = import.meta.env.VITE_APP_ID_PROD;
		const roleClaim = `role:${appId}`;
	  
		// Check if the claim exists on the token.
		if (claims.hasOwnProperty(roleClaim)) {
		  let roleValue = claims[roleClaim];
	  
		  // Ensure the value is an array
		  if (typeof roleValue === "string") {
			roleValue = [roleValue];
		  }
	  
		  // Iterate over role values and set properties.(ie. isUser, isAdmin)
		  roleValue.forEach(val => {
			// Dynamically create a flag name; for example, "user" becomes "isUser"
			const propName = `is${val.charAt(0).toUpperCase() + val.slice(1)}`;
	  
			// Set the dynamic flag. Make sure that the flag is declared in the store state.
			this[propName] = true;
		  });
		} else {
		  console.warn(`Claim ${roleClaim} not found in token`);
		}
	  
		console.log("isUser:", this.isUser);
		console.log("isAdmin:", this.isAdmin);
	  }
	  
	  
	  

	
},


})
