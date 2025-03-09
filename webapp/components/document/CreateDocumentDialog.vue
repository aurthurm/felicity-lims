<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { ChevronDown, Check } from 'lucide-vue-next'
import { useDocumentStore, createDocument } from '@/stores/documentStore'
import useApiUtil from '@/composables/api_util';
import { AddDocumentDocument, AddDocumentMutation, AddDocumentMutationVariables } from '@/graphql/operations/document.mutations';


const {withClientMutation} = useApiUtil()

const props = defineProps<{
  isOpen: boolean
  initialFolderId?: string | null
}>()

const emit = defineEmits<{
  (e: 'update:isOpen', value: boolean): void
}>()

const store = useDocumentStore()
const name = ref('')
const folderUid = ref('')
const documentId = ref('')
const isFolderSelectOpen = ref(false)
const folderSearchQuery = ref('')


// Initialize folderUid from prop if available
watch(() => props.initialFolderId, (newValue) => {
  if (newValue) {
    folderUid.value = newValue
  }
}, { immediate: true })

const filteredFolders = computed(() => {
  if (!folderSearchQuery.value) {
    return store.folders
  }
  
  const query = folderSearchQuery.value.toLowerCase()
  return store.folders.filter(folder => 
    folder.name.toLowerCase().includes(query)
  )
})

const selectedFolderName = computed(() => {
  const folder = store.folders.find(f => f.uid === folderUid.value)
  return folder ? folder.name : 'Select folder'
})

const isFormValid = computed(() => {
  return name.value.trim() !== '' && folderUid.value !== ''
})

function selectFolder(uid: string) {
  folderUid.value = uid
  isFolderSelectOpen.value = false
}

function handleCreateDocument() {
  if (isFormValid.value) {
    withClientMutation<AddDocumentMutation, AddDocumentMutationVariables>(
      AddDocumentDocument, 
      {payload: {name: name.value, folderUid: folderUid.value, documentId: documentId.value}},
      "createDocument"
    ).then((newDocument: any) => {
      store.addDocument(newDocument)
    })
    // Reset form and close dialog
    resetForm()
    closeDialog()
  }
}

function closeDialog() {
  resetForm()
  emit('update:isOpen', false)
}

function resetForm() {
  name.value = ''
  // Keep the folder selected for convenience
  isFolderSelectOpen.value = false
  folderSearchQuery.value = ''
}

// Close folder select when clicking outside
const vClickOutside = {
  mounted(el: any, binding: any) {
    el._clickOutside = (event: Event) => {
      if (!(el === event.target || el.contains(event.target as Node))) {
        binding.value(event)
      }
    }
    document.addEventListener('click', el._clickOutside)
  },
  unmounted(el: any) {
    document.removeEventListener('click', el._clickOutside)
  }
}
</script>

<template>
  <teleport to="body">
    <div v-if="isOpen" class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
      <div class="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full mx-4" @click.stop>
        <h3 class="text-lg font-medium mb-4">Create new document</h3>
        
        <div class="space-y-4">
          <div>
            <label for="name" class="block text-sm font-medium mb-1">Document Name</label>
            <input
              id="name"
              v-model="name"
              class="flex h-10 w-full rounded-md border border-input bg-white px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              placeholder="Enter document name"
            />
          </div>
          
          <div>
            <label for="name" class="block text-sm font-medium mb-1">Document ID</label>
            <input
              id="docu"
              v-model="documentId"
              class="flex h-10 w-full rounded-md border border-input bg-white px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              placeholder="Enter document id"
            />
          </div>

          <div>
            <label for="folder" class="block text-sm font-medium mb-1">Folder X</label>
            <div class="relative">
              <button
                id="folder"
                type="button"
                @click="isFolderSelectOpen = !isFolderSelectOpen"
                class="flex h-10 w-full items-center justify-between rounded-md border border-input bg-white px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {{ selectedFolderName }}
                <ChevronDown class="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </button>
              
              <div v-if="isFolderSelectOpen" class="absolute top-full left-0 z-10 mt-1 w-full rounded-md border bg-white shadow-md">
                <div class="max-h-[200px] overflow-auto p-1">
                  <input
                    v-model="folderSearchQuery"
                    class="flex h-8 w-full rounded-sm border-0 bg-white px-3 py-1 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring mb-1"
                    placeholder="Search folders..."
                  />
                  <button
                    v-for="folder in filteredFolders"
                    :key="folder.uid"
                    @click="selectFolder(folder.uid)"
                    class="flex w-full items-center rounded-sm px-2 py-1.5 text-sm hover:bg-accent text-left"
                  >
                    <Check v-if="folder.uid === folderUid" class="mr-2 h-4 w-4" />
                    <span v-else class="mr-2 w-4"></span>
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
            class="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none border border-input bg-white hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
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
