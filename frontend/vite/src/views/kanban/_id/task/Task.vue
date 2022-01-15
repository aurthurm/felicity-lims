<template>
      <section class="bg-white p-4">


          <div>
            <span class="italic">in &rarr;</span>  
            <span class="ml-2 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-gray-100 bg-blue-600 rounded"> {{ kanBanTaskListing?.title }}</span>
          </div>

        <div class="grid grid-cols-3 gap-4">
            <section class="col-span-2">
              <div class="mb-3 mt-4">
                <div>
                  <span 
                  v-if="!kanBanTask?.complete"
                  @dblclick="toggleTaskStatus(kanBanTask)"
                  class="border border-green-500 text-green-500 rounded-md py-1 px-2  transition-colors duration-500 ease select-none hover:bg-green-500 hover:text-gray-100 focus:outline-none focus:shadow-outline">Open</span>
                  <span 
                  v-else
                  @dblclick="toggleTaskStatus(kanBanTask)"
                  class="border border-green-500 text-green-500 rounded-md py-1 px-2  transition-colors duration-500 ease select-none hover:bg-green-500 hover:text-gray-100 focus:outline-none focus:shadow-outline">Closed</span>

                  <span v-if="kanBanTask?.assigneeUid">
                    <span 
                    v-show="kanBanTask?.assignee?.auth?.userName"
                    class="ml-4">@</span>{{kanBanTask?.assignee?.auth?.userName}}
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
                      @change="assignTaskAssignee(kanBanTask)">
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
                  class="form-input mt-1 block w-full text-lg font-semibold rounded border-transparent focus:border-gray-100 focus:ring-0"
                  @keyup="updateTaskTitle(kanBanTask, $event)" 
                  :value="kanBanTask?.title"/>
                  <hr>  
                  <div 
                  @input="updateTaskDescription(kanBanTask, $event)"
                  class="form-input rounded border-transparent focus:border-gray-100 focus:ring-0 font-medium tracking-wide text-gray-600 w-full p-2" 
                  v-html="kanBanTask?.description"
                  contenteditable></div>
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
                class="flex items-center justify-between border-2 border-gray-200 border-dotted rounded p-1" 
                autocomplete="off">
                    <div class="flex justify-between mb-2">
                      <label class="flex items-center w-3/6">
                        <span class="text-gray-700 mr-2">Title</span>
                        <input class="form-input mt-1 block w-full" v-model="taskMilestone.title" placeholder="Title ..." />
                      </label>
                      <label class="flex items-center w-2/6" >
                        <span class="text-gray-700 mx-2">Assignee</span>
                        <select class="form-select block w-full mt-1" v-model="taskMilestone.assigneeUid">
                          <option></option>
                          <option v-for="user in users" :key="user?.uid" :value="user?.uid">{{ user?.auth?.userName }}</option>
                        </select>
                      </label>
                      <label class="flex items-center 1/6">
                        <span class="mx-2">Done</span>
                        <input type="checkbox" class="form-checkbox text-green-500" v-model="taskMilestone.done" />
                      </label>
                    </div>
                    <button
                      type="button"
                      @click.prevent="saveTaskMilestone(kanBanTask, true)"
                      class="border border-blue-500 text-blue-500 rounded-md py-1 px-2  transition-colors duration-500 ease select-none hover:bg-blue-500 hover:text-gray-100 focus:outline-none focus:shadow-outline"
                    >Save</button>
                  </form>

                  <div 
                  v-for="milestone in kanBanTask?.taskMilestones"
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
                          placeholder="Stat typing ..."
                          v-model="taskCommentEntry"
                          />
                      </label>
                      <button 
                      @click="saveTaskComment(kanBanTask, true)"
                      class="border border-blue-500 text-blue-500 rounded-md py-1 px-2  transition-colors duration-500 ease select-none hover:bg-blue-500 hover:text-gray-100 focus:outline-none focus:shadow-outline">Add Comment</button>
                  </div>
                  <div>
                    <div 
                    v-for="comment in kanBanTask?.taskComments"
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
                    @change="updateDueDate(kanBanTask,$event)"
                    :value="kanBanTask?.dueDate">
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
                        @click.prevent="addNewMember(kanBanTask)"
                        class="border border-blue-500 text-blue-500 rounded-md p-1 ml-2 transition-colors duration-500 ease select-none hover:bg-blue-500 hover:text-gray-100 focus:outline-none focus:shadow-outline"
                      >Add</button>
                    </div>
                  </form>

                  <div class="my-4 flex flex-wrap">
                    <span 
                    v-for="member in kanBanTask?.members" :key="member?.index"
                    class="mr-2 cursor-pointer">@{{member?.auth?.userName}}</span>
                  </div>
                </div>
                <hr>
                <div class="flex flex-col my-4">
                  <div class="text-lg font-semibold">Move Task</div>
                  <label class="block mb-2">
                    <select 
                    @change="moveListingTask(kanBanTask, $event)"
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
                  @click="duplicateTask(kanBanTask)"
                  class="border border-green-500 text-green-500 rounded-md py-1 px-2  transition-colors duration-500 ease select-none hover:bg-green-500 hover:text-gray-100 focus:outline-none focus:shadow-outline">Duplicate</button>
                </div>
                <hr>
                <div class="flex justify-between my-4">
                  <span class="text-lg font-semibold">Delete Task</span>
                  <button 
                  @click="deleteTask(kanBanTask)"
                  class="border border-red-500 text-red-500 rounded-md py-1 px-2  transition-colors duration-500 ease select-none hover:bg-red-500 hover:text-gray-100 focus:outline-none focus:shadow-outline">Delete</button>
                </div>
            </section>
        </div>
      </section>
