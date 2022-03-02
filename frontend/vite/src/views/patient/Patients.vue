<template>

    <div>
      <input
        class="w-1/4 pl-4 h-10 pr-2 py-1 my-4 text-sm text-gray-700 placeholder-gray-600 border-1 border-gray-400 rounded-md  focus:placeholder-gray-500 focus:border-green-100 focus:outline-none focus:shadow-outline-purple form-input"
        type="text" placeholder="Patient Search ..." aria-label="Search"
        v-model="patientSearch"
        @keyup="searchPatients($event)"
        @focus="setPatientToNull()"
      />
    </div>
    <hr />

    <!-- Patients Table View -->
    <div class="overflow-x-auto my-4">
        <div class="align-middle inline-block min-w-full shadow overflow-hidden bg-white shadow-dashboard px-2 pt-1 rounded-bl-lg rounded-br-lg">
        <table class="min-w-full">
            <thead>
            <tr>
                <th class="px-1 py-1 border-b-2 border-gray-300 text-left leading-4 text-black-500 tracking-wider">PatientID</th>
                <th class="px-1 py-1 border-b-2 border-gray-300 text-left text-sm leading-4 text-black-500 tracking-wider">Full Name</th>
                <th class="px-1 py-1 border-b-2 border-gray-300 text-left text-sm leading-4 text-black-500 tracking-wider">Age</th>
                <th class="px-1 py-1 border-b-2 border-gray-300 text-left text-sm leading-4 text-black-500 tracking-wider">Gender</th>
                <th class="px-1 py-1 border-b-2 border-gray-300 text-left text-sm leading-4 text-black-500 tracking-wider">Client Patient Id</th>
                <th class="px-1 py-1 border-b-2 border-gray-300 text-left text-sm leading-4 text-black-500 tracking-wider">Province</th>
                <th class="px-1 py-1 border-b-2 border-gray-300 text-left text-sm leading-4 text-black-500 tracking-wider">District</th>
                <th class="px-1 py-1 border-b-2 border-gray-300 text-left text-sm leading-4 text-black-500 tracking-wider">Client</th>
                <th class="px-1 py-1 border-b-2 border-gray-300"></th>
            </tr>
            </thead>
            <tbody class="bg-white">
              <tr 
              v-for="pt in patients"
              :key="pt.patientId">
                  <td class="px-1 py-1 whitespace-no-wrap border-b border-gray-500">
                    <router-link :to="{ name: 'patient-detail', params: { patientUid: pt?.uid } }" 
                      class="p-1 ml-2 border-white border text-gray-500 rounded transition duration-300 hover:border-blue-500 hover:text-blue-500 focus:outline-none">{{ pt.patientId }}</router-link>
                  </td>
                  <td class="px-1 py-1 whitespace-no-wrap border-b border-gray-500">
                    <router-link :to="{ name: 'patient-detail', params: { patientUid: pt?.uid } }" 
                      class="p-1 ml-2 border-white border text-gray-500 rounded transition duration-300 hover:border-blue-500 hover:text-blue-500 focus:outline-none">{{ getPatientFullName(pt) }}</router-link>
                  </td>
                  <td class="px-1 py-1 whitespace-no-wrap border-b border-gray-500">
                  <div class="text-sm leading-5 text-blue-900">{{ pt.age }} yrs</div>
                  </td>
                  <td class="px-1 py-1 whitespace-no-wrap border-b border-gray-500">
                  <div class="text-sm leading-5 text-blue-900">{{ getGender(pt.gender) }}</div>
                  </td>
                  <td class="px-1 py-1 whitespace-no-wrap border-b border-gray-500">
                  <div class="text-sm leading-5 text-blue-900">{{ pt.clientPatientId }}</div>
                  </td>
                  <td class="px-1 py-1 whitespace-no-wrap border-b border-gray-500">
                  <div class="text-sm leading-5 text-blue-900">{{ pt?.client?.district?.province?.name }}</div>
                  </td>
                  <td class="px-1 py-1 whitespace-no-wrap border-b border-gray-500">
                  <div class="text-sm leading-5 text-blue-900">{{ pt?.client?.district?.name }}</div>
                  </td>
                  <td class="px-1 py-1 whitespace-no-wrap border-b border-gray-500">
                  <div class="text-sm leading-5 text-blue-900">{{ pt?.client?.name }}</div>
                  </td>
    
                  <td class="px-1 py-1 whitespace-no-wrap text-right border-b border-gray-500 text-sm leading-5">
                    <a 
                      v-show="shield.hasRights(shield.actions.CREATE, shield.objects.SAMPLE)"
                      @click.prevent="addSample(pt)"
                      class="px-2 py-1 mr-2 border-blue-500 border text-blue-500 rounded transition duration-300 hover:bg-blue-700 hover:text-white focus:outline-none">Add Analysis Request</a >
                  </td>
              </tr>
            </tbody>
        </table>
        </div>
    </div>

    <hr class="my-2">
    <section class="flex justify-between">
      <div>
        <div class="flex content-start items-center">
          <span class="text-blue-500"><i class="fas fa-info-circle"></i></span>
          <p class="ml-2 italic text-red-500">Click register when you dont find your patient during search*</p>
        </div>
        <hr class="my-2">

        <router-link
          v-show="shield.hasRights(shield.actions.CREATE, shield.objects.PATIENT)"
          :to="{ name: 'patients-register', query: { cpid: patientSearch } }"
          class="px-4 p-1 text-sm border-blue-500 border text-dark-700 transition-colors duration-150 rounded focus:outline-none hover:bg-blue-500 hover:text-gray-100">
          Register New Patiet
        </router-link>
      </div>
      <section class="flex justify-between">
        <div></div>
        <div class="my-4 flex sm:flex-row flex-col">
          <button 
          @click.prevent="showMorePatients()"
          v-show="pageInfo?.hasNextPage"
          class="px-2 py-1 mr-2 border-blue-500 border text-blue-500 rounded transition duration-300 hover:bg-blue-700 hover:text-white focus:outline-none"
          >Show More</button>
          <div class="flex flex-row mb-1 sm:mb-0">
              <div class="relative">
                  <select class="appearance-none h-full rounded-l border block  w-full bg-white border-gray-400 text-gray-700 py-2 px-4 pr-8 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                  v-model="patientBatch" :disabled="!pageInfo?.hasNextPage">
                      <option value="25">25</option>
                      <option value="50">50</option>
                      <option value="100">100</option>
                      <option value="250">250</option>
                      <option value="500">500</option>
                      <option value="1000">1000</option>
                      <option value="5000">5000</option>
                      <option value="10000">10000</option>
                  </select>
                  <div
                      class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                      <svg class="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                          <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                      </svg>
                  </div>
              </div>
          </div>
          <div class="block relative">
              <input :placeholder="patientCount"
                  class="appearance-none rounded-r rounded-l sm:rounded-l-none border border-gray-400 border-b block pl-8 pr-6 py-2 w-full bg-white text-sm placeholder-gray-400 text-gray-700 focus:bg-white focus:placeholder-gray-600 focus:text-gray-700 focus:outline-none" disabled/>
          </div>
        </div>
      </section>
    </section>


