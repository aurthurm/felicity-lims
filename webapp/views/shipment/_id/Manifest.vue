<script setup lang="ts">
import { defineAsyncComponent, ref } from "vue";
import useShipmentComposable from "@/composables/shipment";
import { useShipmentStore } from "@/stores/shipment";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome"

const loadongMeta = ref(false);

const { shipment } = useShipmentStore()
const { downloadManifest } = useShipmentComposable();
const manifestDownloader = async (report_uid) => await downloadManifest(report_uid);
</script>

<template>
  <div class="space-y-6">
    <fel-loader v-if="loadongMeta" :message="'Loading your manifest report ...'" />
    <section v-else class="space-y-4">
      <div v-if="shipment?.jsonContent" class="flex justify-start">
        <div class="bg-background rounded-lg border border-border p-4 w-full max-w-md shadow-sm">
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-medium text-foreground">Manifest Report</h3>
            <button
              @click="manifestDownloader(shipment.uid)"
              class="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background bg-primary text-primary-foreground hover:bg-primary/90 h-9 w-9"
              aria-label="Download Manifest"
            >
              <FontAwesomeIcon class="h-4 w-4" icon="fa-download" />
            </button>
          </div>
        </div>
      </div>
      <div v-else class="rounded-md bg-destructive/10 p-4">
        <div class="flex">
          <div class="flex-shrink-0">
            <FontAwesomeIcon class="h-5 w-5 text-destructive" icon="fa-circle-exclamation" />
          </div>
          <div class="ml-3">
            <h3 class="text-sm font-medium text-destructive">No Manifest Available</h3>
            <div class="mt-2 text-sm text-destructive/90">
              This shipment has no Manifest Report
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
