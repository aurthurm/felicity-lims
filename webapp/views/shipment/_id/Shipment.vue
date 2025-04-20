<script setup lang="ts">
import { computed, reactive } from "vue";
import { useRoute } from "vue-router";
import { useShipmentStore } from "@/stores/shipment";
import useShipmentComposable from "@/composables/shipment"

const route = useRoute();
const shipmentStore = useShipmentStore();
const { actionShipment } = useShipmentComposable()

shipmentStore.fetchReferralLaboratories();
shipmentStore.fetchShipmentByUid(route.params.shipmentUid as string);
const shipment = computed(() => shipmentStore.getShipment);

const state = reactive({
  dropdownOpen: false,
});

const canReceive = computed(() => {
  if (["due"].includes(shipment?.value?.state?.toLowerCase()!)) return true;
  return false;
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
  if (!shipment.value?.incoming && !(shipment.value?.laboratory?.url && shipment.value?.laboratory?.password && shipment.value?.laboratory?.username && shipment.value?.courier)) {
    alert("The External Laboratory has missing information or the courier missing");
    return;
  }
  actionShipment(shipment.value?.uid, action)
}

</script>

<template>
  <div class="space-y-6">
    <div
      class="bg-background rounded-lg shadow-sm border border-border p-6 transition-all duration-200 hover:shadow-md"
      v-motion-slide-top
    >
      <div class="space-y-6">
        <!-- Header Section -->
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-6">
            <h3 class="text-lg font-semibold text-foreground">{{ shipment?.shipmentId }}</h3>
            <span class="inline-flex items-center rounded-md bg-muted px-2 py-1 text-xs font-medium text-muted-foreground">
              {{ shipment?.incoming ? "InBound" : "OutBound" }}
            </span>
          </div>
          
          <!-- Actions Dropdown -->
          <div class="relative">
            <button 
              @click="state.dropdownOpen = !state.dropdownOpen"
              class="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background bg-primary text-primary-foreground hover:bg-primary/90 h-9 px-4"
            >
              {{ shipment?.state || "unknown" }}
              <font-awesome-icon icon="chevron-down" class="ml-2 h-4 w-4" />
            </button>

            <!-- Dropdown Menu -->
            <div v-show="state.dropdownOpen" 
              class="absolute right-0 mt-2 w-56 rounded-md bg-background shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50"
              role="menu"
              aria-orientation="vertical"
              aria-labelledby="menu-button"
            >
              <div class="py-1" role="none">
                <button
                  v-show="canReceive"
                  @click="shipmentActor('reject')"
                  class="block w-full px-4 py-2 text-left text-sm text-foreground hover:bg-muted hover:text-foreground"
                  role="menuitem"
                >
                  Reject
                </button>
                <button
                  v-show="canReceive"
                  @click="shipmentActor('receive')"
                  class="block w-full px-4 py-2 text-left text-sm text-foreground hover:bg-muted hover:text-foreground"
                  role="menuitem"
                >
                  Receive
                </button>
                <button
                  v-show="canFinalise"
                  @click="shipmentActor('finalise')"
                  class="block w-full px-4 py-2 text-left text-sm text-foreground hover:bg-muted hover:text-foreground"
                  role="menuitem"
                >
                  Finalise
                </button>
                <button
                  v-show="canDispatch"
                  @click="shipmentActor('dispatch')"
                  class="block w-full px-4 py-2 text-left text-sm text-foreground hover:bg-muted hover:text-foreground"
                  role="menuitem"
                >
                  Dispatch
                </button>
                <button
                  v-show="canRetryDispatch"
                  @click="shipmentActor('dispatch-now')"
                  class="block w-full px-4 py-2 text-left text-sm text-foreground hover:bg-muted hover:text-foreground"
                  role="menuitem"
                >
                  Retry Notification
                </button>
                <button
                  v-show="canCancel"
                  @click="shipmentActor('cancel')"
                  class="block w-full px-4 py-2 text-left text-sm text-foreground hover:bg-muted hover:text-foreground"
                  role="menuitem"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Details Section -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-border">
          <div class="space-y-4">
            <div class="flex items-center">
              <span class="w-1/3 text-sm font-medium text-muted-foreground">External Laboratory</span>
              <span class="text-sm text-foreground">{{ shipment?.laboratory?.name }}</span>
            </div>
            <div class="flex items-center">
              <span class="w-1/3 text-sm font-medium text-muted-foreground">Courier</span>
              <span class="text-sm text-foreground">{{ shipment?.courier }}</span>
            </div>
            <div class="flex items-center">
              <span class="w-1/3 text-sm font-medium text-muted-foreground">Assigned Count</span>
              <span class="text-sm text-foreground">{{ shipment?.assignedCount }}</span>
            </div>
          </div>
          <div class="space-y-4">
            <div class="flex items-start">
              <span class="w-1/3 text-sm font-medium text-muted-foreground">Comment</span>
              <span class="text-sm text-foreground">{{ shipment?.comment }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <router-view />
  </div>
</template>
