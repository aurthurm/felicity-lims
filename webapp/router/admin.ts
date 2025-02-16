const adminRoutes = [
    {
        path: '',
        name: 'felicity-configs',
        component: () => import('@/views/admin/AdminLinks.vue'),
        meta: {
            requiresAuth: true,
        },
    },
    {
        path: 'users-conf',
        name: 'users-conf',
        component: () => import('@/views/admin/users/UsersAdmin.vue'),
        meta: {
            requiresAuth: true,
        },
    },
    {
        path: 'location-conf',
        name: 'location-conf',
        component: () => import('@/views/admin/location/LocationAdmin.vue'),
        meta: {
            requiresAuth: true,
        },
    },
    {
        path: 'laboratory-conf',
        name: 'laboratory-conf',
        component: () => import('@/views/admin/laboratory/LaboratoryAdmin.vue'),
        meta: {
            requiresAuth: true,
        },
    },
    {
        path: 'instruments-conf',
        name: 'instruments-conf',
        component: () => import('@/views/admin/instruments/InstrumentsAdmin.vue'),
        meta: {
            requiresAuth: true,
        },
    },
    {
        path: 'publication-conf',
        name: 'publication-conf',
        component: () => import('@/views/admin/publication/PublicationAdmin.vue'),
        meta: {
            requiresAuth: true,
        },
    },
    {
        path: 'analyses-conf',
        name: 'analyses-conf',
        component: () => import('@/views/admin/analyses/AnalysesAdmin.vue'),
        meta: {
            requiresAuth: true,
        },
    },
    {
        path: 'sampletypes-conf',
        name: 'sampletypes-conf',
        component: () => import('@/views/admin/sample/SampleAdmin.vue'),
        meta: {
            requiresAuth: true,
        },
    },
    {
        path: 'identification-conf',
        name: 'identification-conf',
        component: () => import('@/views/admin/patient/PatientAdmin.vue'),
        meta: {
            requiresAuth: true,
        },
    },
    {
        path: 'coding-conf',
        name: 'coding-conf',
        component: () => import('@/views/admin/coding/CodingAdmin.vue'),
        meta: {
            requiresAuth: true,
        },
    },
    {
        path: 'worksheets-conf',
        name: 'worksheets-conf',
        component: () => import('@/views/admin/worksheets/WorkSheetsAdmin.vue'),
        meta: {
            requiresAuth: true,
        },
    },
    {
        path: 'suppliers-conf',
        name: 'suppliers-conf',
        component: () => import('@/views/admin/suppliers/SupplierAdmin.vue'),
        meta: {
            requiresAuth: true,
        },
    },
    {
        path: 'reflex-rule-conf',
        name: 'reflex-rule-conf',
        component: () => import('@/views/admin/reflex/ReflexAdmin.vue'),
        children: [
            {
                path: '',
                name: 'reflex-listing',
                component: () => import('@/views/admin/reflex/ReflexListing.vue'),
                meta: {
                    requiresAuth: true,
                },
            },
            {
                path: ':uid',
                name: 'reflex-detail',
                component: () => import('@/views/admin/reflex/_id/Reflex.vue'),
                meta: {
                    requiresAuth: true,
                },
            },
        ],
        meta: {
            requiresAuth: true,
        },
    },
    {
        path: 'inventory-conf',
        name: 'inventory-conf',
        component: () => import('@/views/admin/inventory/InventoryAdmin.vue'),
        meta: {
            requiresAuth: true,
        },
    },
    {
        path: 'setup-data-conf',
        name: 'setup-data-conf',
        component: () => import('@/views/admin/data-load/DataLoad.vue'),
        meta: {
            requiresAuth: true,
        },
    },
    {
        path: 'shipment-conf',
        name: 'shipment-conf',
        component: () => import('@/views/admin/shipment/ShipmentAdmin.vue'),
        meta: {
            requiresAuth: true,
        },
    },
    {
        path: 'billing-conf',
        component: () => import('@/views/admin/billing/BillingAdmin.vue'),
        meta: {
            requiresAdmin: true,
        },
    },
    {
        path: 'antibiotics-conf',
        component: () => import('@/views/admin/microbiology/antibiotics/AntibioticsAdmin.vue'),
        meta: {
            requiresAdmin: true,
        },
    },
    {
        path: 'organisms-conf',
        component: () => import('@/views/admin/microbiology/organism/OrganismAdmin.vue'),
        meta: {
            requiresAdmin: true,
        },
    },
    {
        path: 'medium-qc-conf',
        component: () => import('@/views/admin/microbiology/medium/AbxMediumAdmin.vue'),
        meta: {
            requiresAdmin: true,
        },
    },
    {
        path: 'ast-panel-conf',
        component: () => import('@/views/admin/microbiology/astpanel/AstPanelAdmin.vue'),
        meta: {
            requiresAdmin: true,
        },
    },
    {
        path: 'resistance-rules-conf',
        component: () => import('@/views/admin/microbiology/resistance/AbxResistanceAdmin.vue'),
        meta: {
            requiresAdmin: true,
        },
    },
    {
        path: 'breakpoints-conf',
        component: () => import('@/views/admin/microbiology/breakpoints/AbxBreakpointAdmin.vue'),
        meta: {
            requiresAdmin: true,
        },
    },
];

export default adminRoutes;
