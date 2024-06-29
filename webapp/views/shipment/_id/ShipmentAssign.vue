<script setup lang="ts">
import FButton from "@/components/ui/buttons/FelButton.vue";
import { ref, computed, reactive, defineAsyncComponent } from "vue";
import { useShipmentStore, useSampleStore } from "@/stores";
import { useShipmentComposable } from "@/composables";
import {  ISample } from "@/models/analysis";
const LoadingMessage = defineAsyncComponent(
  () => import("@/components/ui/spinners/FelLoadingMessage.vue")
)

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
  const samples: ISample[] = [];
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

function getSamplesChecked(): ISample[] {
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

function checkCheck(result: ISample): void {
  if (areAllChecked()) {
    allChecked.value = true;
  } else {
    allChecked.value = false;
  }
}

function check(result: ISample): void {
  result.checked = true;
}

function unCheck(result: ISample): void {
  result.checked = false;
}

async function toggleCheckAll() {
  await samples?.value?.forEach((result) =>
    allChecked.value ? check(result) : unCheck(result)
  );
}

function areAllChecked(): Boolean {
  return samples?.value?.every((item: ISample) => item.checked === true);
}
</script>

<template>
  <div class="overflow-x-auto mt-4">
    <form action="post" class="p-1" v-motion-slide-left>
      <div class="flex justify-start mb-4">
        <label class="flex justify-between items-center">
          <span class="text-gray-700 mr-2 whitespace-nowrap">Sample Type</span>
          <select
            name="analyses_uids"
            v-model="filterForm.sampleTypeUid"
            class="form-input mt-1 block w-full py-1"
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
        <!-- <label class="flex justify-between items-center ml-6">
          <span class="text-gray-700 mr-2">Analyses</span>
          <select
            name="analyses_uids"
            v-model="filterForm.analysisUid"
            class="form-input mt-1 block w-full py-1"
          >
            <option
              v-for="service in analysisStore.analysesServices"
              :key="service.uid"
              :value="service.uid"
            >
              {{ service.name }}
            </option>
          </select>
        </label> -->
        <div class="ml-6 mt-2">
          <FButton
            v-show="true"
            @click.prevent="filterSamples()"
            :color="'sky-800'"
            class="p-1"
            >Apply Filters</FButton
          >
        </div>
      </div>
    </form>
  </div>

  <div class="overflow-x-auto mt-4">
    <div
      class="align-middle inline-block min-w-full shadow overflow-hidden bg-white shadow-dashboard px-2 pt-1 rounded-bl-lg rounded-br-lg"
    >
      <div v-if="shipmentStore.fetchingSamples" class="py-4 text-center">
        <LoadingMessage message="Fetching samples ..." />
      </div>
      <table class="min-w-full" v-else>
        <thead>
          <tr>
            <th
              class="px-1 py-1 border-b-2 border-gray-300 text-left leading-4 text-gray-800 tracking-wider"
            >
              <input type="checkbox" @change="toggleCheckAll" v-model="allChecked" />
            </th>
            <th
              class="px-1 py-1 border-b-2 border-gray-300 text-left leading-4 text-gray-800 tracking-wider"
            ></th>
            <th
              class="px-1 py-1 border-b-2 border-gray-300 text-left leading-4 text-gray-800 tracking-wider"
            >
              Sample ID
            </th>
            <th
              class="px-1 py-1 border-b-2 border-gray-300 text-left leading-4 text-gray-800 tracking-wider"
            >
              Sample Type
            </th>
            <th
              class="px-1 py-1 border-b-2 border-gray-300 text-left leading-4 text-gray-800 tracking-wider"
            >
              Client Sample ID
            </th>
            <th
              class="px-1 py-1 border-b-2 border-gray-300 text-left text-sm leading-4 text-gray-800 tracking-wider"
            >
              Analysis
            </th>
            <th
              class="px-1 py-1 border-b-2 border-gray-300 text-left text-sm leading-4 text-gray-800 tracking-wider"
            >
              Date Created
            </th>
            <th
              class="px-1 py-1 border-b-2 border-gray-300 text-left text-sm leading-4 text-gray-800 tracking-wider"
            >
              Date Received
            </th>
            <th
              class="px-1 py-1 border-b-2 border-gray-300 text-left text-sm leading-4 text-gray-800 tracking-wider"
            >
              Status
            </th>
          </tr>
        </thead>
        <tbody class="bg-white" v-motion-slide-right>
          <tr v-for="sample in shipmentStore.samples" :key="sample?.uid">
            <td>
              <input
                type="checkbox"
                v-model="sample.checked"
                @change="checkCheck(sample)"
              />
            </td>
            <td class="px-1 py-1 whitespace-no-wrap border-b border-gray-500"></td>
            <td class="px-1 py-1 whitespace-no-wrap border-b border-gray-500">
              <div class="text-sm leading-5 text-sky-800 font-semibold">
                {{ sample?.sampleId }}
              </div>
            </td>
            <td class="px-1 py-1 whitespace-no-wrap border-b border-gray-500">
              <div class="text-sm leading-5 text-sky-800 font-semibold">
                {{ sample?.sampleType?.name }}
              </div>
            </td>
            <td class="px-1 py-1 whitespace-no-wrap border-b border-gray-500">
              <div class="text-sm leading-5 text-sky-800 font-semibold">
                {{ sample?.analysisRequest?.clientRequestId }}
              </div>
            </td>
            <td class="px-1 py-1 whitespace-no-wrap border-b border-gray-500">
              <div class="text-sm leading-5 text-sky-800">
                <ul>
                  <li 
                  class="flex justify-start items-center"
                  v-for="analyte in sample?.analysisResults" :key="analyte.uid">
                    <input
                      type="checkbox"
                      v-model="analyte.checked"
                      class="mr-2"
                      :disabled="!sample.checked"
                    />
                    <span>{{ analyte?.analysis?.name }}</span>
                    <span>{{ analyte?.status }}</span>
                  </li>
                </ul>
              </div>
            </td>
            <td class="px-1 py-1 whitespace-no-wrap border-b border-gray-500">
              <div class="text-sm leading-5 text-sky-800">
                {{ sample?.createdAt }}
              </div>
            </td>
            <td class="px-1 py-1 whitespace-no-wrap border-b border-gray-500">
              <div class="text-sm leading-5 text-sky-800">
                {{ sample?.dateReceived }}
              </div>
            </td>
            <td class="px-1 py-1 whitespace-no-wrap border-b border-gray-500">
              <div class="text-sm leading-5 text-sky-800">
                {{ sample?.status }}
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>

  <section class="my-4">
    <FButton v-show="true" @click.prevent="assignToShipment" :color="'orange-600'"
      >Assign Samples</FButton
    >
  </section>
</template>
