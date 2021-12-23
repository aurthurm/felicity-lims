<template>
  <div class="">
    <div class="flex justify-between">
      <div class="flex items-center content-between">
        <!-- <h1 class="h1 my-4 font-bold text-dark-700">Listing</h1> -->
        <router-link  to="/patients/search"
          class="px-4 my-2 p-1 text-sm border-blue-500 border text-dark-700 transition-colors duration-150 rounded-lg focus:outline-none hover:bg-blue-500 hover:text-gray-100">
          Add Patient</router-link>
        <input
          class="w-64 ml-6 pl-4 pr-2 py-1 text-sm text-gray-700 placeholder-gray-600 border-1 border-gray-400 rounded-md  focus:placeholder-gray-500 focus:border-green-100 focus:outline-none focus:shadow-outline-purple form-input"
          type="text" placeholder="Search ..." aria-label="Search"
          @keyup="searchPatients($event)"
          @focus="setPatientToNull()"
        />
      </div>
      <button
        @click.prevent="showModal = true"
          class="px-4 my-2 p-1 text-sm border-blue-500 border text-dark-700 transition-colors duration-150 rounded-lg focus:outline-none hover:bg-blue-500 hover:text-gray-100">
          Quick Registration</button>
    </div>

    <hr />

    <div class="grid grid-cols-12 gap-4 mt-2">
      <section class="col-span-4 h-screen overflow-y-scroll overscroll-contain patient-scroll">
        <a
          v-for="pt in patients"
          :key="pt.patientId"
          href="#"
          @click.prevent.stop="selectPatient(pt)"
          :class="[
            'bg-white w-full flex items-center p-1 mb-1 rounded-xl shadow border',
            { 'border-green-500 bg-green-100': pt.uid === patientForm.uid },
          ]"
        >
          <div class="flex-grow p-1">
            <div class="font-semibold text-gray-700 flex justify-between">
              <span>{{ getPatientFullName(pt) }}</span>
              <span class="text-sm text-gray-500">{{ pt.age }} yrs, {{ getGender(pt.gender) }}</span>
            </div>
            <div class="text-sm text-gray-500 flex justify-between">
              <span>{{ pt.patientId }}</span>
              <span>{{ pt.clientPatientId }}</span>
            </div>
            <div class="text-sm text-gray-500 flex justify-between">
              <span>{{ pt?.client?.district?.province?.name }}</span>
              <span>{{ pt?.client?.name }}</span>
            </div>
          </div>
          <div class="p-2">
            <span class="block h-4 w-4 bg-green-400 rounded-full bottom-0 right-0"></span>
          </div>
        </a>
      </section>

      <section class="col-span-8" v-if="isPatientSelected()">
        <!-- Question Listing Item Card -->
        <div
          class="bg-white rounded-lg shadow-sm hover:shadow-lg duration-500 px-4 sm:px-6 md:px-2 py-4"
        >
          <div class="grid grid-cols-12 gap-3">
            <!-- Meta Column -->
            <div class="sm:col-span-2 text-center hidden sm:block">
              <div class="inline-block font-md text-medium mb-2">{{ patientForm.patientId }}</div>
              <!-- Age -->
              <div
                class="grid grid-rows-2 mx-auto mb-1 py-1 w-4/5 2lg:w-3/5 rounded-md bg-green-400"
              >
                <div class="inline-block font-medium text-2xl text-white">{{ patientForm.age }}</div>
                <div class="inline-block font-medium text-white text-sm lg:text-md">Yrs Old</div>
              </div>
            </div>
            <!-- Summary Column -->
            <div class="col-span-12 sm:col-start-3 sm:col-end-13 px-3 sm:px-0">
              <div
                class="flex justify-between sm:text-sm md:text-md lg:text-lg text-gray-700 font-bold"
              >
                <span>{{ getPatientFullName(patientForm) }}</span>
                <div>
                  <span class="font-medium text-md">{{ patientForm.dateOfBirth }}</span>
                  <button
                    @click="showModal = true"
                    class="ml-4 inline-flex items-center justify-center w-8 h-8 mr-2 border-blue-500 border text-gray-900 transition-colors duration-150 bg-white rounded-full focus:outline-none hover:bg-gray-200"
                  >
                    <svg class="w-4 h-4 fill-current" viewBox="0 0 20 20">
                      <path
                        d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"
                      ></path>
                    </svg>
                  </button>
                  <router-link :to="{ name: 'patient-detail', params: { patientUid: patientForm.uid } }" 
                  class="p-1 ml-2 border-white border text-gray-500 rounded transition duration-300 hover:border-blue-500 hover:text-blue-500 focus:outline-none">... more</router-link>
                  </div>
              </div>
              <hr />
              <div class="grid grid-cols-2 mt-2">
                <div class="col-span-1">
                  <!-- Client Details -->
                  <div class="flex">
                    <span class="text-gray-800 text-sm font-medium w-16">Client</span>
                    <span class="text-gray-600 text-sm md:text-md">{{
                      patientForm?.client?.name
                    }}</span>
                  </div>
                  <div class="flex">
                    <span class="text-gray-800 text-sm font-medium w-16">District:</span>
                    <span class="text-gray-600 text-sm md:text-md">{{
                      patientForm?.client?.district?.name
                    }}</span>
                  </div>
                  <div class="flex">
                    <span class="text-gray-800 text-sm font-medium w-16">Province:</span>
                    <span class="text-gray-600 text-sm md:text-md">{{
                      patientForm?.client?.district?.province?.name
                    }}</span>
                  </div>
                </div>
                <div class="col-span-1">
                  <!-- Identifiers -->
                  <div class="col-span-2 flex mt-2">
                    <span class="text-gray-800 text-sm font-medium w-16">Client Patient ID</span>
                    <span class="text-gray-600 text-sm md:text-md">{{
                      patientForm.clientPatientId
                    }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Sample and Case Data -->
        <nav class="bg-white px-6 pt-2 shadow-md mt-2">
          <div class="-mb-px flex justify-start">
            <a
              v-for="tab in tabs"
              :key="tab"
              :class="[
                'no-underline text-gray-500 uppercase tracking-wide font-bold text-xs py-1 mr-8 tab',
                { 'tab-active': currentTab === tab },
              ]"
              @click="currentTab = tab"
              href="#"
            >
              {{ tab }}
            </a>
          </div>
        </nav>
   
        <tab-samples v-if="currentTab === 'samples'" target="patient-samples" :targetUid="patientForm.uid" />
        <tab-cases v-if="currentTab === 'cases'" />
         <tab-logs 
          v-if="currentTab === 'logs'" 
          targetType="patient"
          :targetId="patientForm?.uid" />

      </section>
    </div>
  </div>

  <!-- Patient Edit Form Modal -->
  <modal v-if="showModal" @close="showModal = false" :contentWidth="'w-3/6'">
    <template v-slot:header>
      <h3>Patient Form</h3>
    </template>

    <template v-slot:body>
      <PatientForm :patient="patientForm" @close="updatePatient" />
    </template>
  </modal>

