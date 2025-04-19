<script setup lang="ts">
  import { storeToRefs } from "pinia";
  import { defineAsyncComponent, computed } from "vue";
  import { useRouter } from "vue-router";
  import { IPatient } from "@/models/patient";
  import { usePatientStore } from "@/stores/patient";
  import * as shield from "@/guards";

  const FelTabs = defineAsyncComponent(() => import("@/components/ui/tabs/FelTabs.vue"));
  const patientStore = usePatientStore();
  const router = useRouter();
  const { patient } = storeToRefs(patientStore);

  function addSample(patient?: IPatient): void {
    router?.push({
      name: "samples-add",
      params: {
        patientUid: patient?.uid ?? "",
      },
    });
  }

  // Make patientUid computed
  const patientUid = computed(() => patient?.value?.uid);

  // Make tabs computed to react to patientUid changes
  const tabs = computed(() => [
    {
      id: "samples",
      label: "samples",
      component: defineAsyncComponent(() => import("@/components/sample/FelAnalyisRequestListing.vue")),
      props: {
        target: "patient-samples",
        targetUid: patientUid.value
      }
    },
    {
      id: "cases",
      label: "cases",
      component: defineAsyncComponent(() => import("@/components/case/CaseTable.vue")),
      hidden: true
    },
    {
      id: "billing",
      label: "billing",
      component: defineAsyncComponent(() => import("./PatientBill.vue")),
      props: {
        patientUid: patientUid.value
      }
    },
    {
      id: "logs",
      label: "logs",
      component: defineAsyncComponent(() => import("@/components/audit/FelAuditLog.vue")),
      props: {
        targetType: "patient",
        targetUid: patientUid.value
      }
    }
  ]);
</script>

<template>
  <section class="col-span-12">
    <section class="my-4">
      <button
        v-show="shield.hasRights(shield.actions.UPDATE, shield.objects.PATIENT)"
        class="px-2 py-1 mr-2 border-primary border text-primary rounded-sm transition duration-300 hover:bg-primary hover:text-white focus:outline-none"
        @click.prevent="addSample(patient)"
      >
        Add Sample
      </button>
    </section>
    <FelTabs :tabs="tabs" initial-tab="samples" />
  </section>
</template>