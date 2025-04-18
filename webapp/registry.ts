import { registerLicense } from '@syncfusion/ej2-base';
import { markRaw } from 'vue';
import VueDatePicker from '@vuepic/vue-datepicker';
import LayoutDashboard from '@/layouts/LayoutDashboard.vue';
import LayoutEmpty from '@/layouts/LayoutEmpty.vue';
import LayoutMobile from '@/layouts/LayoutMobile.vue';
import PageHeading from '@/components/common/FelPageHeading.vue';
import FelModal from "@/components/ui/FelModal.vue";
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { MotionPlugin } from '@vueuse/motion';
import VueSweetalert2 from 'vue-sweetalert2';
import Notifications from '@kyvg/vue3-notification'
import FloatingVue from 'floating-vue';
import { urqlClient } from './urql';
import urql from '@urql/vue';
import { CkeditorPlugin } from '@ckeditor/ckeditor5-vue';
import router from './router';
import { createPinia } from 'pinia';
import { VITE_SYNCFUSION_LICENSE } from './conf';

export const registerComponents = (app: any) => {
    app.component('font-awesome-icon', FontAwesomeIcon);
    app.component('VueDatePicker', VueDatePicker);
    app.component('default-layout', LayoutDashboard);
    app.component('empty-layout', LayoutEmpty);
    app.component('mobile-layout', LayoutMobile);
    app.component('page-heading', PageHeading);
    app.component('modal', FelModal);
}

export const registerPlugins = (app: any) => {
    const pinia = createPinia();
    pinia.use(({store}) => {
        store.router = markRaw(router);
    });
    app.use(VueSweetalert2);
    app.use(Notifications)
    app.use(CkeditorPlugin);
    app.use(FloatingVue);
    app.use(MotionPlugin);
    app.use(pinia);
    app.use(router);
    app.use(urql, urqlClient);
}

export const registerLicenses = () => {
    if (VITE_SYNCFUSION_LICENSE) {
        registerLicense(VITE_SYNCFUSION_LICENSE);
    }
}