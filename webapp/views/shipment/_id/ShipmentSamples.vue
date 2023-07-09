<script setup lang="ts">
import FButton from "../../../components/Buttons/Button.vue";
import { useRoute } from "vue-router";
import { ref, computed, reactive } from "vue";
import { ISample } from "../../../models/analysis";
import { useShipmentComposable } from "../../../composables";
import { useShipmentStore } from "../../../stores";

const shipmentStore = useShipmentStore();
const route = useRoute();

let allChecked = ref<boolean>(false);
let shipment = computed(() => shipmentStore.getShipment);

const refresh = () => {
  shipmentStore.fetchShipmentByUid(route.params.shipmentUid as string);
};

const form = reactive({
  laboratoryUid: undefined,
  comment: undefined,
  courier: undefined,
});

const applying = ref<boolean>(false);

const applyChanges = () => {
  applying.value = true;
  shipmentStore
    .updateShipment({ uid: route.params.shipmentUid, payload: form })
    .then(() => {
      applying.value = false;
      refresh();
    });
};
//

function areAllChecked(): boolean {
  return shipment.value?.samples?.every((item) => item.checked === true)!;
}

function getSamplesChecked(): any {
  let samples: ISample[] = [];
  shipment.value?.shippedSamples?.forEach((shipped) => {
    if (shipped?.checked) samples.push(shipped.sample!);
  });
  return samples;
}

function checkCheck(): void {
  if (areAllChecked()) {
    allChecked.value = true;
  } else {
    allChecked.value = false;
  }
  checkUserActionPermissios();
}

function check(sample: ISample): void {
  if (checkDisabled(sample) || shipment.value?.state !== "preperation") {
    unCheck(sample);
    return;
  }
  sample.checked = true;
  checkUserActionPermissios();
}

function checkDisabled(sample: ISample): boolean {
  return ["retracted", "approved"].includes(sample.status!);
}

function unCheck(sample: ISample): void {
  sample.checked = false;
  checkUserActionPermissios();
}

function toggleCheckAll(): void {
  shipment?.value?.samples?.forEach((sample) =>
    allChecked.value ? check(sample) : unCheck(sample)
  );
  checkUserActionPermissios();
}

function getSelectedMetadata(): any[] {
  return getSamplesChecked().map(sample => ({
        sampleUid: sample.uid,
        shipedSampleUid: undefined,
        analyses: []
      })
  )
}

let can_recover = ref<boolean>(false);
let can_recall = ref<boolean>(false);

function checkUserActionPermissios(): void {
  can_recover.value = false;
  can_recall.value = false;
  const checked = getSamplesChecked();
  if (checked.length === 0) return;
  if (checked.every((sample: ISample) => ["referred", "paired"].includes(sample.status ?? ""))) {
    can_recover.value = true;
  }
  if (checked.every((sample: ISample) => sample.status === "referred")) {
    can_recall.value = true;
  }
}

const viewShipmentModifier = computed(() => !["cancelled", "dispatched"].includes(shipment.value?.state ?? ""))

const { manageSamples } = useShipmentComposable();

const sampleManager = (action: string) => {
  const samples = getSelectedMetadata();
  manageSamples(shipment?.value?.uid, samples, action)
};
</script>

