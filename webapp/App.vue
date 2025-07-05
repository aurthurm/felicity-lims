<script setup lang="ts">
import {computed, onBeforeMount, onMounted, watch} from "vue";
import {useRouter} from "vue-router";
import axios from "@/composables/axios";
import {useStreamStore} from "@/stores/stream";
import {useAuthStore} from "@/stores/auth";
import userPreferenceComposable from "@/composables/preferences";

const {currentRoute, push} = useRouter();
const authStore = useAuthStore();
const streamStore = useStreamStore();
const {loadPreferredTheme} = userPreferenceComposable();

if (!authStore.auth.isAuthenticated) {
  push({name: "LOGIN"});
}

watch(
    () => authStore.auth.isAuthenticated,
    (newAuth) => {
      if (!newAuth) {
        push({name: "LOGIN"});
      } else {
        push({name: "DASHBOARD"});
      }
    }
);

onBeforeMount(() => {
  axios.get("setup/installation").then((resp) => {
    if (!resp.data.installed) {
      push({name: "INSTALLATION"});
    }
  });
});

onMounted(() => {
  loadPreferredTheme();
  streamStore.subscribeToActivityStream();
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
