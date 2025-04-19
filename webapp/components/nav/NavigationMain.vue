<script setup lang="ts">
import { watch, ref, onMounted, computed, defineAsyncComponent } from "vue";
import { useNotificationStore } from "@/stores/notification";
import { useAuthStore } from "@/stores/auth";
import { useRouter } from "vue-router";
import useApiUtil from "@/composables/api_util";
import userPreferenceComposable from "@/composables/preferences";
import * as guards from "@/guards";

// Lazily load components for better performance
const Logo = defineAsyncComponent(() => import("@/components/logo/Logo.vue"));
const Drawer = defineAsyncComponent(() => import("@/components/ui/FelDrawer.vue"));

// Router and navigation
const router = useRouter();
const menuOpen = ref(false);
const dropdownOpen = ref(false);

// Close menu when route changes
watch(() => router.currentRoute.value, (current, previous) => {
  if (current.path !== previous?.path) {
    menuOpen.value = false;
    dropdownOpen.value = false;
  }
});

// Auth and user information
const authStore = useAuthStore();
const userFullName = computed(() => {
  const firstName = authStore.auth?.user?.firstName || '';
  const lastName = authStore.auth?.user?.lastName || '';
  return `${firstName} ${lastName}`.trim();
});

// Error handling
const { errors, clearErrors } = useApiUtil();
const showErrors = ref(false);

// Notifications management
const notificationStore = useNotificationStore();
const toggleNotifications = (value: boolean) => notificationStore.showNotifications(value);

// Theme management
const { loadPreferedTheme } = userPreferenceComposable();
onMounted(() => {
  loadPreferedTheme();
});

// Navigation items for more maintainable structure
const navItems = computed(() => [
  {
    id: "patients-compact",
    label: "Compact",
    icon: "bullseye",
    route: "/patients-compact",
    guard: guards.pages.PATIENTS_COMPACT
  },
  {
    id: "patients",
    label: "Patients",
    icon: "user-injured",
    route: "/patients",
    guard: guards.pages.PATIENTS
  },
  {
    id: "clients",
    label: "Clients",
    icon: "clinic-medical",
    route: "/clients",
    guard: guards.pages.CLIENTS
  },
  {
    id: "samples",
    label: "Samples",
    icon: "vial",
    route: "/samples",
    guard: guards.pages.SAMPLES
  },
  {
    id: "worksheets",
    label: "WorkSheets",
    icon: "grip-vertical",
    route: "/worksheets",
    guard: guards.pages.WORKSHEETS
  },
  {
    id: "quality-control",
    label: "QControl",
    icon: "anchor",
    route: "/quality-control",
    guard: guards.pages.QC_SAMPLES
  },
  {
    id: "notice-manager",
    label: "NoticeManager",
    icon: "bell",
    route: "/notice-manager",
    guard: guards.pages.NOTICE_MANAGER
  },
  {
    id: "bio-banking",
    label: "BioBanking",
    icon: "database",
    route: "/bio-banking",
    guard: guards.pages.BIO_BANKING
  },
  {
    id: "shipments",
    label: "Referrals",
    icon: "truck",
    route: "/shipments",
    guard: guards.pages.REFERRAL
  },
  {
    id: "inventory",
    label: "Inventory",
    icon: "fa-solid fa-boxes-stacked",
    route: "/inventory",
    guard: guards.pages.INVENTORY
  },
  {
    id: "schemes",
    label: "Projects",
    icon: "project-diagram",
    route: "/schemes",
    guard: guards.pages.SCHEMES
  },
  {
    id: "documents",
    label: "Documents",
    icon: "file",
    route: "/documents",
    guard: guards.pages.DOCUMENT
  }
]);

const closeMenus = () => {
  menuOpen.value = false;
  dropdownOpen.value = false;
};

// Handle escape key to close menus
const handleKeyDown = (event: KeyboardEvent) => {
  if (event.key === 'Escape') {
    closeMenus();
  }
};

onMounted(() => {
  document.addEventListener('keydown', handleKeyDown);
});
</script>

