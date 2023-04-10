const wsRoutes = [
    {
        path: '',
        name: 'worksheet-listing',
        component: () => import('../views/worksheet/WorkSheetListing.vue'),
        meta: {
            requiresAuth: true,
        },
    },
    {
        path: ':workSheetUid',
        name: 'worksheet-single',
        component: () => import('../views/worksheet/_id/index.vue'),
        children: [
            {
                path: '',
                name: 'worksheet-detail',
                component: () => import('../views/worksheet/_id/WorkSheetDetail.vue'),
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

export default wsRoutes;
