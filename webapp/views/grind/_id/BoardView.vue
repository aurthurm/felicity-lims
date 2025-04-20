<script setup lang="ts">
import useApiUtil from '@/composables/api_util'
import { AddGrindPosterMutation, AddGrindPosterMutationVariables, AddGrindPosterDocument } from '@/graphql/operations/grind.mutations'
import { GrindPosterType, PosterCategory } from '@/graphql/schema'
import { IGrindPoster } from '@/models/grind'
import { resetForm } from '@/utils'
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
  <div class="space-y-6">
    <!-- Posters Grid -->
    <div class="flex flex-wrap gap-4 items-start">
      <div 
        v-for="poster in boardPosters" 
        :key="poster.uid" 
        class="w-72 bg-muted rounded-lg shadow-sm overflow-hidden border border-border hover:shadow-md transition-all duration-200"
      >
        <poster :poster="poster" />
      </div>

      <!-- Add Listing Button -->
      <button 
        @click="openCreatePosterForm"
        class="w-72 h-32 flex items-center justify-center font-medium text-foreground bg-background border-2 border-dashed border-border rounded-lg hover:border-primary hover:text-primary hover:bg-secondary transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
      >
        <span class="flex items-center space-x-2">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          <span>Add Listing</span>
        </span>
      </button>
    </div>

    <!-- Create/Edit Poster Modal -->
    <fel-modal 
      v-if="showPosterModal" 
      @close="showPosterModal = false" 
      content-width="w-full max-w-2xl"
    >
      <template v-slot:header>
        <h3 class="text-lg font-semibold text-foreground">{{ posterFormTitle }}</h3>
      </template>
      
      <template v-slot:body>
        <form @submit.prevent="savePosterForm" class="space-y-6 p-6">
          <!-- Scheme Title -->
          <div>
            <label class="block text-sm font-medium text-foreground mb-1" for="title">
              Scheme Title <span class="text-destructive">*</span>
            </label>
            <input
              id="title"
              v-model="posterForm.title"
              type="text"
              required
              class="w-full px-3 py-2 border border-border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary bg-background text-foreground"
              placeholder="Enter scheme title"
            />
          </div>  
          
          <!-- Description -->
          <div>
            <label class="block text-sm font-medium text-foreground mb-1" for="description">
              Description
            </label>
            <textarea
              id="description"
              v-model="posterForm.description"
              rows="3"
              class="w-full px-3 py-2 border border-border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary bg-background text-foreground"
              placeholder="Enter scheme description"
            ></textarea>
          </div>
          
          <!-- Submit button -->
          <div class="flex justify-end space-x-3">
            <button
              type="button"
              @click="showPosterModal = false"
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
</style>
