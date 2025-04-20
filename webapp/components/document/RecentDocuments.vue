<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Plus } from 'lucide-vue-next'
import { useDocumentStore } from '@/stores/documentStore'
import CreateDocumentDialog from './CreateDocumentDialog.vue'
import DocumentListing from './DocumentListing.vue'

const store = useDocumentStore()
const isDialogOpen = ref(false)

function openCreateDocumentDialog() {
  isDialogOpen.value = true
}

onMounted(() => store.fetchDocuments({first:25, sortBy:["-updated_at"]},true))
</script>

<template>
  <div class="animate-fade-in" role="region" aria-label="Recent documents">
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-2xl font-medium text-card-foreground">Recent Documents</h1>
      <button 
        @click="openCreateDocumentDialog" 
        class="inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
        aria-label="Create new document"
      >
        <Plus class="w-4 h-4" aria-hidden="true" />
        New Document
      </button>
    </div>
    
    <div v-if="store.recentDocuments.length > 0">
      <DocumentListing :documents="store.recentDocuments" />
    </div>
    
    <div 
      v-else 
      class="flex flex-col items-center justify-center py-12 text-center"
      role="status"
      aria-label="No recent documents"
    >
      <div class="h-20 w-20 rounded-full bg-muted flex items-center justify-center mb-4">
        <Plus class="text-muted-foreground w-8 h-8" aria-hidden="true" />
      </div>
      <h3 class="text-lg font-medium mb-2 text-card-foreground">No recent documents</h3>
      <p class="text-muted-foreground max-w-md mb-6">
        Start creating documents to see them appear here.
      </p>
      <button 
        @click="openCreateDocumentDialog" 
        class="inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
        aria-label="Create new document"
      >
        Create Document
      </button>
    </div>

    <CreateDocumentDialog v-model:isOpen="isDialogOpen" />
  </div>
</template>


