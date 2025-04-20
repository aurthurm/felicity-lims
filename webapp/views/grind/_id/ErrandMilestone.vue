<script setup lang="ts">
import useApiUtil from '@/composables/api_util';
import { UserAllQuery, UserAllQueryVariables, UserAllDocument } from '@/graphql/operations/_queries';
import { AddGrindMilestoneDocument, AddGrindMilestoneMutation, AddGrindMilestoneMutationVariables, EditGrindMilestoneDocument, EditGrindMilestoneMutation, EditGrindMilestoneMutationVariables } from '@/graphql/operations/grind.mutations';
import { GetGrindMilestonesByErrandDocument, GetGrindMilestonesByErrandQuery, GetGrindMilestonesByErrandQueryVariables } from '@/graphql/operations/grind.queries';
import { IUser } from '@/models/auth';
import { IGrindMilestone } from '@/models/grind';
import { mutateForm, resetForm } from '@/utils';
import { RequestPolicy } from '@urql/core';
import { onMounted, reactive, ref } from 'vue';
import Multiselect from 'vue-multiselect'

const props = defineProps({
    errandUid: {
        type: String,
        required: true
    }
});
const { withClientMutation, withClientQuery } = useApiUtil()

onMounted(() => {
    fetchMilestones();
    getUsers();
});

const emit = defineEmits(['milestoneUpdated']);

const milestones = ref<IGrindMilestone[]>([]);
function fetchMilestones(requestPolicy: RequestPolicy = 'cache-first') {
    withClientQuery<GetGrindMilestonesByErrandQuery, GetGrindMilestonesByErrandQueryVariables>(
        GetGrindMilestonesByErrandDocument,{ errandUid: props.errandUid }, "grindMilestonesByErrand", requestPolicy
    ).then((res: any) => {
        if(res){
            milestones.value = res as IGrindMilestone[];
        }
    });
}

// Milestone Form
const showForm = ref(false);
const formAction = ref(false);
const formTitle = ref('');
const form = reactive({} as IGrindMilestone)

function addMilestone(){
    showForm.value = true;
    formTitle.value = 'Add Milestone';
    formAction.value = true;
    resetForm(form);
}

function editMilestone(milestone: IGrindMilestone){
    showForm.value = true;
    formTitle.value = 'Edit Milestone';
    formAction.value = false;
    mutateForm(form, milestone);
}

function saveForm(){
    showForm.value = false;

    const payload = {
        title: form.title,
        description: form.description,
        complete: form.complete,
        assigneeUid: form.assignee?.uid,
        errandUid: props.errandUid
    }

    if(formAction.value){
        withClientMutation<AddGrindMilestoneMutation,  AddGrindMilestoneMutationVariables>(
            AddGrindMilestoneDocument, 
            { payload: {...payload, errandUid: props.errandUid} }, 
            "createGrindMilestone"
        ).then(() => fetchMilestones("network-only")); 
    } else {
        withClientMutation<EditGrindMilestoneMutation,  EditGrindMilestoneMutationVariables>(
            EditGrindMilestoneDocument, 
            { uid: form.uid, payload }, 
            "updateGrindMilestone"
        ).then(() => {
          fetchMilestones("network-only")
          emit('milestoneUpdated');
        }); 
    }
}

// AssigneegetUsers()
function customLabel ({firstName, lastName}) {
  return `${firstName} ${lastName}`
}

const users = ref<IUser[]>()
function getUsers() {
  withClientQuery<UserAllQuery, UserAllQueryVariables>(
    UserAllDocument,
    { first: 100 },
    "userAll"
  ).then((res: any) => {
    users.value = res.items as IUser[];
  });
}

</script>

