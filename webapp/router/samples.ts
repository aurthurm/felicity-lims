const sampleRoutes = [
    {
        path: '',
        name: 'samples-listing',
        component: () => import('../views/sample/Samples.vue'),
        meta: {
            requiresAuth: true,
        },
    },
    {
        path: 'rejections',
        name: 'reject-samples',
        component: () => import('../views/sample/RejectSamples.vue'),
        props: true,
        meta: {
            requiresAuth: true,
        },
    },
    {
        path: 'add-to-storage',
        name: 'store-samples',
        component: () => import('../views/sample/StoreSamples.vue'),
        props: true,
        meta: {
            requiresAuth: true,
        },
    },
];

export default sampleRoutes;
