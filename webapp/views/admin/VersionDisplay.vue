<template>
  <div class="flex items-center gap-x-4 p-2 rounded-md">
    <!-- Current version -->
    <div class="flex items-center gap-x-2">
      <span class="font-medium">{{ currentVersion }}</span>
      
      <!-- Refresh button when no update -->
      <button 
        v-if="!updateInfo?.update_available"
        @click="getUpdates"
        class="p-1 text-muted-foreground hover:text-gray-700 focus:outline-none rounded-full"
      >
        <svg class="w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.3"/>
        </svg>
      </button>
    </div>

    <!-- Update available -->
    <template v-if="updateInfo?.update_available">
      <div class="flex items-center gap-x-2 text-primary animate-bounce">
        <span>{{ latestVersion }} available</span>
        <svg class="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10"/>
          <line x1="12" y1="16" x2="12" y2="12"/>
          <line x1="12" y1="8" x2="12" y2="8"/>
        </svg>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
  import { ref, onMounted } from 'vue'
  import useNotifyToast from "@/composables/alert_toast";
  import axios from "@/composables/axios";

  interface VersionInfo {
    current_version: string;
    latest_version: string;
    update_available: boolean;
    release_notes: string;
    release_url: string;
    last_checked: string;
  }

  type VersionResponse = {
    data: VersionInfo;
    error?: never;
  }
  
  const loading = ref(false)
  const currentVersion = ref("0.0.0")
  const updateInfo = ref<VersionInfo | null>(null)
  const error = ref<string | null>(null)
  
  const getCurrentVersion = async () => {
    loading.value = true
    axios
    .get("/version")
    .then(({ data: { version }} ) => {
      currentVersion.value = version
    })
    .catch((err) => {
      error.value = "Failed to get current version"
      console.error(err)
    })
    .finally(() => (loading.value = false));
  };

  const { toastInfo } = useNotifyToast();
  const getUpdates = async () => {
    loading.value = true
    axios
    .get("/version/updates")
    .then(({ data }: VersionResponse ) => {
      updateInfo.value = data
      if(data.update_available){
        toastInfo(`Update available: ${data.latest_version}`)
      } else {
        toastInfo("No updates available")
      }
    })
    .catch((err) => {
      error.value = "Failed to get current version"
      console.error(err)
    })
    .finally(() => (loading.value = false));
  };

  onMounted(() => {
    getCurrentVersion()
  })

</script>