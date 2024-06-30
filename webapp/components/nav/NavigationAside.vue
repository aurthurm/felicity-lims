<script setup lang="ts">
import { ref } from "vue";

import * as guards from "@/guards";

let viewNavText = ref(false);

function toggleNavText(): void {
  viewNavText.value = !viewNavText.value;
}
</script>

<style scoped>
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

<template>
  <div class="mx-auto flex flex-col items-center h-full">
    <div class="flex-none relative">
      <div class="absolute -right-6 top-2 text-2xl cursor-pointer" @click="toggleNavText()">
        <font-awesome-icon icon="bars" />
      </div>
      <router-link to="/" id="brand" class="flex items-center md:w-auto pl-6 pt-2 pb-1 text-white">
        <font-awesome-icon icon="meteor" class="text-3xl" />
        <h1
          :class="['text-left text-2xl font-medium mx-2 transition-all duration-500', viewNavText ? 'scale-100' : 'scale-0 w-0 overflow-hidden']">
          Felicity</h1>
      </router-link>
      <nav id="aside-nav" class="" role="navigation">
        <router-link v-show="guards.canAccessPage(guards.pages.DASHBOARD)" to="/dashboard" id="dashboard-link"
          class="flex items-center has-tooltip mt-1 p-2 px-6 text-gray-100 hover:bg-gray-800 hover:bg-opacity-25 hover:text-white border-l-4 border-gray-800">
          <span class="mr-4"><font-awesome-icon icon="tachometer-alt" /></span>
          <span
            :class="[' transition-all duration-500', viewNavText ? 'scale-100' : 'scale-0 w-0 overflow-hidden']">Dashboard</span>
          <span v-show="!viewNavText" class="tooltip">Dashboard</span>
        </router-link>
        <router-link v-show="guards.canAccessPage(guards.pages.PATIENTS_COMPACT)" to="/patients-compact"
          id="patients-compact-link"
          class="flex items-center has-tooltip mt-1 py-2 px-6 text-gray-100 hover:bg-gray-800 hover:bg-opacity-25 hover:text-white border-l-4 border-gray-800">
          <span class="mr-4"><font-awesome-icon icon="bullseye" /></span>
          <span
            :class="[' transition-all duration-500', viewNavText ? 'scale-100' : 'scale-0 w-0 overflow-hidden']">Compact</span>
          <span v-show="!viewNavText" class="tooltip">Compact</span>
        </router-link>
        <router-link v-show="guards.canAccessPage(guards.pages.PATIENTS)" to="/patients" id="patients-link"
          class="flex items-center has-tooltip mt-1 py-2 px-6 text-gray-100 hover:bg-gray-800 hover:bg-opacity-25 hover:text-white border-l-4 border-gray-800">
          <span class="mr-4"><font-awesome-icon icon="user-injured" /></span>
          <span
            :class="[' transition-all duration-500', viewNavText ? 'scale-100' : 'scale-0 w-0 overflow-hidden']">Patients</span>
        <span v-show="!viewNavText" class="tooltip">Patients</span>
      </router-link>
      <router-link v-show="guards.canAccessPage(guards.pages.CLIENTS)" to="/clients" id="clients-link"
        class="flex items-center has-tooltip mt-1 py-2 px-6 text-gray-100 hover:bg-gray-800 hover:bg-opacity-25 hover:text-white border-l-4 border-gray-800">
        <span class="mr-4"><font-awesome-icon icon="clinic-medical" /></span>
        <span
          :class="[' transition-all duration-500', viewNavText ? 'scale-100' : 'scale-0 w-0 overflow-hidden']">Clients</span>
        <span v-show="!viewNavText" class="tooltip">Clients</span>
      </router-link>
        <router-link v-show="guards.canAccessPage(guards.pages.SAMPLES)" to="/samples" id="samples-link"
          class="flex items-center has-tooltip mt-1 py-2 px-6 text-gray-100 hover:bg-gray-800 hover:bg-opacity-25 hover:text-white border-l-4 border-gray-800">
          <span class="mr-4"><font-awesome-icon icon="vial" /></span>
          <span
            :class="[' transition-all duration-500', viewNavText ? 'scale-100' : 'scale-0 w-0 overflow-hidden']">Samples</span>
          <span v-show="!viewNavText" class="tooltip">Samples</span>
        </router-link>
        <router-link v-show="guards.canAccessPage(guards.pages.WORKSHEETS)" to="/worksheets" id="worksheets-link"
          class="flex items-center has-tooltip mt-1 py-2 px-6 text-gray-100 hover:bg-gray-800 hover:bg-opacity-25 hover:text-white border-l-4 border-gray-800">
          <span class="mr-4"><font-awesome-icon icon="grip-vertical" /></span>
          <span
            :class="[' transition-all duration-500', viewNavText ? 'scale-100' : 'scale-0 w-0 overflow-hidden']">WorkSheets</span>
          <span v-show="!viewNavText" class="tooltip">WorkSheets</span>
        </router-link>
        <router-link
          v-show="guards.canAccessPage(guards.pages.QC_SAMPLES)"
          to="/quality-control"
          id="quality-control-link"
          class="flex items-center has-tooltip mt-1 py-2 px-6 text-gray-100 hover:bg-gray-800 hover:bg-opacity-25 hover:text-white border-l-4 border-gray-800"
        >
          <span class="mr-4"><font-awesome-icon icon="anchor" /></span>
          <span :class="[' transition-all duration-500', viewNavText ? 'scale-100' : 'scale-0 w-0 overflow-hidden']">QControl</span>
          <span v-show="!viewNavText" class="tooltip">QControl</span>
        </router-link>
        <router-link v-show="guards.canAccessPage(guards.pages.NOTICE_MANAGER)" to="/notice-manager"
          id="notice-manager-link"
          class="flex items-center has-tooltip mt-1 py-2 px-6 text-gray-100 hover:bg-gray-800 hover:bg-opacity-25 hover:text-white border-l-4 border-gray-800">
          <span class="mr-4"><font-awesome-icon icon="bell" /></span>
          <span
            :class="[' transition-all duration-500', viewNavText ? 'scale-100' : 'scale-0 w-0 overflow-hidden']">NoticeManager</span>
          <span v-show="!viewNavText" class="tooltip">NoticeManager</span>
        </router-link>
        <router-link v-show="guards.canAccessPage(guards.pages.BIO_BANKING)" to="/bio-banking" id="bio-banking-link"
          class="flex items-center has-tooltip mt-1 py-2 px-6 text-gray-100 hover:bg-gray-800 hover:bg-opacity-25 hover:text-white border-l-4 border-gray-800">
          <span class="mr-4"><font-awesome-icon icon="database" /></span>
          <span
            :class="[' transition-all duration-500', viewNavText ? 'scale-100' : 'scale-0 w-0 overflow-hidden']">BioBanking</span>
          <span v-show="!viewNavText" class="tooltip">BioBanking</span>
        </router-link>
        <router-link v-show="guards.canAccessPage(guards.pages.REFERRAL)" to="/shipments" id="shipments-link"
          class="flex items-center has-tooltip mt-1 py-2 px-6 text-gray-100 hover:bg-gray-800 hover:bg-opacity-25 hover:text-white border-l-4 border-gray-800">
          <span class="mr-4"><font-awesome-icon icon="truck" /></span>
          <span
            :class="[' transition-all duration-500', viewNavText ? 'scale-100' : 'scale-0 w-0 overflow-hidden']">Referrals</span>
          <span v-show="!viewNavText" class="tooltip">Referrals</span>
        </router-link>
        <router-link v-show="guards.canAccessPage(guards.pages.INVENTORY)" to="/inventory" id="inventory-link"
          class="flex items-center has-tooltip mt-1 py-2 px-6 text-gray-100 hover:bg-gray-800 hover:bg-opacity-25 hover:text-white border-l-4 border-gray-800">
          <span class="mr-4"><font-awesome-icon icon="fa-solid fa-boxes-stacked" /></span>
          <span
            :class="[' transition-all duration-500', viewNavText ? 'scale-100' : 'scale-0 w-0 overflow-hidden']">Inventory</span>
          <span v-show="!viewNavText" class="tooltip">Inventory</span>
        </router-link>
      </nav>
    </div>
    <div class="flex-grow"></div>
    <footer id="asideFooter" v-if="viewNavText" class="flex-none bg-gray-700 text-center text-gray-100 p-4">
      <hr />
      <span>&copy; 2023 </span>|
      <router-link to="/about" class="text-gray-200"> About</router-link>
      <hr />
    </footer>
  </div>
</template>
