<script setup lang="ts">
import { ref, reactive, computed, defineAsyncComponent, onMounted } from "vue";
import { usePatientStore } from "@/stores/patient";
import { useLocationStore } from "@/stores/location";
import { storeToRefs } from "pinia";
import { PatientType } from "@/types/gql";
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
  PatientForm: defineAsyncComponent(() => 
    import("@/components/person/PatientForm.vue")
  ),
  PatientInfo: defineAsyncComponent(() => 
    import("@/components/person/PatientInfo.vue")
  )
};

// Store setup
const patientStore = usePatientStore();
const locationStore = useLocationStore();
const { patients, fetchingPatients } = storeToRefs(patientStore);

// State
const showModal = ref(false);
const patientForm = ref({} as PatientType);
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
const getPatientFullName = (patient: PatientType): string => 
  `${patient.firstName} ${patient.lastName}`;

const getGender = (genderCode: number): string => 
  GENDER_LABELS[genderCode] || 'Unknown';

const selectPatient = (patient: PatientType): void => {
  patientForm.value = patient;
  patientStore.setPatient(patient);
};

const resetPatient = (): void => {
  patientForm.value = {} as PatientType;
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

const handlePatientUpdate = (patient: PatientType): void => {
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
  <div class="space-y-6">
    <fel-heading title="Patients Quick View" />
    <!-- Header Actions -->
    <div class="flex justify-between items-center">
      <div class="flex items-center space-x-4">
        <router-link
          v-if="shield.hasRights(shield.actions.CREATE, shield.objects.PATIENT)"
          to="/patients/search"
          class="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary/50"
        >
          Add Patient
        </router-link>
        
        <input
          type="text"
          placeholder="Search patients..."
          class="w-64 px-4 py-2 text-sm text-foreground placeholder-muted-foreground border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
          @keyup="handleSearch"
          @focus="resetPatient"
        />
      </div>
      
      <button
        v-if="shield.hasRights(shield.actions.CREATE, shield.objects.PATIENT)"
        class="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary/50"
        @click="handleQuickRegistration"
      >
        Quick Registration
      </button>
    </div>

    <!-- Main Content -->
    <div class="grid grid-cols-12 gap-6">
      <!-- Patient List -->
      <section 
        v-motion
        :initial="{ opacity: 0, y: 100 }"
        :enter="{ opacity: 1, y: 0 }"
        :delay="400"
        class="col-span-3  overflow-y-auto scrollbar scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100"
      >
        <fel-loader 
          v-if="fetchingPatients"
          message="Fetching patients..." 
        />
        
        <template v-else>
          <div class="space-y-2">
            <div
              v-for="patient in patients"
              :key="patient.patientId"
              @click="selectPatient(patient)"
              class="bg-background p-4 rounded-lg shadow-sm border border-border cursor-pointer transition-all duration-200 hover:shadow-md hover:border-primary"
              :class="{ 'border-primary bg-primary/5': patient.uid === patientForm?.uid }"
            >
              <div class="space-y-2">
                <div class="flex justify-between items-center">
                  <span class="font-semibold text-foreground">{{ getPatientFullName(patient) }}</span>
                  <span class="text-sm text-muted-foreground">
                    {{ patient.age }} yrs, {{ getGender(+(patient.gender ?? 0)) }}
                  </span>
                </div>
                
                <div class="flex justify-between text-sm text-muted-foreground">
                  <span>{{ patient.patientId }}</span>
                  <span>{{ patient.clientPatientId }}</span>
                </div>
                
                <div class="flex justify-between text-sm text-muted-foreground">
                  <span>{{ patient?.client?.district?.province?.name }}</span>
                  <span>{{ patient?.client?.name }}</span>
                </div>
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
        class="col-span-9 space-y-6"
      >
        <components.PatientInfo @editPatient="showModal = true" />
        <fel-tabs :tabs="tabs" initial-tab="samples" class="rounded-lg" />
      </section>
    </div>

    <!-- Edit Modal -->
    <fel-modal
      v-if="showModal"
      @close="showModal = false"
      content-width="w-3/6"
      class="bg-background"
    >
      <template #header>
        <h3 class="text-xl font-semibold text-foreground">Patient Form</h3>
      </template>
      
      <template #body>
        <components.PatientForm
            :patient="patientForm"
            :navigate="false"
            @close="handlePatientUpdate"
          />
      </template>
    </fel-modal>
  </div>
</template>

<style lang="css" scoped>
.scrollbar::-webkit-scrollbar {
  width: 0.5rem;
}

.scrollbar::-webkit-scrollbar-track {
  background-color: hsl(var(--background));
}

.scrollbar::-webkit-scrollbar-thumb {
  background-color: hsl(var(--muted));
  border-radius: 9999px;
}

.scrollbar::-webkit-scrollbar-thumb:hover {
  background-color: hsl(var(--muted-foreground));
}
</style>