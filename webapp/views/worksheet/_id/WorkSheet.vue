<script setup lang="ts">
import { computed, ref } from "vue";
import { useRoute } from "vue-router";
import { useWorksheetStore } from "@/stores/worksheet";
import useWorkSheetComposable from "@/composables/worksheet";

const route = useRoute();
const workshetStore = useWorksheetStore();

const dropdownOpen = ref(false);

workshetStore.fetchWorksheetByUid(route.params?.workSheetUid as string);  
const worksheet = computed(() => {
  const ws = workshetStore.getWorkSheet;
  return ws;
});

const {
  actionWorksheets,
} = useWorkSheetComposable();

const canSubmit = computed(() => {
  if (["pending"].includes(worksheet?.value?.state?.toLowerCase()!)) return true;
  return false;
});
const canApprove = computed(() => {
  if (["awaiting"].includes(worksheet?.value?.state?.toLowerCase()!)) return true;
  return false;
});

</script>

<template>
  <div class="space-y-6">
    <div
      class="bg-background rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 p-6"
      v-motion-slide-top
    >
      <div class="grid grid-cols-12 gap-4">
        <!-- Meta Column -->
        <div class="col-span-12 flex justify-between items-center mb-4">
          <h3 class="text-xl font-semibold text-foreground">{{ worksheet?.worksheetId }}</h3>
          <div class="relative">
            <div @click="dropdownOpen = !dropdownOpen"
              class="hidden md:flex md:items-center space-x-2">
              <button 
                type="button" 
                class="bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm font-medium hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                :aria-expanded="dropdownOpen"
                :aria-haspopup="true"
              >
                {{ worksheet?.state }}
                <font-awesome-icon icon="chevron-down" class="ml-2 text-primary-foreground/70" />
              </button>
            </div>
            <div v-show="dropdownOpen" @click="dropdownOpen = false" class="fixed inset-0 h-full w-full z-10">
            </div>
            <div v-show="dropdownOpen" 
              class="absolute right-0 mt-2 py-2 bg-background rounded-lg shadow-lg border border-border z-20 min-w-[200px]">
              <button v-show="canSubmit" 
                @click="actionWorksheets([worksheet.uid], 'submit')"
                class="w-full text-left px-4 py-2 text-sm text-foreground hover:bg-primary hover:text-primary-foreground transition-colors">
                Submit
              </button>
              <button v-show="canApprove" 
                @click="actionWorksheets([worksheet.uid], 'approve')"
                class="w-full text-left px-4 py-2 text-sm text-foreground hover:bg-primary hover:text-primary-foreground transition-colors">
                Approve
              </button>
            </div>
          </div>
        </div>
        <!-- Summary Column -->
        <div class="col-span-12">
          <div class="border-t border-border pt-4">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="space-y-3">
                <!-- Client Details -->
                <div class="flex items-center">
                  <span class="text-sm font-medium text-muted-foreground w-1/4">Analyst</span>
                  <span class="text-sm text-foreground">{{ worksheet?.analyst?.firstName }}</span>
                </div>
                <div class="flex items-center">
                  <span class="text-sm font-medium text-muted-foreground w-1/4">Instrument</span>
                  <span class="text-sm text-foreground">{{ worksheet?.instrument?.name }}</span>
                </div>
                <div class="flex items-center">
                  <span class="text-sm font-medium text-muted-foreground w-1/4">Method</span>
                  <span class="text-sm text-foreground">{{ worksheet?.method?.name }}</span>
                </div>
              </div>
              <div class="space-y-3">
                <div class="flex items-center">
                  <span class="text-sm font-medium text-muted-foreground w-1/4">Analyses</span>
                  <span class="text-sm text-foreground">{{ worksheet?.analysis?.name }}</span>
                </div>
                <div class="flex items-center">
                  <span class="text-sm font-medium text-muted-foreground w-1/4">Samples</span>
                  <span class="text-sm text-foreground">{{ worksheet?.assignedCount }}</span>
                </div>
                <div class="flex items-center">
                  <span class="text-sm font-medium text-muted-foreground w-1/4">Template</span>
                  <span class="text-sm text-foreground">{{ worksheet?.template?.name }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <router-view />
  </div>
</template>
