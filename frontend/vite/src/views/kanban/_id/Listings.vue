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
                        <task-card 
                        :key="element.id" 
                        :task="element" 
                        class="mt-3 cursor-move" 
                        @click.prevent="viewTask(element, listing)"/>
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


  <!-- Task Modal -->
  <modal v-if="showModal" @close="showModal = false"  :contentWidth="'w-3/5'">
    <template v-slot:header>
         <div>
          <span class="italic">in &rarr;</span>  
          <span class=" ml-2 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-gray-100 bg-blue-600 rounded"> {{ selectedTaskListing?.title }}</span>
         </div>
    </template>
    <template v-slot:body>
      <div class="grid grid-cols-3 gap-4">
          <section class="col-span-2">
            <div class="mb-3 -mt-2">
              <div>
                <span 
                v-if="!selectedTask?.complete"
                @dblclick="toggleTaskStatus(selectedTask)"
                class="border border-green-500 text-green-500 rounded-md py-1 px-2  transition-colors duration-500 ease select-none hover:bg-green-500 hover:text-gray-100 focus:outline-none focus:shadow-outline">Open</span>
                <span 
                v-else
                @dblclick="toggleTaskStatus(selectedTask)"
                class="border border-green-500 text-green-500 rounded-md py-1 px-2  transition-colors duration-500 ease select-none hover:bg-green-500 hover:text-gray-100 focus:outline-none focus:shadow-outline">Closed</span>

                <span v-if="selectedTask?.assigneeUid">
                  <span 
                  v-show="selectedTask?.assignee?.auth?.userName"
                  class="ml-4">@</span>{{selectedTask?.assignee?.auth?.userName}}
                </span>

                <button
                  type="button"
                  @click="changeAssignee = !changeAssignee"
                  class="ml-4 text-blue-500 rounded-md py-1 px-1  transition-colors duration-500 ease select-none hover:bg-blue-500 hover:text-gray-100 focus:outline-none focus:shadow-outline"
                  ><i class="fas fa-exchange-alt" aria-hidden="true"></i></button>

                <span>
                  <label  
                  v-show="changeAssignee"
                  class="inline" >
                    <select 
                    class="form-select ml-4"
                    v-model="newAssignee"
                    @change="assignTaskAssignee(selectedTask)">
                      <option></option>
                      <option v-for="user in users" :key="user?.uid" :value="user?.uid">@{{ user?.auth?.userName }}</option>
                    </select>
                  </label>
                </span>

              </div>
            </div>
            <hr>
            <div class="pr-2 overflow-y-scroll" style="height: 65vh">
              <section>
                <input 
                class="form-input mt-1 block w-full text-lg font-semibold"
                @keyup="updateTaskTitle(selectedTask, $event)" 
                :value="selectedTask?.title"/>
                <textarea 
                rows="3"
                :value="selectedTask?.description"
                class="form-input font-medium tracking-wide text-gray-600 w-full p-2"></textarea>
              </section>
              <hr>
              <section class="font-medium my-4">
                <h4 class="my-4 flex justify-between"> 
                  <span class="text-lg font-semibold">CheckList</span>
                  <button
                    type="button"
                  @click.prevent="showAddMilestone = !showAddMilestone"
                    class="text-blue-500 rounded-md py-1 px-2  transition-colors duration-500 ease select-none hover:bg-blue-500 hover:text-gray-100 focus:outline-none focus:shadow-outline"
                  ><i class="fas fa-plus" aria-hidden="true"></i></button>
                </h4>

              <form 
              v-show="showAddMilestone"
              action="post" 
              class="border-2 border-gray-200 border-dotted rounded p-1" 
              autocomplete="off">
                  <div class="flex justify-between">
                    <label class="block mb-2 w-3/6">
                      <span class="text-gray-700">Title</span>
                      <input class="form-input mt-1 block w-full" v-model="taskMilestone.title" placeholder="Title ..." />
                    </label>
                    <label class="block mb-2 w-2/6" >
                      <span class="text-gray-700">Assignee</span>
                      <select class="form-select block w-full mt-1" v-model="taskMilestone.assigneeUid">
                        <option></option>
                        <option v-for="user in users" :key="user?.uid" :value="user?.uid">{{ user?.auth?.userName }}</option>
                      </select>
                    </label>
                    <label class="inline-flex items-center -mb-6 1/6">
                      <input type="checkbox" class="form-checkbox text-green-500 mx-4" v-model="taskMilestone.done" />
                      <span class="ml-2">Done</span>
                    </label>
                  </div>
                  <button
                    type="button"
                    @click.prevent="saveTaskMilestone(selectedTask, true)"
                    class="border border-blue-500 text-blue-500 rounded-md py-1 px-2  transition-colors duration-500 ease select-none hover:bg-blue-500 hover:text-gray-100 focus:outline-none focus:shadow-outline"
                  >Save</button>
                </form>

                <div 
                v-for="milestone in selectedTask?.milestones"
                :key="milestone?.uid"
                class="my-1 tracking-wide text-gray-500">
                    <span class="mr-2 text-green-600">-</span>
                    <span>{{ milestone?.title }}</span>
                    <span v-if="milestone?.done" class="mx-2 text-green-600"><i class="fas fa-check"></i></span>
                    <span v-else="milestone?.done" class="mx-2 text-red-600"><i class="fas fa-times"></i></span>
                    <span v-if="milestone?.assignee?.auth?.userName">@{{ milestone?.assignee?.auth?.userName }}</span>
                </div>
              </section>
              <hr>
              <section class="my-4">
                <h4 class="my-4 flex justify-between"> 
                  <span class="text-lg font-semibold">Comments</span>
                  <button
                    type="button"
                  @click.prevent="showAddComment = !showAddComment"
                    class=" text-blue-500 rounded-md py-1 px-2  transition-colors duration-500 ease select-none hover:bg-blue-500 hover:text-gray-100 focus:outline-none focus:shadow-outline"
                  ><i class="fas fa-plus" aria-hidden="true"></i></button>
                </h4>
                <div 
                v-show="showAddComment"
                class="mb-2">
                    <label class="block mb-2">
                        <textarea
                        cols="2"
                        class="form-input mt-1 block w-full"
                        placeholder="Description ..."
                        v-model="taskCommentEntry"
                        />
                    </label>
                    <button 
                    @click="saveTaskComment(selectedTask, true)"
                    class="border border-blue-500 text-blue-500 rounded-md py-1 px-2  transition-colors duration-500 ease select-none hover:bg-blue-500 hover:text-gray-100 focus:outline-none focus:shadow-outline">Add Comment</button>
                </div>
                <div>
                  <div 
                  v-for="comment in selectedTask?.comments"
                  :key="comment?.uid"
                  class="font-small my-2 tracking-wide text-gray-400">
                    <hr>
                    <div class="mt-2 flex justify-end">
                      <span>{{ parseDate(comment?.updatedAt) }}</span>
                      <span class="ml-4">@{{ comment?.updatedBy?.auth?.userName }}</span>
                    </div>
                    <span v-html="comment?.comment"></span>
                  </div>
                </div>
              </section>
            </div>
          </section>
          <section class="col-span-1 pr-2">
              <div class="flex justify-between mb-4">
                <span class="text-lg font-semibold">Due</span>
                <span>
                  <input 
                  type="datetime-local" 
                  class="bg-blue-100 rounded-md px-1" 
                  @change="updateDueDate(selectedTask,$event)"
                  :value="selectedTask?.dueDate">
                </span>
              </div>
              <hr>
              <div class="">
                <div class="flex justify-between mt-4">
                  <span class="text-lg font-semibold">Members</span>
                  <button
                    type="button"
                    @click.prevent="showAddMember = !showAddMember"
                    class="text-blue-500 rounded-md py-1 px-1  transition-colors duration-500 ease select-none hover:bg-blue-500 hover:text-gray-100 focus:outline-none focus:shadow-outline"
                    ><i class="fas fa-plus" aria-hidden="true"></i></button>
                </div>

              <form 
              v-show="showAddMember"
              action="post" 
              class="border-2 border-gray-200 border-dotted rounded p-1" 
              autocomplete="off">
                  <div class="flex justify-start">
                    <label class="block w-3/5" >
                      <select 
                      class="form-select block w-full mt-1"
                      v-model="newMember">
                        <option></option>
                        <option v-for="user in users" :key="user?.uid" :value="user?.uid">{{ user?.auth?.userName }}</option>
                      </select>
                    </label>
                    <button
                      type="button"
                      @click.prevent="addNewMember(selectedTask)"
                      class="border border-blue-500 text-blue-500 rounded-md p-1 ml-2 transition-colors duration-500 ease select-none hover:bg-blue-500 hover:text-gray-100 focus:outline-none focus:shadow-outline"
                    >Add</button>
                  </div>
                </form>

                <div class="my-4 flex flex-wrap">
                  <span 
                  v-for="member in selectedTask?.members" :key="member?.index"
                  class="mr-2 cursor-pointer">@{{member?.auth?.userName}}</span>
                </div>
              </div>
              <hr>
              <div class="flex flex-col my-4">
                <div class="text-lg font-semibold">Move Task</div>
                <label class="block mb-2">
                  <select 
                  @change="moveListingTask(selectedTask, $event)"
                  class="form-select block w-full mt-1">
                      <option></option>
                      <option 
                      v-for="listing in board?.boardListings"
                      :key="listing.uid"
                      :value="listing.uid"
                      >{{ listing.title }}</option>
                    </select>
                </label>
              </div>
              <hr>
              <div class="flex flex-col my-4">
                <div class="text-lg font-semibold">Duplicate Task</div>
                <label class="block my-2 w-full" >
                  <input 
                  class="form-input mt-1 block w-full" 
                  type="text" 
                  placeholder="Task Title ...." 
                  v-model="dulicateTitle"/>
                </label>
                <button 
                @click="duplicateTask(selectedTask)"
                class="border border-green-500 text-green-500 rounded-md py-1 px-2  transition-colors duration-500 ease select-none hover:bg-green-500 hover:text-gray-100 focus:outline-none focus:shadow-outline">Duplicate</button>
              </div>
              <hr>
              <div class="flex justify-between my-4">
                <span class="text-lg font-semibold">Delete Task</span>
                <button 
                @click="deleteTask(selectedTask)"
                class="border border-red-500 text-red-500 rounded-md py-1 px-2  transition-colors duration-500 ease select-none hover:bg-red-500 hover:text-gray-100 focus:outline-none focus:shadow-outline">Delete</button>
              </div>
              <hr>
              <!-- <div class="flex justify-between my-4">
                <span class="text-lg font-semibold">Archive Task</span>
                <button class="border border-gray-500 text-gray-500 rounded-md py-1 px-2  transition-colors duration-500 ease select-none hover:bg-gray-500 hover:text-gray-100 focus:outline-none focus:shadow-outline">Archive</button>
              </div> -->
          </section>
      </div>
    </template>
  </modal>

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
import modal from '../../_components/SimpleModal.vue';
import draggable from "vuedraggable";
import TaskCard from "../../_components/TaskCard.vue";
import { useStore } from 'vuex';
import { useMutation } from '@urql/vue';
import { ActionTypes as AdminActionTypes } from '../../../store/actions';
import { ActionTypes, Task, ITask, IMileStone } from '../../../store/modules/kanban';
import { 
  ADD_LISTING_TASK, 
  ADD_TASK_COMMENT, 
  ADD_TASK_MILESTONE,
  EDIT_LISTING_TASK,
  DELETE_LISTING_TASK,
  DUPLICATE_LISTING_TASK,
  DELETE_BOARD_LISTING } from '../../../graphql/kanban.mutations';
