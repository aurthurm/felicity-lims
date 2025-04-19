<script setup lang="ts">
import useApiUtil from '@/composables/api_util'
import {  AddGrindErrandDocument, AddGrindErrandMutation, AddGrindErrandMutationVariables, EditGrindErrandDocument, EditGrindErrandMutation, EditGrindErrandMutationVariables } from '@/graphql/operations/grind.mutations'
import { ErrandCategory, GrindErrandType} from '@/graphql/schema'
import { IGrindErrand, IGrindPoster } from '@/models/grind'
import { formatDate, resetForm, stringToColor, getUserInitials } from '@/utils/helpers'
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { PropType, reactive, ref } from 'vue'
import { VueDraggable } from 'vue-draggable-plus'

const props = defineProps({
    poster: {
        type: Object as PropType<IGrindPoster>,
        required: true
    }
})

const { withClientMutation } = useApiUtil();
const poster = ref<IGrindPoster>(props.poster);

function onUpdate() {}

function onAdd(item) {
  const errand = item.clonedData
  withClientMutation<EditGrindErrandMutation, EditGrindErrandMutationVariables>(
        EditGrindErrandDocument,
        { uid: errand.uid,  payload: { posterUid: poster.value.uid } },
      "updateGrindErrand"
  ).then((resp: any) => {
    if(resp?.uid) {
      const index = poster.value.errands.findIndex(e => e.uid === resp.uid);
      if(index > -1 && resp?.uid) {
        poster.value.errands[index] = resp as IGrindErrand;
      }
    }
  });
}

function remove() {}

// Poster Form Management
let showErrandModal = ref<boolean>(false);
let formAction = ref<boolean>(false);
let errandFormTitle = ref<string>("");
let errandForm = reactive({}) as IGrindErrand;

const openCreateErrandForm = () => {
  formAction.value = true;
  showErrandModal.value = true;
  errandFormTitle.value = "Create Errand";
  resetForm(errandForm)
};

const saveErrandForm = () => {
    showErrandModal.value = false;
    if(!poster.value.uid) {
      alert("Errand must belong to a listing")
      return;
    }
    withClientMutation<AddGrindErrandMutation, AddGrindErrandMutationVariables>(
        AddGrindErrandDocument,
        { payload: { ...errandForm, posterUid: poster.value.uid!, category: ErrandCategory.Project } },
        "createGrindErrand"
    ).then((resp: any) => {
      if(resp) {
       if(poster.value.errands?.length > 0) {
          poster.value.errands.push(resp);
       } else {
         poster.value.errands = [resp]
       }
      }
    });
};

</script>


<template>
    <h3 class="h3 w-full font-semibold text-lg">{{ poster.title }}</h3>
    <button 
    class="w-full font-medium my-2 py-1 px-2 border border-border hover:border-sky-700 hover:text-sky-700 hover:bg-secondary"
    @click="openCreateErrandForm">Add New...</button>
    <VueDraggable
    class="flex flex-col gap-2 w-full min-h-8"
    v-model="poster.errands"
    :animation="150"
    ghostClass="ghost"
    group="people"
    @update="onUpdate"
    @add="onAdd"
    @remove="remove"
    >
      <div
          v-for="errand in poster.errands" :key="errand.uid"
          class="shadow-sm bg-secondary rounded p-2"
      > 
        <div class="flex justify-between items-center">
          <router-link 
              :to="{name: 'errand-detail', params: {errandUid: errand?.uid, boardUid: poster.boardUid}}" 
              class="text-sm font-semibold text-gray-800 truncate">
              {{ errand.title }}
            </router-link>
          <FontAwesomeIcon class="h-4 w-4 cursor-move text-gray-400" icon="fa-grip" />
        </div>

          <div class="flex justify-start items-center gap-x-2 mt-2">
            <span 
            v-for="stamp in errand.stamps"
            class="lowercase text-xs bg-primary p-1 text-gray-100">{{ stamp.title }}</span>
          </div>

          <div class="flex justify-start items-center gap-x-2 mt-1" v-show="errand?.milestonesAt">
              <div class="my-2 w-full bg-muted rounded-full h-1 dark:bg-gray-700">
                  <div class="bg-success h-1 rounded-full" :style="`width: ${errand?.milestonesAt}%`"></div>
              </div>
              <span class="text-xs">{{ errand?.milestonesAt }}%</span>
          </div>

          <div class="flex justify-between items-center gap-x-2 mt-1" v-show="errand.endDate">
            <span class="bg-gray-400/50 px-1 text-xs rounded-lg">{{ formatDate(errand.endDate, 'DD/MM/YYYY') }}</span>

            <div v-if="errand.members && errand.members.length > 0">
                <div class="flex -space-x-2 overflow-hidden">
                  <div 
                      v-for="(member, index) in errand.members.slice(0, 5)" 
                      :key="index"
                      class="w-8 h-8 rounded-full border-2 border-white flex items-center justify-center text-white text-xs font-medium"
                      :style="{ backgroundColor: stringToColor(member.firstName! + member.lastName) }"
                      :title="`${member.firstName} ${member.lastName}`"
                  >
                      {{ getUserInitials(member.firstName, member.lastName) }}
                  </div>

                  <div 
                      v-if="errand.members.length > 5"
                      class="w-8 h-8 rounded-full border-2 border-white flex items-center justify-center bg-gray-300 text-gray-800 text-xs font-medium"
                      :title="errand.members.slice(5).map(m => `${m.firstName} ${m.lastName}`).join(', ')"
                  >
                      +{{ errand.members.length - 5 }}
                  </div>
                </div>
            </div>
          </div>
      </div>
    </VueDraggable>

    <!-- Create/Edit Errand Modal -->
    <modal v-if="showErrandModal" @close="showErrandModal = false" content-width="w-full max-w-2xl">
    <template v-slot:header>
      <h3 class="text-lg font-semibold">{{ errandFormTitle }}</h3>
    </template>
    
    <template v-slot:body>
      <form @submit.prevent="saveErrandForm">
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-1" for="title">
            Scheme Title <span class="text-red-500">*</span>
          </label>
          <input
            id="title"
            v-model="errandForm.title"
            type="text"
            required
            class="w-full px-3 py-2 border border-border rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500"
            placeholder="Enter errand title"
          />
        </div>  
        
         <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-1" for="description">
            Description
          </label>
          <textarea
            id="description"
            v-model="errandForm.description"
            rows="3"
            class="w-full px-3 py-2 border border-border rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500"
            placeholder="Enter errand description"
          ></textarea>
        </div>
        
        <!-- Date Range -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1" for="startDate">
              Start Date
            </label>
            <input
              id="startDate"
              v-model="errandForm.startDate"
              type="date"
              class="w-full px-3 py-2 border border-border rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1" for="endDate">
              End Date
            </label>
            <input
              id="endDate"
              v-model="errandForm.endDate"
              type="date"
              class="w-full px-3 py-2 border border-border rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500"
            />
          </div>
        </div>

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
