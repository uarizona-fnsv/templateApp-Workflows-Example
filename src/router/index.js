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
	        const webAuthURL = "https://webauth.arizona.edu/webauth/login?service="
	        let location = to.path
	        let serviceURL = window.location.origin

	        if (!ticket) {
	        	window.location.replace(webAuthURL + serviceURL + location)
	        } else {

		        let tokenResult = await user.getToken({ ticket, location, serviceURL })
				if (!tokenResult) { return '/ServiceDown'}
		        cleanUpURL()
		        window.location.reload()
	    	}
	    }

	    // INITIALIZE/GET ANY DATA SUCH AS RIGHTS NEEDED BEFORE FURTHER ROUTING AND FETCHES		
	    await user.initialize()
		
	    // EXAMPLE OF HOW TO GATE OFF ROUTES BASED ON USER RIGHTS
	    // THESE ROUTES WILL BE REDIRECTED TO HOME IF NOT SUPERUSER
	    if ((to.name === 'Usage' || to.name === 'Admin') && !user.isSuperUser) {
	       return '/'
	    } else {
	       return true
	    }
		
})

function cleanUpURL() {
    let hostName = window.location.href.slice(0, window.location.href.indexOf("?"))
    window.history.pushState('home', 'TemplateApp', hostName)
}

export default router
