<script setup lang="ts">
import {defineAsyncComponent, onMounted, reactive, ref} from 'vue';

import useApiUtil from '@/composables/api_util';
import { AbxKingdomType, AbxPhylumType } from "@/types/gql";
import {
  AddAbxPhylumDocument,
  AddAbxPhylumMutation,
  AddAbxPhylumMutationVariables,
  EditAbxPhylumDocument,
  EditAbxPhylumMutation,
  EditAbxPhylumMutationVariables
} from "@/graphql/operations/microbiology.mutations";
import {
  GetAbxKingdomAllDocument,
  GetAbxKingdomAllQuery,
  GetAbxKingdomAllQueryVariables,
  GetAbxPhylumAllDocument,
  GetAbxPhylumAllQuery,
  GetAbxPhylumAllQueryVariables
} from "@/graphql/operations/microbiology.queries";

const VueMultiselect = defineAsyncComponent(
  () => import('vue-multiselect')
)
const {withClientMutation, withClientQuery} = useApiUtil()

let showModal = ref<boolean>(false);
let formTitle = ref<string>('');
let form = reactive({}) as AbxPhylumType;
const formAction = ref<boolean>(true);

const abxPhylums = ref<AbxPhylumType[]>([]);
const abxKingdoms = ref<AbxKingdomType[]>([]);

onMounted(() => {
  withClientQuery<GetAbxKingdomAllQuery, GetAbxKingdomAllQueryVariables>(
      GetAbxKingdomAllDocument, {}, "abxKingdomAll"
  ).then((result) => {
    if (result) {
      abxKingdoms.value = result as AbxKingdomType[]
    }
  })
  withClientQuery<GetAbxPhylumAllQuery, GetAbxPhylumAllQueryVariables>(
      GetAbxPhylumAllDocument, {}, "abxPhylumAll"
  ).then((result) => {
    if (result) {
      abxPhylums.value = result as AbxPhylumType[]
    }
  })
})

function FormManager(create: boolean, obj = {} as AbxPhylumType): void {
  formAction.value = create;
  showModal.value = true;
  formTitle.value = (create ? 'Create' : 'Edit') + ' ' + "Phylum";
  if (create) {
    Object.assign(form, {} as AbxPhylumType);
  } else {
    Object.assign(form, {...obj});
  }
}

function saveForm(): void {
  const payload = {
    name: form.name,
    kingdomUid: form.kingdom?.uid
  }

  if (formAction.value === true) {
    withClientMutation<AddAbxPhylumMutation, AddAbxPhylumMutationVariables>(
        AddAbxPhylumDocument, {payload}, "createAbxPhylum"
    ).then((result) => {
      if (result) {
        abxPhylums.value.unshift(result as AbxPhylumType);
      }
    });
  }

  if (formAction.value === false) {
    withClientMutation<EditAbxPhylumMutation, EditAbxPhylumMutationVariables>(EditAbxPhylumDocument, {
      uid: form.uid!,
      payload
    }, "updateAbxPhylum")
        .then((result) => {
          if (result) {
            const idx = abxPhylums.value.findIndex(item => item.uid == result.uid);
            if (idx > -1) {
              abxPhylums.value = [
                ...abxPhylums.value.map((item, index) => index === idx ? result : item),
              ] as AbxPhylumType[];
            }
          }
        });
  }

  showModal.value = false;
}

</script>

<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <h2 class="text-2xl font-semibold text-foreground">Phyla</h2>
      <button
        @click="FormManager(true)"
        class="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
      >
        Add Phylum
      </button>
    </div>

    <div class="rounded-md border border-border bg-card p-6">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-border">
          <thead>
            <tr>
              <th class="px-3 py-3.5 text-left text-sm font-semibold text-foreground">Name</th>
              <th class="px-3 py-3.5 text-left text-sm font-semibold text-foreground">Kingdom</th>
              <th class="relative py-3.5 pl-3 pr-4 sm:pr-6">
                <span class="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-border bg-background">
            <tr v-for="guideline in abxPhylums" :key="guideline?.uid" class="hover:bg-muted/50">
              <td class="whitespace-nowrap px-3 py-4 text-sm text-foreground">{{ guideline?.name }}</td>
              <td class="whitespace-nowrap px-3 py-4 text-sm text-foreground">{{ guideline?.kingdom?.name }}</td>
              <td class="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                <button 
                  @click="FormManager(false, guideline)"
                  class="text-primary hover:text-primary/80">
                  Edit
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>

  <!-- Phylum Edit Form Modal -->
  <fel-modal v-if="showModal" @close="showModal = false" :content-width="'w-1/2'">
    <template v-slot:header>
      <h3 class="text-xl font-semibold text-foreground">{{ formTitle }}</h3>
    </template>

    <template v-slot:body>
      <form @submit.prevent="saveForm" class="space-y-6 p-4">
        <div class="grid grid-cols-2 gap-4">
          <label class="block">
            <span class="text-sm font-medium text-foreground">Phylum Name</span>
            <input 
              class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              v-model="form.name" 
              placeholder="Name ..." />
          </label>
          <label class="block">
            <span class="text-sm font-medium text-foreground">Kingdom</span>
            <VueMultiselect
              v-model="form.kingdom"
              :options="abxKingdoms"
              :multiple="false"
              :searchable="true"
              label="name"
              class="mt-1 multiselect-blue"
            />
          </label>
        </div>

        <hr class="border-border"/>
        
        <button
          type="submit"
          class="w-full bg-primary text-primary-foreground rounded-md px-4 py-2 transition-colors duration-200 hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
        >
          Save Phylum
        </button>
      </form>
    </template>
  </fel-modal>
</template>

<style scoped>
.multiselect-blue {
  @apply rounded-md border-border shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50;
}

.multiselect-blue :deep(.multiselect__tags) {
  @apply border-border rounded-md;
}

.multiselect-blue :deep(.multiselect__single) {
  @apply text-foreground;
}

.multiselect-blue :deep(.multiselect__input) {
  @apply text-foreground;
}

.multiselect-blue :deep(.multiselect__option) {
  @apply text-foreground hover:bg-primary/10;
}

.multiselect-blue :deep(.multiselect__option--highlight) {
  @apply bg-primary text-primary-foreground;
}

.multiselect-blue :deep(.multiselect__option--selected) {
  @apply bg-primary/20 text-foreground;
}

.toggle-checkbox:checked {
  right: 0;
  border-color: #68D391;
}

.toggle-checkbox:checked + .toggle-label {
  background-color: #68D391;
}
</style>
