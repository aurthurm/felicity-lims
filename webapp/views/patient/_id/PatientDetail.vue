<script setup lang="ts">
  import { storeToRefs } from "pinia";
  import { defineAsyncComponent, computed } from "vue";
  import { useRouter } from "vue-router";
  import { PatientType } from "@/types/gql";
  import { usePatientStore } from "@/stores/patient";
  import * as shield from "@/guards";

  const patientStore = usePatientStore();
  const router = useRouter();
  const { patient } = storeToRefs(patientStore);

  function addSample(patient?: PatientType): void {
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
  <section class="col-span-12 space-y-6">
    <section class="flex items-center space-x-4">
      <button
        v-show="shield.hasRights(shield.actions.UPDATE, shield.objects.PATIENT)"
        class="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary/50"
        @click.prevent="addSample(patient)"
      >
        Add Sample
      </button>
    </section>
    <fel-tabs :tabs="tabs" initial-tab="samples" class="rounded-lg" />
  </section>
</template>