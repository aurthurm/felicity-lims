<script setup lang="ts">
import { ref, computed } from 'vue'
import { Folder, Plus } from 'lucide-vue-next'
import { useDocumentStore } from '@/stores/documentStore'
import DocumentListing from './DocumentListing.vue'
import CreateDocumentDialog from './CreateDocumentDialog.vue'

const store = useDocumentStore()
const isDialogOpen = ref(false)

const documents = computed(() => {
  if (!store.currentFolder) return []
  return store.getDocumentsInFolder(store.currentFolder)
})

const currentFolder = computed(() => {
  return store.folders.find(folder => folder.uid === store.currentFolder)
})

function openCreateDocumentDialog() {
  isDialogOpen.value = true
}
</script>

<template>
  <div class="animate-fade-in" role="region" aria-label="Folder documents">
    <div class="flex items-center justify-between mb-6" v-if="currentFolder">
      <div class="flex items-center">
        <Folder class="mr-2 text-muted-foreground w-5 h-5" aria-hidden="true" />
        <h1 class="text-2xl font-semibold text-card-foreground">{{ currentFolder.name }}</h1>
      </div>
      <button 
        @click="openCreateDocumentDialog" 
        class="inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
        aria-label="Create new document in this folder"
      >
        <Plus class="w-4 h-4" aria-hidden="true" />
        New Document
      </button>
    </div>
    
    <div v-if="documents.length > 0">
      <DocumentListing :documents="documents" />
    </div>

    <div 
      v-else 
      class="flex flex-col items-center justify-center py-12 text-center bg-card rounded-lg border border-border"
      role="status"
      aria-label="No documents in this folder"
    >
      <button 
        class="h-20 w-20 rounded-full bg-muted flex items-center justify-center mb-4 transition-all hover:bg-accent hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" 
        @click="openCreateDocumentDialog"
        aria-label="Create new document in this folder"
      >
        <Plus class="text-muted-foreground w-8 h-8" aria-hidden="true" />
      </button>
      <h2 class="text-lg font-medium text-card-foreground mb-2">No documents in this folder</h2>
      <p class="text-muted-foreground max-w-md mb-6">
        Create a new document in this folder.
      </p>
      <button 
        @click="openCreateDocumentDialog" 
        class="inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
        aria-label="Create new document in this folder"
      >
        Create Document
      </button>
    </div>

    <CreateDocumentDialog 
      v-model:isOpen="isDialogOpen"
      :initialFolderId="store.currentFolder"
    />
  </div>
</template>


