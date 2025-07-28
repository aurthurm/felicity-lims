<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useNavigationStore } from '@/stores/navigation';
import { useLaboratoryContextStore } from '@/stores/laboratory_context';
import NavigationMainEnhanced from '@/components/nav/NavigationMainEnhanced.vue';
import NavigationSidebar from '@/components/nav/NavigationSidebar.vue';
import LaboratoryContextGuard from '@/components/ui/LaboratoryContextGuard.vue';

interface Props {
  showSidebar?: boolean;
  requireLaboratory?: boolean;
  allowedLaboratories?: string[];
  fullWidth?: boolean;
  paddingClass?: string;
}

const props = withDefaults(defineProps<Props>(), {
  showSidebar: true,
  requireLaboratory: false,
  allowedLaboratories: () => [],
  fullWidth: false,
  paddingClass: 'p-6',
});

const route = useRoute();
const navigationStore = useNavigationStore();
const contextStore = useLaboratoryContextStore();

// Local state
const isLoading = ref(true);

// Computed properties
const isCollapsed = computed(() => navigationStore.isCollapsed);
const currentLaboratory = computed(() => contextStore.context.activeLaboratory);
const showSidebarForRoute = computed(() => {
  // Don't show sidebar on auth pages or standalone pages
  const noSidebarRoutes = [
    '/auth/login',
    '/auth/register', 
    '/select-laboratory',
    '/unauthorized',
    '/404',
    '/500',
  ];
  
  return props.showSidebar && !noSidebarRoutes.includes(route.path);
});

const layoutClasses = computed(() => {
  const classes = ['min-h-screen', 'bg-background', 'flex', 'flex-col'];
  
  return classes.join(' ');
});

const mainContentClasses = computed(() => {
  const classes = ['flex-1', 'flex'];
  
  return classes.join(' ');
});

const contentAreaClasses = computed(() => {
  const classes = ['flex-1', 'overflow-auto'];
  
  if (!props.fullWidth) {
    classes.push('max-w-full');
  }
  
  return classes.join(' ');
});

const contentPaddingClasses = computed(() => {
  if (props.paddingClass === 'none') return '';
  return props.paddingClass;
});

// Methods
const handleSidebarToggle = () => {
  navigationStore.toggleCollapsed();
};

// Lifecycle
onMounted(() => {
  // Simulate initial loading
  setTimeout(() => {
    isLoading.value = false;
  }, 500);
});

// Watch for route changes to update loading state
watch(() => route.path, () => {
  isLoading.value = true;
  setTimeout(() => {
    isLoading.value = false;
  }, 200);
});
</script>

