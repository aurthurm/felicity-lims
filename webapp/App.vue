<script setup lang="ts">
import { computed, onBeforeMount, onMounted, watch } from "vue";
import {useRouter} from "vue-router";
import axios from "@/composables/axios";
import {useStreamStore} from "@/stores/stream";
import {useAuthStore} from "@/stores/auth";
import userPreferenceComposable from "@/composables/preferences";
import { Toaster } from "@/components/ui/sonner";
import AppConfirmDialog from "@/components/common/AppConfirmDialog.vue";

const { currentRoute, push } = useRouter();
const authStore = useAuthStore();
const streamStore = useStreamStore();
const { loadPreferredTheme } = userPreferenceComposable();

watch(
  () => authStore.auth.isAuthenticated,
  (isAuthenticated) => {
    if (!isAuthenticated) {
      push({ name: "LOGIN" });
    } else {
      streamStore.subscribeToActivityStream();
      // Only redirect to dashboard if we are on login page
      if (currentRoute.value.name === "LOGIN") {
        push({ name: "DASHBOARD" });
      }
    }
  },
  { immediate: true }
);

onBeforeMount(() => {
  axios.get("setup/installation").then((resp) => {
    if (!resp.data.installed) {
      push({ name: "INSTALLATION" });
    }
  });
});

onMounted(() => {
  loadPreferredTheme();
});

if (
    window.performance
        .getEntriesByType("navigation")
        .map((nav: any) => nav.type)
        .includes("reload")
) {
  loadPreferredTheme();
}

const mobileLayout = "mobile";
const defaultLayout = "default";
const layout = computed(() => {
  const isMobile = (navigator as any)?.userAgentData?.mobile ?? false;
  return `${isMobile ? mobileLayout : (currentRoute.value.meta.layout || defaultLayout)}-layout`;
});
</script>

<template>
  <component :is="layout">
    <Toaster position="bottom-right" />
    <AppConfirmDialog />
    <router-view/>
  </component>
</template>
