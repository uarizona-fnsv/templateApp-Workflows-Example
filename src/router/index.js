import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import About from '../views/About.vue'
import ServiceDown from '../views/ServiceDown.vue'
import NotAuthorized from '../views/NotAuthorized.vue'

import { API_JWT_AUTH } from '@/stores/user'
import { user, ui } from '@/stores'
import jscookie from 'js-cookie'

const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
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

	// Routes that will require superUser status for user
	const superUserRoutes = ['AdminExample'];
	
	// Skip Authentication for noAuthRoutes
	if (noAuthRoutes.includes(to.name)) {
		return
	}

	// If there is no token saved, get ticket from webauth, and use that to get a JSON Web Token 
	// Token will be used for authentication with all subsequent API calls.
	if (!user.token || user.token == 'undefined') {
		
		const webAuthURL = "https://webauth.arizona.edu/webauth/login?service="
	    let location = to.path 

	    // See vite.config.js for base (used in deployment)
	    let serviceURL = window.location.origin + (import.meta.env.BASE_URL != '/' ? import.meta.env.BASE_URL : '')

	    const params = new URLSearchParams(window.location.search)
	    const ticket = params.get('ticket')    
		
		// If we dont have a token, and don't have the ticket yet, go to Webauth to get a ticket. 
		if (!ticket) { 
			window.location.replace(webAuthURL + serviceURL + location)			
		} else {
			
			// We have a ticket now.  Use it to get token, set cookie, set state token.
			let token = await user.getToken({ticket, location, serviceURL})
		
			// Fix URL Appearance
			cleanUpURL()                  
		}
	}

	// Fetch any data that is needed before going on (superUser, etc)
	await user.initialize()  
	
	if (user.isUser) { console.log("Has the User Role") } 

	// Deny non-users
	if (!user.isUser) {
		console.log("Denied")
		return '/NotAuthorized'
	}

	// Some routes require superUser status
	if (superUserRoutes.includes(to.name) && !user.isSuperUser) {
		console.log("Denied")
		return '/NotAuthorized'
	}

	// Proceed to the route
	return

})

function cleanUpURL() {
    let hostName = window.location.href.slice(0, window.location.href.indexOf("?"))
    window.history.pushState('home', 'TemplateApp', hostName)
}

export default router
