<template>
    <div class="flex justify-start">
        <div class="h-tasks flex overflow-x-scroll py-2">
            <div v-for="listing in board?.boardListings" :key="listing?.title" class="bg-gray-100 px-3 py-3 column-width rounded mr-4">
                <h4 class="h4 text-gray-600 font-bold font-sans tracking-wide text-medium" :data-listing="listing?.uid">{{listing?.title}}</h4>
                <p class="h4 text-gray-500 font-normal italic font-sans tracking-wide text-small">{{listing?.description}}</p>
                <draggable 
                :list="listing?.listingTasks" 
                group="tasks" 
                ghost-class="ghost-card" 
                item-key="listing.title"
                @start="drag=true" 
                @end="drag=false"
                :sort="true"
                :move="checkMove"
                >
                    <template #item="{element}" >
                        <router-link :to="{ name: 'task-detail', params: { taskUid: element.uid }}">
                          <task-card 
                          :key="element.id" 
                          :task="element" 
                          class="mt-3 cursor-move"/>
                        </router-link>
                    </template>
                    <template #header>
                      <div class="flex justify-start my-1">
                        <button @click="TaskFormManager(listing)" class="align-center p-1">
                          <i class="fa fa-plus-circle" aria-hidden="true"></i> Task
                        </button>
                        <button 
                        v-show="listing?.listingTasks?.length === 0"
                        @click="deleteListing(listing)" 
                        class="align-center p-1 ml-8 text-red-600">
                          <i class="fa fa-trash" aria-hidden="true"></i> Listing
                        </button>
                      </div>
                    </template>
                </draggable>
            </div>
        </div>
    </div>

  <!-- Add Listing Modal -->
  <modal v-if="showTaskModal" @close="showTaskModal = false" :contentWidth="'w-1/3'">
    <template v-slot:header>
      <h3>{{ taskFormTitle }}</h3>
    </template>

    <template v-slot:body>
      <form action="post" class="p-1">

        <div class="grid grid-cols-2 gap-x-4 mb-4">
          <label class="block col-span-2 mb-2">
            <span class="text-gray-700">Title</span>
            <input
              class="form-input mt-1 block w-full"
              v-model="taskForm.title"
              placeholder="Name ..."
            />
          </label>
          <label class="block col-span-2 mb-2">
            <span class="text-gray-700">Description</span>
            <textarea
            cols="2"
              class="form-input mt-1 block w-full"
              v-model="taskForm.description"
              placeholder="Description ..."
            />
          </label>
        </div>

        <hr />
        <button
          type="button"
          @click.prevent="saveTaskForm()"
          class="-mb-4 w-full border border-green-500 bg-green-500 text-white rounded-md px-4 py-2 m-2 transition-colors duration-500 ease select-none hover:bg-green-600 focus:outline-none focus:shadow-outline"
        >
          Save Form
        </button>
      </form>
    </template>
  </modal>


</template>

<script lang="ts">
import modal from '../../../components/SimpleModal.vue';
import draggable from "vuedraggable";
import TaskCard from "../../components/TaskCard.vue";
import { useStore } from 'vuex';
import { useMutation } from '@urql/vue';
import { ActionTypes } from '../../../store/modules/kanban';
import { 
  ADD_LISTING_TASK, 
  EDIT_LISTING_TASK,
  DELETE_BOARD_LISTING } from '../../../graphql/kanban.mutations';
import { defineComponent, ref, reactive, computed } from 'vue';
import { IListing, ITask } from '../../../models/kanban';
export default defineComponent({
  name: "Kanban-Tasks",
  components: {
    TaskCard,
    draggable,
    modal
  },
  setup() {
      let store = useStore();
      let showModal = ref(false);
      let modalTitle = ref("Default")
      let movedObjectsIds = ref<string[]>([]);

      function log(event: any) {
          if (event.moved) console.log("moved")
          if (event.removed) console.log("removed")
          if (event.added) console.log("added")
          // console.log(event)
      }

      function removeFromMoved(val: string) {
        const index = movedObjectsIds.value.indexOf(val);
        if (index > -1) {
            movedObjectsIds.value.splice(index, 1);
        }
      }
      
      function movedFrom(event: any) {
          return event.from.previousElementSibling.innerText;
      }
      
      function movedTo(event: any) {
          return event.to.parentElement.firstElementChild.innerText;
      }
      
      function movedToLIstingUid(event: any) {
          return event.to.parentElement.firstElementChild.dataset.listing;
      }

      function checkMove(event: any) {
            const from = movedFrom(event)
            const toUid = movedToLIstingUid(event)
            const to = movedTo(event)
            const futureIndex = event.draggedContext.futureIndex
            const element = event.draggedContext.element
            setTimeout(function(){
              editListingTask('moveTask', {
                uid: element?.uid,
                listingUid: +toUid,
              });
            }, 500)
      }

      // Task Form
      let showTaskModal = ref<boolean>(false);
      let taskFormTitle = ref<string>("");
      let taskForm = reactive<ITask>({});

      const { executeMutation: createListingTask } = useMutation(ADD_LISTING_TASK);
      const { executeMutation: updateListingTask } = useMutation(EDIT_LISTING_TASK);

      function addListingTask(): void {
        createListingTask({ title: taskForm.title, description: taskForm.description, listingUid: taskForm.listingUid }).then((result) => {
          store.dispatch(ActionTypes.ADD_LISTING_TASK, result);
        });
      }

      function editListingTask(updateType: string, updateData: any): void {
        updateListingTask({ ...updateData }).then((result) => {
          if(updateType === 'moveTask') store.dispatch(ActionTypes.MOVE_LISTING_TASK, result);
          if(updateType === 'updateTask') store.dispatch(ActionTypes.UPDATE_LISTING_TASK, result);
        });
      }

      function TaskFormManager(listing: IListing): void {
        showTaskModal.value = true;
        taskFormTitle.value = "ADD " + listing.title + " LISTING";
        Object.assign(taskForm, { listingUid: listing.uid } as ITask);
      }

      function saveTaskForm():void {
        addListingTask();
        showTaskModal.value = false;
      }
      
      // Delete Listing
      const { executeMutation: deleteBoardListing } = useMutation(DELETE_BOARD_LISTING);

      function deleteListing(listing: IListing): void {
        deleteBoardListing({ uid: listing?.uid }).then(result => {
          store.dispatch(ActionTypes.DELETE_BOARD_LISTING, result);
        })
      }

      return { 
          board: computed(() => store.getters.getBoard ),
          checkMove,
          showTaskModal,
          taskForm,
          taskFormTitle,
          deleteListing,
          TaskFormManager,
          saveTaskForm,
      }
  },
});
</script>

<style scoped>

.h-tasks {
  height: 80vh;
}
.column-width {
  min-width: 320px;
  width: 320px;
}

.ghost-card {
  @apply border opacity-50 border-blue-500 bg-gray-200
}
</style>
