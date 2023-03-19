<script setup lang="ts">
import LoadingMessage from "../../../components/Spinners/LoadingMessage.vue";
import modal from "../../../components/SimpleModal.vue";
import PatientForm from "../PatientForm.vue";

import { ref } from "vue";
import { useRoute } from "vue-router";
import { storeToRefs } from "pinia";

import { usePatientStore } from "../../../stores";
import { IPatient } from "../../../models/patient";

import * as shield from "../../../guards";

const route = useRoute();
const patientStore = usePatientStore();

const { patient, fetchingPatient } = storeToRefs(patientStore);

let showModal = ref<boolean>(false);

patientStore.fetchPtientByUid(route.params.patientUid);

const updatePatient = (res: IPatient) => {
  patientStore.updatePatient(res);
  showModal.value = false;
};
</script>

<template>
  <div class="">
    <div
      class="bg-white rounded-sm shadow-sm hover:shadow-lg duration-500 px-4 sm:px-6 md:px-2 py-4"
      v-motion-slide-top
    >
      <div v-if="fetchingPatient" class="py-4 text-center">
        <LoadingMessage message="Fetching patient details ..." />
      </div>
      <div class="grid grid-cols-12 gap-3" v-else>
        <!-- Meta Column -->
        <div class="sm:col-span-2 text-center hidden sm:block">
          <div class="inline-block font-bold text-medium mb-2">
            {{ patient?.patientId }}
          </div>
          <!-- Age -->
          <div
            class="grid grid-rows-2 mx-auto mb-1 py-1 w-4/5 2lg:w-3/5 rounded-sm bg-sky-800"
          >
            <div class="inline-block font-bold text-2xl text-white">
              {{ patient?.age }}
            </div>
            <div class="inline-block font-semibold text-white text-sm lg:text-md">
              Yrs Old
            </div>
          </div>
        </div>
        <!-- Summary Column -->
        <div class="col-span-12 sm:col-start-3 sm:col-end-13 px-3 sm:px-0">
          <div class="flex justify-between sm:text-sm md:text-md lg:text-lg">
            <span class="font-bold text-gray-800"
              >{{ patient?.firstName?.toUpperCase() }}
              {{ patient?.lastName?.toUpperCase() }}</span
            >
            <div>
              <span class="font-medium text-md">{{ patient?.dateOfBirth }}</span>
              <button
                v-show="shield.hasRights(shield.actions.UPDATE, shield.objects.PATIENT)"
                @click="showModal = true"
                class="p-1 ml-2 border-white border text-gray-500 text-md rounded-sm transition duration-300 hover:border-sky-800 hover:text-sky-800 focus:outline-none"
              >
                <font-awesome-icon icon="fa-edit" />
              </button>
            </div>
          </div>
          <hr />
          <div class="grid grid-cols-2 mt-2">
            <div class="col-span-1">
              <!-- Client Details -->
              <div class="flex">
                <span class="text-gray-800 text-sm font-semibold w-1/6">Client</span>
                <span class="text-gray-600 text-sm md:text-md">{{
                  patient?.client?.name
                }}</span>
              </div>
              <div class="flex">
                <span class="text-gray-800 text-sm font-semibold w-1/6">District:</span>
                <span class="text-gray-600 text-sm md:text-md">{{
                  patient?.client?.district?.name
                }}</span>
              </div>
              <div class="flex">
                <span class="text-gray-800 text-sm font-semibold w-1/6">Province: </span>
                <span class="text-gray-600 text-sm md:text-md">{{
                  patient?.client?.district?.province?.name
                }}</span>
              </div>
            </div>
            <div class="col-span-1">
              <!-- Identifiers -->
              <div class="col-span-2 flex mt-2">
                <span class="text-gray-800 text-sm font-semibold w-1/6"
                  >Client Patient ID:
                </span>
                <span class="text-gray-600 text-sm md:text-md">
                  {{ patient?.clientPatientId }}</span
                >
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <router-view />
  </div>

  <!-- Patient Edit Form Modal -->
  <modal v-if="showModal" @close="showModal = false">
    <template v-slot:header>
      <h3>Patient Form</h3>
    </template>

    <template v-slot:body>
      <PatientForm :patient="patient" :navigate="false" @close="updatePatient" />
    </template>
  </modal>
</template>
