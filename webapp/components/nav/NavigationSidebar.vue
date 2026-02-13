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
@reference "@tw";

.router-link-active {
  @apply bg-primary/20 text-primary-foreground border-l-4 border-primary-foreground;
}

/* Icon stays fixed, text slides in/out from underneath */
.nav-icon {
  @apply shrink-0 flex items-center justify-center relative z-10;
  width: 2.5rem;
}

/* Single wrapper with explicit width for smooth transition (avoids jitter from multiple max-width) */
.sidebar-inner {
  width: 5rem;
  overflow: hidden;
  transition: width 0.35s cubic-bezier(0.32, 0.72, 0, 1);
}

.sidebar-inner.expanded {
  width: 17rem;
}

.nav-text-wrapper {
  overflow: hidden;
  min-width: 0;
}

.nav-text-wrapper.nav-text-visible {
  max-width: 12rem;
}

.nav-text-wrapper.nav-text-hidden {
  max-width: 0;
}

.nav-text-slide {
  display: inline-block;
  white-space: nowrap;
  padding-left: 1rem;
}

/* Open: text slides in from under icon */
.nav-text-wrapper.nav-text-visible .nav-text-slide {
  transform: translateX(0);
  transition: transform 0.35s cubic-bezier(0.32, 0.72, 0, 1);
}

/* Close: text slides under icon */
.nav-text-wrapper.nav-text-hidden .nav-text-slide {
  transform: translateX(-100%);
  transition: transform 0.35s cubic-bezier(0.32, 0.72, 0, 1);
}

/* Footer expand/collapse transition */
.footer-slide-enter-active {
  transition: all 0.25s cubic-bezier(0.32, 0.72, 0, 1);
}

.footer-slide-leave-active {
  transition: all 0.2s cubic-bezier(0.4, 0, 1, 1);
}

.footer-slide-enter-from,
.footer-slide-leave-to {
  opacity: 0;
  transform: translateY(6px);
}

.footer-slide-enter-to,
.footer-slide-leave-from {
  opacity: 1;
  transform: translateY(0);
}
</style>

