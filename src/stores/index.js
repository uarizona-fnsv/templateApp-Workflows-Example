import { createPinia } from 'pinia'
const pinia = createPinia()

import { useApi } from '../stores/api';
import { useApp } from '../stores/app';
import { useUI } from '../stores/ui';
import { useUser } from '../stores/user';

const api = useApi(pinia)
const app = useApp(pinia)
const ui = useUI(pinia)
const user = useUser(pinia)


export { api, app, user, ui, pinia }