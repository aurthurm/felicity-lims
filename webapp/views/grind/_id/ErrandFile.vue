<script setup lang="ts">
import useApiUtil from '@/composables/api_util';
import { AddGrindMediaMutation, AddGrindMediaMutationVariables, AddGrindMediaDocument, 
  DeleteGrindMediaDocument, DeleteGrindMediaMutation, DeleteGrindMediaMutationVariables } from '@/graphql/operations/grind.mutations';
import { GetGrindMediaQuery, GetGrindMediaQueryVariables, GetGrindMediaDocument, DownloadGrindMediaFileQuery, DownloadGrindMediaFileQueryVariables, DownloadGrindMediaFileDocument } from '@/graphql/operations/grind.queries';
import { GrindMediaType } from '@/types/gql';
import { ref, computed, onMounted } from 'vue';
import { MediaTarget} from '@/graphql/schema'

const props = defineProps({
  errandUid: {
    type: String,
    required: true
  }
});

const { withClientMutation, withClientQuery } = useApiUtil();
const isDeleting = ref<string | null>(null);
const deleteError = ref<string | null>(null);

onMounted(() => {
    getFiles()
});

// File upload state
const isDragging = ref(false);
const file = ref<File | null>(null);
const filePreview = ref<string | null>(null);
const isUploading = ref(false);
const uploadError = ref<string | null>(null);
const uploadSuccess = ref(false);

const errandFiles = ref<GrindMediaType[]>([]);
const getFiles = () => {
    withClientQuery<GetGrindMediaQuery, GetGrindMediaQueryVariables>(
        GetGrindMediaDocument, {target: MediaTarget.Errand, targetUid: props.errandUid}, "grindMediaByTarget"
    ).then((res) => {
        if(res) {
            errandFiles.value = res as GrindMediaType[];
        }
    });
};

const uploadFile = (payload: any) => {
    withClientMutation<AddGrindMediaMutation, AddGrindMediaMutationVariables>(
        AddGrindMediaDocument, {payload}, "createGrindMedia"
    ).then((res) => {
        if(res) {
            errandFiles.value = [res as GrindMediaType, ...errandFiles.value];
        }
    });
};

const deleteFile = (uid: string) => {
    isDeleting.value = uid;
    deleteError.value = null;
    withClientMutation<DeleteGrindMediaMutation, DeleteGrindMediaMutationVariables>(
        DeleteGrindMediaDocument, {uid}, "deleteGrindMedia"
    ).then((res) => {
        if(res) {
            errandFiles.value = errandFiles.value.filter(file => file.uid !== uid);
        }
    }).catch((err) => {
        deleteError.value = err?.message || "Failed to delete file";
    }).finally(() => {
        isDeleting.value = null;
    });
};

// Format file size
const formatFileSize = (sizeInBytes: string): string => {
  const size = parseInt(sizeInBytes);
  if (size < 1024) return `${size} B`;
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
};

// Get file icon based on mimetype or filename
const getFileIcon = (file: GrindMediaType): string => {
  const { mimetype, filename } = file;
  if (mimetype?.startsWith('image/')) {
    return 'image';
  } else if (mimetype?.includes('pdf') || filename.endsWith('.pdf')) {
    return 'pdf';
  } else if (mimetype?.includes('word') || filename.endsWith('.doc') || filename.endsWith('.docx')) {
    return 'doc';
  } else if (mimetype?.includes('sheet') || filename.endsWith('.xls') || filename.endsWith('.xlsx')) {
    return 'excel';
  } else {
    return 'file';
  }
};

// Download file
const downloadFile = (file: GrindMediaType) => {
  try {
    withClientQuery<DownloadGrindMediaFileQuery, DownloadGrindMediaFileQueryVariables>(
      DownloadGrindMediaFileDocument, {uid: file.uid}, "downloadGrindMediaFile"
    ).then((fileData) => {
      // Decode base64 content
      const binaryContent = atob(fileData.content);
      
      // Convert to Uint8Array
      const bytes = new Uint8Array(binaryContent.length);
      for (let i = 0; i < binaryContent.length; i++) {
        bytes[i] = binaryContent.charCodeAt(i);
      }
      
      // Create a blob from the binary data
      const blob = new Blob([bytes], { type: fileData.mimetype });
      
      // Create download link
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileData.filename;
      
      // Trigger download
      document.body.appendChild(a);
      a.click();
      
      // Cleanup
      setTimeout(() => {
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }, 0);
    });
  } catch (error) {
    console.error('Error downloading file:', error);
  }
};

// Handle file selection
const handleFileSelect = (selectedFile: File) => {
  uploadError.value = null;
  file.value = selectedFile;
  
  // Create preview for image files
  if (selectedFile.type.startsWith('image/')) {
    const reader = new FileReader();
    reader.onload = (e) => {
      filePreview.value = e.target?.result as string;
    };
    reader.readAsDataURL(selectedFile);
  } else {
    filePreview.value = null;
  }
};

// Process file upload via GraphQL
const handleUpload = async () => {
  if (!file.value) return;
  
  isUploading.value = true;
  uploadError.value = null;
  
  try {
    const result = await uploadFile({
      file: file.value,
      target: MediaTarget.Errand,
      targetUid: props.errandUid
    });
    
    if (result?.error) {
      uploadError.value = result.error.message;
    } else {
      uploadSuccess.value = true;
    }
  } catch (err) {
    uploadError.value = err instanceof Error ? err.message : 'Upload failed';
  } finally {
    isUploading.value = false;
  }
};

