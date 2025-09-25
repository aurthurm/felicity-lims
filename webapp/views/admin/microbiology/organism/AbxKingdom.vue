<script setup lang="ts">
import { onMounted, reactive, ref} from 'vue';

import useApiUtil from '@/composables/api_util';
import { AbxKingdomType } from "@/types/gql";
import {
  AddAbxKingdomDocument,
  AddAbxKingdomMutation,
  AddAbxKingdomMutationVariables,
  EditAbxKingdomDocument,
  EditAbxKingdomMutation,
  EditAbxKingdomMutationVariables
} from "@/graphql/operations/microbiology.mutations";
import {
  GetAbxKingdomAllDocument,
  GetAbxKingdomAllQuery,
  GetAbxKingdomAllQueryVariables
} from "@/graphql/operations/microbiology.queries";

const {withClientMutation, withClientQuery} = useApiUtil()

let showModal = ref<boolean>(false);
let formTitle = ref<string>('');
let form = reactive({}) as AbxKingdomType;
const formAction = ref<boolean>(true);

const abxKingdoms = ref<AbxKingdomType[]>([]);

onMounted(() => {
  withClientQuery<GetAbxKingdomAllQuery, GetAbxKingdomAllQueryVariables>(
      GetAbxKingdomAllDocument, {}, "abxKingdomAll"
  ).then((result) => {
    if (result) {
      abxKingdoms.value = result as AbxKingdomType[]
    }
  })
})

function FormManager(create: boolean, obj = {} as AbxKingdomType): void {
  formAction.value = create;
  showModal.value = true;
  formTitle.value = (create ? 'Create' : 'Edit') + ' ' + "kingdom";
  if (create) {
    Object.assign(form, {} as AbxKingdomType);
  } else {
    Object.assign(form, {...obj});
  }
}

function saveForm(): void {
  const payload = {
    name: form.name,
  }

  if (formAction.value === true) {
    withClientMutation<AddAbxKingdomMutation, AddAbxKingdomMutationVariables>(
        AddAbxKingdomDocument, {payload}, "createAbxKingdom"
    ).then((result) => {
      if (result) {
        abxKingdoms.value.unshift(result as AbxKingdomType);
      }
    });
  }

  if (formAction.value === false) {
    withClientMutation<EditAbxKingdomMutation, EditAbxKingdomMutationVariables>(EditAbxKingdomDocument, {
      uid: form.uid!,
      payload
    }, "updateAbxKingdom")
        .then((result) => {
          if (result) {
            const idx = abxKingdoms.value.findIndex(item => item.uid == result.uid);
            if (idx > -1) {
              abxKingdoms.value = [
                ...abxKingdoms.value.map((item, index) => index === idx ? result : item),
              ] as AbxKingdomType[];
            }
          }
        });
  }

  showModal.value = false;
}

</script>

<template>
  <div class="space-y-6">
    <fel-heading title="Kingdoms">
      <fel-button @click="FormManager(true)">Add Kingdom</fel-button>
    </fel-heading>

    <div class="rounded-md border border-border shadow-sm bg-card p-6">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-border">
          <thead>
            <tr>
              <th class="px-3 py-3.5 text-left text-sm font-semibold text-foreground">Name</th>
              <th class="relative py-3.5 pl-3 pr-4 sm:pr-6">
                <span class="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-border bg-background">
            <tr v-for="guideline in abxKingdoms" :key="guideline?.uid" class="hover:bg-muted/50">
              <td class="whitespace-nowrap px-3 py-4 text-sm text-foreground">{{ guideline?.name }}</td>
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

  <!-- Kingdom Edit Form Modal -->
  <fel-modal v-if="showModal" @close="showModal = false" :content-width="'w-1/2'">
    <template v-slot:header>
      <h3 class="text-xl font-semibold text-foreground">{{ formTitle }}</h3>
    </template>

    <template v-slot:body>
      <form @submit.prevent="saveForm" class="space-y-6 p-4">
        <div class="grid grid-cols-2 gap-4">
          <label class="block">
            <span class="text-sm font-medium text-foreground">Kingdom Name</span>
            <input 
              class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              v-model="form.name" 
              placeholder="Name ..." />
          </label>
        </div>

        <hr class="border-border"/>
        
        <button
          type="submit"
          class="w-full bg-primary text-primary-foreground rounded-md px-4 py-2 transition-colors duration-200 hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
        >
          Save Kingdom
        </button>
      </form>
    </template>
  </fel-modal>
</template>


<style scoped>
.toggle-checkbox:checked {
  right: 0;
  border-color: #68D391;
}

.toggle-checkbox:checked + .toggle-label {
  background-color: #68D391;
}
</style>
