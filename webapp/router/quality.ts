const qualityRoutes = [
    {
        path: '',
        name: 'quality-control-listing',
        component: () => import('../views/qcontrol/Listing.vue'),
        meta: {
            requiresAuth: true,
        },
    },
    {
        path: '/qc-set/:qcSetUid',
        name: 'qc-set-view',
        component: () => import('../views/qcontrol/_id/index.vue'),
        children: [
            {
                path: '',
                name: 'qc-set-detail',
                component: () => import('../views/qcontrol/_id/QCSet.vue'),
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

export default qualityRoutes;
