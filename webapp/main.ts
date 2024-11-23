import { createApp, markRaw } from 'vue';
import urql from '@urql/vue';
import { MotionPlugin } from '@vueuse/motion';
import VueSweetalert2 from 'vue-sweetalert2';
import Notifications from '@kyvg/vue3-notification'
import FloatingVue from 'floating-vue';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { 
    faBell, faCog, faUser, faChevronDown, faBars, faMeteor, faTachometerAlt, faBullseye,
    faUserInjured, faClinicMedical, faVial, faGripVertical, faDatabase, faTruck, faBoxesStacked,
    faFlag, faFileMedical, faUsers, faCaravan, faLaptopMedical, faFill, faMicroscope, faGripHorizontal,
    faCopy, faCodeBranch, faMoneyBill, faEdit, faLeftRight, faSort, faTimes, faEllipsis, faBarcode, 
    faCheckCircle, faTimesCircle, faThumbsDown, faThumbsUp, faQuestion, faDownload, faBan,
    faCartShopping, faInfo, faInfoCircle, faAnchor, faThList, faTh, faTrash, faAsterisk, faArrowUpWideShort,
    faArrowDown, faLevelDownAlt, faArrowDownWideShort, faPen, faDeleteLeft, faEllipsisH
} from '@fortawesome/free-solid-svg-icons';
import { CkeditorPlugin } from '@ckeditor/ckeditor5-vue';
import VueDatePicker from '@vuepic/vue-datepicker';
import LayoutDashboard from '@/views/layouts/LayoutDashboard.vue';
import LayoutEmpty from '@/views/layouts/LayoutEmpty.vue';
import LayoutMobile from '@/views/layouts/LayoutMobile.vue';

import 'vue-multiselect/dist/vue-multiselect.css';
import 'floating-vue/dist/style.css';
import 'sweetalert2/dist/sweetalert2.min.css';
import 'notyf/notyf.min.css';
import '@vuepic/vue-datepicker/dist/main.css'
import '@/index.css';
import '@/assets/css/style.css';
import '@/assets/css/ckeditor.css';

import App from './App.vue';
import router from './router';
import { createPinia } from 'pinia';
import { urqlClient } from './urql';

const icons = [
    faBell, faCog, faUser, faChevronDown, faBars, faMeteor, faTachometerAlt, faBullseye,
    faUserInjured, faClinicMedical, faVial, faGripVertical, faDatabase, faTruck, faBoxesStacked,
    faFlag, faFileMedical, faUsers, faCaravan, faLaptopMedical, faFill, faMicroscope, faGripHorizontal,
    faCopy, faCodeBranch, faMoneyBill, faEdit, faLeftRight, faSort, faTimes, faEllipsis, faBarcode,
    faCheckCircle, faTimesCircle, faThumbsDown, faThumbsUp, faQuestion, faDownload, faBan, faCartShopping,
    faInfoCircle, faAnchor, faThList, faTh, faInfo, faTrash, faAsterisk, faArrowUpWideShort, faArrowDownWideShort,
    faArrowDown, faLevelDownAlt, faPen, faDeleteLeft, faEllipsisH
]
library.add(...icons);

const pinia = createPinia();
pinia.use(({ store }) => {
    store.router = markRaw(router);
});

const app = createApp(App);
app.component('font-awesome-icon', FontAwesomeIcon);
app.component('VueDatePicker', VueDatePicker);
app.component('default-layout', LayoutDashboard);
app.component('empty-layout', LayoutEmpty);
app.component('mobile-layout', LayoutMobile);

app.use(VueSweetalert2);
app.use(Notifications)
app.use(CkeditorPlugin);
app.use(FloatingVue);
app.use(MotionPlugin);
app.use(pinia);
app.use(router);
app.use(urql, urqlClient);
app.mount('#felicityApp');



// https://enterprisevue.dev/blog/error-handling-in-vue-3/
// https://medium.com/@dillonchanis/handling-errors-in-vue-with-error-boundaries-91f6ead0093b