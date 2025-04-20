<script setup lang="ts">
import { ref } from 'vue';

// This component displays Turn Around Time measures for the dashboard
const isLoading = ref(false);
</script>

<template>
  <div class="mt-4">
    <h1 class="text-xl text-foreground font-semibold">Turn Around Time Measures</h1>
    <hr class="my-2" />
    <div class="bg-background rounded-sm shadow-sm p-4">
      <div v-if="isLoading" class="text-center">
        <p class="text-muted-foreground">Loading TAT measures...</p>
      </div>
      <div v-else>
        <p class="text-muted-foreground">Turn Around Time measures coming soon...</p>
      </div>
    </div>
  </div>
</template>