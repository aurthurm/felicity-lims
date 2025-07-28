<script setup lang="ts">
import { computed, defineAsyncComponent, onMounted, ref, watch } from "vue";
import { useNotificationStore } from "@/stores/notification";
import { useAuthStore } from "@/stores/auth";
import { useNavigationStore } from "@/stores/navigation";
import { useLaboratoryContextStore } from "@/stores/laboratory_context";
import { useRouter } from "vue-router";
import useApiUtil from "@/composables/api_util";
import userPreferenceComposable from "@/composables/preferences";
import * as guards from "@/guards";
import { useFullscreen } from "@vueuse/core";
import NavigationBreadcrumbs from "./NavigationBreadcrumbs.vue";
import LaboratoryContextSwitcher from "@/components/ui/LaboratoryContextSwitcher.vue";

// Lazily load components for better performance
const Logo = defineAsyncComponent(() => import("@/components/logo/Logo.vue"));

const { isFullscreen, toggle } = useFullscreen();

// Stores
const router = useRouter();
const authStore = useAuthStore();
const navigationStore = useNavigationStore();
const contextStore = useLaboratoryContextStore();
const notificationStore = useNotificationStore();

// Local state
const menuOpen = ref(false);
const dropdownOpen = ref(false);
const showQuickSearch = ref(false);

// Close menus when route changes
watch(() => router.currentRoute.value, (current, previous) => {
  if (current.path !== previous?.path) {
    menuOpen.value = false;
    dropdownOpen.value = false;
    showQuickSearch.value = false;
  }
});

// Computed properties
const activeLaboratory = computed(() => contextStore.context.activeLaboratory);
const hasMultipleLaboratories = computed(() => contextStore.hasMultipleLaboratories);
const userFullName = computed(() => {
  const firstName = authStore.auth?.user?.firstName || '';
  const lastName = authStore.auth?.user?.lastName || '';
  return `${firstName} ${lastName}`.trim();
});

const categorizedNavigation = computed(() => navigationStore.categorizedNavigation);
const quickActions = computed(() => navigationStore.contextQuickActions);
const breadcrumbs = computed(() => navigationStore.breadcrumbs);

// Error handling
const { errors, clearErrors } = useApiUtil();
const showErrors = ref(false);

// Theme management
const { loadPreferredTheme } = userPreferenceComposable();
onMounted(() => {
  loadPreferredTheme();
});

// Methods
const toggleNotifications = (value: boolean) => notificationStore.showNotifications(value);

const navigateTo = (item: any) => {
  const routeWithContext = navigationStore.getRouteWithContext(item);
  router.push(routeWithContext);
  menuOpen.value = false;
};

const executeQuickAction = (action: any) => {
  action.action();
  menuOpen.value = false;
};

const closeMenus = () => {
  menuOpen.value = false;
  dropdownOpen.value = false;
  showQuickSearch.value = false;
};

const handleKeyDown = (event: KeyboardEvent) => {
  if (event.key === 'Escape') {
    closeMenus();
  }
  
  // Global keyboard shortcuts
  if (event.ctrlKey || event.metaKey) {
    switch (event.key) {
      case 'k':
        event.preventDefault();
        showQuickSearch.value = !showQuickSearch.value;
        break;
      case 'l':
        if (hasMultipleLaboratories.value) {
          event.preventDefault();
          router.push('/select-laboratory');
        }
        break;
    }
  }
};

const setSearchQuery = (query: string) => {
  navigationStore.setSearchQuery(query);
};

onMounted(() => {
  document.addEventListener('keydown', handleKeyDown);
});
</script>

