import PatientsListing from '../views/patient/Patients.vue';
import PatientsRegistration from '../views/patient/AddPatient.vue';
import PatientSingleView from '../views/patient/_id/index.vue';
import PatientDetail from '../views/patient/_id/PatientDetail.vue';
import SamplesAdd from '../views/sample/SamplesAdd.vue';
import SampleSingleView from '../views/sample/_id/index.vue';
import SampleDetail from '../views/sample/_id/SampleDetail.vue';


const patientRoutes = [
  {
    path: '',
    name: 'patients-listing',
    component: PatientsListing,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: 'register',
    name: 'patients-register',
    component: PatientsRegistration,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: 'search',
    name: 'patients-search',
    component: PatientsListing,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: ':patientUid',
    name: 'patient',
    component: PatientSingleView,
    children: [
      {
        path: '',
        name: 'patient-detail',
        component: PatientDetail,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: 'add-sample',
        name: 'samples-add',
        component: SamplesAdd,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: 'samples',
        name: 'patient-samples',
        component: SampleSingleView,
        children: [
          // {
          //   path: '',
          //   name: 'patient-samples',
          //   component: SampleSingleView,
          //   meta: {
          //     requiresAuth: true,
          //   },
          // },
          {
            path: ':sampleUid',
            name: 'sample-detail',
            component: SampleDetail,
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
