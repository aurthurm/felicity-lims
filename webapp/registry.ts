import { App, markRaw } from 'vue';
import { VueDatePicker } from '@vuepic/vue-datepicker';
import LayoutDashboard from '@/layouts/LayoutDashboard.vue';
import LayoutEmpty from '@/layouts/LayoutEmpty.vue';
import LayoutMobile from '@/layouts/LayoutMobile.vue';
import Modal from '@/components/ui/Modal.vue';
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableEmpty,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';

import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { MotionPlugin } from '@vueuse/motion';

import { urqlClient } from './urql';
import urql from '@urql/vue';
import { CkeditorPlugin } from '@ckeditor/ckeditor5-vue';
import router from './router';
import { createPinia } from 'pinia';
import Drawer from './components/ui/Drawer.vue';
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';

// Register global components
export const registerComponents = (app: App) => {
    app.component('font-awesome-icon', FontAwesomeIcon);
    app.component('VueDatePicker', VueDatePicker);
    app.component('default-layout', LayoutDashboard);
    app.component('empty-layout', LayoutEmpty);
    app.component('mobile-layout', LayoutMobile);
    app.component('Modal', Modal);
    app.component('Drawer', Drawer);
    app.component('Checkbox', Checkbox);
    app.component('Switch', Switch);
    app.component('Table', Table);
    app.component('TableBody', TableBody);
    app.component('TableCaption', TableCaption);
    app.component('TableCell', TableCell);
    app.component('TableEmpty', TableEmpty);
    app.component('TableFooter', TableFooter);
    app.component('TableHead', TableHead);
    app.component('TableHeader', TableHeader);
    app.component('TableRow', TableRow);
};

// Register plugins and global state
export const registerPlugins = (app: App) => {
    const pinia = createPinia();
    pinia.use(({ store }) => {
        store.router = markRaw(router);
    });
    app.use(CkeditorPlugin);
    app.use(MotionPlugin);
    app.use(pinia);
    app.use(router);
    app.use(urql, urqlClient);
};