<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex justify-between items-center">
      <h3 class="text-lg font-medium text-foreground">Milestones</h3>
      <button 
        @click="addMilestone"
        class="px-3 py-1.5 text-sm font-medium text-foreground bg-background border border-border rounded-md hover:border-primary hover:text-primary hover:bg-secondary transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
      >
        <span class="flex items-center space-x-2">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          <span>Add New</span>
        </span>
      </button>
    </div>

    <!-- Milestones List -->
    <div class="space-y-6">
      <div 
        v-for="milestone in milestones" 
        :key="milestone.uid" 
        class="pl-6 border-l-2 relative group cursor-pointer" 
        :class="{
          'border-success/20': milestone.complete, 
          'border-destructive/20': !milestone.complete
        }"
        @dblclick="editMilestone(milestone)"
      >
        <!-- Status Indicator -->
        <div 
          class="absolute left-0 top-0 transform -translate-x-1/2 bg-background p-1 border border-border rounded-full w-4 h-4 flex items-center justify-center transition-colors duration-200 group-hover:border-primary"
        >
          <div 
            class="w-2 h-2 rounded-full transition-colors duration-200" 
            :class="{
              'bg-success': milestone.complete, 
              'bg-destructive': !milestone.complete
            }"
          ></div>
        </div>

        <!-- Milestone Content -->
        <div class="mb-6">
          <h4 class="font-medium text-foreground group-hover:text-primary transition-colors duration-200">
            {{ milestone.title }}
          </h4>
          <p class="text-sm text-muted-foreground mt-1">
            {{ milestone.description }}
          </p>
        </div>
      </div>
    </div>

    <!-- Create/Edit Milestone Modal -->
    <fel-modal 
      v-if="showForm" 
      @close="showForm = false" 
      content-width="w-full max-w-2xl"
    >
      <template v-slot:header>
        <h3 class="text-lg font-semibold text-foreground">{{ formTitle }}</h3>
      </template>
      
      <template v-slot:body>
        <form @submit.prevent="saveForm" class="space-y-6 p-6">
          <!-- Title -->
          <div>
            <label class="block text-sm font-medium text-foreground mb-1" for="title">
              Title <span class="text-destructive">*</span>
            </label>
            <input
              id="title"
              v-model="form.title"
              type="text"
              required
              class="w-full px-3 py-2 border border-border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary bg-background text-foreground"
              placeholder="Enter milestone title"
            />
          </div>  
          
          <!-- Description -->
          <div>
            <label class="block text-sm font-medium text-foreground mb-1" for="description">
              Description
            </label>
            <textarea
              id="description"
              v-model="form.description"
              rows="3"
              class="w-full px-3 py-2 border border-border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary bg-background text-foreground"
              placeholder="Enter milestone description"
            ></textarea>
          </div>

          <!-- Assignee -->
          <div>
            <label class="block text-sm font-medium text-foreground mb-1">
              Assignee
            </label>
            <multiselect 
              v-model="form.assignee" 
              :options="users"
              track-by="uid"
              :searchable="true"
              :custom-label="customLabel"
              placeholder="Select assignee"
              class="multiselect-primary"
            >
            </multiselect>
          </div>
          
          <!-- Complete Status -->
          <div class="flex items-center space-x-2">
            <input
              id="complete"
              v-model="form.complete"
              type="checkbox"
              class="w-4 h-4 text-primary border-border rounded focus:ring-primary focus:ring-offset-2"
            />
            <label class="text-sm font-medium text-foreground" for="complete">
              Complete
            </label>
          </div>  
          
          <!-- Submit button -->
          <div class="flex justify-end space-x-3">
            <button
              type="button"
              @click="showForm = false"
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

/* Multiselect styling */
:deep(.multiselect-primary) {
  @apply bg-background text-foreground;
}

:deep(.multiselect-primary .multiselect__tags) {
  @apply border-border bg-background text-foreground;
}

:deep(.multiselect-primary .multiselect__single) {
  @apply bg-background text-foreground;
}

:deep(.multiselect-primary .multiselect__input) {
  @apply bg-background text-foreground;
}

:deep(.multiselect-primary .multiselect__option) {
  @apply bg-background text-foreground hover:bg-muted;
}

:deep(.multiselect-primary .multiselect__option--highlight) {
  @apply bg-primary text-primary-foreground;
}
</style>
