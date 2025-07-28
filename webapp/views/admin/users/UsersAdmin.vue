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
      id: "enhanced-users",
      label: "enhanced users",
      component: defineAsyncComponent(() => import("./EnhancedUsersListing.vue")),
    },
    {
      id: "enhanced-registration",
      label: "enhanced registration",
      component: defineAsyncComponent(() => import("./EnhancedUserRegistration.vue")),
    },
    {
      id: "laboratory-users",
      label: "laboratory users",
      component: defineAsyncComponent(() => import("./LaboratoryUsersManagement.vue")),
    },
    {
      id: "enhanced-lab-users",
      label: "enhanced lab users",
      component: defineAsyncComponent(() => import("./EnhancedLaboratoryUsersManagement.vue")),
    },
    {
      id: "user-onboarding",
      label: "user onboarding",
      component: defineAsyncComponent(() => import("./UserOnboardingWorkflow.vue")),
    },
    {
      id: "lab-permissions",
      label: "lab permissions",
      component: defineAsyncComponent(() => import("./LaboratoryPermissionsManagement.vue")),
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
