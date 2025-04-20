<script setup lang="ts">
import { defineAsyncComponent, ref } from "vue";
import axios from "@/composables/axios";
import useApiUtils from "@/composables/api_util";
import useNotifyToast from "@/composables/alert_toast";

const{ addError } = useApiUtils()
const { toastSuccess, toastError } = useNotifyToast();
const loading = ref(false);

const loadDefault = (_) => {
  loading.value = true;

  axios.defaults.timeout = 1000 * 30;
  axios
    .post("setup/load-default-setup")
    .then(({ data: {success, message }} ) => {
      if(success){
        toastSuccess(message)
      } else {
        addError(message)
        toastError(message);
      }
    })
    .finally(() => (loading.value = false));

};


</script>

<template>
  <div class="space-y-6">
    <div class="rounded-lg border border-border bg-card p-6">
      <div class="space-y-4">
        <h2 class="text-2xl font-semibold text-foreground">Load Default Setup Data</h2>
        <p class="text-sm text-muted-foreground">Load analysis, services, profiles, sample types etc</p>
      </div>

      <div class="mt-6">
        <button
          v-if="!loading"
          type="button"
          @click.prevent="loadDefault"
          class="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-9 px-4 py-2"
        >
          Load Setup Data
        </button>
        <div v-else class="rounded-lg border border-border bg-card p-4">
          <fel-loader message="Loading default setup data ..." />
        </div>
      </div>
    </div>
  </div>
</template>
