import { RouteRecordRaw, createRouter, createWebHistory } from 'vue-router';
import * as guards from './../guards';
import adminRoutes from './admin';
import patientRoutes from './patient';
import clientRoutes from './client';
import { isTokenValid } from './checks';
import { useAuthStore } from '../stores';


const routes: RouteRecordRaw[] = [
  {
    path: '/dashboard',
    name: guards.pages.DASHBOARD,
    component: () => import('../views/dashboard/index.vue'),
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: '/auth',
    name: guards.pages.LOGIN,
    component: () => import('../views/auth/Login.vue'),
    meta: { layout: 'empty' },
  },
  {
    path: '/patients',
    name: guards.pages.PATIENTS,
    component: () => import('../views/patient/index.vue'),
    children: patientRoutes,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: '/patients-compact',
    name: guards.pages.PATIENTS_COMPACT,
    component: () => import('../views/patient/PatientsCompact.vue'),
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: '/clients',
    name: guards.pages.CLIENTS,
    component: () => import('../views/client/index.vue'),
    children: clientRoutes,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: '/samples',
    name: guards.pages.SAMPLES,
    component: () => import('../views/sample/index.vue'),
    children: [
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
    ],
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: '/quality-control',
    name: guards.pages.QC_SAMPLES,
    component: () => import('../views/qcontrol/index.vue'),
    children: [
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
    ],
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: '/worksheets',
    name: guards.pages.WORKSHEETS,
    component: () => import('../views/worksheet/index.vue'),
    children: [
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
          }
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
  {
    name: guards.pages.NOTICE_MANAGER,
    path: '/notice-manager',
    component: () => import('../views/notice/index.vue'),
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: '/about',
    name: 'About',
    component: () => import('../views/About.vue'),
    meta: {
      requiresAuth: true,
    },
  },
  {
    name: guards.pages.ADMINISTRATION,
    path: '/admin',
    component: () => import('../views/admin/index.vue'),
    children: adminRoutes,
    meta: {
      requiresAuth: true,
      requiresAdmin: true,
    },
  },
  {
    name: guards.pages.FOUR_OR_FOUR,
    path: '/:pathMatch(.*)',
    component: () => import('../views/404.vue'),
    meta: {
      layout: 'empty',
    },
  },
  {
    name: guards.pages.NOT_AUTHORISED,
    path: '/acced-denied',
    component: () => import('../views/Restricted.vue'),
    meta: {
      layout: 'empty',
    },
  },
  {
    path: '/installation',
    name: guards.pages.INSTALLATION,
    component: () => import('../views/install/index.vue'),
    meta: {
      layout: 'empty'
    }
  }
];

const router = createRouter({
  history: createWebHistory('/'), // import.meta.env.VITE_BASE_URL
  routes,
});

router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()

  if(to.path === '/') {
    next({ name: guards.pages.DASHBOARD });
    return;
  }

  if (to.matched.some((record) => record.meta.requiresAuth)) {

    if (!isTokenValid(authStore.auth.token!)) {
      next({ name: guards.pages.LOGIN });
    } else {
      if(!hasAccess(to.matched[0].name)){  // to.matched[0] get outer page
       next({ name: guards.pages.NOT_AUTHORISED });
      } else {
        next();
      }

    }

  } else {

    if(to.path === '/auth') {
      const isValid = isTokenValid(authStore.auth.token!)
      if (isValid) {
        next({ name: guards.pages.DASHBOARD })
      };
    }

    next();
  }

});


function hasAccess(page: any) {

  switch (page) {
    case guards.pages.DASHBOARD:
      return guards.canAccessPage(guards.pages.DASHBOARD)

    case guards.pages.PATIENTS:
      return guards.canAccessPage(guards.pages.PATIENTS)
      
    case guards.pages.PATIENTS_COMPACT:
      return guards.canAccessPage(guards.pages.PATIENTS_COMPACT)
    
    case guards.pages.CLIENTS:
      return guards.canAccessPage(guards.pages.CLIENTS)
    
    case guards.pages.SAMPLES:
      return guards.canAccessPage(guards.pages.SAMPLES)

    case guards.pages.QC_SAMPLES:
      return guards.canAccessPage(guards.pages.QC_SAMPLES)
      
    case guards.pages.WORKSHEETS:
      return guards.canAccessPage(guards.pages.WORKSHEETS)
    
    case guards.pages.ADMINISTRATION:
      return guards.canAccessPage(guards.pages.ADMINISTRATION)
  
    case guards.pages.NOTICE_MANAGER:
      return guards.canAccessPage(guards.pages.NOTICE_MANAGER)

    default:
      return false;
  }
}

export default router;
