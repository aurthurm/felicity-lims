<template>
  <div class="h-screen bg-gray-100 font-roboto antialiased">
    <div class="flex flex-row">
      <div class="min-h-screen bg-sky-800">
        <side-bar />
      </div>
      <div class="flex-1">
        <header-main />
        <main class="p-8 overflow-y-scroll overscroll-contain">
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

<script setup lang="ts">
import SideBar from "../components/nav/NavigationAside.vue";
import HeaderMain from "../components/nav/NavigationMain.vue";
import Notification from "../components/Notification.vue";
</script>
