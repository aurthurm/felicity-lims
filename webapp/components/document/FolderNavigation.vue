<template>
  <div class="h-full overflow-hidden flex flex-col bg-card border border-border rounded-lg" role="navigation" aria-label="Folder navigation">
    <div class="p-4 flex items-center justify-between border-b border-border">
      <h2 class="font-semibold text-sm text-card-foreground">Folders</h2>
      <button 
        @click="openAddFolderDialog(null)"
        class="inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none hover:bg-accent hover:text-accent-foreground h-8 w-8"
        aria-label="Add new folder"
      >
        <Plus class="w-4 h-4" aria-hidden="true" />
      </button>
    </div>
    
    <div class="flex-1 overflow-auto p-2">
      <div class="space-y-1">
        <FolderItem 
          v-for="folder in rootFolders" 
          :key="folder.uid" 
          :folder="folder"
          @add-subfolder="openAddFolderDialog"
        />
      </div>
    </div>

    <!-- Add Folder Dialog -->
    <teleport to="body">
      <div 
        v-if="isAddFolderOpen" 
        class="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center"
        role="dialog"
        aria-labelledby="add-folder-title"
        aria-modal="true"
      >
        <div 
          class="bg-card rounded-lg shadow-lg p-6 max-w-md w-full mx-4 border border-border" 
          @click.stop
        >
          <h3 id="add-folder-title" class="text-lg font-medium text-card-foreground mb-4">
            {{ parentFolderId 
              ? `Add subfolder to ${folderById(parentFolderId)?.name}` 
              : 'Add new folder' 
            }}
          </h3>
          
          <div class="mb-4">
            <label for="folderName" class="block text-sm font-medium text-card-foreground mb-1">Folder Name</label>
            <input
              id="folderName"
              v-model="folderName"
              class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              placeholder="Enter folder name"
              @keyup.enter="handleAddFolder"
              aria-required="true"
            />
          </div>
          
          <div class="flex justify-end gap-2">
            <button 
              @click="closeAddFolderDialog"
              class="inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
            >
              Cancel
            </button>
            <button 
              @click="handleAddFolder"
              class="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
              :disabled="!folderName.trim()"
            >
              <FolderPlus class="w-4 h-4 mr-2" aria-hidden="true" />
              Add Folder
            </button>
          </div>
        </div>
      </div>
    </teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Plus, FolderPlus } from 'lucide-vue-next'
import { useDocumentStore } from '@/stores/document'
import FolderItem from './FolderItem.vue'
import useApiUtil from '@/composables/api_util';
import { AddDocumentFolderDocument, AddDocumentFolderMutation, AddDocumentFolderMutationVariables } from '@/graphql/operations/document.mutations';
import { DocumentFolderType } from '@/types/gql';

const { withClientMutation } = useApiUtil();    
const store = useDocumentStore()
const isAddFolderOpen = ref(false)
const folderName = ref('')
const parentFolderId = ref<string | null>(null)

const rootFolders = computed(() => {
  return store.getChildFolders(null)
})

function openAddFolderDialog(parentId: string | null) {
  parentFolderId.value = parentId
  isAddFolderOpen.value = true
}

function closeAddFolderDialog() {
  isAddFolderOpen.value = false
  folderName.value = ''
  parentFolderId.value = null
}

async function handleAddFolder() {
  if (!folderName.value.trim()) return;
  
  try {
    const response = await withClientMutation<AddDocumentFolderMutation, AddDocumentFolderMutationVariables>(
      AddDocumentFolderDocument,
      { 
        payload: {
          name: folderName.value.trim(), 
          parentUid: parentFolderId.value
        }
      }, 
      "createDocumentFolder"
    );
    
    if (response && 'uid' in response) {
      store.addFolder(response as DocumentFolderType);
      
      // If parent folder isn't expanded, expand it
      if (parentFolderId.value) {
        const parentFolder = store.folders.find(f => f.uid === parentFolderId.value);
        if (parentFolder && !parentFolder.expanded) {
          store.toggleFolderExpanded(parentFolderId.value);
        }
      }
    }
  } catch (error) {
    console.error('Failed to create folder:', error);
  } finally {
    // Reset form and close dialog
    closeAddFolderDialog();
  }
}

function folderById(uid: string): DocumentFolderType | undefined {
  return store.folders.find(f => f.uid === uid);
}
</script>
