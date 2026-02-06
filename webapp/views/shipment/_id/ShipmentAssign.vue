<script setup lang="ts">
import { Button } from "@/components/ui/button";
import { ref, computed, reactive, defineAsyncComponent } from "vue";
import { useSampleStore } from "@/stores/sample";
import { useShipmentStore } from "@/stores/shipment";
import useShipmentComposable from "@/composables/shipment";
import {  SampleType } from "@/types/gql";
import { Spinner } from "@/components/ui/spinner";

const shipmentStore = useShipmentStore();
const sampleStore = useSampleStore();
const { manageSamples } = useShipmentComposable()

shipmentStore.fetchReferralLaboratories();
const shipment = computed(() => shipmentStore.getShipment);

sampleStore.fetchSampleTypes();
const filterForm = reactive({
  sampleTypeUid: undefined,
  analysisUid: undefined,
});

const allChecked = ref(false);

const samples = computed(() => {
  const samples: SampleType[] = [];
  const incoming = shipmentStore.getSamples;
  incoming?.forEach((result) => {
    if (!samples?.some((item) => item.uid === result.uid)) {
      samples.push(result);
    }
  });
  return samples;
});

const filterSamples = () => {
  getSamplesChecked();
  shipmentStore.fetchFoShipmentAssign({
    first: 50,
    after: "",
    text: "",
    sortBy: undefined,
    ...filterForm,
  });
};

const assignToShipment = () => {
  const samples = getSelectedMetadata();
  manageSamples(shipment?.value?.uid, samples, "assign")
};

function getSamplesChecked(): SampleType[] {
  return  shipmentStore.samples?.filter(s => s.checked);
}

function getSelectedMetadata(): any[] {
  return getSamplesChecked().map(sample => ({
        sampleUid: sample.uid,
        shipedSampleUid: undefined,
        analyses: sample.analysisResults?.filter(s => s.checked)?.map(s => s.uid)
      })
  )?.filter(m => m?.analyses?.length! > 0);
}

function checkCheck(result: SampleType): void {
  if (areAllChecked()) {
    allChecked.value = true;
  } else {
    allChecked.value = false;
  }
}

function check(result: SampleType): void {
  result.checked = true;
}

function unCheck(result: SampleType): void {
  result.checked = false;
}

async function toggleCheckAll() {
  await samples?.value?.forEach((result) =>
    allChecked.value ? check(result) : unCheck(result)
  );
}

function areAllChecked(): boolean {
  return samples?.value?.every((item: SampleType) => item.checked === true);
}
</script>

<template>
  <div class="space-y-6">
    <form action="post" class="space-y-4" v-motion-slide-left>
      <div class="flex flex-wrap gap-4 items-end">
        <div class="flex-1 min-w-[200px]">
          <label class="block space-y-1.5">
            <span class="text-sm font-medium leading-none">Sample Type</span>
            <select
              name="analyses_uids"
              v-model="filterForm.sampleTypeUid"
              class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <option
                v-for="sampleType in sampleStore.sampleTypes"
                :key="sampleType.uid"
                :value="sampleType.uid"
              >
                {{ sampleType.name }}
              </option>
            </select>
          </label>
        </div>

        <div>
          <Button
            v-show="true"
            @click="filterSamples()"
            :color="'sky-800'"
            class="h-10 px-4"
          >
            Apply Filters
          </Button>
        </div>
      </div>
    </form>

    <div class="rounded-md border border-border">
      <div class="overflow-x-auto">
        <div v-if="shipmentStore.fetchingSamples" class="p-4 text-center">
          <span class="inline-flex items-center gap-2">
            <Spinner class="size-4" />
            <span class="text-sm">Fetching samples ...</span>
          </span>
        </div>
        <Table class="w-full" v-else>
          <TableHeader>
            <TableRow class="border-b border-border bg-muted/50">
              <TableHead class="h-10 px-4 text-left align-middle font-medium text-muted-foreground">
                <Checkbox
                  :checked="allChecked"
                  @update:checked="(value) => { allChecked = value; toggleCheckAll(); }"
                />
              </TableHead>
              <TableHead class="h-10 px-4 text-left align-middle font-medium text-muted-foreground"></TableHead>
              <TableHead class="h-10 px-4 text-left align-middle font-medium text-muted-foreground">Sample ID</TableHead>
              <TableHead class="h-10 px-4 text-left align-middle font-medium text-muted-foreground">Sample Type</TableHead>
              <TableHead class="h-10 px-4 text-left align-middle font-medium text-muted-foreground">Client Sample ID</TableHead>
              <TableHead class="h-10 px-4 text-left align-middle font-medium text-muted-foreground">Analysis</TableHead>
              <TableHead class="h-10 px-4 text-left align-middle font-medium text-muted-foreground">Date Created</TableHead>
              <TableHead class="h-10 px-4 text-left align-middle font-medium text-muted-foreground">Date Received</TableHead>
              <TableHead class="h-10 px-4 text-left align-middle font-medium text-muted-foreground">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody class="divide-y divide-border" v-motion-slide-right>
            <TableRow v-for="sample in shipmentStore.samples" :key="sample?.uid" class="hover:bg-muted/50">
              <TableCell class="p-4 align-middle">
                <Checkbox
                  :checked="sample.checked"
                  @update:checked="(value) => { sample.checked = value; checkCheck(sample); }"
                />
              </TableCell>
              <TableCell class="p-4 align-middle"></TableCell>
              <TableCell class="p-4 align-middle">
                <div class="text-sm font-medium text-foreground">
                  {{ sample?.sampleId }}
                </div>
              </TableCell>
              <TableCell class="p-4 align-middle">
                <div class="text-sm font-medium text-foreground">
                  {{ sample?.sampleType?.name }}
                </div>
              </TableCell>
              <TableCell class="p-4 align-middle">
                <div class="text-sm font-medium text-foreground">
                  {{ sample?.analysisRequest?.clientRequestId }}
                </div>
              </TableCell>
              <TableCell class="p-4 align-middle">
                <div class="text-sm text-foreground">
                  <ul class="space-y-2">
                    <li 
                      v-for="analyte in sample?.analysisResults" 
                      :key="analyte.uid"
                      class="flex items-center space-x-2"
                    >
                      <Checkbox :checked="analyte.checked" @update:checked="(value) => analyte.checked = value"
                        :disabled="!sample.checked"
                      />
                      <span class="flex-1">{{ analyte?.analysis?.name }}</span>
                      <span class="inline-flex items-center rounded-md bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
                        {{ analyte?.status }}
                      </span>
                    </li>
                  </ul>
                </div>
              </TableCell>
              <TableCell class="p-4 align-middle">
                <div class="text-sm text-foreground">
                  {{ sample?.createdAt }}
                </div>
              </TableCell>
              <TableCell class="p-4 align-middle">
                <div class="text-sm text-foreground">
                  {{ sample?.dateReceived }}
                </div>
              </TableCell>
              <TableCell class="p-4 align-middle">
                <span class="inline-flex items-center rounded-md bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
                  {{ sample?.status }}
                </span>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>

    <section class="flex justify-end">
      <Button 
        v-show="true" 
        @click="assignToShipment" 
        :color="'orange-600'"
        class="h-10 px-4"
      >
        Assign Samples
      </Button>
    </section>
  </div>
</template>
