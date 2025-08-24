<script setup lang="ts">
import {computed, defineAsyncComponent, onMounted, ref, watch} from "vue";
import {useNotificationStore} from "@/stores/notification";
import {useAuthStore} from "@/stores/auth";
import {useRouter} from "vue-router";
import useApiUtil from "@/composables/api_util";
import userPreferenceComposable from "@/composables/preferences";
import * as guards from "@/guards";
import { VITE_USE_MEGA_MENU } from '@/conf'
import { useFullscreen } from "@vueuse/core";
import { LaboratoryType } from "@/types/gql";
import { SwitchActiveLaboratoryDocument } from "@/graphql/operations/_mutations";
import { SwitchActiveLaboratoryMutation, SwitchActiveLaboratoryMutationVariables } from "@/types/gqlops";

// Lazily load components for better performance
const Logo = defineAsyncComponent(() => import("@/components/logo/Logo.vue"));

const {isFullscreen, toggle} = useFullscreen()

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
const activeLaboratory = computed<LaboratoryType | undefined>(
  () => authStore.auth?.activeLaboratory
);
const userLaboratories = computed(
  () => authStore.auth?.laboratories
);
const userFullName = computed(() => {
  const firstName = authStore.auth?.user?.firstName || '';
  const lastName = authStore.auth?.user?.lastName || '';
  return `${firstName} ${lastName}`.trim();
});

// Error handling
const {errors, clearErrors, withClientMutation} = useApiUtil();
const showErrors = ref(false);

// Notifications management
const notificationStore = useNotificationStore();
const toggleNotifications = (value: boolean) => notificationStore.showNotifications(value);

