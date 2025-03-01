<!-- SchemeView.vue -->
<script setup lang="ts">
import { computed, defineAsyncComponent, onMounted, reactive, ref } from 'vue';
import useApiUtil from '@/composables/api_util';
import { IGrindScheme } from '@/models/grind';
import { formatDate, stringToColor, getUserInitials } from '@/utils/helpers'
import { AddGrindSchemeDocument, AddGrindSchemeMutation, AddGrindSchemeMutationVariables, EditGrindSchemeDocument, EditGrindSchemeMutation, EditGrindSchemeMutationVariables } from '@/graphql/operations/grind.mutations';
import { GetGrindSchemeAllDocument, GetGrindSchemeAllQuery, GetGrindSchemeAllQueryVariables } from '@/graphql/operations/grind.queries';
import { UserAllDocument, UserAllQuery, UserAllQueryVariables } from '@/graphql/operations/_queries';
import { IUser } from '@/models/auth';

const modal = defineAsyncComponent(
  () => import("@/components/ui/FelModal.vue")
);

const VueMultiselect = defineAsyncComponent(
  () => import('vue-multiselect')
)

const { withClientMutation, withClientQuery } = useApiUtil();

// State variables
let showModal = ref<boolean>(false);
let formTitle = ref<string>('');
let form = reactive({}) as IGrindScheme;
const formAction = ref<boolean>(true);

const fetchingSchemes = ref<boolean>(false);
const schemes = ref<IGrindScheme[]>([]);
const users = ref<IUser[]>([]);

// Search and pagination parameters
let schemeParams = reactive({
  first: 12, // Show more cards initially
  after: "",
  text: "",
  sortBy: ["created_at"],
  filterAction: false,
});

const schemesCount = ref<number>(0);
let schemesPageInfo = ref({
  startCursor: "",
  endCursor: "",
  hasNextPage: false,
  hasPreviousPage: false,
});

// Computed properties
const countText = computed(() => 
  schemes.value.length + " of " + schemesCount.value + " schemes"
);

const isLoading = computed(() => fetchingSchemes.value);

// Fetch schemes from API
function fetchSchemes(params: any) {
  fetchingSchemes.value = true;
  
  withClientQuery<GetGrindSchemeAllQuery, GetGrindSchemeAllQueryVariables>(
      GetGrindSchemeAllDocument,  {
      first: params.first,
      after: params.after,
      text: params.text,
      sortBy: params.sortBy,
    }, "grindSchemeAll"
  ).then((result) => {
    if (result) {
      schemes.value = result?.items;
      schemesCount.value = result?.totalCount || 0;
      schemesPageInfo.value = result?.pageInfo;
      console.log(schemes.value)
    }
  }).finally(() => {
    fetchingSchemes.value = false;
  });

}

// Initialize component
onMounted(() => {
  fetchSchemes(schemeParams);
  
  // Fetch available users for the form
  // This is a placeholder - you would need an actual API endpoint for this
  fetchAvailableUsers();
});

// Placeholder function to fetch users
function fetchAvailableUsers() {
  withClientQuery<UserAllQuery, UserAllQueryVariables>(
      UserAllDocument,  
      { first: 100, after: "", text: "", sortBy: ["first_name"] }, 
      "userAll"
  ).then((result) => {
    if (result) {
      users.value = result?.items;
    }
  })
}

// Search function
function searchSchemes(searchText: string) {
  schemeParams.first = 12;
  schemeParams.after = "";
  schemeParams.text = searchText;
  schemeParams.filterAction = true;
  fetchSchemes(schemeParams);
}

// Load more function for infinite scroll/pagination
function loadMoreSchemes() {
  if (!schemesPageInfo.value.hasNextPage || fetchingSchemes.value) return;
  
  schemeParams.first = 6; // Less items for subsequent loads
  schemeParams.after = schemesPageInfo.value.endCursor;
  schemeParams.filterAction = false;
  fetchSchemes(schemeParams);
}

// Form management
function resetForm() {
  Object.assign(form, {
    title: '',
    description: '',
    startDate: '',
    endDate: '',
    assignee: null,
    members: [],
  } as unknown as IGrindScheme);
}

