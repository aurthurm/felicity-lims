<script setup lang="ts">
import modal from "../../../components/SimpleModal.vue";
import PatientForm from "../PatientForm.vue";
import PatientInfo from "../PatientInfo.vue";

import { ref } from "vue";
import { useRoute } from "vue-router";

import { usePatientStore } from "../../../stores";
import { IPatient } from "../../../models/patient";

const route = useRoute();
const patientStore = usePatientStore();

let showModal = ref<boolean>(false);
patientStore.fetchPtientByUid(route.params.patientUid);

const updatePatient = (res: IPatient) => {
  patientStore.updatePatient(res);
  showModal.value = false;
};
</script>

<template>
  <div class="">
    <PatientInfo @editPatient="() => (showModal = true)" />
    <router-view />
  </div>

  <!-- Patient Edit Form Modal -->
  <modal v-if="showModal" @close="showModal = false">
    <template v-slot:header>
      <h3>Patient Form</h3>
    </template>

    <template v-slot:body>
      <PatientForm :patient="patientStore.patient" :navigate="false" @close="updatePatient" />
    </template>
  </modal>
</template>

