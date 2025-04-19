<script setup lang="ts">
import useApiUtil from "@/composables/api_util";
import { AddGrindBoardMutation, AddGrindBoardMutationVariables, AddGrindBoardDocument, EditGrindBoardMutation, EditGrindBoardMutationVariables, EditGrindBoardDocument } from "@/graphql/operations/grind.mutations";
import { GetGrindSchemeDocument, GetGrindSchemeQuery, GetGrindSchemeQueryVariables } from "@/graphql/operations/grind.queries";
import { IGrindBoard, IGrindScheme } from "@/models/grind";
import { resetForm, mutateForm } from "@/utils/helpers";
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
     <div class="flex items-center">
        <button @click="goBack" class="mr-4 text-muted-foreground hover:text-gray-700">
          <ArrowLeftIcon class="w-5 h-5" />
        </button>
        <h3 class="h3 text-xl">
            <span class="font-bold mr-4">Project Title:</span>
            <span>{{ scheme?.title }}</span>
        </h3>
      </div>

    
    <hr class="mt-2 mb-2">
    <p class="leading-2 bg-slate-50 p-2 italic font-medium text-muted-foreground">{{ scheme?.description }}</p>
    <hr class="mt-2 mb-2">

    <h4 class="h3 text-xl font-semibold mb-2">Boards:</h4>
    <div class="flex justify-start items-center mb-2">
        <div>
            <button v-for="board in scheme?.boards" :key="board.uid"
            class="py-1 px-4 mr-2 bg-muted text-gray-600 shadow-md overflow-hidden font-medium border-2 border-gray-200"
            :class="{ 'bg-sky-500 text-white border-sky-500': selectedBoard?.uid === board.uid }"
            @click="selectBoard(board)"
            @dblclick="updateBoard(board)">
            {{ board.title }}</button>
        </div>
        <button @click="openCreateBoardForm" class="bg-accent hover:bg-blue-700 text-white font-bold py-1 px-2 rounded">+ Board</button>
    </div>

    <board v-if="selectedBoard" :board="selectedBoard" />

  <!-- Create/Edit Board Modal -->
  <modal v-if="showBoardModal" @close="showBoardModal = false" content-width="w-full max-w-2xl">
    <template v-slot:header>
      <h3 class="text-lg font-semibold">{{ boardFormTitle }}</h3>
    </template>
    
    <template v-slot:body>
      <form @submit.prevent="saveBoardForm">
        <!-- Scheme Title -->
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-1" for="title">
            Scheme Title <span class="text-red-500">*</span>
          </label>
          <input
            id="title"
            v-model="boardForm.title"
            type="text"
            required
            class="w-full px-3 py-2 border border-border rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500"
            placeholder="Enter scheme title"
          />
        </div>  
        
         <!-- Description -->
         <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-1" for="description">
            Description
          </label>
          <textarea
            id="description"
            v-model="boardForm.description"
            rows="3"
            class="w-full px-3 py-2 border border-border rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500"
            placeholder="Enter scheme description"
          ></textarea>
        </div>
        
        <!-- Submit button -->
        <div class="flex justify-end">
          <button
            type="submit"
            class="px-4 py-2 text-sm font-medium text-white bg-sky-600 border border-transparent rounded-md shadow-sm hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-500"
          >
            {{ formAction ? 'Create' : 'Update' }}
          </button>
        </div>
      </form>
    </template>
  </modal>
</template>