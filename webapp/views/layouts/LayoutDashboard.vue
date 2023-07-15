<script setup lang="ts">
import { defineAsyncComponent } from "vue";
const SideBar = defineAsyncComponent(
  () => import("../components/nav/NavigationAside.vue")
)
const HeaderMain = defineAsyncComponent(
  () => import("../components/nav/NavigationMain.vue")
)
const Notification = defineAsyncComponent(
  () => import("../components/Notification.vue")
)
</script>


<template>
  <div class="h-screen bg-gray-100 font-roboto antialiased">
    <div class="flex flex-row">
      <div class="min-h-screen bg-sky-800">
        <side-bar />
      </div>
      <div class="flex-1">
        <header-main />
        <main class="px-8 pt-4 overflow-y-scroll overscroll-contain">
          <slot />
        </main>
      </div>
    </div>
    <div
      class="absolute top-3 left-[10%] px-2 flex justify-center content-center items-center bg-yellow-500 rounded animate-bounce">
      <div class="">!! Felicity Preview !!</div>
    </div>
  </div>
  <!-- <footer-main><slot /></footer-main> -->

  <notification />
</template>

