<script setup lang="ts">
import { format } from 'date-fns'
import { File, Copy, Eye, Trash, Edit } from 'lucide-vue-next'
import { useDocumentStore } from '@/stores/documentStore'
import { useRouter } from 'vue-router';
import { IDocument } from '@/models/document';

const props = defineProps<{
  document: IDocument
}>()

const router = useRouter();
const store = useDocumentStore()

// Document Methods
function handleEdit() {
  router.push({ name: 'document-editor', params: { documentId: props.document.uid } });
}

function handlePreview() {
  router.push({ name: 'document-preview', params: { documentId: props.document.uid } });
}

function handleDuplicate() {
  store.duplicateDocument(props.document.uid)
}

function handleDelete() {
  store.deleteDocument(props.document.uid)
}

function formatDate(date: Date) {
  return format(new Date(date), 'MMM d, yyyy')
}
</script>


<template>
  <div class="document-card animate-scale-in group">
    <div class="relative mb-4 rounded-lg overflow-hidden bg-gray-50 aspect-[3/4] flex items-center justify-center">
      <div v-if="document.previewUrl" class="w-full h-full">
        <img 
          :src="document.previewUrl" 
          :alt="document.name" 
          class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        <div class="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
      <File v-else class="text-gray-400 w-12 h-12" />
      
      <div class="absolute inset-0 flex items-center justify-center gap-x-2 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <button 
          @click.stop="handlePreview"
        >
          <div class="h-12 w-12 rounded-full bg-white/90 flex items-center justify-center">
            <Eye class="text-gray-900 w-5 h-5" />
          </div>
        </button>
        <button 
          @click.stop="handleDuplicate" 
        >
          <div class="h-12 w-12 rounded-full bg-white/90 flex items-center justify-center">
            <Copy class="text-gray-900 w-5 h-5" />
          </div>
        </button>
        <button 
          @click.stop="handleEdit" 
        >
          <div class="h-12 w-12 rounded-full bg-white/90 flex items-center justify-center">
            <Edit class="text-gray-900 w-5 h-5" />
          </div>
        </button>
        <button 
          @click.stop="handleDelete" 
        >
          <div class="h-12 w-12 rounded-full bg-white/90 flex items-center justify-center">
            <Trash class="text-gray-900 w-5 h-5" />
          </div>
        </button>
      </div>
    </div>
    
    <div class="flex flex-col">
      <h3 class="font-medium text-sm truncate" :title="document.name">
        {{ document.name }}
      </h3>
      <p class="text-xs text-muted-foreground mt-1">
        {{ formatDate(document.updatedAt) }}
      </p>
    </div>
  </div>
</template>