<template>
  <nav id="main-nav" class="flex items-center px-6 bg-sky-800 shadow-md" role="navigation" aria-label="Main Navigation">
    <!-- Brand and menu section -->
    <div class="flex-1">
      <div class="flex text-right align-middle">
        <!-- Logo and brand name -->
        <router-link to="/" id="brand" class="flex items-center md:w-auto text-white" aria-label="Felicity LIMS Home">
          <Logo />
          <h1 class="text-left text-2xl font-medium mx-2 transition-all duration-500">Felicity LIMS</h1>
        </router-link>

        <span class="mx-8 border-l-2 border-gray-400 my-2" aria-hidden="true"></span>
        
        <!-- Main menu dropdown trigger -->
        <button 
          @click="menuOpen = !menuOpen" 
          class="hidden md:flex md:items-center focus:outline-none rounded p-1"
          :aria-expanded="menuOpen"
          aria-controls="main-menu"
        >
          <span class="text-gray-50 text-xl font-bold mr-2 uppercase">Menu</span>
          <font-awesome-icon 
            :icon="menuOpen ? 'chevron-up' : 'chevron-down'" 
            class="text-gray-400 transition-transform" 
            aria-hidden="true" 
          />
        </button>

        <!-- Main menu dropdown content -->
        <div 
          v-show="menuOpen" 
          id="main-menu"
          class="absolute left-64 top-12 mt-1 p-4 w-1/2 bg-sky-800 rounded-sm shadow-xl z-20"
          @click.away="menuOpen = false"
        >
          <div 
            class="grid grid-cols-3 gap-4" 
            role="menu" 
            aria-label="Main Menu"
          >
            <router-link 
              v-for="item in navItems" 
              :key="item.id"
              v-show="guards.canAccessPage(item.guard)" 
              :to="item.route" 
              :id="`${item.id}-link`"
              class="flex items-center mt-1 py-2 px-6 text-gray-100 hover:bg-gray-800 hover:bg-opacity-25 hover:text-white rounded transition-colors focus:outline-none"
              role="menuitem"
              @click="menuOpen = false"
            >
              <span class="mr-4" aria-hidden="true">
                <font-awesome-icon :icon="item.icon" />
              </span>
              <span class="text-xl font-bold uppercase">{{ item.label }}</span>
            </router-link>
          </div>
        </div>
      </div>
    </div>

    <!-- User section and actions -->
    <div class="flex items-center">
      <!-- Errors button -->
      <button
        v-if="errors.length > 0"
        class="no-underline text-gray-100 opacity-50 flex items-center px-4 border-b border-transparent hover:opacity-100 hover:border-grey-dark transition-opacity focus:outline-none rounded"
        @click="showErrors = true"
        aria-label="Show errors"
      >
        <font-awesome-icon icon="bell" class="mr-2" aria-hidden="true" />
        <span class="text-gray-50 text-xl font-bold mr-2 uppercase">Errors</span>
        <span class="bg-red-500 text-white text-xs rounded-full px-2 py-1">{{ errors.length }}</span>
      </button>
      
      <span v-if="errors.length > 0" class="mx-4 border-l-2 border-gray-400" aria-hidden="true"></span>

      <!-- Notifications button -->
      <button
        class="no-underline text-gray-100 opacity-50 flex items-center px-4 border-b border-transparent hover:opacity-100 hover:border-grey-dark transition-opacity focus:outline-none rounded"
        @click="toggleNotifications(true)"
        aria-label="Show notifications"
      >
        <font-awesome-icon icon="bell" class="mr-2" aria-hidden="true" />
        <span class="text-gray-50 text-xl font-bold mr-2 uppercase">Notifications</span>
      </button>
      
      <span class="mx-4 border-l-2 border-gray-400" aria-hidden="true"></span>

      <!-- Admin settings link -->
      <router-link 
        v-show="guards.canAccessPage(guards.pages.ADMINISTRATION)" 
        to="/admin"
        class="no-underline text-gray-100 opacity-50 flex items-center px-4 border-b border-transparent hover:opacity-100 hover:border-grey-dark transition-opacity focus:outline-none rounded"
        aria-label="Settings"
      >
        <font-awesome-icon icon="cog" class="mr-2" aria-hidden="true" />
        <span class="text-gray-50 text-xl font-bold mr-2 uppercase">Settings</span>
      </router-link>
      
      <span class="mx-4 border-l-2 border-gray-400" aria-hidden="true"></span>

      <!-- User profile section -->
      <div class="px-4 flex text-right align-middle relative">
        <span
          class="flex justify-center items-center h-8 w-8 rounded-full border-2 border-gray-400 hover:border-gray-300 text-white"
          aria-hidden="true"
        >
          <font-awesome-icon icon="user" />
        </span>
        
        <!-- User menu dropdown -->
        <div class="relative">
          <button 
            @click="dropdownOpen = !dropdownOpen" 
            class="hidden md:flex md:items-center ml-2 focus:outline-none rounded p-1"
            :aria-expanded="dropdownOpen"
            aria-controls="user-menu"
          >
            <span class="text-gray-50 text-xl font-bold mr-2 uppercase">{{ userFullName }}</span>
            <font-awesome-icon 
              :icon="dropdownOpen ? 'chevron-up' : 'chevron-down'" 
              class="text-gray-400 transition-transform" 
              aria-hidden="true" 
            />
          </button>

          <!-- User dropdown menu -->
          <div 
            v-show="dropdownOpen" 
            id="user-menu"
            class="absolute right-0 top-11 py-2 w-48 bg-sky-800 rounded-sm shadow-xl z-20"
            @click.away="dropdownOpen = false"
          >
            <button 
              @click="authStore.logout()"
              class="w-full text-left cursor-pointer py-2 px-4 text-gray-100 opacity-80 flex items-center border-b border-transparent hover:bg-gray-800 hover:bg-opacity-25 hover:text-white uppercase transition-colors focus:outline-none"
              role="menuitem"
            >
              <font-awesome-icon icon="sign-out-alt" class="mr-2" aria-hidden="true" />
              Log out
            </button>
          </div>
        </div>
      </div>
    </div>
  </nav>

  <!-- Error drawer -->
  <Drawer :show="showErrors" @close="showErrors = false">
    <template v-slot:header>
      <div class="flex items-center justify-between">
        <h3 class="font-semibold text-lg">Errors List</h3>
        <button 
          class="p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100 transition-colors focus:outline-none"
          @click="clearErrors()"
          aria-label="Clear all errors"
        >
          <font-awesome-icon 
            icon="trash-alt" 
            class="w-5 h-5"
            aria-hidden="true"
          />
        </button>
      </div>
    </template>
    <template v-slot:body>
      <p v-if="errors.length === 0" class="text-gray-500 italic">No errors to display</p>
      <ul v-else aria-label="Error messages" class="divide-y divide-gray-100">
        <li 
          v-for="(err, idx) in errors" 
          :key="idx" 
          class="mb-2 p-3 bg-gray-50 rounded text-sm border-l-4 border-red-500"
        >
          <code class="block whitespace-pre-wrap">{{ err }}</code>
        </li>
      </ul>
    </template>
  </Drawer>
</template>