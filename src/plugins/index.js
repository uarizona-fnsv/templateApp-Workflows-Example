/**
 * plugins/index.js
 *
 * Automatically included in `./src/main.js`
 */

// Plugins
import { loadFonts } from './webfontloader'
import vuetify from './vuetify'
import { pinia } from '../stores'
import router from '../router'
import VueTheMask from 'vue-the-mask'

export function registerPlugins (app) {
  loadFonts()
  app
    .use(vuetify)
    .use(pinia)
    .use(router)
    .use(VueTheMask)
}
