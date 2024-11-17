<script setup lang="ts">
  import { defineAsyncComponent } from 'vue';
  const FelTabs = defineAsyncComponent(
    () => import("@/components/ui/tabs/FelTabs.vue")
  )

  const tabs = [
    {
      id: "laboratory",
      label: "laboratory",
      component: defineAsyncComponent(() => import("./Laboratory.vue")),
    },
    {
      id: "departments",
      label: "departments",
      component: defineAsyncComponent(() => import("./Departments.vue")),
    }
  ]
</script>

<template>
  <div class="mt-4">
    <FelTabs :tabs="tabs" initial-tab="laboratory" />
  </div>
</template>