import { defineComponent, ref, reactive, computed } from 'vue';
import { parseDate } from '../../../utils';
import Swal from 'sweetalert2';
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
      let movedObjectsIds = ref([]);
      let moveTimeOut = ref(null);

      function log(event) {
          if (event.moved) console.log("moved")
          if (event.removed) console.log("removed")
          if (event.added) console.log("added")
          console.log(event)
      }

      function removeFromMoved(val) {
        const index = movedObjectsIds.value.indexOf(val);
        if (index > -1) {
            movedObjectsIds.value.splice(index, 1);
        }
      }
      
      function movedFrom(event) {
          return event.from.previousElementSibling.innerText;
      }
      
      function movedTo(event) {
          return event.to.parentElement.firstElementChild.innerText;
      }
      
      function movedToLIstingUid(event) {
          return event.to.parentElement.firstElementChild.dataset.listing;
      }

      function checkMove(event) {
            const from = movedFrom(event)
            const toUid = movedToLIstingUid(event)
            const to = movedTo(event)
            const futureIndex = event.draggedContext.futureIndex
            const element = event.draggedContext.element
            // console.log(element)
            // console.log("from : ", from, " -- to: ", to, "  - ", toUid, " -- index: ",futureIndex)
            setTimeout(function(){
              editListingTask('moveTask', {
                uid: element?.uid,
                listingUid: +toUid,
              });
            }, 500)
      }

      // Task Form
      let showTaskModal = ref(false);
      let taskFormTitle = ref("");
      let taskForm = reactive({ ...new Task() });

      const { executeMutation: createListingTask } = useMutation(ADD_LISTING_TASK);
      const { executeMutation: updateListingTask } = useMutation(EDIT_LISTING_TASK);

      function addListingTask(): void {
        createListingTask({ title: taskForm.title, description: taskForm.description, listingUid: taskForm.listingUid }).then((result) => {
          store.dispatch(ActionTypes.ADD_LISTING_TASK, result);
        });
      }

      function editListingTask(updateType, updateData): void {
        // updateData only contains vars to be updated
        updateListingTask({ ...updateData }).then((result) => {
          if(updateType === 'moveTask') store.dispatch(ActionTypes.MOVE_LISTING_TASK, result);
          if(updateType === 'updateTask') store.dispatch(ActionTypes.UPDATE_LISTING_TASK, result);
        });
      }

      function TaskFormManager(listing: any): void {
        showTaskModal.value = true;
        taskFormTitle.value = "ADD " + listing.title + " LISTING";
        let task = new Task;
        task.listingUid = listing.uid;
        Object.assign(taskForm, { ...task });
      }

      function saveTaskForm():void {
        addListingTask();
        showTaskModal.value = false;
      }
      
      // Delete Listing
      const { executeMutation: deleteBoardListing } = useMutation(DELETE_BOARD_LISTING);

      function deleteListing(listing): void {
        deleteBoardListing({ uid: listing?.uid }).then(result => {
          store.dispatch(ActionTypes.DELETE_BOARD_LISTING, result);
        })
      }

      // Move Task
      const moveListingTask = async (task, event) => {
        showModal.value = !showModal.value;
        try {
          Swal.fire({
            title: 'Move Task',
            text: task?.title,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, move now!',
            cancelButtonText: 'No, cancel moving!',
          }).then((result) => {
            if (result.isConfirmed) {
              editListingTask('moveTask', {
                uid: task?.uid,
                listingUid: +event?.target?.value
              });
            }
          })
        } catch (error) {
          logger.log(error)
        }
      }

      // update due dateOfBirth
      function updateDueDate(task, event): void {
        editListingTask('updateTask', {
          uid: task?.uid,
          dueDate: event?.target?.value
        });
      }

      // Delete Task
      const { executeMutation: deleteListingTask } = useMutation(DELETE_LISTING_TASK);

      const deleteTask = async (task) => {
        showModal.value = !showModal.value;
        try {
          Swal.fire({
            title: 'Delete Task!',
            text: task?.title,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete now!',
            cancelButtonText: 'No, cancel deleting!',
          }).then((result) => {
            if (result.isConfirmed) {
              deleteListingTask({ uid: task.uid }).then(result => {
                store.dispatch(ActionTypes.DELETE_LISTING_TASK, result);
              });
            }
          })
        } catch (error) {
          logger.log(error)
        }
      }

      // Duplicate Task
      const { executeMutation: duplicateListingTask } = useMutation(DUPLICATE_LISTING_TASK);

      let dulicateTitle = ref('');

      const duplicateTask = async (task) => {
        showModal.value = !showModal.value;
        try {
          Swal.fire({
            title: 'Duplicate Task to!',
            text: dulicateTitle?.value,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, duplicate now!',
            cancelButtonText: 'No, cancel duplication!',
          }).then((result) => {
            if (result.isConfirmed) {
              duplicateListingTask({ uid: task.uid, title: dulicateTitle?.value }).then(result => {
                store.dispatch(ActionTypes.DUPLICATE_LISTING_TASK, result);
              });
            }
          })
        } catch (error) {
          logger.log(error)
        }
      }

      // View Task and Related Actions
      store.dispatch(AdminActionTypes.FETCH_USERS)
      let selectedTask = reactive({}) as ITask;
      let selectedTaskListing = reactive({}) as ITaskListing;

      function viewTask(element, listing){
          Object.assign(selectedTaskListing, listing);
          showModal.value = !showModal.value;
          store.dispatch(ActionTypes.RESET_LISTING_TASK)
          store.dispatch(ActionTypes.FETCH_LISTING_TASK_BY_UID, element.uid)
      }

      // Task Comments
      let taskCommentEntry = ref('');
      let showAddComment = ref(false);
      const { executeMutation: createTaskComment } = useMutation(ADD_TASK_COMMENT);

      function addTaskComment(task): void {
        createTaskComment({ taskUid: task?.uid, comment: taskCommentEntry?.value }).then((result) => {
          store.dispatch(ActionTypes.ADD_TASK_COMMENT, result);
          taskCommentEntry.value = '';
        });
      }

      function saveTaskComment(task: any, create:boolean): void {
        if(create) addTaskComment(task)
      }

      // Task Milestome
      let showAddMilestone = ref(false);
      let taskMilestone = reactive({}) as IMileStone;

      const { executeMutation: createTaskMilestone } = useMutation(ADD_TASK_MILESTONE);

      function addTaskMilestone(task): void {
        createTaskMilestone({ 
          taskUid: task?.uid, 
          title: taskMilestone?.title,
          assigneeUid: taskMilestone?.assigneeUid,
          done: taskMilestone?.done,
        }).then((result) => {
          store.dispatch(ActionTypes.ADD_TASK_MILESTONE, result);
          taskMilestone.title = ""
          taskMilestone.assigneeUid = undefined
          taskMilestone.done = false
        })
      }

      function saveTaskMilestone(task: any, create:boolean): void {
        if(create) addTaskMilestone(task)
      }

      // Task Members
      let showAddMember = ref(false);
      let newMember = ref('');

      function addNewMember(task): void {
        let uids = [];
        task?.mambers?.forEach(member => uids.push(member?.uid));
        uids.push(newMember?.value);
        editListingTask('updateTask', {
          uid: task?.uid,
          memberUids: uids
        });
        newMember.value = null;
      }

      // Task status
      function toggleTaskStatus(task): void {
        editListingTask('updateTask', {
          uid: task?.uid,
          complete: !task.complete
        });
      }

      // Task Assignee
      let newAssignee = ref('');
      let changeAssignee = ref(false);
      function assignTaskAssignee(task): void {
        editListingTask('updateTask', {
          uid: task?.uid,
          assigneeUid: newAssignee?.value,
        });
        newAssignee.value = null;
        changeAssignee.value = false;
      }

      // Editable task title
      function updateTaskTitle(task, event): void {
        console.log(event?.target?.value);
      }


      return { 
          parseDate,
          users: computed(() => store.getters.getUsers),
          board: computed(() => store.getters.getBoard ),
          log, 
          checkMove,
          showModal,
          viewTask,
          modalTitle,
          showTaskModal,
          taskForm,
          taskFormTitle,
          TaskFormManager,
          saveTaskForm,
          selectedTask: computed(() => store.getters.getListingTask),
          selectedTaskListing,
          newMember,
          showAddMember,
          addNewMember,
          showAddComment,
          taskCommentEntry,
          saveTaskComment,
          showAddMilestone,
          taskMilestone,
          saveTaskMilestone,
          moveListingTask,
          updateDueDate,
          deleteTask,
          dulicateTitle,
          duplicateTask,
          deleteListing,
          toggleTaskStatus,
          newAssignee,
          changeAssignee,
          assignTaskAssignee,
          updateTaskTitle
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