</template>

<style lang="postcss" scoped>
.patient-scroll {
  /* min-height: calc(100vh - 250px); */
  min-height: 100%;
}
</style>


<script setup lang="ts">
  import { ref, reactive, computed } from 'vue';
  import { useStore } from 'vuex';
  import tabSamples from '../components/AnalyisRequestListing.vue';
  import tabCases from './comps/CaseTable.vue';
  import tabLogs from '../components/AuditLog.vue';
  import modal from '../../components/SimpleModal.vue';
  import PatientForm from './PatientForm.vue';

  import { ActionTypes } from '../../store/modules/patient';
  import { ActionTypes as AdminActionTypes } from '../../store/modules/admin';
  import { IPatient } from '../../models/patient';

  let store = useStore();
  let showModal = ref<boolean>(false);
  let currentTab = ref<string>('samples');
  const tabs: string[] = ['samples', 'cases', 'logs'];

  let patientForm = reactive({}) as IPatient;

  let patientParams = reactive({ 
    first: 25, 
    after: "",
    text: "", 
    sortBy: ["-uid"],
    filterAction: false
  });

  const genders: string[] = ["Male", "Female", "Missing", "Trans Gender"]

  store.dispatch(AdminActionTypes.FETCH_COUNTRIES);    
  store.dispatch(ActionTypes.FETCH_PATIENTS, patientParams);

  const patients = computed(() => store.getters.getPatients )

  function searchPatients(event: any) {
    patientParams.first = 100;
    patientParams.after = "";
    patientParams.text = event.target.value;
    patientParams.filterAction = true;
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

  const updatePatient = (patient: IPatient) => {
    Object.assign(patientForm, { ...patient });
    showModal.value = false;
  }
</script>