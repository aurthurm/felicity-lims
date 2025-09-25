<script setup lang="ts">
import { ref, reactive, computed, defineAsyncComponent } from 'vue';
import { usePatientStore } from '@/stores/patient';
import  useApiUtil  from '@/composables/api_util';
import { IdentificationType } from '@/types/gql'
import { AddIdentificationDocument, AddIdentificationMutation, AddIdentificationMutationVariables,
  EditIdentificationDocument, EditIdentificationMutation, EditIdentificationMutationVariables } from '@/graphql/operations/patient.mutations';
const modal = defineAsyncComponent(
  () => import('@/components/ui/FelModal.vue')
)

const patientStore = usePatientStore();
const { withClientMutation } = useApiUtil();

let showModal = ref<boolean>(false);
let formTitle = ref<string>('');
let form = reactive({}) as IdentificationType;
const formAction = ref<boolean>(true);

patientStore.fetchIdentifications();

function addIdentification(): void {
  withClientMutation<AddIdentificationMutation, AddIdentificationMutationVariables>(AddIdentificationDocument, { name: form.name }, "createIdentification")
    .then((result) => patientStore.addIdentification(result));
}

function editIdentification(): void {
  withClientMutation<EditIdentificationMutation, EditIdentificationMutationVariables>(EditIdentificationDocument, { uid: form.uid, name: form.name }, "updateIdentification")
    .then((result) => patientStore.updateIdentification(result));
}

function FormManager(create: boolean, obj = {} as IdentificationType): void {
  formAction.value = create;
  showModal.value = true;
  formTitle.value = (create ? 'CREATE' : 'EDIT') + ' ' + "PERSON IDENTIFICATION";
  if (create) {
    Object.assign(form, {} as IdentificationType);
  } else {
    Object.assign(form, { ...obj });
  }
}

function saveForm(): void {
  if (formAction.value === true) addIdentification();
  if (formAction.value === false) editIdentification();
  showModal.value = false;
}

const identifications = computed(() => patientStore.getIdentifications)
</script>


<template>
  <div class="space-y-6">
    <fel-heading title="Person Identifications">
      <fel-button @click="FormManager(true)">Add Person Identification</fel-button>
    </fel-heading>

    <div class="rounded-md border border-border p-6 bg-card">
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
            <tr v-for="identification in identifications" :key="identification?.uid" class="hover:bg-muted/50">
              <td class="whitespace-nowrap px-3 py-4 text-sm text-foreground">{{ identification?.name }}</td>
              <td class="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                <button 
                  @click="FormManager(false, identification)"
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

  <!-- Identification Edit Form Modal -->
  <fel-modal v-if="showModal" @close="showModal = false" :content-width="'w-1/2'">
    <template v-slot:header>
      <h3 class="text-xl font-semibold text-foreground">{{ formTitle }}</h3>
    </template>

    <template v-slot:body>
      <form @submit.prevent="saveForm" class="space-y-6 p-4">
        <div class="grid grid-cols-1 gap-4">
          <label class="block">
            <span class="text-sm font-medium text-foreground">Identification Name</span>
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
          Save Identification
        </button>
      </form>
    </template>
  </fel-modal>
</template>