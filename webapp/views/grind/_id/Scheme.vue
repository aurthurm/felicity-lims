<script setup lang="ts">
import useApiUtil from "@/composables/api_util";
import { AddGrindBoardMutation, AddGrindBoardMutationVariables, AddGrindBoardDocument } from "@/graphql/operations/grind.mutations";
import { GetGrindSchemeDocument, GetGrindSchemeQuery, GetGrindSchemeQueryVariables } from "@/graphql/operations/grind.queries";
import { IGrindBoard, IGrindScheme } from "@/models/grind";
import { resetForm } from "@/utils/helpers";
import { defineAsyncComponent, onMounted, reactive, ref } from "vue";
import { useRoute } from "vue-router";

const Board = defineAsyncComponent(() => import("./Board.vue"));

const { withClientMutation, withClientQuery } = useApiUtil();


const route = useRoute();
const scheme = ref<IGrindScheme>();

onMounted(() => {
    getScheme();
});

function getScheme() {
    withClientQuery<GetGrindSchemeQuery, GetGrindSchemeQueryVariables>(
        GetGrindSchemeDocument,
        {uid: route.params.schemeUid as string},
        "grindSchemeByUid"
    ).then((data) => {
        scheme.value = data as IGrindScheme;
    });
}

// Board Management
let showBoardModal = ref<boolean>(false);
let formAction = ref<boolean>(false);
let boardFormTitle = ref<string>("");
let boardForm = reactive({}) as IGrindBoard;

const openCreateBoardForm = () => {
    showBoardModal.value = true;
    boardFormTitle.value = "Create Board";
    resetForm(boardForm)
};

const saveBoardForm = () => {
    showBoardModal.value = false;
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
};

// Board Selection
let selectedBoard = ref<IGrindBoard>();
</script>

<template>
    <h3 class="h3 text-xl">
        <span class="font-bold mr-4">Project Title:</span>
        <span>{{ scheme?.title }}</span>
    </h3>
    
    <hr class="mt-2 mb-2">
    <p class="leading-2 bg-slate-50 p-2 italic font-medium text-gray-500">{{ scheme?.description }}</p>
    <hr class="mt-2 mb-2">

    <h4 class="h3 text-xl font-semibold mb-2">Boards:</h4>
    <div class="flex justify-start items-center mb-2">
        <div>
            <button v-for="board in scheme?.boards" :key="board.uid"
            class="py-1 px-4 mr-2 bg-gray-200 text-gray-600 shadow-md overflow-hidden font-medium border-2 border-gray-200"
            :class="{ 'bg-sky-500 text-white border-sky-500': selectedBoard?.uid === board.uid }"
            @click="selectedBoard = board">{{ board.title }}</button>
        </div>
        <button @click="openCreateBoardForm" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded">+ Board</button>
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
            class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500"
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
            class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500"
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