</template>

<script setup lang="ts">
import { useStore } from 'vuex';
import { useRoute } from 'vue-router';
import { useMutation } from '@urql/vue';
import { ActionTypes as AdminActionTypes } from '../../../../store/actions';
import { ActionTypes  } from '../../../../store/modules/kanban';
import { IBoard, IListing, IMileStone, ITask } from '../../../../models/kanban';
import { 
  ADD_TASK_COMMENT, 
  ADD_TASK_MILESTONE,
  EDIT_LISTING_TASK,
  DELETE_LISTING_TASK,
  DUPLICATE_LISTING_TASK} from '../../../../graphql/kanban.mutations';
import { ref, reactive, computed } from 'vue';
import { parseDate } from '../../../../utils';
import Swal from 'sweetalert2';
import router from '../../../../router';

      let store = useStore();
      let route = useRoute();

      // Task Form
      let showModal = ref<boolean>(false);

      let taskFormTitle = ref<string>("");
      let taskForm = reactive<ITask>({}as ITask);

      store.dispatch(AdminActionTypes.FETCH_USERS)
      store.dispatch(ActionTypes.RESET_LISTING_TASK)
      store.dispatch(ActionTypes.FETCH_LISTING_TASK_BY_UID, +route.params.taskUid)

      const users = computed(() => store.getters.getUsers)
      const board = computed(() => store.getters.getBoard )

      const kanBanTaskListing = computed(() => {
        let b: IBoard = store.getters.getBoard;
        return b?.boardListings?.filter((l: IListing) => l?.uid == kanBanTask?.value?.listingUid)[0];
      })

      let kanBanTask = computed(() => store.getters.getListingTask);

      const { executeMutation: updateListingTask } = useMutation(EDIT_LISTING_TASK);

      function editListingTask(updateType: string, updateData: any): void {
        const payload = { ...updateData };
        delete payload['uid'];

        updateListingTask({ uid: updateData.uid,  payload }).then((result) => {
          if(updateType === 'moveTask') store.dispatch(ActionTypes.MOVE_LISTING_TASK, result);
          if(updateType === 'updateTask') store.dispatch(ActionTypes.UPDATE_LISTING_TASK, result);
        });
      }

      let showTaskModal = ref<boolean>(false)
      function TaskFormManager(listing: IListing): void {
        showTaskModal.value = true;
        taskFormTitle.value = "ADD " + listing.title + " LISTING";
        Object.assign(taskForm, { listingUid: listing.uid });
      }

      function saveTaskForm():void {
        // addListingTask();
        showTaskModal.value = false;
      }

      // Move Task
      const moveListingTask = async (task: ITask, event:any) => {
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
          console.log(error)
        }
      }

      // update due dateOfBirth
      function updateDueDate(task: ITask, event: any): void {
        editListingTask('updateTask', {
          uid: task?.uid,
          dueDate: event?.target?.value
        });
      }

      // Delete Task
      const { executeMutation: deleteListingTask } = useMutation(DELETE_LISTING_TASK);

      const deleteTask = async (task: ITask) => {
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
                router.push({ name: "board-detail", params: { boardUid: +route.params.boardUid } });
              });
            }
          })
        } catch (error) {
          console.log(error)
        }
      }

      // Duplicate Task
      const { executeMutation: duplicateListingTask } = useMutation(DUPLICATE_LISTING_TASK);

      let dulicateTitle = ref('');

      const duplicateTask = async (task: ITask) => {
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
          console.log(error)
        }
      }

      // View Task and Related Actions

      // Task Comments
      let taskCommentEntry = ref('');
      let showAddComment = ref(false);
      const { executeMutation: createTaskComment } = useMutation(ADD_TASK_COMMENT);

      function addTaskComment(task: ITask): void {
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

      function addTaskMilestone(task: ITask): void {
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
      let showAddMember = ref<boolean>(false);
      let newMember = ref<number>();

      function addNewMember(task: ITask): void {
        let uids:number[] = [];
        task?.members?.forEach(member => uids.push(member?.uid));
        uids.push(newMember?.value!);
        editListingTask('updateTask', {
          uid: task?.uid,
          memberUids: uids
        });
        newMember.value = undefined;
      }

      // Task status
      function toggleTaskStatus(task: ITask): void {
        editListingTask('updateTask', {
          uid: task?.uid,
          complete: !task.complete
        });
      }

      // Task Assignee
      let newAssignee = ref('');
      let changeAssignee = ref(false);
      function assignTaskAssignee(task: ITask): void {
        editListingTask('updateTask', {
          uid: task?.uid,
          assigneeUid: newAssignee?.value,
        });
        newAssignee.value = '';
        changeAssignee.value = false;
      }

      // Editable task title and Description
      let titleTimeOut: any;
      function updateTaskTitle(task: ITask, event: any): void {
        clearTimeout(titleTimeOut);
        titleTimeOut = setTimeout(function(){ 
          editListingTask('updateTask', {
            uid: task?.uid,
            title: event?.target?.value
          });
         }, 3000);
      }


      let descTimeOut: any;
      function updateTaskDescription(task: ITask, event: any): void {
        clearTimeout(descTimeOut);
        descTimeOut = setTimeout(function(){ 
          editListingTask('updateTask', {
            uid: task?.uid,
            description: event?.target?.innerHTML
          });
         }, 3000);
      }
</script>

<style scoped>
div[contenteditable]{
    max-height: 500px;
    overflow: auto;
}
</style>
