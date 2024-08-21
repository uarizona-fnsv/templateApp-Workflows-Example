import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import About from '../views/About.vue'
import Usage from '../views/Usage.vue'
import Upload from '../views/Upload.vue'
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
			beforeEnter() { ui.pageTitle="TemplateApp About" },
		},
		{
			path: '/Usage',
			name: 'Usage',
			component: Usage,
			beforeEnter() { ui.pageTitle="TemplateApp Usage" },
		},
		{
			path: '/Upload',
			name: 'Upload',
			component: Upload,
			beforeEnter() { ui.pageTitle="TemplateApp Upload" },
		},
	]
})

// Before any route is resolved, execute this code
router.beforeEach(async (to, from, next) => {
	if (!user.token || user.token == 'undefined') {		
		
		let location = to.path //route user wants to go to

		console.log("No Token")
		//Check URL for an appended webauth ticket.
		const params = new URLSearchParams(window.location.search)
		const ticket = params.get('ticket')
		let currentURL = window.location.href        

		var serviceURL

		if (process.env.NODE_ENV === 'development'){
			serviceURL = "http://localhost:" + window.location.port
		}
		else {
			if (import.meta.env.VITE_APP_DEPLOYMENT === 'beta') {
				serviceURL = "https://beta.apps.ufs.arizona.edu/lyftcodes"
			}
			else {
				serviceURL = "https://apps.ba.arizona.edu/lyftcodes"
			}
		}
		
		//If we have no webauth ticket, send user to Webauth. If we do have one, create a JWT token on the API.
		if (!ticket) { 
			if (process.env.NODE_ENV === 'development') {
				window.location.replace('https://webauth.arizona.edu/webauth/login?service=' + serviceURL + location)
			}
			else {
				window.location.replace('https://webauth.arizona.edu/webauth/login?service=' + serviceURL  + location)  
			}
			
		} else {

			user.token && console.log('JWT Token is ' + user.token) 
			// Login user, set cookie, set state variable

			let token = await user.getToken({ticket, location, serviceURL})
		
			// Fix URL Appearance
			let hostName = window.location.href.slice(0, window.location.href.indexOf("?"));
			window.history.pushState('home', 'Lyft Codes', hostName);
			window.location.reload()                    
		}
	}

	await user.initializeUser()   

	// These routes require isSuperUser
	if (to.name === 'Usage' && !user.isSuperUser) { console.log("Denied"); next('/'); return; }
	if (to.name === 'Upload' && !user.isSuperUser) { console.log("Denied"); next('/'); return; }

	next()

}) 
export default router
