<script setup lang="ts">
import {defineAsyncComponent, onMounted, reactive, ref} from 'vue';

import useApiUtil from '@/composables/api_util';
import {IAbxTestMethod} from "@/models/microbiology";
import {
  AddAbxTestMethodDocument,
  AddAbxTestMethodMutation,
  AddAbxTestMethodMutationVariables,
  EditAbxTestMethodDocument,
  EditAbxTestMethodMutation,
  EditAbxTestMethodMutationVariables
} from "@/graphql/operations/microbiology.mutations";
import { GetAbxTestMethodAllQuery, GetAbxTestMethodAllQueryVariables, GetAbxTestMethodAllDocument } from '@/graphql/operations/microbiology.queries';


const modal = defineAsyncComponent(
    () => import("@/components/ui/FelModal.vue")
)

const {withClientMutation, withClientQuery} = useApiUtil()

let showModal = ref<boolean>(false);
let formTitle = ref<string>('');
let form = reactive({}) as IAbxTestMethod;
const formAction = ref<boolean>(true);

const abxTestMethods = ref<IAbxTestMethod[]>([]);

onMounted(() => {
  withClientQuery<GetAbxTestMethodAllQuery, GetAbxTestMethodAllQueryVariables>(
      GetAbxTestMethodAllDocument, {}, "abxTestMethodAll"
  ).then((result) => {
    if (result) {
      abxTestMethods.value = result as IAbxTestMethod[]
    }
  })
})

function FormManager(create: boolean, obj = {} as IAbxTestMethod): void {
  formAction.value = create;
  showModal.value = true;
  formTitle.value = (create ? 'Create' : 'Edit') + ' ' + "Abx TestMethod";
  if (create) {
    Object.assign(form, {} as IAbxTestMethod);
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
    withClientMutation<AddAbxTestMethodMutation, AddAbxTestMethodMutationVariables>(
        AddAbxTestMethodDocument, {payload}, "createAbxTestMethod"
    ).then((result) => {
      if (result) {
        abxTestMethods.value.unshift(result as IAbxTestMethod);
      }
    });
  }

  if (formAction.value === false) {
    withClientMutation<EditAbxTestMethodMutation, EditAbxTestMethodMutationVariables>(EditAbxTestMethodDocument, {
      uid: form.uid!,
      payload
    }, "updateAbxTestMethod")
        .then((result) => {
          if (result) {
            const idx = abxTestMethods.value.findIndex(item => item.uid == result.uid);
            if (idx > -1) {
              abxTestMethods.value = [
                ...abxTestMethods.value.map((item, index) => index === idx ? result : item),
              ] as IAbxTestMethod[];
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
            class="px-2 py-1 border-primary border text-primary rounded-sm transition duration-300 hover:bg-primary hover:text-white focus:outline-none">
      Add Abx TestMethod
    </button> -->
    <hr>

    <div class="overflow-x-auto mt-4">
      <div
          class="align-middle inline-block min-w-full shadow overflow-hidden bg-white shadow-dashboard px-2 pt-1 rounded-bl-lg rounded-br-lg">
        <table class="min-w-full">
          <thead>
          <tr>
            <th class="px-1 py-1 border-b-2 border-border text-left text-sm leading-4 text-gray-800 tracking-wider">
              Name
            </th>
            <th class="px-1 py-1 border-b-2 border-border text-left text-sm leading-4 text-gray-800 tracking-wider">
              Description
            </th>
            <th class="px-1 py-1 border-b-2 border-border"></th>
          </tr>
          </thead>
          <tbody class="bg-white">
          <tr v-for="testmeth in abxTestMethods" :key="testmeth?.uid">
            <td class="px-1 py-1 whitespace-no-wrap border-b border-gray-500">
              <div class="flex items-center">
                <div class="text-sm leading-5 text-gray-800">{{ testmeth?.name }}</div>
              </div>
            </td>
            <td class="px-1 py-1 whitespace-no-wrap border-b border-gray-500">
              <div class="text-sm leading-5 text-primary">{{ testmeth?.description }}</div>
            </td>
            <td class="px-1 py-1 whitespace-no-wrap text-right border-b border-gray-500 text-sm leading-5">
              <!-- <button @click="FormManager(false, testmeth)"
                      class="px-2 py-1 mr-2 border-primary border text-primary rounded-sm transition duration-300 hover:bg-primary hover:text-white focus:outline-none">
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
            class="-mb-4 w-full border border-primary bg-primary text-white rounded-sm px-4 py-2 m-2 transition-colors duration-500 ease select-none hover:bg-primary focus:outline-none focus:shadow-outline"
        >
          Save Abx TestMethod
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
