const clientRoutes = [
    {
        path: '',
        name: 'clients-listing',
        component: () => import('@/views/client/ClientListing.vue'),
        meta: {
            requiresAuth: true,
        },
    },
    {
        path: 'single',
        name: 'client-single-view',
        component: () => import('@/views/client/_id/Client.vue'),
        children: [
            {
                path: '',
                name: 'client-detail',
                component: () => import('@/views/client/_id/ClientDetail.vue'),
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
