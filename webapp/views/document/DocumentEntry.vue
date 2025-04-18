<script setup lang="ts">
import { useDocumentStore } from '@/stores/documentStore'
import { Folder } from 'lucide-vue-next'
import { onMounted, defineAsyncComponent } from 'vue'
const PageHeader = defineAsyncComponent(
    () => import("@/components/common/FelPageHeading.vue")
)
const FolderNavigation = defineAsyncComponent(
    () => import("@/components/document/FolderNavigation.vue")
)
const RecentDocuments = defineAsyncComponent(
    () => import("@/components/document/RecentDocuments.vue")
)
const FolderDocuments = defineAsyncComponent(
    () => import("@/components/document/FolderDocuments.vue")
)

const documentStore = useDocumentStore()

onMounted(() => {
  documentStore.getFolders()
})
</script>

<template>
  <PageHeader title="Documents" />

  <div class="flex h-screen overflow-hidden bg-background">
    <!-- Sidebar z-20 -->
    <div class="fixed inset-y-0 left-0 w-64 transform bg-doc-folder border-r border-border transition-transform duration-300 ease-in-out -translate-x-full lg:relative lg:translate-x-0">
      <FolderNavigation />
    </div>
    
    <!-- Main content -->
    <div class="flex-1 overflow-hidden">
      <!-- Mobile sidebar toggle -->
      <div class="lg:hidden p-4 flex items-center">
        <button class="mr-4 border border-border rounded-md p-2">
          <Folder class="h-5 w-5" />
        </button>
        <h1 class="text-xl font-medium">Document Manager</h1>
      </div>

      <div class="h-full overflow-auto p-6">
        <RecentDocuments v-if="!documentStore.currentFolder" />
        <FolderDocuments v-else />
      </div>
    </div>
    
  </div>
</template>
  
 