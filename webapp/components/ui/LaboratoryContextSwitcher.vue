<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from "vue";
import { useLaboratoryContextStore } from "@/stores/laboratory_context";
import { useAuthStore } from "@/stores/auth";
import { LaboratoryType } from "@/types/gql";

interface Props {
  compact?: boolean;
  showHistory?: boolean;
  showFrequent?: boolean;
  position?: 'left' | 'right';
}

const props = withDefaults(defineProps<Props>(), {
  compact: false,
  showHistory: true,
  showFrequent: true,
  position: 'right',
});

const contextStore = useLaboratoryContextStore();
const authStore = useAuthStore();

const isDropdownOpen = ref(false);
const searchQuery = ref("");
const dropdownRef = ref<HTMLElement | null>(null);

// Computed properties
const currentLaboratory = computed(() => contextStore.context.activeLaboratory);
const availableLaboratories = computed(() => contextStore.context.availableLaboratories);
const isContextSwitching = computed(() => contextStore.context.contextSwitching);
const hasMultipleLabs = computed(() => contextStore.hasMultipleLaboratories);
const canSwitch = computed(() => contextStore.canSwitchContext);

const filteredLaboratories = computed(() => {
  if (!searchQuery.value) return availableLaboratories.value;
  
  const query = searchQuery.value.toLowerCase();
  return availableLaboratories.value.filter(lab => 
    lab.name.toLowerCase().includes(query) ||
    lab.code.toLowerCase().includes(query)
  );
});

const frequentLaboratories = computed(() => {
  if (!props.showFrequent) return [];
  return contextStore.getFrequentLaboratories;
});

const recentLaboratories = computed(() => {
  if (!props.showHistory) return [];
  return contextStore.getRecentLaboratories;
});

const contextHistory = computed(() => {
  if (!props.showHistory) return [];
  return contextStore.getContextHistory.slice(0, 5); // Show last 5
});

// Methods
const toggleDropdown = () => {
  if (!canSwitch.value) return;
  isDropdownOpen.value = !isDropdownOpen.value;
  if (isDropdownOpen.value) {
    searchQuery.value = "";
  }
};

const closeDropdown = () => {
  isDropdownOpen.value = false;
  searchQuery.value = "";
};

const switchToLaboratory = async (laboratory: LaboratoryType) => {
  if (laboratory.uid === currentLaboratory.value?.uid) {
    closeDropdown();
    return;
  }

  const success = await contextStore.switchLaboratory(laboratory.uid);
  if (success) {
    closeDropdown();
  }
};

const refreshLaboratories = async () => {
  await contextStore.refreshLaboratories();
};

const formatTimeAgo = (date: Date): string => {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  
  return date.toLocaleDateString();
};

const formatSessionDuration = (minutes?: number): string => {
  if (!minutes) return '';
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  const remainingMins = minutes % 60;
  return remainingMins > 0 ? `${hours}h ${remainingMins}m` : `${hours}h`;
};

// Click outside handler
const handleClickOutside = (event: MouseEvent) => {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target as Node)) {
    closeDropdown();
  }
};

// Keyboard navigation
const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Escape') {
    closeDropdown();
  }
};

// Lifecycle
onMounted(() => {
  document.addEventListener('click', handleClickOutside);
  document.addEventListener('keydown', handleKeydown);
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
  document.removeEventListener('keydown', handleKeydown);
});
</script>

