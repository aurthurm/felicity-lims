<script setup lang="ts">
import {computed, defineAsyncComponent, onMounted, ref, watch} from "vue";
import {useNotificationStore} from "@/stores/notification";
import {useAuthStore} from "@/stores/auth";
import {useRouter} from "vue-router";
import useApiUtil from "@/composables/api_util";
import userPreferenceComposable from "@/composables/preferences";
import * as guards from "@/guards";
import { useFullscreen, onClickOutside } from "@vueuse/core";
import { LaboratoryType } from "@/types/gql";
import { SwitchActiveLaboratoryDocument } from "@/graphql/operations/_mutations";
import { SwitchActiveLaboratoryMutation, SwitchActiveLaboratoryMutationVariables } from "@/types/gqlops";

// Lazily load components for better performance
const Logo = defineAsyncComponent(() => import("@/components/logo/Logo.vue"));
const BeakBadge = defineAsyncComponent(() => import("@/components/ui/BeakBadge.vue"));
const UserPreferences = defineAsyncComponent(() => import("@/components/user/UserPreferences.vue"));

const {isFullscreen, toggle} = useFullscreen()

// Router and navigation
const router = useRouter();
const menuOpen = ref(false);
const dropdownOpen = ref(false);
let megaMenuCloseTimeout: ReturnType<typeof setTimeout> | null = null;

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
  return `${firstName} ${lastName}`.trim() || authStore.auth?.user?.email || 'User';
});
const userEmail = computed(() => authStore.auth?.user?.email || '');
const userInitials = computed(() => {
  const firstName = authStore.auth?.user?.firstName || '';
  const lastName = authStore.auth?.user?.lastName || '';
  const initials = `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  return initials || authStore.auth?.user?.email?.charAt(0)?.toUpperCase() || 'U';
});

// Error handling
const {errors, clearErrors, withClientMutation} = useApiUtil();
const showErrors = ref(false);

// Deduplicate errors: group identical messages and show count when > 1
const deduplicatedErrors = computed(() => {
  const counts = new Map<string, number>();
  for (const err of errors.value) {
    const msg = typeof err === 'string' ? err : (err?.error ?? String(err));
    counts.set(msg, (counts.get(msg) ?? 0) + 1);
  }
  return Array.from(counts.entries()).map(([message, count]) => ({ message, count }));
});

//User Preferences
const showPreferences = ref(false);

// Notifications management
const notificationStore = useNotificationStore();
const toggleNotifications = (value: boolean) => notificationStore.showNotifications(value);

// Theme management and preferences
const {loadPreferredTheme, megaMenu} = userPreferenceComposable();
// Capture the initial value on mount and don't react to changes
// Changes will take effect on next page load/login
const useMegaMenu = ref(false);

onMounted(() => {
  loadPreferredTheme();
  useMegaMenu.value = megaMenu.value;
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

const onMegaMenuEnter = () => {
  if (megaMenuCloseTimeout) {
    clearTimeout(megaMenuCloseTimeout);
    megaMenuCloseTimeout = null;
  }
  menuOpen.value = true;
};
const onMegaMenuLeave = () => {
  megaMenuCloseTimeout = setTimeout(() => {
    menuOpen.value = false;
    megaMenuCloseTimeout = null;
  }, 150);
};

const userMenuRef = ref<HTMLElement | null>(null);
const megaMenuRef = ref<HTMLElement | null>(null);
onClickOutside(userMenuRef, () => {
  dropdownOpen.value = false;
});
onClickOutside(megaMenuRef, () => {
  menuOpen.value = false;
});

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
    ).then(_ => authStore.logout()).catch(() => undefined).finally(() => {
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
      <div class="flex items-center">
        <!-- Logo and brand name -->
        <router-link
            to="/"
            id="brand"
            class="flex items-center md:w-auto text-primary-foreground/80 hover:text-primary-foreground transition-colors"
            aria-label="Beak LIMS Home"
        >
          <Logo />
          <h1 class="text-left text-2xl font-medium ml-2">
            {{ activeLaboratory?.name ?? "Beak LIMS" }}
          </h1>
        </router-link>

       <span v-if="useMegaMenu" class="mx-8 border-l border-border h-8 self-center" aria-hidden="true"></span>

        <!-- Mega menu: hover to open, smooth transitions -->
        <div
            v-if="useMegaMenu"
            ref="megaMenuRef"
            class="relative hidden md:block"
            @mouseenter="onMegaMenuEnter"
            @mouseleave="onMegaMenuLeave"
        >
          <button
              @click="menuOpen = !menuOpen"
              class="flex items-center gap-2 h-9 px-4 rounded-lg text-sm font-medium text-primary-foreground/90 hover:text-primary-foreground hover:bg-primary-foreground/10 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-foreground/40 focus:ring-offset-2 focus:ring-offset-primary"
              :aria-expanded="menuOpen"
              aria-controls="main-menu"
              aria-haspopup="true"
          >
            <span>Menu</span>
            <font-awesome-icon
                :icon="menuOpen ? 'chevron-up' : 'chevron-down'"
                class="text-primary-foreground/70 text-xs transition-transform duration-200"
                aria-hidden="true"
            />
          </button>

          <Transition
              enter-active-class="transition ease-out duration-200"
              enter-from-class="opacity-0 scale-95 -translate-y-1"
              enter-to-class="opacity-100 scale-100 translate-y-0"
              leave-active-class="transition ease-in duration-150"
              leave-from-class="opacity-100 scale-100 translate-y-0"
              leave-to-class="opacity-0 scale-95 -translate-y-1"
          >
            <div
                v-show="menuOpen"
                id="main-menu"
                class="absolute left-0 top-full mt-1 min-w-[600px] rounded-xl border border-border bg-popover text-popover-foreground shadow-xl z-20 overflow-hidden"
                role="menu"
                aria-label="Main Menu"
            >
              <div class="p-4">
                <div class="grid grid-cols-3 gap-2" role="none">
                  <router-link
                      v-for="item in navItems"
                      :key="item.id"
                      v-show="guards.canAccessPage(item.guard)"
                      :to="item.route"
                      :id="`${item.id}-link`"
                      class="flex items-center gap-3 rounded-lg py-2.5 px-3 text-foreground hover:bg-accent hover:text-accent-foreground transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-popover"
                      role="menuitem"
                      @click="menuOpen = false"
                  >
                    <span class="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-muted/80" aria-hidden="true">
                      <font-awesome-icon :icon="item.icon" class="text-muted-foreground"/>
                    </span>
                    <span class="text-sm font-medium">{{ item.label }}</span>
                  </router-link>
                </div>
              </div>
            </div>
          </Transition>
        </div>
      </div>
    </div>

    <!-- User section and actions -->
    <div class="flex items-center space-x-4">
      <!-- Errors button -->
      <button
          v-if="errors.length > 0"
          class="flex items-center gap-2 h-9 px-4 rounded-lg text-sm font-medium text-primary-foreground/90 hover:text-primary-foreground hover:bg-primary-foreground/10 transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-primary"
          @click="showErrors = true"
          aria-label="Show errors"
      >
        <font-awesome-icon icon="bell" class="shrink-0" aria-hidden="true"/>
        <span>Errors</span>
        <span class="bg-destructive text-destructive-foreground text-xs rounded-full px-2 py-0.5 min-w-[1.25rem] text-center">{{ errors.length }}</span>
      </button>

      <span v-if="errors.length > 0" class="border-l border-border h-8 self-center" aria-hidden="true"></span>

      <!-- Notifications button -->
      <button
          class="flex items-center gap-2 h-9 px-4 rounded-lg text-sm font-medium text-primary-foreground/90 hover:text-primary-foreground hover:bg-primary-foreground/10 transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-primary"
          @click="toggleNotifications(true)"
          aria-label="Show notifications"
      >
        <font-awesome-icon icon="bell" class="shrink-0" aria-hidden="true"/>
        <span>Notifications</span>
      </button>

      <span class="border-l border-border h-8 self-center" aria-hidden="true"></span>

      <!-- Admin settings link -->
      <router-link
          v-show="guards.canAccessPage(guards.pages.ADMINISTRATION)"
          to="/admin"
          class="flex items-center gap-2 h-9 px-4 rounded-lg text-sm font-medium text-primary-foreground/90 hover:text-primary-foreground hover:bg-primary-foreground/10 transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-primary"
          aria-label="Settings"
      >
        <font-awesome-icon icon="cog" class="shrink-0" aria-hidden="true"/>
        <span>Settings</span>
      </router-link>

      <!-- User menu trigger -->
      <div ref="userMenuRef" class="relative pl-4">
        <button
            @click="dropdownOpen = !dropdownOpen"
            class="flex items-center gap-2 min-h-9 py-2 px-4 rounded-lg text-sm font-medium text-primary-foreground/90 hover:text-primary-foreground hover:bg-primary-foreground/10 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-foreground/40 focus:ring-offset-2 focus:ring-offset-primary"
            :aria-expanded="dropdownOpen"
            aria-controls="user-menu"
            aria-haspopup="true"
        >
          <span
              class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary-foreground/20 text-xs font-semibold text-primary-foreground ring-2 ring-primary-foreground/30"
              aria-hidden="true"
          >
            {{ userInitials }}
          </span>
          <div class="hidden md:block text-left min-w-0">
            <span class="block text-sm font-medium truncate max-w-[140px]">{{ userFullName }}</span>
            <span v-if="userEmail" class="block text-xs text-primary-foreground/70 truncate max-w-[140px]">{{ userEmail }}</span>
          </div>
          <font-awesome-icon
              :icon="dropdownOpen ? 'chevron-up' : 'chevron-down'"
              class="hidden md:block shrink-0 text-primary-foreground/70 text-xs transition-transform duration-200"
              aria-hidden="true"
          />
        </button>

        <!-- User dropdown menu -->
        <Transition
            enter-active-class="transition ease-out duration-150"
            enter-from-class="opacity-0 scale-95 -translate-y-1"
            enter-to-class="opacity-100 scale-100 translate-y-0"
            leave-active-class="transition ease-in duration-100"
            leave-from-class="opacity-100 scale-100 translate-y-0"
            leave-to-class="opacity-0 scale-95 -translate-y-1"
        >
          <div
              v-show="dropdownOpen"
              id="user-menu"
              class="absolute right-0 top-full mt-2 w-56 rounded-xl border border-border bg-popover text-popover-foreground shadow-lg z-30 overflow-hidden"
              role="menu"
              aria-orientation="vertical"
          >
            <!-- User info header -->
            <div class="px-4 py-3 bg-muted/50 border-b border-border">
              <p class="text-sm font-medium text-foreground truncate">{{ userFullName }}</p>
              <p v-if="userEmail" class="text-xs text-muted-foreground truncate mt-0.5">{{ userEmail }}</p>
              <p v-if="activeLaboratory?.name" class="text-xs text-muted-foreground truncate mt-1 flex items-center gap-1.5">
                <font-awesome-icon icon="vial" class="shrink-0 opacity-70" aria-hidden="true"/>
                {{ activeLaboratory.name }}
              </p>
            </div>

            <!-- Menu items -->
            <div class="py-1.5">
              <button
                  class="w-full text-left py-2.5 px-4 flex items-center gap-3 text-sm text-foreground hover:bg-accent hover:text-accent-foreground transition-colors focus:outline-none focus:bg-accent focus:text-accent-foreground"
                  role="menuitem"
                  @click="showPreferences = true; dropdownOpen = false"
              >
                <font-awesome-icon icon="user-gear" class="w-4 text-muted-foreground" aria-hidden="true"/>
                Preferences
              </button>
              <button
                  v-if="(userLaboratories?.length ?? 0) > 1"
                  class="w-full text-left py-2.5 px-4 flex items-center gap-3 text-sm text-foreground hover:bg-accent hover:text-accent-foreground transition-colors focus:outline-none focus:bg-accent focus:text-accent-foreground"
                  role="menuitem"
                  @click="showModal = true; dropdownOpen = false"
              >
                <font-awesome-icon icon="shuffle" class="w-4 text-muted-foreground" aria-hidden="true"/>
                Switch laboratory
              </button>
            </div>

            <div class="border-t border-border" role="separator"/>
            <div class="py-1.5">
              <button
                  @click="authStore.logout()"
                  class="w-full text-left py-2.5 px-4 flex items-center gap-3 text-sm text-destructive hover:bg-destructive/10 transition-colors focus:outline-none focus:bg-destructive/10"
                  role="menuitem"
              >
                <font-awesome-icon icon="sign-out-alt" class="w-4" aria-hidden="true"/>
                Log out
              </button>
            </div>
          </div>
        </Transition>
      </div>
      <button
          @click="toggle"
          class="flex items-center justify-center h-9 w-9 shrink-0 rounded-lg text-primary-foreground/90 hover:text-primary-foreground hover:bg-primary-foreground/10 transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-primary"
          :aria-label="isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'">
        <font-awesome-icon :icon="isFullscreen ? 'compress' : 'expand'" class="shrink-0"/>
      </button>
    </div>
  </nav>

  <!-- Error drawer -->
  <beak-drawer :show="showErrors" @close="showErrors = false">
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
            v-for="(item, idx) in deduplicatedErrors"
            :key="idx"
            class="mb-2 p-3 bg-background rounded text-sm border-l-4 border-destructive flex items-start gap-2"
        >
          <code class="flex-1 whitespace-pre-wrap">{{ item.message }}</code>
          <beak-badge v-if="item.count > 1" variant="destructive" size="sm" class="shrink-0">{{ item.count }}</beak-badge>
        </li>
      </ul>
    </template>
  </beak-drawer>

  <!-- User Preferences Drawer -->
  <beak-drawer :show="showPreferences" @close="showPreferences = false">
    <template v-slot:header>
      <div class="flex items-center justify-between">
        <h3 class="font-semibold text-lg">Your Preferences</h3>
      </div>
    </template>
    <template v-slot:body>
      <user-preferences v-if="showPreferences" />
    </template>
  </beak-drawer>

    <!-- Lab Switcher -->
  <beak-modal v-if="showModal" @close="showModal = false">
    <template v-slot:header>
      <h3 class="text-lg font-bold text-foreground">Current Laboratory Switcher</h3>
    </template>

    <template v-slot:body>
      <form action="post" class="p-6 space-y-6">
        <p class="text-sm text-muted-foreground bg-muted/50 rounded-lg p-4 border border-border">
          <span class="font-medium text-foreground">Note:</span> Switching laboratories will automatically log you out. You will need to sign in again for the change to take effect.
        </p>
        <div class="space-y-4">
          <div class="grid grid-cols-2 gap-4">
            <label class="col-span-2 space-y-2">
              <span class="text-base font-medium">Laboratory Name</span>
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

        <beak-button
          type="button"
          @click.prevent="switchLabNow()"
          :loading="switching"
          :disabled="switching"
          class="w-full"
        >
          Switch Laboratory
        </beak-button>
      </form>
    </template>
  </beak-modal>

</template>
