import { registerLicense } from '@syncfusion/ej2-base';
import { markRaw } from 'vue';
import VueDatePicker from '@vuepic/vue-datepicker';
import LayoutDashboard from '@/layouts/LayoutDashboard.vue';
import LayoutEmpty from '@/layouts/LayoutEmpty.vue';
import LayoutMobile from '@/layouts/LayoutMobile.vue';
import FelPageHeading from '@/components/common/FelPageHeading.vue'
import FelModal from '@/components/ui/FelModal.vue';
import FelButton from '@/components/ui/buttons/FelButton.vue';
import FelLoader from '@/components/ui/spinners/FelLoader.vue';
import FelTabs from '@/components/ui/tabs/FelTabs.vue';
import FelAccordion from "@/components/ui/FelAccordion.vue";

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
import { App } from 'vue';
import FelDrawer from './components/ui/FelDrawer.vue';

// Register global components
export const registerComponents = (app: App) => {
    app.component('font-awesome-icon', FontAwesomeIcon);
    app.component('VueDatePicker', VueDatePicker);
    app.component('default-layout', LayoutDashboard);
    app.component('empty-layout', LayoutEmpty);
    app.component('mobile-layout', LayoutMobile);
    app.component('fel-heading', FelPageHeading);
    app.component('fel-modal', FelModal);
    app.component('fel-button', FelButton);
    app.component('fel-loader', FelLoader);
    app.component('fel-tabs', FelTabs);
    app.component('fel-accordion', FelAccordion);
    app.component('fel-drawer', FelDrawer);
}

// Register plugins and global state
export const registerPlugins = (app: App) => {
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

// Register Syncfusion license if available
export const registerLicenses = () => {
    if (VITE_SYNCFUSION_LICENSE) {
        registerLicense(VITE_SYNCFUSION_LICENSE);
    }
}