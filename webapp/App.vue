<script setup lang="ts">
import {computed, onMounted, watch} from "vue";
import {useRouter} from "vue-router";
import {useStreamStore} from "@/stores/stream";
import {useAuthStore} from "@/stores/auth";
import userPreferenceComposable from "@/composables/preferences";

const {currentRoute, push} = useRouter();
const authStore = useAuthStore();
const streamStore = useStreamStore();
const { loadPreferredTheme, fetchUserPreferencesFromServer } = userPreferenceComposable();

watch(
  () => authStore.auth.isAuthenticated,
  (isAuthenticated) => {
    if (!isAuthenticated) {
      push({ name: "LOGIN" });
    } else {
      streamStore.subscribeToActivityStream();
      // Fetch user preferences from server to sync mega menu, theme, etc.
      // (localStorage provides instant load on refresh; server is source of truth)
      fetchUserPreferencesFromServer();
      // Only redirect to dashboard if we are on login page
      if (currentRoute.value.name === "LOGIN") {
        push({ name: "DASHBOARD" });
      }
    }
  },
  { immediate: true }
);

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
    <notifications position="bottom right"/>
    <router-view/>
  </component>
</template>
