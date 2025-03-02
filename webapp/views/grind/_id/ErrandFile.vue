<script setup lang="ts">
import useApiUtil from '@/composables/api_util';
import { AddGrindMediaMutation, AddGrindMediaMutationVariables, AddGrindMediaDocument, DeleteGrindMediaDocument, DeleteGrindMediaMutation, DeleteGrindMediaMutationVariables } from '@/graphql/operations/grind.mutations';
import { GetGrindMediaQuery, GetGrindMediaQueryVariables, GetGrindMediaDocument } from '@/graphql/operations/grind.queries';
import { IGrindMedia } from '@/models/grind';
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

const errandFiles = ref<IGrindMedia[]>([]);
const getFiles = () => {
    withClientQuery<GetGrindMediaQuery, GetGrindMediaQueryVariables>(
        GetGrindMediaDocument, {target: MediaTarget.Errand, targetUid: props.errandUid}, "grindMediaByTarget"
    ).then((res) => {
        if(res) {
            errandFiles.value = res as IGrindMedia[];
        }
    });
};

const uploadFile = (payload: any) => {
    withClientMutation<AddGrindMediaMutation, AddGrindMediaMutationVariables>(
        AddGrindMediaDocument, {payload}, "createGrindMedia"
    ).then((res) => {
        if(res) {
            errandFiles.value = [res as IGrindMedia, ...errandFiles.value];
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
const getFileIcon = (file: IGrindMedia): string => {
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
const downloadFile = (file: IGrindMedia) => {
  window.open(`/${file.path}`, '_blank');
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
    <div class="flex justify-between items-start">
        <div class="w-3/4 pr-4">
            <h3 class="text-lg font-medium mb-3">Uploaded Files</h3>
            
            <!-- Loading or empty state -->
            <div v-if="errandFiles.length === 0" class="py-6 text-center text-gray-500 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                No files uploaded yet
            </div>
            
            <!-- Error message -->
            <div v-if="deleteError" class="mb-3 p-3 bg-red-50 text-red-700 rounded-md">
                {{ deleteError }}
            </div>
            
            <!-- File list -->
            <ul v-if="errandFiles.length > 0" class="space-y-2">
                <li 
                    v-for="fileItem in errandFiles" 
                    :key="fileItem.uid" 
                    class="p-3 border rounded-md flex items-center hover:bg-gray-50 transition-colors"
                >
                    <!-- File icon based on type -->
                    <div class="file-icon mr-3 text-blue-500 flex-shrink-0">
                        <!-- Image icon -->
                        <svg v-if="getFileIcon(fileItem) === 'image'" xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        
                        <!-- PDF icon -->
                        <svg v-else-if="getFileIcon(fileItem) === 'pdf'" xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                        </svg>
                        
                        <!-- Word/Doc icon -->
                        <svg v-else-if="getFileIcon(fileItem) === 'doc'" xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        
                        <!-- Excel icon -->
                        <svg v-else-if="getFileIcon(fileItem) === 'excel'" xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        
                        <!-- Generic file icon -->
                        <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                    </div>
                    
                    <!-- File info -->
                    <div class="flex-grow min-w-0 mr-3">
                        <div class="font-medium text-gray-800 truncate" :title="fileItem.filename">
                            {{ fileItem.filename }}
                        </div>
                        <div class="text-sm text-gray-500 flex items-center gap-2">
                            <span>{{ formatFileSize(fileItem.size) }}</span>
                            <span class="h-1 w-1 rounded-full bg-gray-300"></span>
                            <span>{{ fileItem.mimetype }}</span>
                        </div>
                    </div>
                    
                    <!-- Actions -->
                    <div class="flex gap-2 flex-shrink-0">
                        <!-- Download button -->
                        <button 
                            @click="downloadFile(fileItem)" 
                            class="p-2 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                            title="Download file"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                            </svg>
                        </button>
                        
                        <!-- Delete button -->
                        <button 
                            @click="deleteFile(fileItem.uid)" 
                            class="p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
                            title="Delete file"
                            :disabled="isDeleting === fileItem.uid"
                        >
                            <svg v-if="isDeleting === fileItem.uid" class="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                        </button>
                    </div>
                </li>
            </ul>
        </div>
        
        <div class="file-upload-container">
            <!-- Upload area -->
            <div 
                v-if="!file && !uploadSuccess"
                class="upload-area"
                :class="{ 'dragging': isDragging }"
                @dragenter="onDragEnter"
                @dragleave="onDragLeave"
                @dragover="onDragOver"
                @drop="onDrop"
            >
                <div class="w-16 h-16 mb-2 mx-auto text-gray-400">
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-full h-full" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                    </svg>
                </div>
                <p class="text-center text-gray-500 mb-2">Drag and drop file here</p>
                <p class="text-center text-gray-400 text-sm mb-3">or</p>
                <label class="file-input-button">
                    Browse Files
                    <input 
                    type="file" 
                    class="hidden" 
                    @change="onFileInputChange" 
                    />
                </label>
            </div>

            <!-- File preview -->
            <div v-else-if="file && !uploadSuccess" class="file-preview">
                <div v-if="filePreview" class="image-preview mb-3">
                    <img :src="filePreview" alt="File preview" class="rounded-md max-h-64 max-w-full" />
                </div>
                <div v-else class="file-icon w-16 h-16 mx-auto mb-3 text-blue-500">
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-full h-full" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                </div>
                
                <div class="file-info mb-4 text-center">
                    <p class="font-medium text-gray-800">{{ file.name }}</p>
                    <p class="text-sm text-gray-500">{{ fileSize }}</p>
                </div>
                
                <div class="flex justify-center gap-3">
                    <button 
                    @click="resetUpload" 
                    class="cancel-button"
                    >
                    Cancel
                    </button>
                    <button 
                    @click="handleUpload" 
                    class="upload-button"
                    :disabled="isUploading"
                    >
                    <span v-if="isUploading">Uploading...</span>
                    <span v-else>Upload</span>
                    </button>
                </div>
                
                <div v-if="uploadError" class="mt-3 text-red-500 text-center">
                    {{ uploadError }}
                </div>
            </div>

            <!-- Upload success -->
            <div v-else-if="uploadSuccess" class="upload-success">
                <div class="success-icon w-16 h-16 mx-auto mb-3 text-green-500">
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-full h-full" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                    </svg>
                </div>
                <p class="text-center text-gray-800 font-medium mb-2">Upload Successful</p>
                <p class="text-center text-gray-500 text-sm mb-4">Your file has been uploaded successfully</p>
                <button @click="resetUpload" class="upload-new-button">
                    Upload Another File
                </button>
            </div>
        </div>
    </div>
</template>

<style scoped>
.file-upload-container {
  @apply w-full max-w-md mx-auto p-4;
}

.upload-area {
  @apply border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer transition-colors;
}

.upload-area.dragging {
  @apply border-blue-400 bg-blue-50;
}

.file-input-button {
  @apply px-4 py-2 bg-blue-500 text-white rounded-md cursor-pointer hover:bg-blue-600 transition-colors inline-block;
}

.upload-button {
  @apply px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors disabled:bg-blue-300 disabled:cursor-not-allowed;
}

.cancel-button {
  @apply px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors;
}

.upload-new-button {
  @apply px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors mx-auto block;
}
</style>