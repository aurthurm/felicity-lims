<script setup lang="ts">
import useApiUtil from "@/composables/api_util";
import { GetGrindPostersByBoardDocument, GetGrindPostersByBoardQuery, GetGrindPostersByBoardQueryVariables } from "@/graphql/operations/grind.queries";
import { GrindBoardType, GrindPosterType } from "@/types/gql";
import { computed, defineAsyncComponent, PropType, ref, toRef, watch } from "vue";

const { withClientQuery } = useApiUtil();

const props = defineProps({
  board:{
    type: Object as PropType<GrindBoardType>,
    required: true
  }
});

// Use props directly, not destructured
const posters = ref<GrindPosterType[]>([]);

watch(() => props.board?.uid, (newBoardUid) => {
  if (!newBoardUid) return;
  
  withClientQuery<GetGrindPostersByBoardQuery, GetGrindPostersByBoardQueryVariables>(
    GetGrindPostersByBoardDocument,
    { boardUid: newBoardUid },
    "grindPostersByBoard"
  ).then((res) => {
    posters.value = res as GrindPosterType[];
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
  <div class="space-y-4">
    <div class="border-t border-border my-4"></div>
    
    <p class="bg-background p-4 rounded-lg text-muted-foreground italic font-medium leading-relaxed">
      {{ board?.description }}
    </p>
    
    <div class="border-t border-border my-4"></div>

    <fel-tabs 
      :tabs="tabs" 
      initial-tab="board-view"
      class="mt-4"
    />
  </div>
</template>

<style scoped>
.space-y-4 > :not([hidden]) ~ :not([hidden]) {
  margin-top: 1rem;
}
</style>