<script setup lang="ts">
import {defineAsyncComponent, onMounted, reactive, ref} from 'vue';

import useApiUtil from '@/composables/api_util';
import { IAbxFamily, IAbxOrder } from "@/models/microbiology";
import {
  AddAbxFamilyDocument,
  AddAbxFamilyMutation,
  AddAbxFamilyMutationVariables,
  EditAbxFamilyDocument,
  EditAbxFamilyMutation,
  EditAbxFamilyMutationVariables
} from "@/graphql/operations/microbiology.mutations";
import {
  GetAbxFamilyAllDocument,
  GetAbxFamilyAllQuery,
  GetAbxFamilyAllQueryVariables,
  GetAbxOrderAllDocument,
  GetAbxOrderAllQuery,
  GetAbxOrderAllQueryVariables
} from "@/graphql/operations/microbiology.queries";

const modal = defineAsyncComponent(
    () => import("@/components/ui/FelModal.vue")
)
const VueMultiselect = defineAsyncComponent(
  () => import('vue-multiselect')
)
const {withClientMutation, withClientQuery} = useApiUtil()

let showModal = ref<boolean>(false);
let formTitle = ref<string>('');
let form = reactive({}) as IAbxFamily;
const formAction = ref<boolean>(true);

const abxFamilys = ref<IAbxFamily[]>([]);
const abxOrders = ref<IAbxOrder[]>([]);

onMounted(() => {
  withClientQuery<GetAbxOrderAllQuery, GetAbxOrderAllQueryVariables>(
      GetAbxOrderAllDocument, {}, "abxOrderAll"
  ).then((result) => {
    if (result) {
      abxOrders.value = result as IAbxOrder[]
    }
  })
  withClientQuery<GetAbxFamilyAllQuery, GetAbxFamilyAllQueryVariables>(
      GetAbxFamilyAllDocument, {}, "abxFamilyAll"
  ).then((result) => {
    if (result) {
      abxFamilys.value = result as IAbxFamily[]
    }
  })
})

function FormManager(create: boolean, obj = {} as IAbxFamily): void {
  formAction.value = create;
  showModal.value = true;
  formTitle.value = (create ? 'Create' : 'Edit') + ' ' + "Family";
  if (create) {
    Object.assign(form, {} as IAbxFamily);
  } else {
    Object.assign(form, {...obj});
  }
}

function saveForm(): void {
  const payload = {
    name: form.name,
    orderUid: form.order?.uid
  }

  if (formAction.value === true) {
    withClientMutation<AddAbxFamilyMutation, AddAbxFamilyMutationVariables>(
        AddAbxFamilyDocument, {payload}, "createAbxFamily"
    ).then((result) => {
      if (result) {
        abxFamilys.value.unshift(result as IAbxFamily);
      }
    });
  }

  if (formAction.value === false) {
    withClientMutation<EditAbxFamilyMutation, EditAbxFamilyMutationVariables>(EditAbxFamilyDocument, {
      uid: form.uid!,
      payload
    }, "updateAbxFamily")
        .then((result) => {
          if (result) {
            const idx = abxFamilys.value.findIndex(item => item.uid == result.uid);
            if (idx > -1) {
              abxFamilys.value = [
                ...abxFamilys.value.map((item, index) => index === idx ? result : item),
              ] as IAbxFamily[];
            }
          }
        });
  }

  showModal.value = false;
}

</script>

<template>

  <div class="container w-full my-4">
    <hr>
    <button @click="FormManager(true)"
            class="px-2 py-1 border-sky-800 border text-sky-800 rounded-sm transition duration-300 hover:bg-sky-800 hover:text-white focus:outline-none">
      Add Family
    </button>
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
              Order
            </th>
            <th class="px-1 py-1 border-b-2 border-gray-300"></th>
          </tr>
          </thead>
          <tbody class="bg-white">
          <tr v-for="guideline in abxFamilys" :key="guideline?.uid">
            <td class="px-1 py-1 whitespace-no-wrap border-b border-gray-500">
              <div class="flex items-center">
                <div class="text-sm leading-5 text-gray-800">{{ guideline?.name }}</div>
              </div>
            </td>   <td class="px-1 py-1 whitespace-no-wrap border-b border-gray-500">
              <div class="flex items-center">
                <div class="text-sm leading-5 text-gray-800">{{ guideline?.order?.name }}</div>
              </div>
            </td>
            <td class="px-1 py-1 whitespace-no-wrap text-right border-b border-gray-500 text-sm leading-5">
              <button @click="FormManager(false, guideline)"
                      class="px-2 py-1 mr-2 border-sky-800 border text-sky-800 rounded-sm transition duration-300 hover:bg-sky-800 hover:text-white focus:outline-none">
                Edit
              </button>
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
            <span class="text-gray-700">Kindom Name</span>
            <input
                class="form-input mt-1 block w-full"
                v-model="form.name"
                placeholder="Name ..."
            />
          </label>
          <label class="block">
              <span class="text-gray-700">Order</span>
              <VueMultiselect
              v-model="form.order"
              :options="abxOrders"
              :multiple="false"
              :searchable="true"
              label="name"
              >
              </VueMultiselect>
          </label>
        </div>
        <hr/>
        <button
            type="button"
            @click.prevent="saveForm()"
            class="-mb-4 w-full border border-sky-800 bg-sky-800 text-white rounded-sm px-4 py-2 m-2 transition-colors duration-500 ease select-none hover:bg-sky-800 focus:outline-none focus:shadow-outline"
        >
          Save Family
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
