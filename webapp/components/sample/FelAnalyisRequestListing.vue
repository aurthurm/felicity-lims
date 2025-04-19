<script setup lang="ts">
import { defineAsyncComponent, toRefs, watch } from "vue";
import { storeToRefs } from "pinia";
import { parseDate } from "@/utils/helpers";
import { useSampleStore } from "@/stores/sample";
const LoadingMessage = defineAsyncComponent(
  () => import("@/components/ui/spinners/FelLoadingMessage.vue")
)

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
    <div
      class="align-middle inline-block min-w-full shadow overflow-hidden bg-background shadow-dashboard p-2 rounded-bl-sm rounded-br-sm">
      <table class="min-w-full">
        <thead>
          <tr>
            <th class="px-1 py-1 border-b-2 border-border text-left leading-4 text-foreground tracking-wider"></th>
            <th class="px-1 py-1 border-b-2 border-border text-left leading-4 text-foreground tracking-wider">
              Sampe ID
            </th>
            <th class="px-1 py-1 border-b-2 border-border text-left text-sm leading-4 text-foreground tracking-wider">
              Test(s)
            </th>
            <th class="px-1 py-1 border-b-2 border-border text-left text-sm leading-4 text-foreground tracking-wider">
              Patient
            </th>
            <th class="px-1 py-1 border-b-2 border-border text-left text-sm leading-4 text-foreground tracking-wider">
              Client Patient ID
            </th>
            <th class="px-1 py-1 border-b-2 border-border text-left text-sm leading-4 text-foreground tracking-wider">
              Client
            </th>
            <th class="px-1 py-1 border-b-2 border-border text-left text-sm leading-4 text-foreground tracking-wider">
              Created
            </th>
            <th class="px-1 py-1 border-b-2 border-border text-left text-sm leading-4 text-foreground tracking-wider">
              Creator
            </th>
            <th class="px-1 py-1 border-b-2 border-border text-left text-sm leading-4 text-foreground tracking-wider">
              Status
            </th>
            <th class="px-1 py-1 border-b-2 border-border"></th>
          </tr>
        </thead>
        <tbody class="bg-background" v-for="request in analysisRequests" :key="request.uid">
          <tr class="bg-muted" v-motion-slide-left>
            <td colspan="10" class="px-1 py-1 whitespace-no-wrap border-b border-border">
              <div class="flex items-center">
                <div class="text-sm leading-5 text-foreground">
                  {{ request.clientRequestId }}
                </div>
              </div>
            </td>
          </tr>
          <tr v-for="sample in request.samples" :key="sample.uid" v-motion-slide-right>
            <td class="px-1 py-1 whitespace-no-wrap border-b border-border">
              <span v-if="sample.priority ?? 0 < 1" :class="[
                'font-small',
                { 'text-destructive': sample.priority ?? 0 == 0 },
              ]">
                <font-awesome-icon icon="fa-star" />
              </span>
            </td>
            <td class="px-1 py-1 whitespace-no-wrap border-b border-border">
              <div class="flex items-center">
                <div class="font-semibold">
                  <router-link :to="{
                    name: 'sample-detail',
                    params: {
                      patientUid: request.patient?.uid,
                      sampleUid: sample?.uid,
                    },
                  }">{{ sample.sampleId }}</router-link>
                </div>
              </div>
            </td>
            <td class="px-1 py-1 whitespace-no-wrap border-b border-border">
              <div class="text-sm leading-5 text-primary">
                {{ profileAnalysesText(sample.profiles ?? [], sample.analyses ?? []) }}
              </div>
            </td>
            <td class="px-1 py-1 whitespace-no-wrap border-b border-border">
              <div class="text-sm leading-5 text-primary">
                {{ request.patient?.firstName }} {{ request.patient?.lastName }}
              </div>
            </td>
            <td class="px-1 py-1 whitespace-no-wrap border-b border-border">
              <div class="text-sm leading-5 text-primary">
                {{ request.patient?.clientPatientId }}
              </div>
            </td>
            <td class="px-1 py-1 whitespace-no-wrap border-b border-border">
              <div class="text-sm leading-5 text-primary">{{ request.client?.name }}</div>
            </td>
            <td class="px-1 py-1 whitespace-no-wrap border-b border-border">
              <div class="text-sm leading-5 text-primary">
                {{ parseDate(sample?.createdAt) }}
              </div>
            </td>
            <td class="px-1 py-1 whitespace-no-wrap border-b border-border">
              <div class="text-sm leading-5 text-primary">
                {{ sample?.createdBy?.firstName }}
              </div>
            </td>
            <td class="px-1 py-1 whitespace-no-wrap border-b border-border">
              <button type="button" class="bg-primary text-primary-foreground p-1 rounded-sm leading-none">
                {{ sample.status }}
              </button>
            </td>
            <td class="px-1 py-1 whitespace-no-wrap text-right border-b border-border text-sm leading-5">
              <router-link :to="{
                name: 'sample-detail',
                params: { patientUid: request.patient?.uid, sampleUid: sample?.uid },
              }"
                class="px-2 py-1 mr-2 border-primary border text-primary rounded-sm transition duration-300 hover:bg-primary hover:text-primary-foreground focus:outline-none">View</router-link>
            </td>
          </tr>
        </tbody>
      </table>
      <div v-if="fetchingAnalysisRequests" class="py-4 text-center">
        <LoadingMessage message="Fetching Analysis Requests ..." />
      </div>
    </div>
  </div>
</template>