// Theme management
const {loadPreferredTheme} = userPreferenceComposable();
onMounted(() => {
  loadPreferredTheme();
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

const showModal = ref(false);
const targetLaboratoryUid = ref<string | null>(null);
const switching = ref(false);
const switchLabNow = () => {
  if(!targetLaboratoryUid.value) {
    alert("Please select a laboratory to switch to.");
    return;
  }
  switching.value = true;
  setTimeout(async () => {
    await withClientMutation<SwitchActiveLaboratoryMutation, SwitchActiveLaboratoryMutationVariables>(
          SwitchActiveLaboratoryDocument, 
          {userUid: authStore.auth?.user?.uid, laboratoryUid: targetLaboratoryUid.value}, 
          'setUserActiveLaboratory'
    ).then(_ => authStore.logout()).catch(error => console.error).finally(() => {
      showModal.value = false;
      switching.value = false;
    });
  }, 3000);
};
</script>

<template>
  <nav
      id="main-nav"
      class="flex items-center px-6 bg-primary border-b border-border "
      role="navigation"
      aria-label="Main Navigation"
  >
    <!-- Brand and menu section -->
    <div class="flex-1">
      <div class="flex text-right align-middle">
        <!-- Logo and brand name -->
        <router-link
            to="/"
            id="brand"
            class="flex items-center md:w-auto text-primary-foreground/80 hover:text-primary-foreground transition-colors"
            aria-label="Felicity LIMS Home"
        >
          <Logo />
          <h1 class="text-left text-2xl font-medium ml-2">
            {{ activeLaboratory?.name ?? "Felicity LIMS" }}
          </h1>
        </router-link>

       <span v-if="VITE_USE_MEGA_MENU" class="mx-8 border-l border-border my-2" aria-hidden="true"></span>

        <!-- Main menu dropdown trigger -->
        <button v-if="VITE_USE_MEGA_MENU" 
            @click="menuOpen = !menuOpen"
            class="hidden md:flex md:items-center focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded-md p-2"
            :aria-expanded="menuOpen"
            aria-controls="main-menu"
        >
          <span
              class="text-xl font-medium mr-2 text-primary-foreground/80 hover:text-primary-foreground uppercase">Menu</span>
          <font-awesome-icon
              :icon="menuOpen ? 'chevron-up' : 'chevron-down'"
              class="text-muted-foreground transition-transform duration-200"
              aria-hidden="true"
          />
        </button>

        <!-- Main menu dropdown content -->
        <div
            v-show="menuOpen"
            id="main-menu"
            class="absolute left-64 top-12 mt-1 p-4 w-1/2 bg-primary rounded-md shadow-lg border border-border z-20"
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
                class="flex items-center py-2 px-4 text-primary-foreground hover:bg-accent hover:text-accent-foreground rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                role="menuitem"
                @click="menuOpen = false"
            >
              <span class="mr-4" aria-hidden="true">
                <font-awesome-icon :icon="item.icon"/>
              </span>
              <span class="text-lg font-medium">{{ item.label }}</span>
            </router-link>
          </div>
        </div>
      </div>
    </div>

    <!-- User section and actions -->
    <div class="flex items-center space-x-4">
      <!-- Errors button -->
      <button
          v-if="errors.length > 0"
          class="flex items-center px-4 py-2 text-primary-foreground/80 hover:text-primary-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded-md"
          @click="showErrors = true"
          aria-label="Show errors"
      >
        <font-awesome-icon icon="bell" class="mr-2" aria-hidden="true"/>
        <span class="text-lg font-medium mr-2 uppercase">Errors</span>
        <span class="bg-destructive text-destructive-foreground text-xs rounded-full px-2 py-1">{{
            errors.length
          }}</span>
      </button>

      <span v-if="errors.length > 0" class="border-l border-border h-6" aria-hidden="true"></span>

      <!-- Notifications button -->
      <button
          class="flex items-center px-4 py-2 text-primary-foreground/80 hover:text-primary-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded-md"
          @click="toggleNotifications(true)"
          aria-label="Show notifications"
      >
        <font-awesome-icon icon="bell" class="mr-2" aria-hidden="true"/>
        <span class="text-lg font-medium uppercase">Notifications</span>
      </button>

      <span class="border-l border-border h-6" aria-hidden="true"></span>

      <!-- Admin settings link -->
      <router-link
          v-show="guards.canAccessPage(guards.pages.ADMINISTRATION)"
          to="/admin"
          class="flex items-center px-4 py-2 text-primary-foreground/80 hover:text-primary-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded-md"
          aria-label="Settings"
      >
        <font-awesome-icon icon="cog" class="mr-2" aria-hidden="true"/>
        <span class="text-lg font-medium uppercase">Settings</span>
      </router-link>

      <div class="px-4 flex text-right items-center relative"> 
        <span
            class="flex justify-center items-center h-8 w-8 rounded-full border-2 border-border hover:border-primary text-primary-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-primary cursor-pointer"
            aria-hidden="true"
            tabindex="0">
          <font-awesome-icon icon="user"/>
        </span>

        <div class="relative">
          <button
              @click="dropdownOpen = !dropdownOpen"
              class=" text-primary-foreground/80 hover:text-primary-foreground hidden md:flex md:items-center ml-2 focus:outline-none rounded-lg p-1 focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-primary"
              :aria-expanded="dropdownOpen"
              aria-controls="user-menu"
          >
            <span class="text-lg font-medium uppercase">{{ userFullName }}</span>
            <font-awesome-icon
                :icon="dropdownOpen ? 'chevron-up' : 'chevron-down'"
                class="ml-2 text-primary-foreground/80 transition-transform" aria-hidden="true"
            />
          </button>

          <div
              v-show="dropdownOpen"
              id="user-menu"
              class="absolute right-0 top-11 py-2 w-48 bg-popover text-popover-foreground rounded-lg shadow-xl z-20"
              @click.away="dropdownOpen = false"
              role="menu">
            <button
                @click="authStore.logout()"
                class="w-full text-left cursor-pointer py-2 px-4 flex items-center hover:bg-primary hover:text-primary-foreground uppercase transition-colors focus:outline-none focus:bg-accent focus:text-accent-foreground rounded"
                role="menuitem"
            >
              <font-awesome-icon icon="sign-out-alt" class="mr-2" aria-hidden="true"/>
              Log out
            </button>
          </div>
        </div>
      </div>
      <button v-if="(userLaboratories?.length ?? 0) > 1"
          @click="showModal = true"
          class="flex items-center p-2 text-primary-foreground/80 hover:text-primary-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded-md"
          :aria-label="isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'">
          <font-awesome-icon icon="shuffle"
          class="text-muted-foreground transition-transform duration-200"
          aria-hidden="true" />
      </button>
      <button
          @click="toggle"
          class="flex items-center p-2 text-primary-foreground/80 hover:text-primary-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded-md"
          :aria-label="isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'">
        <font-awesome-icon :icon="isFullscreen ? 'compress' : 'expand'"/>
      </button>
    </div>
  </nav>

  <!-- Error drawer -->
  <fel-drawer :show="showErrors" @close="showErrors = false">
    <template v-slot:header>
      <div class="flex items-center justify-between">
        <h3 class="font-semibold text-lg">Errors List</h3>
        <button
            class="p-2 text-muted-foreground hover:text-foreground rounded-full hover:bg-secondary transition-colors focus:outline-none"
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
      <p v-if="errors.length === 0" class="text-muted-foreground italic">No errors to display</p>
      <ul v-else aria-label="Error messages" class="divide-y divide-border">
        <li
            v-for="(err, idx) in errors"
            :key="idx"
            class="mb-2 p-3 bg-background rounded text-sm border-l-4 border-destructive"
        >
          <code class="block whitespace-pre-wrap">{{ err }}</code>
        </li>
      </ul>
    </template>
  </fel-drawer>

    <!-- Lab Switcher -->
  <fel-modal v-if="showModal" @close="showModal = false">
    <template v-slot:header>
      <h3 class="text-lg font-bold text-foreground">Current Laboratory Switcher</h3>
    </template>

    <template v-slot:body>
      <form action="post" class="p-6 space-y-6">
        <div class="space-y-4">
          <div class="grid grid-cols-2 gap-4">
            <label class="col-span-2 space-y-2">
              <span class="text-md font-medium">Laboratory Name</span>
              <select 
                class="w-full px-3 py-2 border border-input bg-background text-foreground rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                v-model="targetLaboratoryUid"
              >
                <option value="">Select Department</option>
                <option v-for="lab in userLaboratories" :key="lab.uid" :value="lab?.uid">{{ lab.name }}</option>
              </select>
            </label>
          </div>
        </div>

        <button
          type="button"
          @click.prevent="switchLabNow()"
          :class="[
            'w-full rounded-lg px-4 py-2 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-ring',
            switching
              ? 'bg-primary/50 text-primary-foreground cursor-not-allowed'
              : 'bg-primary text-primary-foreground hover:bg-primary/90'
          ]"
          :disabled="switching"
        >
          <span v-if="switching" class="flex items-center justify-center gap-2">
            <svg class="w-4 h-4 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3.5-3.5L12 0v4a8 8 0 11-8 8z"></path>
            </svg>
            Switching…
          </span>
          <span v-else>Switch Laboratory</span>
        </button>
      </form>
    </template>
  </fel-modal>

</template>