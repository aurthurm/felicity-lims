<template>
    <div class="p-4 rounded-lg">
      <div v-if="versionInfo" class="space-y-4">
        <div :class="['flex items-center gap-4', { 'text-blue-600': versionInfo.update_available }]">
          <span class="font-medium">Current version: {{ versionInfo.current_version }}</span>
          <span v-if="versionInfo.update_available" class="space-x-2">
            <span>New version available: {{ versionInfo.latest_version }}</span>
            <a 
              :href="versionInfo.release_url" 
              target="_blank"
              class="text-blue-500 hover:text-blue-700 underline"
            >
              View Release
            </a>
          </span>
        </div>
        <div 
          v-if="versionInfo.update_available && versionInfo.release_notes" 
          class="mt-4 p-4 bg-gray-50 rounded-lg"
        >
          <h4 class="font-semibold mb-2">Release Notes:</h4>
          <p class="whitespace-pre-line text-gray-700">{{ versionInfo.release_notes }}</p>
        </div>
      </div>
      <div v-if="error" class="text-red-600">
        {{ error }}
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted, onBeforeUnmount } from 'vue'
  import axios from 'axios'
  
  const versionInfo = ref(null)
  const error = ref(null)
  const checkInterval = ref(null)
  
  const checkVersion = async () => {
    try {
      const { data } = await axios.get('/api/check-updates')
      versionInfo.value = data
      error.value = null
    } catch (err) {
      error.value = 'Failed to check for updates'
      console.error(err)
    }
  }
  
  onMounted(() => {
    checkVersion()
    checkInterval.value = setInterval(checkVersion, 3600000) // Check every hour
  })
  
  onBeforeUnmount(() => {
    if (checkInterval.value) {
      clearInterval(checkInterval.value)
    }
  })
  </script>