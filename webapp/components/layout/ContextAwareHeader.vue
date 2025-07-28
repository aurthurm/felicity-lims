<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { useLaboratoryContextStore } from "@/stores/laboratory_context";
import { useAuthStore } from "@/stores/auth";
import LaboratoryContextSwitcher from "@/components/ui/LaboratoryContextSwitcher.vue";
import LaboratoryContextBadge from "@/components/ui/LaboratoryContextBadge.vue";

interface Props {
  showBreadcrumbs?: boolean;
  showContextSwitcher?: boolean;
  showNotifications?: boolean;
  variant?: 'default' | 'compact' | 'minimal';
}

const props = withDefaults(defineProps<Props>(), {
  showBreadcrumbs: true,
  showContextSwitcher: true,
  showNotifications: true,
  variant: 'default',
});

const contextStore = useLaboratoryContextStore();
const authStore = useAuthStore();

const currentUser = computed(() => authStore.auth.user);
const currentLaboratory = computed(() => contextStore.context.activeLaboratory);
const hasMultipleLabs = computed(() => contextStore.hasMultipleLaboratories);
const isContextSwitching = computed(() => contextStore.context.contextSwitching);

// Notifications (mock for now)
const notifications = ref([
  {
    id: 1,
    type: 'warning',
    message: 'Laboratory context switched to Central Lab',
    timestamp: new Date(),
    read: false,
  },
  {
    id: 2,
    type: 'info', 
    message: 'New samples available for processing',
    timestamp: new Date(Date.now() - 300000), // 5 minutes ago
    read: true,
  },
]);

const unreadNotifications = computed(() => 
  notifications.value.filter(n => !n.read).length
);

// Context switching feedback
const showContextFeedback = ref(false);
const contextFeedbackMessage = ref('');

const handleContextChange = (event: any) => {
  const { newLaboratory, previousLaboratory } = event.detail;
  
  contextFeedbackMessage.value = `Switched from ${previousLaboratory?.name || 'Unknown'} to ${newLaboratory.name}`;
  showContextFeedback.value = true;
  
  // Auto-hide after 3 seconds
  setTimeout(() => {
    showContextFeedback.value = false;
  }, 3000);

  // Add to notifications
  notifications.value.unshift({
    id: Date.now(),
    type: 'info',
    message: `Laboratory context switched to ${newLaboratory.name}`,
    timestamp: new Date(),
    read: false,
  });
};

// Quick actions based on context
const contextQuickActions = computed(() => {
  if (!currentLaboratory.value) return [];
  
  return [
    {
      label: 'Lab Dashboard',
      icon: 'fas fa-tachometer-alt',
      href: `/laboratory/${currentLaboratory.value.uid}/dashboard`,
    },
    {
      label: 'Sample Management',
      icon: 'fas fa-vial',
      href: `/laboratory/${currentLaboratory.value.uid}/samples`,
    },
    {
      label: 'Users & Permissions',
      icon: 'fas fa-users',
      href: `/laboratory/${currentLaboratory.value.uid}/users`,
    },
    {
      label: 'Lab Settings',
      icon: 'fas fa-cog',
      href: `/laboratory/${currentLaboratory.value.uid}/settings`,
    },
  ];
});

onMounted(() => {
  // Listen for context changes
  window.addEventListener('laboratoryContextChanged', handleContextChange);
});
</script>

