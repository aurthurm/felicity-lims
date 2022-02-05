import AdminDefault from '../views/admin/Admin.vue';
import UsersConf from '../views/admin/users/index.vue';
import LocationConf from '../views/admin/location/index.vue';
import LaboratoryConf from '../views/admin/laboratory/index.vue';
import InstrumentsConf from '../views/admin/instruments/index.vue';
import PublicationConf from '../views/admin/publication/index.vue';
import AnalysesConf from '../views/admin/analyses/index.vue';
import SuppliersConf from '../views/admin/suppliers/index.vue';
import SampleConf from '../views/admin/sample/index.vue';
import WSTemplatesConf from '../views/admin/worksheets/index.vue';
import ReflexRulesConf from '../views/admin/reflex/index.vue';


const adminRoutes = [
  {
    path: '',
    name: 'felicity-configs',
    component: AdminDefault,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: 'users-conf',
    name: 'users-conf',
    component: UsersConf,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: 'location-conf',
    name: 'location-conf',
    component: LocationConf,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: 'laboratory-conf',
    name: 'laboratory-conf',
    component: LaboratoryConf,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: 'instruments-conf',
    name: 'instruments-conf',
    component: InstrumentsConf,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: 'publication-conf',
    name: 'publication-conf',
    component: PublicationConf,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: 'analyses-conf',
    name: 'analyses-conf',
    component: AnalysesConf,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: 'sampletypes-conf',
    name: 'sampletypes-conf',
    component: SampleConf,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: 'worksheets-conf',
    name: 'worksheets-conf',
    component: WSTemplatesConf,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: 'suppliers-conf',
    name: 'suppliers-conf',
    component: SuppliersConf,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: 'reflex-rule-conf',
    name: 'reflex-rule-conf',
    component: ReflexRulesConf,
    meta: {
      requiresAuth: true,
    },
  },
];

export default adminRoutes;
