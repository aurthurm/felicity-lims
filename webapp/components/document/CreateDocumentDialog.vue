<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { ChevronDown, Check } from 'lucide-vue-next'
import { useDocumentStore } from '@/stores/document'
import useApiUtil from '@/composables/api_util';
import { AddDocumentDocument, AddDocumentMutation, AddDocumentMutationVariables } from '@/graphql/operations/document.mutations';
import { IDocument } from '@/models/document';

interface Props {
  isOpen: boolean;
  initialFolderId?: string | null;
}

const props = defineProps<Props>();
const emit = defineEmits<{
  (e: 'update:isOpen', value: boolean): void;
}>();

const { withClientMutation } = useApiUtil();
const store = useDocumentStore();

const name = ref('');
const folderUid = ref('');
const documentId = ref('');
const isFolderSelectOpen = ref(false);
const folderSearchQuery = ref('');

// Initialize folderUid from prop if available
watch(() => props.initialFolderId, (newValue) => {
  if (newValue) {
    folderUid.value = newValue;
  }
}, { immediate: true });

const filteredFolders = computed(() => {
  if (!folderSearchQuery.value) {
    return store.folders;
  }
  
  const query = folderSearchQuery.value.toLowerCase();
  return store.folders.filter(folder => 
    folder.name.toLowerCase().includes(query)
  );
});

const selectedFolderName = computed(() => {
  const folder = store.folders.find(f => f.uid === folderUid.value);
  return folder ? folder.name : 'Select folder';
});

const isFormValid = computed(() => {
  return name.value.trim() !== '' && folderUid.value !== '';
});

function selectFolder(uid: string) {
  folderUid.value = uid;
  isFolderSelectOpen.value = false;
}

interface ClickOutsideElement extends HTMLElement {
  _clickOutside?: (event: Event) => void;
}

async function handleCreateDocument() {
  if (!isFormValid.value) return;
  
  try {
    const response = await withClientMutation<AddDocumentMutation, AddDocumentMutationVariables>(
      AddDocumentDocument, 
      {
        payload: {
          name: name.value.trim(),
          folderUid: folderUid.value,
          documentId: documentId.value.trim()
        }
      },
      "createDocument"
    );
    
    if (response && typeof response === 'object' && 'uid' in response) {
      // Cast to unknown first to satisfy TypeScript
      const document = response as unknown as IDocument;
      store.addDocument(document);
    }
  } catch (error) {
    console.error('Failed to create document:', error);
  } finally {
    closeDialog();
  }
}

function closeDialog() {
  resetForm();
  emit('update:isOpen', false);
}

function resetForm() {
  name.value = '';
  documentId.value = '';
  // Keep the folder selected for convenience
  isFolderSelectOpen.value = false;
  folderSearchQuery.value = '';
}

// Close folder select when clicking outside
const vClickOutside = {
  mounted(el: ClickOutsideElement, binding: { value: (event: Event) => void }) {
    el._clickOutside = (event: Event) => {
      if (!(el === event.target || el.contains(event.target as Node))) {
        binding.value(event);
      }
    };
    document.addEventListener('click', el._clickOutside);
  },
  unmounted(el: ClickOutsideElement) {
    if (el._clickOutside) {
      document.removeEventListener('click', el._clickOutside);
    }
  }
};
</script>

<template>
  <teleport to="body">
    <div 
      v-if="isOpen" 
      class="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center"
      role="dialog"
      aria-labelledby="create-document-title"
      aria-modal="true"
    >
      <div 
        class="bg-card rounded-lg shadow-lg p-6 max-w-sm w-full mx-4 border border-border" 
        @click.stop
      >
        <h3 id="create-document-title" class="text-lg font-medium text-card-foreground mb-4">Create new document</h3>
        
        <div class="space-y-4">
          <div>
            <label for="name" class="block text-sm font-medium text-card-foreground mb-1">Document Name</label>
            <input
              id="name"
              v-model="name"
              class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              placeholder="Enter document name"
              @keyup.enter="handleCreateDocument"
            />
          </div>
          
          <div>
            <label for="documentId" class="block text-sm font-medium text-card-foreground mb-1">Document ID</label>
            <input
              id="documentId"
              v-model="documentId"
              class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              placeholder="Enter document id"
              @keyup.enter="handleCreateDocument"
            />
          </div>

          <div>
            <label for="folder" class="block text-sm font-medium text-card-foreground mb-1">Folder</label>
            <div class="relative">
              <button
                id="folder"
                type="button"
                @click="isFolderSelectOpen = !isFolderSelectOpen"
                class="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                :aria-expanded="isFolderSelectOpen"
                :aria-controls="isFolderSelectOpen ? 'folder-list' : undefined"
              >
                {{ selectedFolderName }}
                <ChevronDown class="ml-2 h-4 w-4 shrink-0 opacity-50" aria-hidden="true" />
              </button>
              
              <div 
                v-if="isFolderSelectOpen" 
                id="folder-list"
                class="absolute top-full left-0 z-10 mt-1 w-full rounded-md border border-border bg-card shadow-md"
                v-click-outside="() => isFolderSelectOpen = false"
              >
                <div class="max-h-[200px] overflow-auto p-1">
                  <input
                    v-model="folderSearchQuery"
                    class="flex h-8 w-full rounded-sm border-0 bg-background px-3 py-1 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring mb-1"
                    placeholder="Search folders..."
                    aria-label="Search folders"
                  />
                  <button
                    v-for="folder in filteredFolders"
                    :key="folder.uid"
                    @click="selectFolder(folder.uid)"
                    class="flex w-full items-center rounded-sm px-2 py-1.5 text-sm hover:bg-accent text-left text-card-foreground"
                    :aria-selected="folder.uid === folderUid"
                  >
                    <Check v-if="folder.uid === folderUid" class="mr-2 h-4 w-4" aria-hidden="true" />
                    <span v-else class="mr-2 w-4" aria-hidden="true"></span>
                    {{ folder.name }}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="flex justify-end gap-2 mt-6">
          <button 
            @click="closeDialog"
            class="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
          >
            Cancel
          </button>
          <button 
            @click="handleCreateDocument"
            class="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
            :disabled="!isFormValid"
          >
            Create
          </button>
        </div>
      </div>
    </div>
  </teleport>
</template>
