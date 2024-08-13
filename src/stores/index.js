import { createPinia } from 'pinia'
const pinia = createPinia()

import { useApi } from '../stores/api';
import { useUI } from '../stores/ui';
import { useUser } from '../stores/user';

const ui = useUI(pinia)
const user = useUser(pinia)
const api = useApi(pinia)

export { user, ui, api, pinia }