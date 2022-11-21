const sampleRoutes = [
    {
        path: '',
        name: 'samples-listing',
        component: () => import('../views/components/SampleListing.vue'),
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
  ];
  
export default sampleRoutes;
  