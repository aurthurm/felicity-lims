<script setup lang="ts">
import { useDocumentStore } from '@/stores/documentStore'
import FolderNavigation from '@/components/document/FolderNavigation.vue'
import RecentDocuments from '@/components/document/RecentDocuments.vue'
import FolderDocuments from '@/components/document/FolderDocuments.vue'
import { Folder } from 'lucide-vue-next'
import { onMounted } from 'vue'

const documentStore = useDocumentStore()

onMounted(() => {
  documentStore.getFolders()
})
</script>

<template>
    <div class="flex h-screen overflow-hidden bg-background">
      <!-- Sidebar -->
      <div class="fixed inset-y-0 left-0 z-20 w-64 transform bg-doc-folder border-r border-border transition-transform duration-300 ease-in-out -translate-x-full lg:relative lg:translate-x-0">
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
  
 