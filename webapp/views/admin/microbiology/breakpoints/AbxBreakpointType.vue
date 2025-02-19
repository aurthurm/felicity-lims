<script setup lang="ts">
import {defineAsyncComponent, onMounted, reactive, ref} from 'vue';

import useApiUtil from '@/composables/api_util';
import {IAbxBreakpointType} from "@/models/microbiology";
import {
  AddAbxBreakpointTypeDocument,
  AddAbxBreakpointTypeMutation,
  AddAbxBreakpointTypeMutationVariables,
  EditAbxBreakpointTypeDocument,
  EditAbxBreakpointTypeMutation,
  EditAbxBreakpointTypeMutationVariables
} from "@/graphql/operations/microbiology.mutations";
import { GetAbxBreakpointTypeAllQuery, GetAbxBreakpointTypeAllQueryVariables, GetAbxBreakpointTypeAllDocument } from '@/graphql/operations/microbiology.queries';


const modal = defineAsyncComponent(
    () => import("@/components/ui/FelModal.vue")
)

const {withClientMutation, withClientQuery} = useApiUtil()

let showModal = ref<boolean>(false);
let formTitle = ref<string>('');
let form = reactive({}) as IAbxBreakpointType;
const formAction = ref<boolean>(true);

const abxBreakpointTypes = ref<IAbxBreakpointType[]>([]);

onMounted(() => {
  withClientQuery<GetAbxBreakpointTypeAllQuery, GetAbxBreakpointTypeAllQueryVariables>(
      GetAbxBreakpointTypeAllDocument, {}, "abxBreakpointTypeAll"
  ).then((result) => {
    if (result) {
      abxBreakpointTypes.value = result as IAbxBreakpointType[]
    }
  })
})

function FormManager(create: boolean, obj = {} as IAbxBreakpointType): void {
  formAction.value = create;
  showModal.value = true;
  formTitle.value = (create ? 'Create' : 'Edit') + ' ' + "Abx BreakpointType";
  if (create) {
    Object.assign(form, {} as IAbxBreakpointType);
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
    withClientMutation<AddAbxBreakpointTypeMutation, AddAbxBreakpointTypeMutationVariables>(
        AddAbxBreakpointTypeDocument, {payload}, "createAbxBreakpointType"
    ).then((result) => {
      if (result) {
        abxBreakpointTypes.value.unshift(result as IAbxBreakpointType);
      }
    });
  }

  if (formAction.value === false) {
    withClientMutation<EditAbxBreakpointTypeMutation, EditAbxBreakpointTypeMutationVariables>(EditAbxBreakpointTypeDocument, {
      uid: form.uid!,
      payload
    }, "updateAbxBreakpointType")
        .then((result) => {
          if (result) {
            const idx = abxBreakpointTypes.value.findIndex(item => item.uid == result.uid);
            if (idx > -1) {
              abxBreakpointTypes.value = [
                ...abxBreakpointTypes.value.map((item, index) => index === idx ? result : item),
              ] as IAbxBreakpointType[];
            }
          }
        });
  }

  showModal.value = false;
}

</script>

<template>

  <div class="w-full my-4">
    <!-- <hr>
    <button @click="FormManager(true)"
            class="px-2 py-1 border-sky-800 border text-sky-800 rounded-sm transition duration-300 hover:bg-sky-800 hover:text-white focus:outline-none">
      Add Abx BreakpointType
    </button> -->
    <hr>

    <div class="overflow-x-auto mt-4">
      <div
          class="align-middle inline-block min-w-full shadow overflow-hidden bg-white shadow-dashboard px-2 pt-1 rounded-bl-lg rounded-br-lg">
        <table class="min-w-full">
          <thead>
          <tr>
            <th class="px-1 py-1 border-b-2 border-gray-300 text-left text-sm leading-4 text-gray-800 tracking-wider">
              Name
            </th>
            <th class="px-1 py-1 border-b-2 border-gray-300 text-left text-sm leading-4 text-gray-800 tracking-wider">
              Description
            </th>
            <th class="px-1 py-1 border-b-2 border-gray-300"></th>
          </tr>
          </thead>
          <tbody class="bg-white">
          <tr v-for="bpt in abxBreakpointTypes" :key="bpt?.uid">
            <td class="px-1 py-1 whitespace-no-wrap border-b border-gray-500">
              <div class="flex items-center">
                <div class="text-sm leading-5 text-gray-800">{{ bpt?.name }}</div>
              </div>
            </td>
            <td class="px-1 py-1 whitespace-no-wrap border-b border-gray-500">
              <div class="text-sm leading-5 text-sky-800">{{ bpt?.description }}</div>
            </td>
            <td class="px-1 py-1 whitespace-no-wrap text-right border-b border-gray-500 text-sm leading-5">
              <!-- <button @click="FormManager(false, bpt)"
                      class="px-2 py-1 mr-2 border-sky-800 border text-sky-800 rounded-sm transition duration-300 hover:bg-sky-800 hover:text-white focus:outline-none">
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
  <modal v-if="showModal" @close="showModal = false">
    <template v-slot:header>
      <h3>{{ formTitle }}</h3>
    </template>

    <template v-slot:body>
      <form action="post" class="p-1">
        <div class="grid grid-cols-2 gap-x-4 mb-4">
          <label class="block col-span-1 mb-2">
            <span class="text-gray-700">Name</span>
            <input
                class="form-input mt-1 block w-full"
                v-model="form.name"
                placeholder="Name ..."
            />
          </label>
          <label class="block col-span-1 mb-2">
            <span class="text-gray-700">Description</span>
            <input
                class="form-input mt-1 block w-full"
                v-model="form.description"
                placeholder="Begin typing ..."
            />
          </label>
        </div>
        <hr/>
        <button
            type="button"
            @click.prevent="saveForm()"
            class="-mb-4 w-full border border-sky-800 bg-sky-800 text-white rounded-sm px-4 py-2 m-2 transition-colors duration-500 ease select-none hover:bg-sky-800 focus:outline-none focus:shadow-outline"
        >
          Save Abx BreakpointType
        </button>
      </form>
    </template>
  </modal>

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
