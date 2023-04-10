const patientRoutes = [
    {
        path: '',
        name: 'patients-listing',
        component: () => import('../views/patient/Patients.vue'),
        meta: {
            requiresAuth: true,
        },
    },
    {
        path: 'register',
        name: 'patients-register',
        component: () => import('../views/patient/AddPatient.vue'),
        meta: {
            requiresAuth: true,
        },
    },
    {
        path: 'search',
        name: 'patients-search',
        component: () => import('../views/patient/Patients.vue'),
        meta: {
            requiresAuth: true,
        },
    },
    {
        path: ':patientUid',
        name: 'patient',
        component: () => import('../views/patient/_id/index.vue'),
        children: [
            {
                path: '',
                name: 'patient-detail',
                component: () => import('../views/patient/_id/PatientDetail.vue'),
                meta: {
                    requiresAuth: true,
                },
            },
            {
                path: 'add-sample',
                name: 'samples-add',
                component: () => import('../views/sample/SamplesAdd.vue'),
                meta: {
                    requiresAuth: true,
                },
            },
            {
                path: 'samples',
                name: 'patient-samples',
                component: () => import('../views/sample/_id/index.vue'),
                children: [
                    {
                        path: ':sampleUid',
                        name: 'sample-detail',
                        component: () => import('../views/sample/_id/SampleDetail.vue'),
                        meta: {
                            requiresAuth: true,
                        },
                    },
                ],
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

export default patientRoutes;