<template>
  <div class="">
    <hr class="mt-4" />
    <div v-show="viewShipmentModifier" class="flex justify-between items-center" v-motion-slide-left>
      <form action="post" class="p-1" v-show="!applying && !shipmentStore.shipment?.incoming">
        <div class="flex justify-start items-center mb-4">
          <label class="flex justify-between items-center">
            <span class="text-gray-700 mr-2 whitespace-nowrap">Reference Laboratory</span>
            <select
              name="laboratory_uid"
              v-model="form.laboratoryUid"
              class="form-input mt-1 block w-full py-1"
            >
              <option v-for="laboratory in shipmentStore.laboratories" :key="laboratory.uid" :value="laboratory.uid">
                {{ laboratory.name }}
              </option>
            </select>
          </label>
          <label class="flex justify-between items-center ml-4">
            <span class="text-gray-700 mr-2">Courier</span>
            <input
              type="text"
              class="form-input mt-1 block w-full py-1"
              v-model="form.courier"
            />
          </label>
          <div class="ml-6 mt-2">
            <FButton @click.prevent="applyChanges()" :color="'sky-800'" class="p-1"
              >Apply</FButton
            >
          </div>
        </div>
      </form>
      <p v-show="applying">updating ...</p>

      <div>
        <button
          @click.prevent="refresh()"
          class="px-1 py-1 mr-2 border-sky-800 border text-sky-800rounded-smtransition duration-300 hover:bg-sky-800 hover:text-white focus:outline-none"
        >
          Refresh
        </button>
      </div>
    </div>
    <hr class="mb-4" />

    <!-- Sampe Table View -->
    <div class="overflow-x-auto">
      <div
        class="align-middle inline-block min-w-full shadow overflow-hidden bg-white shadow-dashboard px-2 pt-1 rounded-bl-lg rounded-br-lg"
      >
        <table class="min-w-full">
          <thead>
            <tr>
              <th
                class="px-1 py-1 border-b-2 border-gray-300 text-left leading-4 text-gray-800 tracking-wider"
                v-show="shipment?.state === 'preperation'"
              >
                <input
                  type="checkbox"
                  class=""
                  @change="toggleCheckAll()"
                  v-model="allChecked"
                />
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
                v-show="shipment?.incoming"
                class="px-1 py-1 border-b-2 border-gray-300 text-left leading-4 text-gray-800 tracking-wider"
              >
                Exernal SID
              </th>
              <th
                class="px-1 py-1 border-b-2 border-gray-300 text-left leading-4 text-gray-800 tracking-wider"
              >
                Client Request Id
              </th>
              <th
                class="px-1 py-1 border-b-2 border-gray-300 text-left text-sm leading-4 text-gray-800 tracking-wider"
              >
                Date Collected
              </th>
              <th
                class="px-1 py-1 border-b-2 border-gray-300 text-left text-sm leading-4 text-gray-800 tracking-wider"
              >
                Analysis
              </th>
              <th
                class="px-1 py-1 border-b-2 border-gray-300 text-left text-sm leading-4 text-gray-800 tracking-wider"
              >
                Status
              </th>
              <!-- <th class="px-1 py-1 border-b-2 border-gray-300"></th> -->
            </tr>
          </thead>
          <tbody class="bg-white">
            <tr
              v-for="shipped in shipment?.shippedSamples"
              :key="shipped.sampleUid"
              v-motion-slide-right
            >
              <td class="px-1 py-1 whitespace-no-wrap border-b border-gray-500" v-show="shipment?.state === 'preperation'">
                <input
                  type="checkbox"
                  class=""
                  v-model="shipped.checked"
                  @change="checkCheck()"
                />
              </td>
              <td class="px-1 py-1 whitespace-no-wrap border-b border-gray-500">
                <span
                  v-if="shipped.sample?.priority ?? 0 > 0"
                  :class="[
                        'font-small',
                        { 'text-orange-600': shipped.sample?.priority ?? 0 > 1 },
                    ]"
                >
                  <i class="fa fa-star"></i>
                </span>
              </td>
              <td class="px-1 py-1 whitespace-no-wrap border-b border-gray-500">
                <div class="text-sm leading-5 text-gray-800 font-semibold">
                  <router-link
                    v-if="shipped.sample?.analysisRequest?.patient?.uid"
                    :to="{
                      name: 'sample-detail',
                      params: {
                        patientUid: shipped.sample?.analysisRequest?.patient?.uid,
                        sampleUid: shipped.sample?.uid,
                      },
                    }"
                    >{{ shipped.sample?.sampleId }}
                  </router-link>
                  <div v-else>{{ shipped.sample?.sampleId }}</div>
                </div>
              </td>
              <td v-show="shipment?.incoming"
                class="px-1 py-1 whitespace-no-wrap border-b border-gray-500">
                <div>{{ shipped.extSampleId }}</div>
              </td>
              <td class="px-1 py-1 whitespace-no-wrap border-b border-gray-500">
                <div>{{ shipped.sample?.analysisRequest?.clientRequestId }}</div>
              </td>
              <td class="px-1 py-1 whitespace-no-wrap border-b border-gray-500">
                <div>{{ shipped.sample?.dateCollected }}</div>
              </td>
              <td class="px-1 py-1 whitespace-no-wrap border-b border-gray-500">
                <div>tests</div>
              </td>
              <td class="px-1 py-1 whitespace-no-wrap border-b border-gray-500">
                <button
                  type="button"
                  class="bg-sky-800 text-white py-1 px-2 rounded-sm leading-none"
                >
                  {{ shipped.sample?.status || "unknown" }}
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <section class="my-4">
      <button
        v-show="can_recover"
        @click.prevent="sampleManager('recover')"
        class="px-2 py-1 mr-2 border-sky-800 border text-sky-800rounded-smtransition duration-300 hover:bg-sky-800 hover:text-white focus:outline-none"
      >
        Remove
      </button>
      <button
        v-show="can_recall"
        @click.prevent="sampleManager('recall')"
        class="px-2 py-1 mr-2 border-sky-800 border text-sky-800rounded-smtransition duration-300 hover:bg-sky-800 hover:text-white focus:outline-none"
      >
        Pair
      </button>
    </section>
  </div>
</template>
