<script setup lang="ts">
import useApiUtil from '@/composables/api_util'
import { AddGrindPosterMutation, AddGrindPosterMutationVariables, AddGrindPosterDocument } from '@/graphql/operations/grind.mutations'
import { GrindPosterType, PosterCategory } from '@/graphql/schema'
import { IGrindPoster } from '@/models/grind'
import { resetForm } from '@/utils/helpers'
import { defineAsyncComponent, PropType, reactive, ref, watch } from 'vue'
const Poster = defineAsyncComponent(() => import("./Poster.vue"))

const props = defineProps({
    posters: {
      type: Array as PropType<IGrindPoster[]>,
      required: true
    },
    boardUid: String
})

const { withClientMutation, withClientQuery } = useApiUtil();
const boardPosters = ref<IGrindPoster[]>(props.posters);

watch(() => props.posters, (newPosters: IGrindPoster[]) => {
    boardPosters.value = newPosters;
  }
);

// Poster Form Management
let showPosterModal = ref<boolean>(false);
let formAction = ref<boolean>(false);
let posterFormTitle = ref<string>("");
let posterForm = reactive({}) as IGrindPoster;

const openCreatePosterForm = () => {
  formAction.value = true;
  showPosterModal.value = true;
  posterFormTitle.value = "Create Listing";
  resetForm(posterForm)
};

const savePosterForm = () => {
  showPosterModal.value = false;
  withClientMutation<AddGrindPosterMutation, AddGrindPosterMutationVariables>(
      AddGrindPosterDocument,
      { payload: { ...posterForm, boardUid: props.boardUid, category: PosterCategory.Listing } },
      "createGrindPoster"
  ).then((poster) => {
      boardPosters.value.push(poster as GrindPosterType);
  });
};

</script>


<template>
  <div class="flex justify-start gap-x-4 items-start mt-4"> 
    <div v-for="poster in boardPosters" :key="poster.uid" class="p-2 w-72 bg-gray-200 rounded overflow-auto">
      <poster :poster="poster" />
    </div>

    <button 
    class="font-medium py-1 px-2 border border-gray-300 hover:border-sky-700 hover:text-sky-700 hover:bg-gray-100"
    @click="openCreatePosterForm">Add Listing</button>
  </div>


    <!-- Create/Edit Poster Modal -->
    <modal v-if="showPosterModal" @close="showPosterModal = false" content-width="w-full max-w-2xl">
    <template v-slot:header>
      <h3 class="text-lg font-semibold">{{ posterFormTitle }}</h3>
    </template>
    
    <template v-slot:body>
      <form @submit.prevent="savePosterForm">
        <!-- Scheme Title -->
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-1" for="title">
            Scheme Title <span class="text-red-500">*</span>
          </label>
          <input
            id="title"
            v-model="posterForm.title"
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
            v-model="posterForm.description"
            rows="3"
            class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500"
            placeholder="Enter scheme description"
          ></textarea>
        </div>
        
        <!-- Submit button -->
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
