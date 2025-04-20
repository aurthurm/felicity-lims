<script setup lang="ts">
  import { useAnalysisStore } from '@/stores/analysis'

  useAnalysisStore()
  .fetchAnalysesServices({ 
    first: undefined, 
    after: "",
    text: "", 
    sortBy: ["name"]
  })

</script>

<template>
  <div class="space-y-6">
    <router-view />
  </div>
</template>

