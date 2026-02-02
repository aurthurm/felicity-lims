<script setup lang="ts">
import { defineAsyncComponent, toRefs, watch } from "vue";
import { storeToRefs } from "pinia";
import { parseDate } from "@/utils";
import { useSampleStore } from "@/stores/sample";
import { Spinner } from "@/components/ui/spinner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

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
      <Table class="w-full">
        <TableHeader>
          <TableRow>
            <TableHead class="h-9 px-4 text-left align-middle font-medium text-muted-foreground"></TableHead>
            <TableHead class="h-9 px-4 text-left align-middle font-medium text-muted-foreground">
              Sample ID
            </TableHead>
            <TableHead class="h-9 px-4 text-left align-middle font-medium text-muted-foreground">
              Test(s)
            </TableHead>
            <TableHead class="h-9 px-4 text-left align-middle font-medium text-muted-foreground">
              Patient
            </TableHead>
            <TableHead class="h-9 px-4 text-left align-middle font-medium text-muted-foreground">
              Client Patient ID
            </TableHead>
            <TableHead class="h-9 px-4 text-left align-middle font-medium text-muted-foreground">
              Client
            </TableHead>
            <TableHead class="h-9 px-4 text-left align-middle font-medium text-muted-foreground">
              Created
            </TableHead>
            <TableHead class="h-9 px-4 text-left align-middle font-medium text-muted-foreground">
              Creator
            </TableHead>
            <TableHead class="h-9 px-4 text-left align-middle font-medium text-muted-foreground">
              Status
            </TableHead>
            <TableHead class="h-9 px-4 text-left align-middle font-medium text-muted-foreground"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody class="[&_tr:last-child]:border-0">
          <template v-for="request in analysisRequests" :key="request.uid">
            <TableRow class="border-b border-border bg-muted/50" v-motion-slide-left>
              <TableCell colspan="10" class="p-4">
                <div class="text-sm text-foreground">
                  {{ request.clientRequestId }}
                </div>
              </TableCell>
            </TableRow>
            <TableRow v-for="sample in request.samples" :key="sample.uid" v-motion-slide-right class="border-b border-border">
              <TableCell class="p-4">
                <span v-if="sample.priority ?? 0 < 1" :class="['text-sm',
                  { 'text-destructive': sample.priority ?? 0 == 0 },
                ]">
                  <font-awesome-icon icon="fa-star" />
                </span>
              </TableCell>
              <TableCell class="p-4">
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
              </TableCell>
              <TableCell class="p-4">
                <div class="text-sm text-primary">
                  {{ profileAnalysesText(sample.profiles ?? [], sample.analyses ?? []) }}
                </div>
              </TableCell>
              <TableCell class="p-4">
                <div class="text-sm text-primary">
                  {{ request.patient?.firstName }} {{ request.patient?.lastName }}
                </div>
              </TableCell>
              <TableCell class="p-4">
                <div class="text-sm text-primary">
                  {{ request.patient?.clientPatientId }}
                </div>
              </TableCell>
              <TableCell class="p-4">
                <div class="text-sm text-primary">{{ request.client?.name }}</div>
              </TableCell>
              <TableCell class="p-4">
                <div class="text-sm text-primary">
                  {{ parseDate(sample?.createdAt) }}
                </div>
              </TableCell>
              <TableCell class="p-4">
                <div class="text-sm text-primary">
                  {{ sample?.createdBy?.firstName }}
                </div>
              </TableCell>
              <TableCell class="p-4">
                <Badge variant="secondary">
                  {{ sample.status }}
                </Badge>
              </TableCell>
              <TableCell class="p-4 text-right">
                <Button as-child variant="outline" size="sm">
                  <router-link 
                    :to="{
                      name: 'sample-detail',
                      params: { patientUid: request.patient?.uid, sampleUid: sample?.uid },
                    }"
                  >
                    View
                  </router-link>
                </Button>
              </TableCell>
            </TableRow>
          </template>
        </TableBody>
      </Table>
      <div v-if="fetchingAnalysisRequests" class="p-4 text-center">
        <span class="inline-flex items-center gap-2">
          <Spinner class="size-4" />
          <span class="text-sm">Fetching Analysis Requests ...</span>
        </span>
      </div>
    </div>
  </div>
</template>
