<script setup lang="ts">
import useApiUtil from "@/composables/api_util";
import { GetGrindPostersByBoardDocument, GetGrindPostersByBoardQuery, GetGrindPostersByBoardQueryVariables } from "@/graphql/operations/grind.queries";
import { IGrindBoard, IGrindPoster } from "@/models/grind";
import { computed, defineAsyncComponent, PropType, ref, toRef, watch } from "vue";
const FelTabs = defineAsyncComponent(() => import("@/components/ui/tabs/FelTabs.vue"))
const { withClientQuery } = useApiUtil();

const props = defineProps({
  board:{
    type: Object as PropType<IGrindBoard>,
    required: true
  }
});

// Use props directly, not destructured
const posters = ref<IGrindPoster[]>([]);

watch(() => props.board?.uid, (newBoardUid) => {
  if (!newBoardUid) return;
  
  withClientQuery<GetGrindPostersByBoardQuery, GetGrindPostersByBoardQueryVariables>(
    GetGrindPostersByBoardDocument,
    { boardUid: newBoardUid },
    "grindPostersByBoard"
  ).then((res) => {
    posters.value = res as IGrindPoster[];
  });
}, { immediate: true });

// For your tabs, use a computed that depends on props.board.uid
const tabs = computed(() => [
  {
    id: "board-view", label: "board-view",
    component: defineAsyncComponent(() => import("./BoardView.vue")),
    props: {posters: posters.value, boardUid: props.board?.uid}
  },
])
</script>

<template>
    <hr class="mt-2 mb-2">
    <p class="leading-2 bg-slate-50 p-2 italic font-medium text-muted-foreground">{{ board?.description }}</p>
    <hr class="mt-2 mb-2">

    <fel-tabs :tabs="tabs" initial-tab="board-view" />
</template>