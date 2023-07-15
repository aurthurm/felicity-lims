<script setup lang="ts">
import { ref, reactive, computed, defineAsyncComponent } from 'vue';
import { usePatientStore } from '../../../stores';
import { useApiUtil } from '../../../composables';
import { IIdentification } from '../../../models/patient'
import { ADD_IDENTIFICATION, UPDATE_IDENTIFICATION } from '../../../graphql/patient.mutations';
const modal = defineAsyncComponent(
  () => import('../../../components/SimpleModal.vue')
)

const patientStore = usePatientStore();
const { withClientMutation } = useApiUtil();

let showModal = ref<boolean>(false);
let formTitle = ref<string>('');
let form = reactive({}) as IIdentification;
const formAction = ref<boolean>(true);

patientStore.fetchIdentifications();

function addIdentification(): void {
  withClientMutation(ADD_IDENTIFICATION, { name: form.name }, "createIdentification")
    .then((result) => patientStore.addIdentification(result));
}

function editIdentification(): void {
  withClientMutation(UPDATE_IDENTIFICATION, { uid: form.uid, name: form.name }, "updateIdentification")
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
      class="px-2 py-1 border-sky-800 border text-sky-800rounded-smtransition duration-300 hover:bg-sky-800 hover:text-white focus:outline-none">Add
      Identification</button>
    <hr>

    <div class="overflow-x-auto mt-4">
      <div
        class="align-middle inline-block min-w-full shadow overflow-hidden bg-white shadow-dashboard px-2 pt-1 rounded-bl-lg rounded-br-lg">
        <table class="min-w-full">
          <thead>
            <tr>
              <th class="px-1 py-1 border-b-2 border-gray-300 text-left text-sm leading-4 text-gray-800 tracking-wider">
                Name</th>
              <th class="px-1 py-1 border-b-2 border-gray-300"></th>
            </tr>
          </thead>
          <tbody class="bg-white">
            <tr v-for="identification in identifications" :key="identification?.uid">
              <td class="px-1 py-1 whitespace-no-wrap border-b border-gray-500">
                <div class="flex items-center">
                  <div>
                    <div class="text-sm leading-5 text-gray-800">{{ identification?.name }}</div>
                  </div>
                </div>
              </td>
              <td class="px-1 py-1 whitespace-no-wrap text-right border-b border-gray-500 text-sm leading-5">
                <button @click="FormManager(false, identification)"
                  class="px-2 py-1 mr-2 border-sky-800 border text-sky-800 rounded-sm transition duration-300 hover:bg-sky-800 hover:text-white focus:outline-none">Edit</button>
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
            <span class="text-gray-700">Indentication Name</span>
            <input class="form-input mt-1 block w-full" v-model="form.name" placeholder="Name ..." />
          </label>
        </div>
        <hr />
        <button type="button" @click.prevent="saveForm()"
          class="-mb-4 w-full border border-sky-800 bg-sky-800 text-white rounded-sm px-4 py-2 m-2 transition-colors duration-500 ease select-none hover:bg-sky-800 focus:outline-none focus:shadow-outline">
          Save Form
        </button>
      </form>
    </template>
  </modal>
</template>