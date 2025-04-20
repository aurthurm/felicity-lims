<script setup lang="ts">
import { computed, onMounted, ref, defineAsyncComponent } from 'vue';
import { useRoute } from 'vue-router';
import useApiUtil from '@/composables/api_util';
import { GetDocumentVersionByBidDocument, GetDocumentVersionByBidQuery, GetDocumentVersionByBidQueryVariables } from '@/graphql/operations/document.queries';
import { IDocumentVersion } from '@/models/document';

// Lazy load components
const UmoEditor = defineAsyncComponent(
  () => import('@/components/document/editor/umo/UmoEditor.vue')
);
const SyncfusionEditor = defineAsyncComponent(
  () => import('@/components/document/editor/syncfusion/SyncfusionEditor.vue')
);

// Initialize composables and route
const route = useRoute();
const { withClientQuery } = useApiUtil();

// Computed properties
const documentUid = computed(() => route.params.documentVersionUid as string);

// Local state
const document = ref<IDocumentVersion | null>(null);
const isFetching = ref(false);

// Methods
const fetchDocument = async () => {
  isFetching.value = true;
  try {
    withClientQuery<GetDocumentVersionByBidQuery, GetDocumentVersionByBidQueryVariables>(
      GetDocumentVersionByBidDocument,
      { uid: documentUid.value },
      'documentVersionByUid'
    ).then(doc => {
      document.value = doc as IDocumentVersion;
    });
  } catch (error) {
    console.error('Error fetching document:', error);
  } finally {
    isFetching.value = false;
  }
};

// Lifecycle hooks
onMounted(() => {
  fetchDocument();
});
</script>

<template>
  <div class="min-h-screen bg-background p-6">
    <div v-if="isFetching" class="flex items-center justify-center h-full">
      <fel-loader message="Loading Document..." />
    </div>
    <div v-else-if="!document" class="text-center text-muted-foreground">
      <p>No document found</p>
    </div>
    <component
      v-else
      :is="document.editor === 'syncfusion' ? UmoEditor : SyncfusionEditor"
      :document="document"
      class="h-full"
    />
  </div>
</template>

<style lang="postcss">
/* Component-specific styles can be added here */
</style>