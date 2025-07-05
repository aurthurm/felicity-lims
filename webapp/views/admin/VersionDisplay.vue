<template>
  <div class="flex flex-col gap-y-2 bg-background/50 px-4 py-2 rounded-lg border border-border/50">
    <div class="flex items-center gap-x-4">
      <!-- Current version -->
      <div class="flex items-center gap-x-2">
        <span class="text-sm font-medium text-foreground">v{{ currentVersion }}</span>
        <!-- Refresh button when no update -->
        <button 
          v-if="!updateInfo?.update_available"
          @click="getUpdates"
          class="p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          aria-label="Check for updates"
        >
          <svg class="w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.3"/>
          </svg>
        </button>
      </div>
      <!-- Update available -->
      <template v-if="updateInfo?.update_available">
        <div class="flex items-center gap-x-2 text-primary">
          <span class="text-sm font-medium">v{{ latestVersion }} available</span>
          <svg 
            class="w-4 h-4 animate-pulse" 
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            stroke-width="2" 
            stroke-linecap="round" 
            stroke-linejoin="round"
            aria-hidden="true"
          >
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="16" x2="12" y2="12"/>
            <line x1="12" y1="8" x2="12" y2="8"/>
          </svg>
        </div>
      </template>
      <span v-if="updateInfo?.last_checked" class="ml-auto text-xs text-muted-foreground">Last checked: {{ formattedLastChecked }}</span>
    </div>

    <!-- Update details -->
    <div v-if="updateInfo">
      <div v-if="updateInfo.update_available" class="flex flex-col gap-2 mt-2">
        <div class="flex items-center gap-2">
          <a v-if="updateInfo.release_url" :href="updateInfo.release_url" target="_blank" rel="noopener" class="text-blue-600 hover:underline text-xs font-medium">
            View Release on GitHub
          </a>
          <button @click="showNotes = !showNotes" class="text-xs text-primary underline focus:outline-none">
            {{ showNotes ? 'Hide' : 'Show' }} Release Notes
          </button>
        </div>
        <transition name="fade">
          <div v-if="showNotes" class="bg-muted/30 border border-border/30 rounded p-3 mt-1 max-h-96 overflow-auto whitespace-pre-wrap text-xs font-mono">
            <span v-html="formattedReleaseNotes"></span>
          </div>
        </transition>
      </div>
      <div v-else class="text-xs text-muted-foreground mt-2">
        <span>No updates available.</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, onMounted, computed } from 'vue'
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
  const showNotes = ref(false)

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

  const latestVersion = computed(() => updateInfo.value?.latest_version || "-")
  const formattedLastChecked = computed(() => {
    if (!updateInfo.value?.last_checked) return "-";
    const d = new Date(updateInfo.value.last_checked);
    return d.toLocaleString();
  })
  // Format release notes: convert newlines to <br> and highlight sections
  const formattedReleaseNotes = computed(() => {
    if (!updateInfo.value?.release_notes) return '';
    // Convert markdown-like headers to bold
    let notes = updateInfo.value.release_notes
      .replace(/^(\s*[-*] .*)$/gm, '<span style="color:#2563eb;">$1</span>')
      .replace(/^(\s*[A-Z][^:]+:)/gm, '<b>$1</b>')
      .replace(/\r?\n/g, '<br>');
    return notes;
  })

  onMounted(() => {
    getCurrentVersion()
    getUpdates()
  })
</script>

<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.2s;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>