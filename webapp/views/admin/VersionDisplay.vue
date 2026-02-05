<template>
  <div class="flex flex-col gap-y-3">
    <!-- Info rows -->
    <div class="flex flex-col gap-y-2 bg-background/50 px-4 py-2 rounded-lg border border-border/50">
      <div class="flex flex-wrap items-baseline gap-x-1.5 text-sm">
        <span class="font-medium text-muted-foreground">Current version:</span>
        <span class="text-foreground">v{{ currentVersion }}</span>
      </div>
      <div v-if="formattedVersionReleased" class="flex flex-wrap items-baseline gap-x-1.5 text-sm">
        <span class="font-medium text-muted-foreground">Version released:</span>
        <span class="text-foreground">{{ formattedVersionReleased }}</span>
      </div>
      <div class="flex flex-wrap items-baseline gap-x-1.5 text-sm">
        <span class="font-medium text-muted-foreground">Last checked:</span>
        <span class="text-foreground">{{ formattedLastChecked }}</span>
      </div>
    </div>

    <!-- Check for updates -->
    <div class="flex flex-col gap-2">
      <Button
        variant="outline"
        size="sm"
        class="w-full"
        :disabled="loading"
        @click="getUpdates"
      >
        <svg
          v-if="loading"
          class="mr-2 h-4 w-4 animate-spin"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
        <svg
          v-else
          class="mr-2 h-4 w-4"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          aria-hidden="true"
        >
          <path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.3" />
        </svg>
        {{ loading ? 'Checking…' : 'Check for updates' }}
      </Button>

      <!-- Update available badge -->
      <div v-if="updateInfo?.update_available" class="flex items-center gap-2 text-sm font-medium text-primary">
        <span>v{{ latestVersion }} available</span>
      </div>
    </div>

    <!-- Update details (release notes / link) -->
    <div v-if="updateInfo?.update_available" class="flex flex-col gap-2">
      <div class="flex items-center gap-2 flex-wrap">
        <a
          v-if="updateInfo.release_url"
          :href="updateInfo.release_url"
          target="_blank"
          rel="noopener"
          class="text-blue-600 hover:underline text-xs font-medium"
        >
          View Release on GitHub
        </a>
        <button
          type="button"
          @click="showNotes = !showNotes"
          class="text-xs text-primary underline focus:outline-none"
        >
          {{ showNotes ? 'Hide' : 'Show' }} Release Notes
        </button>
      </div>
      <transition name="fade">
        <div
          v-if="showNotes"
          class="bg-muted/30 border border-border/30 rounded p-3 max-h-96 overflow-auto whitespace-pre-wrap text-xs font-mono"
        >
          <span v-html="formattedReleaseNotes" />
        </div>
      </transition>
    </div>
    <div v-else-if="updateInfo && !updateInfo.update_available" class="text-xs text-muted-foreground">
      No updates available.
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, onMounted, computed } from 'vue'
  import useNotifyToast from "@/composables/alert_toast"
  import axios from "@/composables/axios"
  import { Button } from "@/components/ui/button"

  interface VersionInfo {
    current_version: string
    latest_version: string
    update_available: boolean
    release_notes: string
    release_url: string
    version_released?: string | null
    last_checked: string
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
    })
    .finally(() => (loading.value = false));
  };

  const latestVersion = computed(() => updateInfo.value?.latest_version || "-")
  const formattedLastChecked = computed(() => {
    if (!updateInfo.value?.last_checked) return "—"
    return new Date(updateInfo.value.last_checked).toLocaleString()
  })
  const formattedVersionReleased = computed(() => {
    if (!updateInfo.value?.version_released) return ""
    return new Date(updateInfo.value.version_released).toLocaleString()
  })
  // Format release notes: convert newlines to <br> and highlight sections
  const formattedReleaseNotes = computed(() => {
    if (!updateInfo.value?.release_notes) return '';
    // Convert markdown-like headers to bold
    let notes = updateInfo.value.release_notes
      .replace(/^(\s*[-*] .*)$/gm, '<span style="color:hsl(var(--primary));">$1</span>')
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
