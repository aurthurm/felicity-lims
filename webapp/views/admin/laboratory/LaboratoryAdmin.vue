<script setup lang="ts">
  import { defineAsyncComponent } from 'vue';
  const TabsNav = defineAsyncComponent(
    () => import("@/components/ui/tabs/TabsNav.vue")
  )

  const tabs = [
    {
      id: "laboratory",
      label: "current laboratory",
      component: defineAsyncComponent(() => import("./Laboratory.vue")),
    },
    {
      id: "laboratory-management",
      label: "laboratory management", 
      component: defineAsyncComponent(() => import("./LaboratoryListing.vue")),
    },
    {
      id: "organisation-management",
      label: "organisation", 
      component: defineAsyncComponent(() => import("./Organisation.vue")),
    },
    {
      id: "departments",
      label: "departments",
      component: defineAsyncComponent(() => import("./Departments.vue")),
    }
  ]
</script>

<template>
  <div class="space-y-6">
    <TabsNav :tabs="tabs" initial-tab="laboratory" />
  </div>
</template>