</template>

<style lang="postcss" scoped>
  .patient-scroll {
    /* min-height: calc(100vh - 250px); */
    min-height: 100%;
  }

  .tab-active {
    border-bottom: 2px solid rgb(194, 193, 193);
    color: rgb(37, 37, 37) !important;
  }
</style>

<script setup lang="ts">
  import { useMutation } from '@urql/vue';
  import { ref, reactive, computed, inject } from 'vue';
  import { useStore } from 'vuex';
  import { useRouter  } from 'vue-router';
  import { useQuery } from '@urql/vue';
  import {  GET_ALL_CLIENTS } from '../../graphql/clients.queries';
  import {
    FILTER_PROVINCES_BY_COUNTRY,
    FILTER_DISTRICTS_BY_PROVINCE,
  } from '../../graphql/admin.queries';
  import { ADD_PATIENT } from '../../graphql/patient.mutations';
  import { ActionTypes } from '../../store/modules/patient';
  import { ActionTypes as AdminActionTypes } from '../../store/modules/admin';
  import { IPatient } from '../../models/patient';
  import { IDistrict, IProvince } from '../../models/location';

  import * as shield from '../../guards'

  let store = useStore();
  let router = useRouter();

  let createAction = ref<boolean>(true);
  let showModal = ref<boolean>(false);

  let currentTab = ref<string>('samples');
  const tabs: string[] = ['samples', 'cases', 'logs'];
  // let currentTabComponent: string = computed(() => 'tab-' + currentTab.value);

  let patientForm = reactive({} as IPatient);
  let patientSearch = ref<string>('');
  let patientBatch = ref<number>(25);

  let provinces = ref<IProvince[]>([]);
  let districts = ref<IDistrict[]>([]);

  let countryUid = ref<number>();
  let provinceUid = ref<number>();



  const genders: string[] = ["Male", "Female", "Missing", "Trans Gender"]

  store.dispatch(AdminActionTypes.FETCH_COUNTRIES);   
  let patientParams = reactive({ 
    first: patientBatch.value, 
    after: "",
    text: "", 
    sortBy: ["uid"],
    filterAction: false
  }); 
  store.dispatch(ActionTypes.FETCH_PATIENTS, patientParams);
  const patients = computed(() => store.getters.getPatients)
  const patientCount = computed(() => store.getters.getPatients?.length + " of " + store.getters.getPatientCount + " patients")
  
  const { data: clients, fetching: CFetching, error: CError } = useQuery({
    query: GET_ALL_CLIENTS,
  });

  const { executeMutation: createPatient } = useMutation(ADD_PATIENT);

  const provincesfilter = useQuery({
    query: FILTER_PROVINCES_BY_COUNTRY,
    variables: { uid: countryUid },
    pause: computed(() => countryUid !== null), // not working
    requestPolicy: 'network-only',
  });

  const districtsfilter = useQuery({
    query: FILTER_DISTRICTS_BY_PROVINCE,
    variables: { uid: provinceUid },
    pause: computed(() => provinceUid !== null), // not working
    requestPolicy: 'network-only',
  });

  function addPatient() {
    createPatient({ clientPatientId: patientForm.clientPatientId, firstName: patientForm.firstName,
      middleName: patientForm.middleName, lastName: patientForm.lastName, age: patientForm.age,
      gender: patientForm.gender, dateOfBirth: patientForm.dateOfBirth, ageDobEstimated: patientForm.ageDobEstimated,
      clientUid: patientForm.clientUid, phoneMobile: patientForm.phoneMobile, consentSms: patientForm.consentSms, 
    }).then(result => store.dispatch(ActionTypes.ADD_PATIENT, result));
  }

  function getProvinces(event: any) {
    provincesfilter.executeQuery({requestPolicy: 'network-only'}).then(result => {
      provinces.value = result.data.value?.provincesByCountryUid;
    });
  }

  function getDistricts(event: any) {
    districtsfilter.executeQuery({requestPolicy: 'network-only'}).then(result => {
      districts.value = result.data.value?.districtsByProvinceUid;
    });
  }

  let filterText = ref<string>('')
  function searchPatients(event: any): void {
    filterText.value = event.target.value;
    patientParams.first = 100;
    patientParams.after = "";
    patientParams.text = event.target.value;
    patientParams.filterAction = true;
    store.dispatch(ActionTypes.FETCH_PATIENTS, patientParams);
  }

  const pageInfo = computed(() => store.getters.getPatientPageInfo)

  function showMorePatients(): void {
    patientParams.first = +patientBatch.value;
    patientParams.after = pageInfo?.value?.endCursor;
    patientParams.text = filterText.value;
    patientParams.filterAction = false;
    store.dispatch(ActionTypes.FETCH_PATIENTS, patientParams);
  }

  function isPatientSelected() {
    return patientForm.patientId !== undefined;
  }

  let getPatientFullName = (pt: IPatient) => {
    return pt.firstName + ' ' + pt.lastName;
  };

  let getGender = (pos: number) => genders[pos];

  let selectPatient = (pt: IPatient) => {
    Object.assign(patientForm, { ...pt });
  };

  let setPatientToNull = () => {
    Object.assign(patientForm, {} as IPatient);
  };

  function patientFormManager(create: boolean) {
    showModal.value = true;
    createAction.value = create;
    if (create) setPatientToNull();
  }

  function savePatientForm() {
      if (createAction.value) addPatient();
      showModal.value = false;
  }

  function addSample(patient: IPatient): void {
    router?.push({
        name: 'samples-add',
        params: {
            patientUid: patient.uid
        }
    })
  }

</script>
