<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useLaboratoryContextStore } from "@/stores/laboratory_context";
import { useAuthStore } from "@/stores/auth";
import { LaboratoryType } from "@/types/gql";

const contextStore = useLaboratoryContextStore();
const authStore = useAuthStore();
const router = useRouter();

const selectedLaboratoryUid = ref<string>("");
const isLoading = ref(false);
const searchQuery = ref("");

// Computed properties
const currentUser = computed(() => authStore.auth.user);
const availableLaboratories = computed(() => contextStore.context.availableLaboratories);
const currentLaboratory = computed(() => contextStore.context.activeLaboratory);

const filteredLaboratories = computed(() => {
  if (!searchQuery.value) return availableLaboratories.value;
  
  const query = searchQuery.value.toLowerCase();
  return availableLaboratories.value.filter(lab => 
    lab.name.toLowerCase().includes(query) ||
    lab.code.toLowerCase().includes(query) ||
    lab.email?.toLowerCase().includes(query)
  );
});

const frequentLaboratories = computed(() => contextStore.getFrequentLaboratories);
const recentLaboratories = computed(() => contextStore.getRecentLaboratories);

const selectedLaboratory = computed(() => 
  availableLaboratories.value.find(lab => lab.uid === selectedLaboratoryUid.value)
);

// Methods
const selectLaboratory = async () => {
  if (!selectedLaboratoryUid.value) return;

  isLoading.value = true;

  try {
    const success = await contextStore.switchLaboratory(selectedLaboratoryUid.value);
    
    if (success) {
      // Redirect to intended destination or dashboard
      const redirectTo = router.currentRoute.value.query.redirect as string || '/dashboard';
      router.push(redirectTo);
    }
  } catch (error) {
    console.error('Error selecting laboratory:', error);
  } finally {
    isLoading.value = false;
  }
};

