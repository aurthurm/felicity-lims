<script setup lang="ts">
import { format } from 'date-fns'
import { File, Edit, LayoutGrid, List } from 'lucide-vue-next'
import { useRouter } from 'vue-router';
import { DocumentType } from '@/types/gql';
import DocumentCard from './DocumentCard.vue'
import { ref } from 'vue';
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyTitle } from "@/components/ui/empty";

defineProps<{documents: DocumentType[]}>()

const isCardView = ref(false)

function formatDate(date: Date) {
  return format(new Date(date), 'MMM d, yyyy')
}

// Document Methods
const router = useRouter()

function handleEdit(document: DocumentType) {
  router.push({ name: 'document-editor', params: { documentVersionUid: document?.latestVersion?.uid } });
}

function toggleView() {
  isCardView.value = !isCardView.value;
}
</script>

<template>
  <div class="space-y-4" role="region" aria-label="Document listing">
    <div class="flex justify-end">
      <button
        @click="toggleView"
        class="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2"
        :aria-label="`Switch to ${isCardView ? 'list' : 'grid'} view`"
        :aria-pressed="isCardView"
      >
        <component :is="isCardView ? List : LayoutGrid" class="w-4 h-4 mr-2" aria-hidden="true" />
        {{ isCardView ? 'List View' : 'Grid View' }}
      </button>
    </div>

    <div v-if="isCardView" class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
      <DocumentCard 
        v-for="document in documents" 
        :key="document.uid" 
        :document="document" 
      />
    </div>

    <div v-else class="border border-border bg-card rounded-lg shadow-md">
      <div class="relative w-full overflow-auto">
        <Table class="w-full caption-bottom text-sm">
          <TableHeader class="[&_tr]:border-b">
            <TableRow class="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
            <TableHead scope="col" class="py-3 px-4 text-left text-sm font-medium text-muted-foreground">Name</TableHead>
            <TableHead scope="col" class="py-3 px-4 text-left text-sm font-medium text-muted-foreground">Created At</TableHead>
            <TableHead scope="col" class="py-3 px-4 text-left text-sm font-medium text-muted-foreground">Updated At</TableHead>
            <TableHead scope="col" class="py-3 px-4 text-left text-sm font-medium text-muted-foreground">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody class="[&_tr:last-child]:border-0">
          <TableRow 
            v-for="doc in documents" 
            :key="doc.uid" 
            class="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
          >
            <TableCell 
              class="px-4 py-3 text-sm font-medium text-card-foreground cursor-pointer hover:text-accent-foreground" 
              @click.stop="handleEdit(doc)"
              role="button"
              :aria-label="`Edit document: ${doc.name}`"
            >
              {{ doc.name }}
            </TableCell>
            <TableCell class="px-4 py-3 text-sm text-muted-foreground">{{ formatDate(doc.createdAt) }}</TableCell>
            <TableCell class="px-4 py-3 text-sm text-muted-foreground">{{ formatDate(doc.updatedAt) }}</TableCell>
            <TableCell class="px-4 py-3 text-sm">
              <button 
                @click.stop="handleEdit(doc)"
                class="inline-flex items-center justify-center rounded-full h-8 w-8 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 hover:bg-accent hover:text-accent-foreground"
                :aria-label="`Edit document: ${doc.name}`"
              >
                <Edit class="w-4 h-4" aria-hidden="true" />
              </button>
            </TableCell>
          </TableRow>
          <TableEmpty v-if="documents.length === 0" :colspan="4">
            <Empty class="border-0 bg-transparent p-0">
              <EmptyContent>
                <EmptyHeader>
                  <EmptyTitle>No documents found</EmptyTitle>
                  <EmptyDescription>Try adjusting your filters or add a new document.</EmptyDescription>
                </EmptyHeader>
              </EmptyContent>
            </Empty>
          </TableEmpty>
        </TableBody>
      </Table>
      </div>
    </div>
  </div>
</template>
