import { RouteRecordRaw } from 'vue-router';

export const PLATFORM_LOGIN = 'PLATFORM_LOGIN';
export const PLATFORM_HOME = 'PLATFORM_HOME';

const platformRoutes: RouteRecordRaw[] = [
    {
        path: '/',
        redirect: { name: PLATFORM_HOME },
    },
    {
        path: '/platform/login',
        name: PLATFORM_LOGIN,
        component: () => import('@/views/platform/Login.vue'),
        meta: {
            layout: 'empty',
        },
    },
    {
        path: '/platform',
        name: PLATFORM_HOME,
        component: () => import('@/views/platform/Dashboard.vue'),
        meta: {
            layout: 'empty',
            requiresPlatformAuth: true,
        },
    },
    {
        path: '/platform-login',
        name: 'platform-login',
        redirect: { name: PLATFORM_LOGIN },
    },
    {
        path: '/platform-dashboard',
        name: 'platform-dashboard',
        redirect: { name: PLATFORM_HOME },
    },
    {
        path: '/:pathMatch(.*)*',
        redirect: { name: PLATFORM_HOME },
    },
];

export default platformRoutes;
