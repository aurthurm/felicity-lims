<script setup lang="ts">
import { defineAsyncComponent, toRefs, watch } from "vue";
import { storeToRefs } from "pinia";
import { parseDate } from "@/utils";
import { useSampleStore } from "@/stores/sample";

const props = defineProps({
  target: String,
  targetUid: String,
});

const { targetUid, target } = toRefs(props);

const sampleStore = useSampleStore();
const { analysisRequests, fetchingAnalysisRequests } = storeToRefs(sampleStore);

if (target?.value === "patient-samples")
  sampleStore.fetchAnalysisRequestsForPatient(targetUid?.value);
if (target?.value === "client-samples")
  sampleStore.fetchAnalysisRequestsForClient(targetUid?.value);

watch(
  () => props.targetUid,
  (uid, prev) => {
    sampleStore.resetAnalysisRequests();
    if (target?.value === "patient-samples")
      sampleStore.fetchAnalysisRequestsForPatient(uid);
    if (target?.value === "client-samples")
      sampleStore.fetchAnalysisRequestsForClient(uid);
  }
);

function profileAnalysesText(profiles: any[], analyses: any[]): string {
  let names: string[] = [];
  profiles.forEach((p) => names.push(p.name));
  analyses.forEach((a) => names.push(a.name));
  return names.join(", ");
}
</script>

<template>
  <div class="overflow-x-auto mt-4">
    <div class="rounded-lg border border-border bg-card shadow-sm">
      <table class="w-full">
        <thead>
          <tr>
            <th class="h-9 px-4 text-left align-middle font-medium text-muted-foreground"></th>
            <th class="h-9 px-4 text-left align-middle font-medium text-muted-foreground">
              Sample ID
            </th>
            <th class="h-9 px-4 text-left align-middle font-medium text-muted-foreground">
              Test(s)
            </th>
            <th class="h-9 px-4 text-left align-middle font-medium text-muted-foreground">
              Patient
            </th>
            <th class="h-9 px-4 text-left align-middle font-medium text-muted-foreground">
              Client Patient ID
            </th>
            <th class="h-9 px-4 text-left align-middle font-medium text-muted-foreground">
              Client
            </th>
            <th class="h-9 px-4 text-left align-middle font-medium text-muted-foreground">
              Created
            </th>
            <th class="h-9 px-4 text-left align-middle font-medium text-muted-foreground">
              Creator
            </th>
            <th class="h-9 px-4 text-left align-middle font-medium text-muted-foreground">
              Status
            </th>
            <th class="h-9 px-4 text-left align-middle font-medium text-muted-foreground"></th>
          </tr>
        </thead>
        <tbody class="[&_tr:last-child]:border-0">
          <template v-for="request in analysisRequests" :key="request.uid">
            <tr class="border-b border-border bg-muted/50" v-motion-slide-left>
              <td colspan="10" class="p-4">
                <div class="text-sm text-foreground">
                  {{ request.clientRequestId }}
                </div>
              </td>
            </tr>
            <tr v-for="sample in request.samples" :key="sample.uid" v-motion-slide-right class="border-b border-border">
              <td class="p-4">
                <span v-if="sample.priority ?? 0 < 1" :class="[
                  'text-sm',
                  { 'text-destructive': sample.priority ?? 0 == 0 },
                ]">
                  <font-awesome-icon icon="fa-star" />
                </span>
              </td>
              <td class="p-4">
                <div class="font-medium">
                  <router-link 
                    :to="{
                      name: 'sample-detail',
                      params: {
                        patientUid: request.patient?.uid,
                        sampleUid: sample?.uid,
                      },
                    }"
                    class="text-primary hover:underline"
                  >
                    {{ sample.sampleId }}
                  </router-link>
                </div>
              </td>
              <td class="p-4">
                <div class="text-sm text-primary">
                  {{ profileAnalysesText(sample.profiles ?? [], sample.analyses ?? []) }}
                </div>
              </td>
              <td class="p-4">
                <div class="text-sm text-primary">
                  {{ request.patient?.firstName }} {{ request.patient?.lastName }}
                </div>
              </td>
              <td class="p-4">
                <div class="text-sm text-primary">
                  {{ request.patient?.clientPatientId }}
                </div>
              </td>
              <td class="p-4">
                <div class="text-sm text-primary">{{ request.client?.name }}</div>
              </td>
              <td class="p-4">
                <div class="text-sm text-primary">
                  {{ parseDate(sample?.createdAt) }}
                </div>
              </td>
              <td class="p-4">
                <div class="text-sm text-primary">
                  {{ sample?.createdBy?.firstName }}
                </div>
              </td>
              <td class="p-4">
                <button 
                  type="button" 
                  class="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground shadow hover:bg-primary/90 h-8 px-3"
                >
                  {{ sample.status }}
                </button>
              </td>
              <td class="p-4 text-right">
                <router-link 
                  :to="{
                    name: 'sample-detail',
                    params: { patientUid: request.patient?.uid, sampleUid: sample?.uid },
                  }"
                  class="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground h-8 px-3"
                >
                  View
                </router-link>
              </td>
            </tr>
          </template>
        </tbody>
      </table>
      <div v-if="fetchingAnalysisRequests" class="p-4 text-center">
        <fel-loader message="Fetching Analysis Requests ..." />
      </div>
    </div>
  </div>
</template>
