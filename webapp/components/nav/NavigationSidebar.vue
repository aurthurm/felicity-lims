<script setup lang="ts">
import { ref, defineAsyncComponent } from "vue";

import * as guards from "@/guards";
const Logo = defineAsyncComponent(() => import("@/components/logo/Logo.vue"));

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

/* Enhanced smooth transitions */
.nav-text {
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  transform-origin: left center;
}

.nav-text-hidden {
  transform: scaleX(0);
  width: 0;
  overflow: hidden;
  opacity: 0;
}

.nav-text-visible {
  transform: scaleX(1);
  opacity: 1;
}
</style>

<template>
  <div class="mx-auto flex flex-col items-center h-full">
    <div class="flex-none relative">
      <nav id="aside-nav" class="" role="navigation">

        <router-link v-show="guards.canAccessPage(guards.pages.DASHBOARD)" to="/dashboard" id="dashboard-link"
          class="flex items-center has-tooltip mt-1 p-2 px-6 text-gray-100 hover:bg-gray-800 hover:bg-opacity-25 hover:text-white border-l-4 border-gray-800">
          <span class="mr-4"><font-awesome-icon icon="tachometer-alt" /></span>
          <span :class="['nav-text', viewNavText ? 'nav-text-visible' : 'nav-text-hidden']">Dashboard</span>
          <span v-show="!viewNavText" class="tooltip">Dashboard</span>
        </router-link>
        
        <router-link v-show="guards.canAccessPage(guards.pages.PATIENTS_COMPACT)" to="/patients-compact"
          id="patients-compact-link"
          class="flex items-center has-tooltip mt-1 py-2 px-6 text-gray-100 hover:bg-gray-800 hover:bg-opacity-25 hover:text-white border-l-4 border-gray-800">
          <span class="mr-4"><font-awesome-icon icon="bullseye" /></span>
          <span :class="['nav-text', viewNavText ? 'nav-text-visible' : 'nav-text-hidden']">Compact</span>
          <span v-show="!viewNavText" class="tooltip">Compact</span>
        </router-link>
        
        <router-link v-show="guards.canAccessPage(guards.pages.PATIENTS)" to="/patients" id="patients-link"
          class="flex items-center has-tooltip mt-1 py-2 px-6 text-gray-100 hover:bg-gray-800 hover:bg-opacity-25 hover:text-white border-l-4 border-gray-800">
          <span class="mr-4"><font-awesome-icon icon="user-injured" /></span>
          <span :class="['nav-text', viewNavText ? 'nav-text-visible' : 'nav-text-hidden']">Patients</span>
          <span v-show="!viewNavText" class="tooltip">Patients</span>
        </router-link>
        
        <router-link v-show="guards.canAccessPage(guards.pages.CLIENTS)" to="/clients" id="clients-link"
          class="flex items-center has-tooltip mt-1 py-2 px-6 text-gray-100 hover:bg-gray-800 hover:bg-opacity-25 hover:text-white border-l-4 border-gray-800">
          <span class="mr-4"><font-awesome-icon icon="clinic-medical" /></span>
          <span :class="['nav-text', viewNavText ? 'nav-text-visible' : 'nav-text-hidden']">Clients</span>
          <span v-show="!viewNavText" class="tooltip">Clients</span>
        </router-link>
        
        <router-link v-show="guards.canAccessPage(guards.pages.SAMPLES)" to="/samples" id="samples-link"
          class="flex items-center has-tooltip mt-1 py-2 px-6 text-gray-100 hover:bg-gray-800 hover:bg-opacity-25 hover:text-white border-l-4 border-gray-800">
          <span class="mr-4"><font-awesome-icon icon="vial" /></span>
          <span :class="['nav-text', viewNavText ? 'nav-text-visible' : 'nav-text-hidden']">Samples</span>
          <span v-show="!viewNavText" class="tooltip">Samples</span>
        </router-link>
        
        <router-link v-show="guards.canAccessPage(guards.pages.WORKSHEETS)" to="/worksheets" id="worksheets-link"
          class="flex items-center has-tooltip mt-1 py-2 px-6 text-gray-100 hover:bg-gray-800 hover:bg-opacity-25 hover:text-white border-l-4 border-gray-800">
          <span class="mr-4"><font-awesome-icon icon="grip-vertical" /></span>
          <span :class="['nav-text', viewNavText ? 'nav-text-visible' : 'nav-text-hidden']">WorkSheets</span>
          <span v-show="!viewNavText" class="tooltip">WorkSheets</span>
        </router-link>
        
        <router-link
          v-show="guards.canAccessPage(guards.pages.QC_SAMPLES)"
          to="/quality-control"
          id="quality-control-link"
          class="flex items-center has-tooltip mt-1 py-2 px-6 text-gray-100 hover:bg-gray-800 hover:bg-opacity-25 hover:text-white border-l-4 border-gray-800"
        >
          <span class="mr-4"><font-awesome-icon icon="anchor" /></span>
          <span :class="['nav-text', viewNavText ? 'nav-text-visible' : 'nav-text-hidden']">QControl</span>
          <span v-show="!viewNavText" class="tooltip">QControl</span>
        </router-link>
        
        <router-link v-show="guards.canAccessPage(guards.pages.NOTICE_MANAGER)" to="/notice-manager"
          id="notice-manager-link"
          class="flex items-center has-tooltip mt-1 py-2 px-6 text-gray-100 hover:bg-gray-800 hover:bg-opacity-25 hover:text-white border-l-4 border-gray-800">
          <span class="mr-4"><font-awesome-icon icon="bell" /></span>
          <span :class="['nav-text', viewNavText ? 'nav-text-visible' : 'nav-text-hidden']">NoticeManager</span>
          <span v-show="!viewNavText" class="tooltip">NoticeManager</span>
        </router-link>
        
        <router-link v-show="guards.canAccessPage(guards.pages.BIO_BANKING)" to="/bio-banking" id="bio-banking-link"
          class="flex items-center has-tooltip mt-1 py-2 px-6 text-gray-100 hover:bg-gray-800 hover:bg-opacity-25 hover:text-white border-l-4 border-gray-800">
          <span class="mr-4"><font-awesome-icon icon="database" /></span>
          <span :class="['nav-text', viewNavText ? 'nav-text-visible' : 'nav-text-hidden']">BioBanking</span>
          <span v-show="!viewNavText" class="tooltip">BioBanking</span>
        </router-link>
        
        <router-link v-show="guards.canAccessPage(guards.pages.REFERRAL)" to="/shipments" id="shipments-link"
          class="flex items-center has-tooltip mt-1 py-2 px-6 text-gray-100 hover:bg-gray-800 hover:bg-opacity-25 hover:text-white border-l-4 border-gray-800">
          <span class="mr-4"><font-awesome-icon icon="truck" /></span>
          <span :class="['nav-text', viewNavText ? 'nav-text-visible' : 'nav-text-hidden']">Referrals</span>
          <span v-show="!viewNavText" class="tooltip">Referrals</span>
        </router-link>
        
        <router-link v-show="guards.canAccessPage(guards.pages.INVENTORY)" to="/inventory" id="inventory-link"
          class="flex items-center has-tooltip mt-1 py-2 px-6 text-gray-100 hover:bg-gray-800 hover:bg-opacity-25 hover:text-white border-l-4 border-gray-800">
          <span class="mr-4"><font-awesome-icon icon="fa-solid fa-boxes-stacked" /></span>
          <span :class="['nav-text', viewNavText ? 'nav-text-visible' : 'nav-text-hidden']">Inventory</span>
          <span v-show="!viewNavText" class="tooltip">Inventory</span>
        </router-link>
        
        <router-link v-show="guards.canAccessPage(guards.pages.SCHEMES)" to="/schemes" id="scheme-link"
          class="flex items-center has-tooltip mt-1 py-2 px-6 text-gray-100 hover:bg-gray-800 hover:bg-opacity-25 hover:text-white border-l-4 border-gray-800">
          <span class="mr-4"><font-awesome-icon icon="project-diagram" /></span>
          <span :class="['nav-text', viewNavText ? 'nav-text-visible' : 'nav-text-hidden']">Projects</span>
          <span v-show="!viewNavText" class="tooltip">Projects</span>
        </router-link>
        
        <router-link v-show="guards.canAccessPage(guards.pages.DOCUMENT)" to="/documents" id="documents-link"
          class="flex items-center has-tooltip mt-1 py-2 px-6 text-gray-100 hover:bg-gray-800 hover:bg-opacity-25 hover:text-white border-l-4 border-gray-800">
          <span class="mr-4"><font-awesome-icon icon="file" /></span>
          <span :class="['nav-text', viewNavText ? 'nav-text-visible' : 'nav-text-hidden']">Documents</span>
          <span v-show="!viewNavText" class="tooltip">Documents</span>
        </router-link>
      </nav>
      
      <!-- Floating Toggle Button -->
      <div class="mt-8 flex justify-center" style="margin-top: 30px;">
        <button 
          @click="toggleNavText()"
          class="text-gray-100 hover:text-white hover:bg-gray-800 hover:bg-opacity-25 p-2 rounded transition-colors duration-200"
          :title="viewNavText ? 'Collapse menu' : 'Expand menu'"
        >
          <font-awesome-icon :icon="viewNavText ? 'chevron-circle-left' : 'chevron-circle-right'" class="text-lg" />
        </button>
      </div>
    </div>
    <div class="flex-grow"></div>
    <footer id="asideFooter" v-if="viewNavText" class="flex-none bg-gray-700 text-center text-gray-100 p-4">
      <hr />
      <span>&copy; 2025 </span>|
      <router-link to="/about" class="text-gray-200"> About</router-link>
      <hr />
    </footer>
  </div>
</template>