<template>
  <div class="h-screen bg-gray-100 font-roboto antialiased">
    <div class="flex flex-row">
      <div class="min-h-screen bg-gray-700">
        <side-bar />
      </div>
      <div class="flex-1">
        <header-main />
        <main class="p-8 overflow-y-scroll overscroll-contain">
          <slot />
        </main>
      </div>
    </div>
  </div>
  <!-- <footer-main><slot /></footer-main> -->

  <notification />
</template>


<script setup lang="ts">
  import { defineComponent, ref } from 'vue';
  import SideBar from '../components/nav/NavigationAside.vue';
  import HeaderMain from '../components/nav/NavigationMain.vue';
  import FooterMain from '../components/FooterMain.vue';
  import Notification from '../components/Notification.vue';
</script>