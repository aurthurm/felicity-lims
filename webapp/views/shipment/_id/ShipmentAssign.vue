<script setup lang="ts">
import FButton from "@/components/ui/buttons/FelButton.vue";
import { ref, computed, reactive, defineAsyncComponent } from "vue";
import { useSampleStore } from "@/stores/sample";
import { useShipmentStore } from "@/stores/shipment";
import useShipmentComposable from "@/composables/shipment";
import {  SampleType } from "@/types/gql";

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

function areAllChecked(): Boolean {
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
          <FButton
            v-show="true"
            @click.prevent="filterSamples()"
            :color="'sky-800'"
            class="h-10 px-4"
          >
            Apply Filters
          </FButton>
        </div>
      </div>
    </form>

    <div class="rounded-md border border-border">
      <div class="overflow-x-auto">
        <div v-if="shipmentStore.fetchingSamples" class="p-4 text-center">
          <fel-loader message="Fetching samples ..." />
        </div>
        <table class="w-full" v-else>
          <thead>
            <tr class="border-b border-border bg-muted/50">
              <th class="h-10 px-4 text-left align-middle font-medium text-muted-foreground">
                <input 
                  type="checkbox" 
                  @change="toggleCheckAll" 
                  v-model="allChecked"
                  class="h-4 w-4 rounded border-input text-primary focus:ring-primary"
                />
              </th>
              <th class="h-10 px-4 text-left align-middle font-medium text-muted-foreground"></th>
              <th class="h-10 px-4 text-left align-middle font-medium text-muted-foreground">Sample ID</th>
              <th class="h-10 px-4 text-left align-middle font-medium text-muted-foreground">Sample Type</th>
              <th class="h-10 px-4 text-left align-middle font-medium text-muted-foreground">Client Sample ID</th>
              <th class="h-10 px-4 text-left align-middle font-medium text-muted-foreground">Analysis</th>
              <th class="h-10 px-4 text-left align-middle font-medium text-muted-foreground">Date Created</th>
              <th class="h-10 px-4 text-left align-middle font-medium text-muted-foreground">Date Received</th>
              <th class="h-10 px-4 text-left align-middle font-medium text-muted-foreground">Status</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-border" v-motion-slide-right>
            <tr v-for="sample in shipmentStore.samples" :key="sample?.uid" class="hover:bg-muted/50">
              <td class="p-4 align-middle">
                <input
                  type="checkbox"
                  v-model="sample.checked"
                  @change="checkCheck(sample)"
                  class="h-4 w-4 rounded border-input text-primary focus:ring-primary"
                />
              </td>
              <td class="p-4 align-middle"></td>
              <td class="p-4 align-middle">
                <div class="text-sm font-medium text-foreground">
                  {{ sample?.sampleId }}
                </div>
              </td>
              <td class="p-4 align-middle">
                <div class="text-sm font-medium text-foreground">
                  {{ sample?.sampleType?.name }}
                </div>
              </td>
              <td class="p-4 align-middle">
                <div class="text-sm font-medium text-foreground">
                  {{ sample?.analysisRequest?.clientRequestId }}
                </div>
              </td>
              <td class="p-4 align-middle">
                <div class="text-sm text-foreground">
                  <ul class="space-y-2">
                    <li 
                      v-for="analyte in sample?.analysisResults" 
                      :key="analyte.uid"
                      class="flex items-center space-x-2"
                    >
                      <input
                        type="checkbox"
                        v-model="analyte.checked"
                        class="h-4 w-4 rounded border-input text-primary focus:ring-primary"
                        :disabled="!sample.checked"
                      />
                      <span class="flex-1">{{ analyte?.analysis?.name }}</span>
                      <span class="inline-flex items-center rounded-md bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
                        {{ analyte?.status }}
                      </span>
                    </li>
                  </ul>
                </div>
              </td>
              <td class="p-4 align-middle">
                <div class="text-sm text-foreground">
                  {{ sample?.createdAt }}
                </div>
              </td>
              <td class="p-4 align-middle">
                <div class="text-sm text-foreground">
                  {{ sample?.dateReceived }}
                </div>
              </td>
              <td class="p-4 align-middle">
                <span class="inline-flex items-center rounded-md bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
                  {{ sample?.status }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <section class="flex justify-end">
      <FButton 
        v-show="true" 
        @click.prevent="assignToShipment" 
        :color="'orange-600'"
        class="h-10 px-4"
      >
        Assign Samples
      </FButton>
    </section>
  </div>
</template>
