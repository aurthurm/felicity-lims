<script setup lang="ts">
import { format } from 'date-fns'
import { File, Edit } from 'lucide-vue-next'
import { useRouter } from 'vue-router';
import { DocumentType } from '@/types/gql';

interface Props {
  document: DocumentType;
}

const props = defineProps<Props>();
const router = useRouter();

// Document Methods
function handleEdit() {
  router.push({ 
    name: 'document-editor', 
    params: { documentVersionUid: props.document?.latestVersion?.uid } 
  });
}

function formatDate(date: Date | string) {
  return format(new Date(date), 'MMM d, yyyy');
}
</script>

<template>
  <div 
    class="document-card animate-scale-in group bg-card rounded-lg border border-border p-4 transition-all hover:shadow-md hover:border-accent" 
    role="article"
    :aria-label="`Document: ${document.name}`"
  >
    <div class="relative mb-4 rounded-lg overflow-hidden bg-muted aspect-[3/4] flex items-center justify-center">
      <div v-if="document?.latestVersion?.thumbnail" class="w-full h-full">
        <img 
          :src="`data:image/png;base64,${document?.latestVersion?.thumbnail}`" 
          :alt="document.name" 
          class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        <div 
          class="absolute inset-0 bg-gradient-to-t from-foreground/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" 
          aria-hidden="true"
        />
      </div>
      <File v-else class="text-muted-foreground w-12 h-12" aria-hidden="true" />
      
      <div 
        class="absolute inset-0 flex items-center justify-center gap-x-2 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        aria-hidden="true"
      >
        <button 
          @click.stop="handleEdit"
          class="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-full transition-transform hover:scale-105"
          :aria-label="`Edit document: ${document.name}`"
        >
          <div class="h-12 w-12 rounded-full bg-background/90 flex items-center justify-center">
            <Edit class="text-foreground w-5 h-5" aria-hidden="true" />
          </div>
        </button>
      </div>
    </div>
    
    <div class="flex flex-col">
      <h3 class="font-medium text-sm text-card-foreground truncate" :title="document.name">
        {{ document.name }}
      </h3>
      <p class="text-xs text-muted-foreground mt-1">
        Updated {{ formatDate(document.updatedAt) }}
      </p>
    </div>
  </div>
</template>
