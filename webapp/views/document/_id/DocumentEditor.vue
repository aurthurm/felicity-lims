<script setup lang="ts">
import useApiUtil from '@/composables/api_util';
import { GetDocumentVersionByBidDocument, GetDocumentVersionByBidQuery, GetDocumentVersionByBidQueryVariables } from '@/graphql/operations/document.queries';
import { IDocumentVersion } from '@/models/document';
import { computed, onMounted, ref, defineAsyncComponent } from 'vue';
import { useRoute } from 'vue-router';
const LoadingMessage = defineAsyncComponent(
  () => import("@/components/ui/spinners/FelLoadingMessage.vue")
)
const UmoEditor = defineAsyncComponent(
  () => import("@/components/document/editor/umo/UmoEditor.vue")
)
const SyncfusionEditor = defineAsyncComponent(
  () => import("@/components/document/editor/syncfusion/SyncfusionEditor.vue")
)

const route = useRoute();
const { withClientQuery } = useApiUtil()
const documentUid = computed(() => route.params.documentVersionUid as string);
const document = ref<IDocumentVersion | null>(null);
const isFetching = ref(false);

onMounted(() => {
  isFetching.value = true;
  withClientQuery<GetDocumentVersionByBidQuery, GetDocumentVersionByBidQueryVariables>(
    GetDocumentVersionByBidDocument, { uid: documentUid.value }, "documentVersionByUid"
  )
  .then((doc: any) => (document.value = doc))
  .finally(() => (isFetching.value = false))
});

</script>

<template>
  <div v-if="isFetching" class="text-center">
    <LoadingMessage message="Loading Document..." />
  </div>
  <div v-else>
    <p v-if="!document">No document Found</p>
    <!-- <component v-else
    :is="document?.editor === 'syncfusion' ? SyncfusionEditor : UmoEditor"
    :document="document" /> -->
    <component v-else
    :is="document?.editor === 'syncfusion' ? UmoEditor : SyncfusionEditor"
    :document="document" />
  </div>
</template>