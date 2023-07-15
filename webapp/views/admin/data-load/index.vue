<script setup lang="ts">
import { defineAsyncComponent, ref } from "vue";
import axios from "../../../axios/no-auth";
import { useNotifyToast } from "../../../composables";
const LoadingMessage = defineAsyncComponent(
  () => import("../../../components/Spinners/LoadingMessage.vue")
)

const { toastSuccess } = useNotifyToast();
const loading = ref(false);

const loadDefault = (_) => {
  loading.value = true;

  axios.defaults.timeout = 1000 * 30;
  axios
    .post("setup/load-default-setup")
    .then((resp) => toastSuccess(resp.data.message))
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
      class="mt-4 px-2 py-1 border border-sky-800 bg-sky-800 text-white rounded-sm transition-colors duration-500 ease select-none hover:bg-sky-800 focus:outline-none focus:shadow-outline"
    >
      load setup data
    </button>
    <div v-else class="mt-4">
      <LoadingMessage message="Loading default setup data ..." />
    </div>
  </div>
</template>
