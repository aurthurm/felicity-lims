<script setup lang="ts">
import { defineAsyncComponent, ref } from "vue";
import axios from "@/composables/axios";
import useApiUtils from "@/composables/api_util";
import useNotifyToast from "@/composables/alert_toast";

const LoadingMessage = defineAsyncComponent(
  () => import("@/components/ui/spinners/FelLoadingMessage.vue")
)

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
  <div class="mt-4">
    <div class="mt-2">
      <h2 class="h2 mb-4">Load Default Setup Data</h2>
      <hr />
      <p>Load analysis, services, profiles, sample types etc</p>
    </div>

    <button
      v-if="!loading"
      type="button"
      @click.prevent="loadDefault"
      class="mt-4 px-2 py-1 border border-primary bg-primary text-white rounded-sm transition-colors duration-500 ease select-none hover:bg-primary focus:outline-none focus:shadow-outline"
    >
      load setup data
    </button>
    <div v-else class="mt-4">
      <LoadingMessage message="Loading default setup data ..." />
    </div>
  </div>
</template>
