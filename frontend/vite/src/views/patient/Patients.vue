<script setup lang="ts">
  import LoadingMessage from "../../components/Spinners/LoadingMessage.vue"
  import { ref, reactive, computed } from 'vue';
  import { storeToRefs } from 'pinia'
  import { useRouter  } from 'vue-router';
  import { ADD_PATIENT } from '../../graphql/patient.mutations';
  import { usePatientStore, useLocationStore, useClientStore} from '../../stores';
  import { useApiUtil } from '../../composables';
  import { IPatient } from '../../models/patient';
  import { IDistrict, IProvince } from '../../models/location';

  import * as shield from '../../guards'

  let patientStore = usePatientStore();
  let locationsStore = useLocationStore();
  let clientStore = useClientStore()
  let router = useRouter();

  const { withClientMutation } = useApiUtil()
  const { patients, fetchingPatients } = storeToRefs(patientStore)

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

  locationsStore.fetchCountries()  
  let patientParams = reactive({ 
    first: patientBatch.value, 
    before: "",
    text: "", 
    sortBy: ["-uid"],
    filterAction: false
  }); 
  patientStore.fetchPatients(patientParams);
  const patientCount = computed(() => patientStore.getPatients?.length + " of " + patientStore.getPatientCount + " patients")
  
  clientStore.fetchClients({})
  const clients = computed(() => clientStore.getClients)

  function addPatient() {
    withClientMutation(ADD_PATIENT, { clientPatientId: patientForm.clientPatientId, firstName: patientForm.firstName,
      middleName: patientForm.middleName, lastName: patientForm.lastName, age: patientForm.age,
      gender: patientForm.gender, dateOfBirth: patientForm.dateOfBirth, ageDobEstimated: patientForm.ageDobEstimated,
      clientUid: patientForm.clientUid, phoneMobile: patientForm.phoneMobile, consentSms: patientForm.consentSms, 
    },"createPatient")
    .then(result => patientStore.addPatient(result));
  }

  function getProvinces(event: any) {
    locationsStore.filterProvincesByCountry(countryUid.value!)
  }

  function getDistricts(event: any) {
    locationsStore.filterDistrictsByProvince(provinceUid.value!)
  }

  let filterText = ref<string>('')
  function searchPatients(event: any): void {
    filterText.value = event.target.value;
    patientParams.first = 100;
    patientParams.before = "";
    patientParams.text = event.target.value;
    patientParams.filterAction = true;
    patientStore.fetchPatients(patientParams);
  }

  const pageInfo = computed(() => patientStore.getPatientPageInfo)

  function showMorePatients(): void {
    patientParams.first = +patientBatch.value;
    patientParams.before = pageInfo?.value?.endCursor;
    patientParams.text = filterText.value;
    patientParams.filterAction = false;
    patientStore.fetchPatients(patientParams);
  }

  function isPatientSelected() {
    return patientForm.patientId !== undefined;
  }

  let getPatientFullName = (pt: IPatient) => {
    return pt.firstName + ' ' + pt.lastName;
  };

  let getGender = (pos: any) => genders[pos];

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

