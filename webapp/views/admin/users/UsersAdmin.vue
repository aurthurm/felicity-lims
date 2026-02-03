<script setup lang="ts">
import TabsNav from "@/components/ui/tabs/TabsNav.vue";
  import { ref, computed, defineAsyncComponent } from 'vue';

  let currentTab = ref<string>('users');
  const tabs = [
    {
      id: "users",
      label: "users",
      component: defineAsyncComponent(() => import("./UsersListing.vue")),
    },
    {
      id: "groups",
      label: "groups",
      component: defineAsyncComponent(() => import("./Groups.vue")),
    },
    {
      id: "permissions",
      label: "permissions",
      component: defineAsyncComponent(() => import("./Permissions.vue")),
    }
  ];
</script>


<template>
  <TabsNav :tabs="tabs" />
</template>
