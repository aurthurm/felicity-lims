<script setup lang="ts">
</script>

<template>
  <div class="flex justify-end">
    <router-link to="/quality-control/charts" id="control-charts"
    class="border border-destructive text-destructive rounded-sm px-2 py-1 m-2 transition-colors duration-500 ease select-none hover:bg-destructive hover:text-primary-foreground focus:outline-none focus:shadow-outline">
      Go to Charts
    </router-link>
  </div>
  <router-view />
</template>
