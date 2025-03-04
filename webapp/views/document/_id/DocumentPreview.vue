<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { Document } from '@/stores/documentStore';
import { ArrowLeftIcon, PencilIcon } from '@heroicons/vue/24/outline';
import * as pdfjs from 'pdfjs-dist';

// Set worker path
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const router = useRouter();
const route = useRoute();
const documentId = computed(() => route.params.documentId as string);

const document = ref<any>(null);
const previewData = ref<Document | null>(null);
const pdfDocument = ref<any>(null);
const currentPage = ref(1);
const numPages = ref(0);
const scale = ref(1.5);
const isLoading = ref(true);

// Mock documents data (in a real app, this would come from a store or API)
const documents = ref<Document[]>([
  { 
    id: '1', 
    name: 'Meeting Notes', 
    content: { type: 'doc', content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Meeting notes content' }] }] }, 
    folderId: '2', 
    createdAt: new Date(), 
    updatedAt: new Date() 
  },
  { 
    id: '2', 
    name: 'Project Plan', 
    content: { type: 'doc', content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Project plan content' }] }] }, 
    folderId: '3', 
    createdAt: new Date(), 
    updatedAt: new Date() 
  },
  { 
    id: '3', 
    name: 'Personal Notes', 
    content: { type: 'doc', content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Personal notes content' }] }] }, 
    folderId: '1', 
    createdAt: new Date(), 
    updatedAt: new Date() 
  },
]);

// Load document and generate preview
onMounted(async () => {
  const doc = documents.value.find(d => d.id === documentId.value);
  if (doc) {
    document.value = doc;
    
    // In a real app, you would generate a PDF from the document content
    // For this demo, we'll use a sample PDF
    previewData.value = {
      id: doc.id,
      name: doc.name,
      previewUrl: 'https://raw.githubusercontent.com/mozilla/pdf.js/ba2edeae/web/compressed.tracemonkey-pldi-09.pdf'
    } as Document;
    
    await loadPdf();
  } else {
    router.push('/');
  }
});

// Load PDF
async function loadPdf() {
  if (!previewData.value) return;
  
  try {
    isLoading.value = true;
    
    // Load PDF document
    const loadingTask = pdfjs.getDocument(previewData.value.previewUrl);
    pdfDocument.value = await loadingTask.promise;
    numPages.value = pdfDocument.value.numPages;
    
    // Render first page
    await renderPage(currentPage.value);
    
    isLoading.value = false;
  } catch (error) {
    console.error('Error loading PDF:', error);
    isLoading.value = false;
  }
}

// Render PDF page
async function renderPage(pageNumber: number) {
  if (!pdfDocument.value) return;
  
  try {
    const page = await pdfDocument.value.getPage(pageNumber);
    const canvas = document.value?.getElementById('pdf-canvas') as HTMLCanvasElement;
    const context = canvas.getContext('2d');
    
    if (!context) return;
    
    const viewport = page.getViewport({ scale: scale.value });
    canvas.height = viewport.height;
    canvas.width = viewport.width;
    
    const renderContext = {
      canvasContext: context,
      viewport: viewport
    };
    
    await page.render(renderContext).promise;
  } catch (error) {
    console.error('Error rendering page:', error);
  }
}

// Go to previous page
async function prevPage() {
  if (currentPage.value > 1) {
    currentPage.value--;
    await renderPage(currentPage.value);
  }
}

// Go to next page
async function nextPage() {
  if (currentPage.value < numPages.value) {
    currentPage.value++;
    await renderPage(currentPage.value);
  }
}

// Zoom in
async function zoomIn() {
  scale.value += 0.25;
  await renderPage(currentPage.value);
}

// Zoom out
async function zoomOut() {
  if (scale.value > 0.5) {
    scale.value -= 0.25;
    await renderPage(currentPage.value);
  }
}

// Go back to dashboard
function goBack() {
  router.back();
}

// Edit document
function editDocument() {
  if (!document.value) return;
  router.push({ name: 'document-editor', params: { id: document.value.id } });
}
</script>

<template>
  <div class="min-h-screen flex flex-col">
    <!-- Header -->
    <header class="bg-white border-b border-gray-200 py-3 px-4 flex items-center justify-between">
      <div class="flex items-center">
        <button @click="goBack" class="mr-4 text-gray-500 hover:text-gray-700">
          <ArrowLeftIcon class="w-5 h-5" />
        </button>
        <h1 class="text-xl font-semibold text-gray-800">{{ document?.name }} (Preview)</h1>
      </div>
      <div class="flex items-center space-x-2">
        <button 
          @click="editDocument" 
          class="btn btn-primary flex items-center"
        >
          <PencilIcon class="w-5 h-5 mr-1" />
          Edit Document
        </button>
      </div>
    </header>
    
    <!-- PDF Viewer -->
    <div class="flex-1 overflow-auto bg-gray-100 p-4">
      <div class="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-4">
        <!-- PDF Controls -->
        <div class="flex justify-between items-center mb-4">
          <div class="flex items-center space-x-2">
            <button 
              @click="prevPage" 
              class="btn btn-secondary"
              :disabled="currentPage <= 1"
            >
              Previous
            </button>
            <span class="text-gray-700">
              Page {{ currentPage }} of {{ numPages }}
            </span>
            <button 
              @click="nextPage" 
              class="btn btn-secondary"
              :disabled="currentPage >= numPages"
            >
              Next
            </button>
          </div>
          <div class="flex items-center space-x-2">
            <button 
              @click="zoomOut" 
              class="btn btn-secondary"
              :disabled="scale <= 0.5"
            >
              Zoom Out
            </button>
            <span class="text-gray-700">{{ Math.round(scale * 100) }}%</span>
            <button 
              @click="zoomIn" 
              class="btn btn-secondary"
            >
              Zoom In
            </button>
          </div>
        </div>
        
        <!-- PDF Renderer -->
        <div class="flex justify-center">
          <div v-if="isLoading" class="flex items-center justify-center h-96">
            <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
          <canvas v-else id="pdf-canvas" class="border border-gray-300"></canvas>
        </div>
      </div>
    </div>
  </div>
</template>