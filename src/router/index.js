import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import About from '../views/About.vue'
import ServiceDown from '../views/ServiceDown.vue'
import NotAuthorized from '../views/NotAuthorized.vue'
import { user, ui } from '@/stores'

const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),  // Use the base URL from vite.config.js for deployment (if set)
	routes: [
		{
			path: '/',
			name: 'Home',
			component: Home,
			beforeEnter() { ui.pageTitle="TemplateApp" },
		},
		{
			path: '/About',
			name: 'About',
			component: About,
			beforeEnter() { ui.pageTitle="TemplateApp - About" },
		},
		{
			path: '/ServiceDown',
			name: 'ServiceDown',
			component: ServiceDown,
		},
		{
			path: '/NotAuthorized',
			name: 'NotAuthorized',
			component: NotAuthorized,
			beforeEnter() { ui.pageTitle="TemplateApp - Not Authorized" },
		},
	]
})

// EXECUTED BEFORE ROUTING
router.beforeEach(async (to, from) => {

	// Routes that skip authorization
	const noAuthRoutes = ['NotAuthorized'];

	// Routes that will require admin role
	const adminUserRoutes = ['AdminExample'];
	
	// Skip Authentication for noAuthRoutes
	if (noAuthRoutes.includes(to.name)) {
		return
	}

	// If there is no token saved, user will be sent to webauth, where they will return with a ticket in the URL, that will be used to get a JSON Web Token 
	// Token will be used for authentication with all subsequent API calls.
	// Token will contain claims for various claims (roles, permissions, etc) that can be used for authorization in the application.
	// Token will also contain basic info such as name, emplid, netId
	if (!user.token || user.token == 'undefined') {
		
		const webAuthURL = "https://webauth.arizona.edu/webauth/login?service="
	    let location = to.path 

	    // See vite.config.js for base (used in deployment)
	    let serviceURL = window.location.origin + (import.meta.env.BASE_URL != '/' ? import.meta.env.BASE_URL : '')

	    // Get the Ticket off the URL
		const params = new URLSearchParams(window.location.search)
	    const ticket = params.get('ticket')    
		
		// If user does not have a token, and doesn't have at ticket (from the URL), go to Webauth to get a ticket. 
		// User will return back to this router guard, there will be a page reload, and the URL will then contain a ticket.
		if (!ticket) { 
			window.location.replace(webAuthURL + serviceURL + location)			
		} else {
			
			// Having grabbed a ticket from Webauth.  Use it to get token, set cookie, set state token.
			let token = await user.getToken({ticket, location, serviceURL})
			await user.setToken(token.token)
			await user.setCookie(token.token) // Save the token in a cookie for future requests
		
			// Fix URL Appearance
			cleanUpURL()                  
		}
	}

	// Fetch any data that is needed before going on (superUser, etc)
	await user.initialize()  

	// Deny non-users.  Some more open apps only a token is required.  For other apps, a user role might be required.
	// This whole section can be commented out if User/Admin roles not used.
	if (!user.token) {
	//if (!user.isUser) {
		console.log("Denied")
		return '/NotAuthorized'
	} else { console.log("User allowed to the requested route")}

	// Some routes require admin role
	if (adminUserRoutes.includes(to.name) && !user.isAdmin) {
		console.log("Denied")
		return '/NotAuthorized'
	}

	// Proceed to the route
	return
})

// Global After Navigation Hook. Removes the ticket from the URL after routing is complete.
router.afterEach((to, from) => {
	const params = new URLSearchParams(window.location.search)
	if (params.has('ticket')) {
		cleanUpURL()
	}
})

function cleanUpURL() {
    let hostName = window.location.href.slice(0, window.location.href.indexOf("?"))
    window.history.pushState('home', 'TemplateApp', hostName)
}

export default router
