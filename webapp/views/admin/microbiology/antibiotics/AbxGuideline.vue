<script setup lang="ts">
import {defineAsyncComponent, onMounted, reactive, ref} from 'vue';

import useApiUtil from '@/composables/api_util';
import {AbxGuidelineType} from "@/types/gql";
import {
  AddAbxGuidelineDocument,
  AddAbxGuidelineMutation,
  AddAbxGuidelineMutationVariables,
  EditAbxGuidelineDocument,
  EditAbxGuidelineMutation,
  EditAbxGuidelineMutationVariables
} from "@/graphql/operations/microbiology.mutations";
import {
  GetAbxGuidelinesAllDocument,
  GetAbxGuidelinesAllQuery,
  GetAbxGuidelinesAllQueryVariables
} from "@/graphql/operations/microbiology.queries";

const modal = defineAsyncComponent(
    () => import("@/components/ui/FelModal.vue")
)

const {withClientMutation, withClientQuery} = useApiUtil()

let showModal = ref<boolean>(false);
let formTitle = ref<string>('');
let form = reactive({}) as AbxGuidelineType;
const formAction = ref<boolean>(true);

const abxGuidelines = ref<AbxGuidelineType[]>([]);

onMounted(() => {
  withClientQuery<GetAbxGuidelinesAllQuery, GetAbxGuidelinesAllQueryVariables>(
      GetAbxGuidelinesAllDocument, {}, "abxGuidelinesAll"
  ).then((result) => {
    if (result) {
      abxGuidelines.value = result as AbxGuidelineType[]
    }
  })
})

function FormManager(create: boolean, obj = {} as AbxGuidelineType): void {
  formAction.value = create;
  showModal.value = true;
  formTitle.value = (create ? 'Create' : 'Edit') + ' ' + "Abx Guideline";
  if (create) {
    Object.assign(form, {} as IAbxGuideline);
  } else {
    Object.assign(form, {...obj});
  }
}

function saveForm(): void {
  const payload = {
    name: form.name,
    code: form.code,
    description: form.description,
  }

  if (formAction.value === true) {
    withClientMutation<AddAbxGuidelineMutation, AddAbxGuidelineMutationVariables>(
        AddAbxGuidelineDocument, {payload}, "createAbxGuideline"
    ).then((result) => {
      if (result) {
        abxGuidelines.value.unshift(result as IAbxGuideline);
      }
    });
  }

  if (formAction.value === false) {
    withClientMutation<EditAbxGuidelineMutation, EditAbxGuidelineMutationVariables>(EditAbxGuidelineDocument, {
      uid: form.uid!,
      payload
    }, "updateAbxGuideline")
        .then((result) => {
          if (result) {
            const idx = abxGuidelines.value.findIndex(item => item.uid == result.uid);
            if (idx > -1) {
              abxGuidelines.value = [
                ...abxGuidelines.value.map((item, index) => index === idx ? result : item),
              ] as IAbxGuideline[];
            }
          }
        });
  }

  showModal.value = false;
}

</script>

<template>
  <div class="space-y-6">
    <fel-heading title="Antibiotic Guidelines">
      <fel-button @click="FormManager(true)">Add Guideline</fel-button>      
    </fel-heading>

    <div class="border shadow-sm rounded-lg bg-card p-6">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-border">
          <thead>
            <tr>
              <th class="px-3 py-3.5 text-left text-sm font-semibold text-foreground">Name</th>
              <th class="px-3 py-3.5 text-left text-sm font-semibold text-foreground">Description</th>
              <th class="px-3 py-3.5 text-left text-sm font-semibold text-foreground">Code</th>
              <th class="relative py-3.5 pl-3 pr-4 sm:pr-6">
                <span class="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-border bg-background">
            <tr v-for="guideline in abxGuidelines" :key="guideline?.uid" class="hover:bg-muted/50">
              <td class="whitespace-nowrap px-3 py-4 text-sm text-foreground">{{ guideline?.name }}</td>
              <td class="whitespace-nowrap px-3 py-4 text-sm text-foreground">{{ guideline?.description }}</td>
              <td class="whitespace-nowrap px-3 py-4 text-sm text-foreground">{{ guideline?.code }}</td>
              <td class="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                <button 
                  @click="FormManager(false, guideline)"
                  class="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2 mr-2">
                  Edit
                </button>
                <button 
                  @click="deleteGuideline(guideline)"
                  class="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-destructive bg-background text-destructive hover:bg-destructive hover:text-destructive-foreground h-9 px-4 py-2">
                  Delete
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal -->
    <fel-modal v-if="showModal" @close="showModal = false">
      <template v-slot:header>
        <h3 class="text-lg font-semibold text-foreground">{{ formTitle }}</h3>
      </template>

      <template v-slot:body>
        <form @submit.prevent="saveForm" class="space-y-4">
          <div class="space-y-2">
            <label for="name" class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Name</label>
            <input 
              id="name"
              v-model="form.name"
              type="text"
              class="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
              required
            />
          </div>

          <div class="space-y-2">
            <label for="description" class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Description</label>
            <textarea 
              id="description"
              v-model="form.description"
              class="flex min-h-[60px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
              rows="3"
            ></textarea>
          </div>

          <div class="space-y-2">
            <label for="code" class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Code</label>
            <input 
              id="code"
              v-model="form.code"
              type="text"
              class="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
              required
            />
          </div>

          <div class="flex justify-end space-x-2">
            <button 
              type="button"
              @click="showModal = false"
              class="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2">
              Cancel
            </button>
            <button 
              type="submit"
              class="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-9 px-4 py-2">
              Save
            </button>
          </div>
        </form>
      </template>
    </fel-modal>
  </div>
</template>

<style lang="postcss" scoped>
.multiselect-blue {
  @apply rounded-md border border-input bg-background;
}

.multiselect-blue .multiselect__tags {
  @apply border-0 bg-transparent px-3 py-2 text-sm;
}

.multiselect-blue .multiselect__single {
  @apply mb-0 text-sm text-foreground;
}

.multiselect-blue .multiselect__input {
  @apply text-sm text-foreground;
}

.multiselect-blue .multiselect__option {
  @apply text-sm text-foreground;
}

.multiselect-blue .multiselect__option--highlight {
  @apply bg-primary text-primary-foreground;
}

.multiselect-blue .multiselect__option--selected {
  @apply bg-primary/20 text-primary;
}
</style>
