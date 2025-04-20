<script setup lang="ts">
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
  <fel-tabs :tabs="tabs" />
</template>
