<script setup lang="ts">
import {defineAsyncComponent, onMounted, reactive, ref} from 'vue';

import useApiUtil from '@/composables/api_util';
import { IAbxKingdom } from "@/models/microbiology";
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

const modal = defineAsyncComponent(
    () => import("@/components/ui/FelModal.vue")
)

const {withClientMutation, withClientQuery} = useApiUtil()

let showModal = ref<boolean>(false);
let formTitle = ref<string>('');
let form = reactive({}) as IAbxKingdom;
const formAction = ref<boolean>(true);

const abxKingdoms = ref<IAbxKingdom[]>([]);

onMounted(() => {
  withClientQuery<GetAbxKingdomAllQuery, GetAbxKingdomAllQueryVariables>(
      GetAbxKingdomAllDocument, {}, "abxKingdomAll"
  ).then((result) => {
    if (result) {
      abxKingdoms.value = result as IAbxKingdom[]
    }
  })
})

function FormManager(create: boolean, obj = {} as IAbxKingdom): void {
  formAction.value = create;
  showModal.value = true;
  formTitle.value = (create ? 'Create' : 'Edit') + ' ' + "kingdom";
  if (create) {
    Object.assign(form, {} as IAbxKingdom);
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
        abxKingdoms.value.unshift(result as IAbxKingdom);
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
              ] as IAbxKingdom[];
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
      Add kingdom
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
            <th class="px-1 py-1 border-b-2 border-border"></th>
          </tr>
          </thead>
          <tbody class="bg-white">
          <tr v-for="guideline in abxKingdoms" :key="guideline?.uid">
            <td class="px-1 py-1 whitespace-no-wrap border-b border-gray-500">
              <div class="flex items-center">
                <div class="text-sm leading-5 text-gray-800">{{ guideline?.name }}</div>
              </div>
            </td>
            <td class="px-1 py-1 whitespace-no-wrap text-right border-b border-gray-500 text-sm leading-5">
              <!-- <button @click="FormManager(false, guideline)"
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
            <span class="text-gray-700">Kindom Name</span>
            <input
                class="form-input mt-1 block w-full"
                v-model="form.name"
                placeholder="Name ..."
            />
          </label>
        </div>
        <hr/>
        <button
            type="button"
            @click.prevent="saveForm()"
            class="-mb-4 w-full border border-primary bg-primary text-white rounded-sm px-4 py-2 m-2 transition-colors duration-500 ease select-none hover:bg-primary focus:outline-none focus:shadow-outline"
        >
          Save kingdom
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