<template>
  <div :class="layoutClasses">
    <!-- Main Navigation Header -->
    <NavigationMainEnhanced />
    
    <!-- Main Content Area -->
    <main :class="mainContentClasses">
      <!-- Sidebar Navigation -->
      <NavigationSidebar v-if="showSidebarForRoute" />
      
      <!-- Content Area -->
      <div :class="contentAreaClasses">
        <!-- Loading State -->
        <div v-if="isLoading" class="flex items-center justify-center py-12">
          <div class="text-center space-y-4">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p class="text-muted-foreground">Loading...</p>
          </div>
        </div>
        
        <!-- Laboratory Context Guard (when required) -->
        <LaboratoryContextGuard
          v-else-if="props.requireLaboratory || route.meta?.requiresLaboratory"
          :require-laboratory="props.requireLaboratory"
          :allowed-laboratories="props.allowedLaboratories"
          redirect-to="/select-laboratory"
          show-fallback
        >
          <div :class="contentPaddingClasses">
            <slot></slot>
          </div>
        </LaboratoryContextGuard>
        
        <!-- Regular Content (no laboratory context required) -->
        <div v-else :class="contentPaddingClasses">
          <slot></slot>
        </div>
        
        <!-- Page Footer (optional) -->
        <footer v-if="$slots.footer" class="mt-auto border-t border-border bg-muted/30">
          <div :class="contentPaddingClasses">
            <slot name="footer"></slot>
          </div>
        </footer>
      </div>
    </main>
    
    <!-- Global Components -->
    
    <!-- Quick Navigation Overlay (Ctrl+K) -->
    <teleport to="body">
      <div
        v-if="navigationStore.searchQuery && showSidebarForRoute"
        class="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm"
        @click="navigationStore.clearSearch()"
      >
        <div class="fixed top-1/4 left-1/2 transform -translate-x-1/2 w-full max-w-lg">
          <div class="bg-popover text-popover-foreground rounded-lg shadow-xl border border-border">
            <!-- Search Header -->
            <div class="p-4 border-b border-border">
              <div class="relative">
                <input
                  :value="navigationStore.searchQuery"
                  @input="navigationStore.setSearchQuery($event.target.value)"
                  type="text"
                  placeholder="Search navigation..."
                  class="w-full pl-10 pr-4 py-3 text-lg bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                  autofocus
                />
                <i class="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"></i>
                <button
                  @click="navigationStore.clearSearch()"
                  class="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 rounded hover:bg-accent"
                >
                  <i class="fas fa-times text-muted-foreground"></i>
                </button>
              </div>
            </div>
            
            <!-- Search Results -->
            <div class="max-h-80 overflow-y-auto">
              <div
                v-for="item in navigationStore.filteredNavigation.slice(0, 10)"
                :key="`search-${item.id}`"
                @click="$router.push(navigationStore.getRouteWithContext(item)); navigationStore.clearSearch()"
                class="flex items-center px-4 py-3 hover:bg-accent cursor-pointer border-b border-border last:border-b-0"
              >
                <i :class="`fas fa-${item.icon}`" class="w-5 mr-4 text-muted-foreground"></i>
                <div class="flex-1">
                  <div class="font-medium">{{ item.label }}</div>
                  <div v-if="item.description" class="text-sm text-muted-foreground">
                    {{ item.description }}
                  </div>
                </div>
                <div v-if="item.shortcut" class="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
                  {{ item.shortcut }}
                </div>
              </div>
              
              <div v-if="navigationStore.filteredNavigation.length === 0" class="p-8 text-center">
                <i class="fas fa-search text-2xl text-muted-foreground mb-2"></i>
                <p class="text-muted-foreground">No results found</p>
              </div>
            </div>
            
            <!-- Search Footer -->
            <div class="p-3 border-t border-border bg-muted/50 text-xs text-muted-foreground">
              <div class="flex items-center justify-between">
                <span>Press <kbd class="px-1 py-0.5 bg-background border border-border rounded">Enter</kbd> to navigate</span>
                <span>Press <kbd class="px-1 py-0.5 bg-background border border-border rounded">Esc</kbd> to close</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </teleport>
    
    <!-- Laboratory Context Status (Development only) -->
    <div
      v-if="import.meta.env.DEV && currentLaboratory"
      class="fixed bottom-4 left-4 p-2 bg-gray-900 text-white text-xs rounded-md max-w-xs z-30"
    >
      <div><strong>Lab Context:</strong></div>
      <div>{{ currentLaboratory.name }} ({{ currentLaboratory.code }})</div>
      <div class="mt-1 text-gray-400">
        Sidebar: {{ showSidebarForRoute ? 'Yes' : 'No' }}<br>
        Collapsed: {{ isCollapsed ? 'Yes' : 'No' }}
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Loading animation */
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.animate-spin {
  animation: spin 1s linear infinite;
}

/* Backdrop blur */
.backdrop-blur-sm {
  backdrop-filter: blur(4px);
}

/* Keyboard shortcut styling */
kbd {
  font-family: inherit;
  font-size: inherit;
}

/* Smooth transitions */
.transition-all {
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 300ms;
}

/* Focus styles for better accessibility */
.focus\:ring-2:focus {
  outline: 2px solid transparent;
  outline-offset: 2px;
  box-shadow: 0 0 0 2px hsl(var(--ring));
}

/* Content area scroll behavior */
.overflow-auto {
  scrollbar-width: thin;
  scrollbar-color: hsl(var(--muted-foreground)) transparent;
}

.overflow-auto::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

.overflow-auto::-webkit-scrollbar-track {
  background: transparent;
}

.overflow-auto::-webkit-scrollbar-thumb {
  background: hsl(var(--muted-foreground));
  border-radius: 3px;
}

.overflow-auto::-webkit-scrollbar-thumb:hover {
  background: hsl(var(--foreground));
}

/* Layout responsiveness */
@media (max-width: 768px) {
  .flex-col {
    min-height: 100vh;
  }
}

/* Print styles */
@media print {
  .fixed,
  nav,
  aside,
  .no-print {
    display: none !important;
  }
  
  main {
    padding: 0 !important;
    margin: 0 !important;
  }
}
</style>