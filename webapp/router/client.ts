const clientRoutes = [
    {
        path: '',
        name: 'clients-listing',
        component: () => import('../views/client/Clients.vue'),
        meta: {
            requiresAuth: true,
        },
    },
    {
        path: 'single',
        name: 'client-single-view',
        component: () => import('../views/client/_id/index.vue'),
        children: [
            {
                path: '',
                name: 'client-detail',
                component: () => import('../views/client/_id/ClientDetail.vue'),
                meta: {
                    requiresAuth: true,
                },
            },
        ],
        meta: {
            requiresAuth: true,
        },
    },
];

export default clientRoutes;
