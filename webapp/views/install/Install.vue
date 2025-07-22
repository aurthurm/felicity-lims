<script lang="ts" setup>
import { defineAsyncComponent, ref } from "vue";
import axios from "@/composables/axios";
import { useRouter } from "vue-router";
import { useField, useForm } from "vee-validate";
import { object, string } from "yup";

const router = useRouter();
const loading = ref(false);

const installSchema = object({
  organisation_name: string().required("Organisation Name is Required"),
  laboratory_name: string().required("Laboratory Name is Required"),
});

const { handleSubmit, errors } = useForm({
  validationSchema: installSchema,
  initialValues: {
    organisation_name: "Felicity Diagnostics",
    laboratory_name: "My First Laboratory",
  },
});

const { value: organisation_name } = useField("organisation_name");
const { value: laboratory_name } = useField("laboratory_name");

const initInstall = handleSubmit((values) => {
  loading.value = true;
  axios
    .post("setup/installation", values)
    .then((resp) => {
      if (resp.data.installed) {
        router.push({ name: "LOGIN" });
      }
    })
    .finally(() => (loading.value = false));
});
</script>

<template>
  <div class="flex justify-center items-center h-screen bg-primary px-6">
    <div class="p-6 max-w-sm w-full bg-background shadow-md rounded-md border border-border">
      <div class="flex justify-center items-center space-x-3">
        <svg
          class="h-10 w-10"
          viewBox="0 0 512 512"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M364.61 390.213C304.625 450.196 207.37 450.196 147.386 390.213C117.394 360.22 102.398 320.911 102.398 281.6C102.398 242.291 117.394 202.981 147.386 172.989C147.386 230.4 153.6 281.6 230.4 307.2C230.4 256 256 102.4 294.4 76.7999C320 128 334.618 142.997 364.608 172.989C394.601 202.981 409.597 242.291 409.597 281.6C409.597 320.911 394.601 360.22 364.61 390.213Z"
            fill="#4C51BF"
            stroke="#4C51BF"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M201.694 387.105C231.686 417.098 280.312 417.098 310.305 387.105C325.301 372.109 332.8 352.456 332.8 332.8C332.8 313.144 325.301 293.491 310.305 278.495C295.309 263.498 288 256 275.2 230.4C256 243.2 243.201 320 243.201 345.6C201.694 345.6 179.2 332.8 179.2 332.8C179.2 352.456 186.698 372.109 201.694 387.105Z"
            fill="white"
          />
        </svg>
        <span class="text-foreground font-semibold text-2xl">Install Felicity LIMS</span>
      </div>

      <form class="mt-6 space-y-4" @submit.prevent="initInstall">
        <div class="space-y-2">
          <label class="block text-sm font-medium text-foreground">Organisation Name</label>
          <input
            type="text"
            class="w-full px-3 py-2 text-foreground bg-background border border-border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-colors duration-200"
            v-model="organisation_name"
            :disabled="loading"
            placeholder="Enter organisation name"
          />
          <div v-if="errors.organisation_name" class="text-sm text-destructive">{{ errors.organisation_name }}</div>
        </div>

        <div class="space-y-2">
          <label class="block text-sm font-medium text-foreground">Laboratory Name</label>
          <input
            type="text"
            class="w-full px-3 py-2 text-foreground bg-background border border-border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-colors duration-200"
            v-model="laboratory_name"
            :disabled="loading"
            placeholder="Enter laboratory name"
          />
          <div v-if="errors.laboratory_name" class="text-sm text-destructive">{{ errors.laboratory_name }}</div>
        </div>

        <div class="pt-4">
          <button
            v-if="!loading"
            type="submit"
            class="w-full px-4 py-2 text-sm font-medium text-primary-foreground bg-primary border border-transparent rounded-md shadow-sm hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-colors duration-200"
          >
            Install
          </button>
          <div v-else class="text-center">
            <fel-loader message="Installing felicity lims ..." />
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
.space-y-4 > :not([hidden]) ~ :not([hidden]) {
  margin-top: 1rem;
}

.space-y-2 > :not([hidden]) ~ :not([hidden]) {
  margin-top: 0.5rem;
}
</style>
