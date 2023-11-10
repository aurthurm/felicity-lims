<script setup lang="ts">
  import { useAnalysisStore } from '../../../stores'

  useAnalysisStore()
  .fetchAnalysesServices({ 
    first: undefined, 
    after: "",
    text: "", 
    sortBy: ["name"]
  })

</script>

<template>

  <router-view />
  
</template>