function openCreateForm() {
  formAction.value = true;
  showModal.value = true;
  formTitle.value = 'Create New Scheme';
  resetForm();
}

function openEditForm(scheme: IGrindScheme) {
  console.log(scheme)
  formAction.value = false;
  showModal.value = true;
  formTitle.value = 'Edit Scheme';
  Object.assign(form, {...scheme});
}

// Save form data
function saveForm() {
  const members = form.members?.map(member => member.uid) || [];
  
  const payload = {
    title: form.title,
    description: form.description,
    startDate: form.startDate,
    endDate: form.endDate,
    assignee: form.assignee?.uid,
    members,
  };
  
  if (formAction.value === true) {
    // Create new scheme
    withClientMutation<AddGrindSchemeMutation, AddGrindSchemeMutationVariables>(
        AddGrindSchemeDocument, { payload }, "createGrindScheme"
    ).then((result) => {
      if (result) {
        schemes.value.unshift(result as IGrindScheme);
      }
    });
  } else {
    // Update existing scheme
    withClientMutation<EditGrindSchemeMutation, EditGrindSchemeMutationVariables>(
      EditGrindSchemeDocument, {uid: form.uid!, payload}, "updateGrindScheme"
    ).then((result) => {
      if (result) {
        const index = schemes.value.findIndex(s => s.uid === result.uid);
        if (index !== -1) {
          schemes.value[index] = result as IGrindScheme;
        }
      }
    });
  }
  
  showModal.value = false;
}
</script>

