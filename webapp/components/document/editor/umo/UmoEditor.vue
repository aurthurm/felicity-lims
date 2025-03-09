<script setup lang="ts">
import { ref, onMounted, PropType, nextTick, defineAsyncComponent } from 'vue';
import { useRouter } from 'vue-router';
import { IDocumentVersion } from '@/models/document';
import { UmoEditor } from '@umoteam/editor'; 
import { ArrowLeftIcon, EyeIcon } from '@heroicons/vue/24/outline';
import { getOptions } from './options';
import useApiUtil from '@/composables/api_util';
import { EditDocumentVersionDocument, EditDocumentVersionMutation, EditDocumentVersionMutationVariables } from '@/graphql/operations/document.mutations';
const LoadingMessage = defineAsyncComponent(
  () => import("@/components/ui/spinners/FelLoadingMessage.vue")
)

const router = useRouter();
const { withClientMutation } = useApiUtil();

const props = defineProps({
  document: {
    type: Object as PropType<IDocumentVersion>,
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
  <div class="min-h-screen flex flex-col">
    <!-- Header -->
    <header class="bg-white border-b border-gray-200 py-3 px-4 flex items-center justify-between">
      <div class="flex items-center">
        <button @click="goBack" class="mr-4 text-gray-500 hover:text-gray-700">
          <ArrowLeftIcon class="w-5 h-5" />
        </button>
        <h1 class="uppercase text-xl font-semibold text-gray-800">{{ document?.document?.name }}</h1>
        <span v-if="saveMessage" class="ml-4 text-sm text-green-600">{{ saveMessage }}</span>
      </div>
      <div v-if="isSaving" class="text-center">
        <LoadingMessage message="Saving..." />
      </div>
    </header>
    
    <!-- Editor -->
    <umo-editor v-bind="umoOptions" v-if="editorReady"/>

  </div>
</template>