<template>

    <div>
      <input
        class="w-1/4 px-4 h-10  py-1 my-4 text-sm text-gray-800 placeholder-gray-400 border-1 border-gray-400 rounded-sm focus:placeholder-gray-500 focus:border-sky-800 focus:outline-none focus:shadow-outline-purple form-input"
        type="text" placeholder="Patient Search ..." aria-label="Search"
        v-model="patientSearch"
        @keyup="searchPatients($event)"
        @focus="setPatientToNull()"
      />
    </div>
    <hr />

    <!-- Patients Table View -->
    <div class="overflow-x-auto my-4">
        <div class="align-middle inline-block min-w-full shadow overflow-hidden bg-white shadow-dashboard px-2 pt-1 rounded-bl-sm rounded-br-sm">
        <table class="min-w-full">
            <thead>
            <tr>
                <th class="px-1 py-1 border-b-2 border-gray-300 text-left leading-4 text-gray-800 tracking-wider">PatientID</th>
                <th class="px-1 py-1 border-b-2 border-gray-300 text-left text-sm leading-4 text-gray-800 tracking-wider">Full Name</th>
                <th class="px-1 py-1 border-b-2 border-gray-300 text-left text-sm leading-4 text-gray-800 tracking-wider">Age</th>
                <th class="px-1 py-1 border-b-2 border-gray-300 text-left text-sm leading-4 text-gray-800 tracking-wider">Gender</th>
                <th class="px-1 py-1 border-b-2 border-gray-300 text-left text-sm leading-4 text-gray-800 tracking-wider">Client Patient Id</th>
                <th class="px-1 py-1 border-b-2 border-gray-300 text-left text-sm leading-4 text-gray-800 tracking-wider">Province</th>
                <th class="px-1 py-1 border-b-2 border-gray-300 text-left text-sm leading-4 text-gray-800 tracking-wider">District</th>
                <th class="px-1 py-1 border-b-2 border-gray-300 text-left text-sm leading-4 text-gray-800 tracking-wider">Client</th>
                <th class="px-1 py-1 border-b-2 border-gray-300"></th>
            </tr>
            </thead>
            <tbody class="bg-white">
              <tr 
              v-for="pt in patients"
              :key="pt.patientId">
                  <td class="px-1 py-1 whitespace-no-wrap border-b border-gray-500">
                    <router-link :to="{ name: 'patient-detail', params: { patientUid: pt?.uid } }" 
                      class="p-1 ml-2 border-white border text-gray-500rounded-smtransition duration-300 hover:border-sky-800 hover:text-sky-800 focus:outline-none">{{ pt.patientId }}</router-link>
                  </td>
                  <td class="px-1 py-1 whitespace-no-wrap border-b border-gray-500">
                    <router-link :to="{ name: 'patient-detail', params: { patientUid: pt?.uid } }" 
                      class="p-1 ml-2 border-white border text-gray-500rounded-smtransition duration-300 hover:border-sky-800 hover:text-sky-800 focus:outline-none">{{ getPatientFullName(pt) }}</router-link>
                  </td>
                  <td class="px-1 py-1 whitespace-no-wrap border-b border-gray-500">
                  <div class="text-sm leading-5 text-sky-800">{{ pt.age }} yrs</div>
                  </td>
                  <td class="px-1 py-1 whitespace-no-wrap border-b border-gray-500">
                  <div class="text-sm leading-5 text-sky-800">{{ getGender(pt.gender) }}</div>
                  </td>
                  <td class="px-1 py-1 whitespace-no-wrap border-b border-gray-500">
                  <div class="text-sm leading-5 text-sky-800">{{ pt.clientPatientId }}</div>
                  </td>
                  <td class="px-1 py-1 whitespace-no-wrap border-b border-gray-500">
                  <div class="text-sm leading-5 text-sky-800">{{ pt?.client?.district?.province?.name }}</div>
                  </td>
                  <td class="px-1 py-1 whitespace-no-wrap border-b border-gray-500">
                  <div class="text-sm leading-5 text-sky-800">{{ pt?.client?.district?.name }}</div>
                  </td>
                  <td class="px-1 py-1 whitespace-no-wrap border-b border-gray-500">
                  <div class="text-sm leading-5 text-sky-800">{{ pt?.client?.name }}</div>
                  </td>
    
                  <td class="px-1 py-1 whitespace-no-wrap text-right border-b border-gray-500 text-sm leading-5">
                    <a 
                      v-show="shield.hasRights(shield.actions.CREATE, shield.objects.SAMPLE)"
                      @click.prevent="addSample(pt)"
                      class="px-2 py-1 mr-2 border-sky-800 border text-sky-800 rounded-sm transition duration-300 hover:bg-sky-800 hover:text-white focus:outline-none">Add Analysis Request</a >
                  </td>
              </tr>
            </tbody>
        </table>
        <div v-if="fetchingPatients" class="py-4 text-center">
            <LoadingMessage message="Fetching patients ..."/>
        </div>
        </div>
    </div>

    <hr class="my-2">
    <section class="flex justify-between">
      <div>
        <div class="flex content-start items-center">
          <span class="text-sky-800"><i class="fas fa-info-circle"></i></span>
          <p class="ml-2 italic text-orange-600">Click register when you dont find your patient during search*</p>
        </div>
        <hr class="my-2">

        <router-link
          v-show="shield.hasRights(shield.actions.CREATE, shield.objects.PATIENT)"
          :to="{ name: 'patients-register', query: { cpid: patientSearch } }"
          class="px-4 p-1 text-sm border-sky-800 border text-dark-700 transition-colors duration-150 rounded-sm focus:outline-none hover:bg-sky-800 hover:text-gray-100">
          Register New Patiet
        </router-link>
      </div>
      <section class="flex justify-between">
        <div></div>
        <div class="my-4 flex sm:flex-row flex-col">
          <button 
          @click.prevent="showMorePatients()"
          v-show="pageInfo?.hasNextPage"
          class="px-2 py-1 mr-2 border-sky-800 border text-sky-800 rounded-sm transition duration-300 hover:bg-sky-800 hover:text-white focus:outline-none"
          >Show More</button>
          <div class="flex flex-row mb-1 sm:mb-0">
              <div class="relative">
                  <select class="appearance-none h-full rounded-sm border block  w-full bg-white border-gray-400 text-gray-700 py-2 px-4 pr-8 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
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
                  class="appearance-none rounded-r-sm rounded-l-sm sm:rounded-l-none border border-gray-400 border-b block pl-8 pr-6 py-2 w-full bg-white text-sm placeholder-gray-400 text-gray-700 focus:bg-white focus:placeholder-gray-600 focus:text-gray-700 focus:outline-none" disabled/>
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
