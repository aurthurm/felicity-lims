<script setup lang="ts">
import { defineAsyncComponent } from "vue";
const HeaderMain = defineAsyncComponent(
  () => import("@/components/nav/NavigationMain.vue")
)
const FelNotification = defineAsyncComponent(
  () => import("@/components/notification/FelNotification.vue")
)
</script>

<template>
  <div class="font-roboto antialiased">
    <header-main />
    <main class="px-8 pt-4">
      <slot />
    </main>
  </div>
  <FelNotification />
</template>