<template>
  <header :class="[
    'bg-background border-b border-border',
    variant === 'compact' ? 'py-2' : variant === 'minimal' ? 'py-1' : 'py-3'
  ]">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Main Header Content -->
      <div class="flex items-center justify-between">
        <!-- Left Section: Logo & Context -->
        <div class="flex items-center space-x-4">
          <!-- Logo/Brand -->
          <div class="flex items-center space-x-2">
            <div class="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <i class="fas fa-flask text-primary-foreground text-sm"></i>
            </div>
            <span v-if="variant !== 'minimal'" class="font-semibold text-lg text-foreground">
              Felicity LIMS
            </span>
          </div>

          <!-- Context Badge (Always Visible) -->
          <div class="flex items-center space-x-2">
            <div class="h-4 w-px bg-border"></div>
            <LaboratoryContextBadge 
              :size="variant === 'compact' ? 'sm' : 'md'"
              :variant="hasMultipleLabs ? 'default' : 'secondary'"
            />
          </div>

          <!-- Context Switching Feedback -->
          <div 
            v-if="showContextFeedback"
            class="flex items-center space-x-2 px-3 py-1 bg-blue-50 border border-blue-200 rounded-md text-blue-800 text-sm animate-fade-in"
          >
            <i class="fas fa-check-circle text-blue-600"></i>
            <span>{{ contextFeedbackMessage }}</span>
          </div>
        </div>

        <!-- Center Section: Breadcrumbs & Quick Actions -->
        <div v-if="showBreadcrumbs && variant !== 'minimal'" class="flex-1 flex items-center justify-center max-w-lg">
          <nav class="flex items-center space-x-2 text-sm">
            <!-- Laboratory Context Breadcrumb -->
            <div v-if="currentLaboratory" class="flex items-center space-x-2">
              <i class="fas fa-building text-muted-foreground"></i>
              <span class="text-muted-foreground">{{ currentLaboratory.name }}</span>
              
              <!-- Quick Actions Dropdown -->
              <div class="relative group">
                <button class="p-1 rounded hover:bg-accent text-muted-foreground hover:text-foreground">
                  <i class="fas fa-chevron-down text-xs"></i>
                </button>
                
                <div class="absolute top-full left-0 mt-1 w-48 bg-popover border border-border rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <div class="p-2">
                    <div class="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wide">
                      Quick Actions
                    </div>
                    <div class="space-y-1">
                      <a
                        v-for="action in contextQuickActions"
                        :key="action.label"
                        :href="action.href"
                        class="flex items-center space-x-2 px-2 py-1.5 text-sm rounded hover:bg-accent text-foreground hover:text-accent-foreground"
                      >
                        <i :class="action.icon" class="text-xs w-4"></i>
                        <span>{{ action.label }}</span>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </nav>
        </div>

        <!-- Right Section: Context Switcher & User Menu -->
        <div class="flex items-center space-x-4">
          <!-- Context Switcher -->
          <div v-if="showContextSwitcher && hasMultipleLabs">
            <LaboratoryContextSwitcher 
              :compact="variant === 'compact'"
              :position="'right'"
            />
          </div>

          <!-- Notifications -->
          <div v-if="showNotifications && variant !== 'minimal'" class="relative">
            <button class="p-2 rounded-md hover:bg-accent text-muted-foreground hover:text-foreground relative">
              <i class="fas fa-bell"></i>
              <span 
                v-if="unreadNotifications > 0"
                class="absolute -top-1 -right-1 w-5 h-5 bg-destructive text-destructive-foreground text-xs rounded-full flex items-center justify-center"
              >
                {{ unreadNotifications > 9 ? '9+' : unreadNotifications }}
              </span>
            </button>
          </div>

          <!-- User Menu -->
          <div class="relative group">
            <button class="flex items-center space-x-2 p-2 rounded-md hover:bg-accent">
              <div class="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                <span class="text-primary-foreground text-sm font-medium">
                  {{ currentUser?.firstName?.[0] || 'U' }}{{ currentUser?.lastName?.[0] || '' }}
                </span>
              </div>
              <div v-if="variant !== 'compact'" class="text-left">
                <div class="text-sm font-medium text-foreground">
                  {{ currentUser?.firstName }} {{ currentUser?.lastName }}
                </div>
                <div class="text-xs text-muted-foreground">
                  {{ currentUser?.email }}
                </div>
              </div>
              <i class="fas fa-chevron-down text-xs text-muted-foreground"></i>
            </button>

            <!-- User Dropdown -->
            <div class="absolute top-full right-0 mt-1 w-64 bg-popover border border-border rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
              <div class="p-3 border-b border-border">
                <div class="font-medium text-sm">{{ currentUser?.firstName }} {{ currentUser?.lastName }}</div>
                <div class="text-xs text-muted-foreground">{{ currentUser?.email }}</div>
                <div v-if="currentLaboratory" class="text-xs text-muted-foreground mt-1">
                  Active Lab: {{ currentLaboratory.name }}
                </div>
              </div>
              
              <div class="p-2">
                <a href="/profile" class="flex items-center space-x-2 px-2 py-1.5 text-sm rounded hover:bg-accent">
                  <i class="fas fa-user text-xs w-4"></i>
                  <span>Profile Settings</span>
                </a>
                <a href="/preferences" class="flex items-center space-x-2 px-2 py-1.5 text-sm rounded hover:bg-accent">
                  <i class="fas fa-cog text-xs w-4"></i>
                  <span>Preferences</span>
                </a>
                <div class="border-t border-border my-1"></div>
                <button class="w-full flex items-center space-x-2 px-2 py-1.5 text-sm rounded hover:bg-accent text-left">
                  <i class="fas fa-sign-out-alt text-xs w-4"></i>
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Secondary Header (Context Information) -->
      <div v-if="variant === 'default' && currentLaboratory" class="mt-3 pt-3 border-t border-border">
        <div class="flex items-center justify-between">
          <!-- Context Information -->
          <div class="flex items-center space-x-6 text-sm">
            <div class="flex items-center space-x-2">
              <i class="fas fa-map-marker-alt text-muted-foreground"></i>
              <span class="text-muted-foreground">Laboratory:</span>
              <span class="font-medium">{{ currentLaboratory.name }}</span>
              <span class="text-muted-foreground">({{ currentLaboratory.code }})</span>
            </div>
            
            <div v-if="currentLaboratory.email" class="flex items-center space-x-2">
              <i class="fas fa-envelope text-muted-foreground"></i>
              <span class="text-muted-foreground">{{ currentLaboratory.email }}</span>
            </div>

            <div v-if="contextStore.context.lastSwitchTime" class="flex items-center space-x-2">
              <i class="fas fa-clock text-muted-foreground"></i>
              <span class="text-muted-foreground">
                Active since {{ contextStore.context.lastSwitchTime.toLocaleTimeString() }}
              </span>
            </div>
          </div>

          <!-- Context Actions -->
          <div class="flex items-center space-x-2">
            <button 
              @click="contextStore.refreshLaboratories"
              class="p-1 rounded text-muted-foreground hover:text-foreground hover:bg-accent"
              title="Refresh laboratory information"
            >
              <i class="fas fa-refresh text-xs"></i>
            </button>
            
            <div v-if="hasMultipleLabs" class="flex items-center space-x-1 text-xs text-muted-foreground">
              <i class="fas fa-layers"></i>
              <span>{{ contextStore.context.availableLaboratories.length }} labs available</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<style scoped>
@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fade-in 0.3s ease-out;
}

/* Dropdown hover effects */
.group:hover .group-hover\:opacity-100 {
  opacity: 1;
}

.group:hover .group-hover\:visible {
  visibility: visible;
}
</style>