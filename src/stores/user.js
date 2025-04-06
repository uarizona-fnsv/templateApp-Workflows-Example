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
			return data })
		.catch((error) => {
			router.push({ name: 'ServiceDown' })
		})
	},

	
},


})
