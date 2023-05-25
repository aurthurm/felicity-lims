<script setup lang="ts">
import { computed, reactive } from "vue";
import { useRoute } from "vue-router";
import { useShipmentStore } from "../../../stores";
import  { useShipmentComposable } from "../../../composables"

const route = useRoute();
const shipmentStore = useShipmentStore();
const { actionShipment } = useShipmentComposable()

shipmentStore.fetchReferralLaboratories();
shipmentStore.fetchShipmentByUid(route.params.shipmentUid as string);
const shipment = computed(() => shipmentStore.getShipment);

const state = reactive({
  dropdownOpen: false,
});

const canFinalise = computed(() => {
  if (["preperation"].includes(shipment?.value?.state?.toLowerCase()!)) return true;
  return false;
});
const canCancel = computed(() => {
  if (["preperation", "ready"].includes(shipment?.value?.state?.toLowerCase()!)) return true;
  return false;
});
const canDispatch = computed(() => {
  if (["ready"].includes(shipment?.value?.state?.toLowerCase()!)) return true;
  return false;
});
const canRetryDispatch = computed(() => {
  if (["failed"].includes(shipment?.value?.state?.toLowerCase()!)) return true;
  return false;
});
const shipmentActor = (action: string) => {
  if (!(shipment.value?.laboratory?.url && shipment.value?.laboratory?.password && shipment.value?.laboratory?.username && shipment.value?.courier)) {
    alert("The External Laboratory has missing information or the courier missing");
    return;
  }
  actionShipment(shipment.value?.uid, action)
}

</script>

<template>
  <div class="">
    <div
      class="bg-white rounded-sm shadow-sm hover:shadow-lg duration-500 px-4 py-4"
      v-motion-slide-top
    >
      <div class="grid grid-cols-12 gap-1">
        <!-- Meta Column -->
        <div class="col-span-12 flex justify-between font-bold text-medium mb-2">
          <div class="flex">
            <h3 class="mr-10">{{ shipment?.shipmentId }}</h3>
            <h3>{{ shipment?.incoming ? "InBound" : "OutBound" }}</h3>
          </div>
          <div>
            <div @click="state.dropdownOpen = !state.dropdownOpen"
              class="hidden md:block md:flex md:items-center ml-2 mt-2">
              <button type="button" class="bg-sky-800 text-white px-2 py-1 rounded-sm leading-none">
                {{ shipment?.state || "unknown" }}
              </button>
              <div class="ml-2">
                <font-awesome-icon icon="chevron-down" class="text-gray-400" />
              </div>
            </div>
            <div v-show="state.dropdownOpen" @click="state.dropdownOpen = false" class="fixed inset-0 h-full w-full z-10">
            </div>
            <div v-show="state.dropdownOpen" class="absolute mt-4 py-0 bg-gray-300 rounded-sm shadow-xl z-20">
              <div v-show="canFinalise" @click="shipmentActor('finalise')"
                class="no-underline text-gray-900 py-0 opacity-60 px-4 border-b border-transparent hover:opacity-100 md:hover:border-grey-dark hover:bg-sky-800 hover:text-white">
                Finalise
              </div>
              <div v-show="canDispatch" @click="shipmentActor('dispatch')"
                class="no-underline text-gray-900 py-0 opacity-60 px-4 border-b border-transparent hover:opacity-100 md:hover:border-grey-dark hover:bg-sky-800 hover:text-white">
                Dispatch
              </div>
              <div v-show="canRetryDispatch" @click="shipmentActor('dispatch-now')"
                class="no-underline text-gray-900 py-0 opacity-60 px-4 border-b border-transparent hover:opacity-100 md:hover:border-grey-dark hover:bg-sky-800 hover:text-white">
                Retry Notification
              </div>
              <div v-show="canCancel" @click="shipmentActor('cancel')"
                class="no-underline text-gray-900 py-0 opacity-60 px-4 border-b border-transparent hover:opacity-100 md:hover:border-grey-dark hover:bg-sky-800 hover:text-white">
                Cancel
              </div>
            </div>
          </div>
        </div>
        <!-- Summary Column -->
        <div class="col-span-12 sm:col-end-13 px-3 sm:px-0">
          <hr />
          <div class="grid grid-cols-2 mt-2">
            <div class="col-span-1">
              <!-- Client Details -->
              <div class="flex">
                <span class="text-gray-800 text-sm font-semibold w-1/6">External Laboratory</span>
                <span class="text-gray-600 text-sm md:text-md">{{
                  shipment?.laboratory?.name
                }}</span>
              </div>
              <div class="flex">
                <span class="text-gray-800 text-md font-semibold w-1/6">Courier:</span>
                <span class="text-gray-600 text-sm md:text-md">{{
                  shipment?.courier
                }}</span>
              </div>
              <div class="flex">
                <span class="text-gray-800 text-sm font-semibold w-1/6">Assigned Count:</span>
                <span class="text-gray-600 text-sm md:text-md">{{
                  shipment?.assignedCount
                }}</span>
              </div>
            </div>
            <div class="col-span-1">
              <div class="flex">
                <span class="text-gray-800 text-sm font-semibold w-1/6">Comment:</span>
                <span class="text-gray-600 text-sm md:text-md"
                  >{{ shipment?.comment }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <router-view />
  </div>
</template>