<template>
  <header
    id="main-nav"
    class="flex flex-col bg-background border-b border-border sticky top-0 z-40"
    role="banner"
  >
    <!-- Top Navigation Bar -->
    <nav
      class="flex items-center px-6 py-3"
      role="navigation"
      aria-label="Main Navigation"
    >
      <!-- Brand and menu section -->
      <div class="flex-1 flex items-center">
        <!-- Logo and brand name -->
        <router-link
          to="/"
          id="brand"
          class="flex items-center text-foreground hover:text-primary transition-colors mr-6"
          aria-label="Felicity LIMS Home"
        >
          <Logo />
          <h1 class="text-xl font-semibold ml-2">
            {{ activeLaboratory?.name || "Felicity LIMS" }}
          </h1>
        </router-link>

        <!-- Laboratory Context Switcher -->
        <div v-if="hasMultipleLaboratories" class="mr-6">
          <LaboratoryContextSwitcher />
        </div>

        <!-- Quick Search -->
        <div class="relative mr-6 hidden md:block">
          <button
            @click="showQuickSearch = !showQuickSearch"
            class="flex items-center px-3 py-2 text-sm bg-muted hover:bg-accent rounded-md transition-colors"
            :aria-expanded="showQuickSearch"
          >
            <i class="fas fa-search mr-2"></i>
            <span>Search navigation...</span>
            <span class="ml-2 text-xs text-muted-foreground">Ctrl+K</span>
          </button>
          
          <!-- Quick Search Dropdown -->
          <div
            v-if="showQuickSearch"
            class="absolute top-full left-0 mt-1 w-80 bg-popover text-popover-foreground rounded-md shadow-lg border border-border z-50"
            @click.away="showQuickSearch = false"
          >
            <div class="p-3">
              <input
                :value="navigationStore.searchQuery"
                @input="setSearchQuery($event.target.value)"
                type="text"
                placeholder="Search pages, actions..."
                class="w-full px-3 py-2 text-sm border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                autofocus
              />
            </div>
            
            <div v-if="navigationStore.searchQuery" class="max-h-64 overflow-y-auto border-t border-border">
              <div
                v-for="item in navigationStore.filteredNavigation.slice(0, 8)"
                :key="item.id"
                @click="navigateTo(item)"
                class="flex items-center px-3 py-2 hover:bg-accent cursor-pointer"
              >
                <i :class="`fas fa-${item.icon}`" class="w-4 mr-3 text-muted-foreground"></i>
                <div class="flex-1">
                  <div class="text-sm font-medium">{{ item.label }}</div>
                  <div v-if="item.description" class="text-xs text-muted-foreground">
                    {{ item.description }}
                  </div>
                </div>
              </div>
            </div>
            
            <div v-else class="border-t border-border">
              <div class="px-3 py-2 text-xs text-muted-foreground">Quick Actions</div>
              <div
                v-for="action in quickActions.slice(0, 4)"
                :key="action.id"
                @click="executeQuickAction(action)"
                class="flex items-center px-3 py-2 hover:bg-accent cursor-pointer"
              >
                <i :class="`fas fa-${action.icon}`" class="w-4 mr-3 text-muted-foreground"></i>
                <div class="flex-1">
                  <div class="text-sm font-medium">{{ action.label }}</div>
                  <div v-if="action.shortcut" class="text-xs text-muted-foreground">
                    {{ action.shortcut }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Main menu dropdown -->
        <div class="relative">
          <button
            @click="menuOpen = !menuOpen"
            class="flex items-center px-3 py-2 text-sm hover:bg-accent rounded-md transition-colors"
            :aria-expanded="menuOpen"
            aria-controls="main-menu"
          >
            <span class="font-medium mr-2">Menu</span>
            <i :class="menuOpen ? 'fa-chevron-up' : 'fa-chevron-down'" class="fas text-xs"></i>
          </button>
          
          <!-- Menu Dropdown -->
          <div
            v-if="menuOpen"
            id="main-menu"
            class="absolute left-0 top-full mt-1 w-screen max-w-4xl bg-popover text-popover-foreground rounded-md shadow-lg border border-border z-50"
            @click.away="menuOpen = false"
          >
            <div class="p-6">
              <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                <!-- Navigation Categories -->
                <div
                  v-for="category in categorizedNavigation.slice(0, 3)"
                  :key="category.id"
                  class="space-y-3"
                >
                  <h3 class="text-sm font-semibold text-foreground flex items-center">
                    <i :class="`fas fa-${category.icon}`" class="w-4 mr-2"></i>
                    {{ category.label }}
                  </h3>
                  <div class="space-y-1">
                    <button
                      v-for="item in category.items.slice(0, 5)"
                      :key="item.id"
                      v-show="guards.canAccessPage(item.guard)"
                      @click="navigateTo(item)"
                      class="w-full flex items-center px-3 py-2 text-sm hover:bg-accent rounded-md transition-colors text-left"
                    >
                      <i :class="`fas fa-${item.icon}`" class="w-4 mr-3 text-muted-foreground"></i>
                      <div class="flex-1">
                        <div class="font-medium">{{ item.label }}</div>
                        <div v-if="item.description" class="text-xs text-muted-foreground truncate">
                          {{ item.description }}
                        </div>
                      </div>
                      <div v-if="item.isNew" class="ml-2">
                        <span class="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">New</span>
                      </div>
                    </button>
                  </div>
                  
                  <div v-if="category.items.length > 5" class="text-xs text-muted-foreground">
                    +{{ category.items.length - 5 }} more items
                  </div>
                </div>
              </div>
              
              <!-- Quick Actions Footer -->
              <div v-if="quickActions.length > 0" class="mt-6 pt-4 border-t border-border">
                <div class="flex items-center justify-between">
                  <h4 class="text-sm font-medium text-muted-foreground">Quick Actions</h4>
                  <div class="flex space-x-2">
                    <button
                      v-for="action in quickActions.slice(0, 3)"
                      :key="action.id"
                      @click="executeQuickAction(action)"
                      class="flex items-center px-3 py-2 text-xs bg-primary text-primary-foreground hover:bg-primary/90 rounded-md transition-colors"
                      :title="action.description"
                    >
                      <i :class="`fas fa-${action.icon}`" class="mr-2"></i>
                      {{ action.label }}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- User section and actions -->
      <div class="flex items-center space-x-4">
        <!-- Errors button -->
        <button
          v-if="errors.length > 0"
          class="flex items-center px-3 py-2 text-sm hover:bg-accent rounded-md transition-colors"
          @click="showErrors = true"
          aria-label="Show errors"
        >
          <i class="fas fa-exclamation-triangle mr-2 text-destructive"></i>
          <span class="font-medium">{{ errors.length }} Error{{ errors.length !== 1 ? 's' : '' }}</span>
        </button>

        <!-- Notifications button -->
        <button
          class="flex items-center px-3 py-2 text-sm hover:bg-accent rounded-md transition-colors"
          @click="toggleNotifications(true)"
          aria-label="Show notifications"
        >
          <i class="fas fa-bell mr-2"></i>
          <span class="font-medium">Notifications</span>
        </button>

        <!-- Admin settings link -->
        <router-link
          v-show="guards.canAccessPage(guards.pages.ADMINISTRATION)"
          to="/admin"
          class="flex items-center px-3 py-2 text-sm hover:bg-accent rounded-md transition-colors"
          aria-label="Settings"
        >
          <i class="fas fa-cog mr-2"></i>
          <span class="font-medium">Settings</span>
        </router-link>

        <!-- User dropdown -->
        <div class="relative">
          <button
            @click="dropdownOpen = !dropdownOpen"
            class="flex items-center px-3 py-2 text-sm hover:bg-accent rounded-md transition-colors"
            :aria-expanded="dropdownOpen"
            aria-controls="user-menu"
          >
            <div class="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center mr-3">
              <span class="text-xs font-medium">
                {{ authStore.auth?.user?.firstName?.[0] || 'U' }}{{ authStore.auth?.user?.lastName?.[0] || '' }}
              </span>
            </div>
            <span class="font-medium">{{ userFullName }}</span>
            <i :class="dropdownOpen ? 'fa-chevron-up' : 'fa-chevron-down'" class="fas text-xs ml-2"></i>
          </button>

          <div
            v-if="dropdownOpen"
            id="user-menu"
            class="absolute right-0 top-full mt-1 w-48 bg-popover text-popover-foreground rounded-md shadow-lg border border-border z-50"
            @click.away="dropdownOpen = false"
            role="menu"
          >
            <div class="py-1">
              <button
                @click="authStore.logout()"
                class="w-full text-left px-4 py-2 text-sm hover:bg-accent flex items-center transition-colors"
                role="menuitem"
              >
                <i class="fas fa-sign-out-alt mr-3"></i>
                Log out
              </button>
            </div>
          </div>
        </div>

        <!-- Fullscreen toggle -->
        <button
          @click="toggle"
          class="p-2 text-sm hover:bg-accent rounded-md transition-colors"
          :aria-label="isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'"
        >
          <i :class="isFullscreen ? 'fas fa-compress' : 'fas fa-expand'"></i>
        </button>
      </div>
    </nav>

    <!-- Breadcrumb Navigation -->
    <div v-if="breadcrumbs.length > 0" class="px-6 py-2 border-t border-border bg-muted/30">
      <NavigationBreadcrumbs :show-icons="true" :compact="false" />
    </div>
  </header>

  <!-- Error drawer -->
  <fel-drawer :show="showErrors" @close="showErrors = false">
    <template v-slot:header>
      <div class="flex items-center justify-between">
        <h3 class="font-semibold text-lg">Error Details</h3>
        <button
          class="p-2 text-muted-foreground hover:text-foreground rounded-full hover:bg-secondary transition-colors"
          @click="clearErrors()"
          aria-label="Clear all errors"
        >
          <i class="fas fa-trash-alt"></i>
        </button>
      </div>
    </template>
    <template v-slot:body>
      <p v-if="errors.length === 0" class="text-muted-foreground italic">No errors to display</p>
      <ul v-else class="space-y-3">
        <li
          v-for="(err, idx) in errors"
          :key="idx"
          class="p-3 bg-destructive/10 border border-destructive/20 rounded-md"
        >
          <div class="text-sm font-medium text-destructive mb-1">Error {{ idx + 1 }}</div>
          <code class="block text-xs whitespace-pre-wrap text-foreground">{{ err }}</code>
        </li>
      </ul>
    </template>
  </fel-drawer>
</template>

<style scoped>
/* Smooth transitions */
.transition-colors {
  transition-property: color, background-color, border-color;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}

/* Focus styles */
.focus\:ring-2:focus {
  outline: 2px solid transparent;
  outline-offset: 2px;
  --tw-ring-offset-shadow: var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color);
  --tw-ring-shadow: var(--tw-ring-inset) 0 0 0 calc(2px + var(--tw-ring-offset-width)) var(--tw-ring-color);
  box-shadow: var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow, 0 0 #0000);
}

/* Dropdown animations */
@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

[id*="menu"], [id*="dropdown"] {
  animation: slideDown 0.2s ease-out;
}

/* Badge styles */
.bg-blue-100 {
  background-color: rgb(219 234 254);
}

.text-blue-800 {
  color: rgb(30 64 175);
}

.bg-primary\/10 {
  background-color: hsl(var(--primary) / 0.1);
}

.bg-primary\/90:hover {
  background-color: hsl(var(--primary) / 0.9);
}
</style>