import { RouteRecordRaw, createRouter, createWebHistory } from 'vue-router';
import { PropType } from 'vue';
import { canAccessPage, roles } from './../guards';
import { pages } from './constants';
import adminRoutes from './admin';
import patientRoutes from './patient';
import clientRoutes from './client';

import LoginView from '../views/auth/Login.vue';
import DashBoardView from '../views/dashboard/index.vue';
import PatientsView from '../views/patient/index.vue';
import PatientsCompact from '../views/patient/PatientsCompact.vue';
import ClientsView from '../views/client/index.vue';
import SamplesView from '../views/sample/index.vue';
import RejectSamples from '../views/sample/RejectSamples.vue';
import SamplesListing from '../views/components/SampleListing.vue';
import QualityControlView from '../views/qcontrol/index.vue';
import QualityControlListing from '../views/qcontrol/Listing.vue';
import QCSetView from '../views/qcontrol/_id/index.vue';
import QCSetDetail from '../views/qcontrol/_id/QCSet.vue';
import WorkSheetsView from '../views/worksheet/index.vue';
import WorkSheetListing from '../views/worksheet/WorkSheetListing.vue';
import WorkSheetSingleView from '../views/worksheet/_id/index.vue';
import WorkSheetDetail from '../views/worksheet/_id/WorkSheetDetail.vue';
import KanBanView from '../views/kanban/index.vue';
import KanBanBoards from '../views/kanban/Boards.vue'
import KanBanBoardSingle from '../views/kanban/_id/index.vue'
import KanBanBoardDetail from '../views/kanban/_id/Listings.vue'
import KanBanTaskView from '../views/kanban/_id/task/index.vue'
import KanBanTaskDetail from '../views/kanban/_id/task/Task.vue'
import MarkDownView from '../views/markdown/index.vue';
import MarkDownListing from '../views/markdown/DocumentListing.vue';
import MarkDownDocumentSingle from '../views/markdown/_id/index.vue';
import MarkDownDocumentView from '../views/markdown/_id/Document.vue';
import NoticeAdminView  from '../views/notice/index.vue';
import AboutView from '../views/About.vue';
import AdminView from '../views/admin/index.vue';
import PageNotFound from '../views/404.vue';
import NotAuthorised from '../views/Restricted.vue';
import { isTokenValid } from './checks';


