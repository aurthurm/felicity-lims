<script setup lang="ts">
import { format } from 'date-fns'
import { File, Edit } from 'lucide-vue-next'
import { useRouter } from 'vue-router';
import { IDocument } from '@/models/document';
import DocumentCard from './DocumentCard.vue'
import { ref } from 'vue';

defineProps<{documents: IDocument[]}>()

const isCardView = ref(false)

function formatDate(date: Date) {
  return format(new Date(date), 'MMM d, yyyy')
}

// Document Methods
const router = useRouter()

function handleEdit(document: IDocument) {
  router.push({ name: 'document-editor', params: { documentVersionUid: document?.latestVersion?.uid } });
}

</script>

<template>

  <div v-if="isCardView" class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
    <DocumentCard v-for="document in documents" 
      :key="document.id" 
      :document="document" 
    />
  </div>

  <div v-else class="overflow-x-auto rounded-xl shadow">
    <table class="min-w-full bg-background border border-border">
      <thead class="bg-secondary">
        <tr>
        <th class="py-3 px-4 text-left text-sm font-semibold text-foreground">Name</th>
          <th class="py-3 px-4 text-left text-sm font-semibold text-foreground">Created At</th>
          <th class="py-3 px-4 text-left text-sm font-semibold text-foreground">Updated At</th>
          <th class="py-3 px-4 text-left text-sm font-semibold text-foreground">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="doc in documents" :key="doc.uid" class="border-t border-border hover:bg-background transition">
          <td class="px-4 text-sm font-medium text-foreground font-semibold" @click.stop="handleEdit(doc)">{{ doc.name }}</td>
          <td class="px-4 text-sm text-muted-foreground">{{ formatDate(doc.createdAt) }}</td>
          <td class="px-4 text-sm text-muted-foreground">{{ formatDate(doc.updatedAt) }}</td>
          <td class="px-4 text-sm">
            <button @click.stop="handleEdit(doc)">
              <div class="h-8 w-8 rounded-full bg-background/90 flex items-center justify-center">
                <Edit class="text-foreground w-5 h-5" />
              </div>
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>

</template>
