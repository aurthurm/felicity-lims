<script setup lang="ts">
  import modal from '../../../components/SimpleModal.vue';
  import { reactive, computed, ref } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import { ADD_BOARD_LISTING, DELETE_BOARD } from '../../../graphql/kanban.mutations';
  import { IBoard, IListing } from '../../../models/kanban';
  import { useKanbanStore } from '../../../stores';
  import { useApiUtil } from '../../../composables';

  const route = useRoute();
  const router = useRouter();
  const kanbanStore = useKanbanStore();
  const { withClientMutation } = useApiUtil();

  // Modal Vars
  let showModal = ref<boolean>(false);
  let formTitle = ref<string>("");
  let form = reactive({} as IListing);

  kanbanStore.resetBoard();
  kanbanStore.fetchBoardByUid(+route.params.boardUid);
  const board = computed(() => kanbanStore.getBoard );

  function addBoardListing(): void {
    const payload = { title: form.title, description: form.description, boardUid: board.value?.uid };
    withClientMutation(ADD_BOARD_LISTING, { payload }, "createBoardListing")
    .then((result) => kanbanStore.addBoardListing(result));
  }

  function FormManager(): void {
    showModal.value = true;
    formTitle.value = "ADD BOARD LISTING";
    Object.assign(form, {} as IListing);
  }

  function saveForm():void {
    addBoardListing();
    showModal.value = false;
  }

  // Delete Board
  function canDeleteBoard(board: IBoard): boolean {
    if(board?.boardListings?.length === 0) return true;
    let canDetele = true;
    board?.boardListings?.forEach((listing: IListing) => {
      if(listing?.listingTasks?.length! > 0) canDetele = false;
    })
    return canDetele
  }

  function deletekanBanBoard(board: IBoard): void {
    withClientMutation(DELETE_BOARD, { uid: board?.uid }, "deleteBoard")
    .then(result => {
      kanbanStore.deleteBoard(result)
      router.push({ name: "kanban-boards"});
    }) 
  }

  const showAddList = computed(() => !route.path.includes("task") )
</script>

<template>

  <div class="flex justify-start">
    <div class="flex-1">
      <div class="flex justify-between">
        <h2 class="h2 font-bold">BOARD: {{ board?.title || 'No title'}}</h2>
        <button 
        v-show="canDeleteBoard(board!)"
        @click="deletekanBanBoard(board!)" 
        class="align-center p-1 text-red-600">
          <i class="fa fa-trash" aria-hidden="true"></i> Board
        </button>
      </div>
      <hr class="my-2">
      <p class="leading tracking-wide italic grey-300">{{ board?.description || "No description"}}</p>
      <hr class="mt-2">
    </div>
    <div class="ml-4">
        <button 
        v-show="showAddList"
        class="mt-6 border border-gray-900 border-dashed rounded py-2 px-2 text-gray-500"
        @click.prevent="FormManager()">
          <i class="fa fa-plus-circle" aria-hidden="true"></i> Listing
        </button>
    </div>
  </div>
    
  <router-view />

  <!-- Add Listing Modal -->
  <modal v-if="showModal" @close="showModal = false"  :contentWidth="'w-1/3'">
    <template v-slot:header>
      <h3>{{ formTitle }}</h3>
    </template>

    <template v-slot:body>
      <form action="post" class="p-1">

        <div class="grid grid-cols-2 gap-x-4 mb-4">
          <label class="block col-span-2 mb-2">
            <span class="text-gray-700">Title</span>
            <input
              class="form-input mt-1 block w-full"
              v-model="form.title"
              placeholder="Name ..."
            />
          </label>
          <label class="block col-span-2 mb-2">
            <span class="text-gray-700">Description</span>
            <textarea
            cols="2"
              class="form-input mt-1 block w-full"
              v-model="form.description"
              placeholder="Description ..."
            />
          </label>
        </div>

        <hr />
        <button
          type="button"
          @click.prevent="saveForm()"
          class="-mb-4 w-full border border-green-500 bg-green-500 text-white rounded-md px-4 py-2 m-2 transition-colors duration-500 ease select-none hover:bg-green-600 focus:outline-none focus:shadow-outline"
        >
          Save Form
        </button>
      </form>
    </template>
  </modal>

</template>
