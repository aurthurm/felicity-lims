<script setup lang="ts">
import { ref, reactive, computed, defineAsyncComponent, onMounted } from "vue";
import { useLocationStore, usePatientStore } from "@/stores";
import { storeToRefs } from "pinia";
import { IPatient } from "@/models/patient";
import * as shield from "@/guards";

// Constants
const GENDERS = {
  MALE: 0,
  FEMALE: 1,
  MISSING: 2,
  TRANS: 3
} as const;

const GENDER_LABELS: Record<number, string> = {
  [GENDERS.MALE]: "Male",
  [GENDERS.FEMALE]: "Female",
  [GENDERS.MISSING]: "Missing",
  [GENDERS.TRANS]: "Trans Gender"
};

// Lazy-loaded components
const components = {
  LoadingMessage: defineAsyncComponent(() => 
    import("@/components/ui/spinners/FelLoadingMessage.vue")
  ),
  PageHeading: defineAsyncComponent(() => 
    import("@/components/common/FelPageHeading.vue")
  ),
  Modal: defineAsyncComponent(() => 
    import("@/components/ui/FelModal.vue")
  ),
  PatientForm: defineAsyncComponent(() => 
    import("@/components/person/PatientForm.vue")
  ),
  PatientInfo: defineAsyncComponent(() => 
    import("@/components/person/PatientInfo.vue")
  ),
  Tabs: defineAsyncComponent(() => 
    import("@/components/ui/tabs/FelTabs.vue")
  )
};

// Store setup
const patientStore = usePatientStore();
const locationStore = useLocationStore();
const { patients, fetchingPatients } = storeToRefs(patientStore);

// State
const showModal = ref(false);
const patientForm = ref({} as IPatient);
const searchParams = reactive({
  first: 25,
  before: "",
  text: "",
  sortBy: ["-uid"],
  filterAction: false,
});

// Computed
const isPatientSelected = computed(() => 
  Object.keys(patientForm.value).length > 0
);

const tabs = computed(() => [
  {
    id: "samples",
    label: "Samples",
    component: defineAsyncComponent(() => 
      import("@/components/sample/FelAnalyisRequestListing.vue")
    ),
    props: {
      target: "patient-samples",
      targetUid: patientForm.value.uid
    }
  },
  {
    id: "billing",
    label: "Billing",
    component: defineAsyncComponent(() => 
      import("./_id/PatientBill.vue")
    ),
    props: {
      patientUid: patientForm.value.uid
    }
  },
  {
    id: "logs",
    label: "Logs",
    component: defineAsyncComponent(() => 
      import("@/components/audit/FelAuditLog.vue")
    ),
    props: {
      targetType: "patient",
      targetUid: patientForm.value.uid
    }
  }
]);

// Methods
const getPatientFullName = (patient: IPatient): string => 
  `${patient.firstName} ${patient.lastName}`;

const getGender = (genderCode: number): string => 
  GENDER_LABELS[genderCode] || 'Unknown';

const selectPatient = (patient: IPatient): void => {
  patientForm.value = patient;
  patientStore.setPatient(patient);
};

const resetPatient = (): void => {
  patientForm.value = {} as IPatient;
  patientStore.resetPatient();
};

const handleSearch = (event: Event): void => {
  const target = event.target as HTMLInputElement;
  searchParams.first = 100;
  searchParams.before = "";
  searchParams.text = target.value;
  searchParams.filterAction = true;
  patientStore.fetchPatients(searchParams);
};

const handleQuickRegistration = async (): Promise<void> => {
  resetPatient();
  showModal.value = true;
};

const handlePatientUpdate = (patient: IPatient): void => {
  selectPatient(patient);
  showModal.value = false;
};

// Lifecycle
onMounted(() => {
  locationStore.fetchCountries();
  patientStore.fetchPatients(searchParams);
});
</script>

