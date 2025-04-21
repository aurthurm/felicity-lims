<script setup lang="ts">
import * as shield from "@/guards";
import { useRoute } from "vue-router";
import { storeToRefs } from "pinia";
import { usePatientStore } from "@/stores/patient";
import { parseDate } from "@/utils";
import { PatientType } from "@/types/gql";

const route = useRoute();
const patientStore = usePatientStore();
const { patient, fetchingPatient } = storeToRefs(patientStore);

const emit = defineEmits<{
  (e: 'editPatient', patient: PatientType): void;
}>();

const editPatient = (patient: PatientType | undefined) => {
  if (patient) {
    emit('editPatient', patient);
  }
}
</script>

<template>
  <div class="bg-background rounded-sm shadow-sm hover:shadow-lg duration-500 px-4 sm:px-6 md:px-2 py-4 border border-border" v-motion-slide-top>
    <div v-if="fetchingPatient" class="py-4 text-center">
      <fel-loader message="Fetching patient details ..." />
    </div>
    <div class="grid grid-cols-12 gap-3" v-else>
      <!-- Meta Column -->
      <div class="sm:col-span-2 text-center hidden sm:block">
        <div class="inline-block font-bold text-medium mb-2 text-foreground">
          {{ patient?.patientId }}
        </div>
        <!-- Age -->
        <div class="flex flex-col items-center justify-center mx-auto py-2 w-4/5 2lg:w-3/5 rounded-sm bg-muted hover:bg-muted/90 transition-colors duration-300">
          <div class="inline-block font-semibold text-muted-foreground text-sm lg:text-md">
            {{ patient?.gender }}
          </div>
          <div class="inline-block font-bold text-2xl text-muted-foreground my-2">
            {{ patient?.age }}
          </div>
          <div class="inline-block font-semibold text-muted-foreground text-sm lg:text-md">
            Yrs Old
          </div>
        </div>
      </div>

      <!-- Summary Column -->
      <div class="col-span-12 sm:col-start-3 sm:col-end-13 px-3 sm:px-0">
        <div class="flex justify-between sm:text-sm md:text-md lg:text-lg">
          <span class="font-bold text-foreground">{{ patient?.firstName?.toUpperCase() }}
            {{ patient?.lastName?.toUpperCase() }}</span>
          <div class="flex items-center">
            <span class="font-medium text-md text-muted-foreground">{{ parseDate(patient?.dateOfBirth, false) }}</span>
            <button v-show="shield.hasRights(shield.actions.UPDATE, shield.objects.PATIENT)" @click="editPatient(patient)"
              class="p-1 ml-2 border border-border text-muted-foreground text-md rounded-sm transition duration-300 hover:bg-primary hover:text-primary-foreground focus:outline-none focus:ring-2 focus:ring-primary">
              <font-awesome-icon icon="fa-edit" />
            </button>
            <router-link v-show="route.fullPath.includes('patients-compact')" :to="{
              name: 'patient-detail',
              params: { patientUid: patient?.uid },
            }"
              class="p-1 ml-2 border border-border text-muted-foreground rounded-sm transition duration-300 hover:bg-primary hover:text-primary-foreground focus:outline-none focus:ring-2 focus:ring-primary">
              <font-awesome-icon icon="fa-left-right" />
            </router-link>
          </div>
        </div>

        <hr class="border-border my-4" />

        <div class="grid grid-cols-3 gap-x-8 mt-2">
          <div class="col-span-1">
            <h1 class="uppercase text-sm font-semibold text-muted-foreground">Patient Origin</h1>
            <hr class="my-1 border-border">
            <!-- Client Details -->
            <div class="flex justify-between items-center mt-2">
              <span class="text-foreground text-sm font-semibold">Country</span>
              <span class="text-muted-foreground text-sm md:text-md">{{
                patient?.country?.name
              }}</span>
            </div>
            <div class="flex justify-between items-center mt-2">
              <span class="text-foreground text-sm font-semibold">District:</span>
              <span class="text-muted-foreground text-sm md:text-md">{{
                patient?.district?.name
              }}</span>
            </div>
            <div class="flex justify-between items-center mt-2">
              <span class="text-foreground text-sm font-semibold">Province: </span>
              <span class="text-muted-foreground text-sm md:text-md">{{
                patient?.province?.name
              }}</span>
            </div>
          </div>

          <div class="col-span-1">
            <h1 class="uppercase text-sm font-semibold text-muted-foreground">Primary Referrer</h1>
            <hr class="my-1 border-border">
            <!-- Client Details -->
            <div class="flex justify-between items-center mt-2">
              <span class="text-foreground text-sm font-semibold">Client</span>
              <span class="text-muted-foreground text-sm md:text-md">{{
                patient?.client?.name
              }}</span>
            </div>
            <div class="flex justify-between items-center mt-2">
              <span class="text-foreground text-sm font-semibold">District:</span>
              <span class="text-muted-foreground text-sm md:text-md">{{
                patient?.client?.district?.name
              }}</span>
            </div>
            <div class="flex justify-between items-center mt-2">
              <span class="text-foreground text-sm font-semibold">Province: </span>
              <span class="text-muted-foreground text-sm md:text-md">{{
                patient?.client?.district?.province?.name
              }}</span>
            </div>
          </div>

          <div class="col-span-1 mr-2">
            <!-- Identifiers -->
            <div class="flex justify-between items-center mt-2">
              <span class="text-foreground whitespace-nowrap text-sm font-semibold">Client Patient ID:
              </span>
              <span class="text-muted-foreground text-sm md:text-md">
                {{ patient?.clientPatientId }}</span>
            </div>
            <div class="flex justify-between items-center mt-2">
              <span class="text-foreground whitespace-nowrap text-sm font-semibold">Mobile:
              </span>
              <span class="text-muted-foreground text-sm md:text-md">
                {{ patient?.phoneMobile }}</span>
            </div>
            <div class="flex justify-between items-center mt-2">
              <span class="text-foreground whitespace-nowrap text-sm font-semibold">Consent SMS:
              </span>
              <span class="text-muted-foreground text-sm md:text-md">
                {{ patient?.consentSms ? 'Yes' : 'No' }}</span>
            </div>
            <div class="flex justify-between items-center mt-2" v-for="identification in patient?.identifications" :key="identification.uid">
              <span class="text-foreground whitespace-nowrap text-sm font-semibold">{{ identification?.identification?.name
              }}:
              </span>
              <span class="text-muted-foreground text-sm md:text-md">
                {{ identification?.value }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

