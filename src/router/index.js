import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import About from '../views/About.vue'
import Usage from '../views/Usage.vue'
import ServiceDown from '../views/ServiceDown.vue'
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
			path: '/ServiceDown',
			name: 'ServiceDown',
			component: ServiceDown,
		},
	]
})

// EXECUTED BEFORE ROUTING
router.beforeEach(async (to, from) => {

	    if ((!user.token || user.token === 'undefined') && to.name !== 'ServiceDown') {
	        console.log("No Token")
	        
	        const params = new URLSearchParams(window.location.search)
	        const ticket = params.get('ticket')
	        let location = to.path
	        let serviceURL = determineServiceURL()

	        if (!ticket) {
	            redirectToWebAuth(serviceURL + location) 
	        }

	        const tokenResult = await user.getToken({ ticket, location, serviceURL })
			if (!tokenResult) { return '/ServiceDown'}
	        cleanUpURL()
	        window.location.reload()

	    // INITIALIZE/GET ANY DATA SUCH AS RIGHTS NEEDED BEFORE FURTHER ROUTING AND FETCHES
		
	    	await user.initialize()
		
	    // EXAMPLE OF HOW TO GATE OFF ROUTES BASED ON USER RIGHTS
	    if ((to.name === 'Usage' || to.name === 'Admin') && !user.isSuperUser) {
	       return '/'
	    } else {
	       return true
	    }
	}
		
})

// SET THE BETA AND PRODUCTION SERVER URLS FOR WEBAUTH TO RETURN TO.
// THESE ARE SWITCHED BASED ON 'VITE_APP_DEPLOYMENT' IN .ENV FILE
function determineServiceURL() {
    if (process.env.NODE_ENV === 'development') {
        return "http://localhost:" + window.location.port
    } else if (import.meta.env.VITE_APP_DEPLOYMENT === 'beta') {
        return "https://beta.apps.ufs.arizona.edu/templateApp"
    } else {
        return "https://apps.ba.arizona.edu/templateApp"
    }
}

function redirectToWebAuth(url) {
    window.location.replace('https://webauth.arizona.edu/webauth/login?service=' + url)
}

function cleanUpURL() {
    let hostName = window.location.href.slice(0, window.location.href.indexOf("?"))
    window.history.pushState('home', 'TemplateApp', hostName)
}

export default router