// File input change handler
const onFileInputChange = (event: Event) => {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files.length > 0) {
    handleFileSelect(input.files[0]);
  }
};

// Drag and drop handlers
const onDragEnter = (e: DragEvent) => {
  e.preventDefault();
  e.stopPropagation();
  isDragging.value = true;
};

const onDragLeave = (e: DragEvent) => {
  e.preventDefault();
  e.stopPropagation();
  isDragging.value = false;
};

const onDragOver = (e: DragEvent) => {
  e.preventDefault();
  e.stopPropagation();
  isDragging.value = true;
};

const onDrop = (e: DragEvent) => {
  e.preventDefault();
  e.stopPropagation();
  isDragging.value = false;
  
  if (e.dataTransfer && e.dataTransfer.files.length > 0) {
    handleFileSelect(e.dataTransfer.files[0]);
  }
};

// Reset the upload state
const resetUpload = () => {
  file.value = null;
  filePreview.value = null;
  uploadSuccess.value = false;
  uploadError.value = null;
};

const fileSize = computed(() => {
  if (!file.value) return '';
  
  const size = file.value.size;
  if (size < 1024) return `${size} B`;
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
});
</script>

<template>
  <div class="bg-background rounded-lg shadow-sm border border-border p-6 space-y-6">
    <!-- Header -->
    <div class="flex justify-between items-start">
      <div class="w-3/4 pr-4 space-y-4">
        <h3 class="text-lg font-medium text-foreground">Uploaded Files</h3>
        
        <!-- Loading or empty state -->
        <div 
          v-if="errandFiles.length === 0" 
          class="py-6 text-center text-muted-foreground bg-background rounded-lg border border-dashed border-border"
        >
          No files uploaded yet
        </div>
        
        <!-- Error message -->
        <div 
          v-if="deleteError" 
          class="p-3 bg-destructive/10 text-destructive rounded-md"
        >
          {{ deleteError }}
        </div>
        
        <!-- File list -->
        <ul v-if="errandFiles.length > 0" class="space-y-2">
          <li 
            v-for="fileItem in errandFiles" 
            :key="fileItem.uid"
            class="flex items-center justify-between p-3 bg-muted rounded-md hover:bg-muted/80 transition-colors duration-200"
          >
            <div class="flex items-center space-x-3">
              <span class="text-muted-foreground">
                <component :is="getFileIcon(fileItem)" class="w-5 h-5" />
              </span>
              <div>
                <p class="text-sm font-medium text-foreground">{{ fileItem.filename }}</p>
                <p class="text-xs text-muted-foreground">{{ formatFileSize(fileItem.size) }}</p>
              </div>
            </div>
            <div class="flex items-center space-x-2">
              <button
                @click="downloadFile(fileItem)"
                class="p-1 text-muted-foreground hover:text-foreground transition-colors duration-200"
                title="Download file"
              >
                <DownloadIcon class="w-5 h-5" />
              </button>
              <button
                @click="deleteFile(fileItem.uid)"
                class="p-1 text-muted-foreground hover:text-destructive transition-colors duration-200"
                :disabled="isDeleting === fileItem.uid"
                title="Delete file"
              >
                <TrashIcon class="w-5 h-5" />
              </button>
            </div>
          </li>
        </ul>
      </div>

      <!-- Upload section -->
      <div class="w-1/4 pl-4">
        <div 
          class="border-2 border-dashed border-border rounded-lg p-6 text-center"
          :class="{ 'border-primary bg-primary/5': isDragging }"
          @dragenter="onDragEnter"
          @dragleave="onDragLeave"
          @dragover="onDragOver"
          @drop="onDrop"
        >
          <input
            type="file"
            class="hidden"
            ref="fileInput"
            @change="onFileInputChange"
          />
          
          <div v-if="!file" class="space-y-2">
            <UploadIcon class="w-8 h-8 mx-auto text-muted-foreground" />
            <p class="text-sm text-muted-foreground">
              Drag and drop a file here, or
              <button 
                @click="$refs.fileInput.click()"
                class="text-primary hover:text-primary/80 transition-colors duration-200"
              >
                browse
              </button>
            </p>
          </div>
          
          <div v-else class="space-y-3">
            <!-- Image preview -->
            <img 
              v-if="filePreview" 
              :src="filePreview" 
              class="max-h-32 mx-auto rounded-md"
              alt="File preview"
            />
            
            <!-- File info -->
            <div class="text-sm">
              <p class="font-medium text-foreground">{{ file.name }}</p>
              <p class="text-muted-foreground">{{ fileSize }}</p>
            </div>
            
            <!-- Upload actions -->
            <div class="flex justify-center space-x-2">
              <button
                @click="resetUpload"
                class="px-3 py-1 text-sm font-medium text-foreground bg-background border border-border rounded-md shadow-sm hover:bg-muted focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                @click="handleUpload"
                :disabled="isUploading"
                class="px-3 py-1 text-sm font-medium text-primary-foreground bg-primary border border-transparent rounded-md shadow-sm hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-colors duration-200"
              >
                {{ isUploading ? 'Uploading...' : 'Upload' }}
              </button>
            </div>
            
            <!-- Upload error -->
            <p v-if="uploadError" class="text-sm text-destructive">
              {{ uploadError }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.space-y-6 > :not([hidden]) ~ :not([hidden]) {
  margin-top: 1.5rem;
}

.space-y-4 > :not([hidden]) ~ :not([hidden]) {
  margin-top: 1rem;
}

.space-y-2 > :not([hidden]) ~ :not([hidden]) {
  margin-top: 0.5rem;
}
</style>