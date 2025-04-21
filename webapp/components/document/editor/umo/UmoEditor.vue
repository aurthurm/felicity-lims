<script setup lang="ts">
import { ref, onMounted, PropType, nextTick, defineAsyncComponent } from 'vue';
import { useRouter } from 'vue-router';
import { DocumentVersionType } from '@/types/gql';
import { ArrowLeftIcon, EyeIcon } from '@heroicons/vue/24/outline';
import { getOptions } from './options';
import useApiUtil from '@/composables/api_util';
import { EditDocumentVersionDocument, EditDocumentVersionMutation, EditDocumentVersionMutationVariables } from '@/graphql/operations/document.mutations';
const UmoEditor = defineAsyncComponent(
  () => import("@umoteam/editor")
)

const router = useRouter();
const { withClientMutation } = useApiUtil();

const props = defineProps({
  document: {
    type: Object as PropType<DocumentVersionType>,
    required: true
  }
})

const editorReady = ref(false);
const isSaving = ref(false);
const saveMessage = ref('');

const umoOptions = ref({});
onMounted(async () => {
  editorReady.value = false;
  console.log(props.document)
  localStorage.setItem('umo-editor:demo:locale', "en-US")
  localStorage.setItem('umo-editor:default:locale', "en-US")
  umoOptions.value = {
    ...getOptions(
      props.document?.document?.name,
      props.document.content?.length > 0 ? props.document.content : "Begin typing..."
    ),
    ...eventOptions
  }
  editorReady.value = true;
  await nextTick()
});

const eventOptions = {
  async onSave(content, page, document) {
    isSaving.value = true;
    withClientMutation<EditDocumentVersionMutation,EditDocumentVersionMutationVariables>(
      EditDocumentVersionDocument, {
        uid: props.document.uid!,
        payload: {content: content.html}
      }, "updateDocumentVersion"
    )
    .then(() => {}).finally(() => {
      isSaving.value = false;
    })
  },
  async onFileUpload(file) {
    if (!file) throw new Error('No File Here')
    console.log('onUpload', file)
    await new Promise((resolve) => setTimeout(resolve, 3000))
    return {
      id: new Date().getTime().toString(),
      url: file.url || URL.createObjectURL(file),
      name: file.name,
      type: file.type,
      size: file.size,
    }
  }
}

// Go back to dashboard
const goBack = () => router.back();
</script>

<template>
  <div class="min-h-screen flex flex-col" role="region" aria-label="Document editor">
    <!-- Header -->
    <header class="bg-card border-b border-border py-3 px-4 flex items-center justify-between">
      <div class="flex items-center">
        <button 
          @click="goBack" 
          class="mr-4 text-muted-foreground hover:text-card-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          aria-label="Go back to previous page"
        >
          <ArrowLeftIcon class="w-5 h-5" aria-hidden="true" />
        </button>
        <h1 class="uppercase text-xl font-semibold text-card-foreground">{{ document?.document?.name }}</h1>
        <span 
          v-if="saveMessage" 
          class="ml-4 text-sm text-success"
          role="status"
          aria-label="Save status"
        >
          {{ saveMessage }}
        </span>
      </div>
      <div 
        v-if="isSaving" 
        class="text-center"
        role="status"
        aria-label="Saving document"
      >
        <fel-loader message="Saving..." />
      </div>
    </header>
    
    <!-- Editor -->
    <umo-editor 
      v-bind="umoOptions" 
      v-if="editorReady"
      class="flex-1"
      aria-label="Document editor"
    />

  </div>
</template>

<style>
/* Override UMO editor styles to match our theme */
:deep(.umo-editor) {
  background-color: var(--card);
  color: var(--card-foreground);
  border-color: var(--border);
}

:deep(.umo-editor-toolbar) {
  background-color: var(--card);
  border-color: var(--border);
}

:deep(.umo-editor-toolbar button) {
  color: var(--card-foreground);
  transition: all 0.2s ease-in-out;
}

:deep(.umo-editor-toolbar button:hover) {
  background-color: var(--accent);
  color: var(--accent-foreground);
}

:deep(.umo-editor-toolbar button:focus) {
  outline: 2px solid var(--ring);
  outline-offset: 2px;
}

:deep(.umo-editor-content) {
  background-color: var(--card);
  color: var(--card-foreground);
}
</style>