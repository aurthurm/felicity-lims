<template>
    <div class="flex flex-items-center">
      <h1 class="h1 my-4 font-bold text-dark-700">BOARDS</h1>
        <button
          class="px-2 py-1 my-2 ml-8 text-sm border-blue-500 border text-dark-700 transition-colors duration-150 rounded-lg focus:outline-none hover:bg-blue-500 hover:text-gray-100"
          @click="FormManager(true, null)"
        > Add Board</button>
    </div>
    <hr class="my-4">
    <div class="grid grid-cols-4 gap-4">
      <span v-for="board in boards" :key="board?.title">
        <router-link :to="{ name: 'board-detail', params: { boardUid: board?.uid }}">
          <BoardCard  :board="board" class="col-span-1"/>
        </router-link>
      </span>
    </div>


  <!-- Board Modal -->
  <modal v-if="showModal" @close="showModal = false" :contentWidth="'w-1/3'">
    <template v-slot:header>
      <h3>{{ formTitle }}</h3>
    </template>

    <template v-slot:body>
      <form action="post" class="p-1">

        <div class="grid grid-cols-2 gap-x-4 mb-4">
          <label class="block col-span-2 mb-2">
            <span class="text-gray-700">Name</span>
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
          <label class="block col-span-2 mb-2">
            <span class="text-gray-700">Department</span>
            <select class="form-select block w-full mt-1" v-model="form.departmentUid" >
              <option></option>
              <option v-for="dept in departments" :key="dept.uid" :value="dept.uid">{{ dept?.name }}</option>
            </select>
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

<script lang="ts">
import modal from '../_components/SimpleModal.vue';
import BoardCard from '../_components/BoardCard.vue';
import { useStore } from 'vuex';
import { useMutation } from '@urql/vue';
import { ActionTypes, Board, IBoard } from '../../store/modules/kanban';
import { ActionTypes as BaseActionTypes } from '../../store/actions';
import {ADD_BOARD, EDIT_BOARD } from '../../graphql/kanban.mutations';
import { defineComponent, ref, reactive, computed } from 'vue';
export default defineComponent({
  name: "Kanban-Boards",
  components: {
    modal,
    BoardCard
  },
  setup() {
    let store = useStore();
    let showModal = ref(false);
    let movedObjectsIds = ref([]);
    let moveTimeOut = ref(null);

    // Modal Vars
    let formTitle = ref("")
    let formAction = ref(false);
    let form = reactive({ ...new Board() });

    store.dispatch(BaseActionTypes.FETCH_DEPARTMENTS)
    store.dispatch(ActionTypes.FETCH_BOARDS)

    const { executeMutation: createBoard } = useMutation(ADD_BOARD);
    const { executeMutation: updateBoard } = useMutation(EDIT_BOARD);

    function addBoard(): void {
      createBoard({ title: form.title, departmentUid: form.departmentUid, description: form.description }).then((result) => {
       store.dispatch(ActionTypes.ADD_BOARD, result);
      });
    }

    function editBoard(): void {
      updateBoard({ uid: form.uid, title: form.title, departmentUid: form.departmentUid, description: form.description }).then((result) => {
        // store.dispatch(ActionTypes.UPDATE_BOARD, result);
      });
    }

    function FormManager(create: boolean, obj: IBoard): void {
      formAction.value = create;
      showModal.value = true;
      formTitle.value = (create ? 'CREATE' : 'EDIT') + ' ' + "BOARD";
      if (create) {
        Object.assign(form, { ...new Board });
      } else {
        Object.assign(form, { ...obj });
      }
    }

    function saveForm():void {
      if (formAction.value === true) addBoard();
      if (formAction.value === false) editBoard();
      showModal.value = false;
    }

    return { 
      boards: computed(() => store.getters.getBoards),
      showModal,
      departments: computed(() => store.getters.getDepartments),
      FormManager,
      saveForm,
      form,
      formTitle,
    }
  },
});
</script>

<style scoped>
.column-width {
  min-width: 320px;
  width: 320px;
}

.ghost-card {
  @apply border opacity-50 border-blue-500 bg-gray-200
}
</style>
