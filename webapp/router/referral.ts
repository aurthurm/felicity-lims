const shipmentRoutes = [
    {
        path: '',
        name: 'shipment-listing',
        component: () => import('../views/shipment/ShipmentListing.vue'),
        meta: {
            requiresAuth: true,
        },
    },
    {
        path: ':shipmentUid',
        name: 'shipment-single',
        component: () => import('../views/shipment/_id/index.vue'),
        children: [
            {
                path: '',
                name: 'shipment-detail',
                component: () => import('../views/shipment/_id/ShipmentDetail.vue'),
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

export default shipmentRoutes;
