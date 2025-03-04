
<template>
  <div>
    <div 
      :class="[
        'flex justify-start items-center p-2 rounded-md cursor-pointer group transition-colors duration-200',
        level > 0 && 'ml-6'
      ]"
      @click="handleFolderClick"
    >
      <div class="flex items-center mr-2" @click.stop="handleToggleExpand">
        <component :is="childFolders.length > 0 ? (isExpanded ? ChevronDown : ChevronRight) : 'div'" 
          class="w-4 h-4 text-muted-foreground" 
          v-if="childFolders.length > 0"
        />
        <div class="w-4" v-else></div>
      </div>
      
      <div class="mr-2 text-muted-foreground">
        <component :is="isExpanded ? FolderOpen : Folder" 
        :class="['w-[18px] h-[18px]', isActive && 'text-sky-600']" />
      </div>
      
      <div :class="['flex-1 truncate', isActive && 'text-sky-600']">{{ folder.name }}</div>
      
      <div class="flex items-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <button 
          @click.stop="$emit('add-subfolder', folder.uid)"
          class="h-7 w-7 flex items-center justify-center rounded-full hover:bg-secondary transition-colors"
        >
          <Plus class="text-muted-foreground w-4 h-4" />
        </button>
        
        <div class="relative">
          <button 
            @click.stop="isMenuOpen = !isMenuOpen"
            class="h-7 w-7 flex items-center justify-center rounded-full hover:bg-secondary transition-colors"
          >
            <MoreHorizontal class="text-muted-foreground w-4 h-4" />
          </button>
          
          <!-- Dropdown menu -->
          <div 
            v-if="isMenuOpen" 
            class="absolute right-0 mt-1 w-48 rounded-md border bg-white p-1 text-popover-foreground shadow-md z-10"
            v-click-outside="() => isMenuOpen = false"
          >
            <button 
              @click.stop="handleDeleteFolder" 
              class="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground text-destructive w-full text-left"
            >
              <Trash class="mr-2 w-4 h-4" />
              <span>Delete Folder</span>
            </button>
          </div>
        </div>
      </div>
    </div>
    
    <div v-if="isExpanded && childFolders.length > 0" class="mt-1 ml-1 pl-1 border-l border-border">
      <FolderItem 
        v-for="childFolder in childFolders" 
        :key="childFolder.uid" 
        :folder="childFolder" 
        :level="level + 1"
        @add-subfolder="$emit('add-subfolder', $event)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, PropType } from 'vue'
import { 
  Folder, 
  FolderOpen, 
  ChevronRight, 
  ChevronDown, 
  Plus, 
  MoreHorizontal, 
  Trash 
} from 'lucide-vue-next'
import { useDocumentStore } from '@/stores/documentStore'
import { IDocumentFolder } from '@/models/document';

// Define props
const props = defineProps({
  folder: {
    type: Object as PropType<IDocumentFolder>,
    required: true,
  },
  level: {
    type: Number,
    default: 0,
  },
});

// Define emits
const emit = defineEmits<{
  (e: 'add-subfolder', folderUid: string): void
}>()

// Setup state
const store = useDocumentStore()
const isMenuOpen = ref(false)

// Computed properties
const childFolders = computed(() => {
  return store.getChildFolders(props.folder.uid)
})

const isActive = computed(() => {
  return store.currentFolder === props.folder.uid
})

const isExpanded = computed(() => {
  return !!props.folder.expanded
})

// Methods
function handleFolderClick() {
  store.setCurrentFolder(props.folder.uid)
}

function handleToggleExpand() {
  store.toggleFolderExpanded(props.folder.uid)
}

function handleDeleteFolder() {
  // Check if folder has children or documents
  const hasChildFolders = childFolders.value.length > 0
  const hasDocuments = store.documents.some(doc => doc.folderUid === props.folder.uid)
  
  if (hasChildFolders || hasDocuments) {
    // Show confirmation dialog
    if (window.confirm('Delete this folder and all its contents?')) {
      store.deleteFolder(props.folder.uid)
    }
  } else {
    store.deleteFolder(props.folder.uid)
  }
  
  isMenuOpen.value = false
}

// Click outside directive
const vClickOutside = {
  mounted(el: HTMLElement, binding: any) {
    el._clickOutside = (event: Event) => {
      if (!(el === event.target || el.contains(event.target as Node))) {
        binding.value(event)
      }
    }
    document.addEventListener('click', el._clickOutside)
  },
  unmounted(el: HTMLElement) {
    document.removeEventListener('click', el._clickOutside)
  }
}
</script>
