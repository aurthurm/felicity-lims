import {App, markRaw} from 'vue';
import {VueDatePicker} from '@vuepic/vue-datepicker';
import LayoutDashboard from '@/layouts/LayoutDashboard.vue';
import LayoutEmpty from '@/layouts/LayoutEmpty.vue';
import LayoutMobile from '@/layouts/LayoutMobile.vue';
import BeakPageHeading from '@/components/common/BeakPageHeading.vue';
import BeakModal from '@/components/ui/BeakModal.vue';
import BeakButton from '@/components/ui/buttons/BeakButton.vue';
import BeakLoader from '@/components/ui/spinners/BeakLoader.vue';
import BeakTabs from '@/components/ui/tabs/BeakTabs.vue';
import BeakAccordion from '@/components/ui/BeakAccordion.vue';

import {FontAwesomeIcon} from '@fortawesome/vue-fontawesome';
import {MotionPlugin} from '@vueuse/motion';
import VueSweetalert2 from 'vue-sweetalert2';
import Notifications from '@kyvg/vue3-notification';
import FloatingVue from 'floating-vue';
import {urqlClient} from './urql';
import urql from '@urql/vue';
import {CkeditorPlugin} from '@ckeditor/ckeditor5-vue';
import router from './router';
import {createPinia} from 'pinia';
import BeakDrawer from './components/ui/BeakDrawer.vue';

// Register global components
export const registerComponents = (app: App) => {
    app.component('font-awesome-icon', FontAwesomeIcon);
    app.component('VueDatePicker', VueDatePicker);
    app.component('default-layout', LayoutDashboard);
    app.component('empty-layout', LayoutEmpty);
    app.component('mobile-layout', LayoutMobile);
    app.component('beak-heading', BeakPageHeading);
    app.component('beak-modal', BeakModal);
    app.component('beak-button', BeakButton);
    app.component('beak-loader', BeakLoader);
    app.component('beak-tabs', BeakTabs);
    app.component('beak-accordion', BeakAccordion);
    app.component('beak-drawer', BeakDrawer);
};

// Register plugins and global state
export const registerPlugins = (app: App) => {
    const pinia = createPinia();
    pinia.use(({store}) => {
        store.router = markRaw(router);
    });
    app.use(VueSweetalert2);
    app.use(Notifications);
    app.use(CkeditorPlugin);
    app.use(FloatingVue);
    app.use(MotionPlugin);
    app.use(pinia);
    app.use(router);
    app.use(urql, urqlClient);
};
