<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { Folder, Plus } from 'lucide-vue-next'
import { useDocumentStore } from '@/stores/documentStore'
import DocumentCard from './DocumentCard.vue'
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
  <div class="animate-fade-in">
    <div class="flex items-center justify-between mb-6" v-if="currentFolder">
      <div class="flex items-center">
        <Folder class="mr-2 text-muted-foreground w-5 h-5" />
        <h1 class="text-2xl font-medium">{{ currentFolder.name }}</h1>
      </div>
      <button @click="openCreateDocumentDialog" class="inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2">
        <Plus class="w-4 h-4" />
        New Document
      </button>
    </div>
    
    <div v-if="documents.length > 0" class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
      <DocumentCard 
        v-for="document in documents" 
        :key="document.id" 
        :document="document" 
      />
    </div>
    <div v-else class="flex flex-col items-center justify-center py-12 text-center">
      <div 
      class="h-20 w-20 rounded-full bg-muted flex items-center justify-center mb-4" 
      @click="openCreateDocumentDialog">
        <Plus class="text-muted-foreground w-8 h-8" />
      </div>
      <h3 class="text-lg font-medium mb-2">No documents in this folder</h3>
      <p class="text-muted-foreground max-w-md mb-6">
        Create a new document in this folder.
      </p>
      <button @click="openCreateDocumentDialog" class="inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2">
        Create Document
      </button>
    </div>

    <CreateDocumentDialog 
      v-model:isOpen="isDialogOpen"
      :initialFolderId="store.currentFolder"
    />
  </div>
</template>


