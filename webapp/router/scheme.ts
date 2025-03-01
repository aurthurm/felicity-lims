const schemeRoutes = [
    {
        path: '',
        name: 'schemes',
        component: () => import('@/views/grind/SchemeListing.vue'),
        meta: {
            requiresAuth: true,
        },
    },
    {
        path: ':schemeUid',
        name: 'scheme',
        component: () => import('@/views/grind/Schemes.vue'),
        meta: {
            requiresAuth: true,
        },
        children:[
            {
                path: '',
                name: 'scheme-detail',
                component: () => import('@/views/grind/_id/Scheme.vue'),
                meta: {
                    requiresAuth: true,
                }
            },
            {
                path: 'board/:boardUid/errand/:errandUid',
                name: 'errand-detail',
                component: () => import('@/views/grind/_id/ErrandDetail.vue'),
                meta: {
                    requiresAuth: true,
                }
            },
        ],
    },
];

export default schemeRoutes;
