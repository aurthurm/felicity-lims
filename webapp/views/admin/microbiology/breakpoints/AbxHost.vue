<script setup lang="ts">
import {onMounted, reactive, ref} from 'vue';

import useApiUtil from '@/composables/api_util';
import {AbxHostType} from "@/types/gql";
import {
  AddAbxHostDocument,
  AddAbxHostMutation,
  AddAbxHostMutationVariables,
  EditAbxHostDocument,
  EditAbxHostMutation,
  EditAbxHostMutationVariables
} from "@/graphql/operations/microbiology.mutations";
import { GetAbxHostAllQuery, GetAbxHostAllQueryVariables, GetAbxHostAllDocument } from '@/graphql/operations/microbiology.queries';

const {withClientMutation, withClientQuery} = useApiUtil()

let showModal = ref<boolean>(false);
let formTitle = ref<string>('');
let form = reactive({}) as AbxHostType;
const formAction = ref<boolean>(true);

const abxHosts = ref<AbxHostType[]>([]);

onMounted(() => {
  withClientQuery<GetAbxHostAllQuery, GetAbxHostAllQueryVariables>(
      GetAbxHostAllDocument, {}, "abxHostAll"
  ).then((result) => {
    if (result) {
      abxHosts.value = result as AbxHostType[]
    }
  })
})

function FormManager(create: boolean, obj = {} as AbxHostType): void {
  formAction.value = create;
  showModal.value = true;
  formTitle.value = (create ? 'Create' : 'Edit') + ' ' + "Abx Host";
  if (create) {
    Object.assign(form, {} as AbxHostType);
  } else {
    Object.assign(form, {...obj});
  }
}

function saveForm(): void {
  const payload = {
    name: form.name,
    description: form.description,
  }

  if (formAction.value === true) {
    withClientMutation<AddAbxHostMutation, AddAbxHostMutationVariables>(
        AddAbxHostDocument, {payload}, "createAbxHost"
    ).then((result) => {
      if (result) {
        abxHosts.value.unshift(result as AbxHostType);
      }
    });
  }

  if (formAction.value === false) {
    withClientMutation<EditAbxHostMutation, EditAbxHostMutationVariables>(EditAbxHostDocument, {
      uid: form.uid!,
      payload
    }, "updateAbxHost")
        .then((result) => {
          if (result) {
            const idx = abxHosts.value.findIndex(item => item.uid == result.uid);
            if (idx > -1) {
              abxHosts.value = [
                ...abxHosts.value.map((item, index) => index === idx ? result : item),
              ] as AbxHostType[];
            }
          }
        });
  }

  showModal.value = false;
}

</script>

<template>
  <div class="space-y-6">
    <fel-heading title="Antibiotic Host"></fel-heading>

    <div class="overflow-x-auto">
      <div class="align-middle inline-block min-w-full shadow overflow-hidden bg-card shadow-dashboard rounded-lg p-6">
        <table class="min-w-full divide-y divide-border">
          <thead>
            <tr>
              <th class="px-3 py-3.5 text-left text-sm font-semibold text-foreground">Name</th>
              <th class="px-3 py-3.5 text-left text-sm font-semibold text-foreground">Description</th>
              <th class="px-3 py-3.5"></th>
            </tr>
          </thead>
          <tbody class="bg-background divide-y divide-border">
            <tr v-for="host in abxHosts" :key="host?.uid">
              <td class="px-3 py-3.5 whitespace-nowrap text-sm text-foreground">{{ host?.name }}</td>
              <td class="px-3 py-3.5 whitespace-nowrap text-sm text-foreground">{{ host?.description }}</td>
              <td class="px-3 py-3.5 whitespace-nowrap text-right text-sm">
                <!-- <button @click="FormManager(false, host)"
                        class="px-3 py-1.5 bg-primary text-primary-foreground rounded-sm transition duration-300 hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2">
                  Edit
                </button> -->
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>

  <!-- Location Edit Form Modal -->
  <fel-modal v-if="showModal" @close="showModal = false">
    <template v-slot:header>
      <h3 class="text-xl font-semibold text-foreground">{{ formTitle }}</h3>
    </template>

    <template v-slot:body>
      <form @submit.prevent="saveForm" class="space-y-6 p-4">
        <div class="grid grid-cols-2 gap-4">
          <label class="block">
            <span class="text-sm font-medium text-foreground">Name</span>
            <input
                class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                v-model="form.name"
                placeholder="Name ..."
            />
          </label>
          <label class="block">
            <span class="text-sm font-medium text-foreground">Description</span>
            <input
                class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                v-model="form.description"
                placeholder="Begin typing ..."
            />
          </label>
        </div>
        <hr class="border-border"/>
        <button
            type="submit"
            class="w-full bg-primary text-primary-foreground rounded-sm px-4 py-2 transition-colors duration-300 hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
        >
          Save Abx Host
        </button>
      </form>
    </template>
  </fel-modal>

</template>


<style scoped>
/* Remove the toggle-checkbox styles as they are not needed */
</style>
