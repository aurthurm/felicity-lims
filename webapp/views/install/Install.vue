<script lang="ts" setup>
import {onBeforeMount, ref, watch} from "vue";
import axios from "@/composables/axios";
import { useRouter } from "vue-router";
import { useForm } from "vee-validate";
import {useAuthStore} from "@/stores/auth";
import { object, string } from "yup";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import {FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const authStore = useAuthStore();
const router = useRouter();
const loading = ref(false);

onBeforeMount(() => {
  if (authStore.auth.isAuthenticated) {
    router.push({name: "DASHBOARD"});
  } else {
    axios.get("setup/installation").then((resp) => {
      if (resp.data.installed) {
        router.push({ name: "LOGIN" });
      }
    });
  }
});

const installSchema = object({
  organisation_name: string().required("Organisation Name is Required"),
  laboratory_name: string().required("Laboratory Name is Required"),
});

const { handleSubmit } = useForm({
  validationSchema: installSchema,
  initialValues: {
    organisation_name: "Felicity Diagnostics",
    laboratory_name: "My First Laboratory",
  },
});

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
            fill="hsl(var(--primary))"
            stroke="hsl(var(--primary))"
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
        <FormField name="organisation_name" v-slot="{ componentField }">
          <FormItem>
            <FormLabel>Organisation Name</FormLabel>
            <FormControl>
              <Input v-bind="componentField" :disabled="loading" placeholder="Enter organisation name" />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>

        <FormField name="laboratory_name" v-slot="{ componentField }">
          <FormItem>
            <FormLabel>Laboratory Name</FormLabel>
            <FormControl>
              <Input v-bind="componentField" :disabled="loading" placeholder="Enter laboratory name" />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>

        <div class="pt-4">
          <Button v-if="!loading" type="submit" class="w-full">
            Install
          </Button>
          <div v-else class="text-center">
            <span class="inline-flex items-center gap-2">
              <Spinner class="size-4" />
              <span class="text-sm">Installing felicity lims ...</span>
            </span>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped></style>
