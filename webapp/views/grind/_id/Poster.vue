<script setup lang="ts">
import useApiUtil from '@/composables/api_util'
import {  AddGrindErrandDocument, AddGrindErrandMutation, AddGrindErrandMutationVariables, EditGrindErrandDocument, EditGrindErrandMutation, EditGrindErrandMutationVariables } from '@/graphql/operations/grind.mutations'
import { GrindErrandType, GrindPosterType  } from '@/types/gql'
import { ErrandCategory } from '@/graphql/schema'
import { formatDate, resetForm, stringToColor, getUserInitials } from '@/utils'
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { PropType, reactive, ref } from 'vue'
import { VueDraggable } from 'vue-draggable-plus'

const props = defineProps({
    poster: {
        type: Object as PropType<GrindPosterType>,
        required: true
    }
})

const { withClientMutation } = useApiUtil();
const poster = ref<GrindPosterType>(props.poster);

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
        poster.value.errands[index] = resp as GrindErrandType;
      }
    }
  });
}

function remove() {}

// Poster Form Management
let showErrandModal = ref<boolean>(false);
let formAction = ref<boolean>(false);
let errandFormTitle = ref<string>("");
let errandForm = reactive({}) as GrindErrandType;

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
  <div class="space-y-4 p-4">
    <!-- Poster Header -->
    <div class="flex justify-between items-center">
      <h3 class="text-lg font-semibold text-foreground">{{ poster.title }}</h3>
      <button 
        @click="openCreateErrandForm"
        class="px-3 py-1.5 text-sm font-medium text-foreground bg-background border border-border rounded-md hover:border-primary hover:text-primary hover:bg-secondary transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
      >
        <span class="flex items-center space-x-2">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          <span>Add New...</span>
        </span>
      </button>
    </div>

    <!-- Draggable Errands List -->
    <VueDraggable
      class="flex flex-col gap-3 w-full min-h-8"
      v-model="poster.errands"
      :animation="150"
      ghostClass="ghost"
      group="people"
      @update="onUpdate"
      @add="onAdd"
      @remove="remove"
    >
      <div
        v-for="errand in poster.errands" 
        :key="errand.uid"
        class="bg-secondary rounded-lg shadow-sm p-3 border border-border hover:shadow-md transition-all duration-200"
      > 
        <!-- Errand Header -->
        <div class="flex justify-between items-center mb-2">
          <router-link 
            :to="{name: 'errand-detail', params: {errandUid: errand?.uid, boardUid: poster.boardUid}}" 
            class="text-sm font-semibold text-foreground hover:text-primary transition-colors duration-200 truncate"
          >
            {{ errand.title }}
          </router-link>
          <FontAwesomeIcon 
            class="h-4 w-4 cursor-move text-muted-foreground hover:text-primary transition-colors duration-200" 
            icon="fa-grip" 
          />
        </div>

        <!-- Stamps -->
        <div class="flex flex-wrap gap-2 mb-2">
          <span 
            v-for="stamp in errand.stamps"
            class="text-xs bg-primary text-primary-foreground px-2 py-1 rounded-md lowercase"
          >
            {{ stamp.title }}
          </span>
        </div>

        <!-- Progress Bar -->
        <div 
          v-show="errand?.milestonesAt"
          class="flex items-center gap-2 mb-2"
        >
          <div class="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
            <div 
              class="h-full bg-success rounded-full transition-all duration-300" 
              :style="`width: ${errand?.milestonesAt}%`"
            ></div>
          </div>
          <span class="text-xs text-muted-foreground">{{ errand?.milestonesAt }}%</span>
        </div>

        <!-- Footer -->
        <div 
          v-show="errand.endDate"
          class="flex justify-between items-center mt-2 pt-2 border-t border-border"
        >
          <span class="text-xs text-muted-foreground bg-muted/50 px-2 py-1 rounded-md">
            {{ formatDate(errand.endDate, 'DD/MM/YYYY') }}
          </span>

          <!-- Members -->
          <div v-if="errand.members && errand.members.length > 0">
            <div class="flex -space-x-2 overflow-hidden">
              <div 
                v-for="(member, index) in errand.members.slice(0, 5)" 
                :key="index"
                class="w-6 h-6 rounded-full border-2 border-background flex items-center justify-center text-primary-foreground text-xs font-medium"
                :style="{ backgroundColor: stringToColor(member.firstName! + member.lastName) }"
                :title="`${member.firstName} ${member.lastName}`"
              >
                {{ getUserInitials(member.firstName, member.lastName) }}
              </div>

              <div 
                v-if="errand.members.length > 5"
                class="w-6 h-6 rounded-full border-2 border-background flex items-center justify-center bg-muted text-foreground text-xs font-medium"
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
    <fel-modal 
      v-if="showErrandModal" 
      @close="showErrandModal = false" 
      content-width="w-full max-w-2xl"
    >
      <template v-slot:header>
        <h3 class="text-lg font-semibold text-foreground">{{ errandFormTitle }}</h3>
      </template>
      
      <template v-slot:body>
        <form @submit.prevent="saveErrandForm" class="space-y-6 p-6">
          <!-- Title -->
          <div>
            <label class="block text-sm font-medium text-foreground mb-1" for="title">
              Scheme Title <span class="text-destructive">*</span>
            </label>
            <input
              id="title"
              v-model="errandForm.title"
              type="text"
              required
              class="w-full px-3 py-2 border border-border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary bg-background text-foreground"
              placeholder="Enter errand title"
            />
          </div>  
          
          <!-- Description -->
          <div>
            <label class="block text-sm font-medium text-foreground mb-1" for="description">
              Description
            </label>
            <textarea
              id="description"
              v-model="errandForm.description"
              rows="3"
              class="w-full px-3 py-2 border border-border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary bg-background text-foreground"
              placeholder="Enter errand description"
            ></textarea>
          </div>
          
          <!-- Date Range -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-foreground mb-1" for="startDate">
                Start Date
              </label>
              <input
                id="startDate"
                v-model="errandForm.startDate"
                type="date"
                class="w-full px-3 py-2 border border-border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary bg-background text-foreground"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-foreground mb-1" for="endDate">
                End Date
              </label>
              <input
                id="endDate"
                v-model="errandForm.endDate"
                type="date"
                class="w-full px-3 py-2 border border-border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary bg-background text-foreground"
              />
            </div>
          </div>

          <!-- Submit button -->
          <div class="flex justify-end space-x-3">
            <button
              type="button"
              @click="showErrandModal = false"
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
.space-y-4 > :not([hidden]) ~ :not([hidden]) {
  margin-top: 1rem;
}

.ghost {
  opacity: 0.5;
  background: #c8ebfb;
}
</style>