const routes: RouteRecordRaw[] = [
  // { path: '/', redirect: '/dashboard' },
  {
    path: '/dashboard',
    name: pages.DASHBOARD,
    component: DashBoardView,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: '/auth',
    name: pages.LOGIN,
    component: LoginView,
    meta: { layout: 'empty' },
  },
  {
    path: '/patients',
    name: pages.PATIENTS,
    component: PatientsView,
    children: patientRoutes,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: '/patients-compact',
    name: pages.PATIENTS_COMPACT,
    component: PatientsCompact,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: '/clients',
    name: pages.CLIENTS,
    component: ClientsView,
    children: clientRoutes,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: '/samples',
    name: pages.SAMPLES,
    component: SamplesView,
    children: [
      {
        path: '',
        name: 'samples-listing',
        component: SamplesListing,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: 'rejections',
        name: 'reject-samples',
        component: RejectSamples,
        props: true,
        // props: (route) => ({
        //   samples: Array as PropType<ISample[]>,
        //   ...route.params
        // }),
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
    name: pages.QC_SAMPLES,
    component: QualityControlView,
    children: [
      {
        path: '',
        name: 'quality-control-listing',
        component: QualityControlListing,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: '/qc-set/:qcSetUid',
        name: 'qc-set-view',
        component: QCSetView,
        children: [
          {
            path: '',
            name: 'qc-set-detail',
            component: QCSetDetail,
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
    name: pages.WORKSHEETS,
    component: WorkSheetsView,
    children: [
      {
        path: '',
        name: 'worksheet-listing',
        component: WorkSheetListing,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: ':workSheetUid',
        name: 'worksheet-single',
        component: WorkSheetSingleView,
        children: [
          {
            path: '',
            name: 'worksheet-detail',
            component: WorkSheetDetail,
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
    path: '/kanban-boards',
    name: pages.KANBAN_BOARD,
    component: KanBanView,
    children: [
      {
        path: '',
        name: 'kanban-boards',
        component: KanBanBoards,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: ':boardUid',
        name: 'board-single',
        component: KanBanBoardSingle,
        children: [
          {
            path: '',
            name: 'board-detail',
            component: KanBanBoardDetail,
            meta: {
              requiresAuth: true,
            },
          },
          {
            path: 'task',
            name: 'board-task',
            component: KanBanTaskView,
            meta: {
              requiresAuth: true,
            },
            children: [
              {
                path: ':taskUid',
                name: 'task-detail',
                component: KanBanTaskDetail,
                meta: {
                  requiresAuth: true,
                },
              },
            ],
          },
        ],
        meta: {
          requiresAuth: true,
        },
      }
    ],
    meta: {
      requiresAuth: true,
    },
  },
  {
    name: pages.NOTICE_MANAGER,
    path: '/notice-manager',
    component: NoticeAdminView,
    // children: [
    //   {
    //     path: '',
    //     name: 'notice-home',
    //     component: NoticeAdminView,
    //     meta: {
    //       requiresAuth: true,
    //     },
    //   },
    // ],
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: '/documents',
    name: pages.MARKDOWN_DOCUMENTS,
    component: MarkDownView,
    children: [
      {
        path: '',
        name: 'document-listing',
        component: MarkDownListing,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: ':documentUid',
        name: 'document-single-view',
        component: MarkDownDocumentSingle,
        children: [
          {
            path: '',
            name: 'document-detail',
            component: MarkDownListing,
            meta: {
              requiresAuth: true,
            },
          },
          {
            path: 'view',
            name: 'document-viewer',
            component: MarkDownDocumentView,
            meta: {
              requiresAuth: true,
            },
          }
        ],
        meta: {
          requiresAuth: true,
        },
      }
    ],
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: '/about',
    name: 'About',
    component: AboutView,
    meta: {
      requiresAuth: true,
    },
  },
  {
    name: pages.ADMINISTRATION,
    path: '/admin',
    component: AdminView,
    children: adminRoutes,
    meta: {
      requiresAuth: true,
      requiresAdmin: true,
    },
  },
  {
    name: pages.FOUR_OR_FOUR,
    path: '/:pathMatch(.*)',
    component: PageNotFound,
    meta: {
      layout: 'empty',
    },
  },
  {
    name: pages.NOT_AUTHORISED,
    path: '/acced-denied',
    component: NotAuthorised,
    meta: {
      layout: 'empty',
    },
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL), // process.env.BASE_URL
  routes,
});

router.beforeEach((to, from, next) => {

  if(to.path === '/') {
    next({ name: pages.DASHBOARD });
    return;
  }

  if (to.matched.some((record) => record.meta.requiresAuth)) {

    let token = localStorage.getItem('fwt');

    if (!isTokenValid(token)) {
      next({ name: pages.LOGIN });
    } else {
      if(!hasAccess(to.matched[0].name)){  // to.matched[0] get outer page
       next({ name: pages.NOT_AUTHORISED });
      } else {
        next();
      }

    }

  } else {
    next();
  }

});


function hasAccess(page: any) {
  const userRole = localStorage.getItem('fRole') || "";

  switch (page) {
    case pages.DASHBOARD:
      return canAccessPage(userRole, pages.DASHBOARD)

    case pages.PATIENTS:
      return canAccessPage(userRole, pages.PATIENTS)
      
    case pages.PATIENTS_COMPACT:
      return canAccessPage(userRole, pages.PATIENTS_COMPACT)
    
    case pages.CLIENTS:
      return canAccessPage(userRole, pages.CLIENTS)
    
    case pages.SAMPLES:
      return canAccessPage(userRole, pages.SAMPLES)

    case pages.QC_SAMPLES:
      return canAccessPage(userRole, pages.QC_SAMPLES)
      
    case pages.WORKSHEETS:
      return canAccessPage(userRole, pages.WORKSHEETS)
    
    case pages.MARKDOWN_DOCUMENTS:
      return canAccessPage(userRole, pages.MARKDOWN_DOCUMENTS)
    
    case pages.KANBAN_BOARD:
      return canAccessPage(userRole, pages.KANBAN_BOARD)
    
    case pages.ADMINISTRATION:
      return canAccessPage(userRole, pages.ADMINISTRATION)
  
    case pages.NOTICE_MANAGER:
      return canAccessPage(userRole, pages.NOTICE_MANAGER)

    default:
      return false;
  }
}

export default router;