<template>
  <div class="flex flex-col items-stretch h-full w-full overflow-hidden">
    <div :class="['sidebar-inner flex flex-col items-stretch h-full', { expanded: viewNavText }]">
    <div class="flex-none relative">
      <nav id="aside-nav" class="" role="navigation">

        <router-link v-show="guards.canAccessPage(guards.pages.DASHBOARD)" to="/dashboard" id="dashboard-link"
          class="flex items-center mt-1 p-2 pl-3 pr-4 text-primary-foreground hover:bg-primary/20 hover:text-primary-foreground border-l-4 border-primary">
          <span class="nav-icon"><font-awesome-icon icon="tachometer-alt" /></span>
          <span :class="['nav-text-wrapper', viewNavText ? 'nav-text-visible' : 'nav-text-hidden']">
            <span class="nav-text-slide">Dashboard</span>
          </span>
        </router-link>

        <router-link v-show="guards.canAccessPage(guards.pages.BILLING)" to="/billing" id="billing-link"
          class="flex items-center mt-1 p-2 pl-3 pr-4 text-primary-foreground hover:bg-primary/20 hover:text-primary-foreground border-l-4 border-primary">
          <span class="nav-icon"><font-awesome-icon icon="money-bill" /></span>
          <span :class="['nav-text-wrapper', viewNavText ? 'nav-text-visible' : 'nav-text-hidden']">
            <span class="nav-text-slide">Billing</span>
          </span>
        </router-link>
        
        <router-link v-show="guards.canAccessPage(guards.pages.PATIENTS_COMPACT)" to="/patients-compact"
          id="patients-compact-link"
          class="flex items-center mt-1 py-2 pl-3 pr-4 text-primary-foreground hover:bg-primary/20 hover:text-primary-foreground border-l-4 border-primary">
          <span class="nav-icon"><font-awesome-icon icon="bullseye" /></span>
          <span :class="['nav-text-wrapper', viewNavText ? 'nav-text-visible' : 'nav-text-hidden']">
            <span class="nav-text-slide">Compact</span>
          </span>
        </router-link>
        
        <router-link v-show="guards.canAccessPage(guards.pages.PATIENTS)" to="/patients" id="patients-link"
          class="flex items-center mt-1 py-2 pl-3 pr-4 text-primary-foreground hover:bg-primary/20 hover:text-primary-foreground border-l-4 border-primary">
          <span class="nav-icon"><font-awesome-icon icon="user-injured" /></span>
          <span :class="['nav-text-wrapper', viewNavText ? 'nav-text-visible' : 'nav-text-hidden']">
            <span class="nav-text-slide">Patients</span>
          </span>
        </router-link>
        
        <router-link v-show="guards.canAccessPage(guards.pages.CLIENTS)" to="/clients" id="clients-link"
          class="flex items-center mt-1 py-2 pl-3 pr-4 text-primary-foreground hover:bg-primary/20 hover:text-primary-foreground border-l-4 border-primary">
          <span class="nav-icon"><font-awesome-icon icon="clinic-medical" /></span>
          <span :class="['nav-text-wrapper', viewNavText ? 'nav-text-visible' : 'nav-text-hidden']">
            <span class="nav-text-slide">Clients</span>
          </span>
        </router-link>
        
        <router-link v-show="guards.canAccessPage(guards.pages.SAMPLES)" to="/samples" id="samples-link"
          class="flex items-center mt-1 py-2 pl-3 pr-4 text-primary-foreground hover:bg-primary/20 hover:text-primary-foreground border-l-4 border-primary">
          <span class="nav-icon"><font-awesome-icon icon="vial" /></span>
          <span :class="['nav-text-wrapper', viewNavText ? 'nav-text-visible' : 'nav-text-hidden']">
            <span class="nav-text-slide">Samples</span>
          </span>
        </router-link>
        
        <router-link v-show="guards.canAccessPage(guards.pages.WORKSHEETS)" to="/worksheets" id="worksheets-link"
          class="flex items-center mt-1 py-2 pl-3 pr-4 text-primary-foreground hover:bg-primary/20 hover:text-primary-foreground border-l-4 border-primary">
          <span class="nav-icon"><font-awesome-icon icon="grip-vertical" /></span>
          <span :class="['nav-text-wrapper', viewNavText ? 'nav-text-visible' : 'nav-text-hidden']">
            <span class="nav-text-slide">WorkSheets</span>
          </span>
        </router-link>
        
        <router-link
          v-show="guards.canAccessPage(guards.pages.QC_SAMPLES)"
          to="/quality-control"
          id="quality-control-link"
          class="flex items-center mt-1 py-2 pl-3 pr-4 text-primary-foreground hover:bg-primary/20 hover:text-primary-foreground border-l-4 border-primary"
        >
          <span class="nav-icon"><font-awesome-icon icon="anchor" /></span>
          <span :class="['nav-text-wrapper', viewNavText ? 'nav-text-visible' : 'nav-text-hidden']">
            <span class="nav-text-slide">QControl</span>
          </span>
        </router-link>
        
        <router-link v-show="guards.canAccessPage(guards.pages.NOTICE_MANAGER)" to="/notice-manager"
          id="notice-manager-link"
          class="flex items-center mt-1 py-2 pl-3 pr-4 text-primary-foreground hover:bg-primary/20 hover:text-primary-foreground border-l-4 border-primary">
          <span class="nav-icon"><font-awesome-icon icon="bell" /></span>
          <span :class="['nav-text-wrapper', viewNavText ? 'nav-text-visible' : 'nav-text-hidden']">
            <span class="nav-text-slide">NoticeManager</span>
          </span>
        </router-link>
        
        <router-link v-show="guards.canAccessPage(guards.pages.BIO_BANKING)" to="/bio-banking" id="bio-banking-link"
          class="flex items-center mt-1 py-2 pl-3 pr-4 text-primary-foreground hover:bg-primary/20 hover:text-primary-foreground border-l-4 border-primary">
          <span class="nav-icon"><font-awesome-icon icon="database" /></span>
          <span :class="['nav-text-wrapper', viewNavText ? 'nav-text-visible' : 'nav-text-hidden']">
            <span class="nav-text-slide">BioBanking</span>
          </span>
        </router-link>
        
        <router-link v-show="guards.canAccessPage(guards.pages.REFERRAL)" to="/shipments" id="shipments-link"
          class="flex items-center mt-1 py-2 pl-3 pr-4 text-primary-foreground hover:bg-primary/20 hover:text-primary-foreground border-l-4 border-primary">
          <span class="nav-icon"><font-awesome-icon icon="truck" /></span>
          <span :class="['nav-text-wrapper', viewNavText ? 'nav-text-visible' : 'nav-text-hidden']">
            <span class="nav-text-slide">Referrals</span>
          </span>
        </router-link>
        
        <router-link v-show="guards.canAccessPage(guards.pages.INVENTORY)" to="/inventory" id="inventory-link"
          class="flex items-center mt-1 py-2 pl-3 pr-4 text-primary-foreground hover:bg-primary/20 hover:text-primary-foreground border-l-4 border-primary">
          <span class="nav-icon"><font-awesome-icon icon="fa-solid fa-boxes-stacked" /></span>
          <span :class="['nav-text-wrapper', viewNavText ? 'nav-text-visible' : 'nav-text-hidden']">
            <span class="nav-text-slide">Inventory</span>
          </span>
        </router-link>
        
        <router-link v-show="guards.canAccessPage(guards.pages.SCHEMES)" to="/schemes" id="scheme-link"
          class="flex items-center mt-1 py-2 pl-3 pr-4 text-primary-foreground hover:bg-primary/20 hover:text-primary-foreground border-l-4 border-primary">
          <span class="nav-icon"><font-awesome-icon icon="project-diagram" /></span>
          <span :class="['nav-text-wrapper', viewNavText ? 'nav-text-visible' : 'nav-text-hidden']">
            <span class="nav-text-slide">Projects</span>
          </span>
        </router-link>
        
        <router-link v-show="guards.canAccessPage(guards.pages.DOCUMENT)" to="/documents" id="documents-link"
          class="flex items-center mt-1 py-2 pl-3 pr-4 text-primary-foreground hover:bg-primary/20 hover:text-primary-foreground border-l-4 border-primary">
          <span class="nav-icon"><font-awesome-icon icon="file" /></span>
          <span :class="['nav-text-wrapper', viewNavText ? 'nav-text-visible' : 'nav-text-hidden']">
            <span class="nav-text-slide">Documents</span>
          </span>
        </router-link>
      </nav>
      
      <!-- Floating Toggle Button -->
      <div class="mt-8 flex justify-center" style="margin-top: 30px;">
        <button 
          @click="toggleNavText()"
          class="text-primary-foreground hover:text-primary-foreground hover:bg-primary/20 p-2 rounded transition-all duration-300 ease-out"
          :title="viewNavText ? 'Collapse menu' : 'Expand menu'"
        >
          <font-awesome-icon :icon="viewNavText ? 'chevron-circle-left' : 'chevron-circle-right'" class="text-lg transition-transform duration-300 ease-out" />
        </button>
      </div>
    </div>
    <div class="grow"></div>
    <Transition name="footer-slide">
      <footer v-if="viewNavText" id="asideFooter" class="flex-none bg-primary/80 text-center text-primary-foreground p-4">
        <hr />
        <span>&copy; 2025 </span>|
        <router-link to="/about" class="text-primary-foreground/80"> About</router-link>
        <hr />
      </footer>
    </Transition>
    </div>
  </div>
</template>