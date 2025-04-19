<script setup lang="ts">
import useApiUtil from '@/composables/api_util';
import { UserAllQuery, UserAllQueryVariables, UserAllDocument } from '@/graphql/operations/_queries';
import { AddGrindMilestoneDocument, AddGrindMilestoneMutation, AddGrindMilestoneMutationVariables, EditGrindMilestoneDocument, EditGrindMilestoneMutation, EditGrindMilestoneMutationVariables } from '@/graphql/operations/grind.mutations';
import { GetGrindMilestonesByErrandDocument, GetGrindMilestonesByErrandQuery, GetGrindMilestonesByErrandQueryVariables } from '@/graphql/operations/grind.queries';
import { IUser } from '@/models/auth';
import { IGrindMilestone } from '@/models/grind';
import { mutateForm, resetForm } from '@/utils/helpers';
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
<div class="flex justify-between items-center">
    <h3 class="text-foreground font-medium">Milestones</h3>
    <button class="text-sm text-foreground hover:text-foreground flex items-center gap-1"
        @click="addMilestone">
        <span>+ Add New</span>
    </button>
</div>

<div 
v-for="milestone in milestones" 
:key="milestone.uid" 
class="pl-6 border-l-2 relative" 
:class="{'border-green-200': milestone.complete, 'border-red-200': !milestone.complete}"
@dblclick="editMilestone(milestone)">
    <div class="absolute left-0 top-0 transform -translate-x-1/2 bg-background p-1 border border-border rounded-full w-4 h-4 flex items-center justify-center">
        <div class="w-2 h-2 rounded-full" :class="{'bg-success': milestone.complete, 'bg-destructive': !milestone.complete}"></div>
    </div>
    <div class="mb-6">
        <h4 class="font-medium">{{ milestone.title }}</h4>
        <p class="text-sm text-muted-foreground">{{ milestone.description }}</p>
    </div>
</div>

<!-- Create/Edit Errand Modal -->
<modal v-if="showForm" @close="showForm = false" content-width="w-full max-w-2xl">
    <template v-slot:header>
      <h3 class="text-lg font-semibold">{{ formTitle }}</h3>
    </template>
    
    <template v-slot:body>
      <form @submit.prevent="saveForm">

        <div class="mb-4">
          <label class="block text-sm font-medium text-foreground mb-1" for="title">
            Title <span class="text-destructive">*</span>
          </label>
          <input
            id="title"
            v-model="form.title"
            type="text"
            required
            class="w-full px-3 py-2 border border-border rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500"
            placeholder="Enter errand title"
          />
        </div>  
        
         <div class="mb-4">
          <label class="block text-sm font-medium text-foreground mb-1" for="description">
            Description
          </label>
          <textarea
            id="description"
            v-model="form.description"
            rows="3"
            class="w-full px-3 py-2 border border-border rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500"
            placeholder="Enter errand description"
          ></textarea>
        </div>

        <div>
            <label class="block text-sm font-medium text-foreground mb-1">Assignee</label>
            <multiselect 
            v-model="form.assignee" 
            :options="users"
            track-by="uid"
            :searchable="true"
            :custom-label="customLabel"
            placeholder="Select assignee"
            >
            </multiselect>
        </div>
        
        <div class="my-4 flex justify-start">
          <input
            id="complete"
            v-model="form.complete"
            type="checkbox"
            class="mr-2 px-3 py-2 border border-border rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500"
          />
          <label class="block text-sm font-medium text-foreground mb-1" for="complete">
            Complete
          </label>
        </div>  
        
        <div class="flex justify-end">
          <button
            type="submit"
            class="px-4 py-2 text-sm font-medium text-primary-foreground bg-primary border border-transparent rounded-md shadow-sm hover:bg-primary focus:outline-none focus:ring-2 focus:ring-sky-500"
          >
            {{ formAction ? 'Create' : 'Update' }}
          </button>
        </div>
      </form>
    </template>
</modal>
</template>