<template>
  <div class="px-4 py-8">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold text-gray-800">Schemes</h1>
      
      <div class="flex space-x-4">
        <!-- Search input -->
        <div class="relative">
          <input
            type="text"
            placeholder="Search schemes..."
            class="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
            v-model="schemeParams.text"
            @keyup.enter="searchSchemes(schemeParams.text)"
          />
          <button
            @click="searchSchemes(schemeParams.text)"
            class="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-sky-700"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
        </div>
        
        <!-- Add button -->
        <button
          @click="openCreateForm"
          class="px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition-colors focus:outline-none focus:ring-2 focus:ring-sky-500"
        >
          <span class="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            Add Scheme
          </span>
        </button>
      </div>
    </div>
    
    <!-- Status and count information -->
    <div class="mb-4 text-sm text-gray-600">
      <span v-if="isLoading">Loading schemes...</span>
      <span v-else>{{ countText }}</span>
    </div>
    
    <!-- Cards grid layout -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      <!-- Scheme card -->
      <div 
        v-for="scheme in schemes" 
        :key="scheme.uid"
        class="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow"
      >
        <div class="p-6">
          <div class="flex justify-between items-start mb-3">
            <router-link 
            :to="{name: 'scheme-detail', params: {schemeUid: scheme?.uid}}" 
            class="text-lg font-semibold text-gray-800 truncate">
              {{ scheme.title }}
            </router-link>
            <button 
              @click="openEditForm(scheme)"
              class="text-gray-500 hover:text-sky-600 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
          </div>
          
          <!-- Description -->
          <p class="text-gray-600 text-sm mb-4 line-clamp-2">
            {{ scheme.description || "No description provided" }}
          </p>
          
          <!-- Date information -->
          <div class="flex items-center text-xs text-gray-500 mb-4">
            <div class="flex items-center mr-4">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span>{{ formatDate(scheme.startDate, 'D MMMM YYYY') }} - {{ formatDate(scheme.endDate, 'D MMMM YYYY') }}</span>
            </div>
          </div>
          
          <!-- Assignee -->
          <div v-if="scheme.assignee" class="mb-4">
            <p class="text-xs text-gray-500 mb-1">Assignee:</p>
            <div class="flex items-center">
              <div 
                class="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-medium mr-2"
                :style="{ backgroundColor: stringToColor(scheme.assignee.firstName + scheme.assignee.lastName) }"
              >
                {{ getUserInitials(scheme.assignee.firstName, scheme.assignee.lastName) }}
              </div>
              <span class="text-sm">{{ scheme.assignee.firstName }} {{ scheme.assignee.lastName }}</span>
            </div>
          </div>
          
          <!-- Members -->
          <div v-if="scheme.members && scheme.members.length > 0">
            <p class="text-xs text-gray-500 mb-1">Members:</p>
            <div class="flex -space-x-2 overflow-hidden">
              <div 
                v-for="(member, index) in scheme.members.slice(0, 5)" 
                :key="index"
                class="w-8 h-8 rounded-full border-2 border-white flex items-center justify-center text-white text-xs font-medium"
                :style="{ backgroundColor: stringToColor(member.firstName + member.lastName) }"
                :title="`${member.firstName} ${member.lastName}`"
              >
                {{ getUserInitials(member.firstName, member.lastName) }}
              </div>
              
              <!-- Show count for additional members -->
              <div 
                v-if="scheme.members.length > 5"
                class="w-8 h-8 rounded-full border-2 border-white flex items-center justify-center bg-gray-300 text-gray-800 text-xs font-medium"
                :title="scheme.members.slice(5).map(m => `${m.firstName} ${m.lastName}`).join(', ')"
              >
                +{{ scheme.members.length - 5 }}
              </div>
            </div>
          </div>
          
          <!-- Created info -->
          <div class="mt-4 pt-3 border-t border-gray-100 text-xs text-gray-500 flex justify-between">
            <span>Created {{ formatDate(scheme.createdAt, 'D MMMM YYYY') }}</span>
            <span v-if="scheme.createdBy">by {{ scheme.createdBy.firstName }}</span>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Load more button -->
    <div v-if="schemesPageInfo.hasNextPage" class="mt-8 flex justify-center">
      <button 
        @click="loadMoreSchemes"
        class="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400"
        :disabled="fetchingSchemes"
      >
        <span v-if="fetchingSchemes">Loading...</span>
        <span v-else>Load More</span>
      </button>
    </div>
    
    <!-- Empty state -->
    <div v-if="schemes.length === 0 && !isLoading" class="flex flex-col items-center justify-center py-12">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
      </svg>
      <h3 class="text-lg font-medium text-gray-600 mb-2">No schemes found</h3>
      <p class="text-gray-500 mb-4">Get started by creating your first scheme</p>
      <button
        @click="openCreateForm"
        class="px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition-colors focus:outline-none focus:ring-2 focus:ring-sky-500"
      >
        <span class="flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          Create Scheme
        </span>
      </button>
    </div>
  </div>
  
  <!-- Create/Edit Scheme Modal -->
  <modal v-if="showModal" @close="showModal = false" content-width="w-full max-w-2xl">
    <template v-slot:header>
      <h3 class="text-lg font-semibold">{{ formTitle }}</h3>
    </template>
    
    <template v-slot:body>
      <form @submit.prevent="saveForm" class="p-6">
        <!-- Scheme Title -->
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-1" for="title">
            Scheme Title <span class="text-red-500">*</span>
          </label>
          <input
            id="title"
            v-model="form.title"
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
            v-model="form.description"
            rows="3"
            class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500"
            placeholder="Enter scheme description"
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
              v-model="form.startDate"
              type="date"
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1" for="endDate">
              End Date
            </label>
            <input
              id="endDate"
              v-model="form.endDate"
              type="date"
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500"
            />
          </div>
        </div>
        
        <!-- Assignee -->
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Assignee
          </label>
          <VueMultiselect
            v-model="form.assignee"
            :options="users"
            label="firstName"
            :searchable="true"
            track-by="uid"
            placeholder="Select an assignee"
          />
        </div>
        
        <!-- Members -->
        <div class="mb-6">
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Members
          </label>
          <VueMultiselect
            v-model="form.members"
            :options="users"
            label="firstName"
            :searchable="true"
            track-by="uid"
            :multiple="true"
            placeholder="Select members"
          />
        </div>
        
        <!-- Submit button -->
        <div class="flex justify-end">
          <button
            type="button"
            @click="showModal = false"
            class="mr-3 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-sky-500"
          >
            Cancel
          </button>
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

<style scoped>
/* Add any component-specific styles here */
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>