<script setup lang="ts">
import { ref, onMounted, defineAsyncComponent } from 'vue';
import { useDocumentStore } from '@/stores/document';
import { Folder } from 'lucide-vue-next';
import { storeToRefs } from 'pinia';

// Lazy load components
const FolderNavigation = defineAsyncComponent(
  () => import('@/components/document/FolderNavigation.vue')
);
const RecentDocuments = defineAsyncComponent(
  () => import('@/components/document/RecentDocuments.vue')
);
const FolderDocuments = defineAsyncComponent(
  () => import('@/components/document/FolderDocuments.vue')
);

// Initialize store
const documentStore = useDocumentStore();
const { currentFolder } = storeToRefs(documentStore);

// Local state
const isSidebarOpen = ref(false);

// Methods
const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value;
};

// Lifecycle hooks
onMounted(async () => {
  try {
    await documentStore.getFolders();
  } catch (error) {
    console.error('Error fetching folders:', error);
  }
});
</script>

<template>
    <fel-heading title="Documents" />

    <div class="flex overflow-hidden">
      <!-- Sidebar -->
      <div
        class="fixed inset-y-0 left-0 z-10 w-64 transform bg-doc-folder border-r border-border transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0"
        :class="{ '-translate-x-full': !isSidebarOpen }"
      >
        <FolderNavigation />
      </div>

      <!-- Main content -->
      <div class="flex-1 overflow-hidden">
        <!-- Mobile header -->
        <div class="lg:hidden p-4 flex items-center border-b border-border">
          <button
            class="mr-4 p-2 rounded-md border border-border hover:bg-accent"
            @click="toggleSidebar"
          >
            <Folder class="h-5 w-5" />
          </button>
          <h1 class="text-xl font-semibold text-foreground">Document Manager</h1>
        </div>

        <!-- Content area -->
        <div class="h-full overflow-auto p-6">
          <RecentDocuments v-if="!currentFolder" />
          <FolderDocuments v-else />
        </div>
      </div>
    </div>
</template>
  
 