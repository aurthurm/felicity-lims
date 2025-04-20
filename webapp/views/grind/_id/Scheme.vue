<script setup lang="ts">
import useApiUtil from "@/composables/api_util";
import { AddGrindBoardMutation, AddGrindBoardMutationVariables, AddGrindBoardDocument, EditGrindBoardMutation, EditGrindBoardMutationVariables, EditGrindBoardDocument } from "@/graphql/operations/grind.mutations";
import { GetGrindSchemeDocument, GetGrindSchemeQuery, GetGrindSchemeQueryVariables } from "@/graphql/operations/grind.queries";
import { IGrindBoard, IGrindScheme } from "@/models/grind";
import { resetForm, mutateForm } from "@/utils";
import { RequestPolicy } from "@urql/vue";
import { defineAsyncComponent, onMounted, reactive, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { ArrowLeftIcon } from '@heroicons/vue/24/outline';

const Board = defineAsyncComponent(() => import("./Board.vue"));

const { withClientMutation, withClientQuery } = useApiUtil();

const route = useRoute();
const scheme = ref<IGrindScheme>();

onMounted(async () => {
  await getScheme();

  if (route.query.board) {
    const board = scheme.value?.boards?.find(b => b.uid === route.query.board);
    if (board) {
      selectBoard(board);
    } 
  } 
});

function getScheme(requestPolicy: RequestPolicy = 'cache-first'): Promise<void> {
  return withClientQuery<GetGrindSchemeQuery, GetGrindSchemeQueryVariables>(
    GetGrindSchemeDocument,
    { uid: route.params.schemeUid as string },
    "grindSchemeByUid",
    requestPolicy
  ).then((data) => {
    scheme.value = data as IGrindScheme;
  });
}

// Board Management
let boardAction = ref<boolean>(false);
let showBoardModal = ref<boolean>(false);
let formAction = ref<boolean>(false);
let boardFormTitle = ref<string>("");
let boardForm = reactive({}) as IGrindBoard;

const openCreateBoardForm = () => {
    boardAction.value = true;
    showBoardModal.value = true;
    boardFormTitle.value = "Create Board";
    resetForm(boardForm)
};

const saveBoardForm = () => {
    showBoardModal.value = false;
    if(boardAction.value){
      withClientMutation<AddGrindBoardMutation, AddGrindBoardMutationVariables>(
          AddGrindBoardDocument,
          { payload: { ...boardForm, schemeUid: route.params.schemeUid as string} },
          "createGrindBoard"
      ).then((board) => {
          if (!scheme.value!.boards) {
              scheme.value!.boards = [];
          }
          scheme.value!.boards.push(board as IGrindBoard);
      });
    } else {
      withClientMutation<EditGrindBoardMutation, EditGrindBoardMutationVariables>(
        EditGrindBoardDocument,
          { 
            uid: boardForm.uid,
            payload: { title: boardForm.title, description: boardForm.description } 
          },
          "updateGrindBoard"
      ).then(() => getScheme('network-only'));
    }
    boardAction.value = false;
};

const updateBoard = (board: IGrindBoard) => {
  boardAction.value = false;
  mutateForm(boardForm, board, true)
  boardFormTitle.value = "Update Board";
  showBoardModal.value = true;
}

// Board Selection
let selectedBoard = ref<IGrindBoard>();
const selectBoard =(board) => {
  selectedBoard.value = board
  router.push({query: {board: board.uid}})
}

// Go back
const router = useRouter();
function goBack() {
  router.back();
}
</script>

<template>
  <div class="bg-background rounded-lg shadow-sm border border-border p-6 space-y-6">
    <!-- Header -->
    <div class="flex items-center space-x-4">
      <button 
        @click="goBack" 
        class="p-1 text-muted-foreground hover:text-foreground transition-colors duration-200"
      >
        <ArrowLeftIcon class="w-5 h-5" />
      </button>
      <div class="flex items-center space-x-4">
        <h1 class="text-2xl font-bold text-foreground">Project Title:</h1>
        <span class="text-xl text-foreground">{{ scheme?.title }}</span>
      </div>
    </div>

    <!-- Description -->
    <div class="space-y-4">
      <div class="border-t border-b border-border py-4">
        <p class="text-muted-foreground italic">{{ scheme?.description }}</p>
      </div>
    </div>

    <!-- Boards Section -->
    <div class="space-y-4">
      <h2 class="text-xl font-semibold text-foreground">Boards</h2>
      <div class="flex flex-wrap items-center gap-2">
        <div class="flex flex-wrap gap-2">
          <button 
            v-for="board in scheme?.boards" 
            :key="board.uid"
            class="px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            :class="[
              selectedBoard?.uid === board.uid 
                ? 'bg-primary text-primary-foreground border-transparent' 
                : 'bg-muted text-foreground border border-border hover:bg-muted/80'
            ]"
            @click="selectBoard(board)"
            @dblclick="updateBoard(board)"
          >
            {{ board.title }}
          </button>
        </div>
        <button 
          @click="openCreateBoardForm" 
          class="px-4 py-2 text-sm font-medium text-primary-foreground bg-primary border border-transparent rounded-md shadow-sm hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-colors duration-200"
        >
          + Board
        </button>
      </div>
    </div>

    <!-- Selected Board -->
    <board v-if="selectedBoard" :board="selectedBoard" />

    <!-- Create/Edit Board Modal -->
    <fel-modal v-if="showBoardModal" @close="showBoardModal = false" content-width="w-full max-w-2xl">
      <template v-slot:header>
        <h3 class="text-lg font-semibold text-foreground">{{ boardFormTitle }}</h3>
      </template>
      
      <template v-slot:body>
        <form @submit.prevent="saveBoardForm" class="space-y-6">
          <!-- Scheme Title -->
          <div>
            <label class="block text-sm font-medium text-foreground mb-1" for="title">
              Scheme Title <span class="text-destructive">*</span>
            </label>
            <input
              id="title"
              v-model="boardForm.title"
              type="text"
              required
              class="w-full px-3 py-2 text-foreground bg-background border border-border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
              placeholder="Enter scheme title"
            />
          </div>  
          
          <!-- Description -->
          <div>
            <label class="block text-sm font-medium text-foreground mb-1" for="description">
              Description
            </label>
            <textarea
              id="description"
              v-model="boardForm.description"
              rows="3"
              class="w-full px-3 py-2 text-foreground bg-background border border-border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
              placeholder="Enter scheme description"
            ></textarea>
          </div>
          
          <!-- Submit button -->
          <div class="flex justify-end space-x-3">
            <button
              type="button"
              @click="showBoardModal = false"
              class="px-4 py-2 text-sm font-medium text-foreground bg-background border border-border rounded-md shadow-sm hover:bg-muted focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              class="px-4 py-2 text-sm font-medium text-primary-foreground bg-primary border border-transparent rounded-md shadow-sm hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-colors duration-200"
            >
              {{ formAction ? 'Create' : 'Update' }}
            </button>
          </div>
        </form>
      </template>
    </fel-modal>
  </div>
</template>

<style scoped>
.space-y-6 > :not([hidden]) ~ :not([hidden]) {
  margin-top: 1.5rem;
}

.space-y-4 > :not([hidden]) ~ :not([hidden]) {
  margin-top: 1rem;
}
</style>