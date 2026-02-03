<script setup lang="ts">
import { defineAsyncComponent, ref } from "vue";
import useShipmentComposable from "@/composables/shipment";
import { useShipmentStore } from "@/stores/shipment";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Spinner } from "@/components/ui/spinner";

defineOptions({ name: 'ManifestView' })
const loadongMeta = ref(false);

const { shipment } = useShipmentStore()
const { downloadManifest } = useShipmentComposable();
const manifestDownloader = async (report_uid) => await downloadManifest(report_uid);
</script>

<template>
  <div class="space-y-6">
    <span v-if="loadongMeta" class="inline-flex items-center gap-2">
      <Spinner class="size-4" />
      <span class="text-sm">Loading your manifest report ...</span>
    </span>
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
      <Alert v-else variant="destructive">
        <AlertTitle>No Manifest Available</AlertTitle>
        <AlertDescription>This shipment has no Manifest Report.</AlertDescription>
      </Alert>
    </section>
  </div>
</template>
