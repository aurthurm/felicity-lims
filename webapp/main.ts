import { createApp, markRaw } from 'vue'
import urql from '@urql/vue'
import { MotionPlugin } from '@vueuse/motion'
import VueSweetalert2 from 'vue-sweetalert2'
import FloatingVue from 'floating-vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { library, dom } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { fab } from '@fortawesome/free-brands-svg-icons'
import LayoutDashboard from './views/layouts/LayoutDashboard.vue'
import LayoutEmpty from './views/layouts/LayoutEmpty.vue'

import 'floating-vue/dist/style.css'
import 'sweetalert2/dist/sweetalert2.min.css'
import 'notyf/notyf.min.css'
import './index.css'
import './assets/css/style.css'

import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'
import { urqlClient } from './urql'

library.add(fas, fab)
dom.watch()

const pinia = createPinia();
pinia.use(({ store }) => {
    store.$router = markRaw(router)
});

const app = createApp(App)
app.use(pinia)
app.component('font-awesome-icon', FontAwesomeIcon)
app.component('default-layout', LayoutDashboard)
app.component('empty-layout', LayoutEmpty)
app.use(urql, urqlClient)
app.use(VueSweetalert2)
app.use(FloatingVue)
app.use(MotionPlugin)
app.use(router)

const isMobile = (navigator as any)?.userAgentData?.mobile ?? false;

if(!isMobile) {
    app.mount('#felicityApp')
}