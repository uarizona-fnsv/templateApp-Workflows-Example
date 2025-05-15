// user.js Store
// This is the user store which handles authentication, token management, and user-related actions.
// Token store in api.js to avoid circular references
// Be careful not to import app.js here or create other circular references.

import { defineStore } from 'pinia'
import { api, ui } from '../stores' // Adding more stores here can cause circular references.
import jscookie from 'js-cookie'
import router from '../router'
export const API_JWT_AUTH = 'templateApp_jwt_auth'

export const useUser = defineStore('userStore', {
state: () => ({
	
	netid: 						null,
	emplId: 					null,
	isUser: 					false,
	isAdmin: 					false,
	isFerpaCertified:     		false,
	isHipaaCertified:     		false,
	isInfosecawareCertified: 	false,
}),

getters: {
	appName: () => {
        return api.useBetaAPI
        ? import.meta.env.VITE_APP_NAME_BETA
        : import.meta.env.VITE_APP_NAME_PROD
    },
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
		ui.loading = true
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
			this.loading = false
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
	
		const claims = this.parseJwt(api.token);
		console.log("Parsed Claims:", claims);
	
		this.netId = 					claims.netid;
		this.emplId = 					claims.emplid;
		this.isFerpaCertified = 		claims.ferpaCertified;
		this.isHipaaCertified = 		claims.hipaaCertified;
		this.isInfosecawareCertified = 	claims.infosecawareCertified;
		
		console.log("Parsing Roles for", this.appName);
		const rolePrefix = `role:${this.appName}`;
	
		Object.keys(claims).forEach(claimKey => {
			if (claimKey.startsWith(rolePrefix)) {
				let roles = claims[claimKey];
	
				// Normalize to array
				if (!Array.isArray(roles)) {
					roles = [roles];
				}
	
				roles.forEach(role => {
					const propertyName = `is${role.charAt(0).toUpperCase() + role.slice(1)}`;
					this[propertyName] = true;
				});
			}
		});
	
		console.log("isUser:", 					this.isUser);
		console.log("isAdmin:", 				this.isAdmin);
		console.log("isFerpaCertified:", 		this.isFerpaCertified);
		console.log("isHipaaCertified:", 		this.isHipaaCertified);
		console.log("isInfosecawareCertified:", this.isInfosecawareCertified);
	}
	
	
	
	
	  
	  
	  

	
},


})
