
<template>
  <div class="h-full overflow-hidden flex flex-col">
    <div class="pr-4 py-3 flex items-center justify-between">
      <h2 class="font-semibold text-sm">Folders</h2>
      <button 
        @click="openAddFolderDialog(null)"
        class="inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none hover:bg-accent hover:text-accent-foreground h-8 w-8"
      >
        <Plus class="w-4 h-4" />
      </button>
    </div>
    
    <div class="flex-1 overflow-auto">
      <div class="pr-2 py-1">
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
      <div v-if="isAddFolderOpen" class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
        <div class="bg-background rounded-lg shadow-lg p-6 max-w-md w-full mx-4" @click.stop>
          <h3 class="text-lg font-medium mb-4">
            {{ parentFolderId 
              ? `Add subfolder to ${folderById(parentFolderId)?.name}` 
              : 'Add new folder' 
            }}
          </h3>
          
          <div class="mb-4">
            <label for="folderName" class="block text-sm font-medium mb-1">Folder Name</label>
            <input
              id="folderName"
              v-model="folderName"
              class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
              placeholder="Enter folder name"
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
            >
              <FolderPlus class="w-4 h-4 mr-2" />
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
import { useDocumentStore } from '@/stores/documentStore'
import FolderItem from './FolderItem.vue'
import useApiUtil from '@/composables/api_util';
import { AddDocumentFolderDocument, AddDocumentFolderMutation, AddDocumentFolderMutationVariables } from '@/graphql/operations/document.mutations';
import { IDocumentFolder } from '@/models/document';

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
}

function handleAddFolder() {
  if (folderName.value.trim()) {
    withClientMutation<AddDocumentFolderMutation, AddDocumentFolderMutationVariables>(
      AddDocumentFolderDocument,
      { payload: {name: folderName.value, parentUid: parentFolderId.value}}, 
      "createDocumentFolder"
    ).then((resp: any) => store.addFolder(resp))
    
    // If parent folder isn't expanded, expand it
    if (parentFolderId.value) {
      const parentFolder = store.folders.find(f => f.uid === parentFolderId.value)
      if (parentFolder && !parentFolder.expanded) {
        store.toggleFolderExpanded(parentFolderId.value)
      }
    }
    
    // Reset form and close dialog
    folderName.value = ''
    isAddFolderOpen.value = false
  }
}

function folderById(uid: string): IDocumentFolder | undefined {
  return store.folders.find(f => f.uid === uid)
}
</script>
