<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useNavigationStore } from '@/stores/navigation';
import { useLaboratoryContextStore } from '@/stores/laboratory_context';
import LaboratoryContextSwitcher from '@/components/ui/LaboratoryContextSwitcher.vue';

const router = useRouter();
const route = useRoute();
const navigationStore = useNavigationStore();
const contextStore = useLaboratoryContextStore();

// Local state
const hoveredItem = ref<string | null>(null);
const expandedCategories = ref<Set<string>>(new Set(['overview', 'patients', 'samples']));

// Computed properties
const isCollapsed = computed(() => navigationStore.isCollapsed);
const categorizedNavigation = computed(() => navigationStore.categorizedNavigation);
const currentRoute = computed(() => route.path);
const searchQuery = computed(() => navigationStore.searchQuery);
const contextQuickActions = computed(() => navigationStore.contextQuickActions);
const currentLaboratory = computed(() => contextStore.context.activeLaboratory);

// Methods
const navigateTo = (item: any) => {
  const routeWithContext = navigationStore.getRouteWithContext(item);
  router.push(routeWithContext);
};

const toggleCategory = (categoryId: string) => {
  if (expandedCategories.value.has(categoryId)) {
    expandedCategories.value.delete(categoryId);
  } else {
    expandedCategories.value.add(categoryId);
  }
};

const isCategoryExpanded = (categoryId: string) => {
  return expandedCategories.value.has(categoryId);
};

const isActiveRoute = (item: any) => {
  const itemRoute = navigationStore.getRouteWithContext(item);
  return currentRoute.value === item.route || 
         currentRoute.value.startsWith(item.route + '/') ||
         currentRoute.value.startsWith(item.route + '?');
};

const isItemVisible = (item: any) => {
  // If searching, check if item matches search
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    return item.label.toLowerCase().includes(query) ||
           item.description?.toLowerCase().includes(query);
  }
  return true;
};

const executeQuickAction = (action: any) => {
  action.action();
};

const setSearchQuery = (query: string) => {
  navigationStore.setSearchQuery(query);
};

const clearSearch = () => {
  navigationStore.clearSearch();
};

const toggleSidebar = () => {
  navigationStore.toggleCollapsed();
};

// Watch for route changes to expand relevant categories
watch(currentRoute, (newRoute) => {
  const activeItem = navigationStore.findNavigationItem(newRoute);
  if (activeItem?.category && !expandedCategories.value.has(activeItem.category)) {
    expandedCategories.value.add(activeItem.category);
  }
}, { immediate: true });
</script>