<template>
  <div class="p-4">
    <components.PageHeading title="Patients Quick View" />
    
    <!-- Header Actions -->
    <div class="flex justify-between mb-4">
      <div class="flex items-center gap-4">
        <router-link
          v-if="shield.hasRights(shield.actions.CREATE, shield.objects.PATIENT)"
          to="/patients/search"
          class="px-4 py-2 text-sm border border-sky-800 text-dark-800 rounded-sm hover:bg-sky-800 hover:text-gray-100 transition-colors duration-150"
        >
          Add Patient
        </router-link>
        
        <input
          type="text"
          placeholder="Search patients..."
          class="w-64 px-4 py-2 text-sm text-gray-800 placeholder-gray-400 border border-gray-400 rounded-sm focus:border-sky-800 focus:outline-none focus:ring-1 focus:ring-sky-800"
          @keyup="handleSearch"
          @focus="resetPatient"
        />
      </div>
      
      <button
        v-if="shield.hasRights(shield.actions.CREATE, shield.objects.PATIENT)"
        class="px-4 py-2 text-sm border border-sky-800 text-dark-700 rounded-sm hover:bg-sky-800 hover:text-gray-100 transition-colors duration-150"
        @click="handleQuickRegistration"
      >
        Quick Registration
      </button>
    </div>

    <hr class="my-4" />

    <!-- Main Content -->
    <div class="grid grid-cols-12 gap-4">
      <!-- Patient List -->
      <section 
        v-motion
        :initial="{ opacity: 0, y: 100 }"
        :enter="{ opacity: 1, y: 0 }"
        :delay="400"
        class="col-span-3 h-screen overflow-y-auto scrollbar scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100"
      >
        <components.LoadingMessage 
          v-if="fetchingPatients"
          message="Fetching patients..." 
        />
        
        <template v-else>
          <div
            v-for="patient in patients"
            :key="patient.patientId"
            @click="selectPatient(patient)"
            class="bg-white w-full flex items-center mb-1 rounded-sm shadow border cursor-pointer transition-colors duration-150 hover:border-sky-800 hover:bg-sky-50"
            :class="{ 'border-sky-800 bg-emerald-200': patient.uid === patientForm?.uid }"
          >
            <div class="flex-grow p-3">
              <div class="flex justify-between font-semibold">
                <span>{{ getPatientFullName(patient) }}</span>
                <span class="text-sm text-gray-500">
                  {{ patient.age }} yrs, {{ getGender(patient.gender) }}
                </span>
              </div>
              
              <div class="text-sm text-gray-500 flex justify-between mt-1">
                <span>{{ patient.patientId }}</span>
                <span>{{ patient.clientPatientId }}</span>
              </div>
              
              <div class="text-sm text-gray-500 flex justify-between mt-1">
                <span>{{ patient?.client?.district?.province?.name }}</span>
                <span>{{ patient?.client?.name }}</span>
              </div>
            </div>
          </div>
        </template>
      </section>

      <!-- Patient Details -->
      <section
        v-if="isPatientSelected"
        v-motion
        :initial="{ opacity: 0, y: -100 }"
        :enter="{ opacity: 1, y: 0 }"
        :delay="400"
        class="col-span-9"
      >
        <components.PatientInfo @editPatient="showModal = true" />
        <components.Tabs :tabs="tabs" initial-tab="samples" />
      </section>
    </div>

    <!-- Edit Modal -->
    <components.Modal
      v-if="showModal"
      @close="showModal = false"
      content-width="w-3/6"
    >
      <template #header>
        <h3>Patient Form</h3>
      </template>
      
      <template #body>
        <components.PatientForm
          :patient="patientForm"
          :navigate="false"
          @close="handlePatientUpdate"
        />
      </template>
    </components.Modal>
  </div>
</template>

<style lang="css" scoped>
.scrollbar::-webkit-scrollbar {
  width: 0.5rem;
}

.scrollbar::-webkit-scrollbar-track {
  background-color: #f1f1f1;
}

.scrollbar::-webkit-scrollbar-thumb {
  background-color: #d1d1d1;
  border-radius: 9999px;
}
</style>