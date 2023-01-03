<template>
  <div class="mx-auto flex flex-col items-center h-full">
    <div class="flex-none relative">
      <div
        class="absolute -right-6 top-14 text-2xl cursor-pointer"
        @click="toggleNavText()"
      >
        <font-awesome-icon icon="bars" />
      </div>
      <router-link
        to="/"
        id="brand"
        class="flex items-center md:w-auto pl-6 pt-2 pb-1 text-white"
      >
        <font-awesome-icon icon="meteor" class="text-3xl" />
        <h1 v-if="viewNavText" class="text-left text-2xl font-medium mx-2">Felicity</h1>
      </router-link>
      <nav id="aside-nav" class="" role="navigation">
        <router-link
          v-show="guards.canAccessPage(guards.pages.DASHBOARD)"
          to="/dashboard"
          id="dashboard-link"
          class="flex items-center has-tooltip mt-1 p-2 px-6 text-gray-100 hover:bg-gray-800 hover:bg-opacity-25 hover:text-white border-l-4 border-gray-800"
        >
          <span class="mr-4"><font-awesome-icon icon="tachometer-alt" /></span>
          <span v-if="viewNavText">Dashboard</span>
          <span v-else class="tooltip">Dashboard</span>
        </router-link>
        <router-link
          v-show="guards.canAccessPage(guards.pages.PATIENTS_COMPACT)"
          to="/patients-compact"
          id="patients-compact-link"
          class="flex items-center has-tooltip mt-1 py-2 px-6 text-gray-100 hover:bg-gray-800 hover:bg-opacity-25 hover:text-white border-l-4 border-gray-800"
        >
          <span class="mr-4"><font-awesome-icon icon="bullseye" /></span>
          <span v-if="viewNavText">Compact</span>
          <span v-else class="tooltip">Compact</span>
        </router-link>
        <router-link
          v-show="guards.canAccessPage(guards.pages.PATIENTS)"
          to="/patients"
          id="patients-link"
          class="flex items-center has-tooltip mt-1 py-2 px-6 text-gray-100 hover:bg-gray-800 hover:bg-opacity-25 hover:text-white border-l-4 border-gray-800"
        >
          <span class="mr-4"><font-awesome-icon icon="user-injured" /></span>
          <span v-if="viewNavText">Patients</span>
          <span v-else class="tooltip">Patients</span>
        </router-link>
        <router-link
          v-show="guards.canAccessPage(guards.pages.CLIENTS)"
          to="/clients"
          id="clients-link"
          class="flex items-center has-tooltip mt-1 py-2 px-6 text-gray-100 hover:bg-gray-800 hover:bg-opacity-25 hover:text-white border-l-4 border-gray-800"
        >
          <span class="mr-4"><font-awesome-icon icon="clinic-medical" /></span>
          <span v-if="viewNavText">Clients</span>
          <span v-else class="tooltip">Clients</span>
        </router-link>
        <router-link
          v-show="guards.canAccessPage(guards.pages.SAMPLES)"
          to="/samples"
          id="samples-link"
          class="flex items-center has-tooltip mt-1 py-2 px-6 text-gray-100 hover:bg-gray-800 hover:bg-opacity-25 hover:text-white border-l-4 border-gray-800"
        >
          <span class="mr-4"><font-awesome-icon icon="vial" /></span>
          <span v-if="viewNavText">Samples</span>
          <span v-else class="tooltip">Samples</span>
        </router-link>
        <router-link
          v-show="guards.canAccessPage(guards.pages.WORKSHEETS)"
          to="/worksheets"
          id="worksheets-link"
          class="flex items-center has-tooltip mt-1 py-2 px-6 text-gray-100 hover:bg-gray-800 hover:bg-opacity-25 hover:text-white border-l-4 border-gray-800"
        >
          <span class="mr-4"><font-awesome-icon icon="grip-vertical" /></span>
          <span v-if="viewNavText">WorkSheets</span>
          <span v-else class="tooltip">WorkSheets</span>
        </router-link>
        <!-- <router-link
          v-show="guards.canAccessPage(guards.pages.QC_SAMPLES)"
          to="/quality-control"
          id="markdown-link"
          class="flex items-center has-tooltip mt-1 py-2 px-6 text-gray-100 hover:bg-gray-800 hover:bg-opacity-25 hover:text-white border-l-4 border-gray-800"
        >
          <span class="mr-4"><font-awesome-icon icon="anchor" /></span>
          <span v-if="viewNavText">QControl</span>
          <span v-else class="tooltip">QControl</span>
        </router-link> -->
        <router-link
          v-show="guards.canAccessPage(guards.pages.NOTICE_MANAGER)"
          to="/notice-manager"
          id="markdown-link"
          class="flex items-center has-tooltip mt-1 py-2 px-6 text-gray-100 hover:bg-gray-800 hover:bg-opacity-25 hover:text-white border-l-4 border-gray-800"
        >
          <span class="mr-4"><font-awesome-icon icon="bell" /></span>
          <span v-if="viewNavText">NoticeManager</span>
          <span v-else class="tooltip">NoticeManager</span>
        </router-link>
      </nav>
    </div>
    <div class="flex-grow"></div>
    <footer
      id="asideFooter"
      v-if="viewNavText"
      class="flex-none bg-gray-700 text-center text-gray-100 p-4"
    >
      <hr />
      <span>&copy; 2020 </span>|
      <router-link to="/about" class="text-gray-200"> About</router-link>
      <hr />
    </footer>
  </div>
</template>

<style scoped>
/* #asideFooter {
    position:fixed;
    margin: 0 auto;
    width: 100%;
    bottom: 0;
} */

.router-link-active {
  @apply bg-gray-800 bg-opacity-25 text-gray-100 border-l-4 border-gray-100;
}

.tooltip {
  @apply invisible absolute;
}

.has-tooltip:hover .tooltip {
  @apply visible z-50 mt-10 left-16 bg-gray-800 text-gray-200 p-1 rounded;
}
</style>

<script setup lang="ts">
import { ref } from "vue";

import * as guards from "./../../../guards";

let viewNavText = ref(false);

function toggleNavText(): void {
  viewNavText.value = !viewNavText.value;
}
</script>
