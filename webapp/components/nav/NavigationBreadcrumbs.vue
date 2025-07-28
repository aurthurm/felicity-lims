<script setup lang="ts">
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { useNavigationStore } from '@/stores/navigation';
import { useLaboratoryContextStore } from '@/stores/laboratory_context';

interface Props {
  showHome?: boolean;
  maxItems?: number;
  separator?: string;
  showIcons?: boolean;
  compact?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  showHome: true,
  maxItems: 5,
  separator: '/',
  showIcons: true,
  compact: false,
});

const router = useRouter();
const navigationStore = useNavigationStore();
const contextStore = useLaboratoryContextStore();

// Computed properties
const breadcrumbs = computed(() => navigationStore.breadcrumbs);
const currentLaboratory = computed(() => contextStore.context.activeLaboratory);

const processedBreadcrumbs = computed(() => {
  let items = [...breadcrumbs.value];
  
  // Add home if requested and not already present
  if (props.showHome && !items.some(item => item.route === '/')) {
    items.unshift({
      label: 'Home',
      route: '/',
      icon: 'home',
      isActive: false,
    });
  }
  
  // Limit number of items if specified
  if (props.maxItems && items.length > props.maxItems) {
    const firstItem = items[0];
    const lastItems = items.slice(-(props.maxItems - 2));
    items = [
      firstItem,
      {
        label: '...',
        icon: 'ellipsis-h',
        isActive: false,
      },
      ...lastItems,
    ];
  }
  
  return items;
});

// Methods
const navigateTo = (breadcrumb: any) => {
  if (breadcrumb.route && !breadcrumb.isActive) {
    router.push(breadcrumb.route);
  }
};

const goHome = () => {
  router.push('/');
};

const switchLaboratory = () => {
  router.push('/select-laboratory');
};
</script>

<template>
  <nav 
    class="flex items-center space-x-1 text-sm"
    aria-label="Breadcrumb navigation"
    role="navigation"
  >
    <!-- Laboratory Context Badge (if present) -->
    <div 
      v-if="currentLaboratory && !compact"
      class="flex items-center space-x-2 px-3 py-1 bg-primary/10 text-primary rounded-md border border-primary/20"
    >
      <button
        @click="switchLaboratory"
        class="flex items-center space-x-2 hover:bg-primary/20 rounded px-2 py-1 transition-colors"
        :title="`Switch from ${currentLaboratory.name}`"
      >
        <i v-if="showIcons" class="fas fa-building text-xs"></i>
        <span class="font-medium">{{ currentLaboratory.name }}</span>
        <i class="fas fa-chevron-down text-xs"></i>
      </button>
      
      <div class="w-px h-4 bg-primary/30"></div>
    </div>

    <!-- Breadcrumb Items -->
    <ol class="flex items-center space-x-1" role="list">
      <li
        v-for="(breadcrumb, index) in processedBreadcrumbs"
        :key="`breadcrumb-${index}`"
        class="flex items-center"
        role="listitem"
      >
        <!-- Separator (except for first item) -->
        <span 
          v-if="index > 0"
          class="mx-2 text-muted-foreground"
          aria-hidden="true"
        >
          <i v-if="separator === '/'" class="fas fa-chevron-right text-xs"></i>
          <span v-else>{{ separator }}</span>
        </span>

        <!-- Breadcrumb Item -->
        <div class="flex items-center">
          <!-- Clickable breadcrumb -->
          <button
            v-if="breadcrumb.route && !breadcrumb.isActive"
            @click="navigateTo(breadcrumb)"
            :class="[
              'flex items-center space-x-2 px-2 py-1 rounded-md transition-colors hover:bg-accent hover:text-accent-foreground',
              compact ? 'text-xs' : 'text-sm',
              breadcrumb.label === '...' 
                ? 'text-muted-foreground cursor-default' 
                : 'text-foreground hover:text-accent-foreground'
            ]"
            :aria-label="`Navigate to ${breadcrumb.label}`"
            :disabled="breadcrumb.label === '...'"
          >
            <i 
              v-if="showIcons && breadcrumb.icon" 
              :class="`fas fa-${breadcrumb.icon}`"
              class="text-xs"
              aria-hidden="true"
            ></i>
            <span>{{ breadcrumb.label }}</span>
          </button>

          <!-- Active breadcrumb (current page) -->
          <div
            v-else
            :class="[
              'flex items-center space-x-2 px-2 py-1 font-medium',
              compact ? 'text-xs' : 'text-sm',
              breadcrumb.isActive 
                ? 'text-primary' 
                : 'text-muted-foreground'
            ]"
            :aria-current="breadcrumb.isActive ? 'page' : undefined"
          >
            <i 
              v-if="showIcons && breadcrumb.icon" 
              :class="`fas fa-${breadcrumb.icon}`"
              class="text-xs"
              aria-hidden="true"
            ></i>
            <span>{{ breadcrumb.label }}</span>
          </div>

          <!-- Context Data Display (if available) -->
          <div 
            v-if="breadcrumb.contextData && !compact"
            class="ml-2 px-2 py-1 bg-muted text-muted-foreground text-xs rounded"
            :title="JSON.stringify(breadcrumb.contextData, null, 2)"
          >
            <i class="fas fa-info-circle"></i>
          </div>
        </div>
      </li>
    </ol>

    <!-- Quick Actions -->
    <div v-if="!compact" class="ml-4 flex items-center space-x-2">
      <!-- Refresh Current Page -->
      <button
        @click="router.go(0)"
        class="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
        title="Refresh page"
        aria-label="Refresh current page"
      >
        <i class="fas fa-refresh text-xs"></i>
      </button>

      <!-- Copy Current URL -->
      <button
        @click="navigator.clipboard?.writeText(window.location.href)"
        class="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
        title="Copy page URL"
        aria-label="Copy current page URL"
      >
        <i class="fas fa-link text-xs"></i>
      </button>
    </div>
  </nav>
</template>

<style scoped>
/* Hover animations */
.transition-colors {
  transition-property: color, background-color, border-color;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}

/* Breadcrumb separator animation */
.fa-chevron-right {
  transition: transform 0.2s ease;
}

li:hover .fa-chevron-right {
  transform: translateX(1px);
}

/* Active breadcrumb styling */
[aria-current="page"] {
  position: relative;
}

[aria-current="page"]::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  right: 0;
  height: 2px;
  background: hsl(var(--primary));
  border-radius: 1px;
}

/* Laboratory context badge animation */
.bg-primary\/10 {
  background-color: hsl(var(--primary) / 0.1);
}

.border-primary\/20 {
  border-color: hsl(var(--primary) / 0.2);
}

.hover\:bg-primary\/20:hover {
  background-color: hsl(var(--primary) / 0.2);
}

.bg-primary\/30 {
  background-color: hsl(var(--primary) / 0.3);
}
</style>