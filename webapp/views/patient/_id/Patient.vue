<script setup lang="ts">
import { defineAsyncComponent, onBeforeMount, ref } from "vue";
import { useRoute } from "vue-router";
import { usePatientStore } from "@/stores/patient";
import { PatientType } from "@/types/gql";

defineOptions({ name: 'PatientView' })
const PatientForm = defineAsyncComponent(
  () => import("@/components/person/PatientForm.vue")
)
const PatientInfo = defineAsyncComponent(
  () => import("@/components/person/PatientInfo.vue")
)

const route = useRoute();
const patientStore = usePatientStore();

let showModal = ref<boolean>(false);

onBeforeMount(async () => {
  await patientStore.fetchPatientByUid(route.params.patientUid as string);
});

const updatePatient = (res: PatientType) => {
  patientStore.updatePatient(res);
  showModal.value = false;
};
</script>

<template>
  <div class="space-y-6">
    <PatientInfo @editPatient="() => (showModal = true)" />
    <router-view />
  </div>

  <!-- Patient Edit Form Modal -->
  <Modal v-if="showModal" @close="showModal = false" :contentWidth="'w-1/2'">
    <template v-slot:header>
      <h3 class="text-xl font-semibold text-foreground">Patient Form</h3>
    </template>

    <template v-slot:body>
      <PatientForm :patient="patientStore.patient" :navigate="false" @close="updatePatient" />
    </template>
  </Modal>
</template>