<template>
  <div v-if="hasMultipleLabs" class="relative" ref="dropdownRef">
    <!-- Trigger Button -->
    <button
      @click="toggleDropdown"
      :disabled="!canSwitch"
      :class="[
        'flex items-center space-x-2 px-3 py-2 rounded-md transition-all duration-200',
        'hover:bg-accent hover:text-accent-foreground',
        'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        compact ? 'text-sm' : 'text-base',
        isDropdownOpen ? 'bg-accent text-accent-foreground' : 'bg-background text-foreground',
        'border border-input'
      ]"
      :title="currentLaboratory ? `Current: ${currentLaboratory.name}` : 'Select Laboratory'"
    >
      <!-- Laboratory Icon -->
      <div class="flex items-center space-x-2">
        <div :class="[
          'w-2 h-2 rounded-full',
          currentLaboratory ? 'bg-green-500' : 'bg-gray-400'
        ]"></div>
        
        <!-- Laboratory Info -->
        <div class="flex flex-col items-start" v-if="!compact && currentLaboratory">
          <span class="font-medium text-sm leading-none">{{ currentLaboratory.name }}</span>
          <span class="text-xs text-muted-foreground">{{ currentLaboratory.code }}</span>
        </div>
        
        <div v-else-if="currentLaboratory" class="flex items-center">
          <span :class="compact ? 'text-sm' : 'text-base'">{{ currentLaboratory.code }}</span>
        </div>
        
        <span v-else class="text-sm text-muted-foreground">No Lab Selected</span>
      </div>

      <!-- Loading Spinner -->
      <div v-if="isContextSwitching" class="ml-2">
        <i class="fas fa-spinner fa-spin text-sm"></i>
      </div>
      
      <!-- Dropdown Arrow -->
      <i v-else :class="[
        'fas transition-transform duration-200',
        isDropdownOpen ? 'fa-chevron-up' : 'fa-chevron-down'
      ]"></i>
    </button>

    <!-- Dropdown Menu -->
    <div
      v-if="isDropdownOpen"
      :class="[
        'absolute z-50 mt-2 w-80 bg-popover border border-border rounded-md shadow-lg',
        'max-h-96 overflow-hidden',
        position === 'right' ? 'right-0' : 'left-0'
      ]"
    >
      <!-- Header with Search -->
      <div class="p-3 border-b border-border">
        <div class="flex items-center justify-between mb-3">
          <h3 class="font-medium text-sm">Switch Laboratory</h3>
          <button
            @click="refreshLaboratories"
            class="p-1 hover:bg-accent rounded text-muted-foreground hover:text-foreground"
            title="Refresh laboratories"
          >
            <i class="fas fa-refresh text-xs"></i>
          </button>
        </div>
        
        <div class="relative">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search laboratories..."
            class="w-full pl-8 pr-3 py-2 text-sm bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
          />
          <i class="fas fa-search absolute left-2.5 top-2.5 text-xs text-muted-foreground"></i>
        </div>
      </div>

      <!-- Content -->
      <div class="max-h-64 overflow-y-auto">
        <!-- Current Laboratory -->
        <div v-if="currentLaboratory" class="p-3 border-b border-border bg-muted/50">
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-3">
              <div class="w-2 h-2 rounded-full bg-green-500"></div>
              <div>
                <div class="font-medium text-sm">{{ currentLaboratory.name }}</div>
                <div class="text-xs text-muted-foreground">{{ currentLaboratory.code }} • Current</div>
              </div>
            </div>
            <i class="fas fa-check text-green-500 text-sm"></i>
          </div>
        </div>

        <!-- Frequent Laboratories -->
        <div v-if="frequentLaboratories.length > 0 && !searchQuery" class="p-3 border-b border-border">
          <h4 class="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wide">Frequently Used</h4>
          <div class="space-y-1">
            <button
              v-for="lab in frequentLaboratories"
              :key="`frequent-${lab.uid}`"
              @click="switchToLaboratory(lab)"
              :disabled="lab.uid === currentLaboratory?.uid"
              class="w-full flex items-center space-x-3 p-2 rounded hover:bg-accent text-left disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div class="w-2 h-2 rounded-full bg-blue-500"></div>
              <div class="flex-1">
                <div class="text-sm font-medium">{{ lab.name }}</div>
                <div class="text-xs text-muted-foreground">{{ lab.code }}</div>
              </div>
              <i class="fas fa-star text-xs text-yellow-500"></i>
            </button>
          </div>
        </div>

        <!-- Recent Laboratories -->
        <div v-if="recentLaboratories.length > 0 && !searchQuery" class="p-3 border-b border-border">
          <h4 class="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wide">Recently Used</h4>
          <div class="space-y-1">
            <button
              v-for="lab in recentLaboratories"
              :key="`recent-${lab.uid}`"
              @click="switchToLaboratory(lab)"
              :disabled="lab.uid === currentLaboratory?.uid"
              class="w-full flex items-center space-x-3 p-2 rounded hover:bg-accent text-left disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div class="w-2 h-2 rounded-full bg-orange-500"></div>
              <div class="flex-1">
                <div class="text-sm font-medium">{{ lab.name }}</div>
                <div class="text-xs text-muted-foreground">{{ lab.code }}</div>
              </div>
              <i class="fas fa-clock text-xs text-muted-foreground"></i>
            </button>
          </div>
        </div>

        <!-- All Laboratories -->
        <div class="p-3">
          <h4 v-if="!searchQuery" class="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wide">
            All Laboratories
          </h4>
          <h4 v-else class="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wide">
            Search Results ({{ filteredLaboratories.length }})
          </h4>
          
          <div v-if="filteredLaboratories.length === 0" class="py-4 text-center text-sm text-muted-foreground">
            No laboratories found
          </div>
          
          <div v-else class="space-y-1">
            <button
              v-for="lab in filteredLaboratories"
              :key="`all-${lab.uid}`"
              @click="switchToLaboratory(lab)"
              :disabled="lab.uid === currentLaboratory?.uid"
              class="w-full flex items-center space-x-3 p-2 rounded hover:bg-accent text-left disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div :class="[
                'w-2 h-2 rounded-full',
                lab.uid === currentLaboratory?.uid ? 'bg-green-500' : 'bg-gray-400'
              ]"></div>
              <div class="flex-1">
                <div class="text-sm font-medium">{{ lab.name }}</div>
                <div class="text-xs text-muted-foreground">
                  {{ lab.code }}
                  <span v-if="lab.email"> • {{ lab.email }}</span>
                </div>
              </div>
              <i v-if="lab.uid === currentLaboratory?.uid" class="fas fa-check text-green-500 text-sm"></i>
            </button>
          </div>
        </div>

        <!-- Context History -->
        <div v-if="contextHistory.length > 0 && !searchQuery && props.showHistory" class="p-3 border-t border-border">
          <h4 class="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wide">Session History</h4>
          <div class="space-y-1">
            <div
              v-for="(item, index) in contextHistory"
              :key="`history-${index}`"
              class="flex items-center justify-between p-2 text-xs text-muted-foreground"
            >
              <div class="flex items-center space-x-2">
                <div class="w-1.5 h-1.5 rounded-full bg-gray-400"></div>
                <span>{{ item.laboratoryName }}</span>
              </div>
              <div class="flex items-center space-x-2">
                <span>{{ formatTimeAgo(item.switchTime) }}</span>
                <span v-if="item.sessionDuration" class="text-xs">
                  ({{ formatSessionDuration(item.sessionDuration) }})
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Single Laboratory Display -->
  <div v-else-if="currentLaboratory" :class="[
    'flex items-center space-x-2 px-3 py-2 rounded-md bg-muted/50',
    compact ? 'text-sm' : 'text-base'
  ]">
    <div class="w-2 h-2 rounded-full bg-green-500"></div>
    <div v-if="!compact" class="flex flex-col items-start">
      <span class="font-medium text-sm leading-none">{{ currentLaboratory.name }}</span>
      <span class="text-xs text-muted-foreground">{{ currentLaboratory.code }}</span>
    </div>
    <span v-else>{{ currentLaboratory.code }}</span>
  </div>

  <!-- No Laboratory -->
  <div v-else class="flex items-center space-x-2 px-3 py-2 rounded-md bg-muted/50 text-muted-foreground">
    <div class="w-2 h-2 rounded-full bg-gray-400"></div>
    <span class="text-sm">No Laboratory Access</span>
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Custom scrollbar */
.overflow-y-auto::-webkit-scrollbar {
  width: 4px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: transparent;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.2);
  border-radius: 2px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: rgba(0, 0, 0, 0.3);
}
</style>