const quickSelectLaboratory = async (laboratory: LaboratoryType) => {
  selectedLaboratoryUid.value = laboratory.uid;
  await selectLaboratory();
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

// Auto-redirect if user already has valid context
onMounted(() => {
  if (currentLaboratory.value) {
    const redirectTo = router.currentRoute.value.query.redirect as string || '/dashboard';
    router.push(redirectTo);
  }
});
</script>

<template>
  <div class="min-h-screen bg-background flex flex-col">
    <!-- Header -->
    <header class="bg-background border-b border-border py-4">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-3">
            <div class="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <i class="fas fa-flask text-primary-foreground"></i>
            </div>
            <div>
              <h1 class="text-xl font-semibold text-foreground">Felicity LIMS</h1>
              <p class="text-sm text-muted-foreground">Laboratory Information Management System</p>
            </div>
          </div>
          
          <div class="flex items-center space-x-4">
            <button
              @click="refreshLaboratories"
              class="p-2 rounded-md hover:bg-accent text-muted-foreground hover:text-foreground"
              title="Refresh laboratories"
            >
              <i class="fas fa-refresh"></i>
            </button>
            
            <div class="flex items-center space-x-2 text-sm text-muted-foreground">
              <div class="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
                <span class="text-xs font-medium">
                  {{ currentUser?.firstName?.[0] || 'U' }}{{ currentUser?.lastName?.[0] || '' }}
                </span>
              </div>
              <span>{{ currentUser?.firstName }} {{ currentUser?.lastName }}</span>
            </div>
          </div>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="flex-1 flex items-center justify-center py-12">
      <div class="max-w-2xl w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-8">
          <div class="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <i class="fas fa-building text-2xl text-blue-600"></i>
          </div>
          <h2 class="text-2xl font-semibold text-foreground mb-2">Select Laboratory</h2>
          <p class="text-muted-foreground">
            Choose a laboratory to continue working in the system.
          </p>
        </div>

        <!-- Search -->
        <div class="mb-6">
          <div class="relative">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search laboratories by name, code, or email..."
              class="w-full pl-10 pr-4 py-3 border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
            />
            <i class="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"></i>
          </div>
        </div>

        <!-- Quick Access -->
        <div v-if="!searchQuery && (frequentLaboratories.length > 0 || recentLaboratories.length > 0)" class="mb-8 space-y-6">
          <!-- Frequently Used -->
          <div v-if="frequentLaboratories.length > 0">
            <h3 class="text-sm font-medium text-muted-foreground mb-3 uppercase tracking-wide">
              Frequently Used
            </h3>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                v-for="lab in frequentLaboratories.slice(0, 4)"
                :key="`frequent-${lab.uid}`"
                @click="quickSelectLaboratory(lab)"
                :disabled="isLoading"
                class="p-4 border border-input rounded-lg hover:bg-accent text-left transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div class="flex items-center space-x-3">
                  <div class="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div class="flex-1">
                    <div class="font-medium text-sm">{{ lab.name }}</div>
                    <div class="text-xs text-muted-foreground">{{ lab.code }}</div>
                  </div>
                  <i class="fas fa-star text-yellow-500 text-sm"></i>
                </div>
              </button>
            </div>
          </div>

          <!-- Recently Used -->
          <div v-if="recentLaboratories.length > 0">
            <h3 class="text-sm font-medium text-muted-foreground mb-3 uppercase tracking-wide">
              Recently Used
            </h3>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                v-for="lab in recentLaboratories.slice(0, 4)"
                :key="`recent-${lab.uid}`"
                @click="quickSelectLaboratory(lab)"
                :disabled="isLoading"
                class="p-4 border border-input rounded-lg hover:bg-accent text-left transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div class="flex items-center space-x-3">
                  <div class="w-3 h-3 rounded-full bg-orange-500"></div>
                  <div class="flex-1">
                    <div class="font-medium text-sm">{{ lab.name }}</div>
                    <div class="text-xs text-muted-foreground">{{ lab.code }}</div>
                  </div>
                  <i class="fas fa-clock text-muted-foreground text-sm"></i>
                </div>
              </button>
            </div>
          </div>
        </div>

        <!-- All Laboratories -->
        <div class="space-y-4">
          <h3 class="text-sm font-medium text-muted-foreground uppercase tracking-wide">
            {{ searchQuery ? `Search Results (${filteredLaboratories.length})` : 'All Laboratories' }}
          </h3>

          <div v-if="filteredLaboratories.length === 0" class="text-center py-12">
            <div class="w-12 h-12 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <i class="fas fa-search text-muted-foreground"></i>
            </div>
            <p class="text-muted-foreground">No laboratories found matching your search.</p>
          </div>

          <div v-else class="space-y-3">
            <div
              v-for="laboratory in filteredLaboratories"
              :key="laboratory.uid"
              :class="[
                'border border-input rounded-lg p-4 transition-all cursor-pointer',
                selectedLaboratoryUid === laboratory.uid
                  ? 'border-primary bg-primary/5'
                  : 'hover:bg-accent'
              ]"
              @click="selectedLaboratoryUid = laboratory.uid"
            >
              <div class="flex items-center space-x-4">
                <div class="flex-shrink-0">
                  <div :class="[
                    'w-4 h-4 rounded-full border-2 transition-colors',
                    selectedLaboratoryUid === laboratory.uid
                      ? 'border-primary bg-primary'
                      : 'border-muted-foreground'
                  ]">
                    <div v-if="selectedLaboratoryUid === laboratory.uid" class="w-full h-full rounded-full bg-primary"></div>
                  </div>
                </div>
                
                <div class="flex-1">
                  <div class="flex items-center justify-between">
                    <div>
                      <h4 class="font-medium text-foreground">{{ laboratory.name }}</h4>
                      <div class="flex items-center space-x-4 mt-1">
                        <span class="text-sm text-muted-foreground">{{ laboratory.code }}</span>
                        <span v-if="laboratory.email" class="text-sm text-muted-foreground">{{ laboratory.email }}</span>
                      </div>
                    </div>
                    
                    <div class="flex items-center space-x-2">
                      <div v-if="laboratory.uid === currentLaboratory?.uid" class="flex items-center space-x-1 text-green-600">
                        <i class="fas fa-check-circle text-sm"></i>
                        <span class="text-xs">Current</span>
                      </div>
                      
                      <div v-if="frequentLaboratories.some(l => l.uid === laboratory.uid)" class="text-yellow-500" title="Frequently used">
                        <i class="fas fa-star text-sm"></i>
                      </div>
                      
                      <div v-if="recentLaboratories.some(l => l.uid === laboratory.uid)" class="text-orange-500" title="Recently used">
                        <i class="fas fa-clock text-sm"></i>
                      </div>
                    </div>
                  </div>
                  
                  <div v-if="laboratory.organizationUid" class="mt-2 text-xs text-muted-foreground">
                    Organization ID: {{ laboratory.organizationUid }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Selection Summary & Actions -->
        <div v-if="selectedLaboratory" class="mt-8 p-4 bg-muted/50 rounded-lg">
          <div class="flex items-center justify-between">
            <div>
              <h4 class="font-medium text-foreground">Selected Laboratory</h4>
              <div class="flex items-center space-x-4 mt-1 text-sm text-muted-foreground">
                <span>{{ selectedLaboratory.name }}</span>
                <span>{{ selectedLaboratory.code }}</span>
                <span v-if="selectedLaboratory.email">{{ selectedLaboratory.email }}</span>
              </div>
            </div>
            
            <button
              @click="selectLaboratory"
              :disabled="isLoading"
              class="inline-flex items-center px-6 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span v-if="isLoading" class="mr-2">
                <i class="fas fa-spinner fa-spin"></i>
              </span>
              {{ isLoading ? 'Switching...' : 'Continue' }}
            </button>
          </div>
        </div>

        <!-- Help Text -->
        <div class="mt-8 text-center">
          <p class="text-sm text-muted-foreground">
            Need access to additional laboratories? 
            <a href="/contact" class="text-primary hover:underline">Contact your administrator</a>
          </p>
        </div>
      </div>
    </main>

    <!-- Footer -->
    <footer class="border-t border-border py-6">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between text-sm text-muted-foreground">
          <div>
            © 2024 Felicity LIMS. All rights reserved.
          </div>
          <div class="flex items-center space-x-4">
            <span>Available Laboratories: {{ availableLaboratories.length }}</span>
            <span>•</span>
            <a href="/help" class="hover:text-foreground">Help</a>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<style scoped>
/* Custom transitions */
.transition-colors {
  transition-property: color, background-color, border-color;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}

.transition-all {
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}

/* Hover animations */
@keyframes subtle-bounce {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-2px);
  }
}

.hover\:animate-bounce:hover {
  animation: subtle-bounce 0.3s ease-in-out;
}
</style>