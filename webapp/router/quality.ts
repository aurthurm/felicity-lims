const qualityRoutes = [
    {
        path: '',
        name: 'quality-control-listing',
        component: () => import('@/views/qcontrol/QualityControlListing.vue'),
        meta: {
            requiresAuth: true,
        },
    },
    {
        path: 'charts',
        name: 'quality-control-charts',
        component: () => import('@/views/qcontrol/QualityCharts.vue'),
        meta: {
            requiresAuth: true,
        },
    },
    {
        path: '/qc-set/:qcSetUid',
        name: 'qc-set-view',
        component: () => import('@/views/qcontrol/_id/QualityControl.vue'),
        children: [
            {
                path: '',
                name: 'qc-set-detail',
                component: () => import('@/views/qcontrol/_id/QCSet.vue'),
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
