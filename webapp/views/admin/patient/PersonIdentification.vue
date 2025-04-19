<script setup lang="ts">
import { ref, reactive, computed, defineAsyncComponent } from 'vue';
import { usePatientStore } from '@/stores/patient';
import  useApiUtil  from '@/composables/api_util';
import { IIdentification } from '@/models/patient'
import { AddIdentificationDocument, AddIdentificationMutation, AddIdentificationMutationVariables,
  EditIdentificationDocument, EditIdentificationMutation, EditIdentificationMutationVariables } from '@/graphql/operations/patient.mutations';
const modal = defineAsyncComponent(
  () => import('@/components/ui/FelModal.vue')
)

const patientStore = usePatientStore();
const { withClientMutation } = useApiUtil();

let showModal = ref<boolean>(false);
let formTitle = ref<string>('');
let form = reactive({}) as IIdentification;
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

function FormManager(create: boolean, obj = {} as IIdentification): void {
  formAction.value = create;
  showModal.value = true;
  formTitle.value = (create ? 'CREATE' : 'EDIT') + ' ' + "PERSON IDENTIFICATION";
  if (create) {
    Object.assign(form, {} as IIdentification);
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
  <div class="container w-full my-4">
    <hr>
    <button @click="FormManager(true)"
      class="px-2 py-1 border-primary border text-primary rounded-sm transition duration-300 hover:bg-primary hover:text-primary-foreground focus:outline-none">Add
      Identification</button>
    <hr>

    <div class="overflow-x-auto mt-4">
      <div
        class="align-middle inline-block min-w-full shadow overflow-hidden bg-background shadow-dashboard px-2 pt-1 rounded-bl-lg rounded-br-lg">
        <table class="min-w-full">
          <thead>
            <tr>
              <th class="px-1 py-1 border-b-2 border-border text-left text-sm leading-4 text-foreground tracking-wider">
                Name</th>
              <th class="px-1 py-1 border-b-2 border-border"></th>
            </tr>
          </thead>
          <tbody class="bg-background">
            <tr v-for="identification in identifications" :key="identification?.uid">
              <td class="px-1 py-1 whitespace-no-wrap border-b border-border">
                <div class="flex items-center">
                  <div>
                    <div class="text-sm leading-5 text-foreground">{{ identification?.name }}</div>
                  </div>
                </div>
              </td>
              <td class="px-1 py-1 whitespace-no-wrap text-right border-b border-border text-sm leading-5">
                <button @click="FormManager(false, identification)"
                  class="px-2 py-1 mr-2 border-primary border text-primary rounded-sm transition duration-300 hover:bg-primary hover:text-primary-foreground focus:outline-none">Edit</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>

  <!-- Location Edit Form Modal -->
  <modal v-if="showModal" @close="showModal = false">
    <template v-slot:header>
      <h3>{{ formTitle }}</h3>
    </template>

    <template v-slot:body>
      <form action="post" class="p-1">
        <div class="grid grid-cols-2 gap-x-4 mb-4">
          <label class="flex items-center gap-x-4 whitespace-nowrap col-span-2 mb-2">
            <span class="text-foreground">Indentication Name</span>
            <input class="form-input mt-1 block w-full" v-model="form.name" placeholder="Name ..." />
          </label>
        </div>
        <hr />
        <button type="button" @click.prevent="saveForm()"
          class="-mb-4 w-full border border-primary bg-primary text-primary-foreground rounded-sm px-4 py-2 m-2 transition-colors duration-500 ease select-none hover:bg-primary focus:outline-none focus:shadow-outline">
          Save Form
        </button>
      </form>
    </template>
  </modal>
</template>