<template>
  <aside 
    :class="[
      'bg-background border-r border-border transition-all duration-300 flex flex-col h-full',
      isCollapsed ? 'w-16' : 'w-64'
    ]"
    role="navigation"
    aria-label="Main sidebar navigation"
  >
    <!-- Header Section -->
    <div class="p-4 border-b border-border flex-shrink-0">
      <div class="flex items-center justify-between">
        <!-- Laboratory Context Switcher -->
        <div v-if="!isCollapsed" class="flex-1 mr-2">
          <LaboratoryContextSwitcher />
        </div>
        
        <!-- Collapse Toggle -->
        <button
          @click="toggleSidebar"
          class="p-2 rounded-md hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
          :aria-label="isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'"
        >
          <i :class="isCollapsed ? 'fas fa-chevron-right' : 'fas fa-chevron-left'"></i>
        </button>
      </div>
    </div>

    <!-- Search Section -->
    <div v-if="!isCollapsed" class="p-4 border-b border-border flex-shrink-0">
      <div class="relative">
        <input
          :value="searchQuery"
          @input="setSearchQuery($event.target.value)"
          type="text"
          placeholder="Search navigation..."
          class="w-full pl-9 pr-4 py-2 text-sm border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
        />
        <i class="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground text-sm"></i>
        <button
          v-if="searchQuery"
          @click="clearSearch"
          class="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 rounded hover:bg-accent text-muted-foreground hover:text-foreground"
          aria-label="Clear search"
        >
          <i class="fas fa-times text-xs"></i>
        </button>
      </div>
    </div>

    <!-- Quick Actions -->
    <div v-if="!isCollapsed && contextQuickActions.length > 0" class="p-4 border-b border-border flex-shrink-0">
      <div class="space-y-2">
        <h3 class="text-xs font-medium text-muted-foreground uppercase tracking-wide">Quick Actions</h3>
        <div class="grid grid-cols-2 gap-2">
          <button
            v-for="action in contextQuickActions.slice(0, 4)"
            :key="action.id"
            @click="executeQuickAction(action)"
            class="p-2 text-xs rounded-md border border-input hover:bg-accent text-left transition-colors flex items-center space-x-2"
            :title="action.description"
          >
            <i :class="`fas fa-${action.icon}`" class="text-muted-foreground"></i>
            <span class="truncate">{{ action.label }}</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Navigation Menu -->
    <div class="flex-1 overflow-y-auto p-2">
      <nav class="space-y-1" role="navigation">
        <!-- Search Results (when searching) -->
        <div v-if="searchQuery" class="space-y-1">
          <div
            v-for="item in navigationStore.filteredNavigation"
            :key="`search-${item.id}`"
            class="relative"
          >
            <button
              @click="navigateTo(item)"
              @mouseenter="hoveredItem = item.id"
              @mouseleave="hoveredItem = null"
              :class="[
                'w-full text-left px-3 py-2 rounded-md transition-colors flex items-center space-x-3',
                isActiveRoute(item)
                  ? 'bg-primary text-primary-foreground'
                  : 'text-foreground hover:bg-accent hover:text-accent-foreground'
              ]"
              :title="isCollapsed ? item.label : item.description"
            >
              <i :class="`fas fa-${item.icon}`" class="w-4 h-4 flex-shrink-0"></i>
              <div v-if="!isCollapsed" class="flex-1 min-w-0">
                <div class="text-sm font-medium truncate">{{ item.label }}</div>
                <div v-if="item.description" class="text-xs text-muted-foreground truncate">
                  {{ item.description }}
                </div>
              </div>
              <div v-if="!isCollapsed && item.badge" class="flex-shrink-0">
                <span class="inline-flex items-center px-2 py-1 rounded-full text-xs bg-accent text-accent-foreground">
                  {{ item.badge }}
                </span>
              </div>
              <div v-if="!isCollapsed && item.isNew" class="flex-shrink-0">
                <span class="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                  New
                </span>
              </div>
            </button>
          </div>
        </div>

        <!-- Categorized Navigation (when not searching) -->
        <div v-else class="space-y-4">
          <div
            v-for="category in categorizedNavigation"
            :key="category.id"
            class="space-y-1"
          >
            <!-- Category Header -->
            <button
              v-if="!isCollapsed"
              @click="toggleCategory(category.id)"
              class="w-full flex items-center justify-between px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              <div class="flex items-center space-x-3">
                <i :class="`fas fa-${category.icon}`" class="w-4 h-4"></i>
                <span>{{ category.label }}</span>
              </div>
              <i 
                :class="[
                  'fas transition-transform text-xs',
                  isCategoryExpanded(category.id) ? 'fa-chevron-down' : 'fa-chevron-right'
                ]"
              ></i>
            </button>

            <!-- Category Items -->
            <div 
              v-if="isCollapsed || isCategoryExpanded(category.id)"
              class="space-y-1"
              :class="{ 'pl-3': !isCollapsed }"
            >
              <div
                v-for="item in category.items"
                :key="item.id"
                class="relative"
              >
                <!-- Main Navigation Item -->
                <button
                  @click="navigateTo(item)"
                  @mouseenter="hoveredItem = item.id"
                  @mouseleave="hoveredItem = null"
                  :class="[
                    'w-full text-left px-3 py-2 rounded-md transition-colors flex items-center space-x-3',
                    isActiveRoute(item)
                      ? 'bg-primary text-primary-foreground'
                      : 'text-foreground hover:bg-accent hover:text-accent-foreground'
                  ]"
                  :title="isCollapsed ? item.label : item.description"
                >
                  <i :class="`fas fa-${item.icon}`" class="w-4 h-4 flex-shrink-0"></i>
                  <div v-if="!isCollapsed" class="flex-1 min-w-0">
                    <div class="text-sm font-medium truncate">{{ item.label }}</div>
                    <div v-if="item.description && !navigationStore.navigationPreferences.compactMode" 
                         class="text-xs text-muted-foreground truncate">
                      {{ item.description }}
                    </div>
                  </div>
                  <div v-if="!isCollapsed && item.shortcut" class="flex-shrink-0">
                    <span class="text-xs text-muted-foreground bg-muted px-1 py-0.5 rounded">
                      {{ item.shortcut }}
                    </span>
                  </div>
                  <div v-if="!isCollapsed && item.badge" class="flex-shrink-0">
                    <span class="inline-flex items-center px-2 py-1 rounded-full text-xs bg-accent text-accent-foreground">
                      {{ item.badge }}
                    </span>
                  </div>
                  <div v-if="!isCollapsed && item.isNew" class="flex-shrink-0">
                    <span class="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                      New
                    </span>
                  </div>
                </button>

                <!-- Child Items (if any) -->
                <div v-if="!isCollapsed && item.children && item.children.length > 0" class="ml-6 mt-1 space-y-1">
                  <button
                    v-for="child in item.children"
                    :key="child.id"
                    @click="navigateTo(child)"
                    :class="[
                      'w-full text-left px-3 py-2 rounded-md transition-colors flex items-center space-x-3 text-sm',
                      isActiveRoute(child)
                        ? 'bg-primary/10 text-primary'
                        : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                    ]"
                    :title="child.description"
                  >
                    <i :class="`fas fa-${child.icon}`" class="w-3 h-3 flex-shrink-0"></i>
                    <span class="truncate">{{ child.label }}</span>
                    <div v-if="child.isNew" class="flex-shrink-0">
                      <span class="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs bg-blue-100 text-blue-800">
                        New
                      </span>
                    </div>
                  </button>
                </div>

                <!-- Tooltip for collapsed sidebar -->
                <div
                  v-if="isCollapsed && hoveredItem === item.id"
                  class="absolute left-full ml-2 top-0 z-50 bg-popover text-popover-foreground p-3 rounded-md shadow-lg border border-border min-w-max"
                >
                  <div class="font-medium">{{ item.label }}</div>
                  <div v-if="item.description" class="text-sm text-muted-foreground mt-1">
                    {{ item.description }}
                  </div>
                  <div v-if="item.shortcut" class="text-xs text-muted-foreground mt-2">
                    Shortcut: {{ item.shortcut }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </div>

    <!-- Footer Section -->
    <div v-if="!isCollapsed" class="p-4 border-t border-border flex-shrink-0">
      <div class="space-y-2">
        <!-- Laboratory Info -->
        <div v-if="currentLaboratory" class="text-xs text-muted-foreground">
          <div class="flex items-center space-x-2">
            <i class="fas fa-building"></i>
            <span class="truncate">{{ currentLaboratory.name }}</span>
          </div>
          <div class="ml-4 text-xs">{{ currentLaboratory.code }}</div>
        </div>
        
        <!-- Navigation Preferences -->
        <div class="flex items-center justify-between">
          <span class="text-xs text-muted-foreground">Compact Mode</span>
          <button
            @click="navigationStore.navigationPreferences.compactMode = !navigationStore.navigationPreferences.compactMode"
            :class="[
              'relative w-8 h-4 rounded-full transition-colors',
              navigationStore.navigationPreferences.compactMode ? 'bg-primary' : 'bg-muted'
            ]"
          >
            <div
              :class="[
                'absolute top-0.5 w-3 h-3 bg-white rounded-full transition-transform',
                navigationStore.navigationPreferences.compactMode ? 'translate-x-4' : 'translate-x-0.5'
              ]"
            ></div>
          </button>
        </div>
      </div>
    </div>
  </aside>
</template>

<style scoped>
/* Smooth transitions for all interactive elements */
.transition-colors {
  transition-property: color, background-color, border-color;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}

/* Custom scrollbar for navigation */
.overflow-y-auto::-webkit-scrollbar {
  width: 4px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: transparent;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background: hsl(var(--muted-foreground));
  border-radius: 2px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: hsl(var(--foreground));
}

/* Tooltip positioning */
.absolute.left-full {
  pointer-events: none;
}

/* Animation for new badges */
@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
</style>