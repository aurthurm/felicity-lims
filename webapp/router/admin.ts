import { defineAsyncComponent } from 'vue'

const adminRoutes = [
    {
        path: '',
        name: 'felicity-configs',
        component: () => import('../views/admin/Admin.vue'),
        meta: {
            requiresAuth: true,
        },
    },
    {
        path: 'users-conf',
        name: 'users-conf',
        component: () => import('../views/admin/users/index.vue'),
        meta: {
            requiresAuth: true,
        },
    },
    {
        path: 'location-conf',
        name: 'location-conf',
        component: () => import('../views/admin/location/index.vue'),
        meta: {
            requiresAuth: true,
        },
    },
    {
        path: 'laboratory-conf',
        name: 'laboratory-conf',
        component: () => import('../views/admin/laboratory/index.vue'),
        meta: {
            requiresAuth: true,
        },
    },
    {
        path: 'instruments-conf',
        name: 'instruments-conf',
        component: () => import('../views/admin/instruments/index.vue'),
        meta: {
            requiresAuth: true,
        },
    },
    {
        path: 'publication-conf',
        name: 'publication-conf',
        component: () => import('../views/admin/publication/index.vue'),
        meta: {
            requiresAuth: true,
        },
    },
    {
        path: 'analyses-conf',
        name: 'analyses-conf',
        component: () => import('../views/admin/analyses/index.vue'),
        meta: {
            requiresAuth: true,
        },
    },
    {
        path: 'sampletypes-conf',
        name: 'sampletypes-conf',
        component: () => import('../views/admin/sample/index.vue'),
        meta: {
            requiresAuth: true,
        },
    },
    {
        path: 'identification-conf',
        name: 'identification-conf',
        component: () => import('../views/admin/patient/index.vue'),
        meta: {
            requiresAuth: true,
        },
    },
    {
        path: 'worksheets-conf',
        name: 'worksheets-conf',
        component: () => import('../views/admin/worksheets/index.vue'),
        meta: {
            requiresAuth: true,
        },
    },
    {
        path: 'suppliers-conf',
        name: 'suppliers-conf',
        component: () => import('../views/admin/suppliers/index.vue'),
        meta: {
            requiresAuth: true,
        },
    },
    {
        path: 'reflex-rule-conf',
        name: 'reflex-rule-conf',
        component: () => import('../views/admin/reflex/index.vue'),
        children: [
            {
                path: '',
                name: 'reflex-listing',
                component: () => import('../views/admin/reflex/ReflexListing.vue'),
                meta: {
                    requiresAuth: true,
                },
            },
            {
                path: ':uid',
                name: 'reflex-detail',
                component: () => import('../views/admin/reflex/_id/index.vue'),
                meta: {
                    requiresAuth: true,
                },
            },
        ],
        meta: {
            requiresAuth: true,
        },
    },
    {
        path: 'inventory-conf',
        name: 'inventory-conf',
        component: () => import('../views/admin/inventory/index.vue'),
        meta: {
            requiresAuth: true,
        },
    },
    {
        path: 'setup-data-conf',
        name: 'setup-data-conf',
        component: () => import('../views/admin/data-load/index.vue'),
        meta: {
            requiresAuth: true,
        },
    },
    {
        path: 'shipment-conf',
        name: 'shipment-conf',
        component: () => import('../views/admin/shipment/index.vue'),
        meta: {
            requiresAuth: true,
        },
    },
];

export default adminRoutes;
