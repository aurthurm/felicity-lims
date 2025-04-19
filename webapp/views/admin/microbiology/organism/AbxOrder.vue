<script setup lang="ts">
import {defineAsyncComponent, onMounted, reactive, ref} from 'vue';

import useApiUtil from '@/composables/api_util';
import { IAbxClass, IAbxOrder } from "@/models/microbiology";
import {
  AddAbxOrderDocument,
  AddAbxOrderMutation,
  AddAbxOrderMutationVariables,
  EditAbxOrderDocument,
  EditAbxOrderMutation,
  EditAbxOrderMutationVariables
} from "@/graphql/operations/microbiology.mutations";
import {
  GetAbxClassAllDocument,
  GetAbxClassAllQuery,
  GetAbxClassAllQueryVariables,
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
let form = reactive({}) as IAbxOrder;
const formAction = ref<boolean>(true);

const abxClasses = ref<IAbxClass[]>([]);
const abxOrders = ref<IAbxOrder[]>([]);

onMounted(() => {
  withClientQuery<GetAbxOrderAllQuery, GetAbxOrderAllQueryVariables>(
      GetAbxOrderAllDocument, {}, "abxOrderAll"
  ).then((result) => {
    if (result) {
      abxOrders.value = result as IAbxOrder[]
    }
  })
  withClientQuery<GetAbxClassAllQuery, GetAbxClassAllQueryVariables>(
      GetAbxClassAllDocument, {}, "abxClassAll"
  ).then((result) => {
    if (result) {
      abxClasses.value = result as IAbxClass[]
    }
  })
})

function FormManager(create: boolean, obj = {} as IAbxOrder): void {
  formAction.value = create;
  showModal.value = true;
  formTitle.value = (create ? 'Create' : 'Edit') + ' ' + "Order";
  if (create) {
    Object.assign(form, {} as IAbxOrder);
  } else {
    Object.assign(form, {...obj});
  }
}

function saveForm(): void {
  const payload = {
    name: form.name,
    classUid: form.class_?.uid
  }

  if (formAction.value === true) {
    withClientMutation<AddAbxOrderMutation, AddAbxOrderMutationVariables>(
        AddAbxOrderDocument, {payload}, "createAbxOrder"
    ).then((result) => {
      if (result) {
        abxOrders.value.unshift(result as IAbxOrder);
      }
    });
  }

  if (formAction.value === false) {
    withClientMutation<EditAbxOrderMutation, EditAbxOrderMutationVariables>(EditAbxOrderDocument, {
      uid: form.uid!,
      payload
    }, "updateAbxOrder")
        .then((result) => {
          if (result) {
            const idx = abxOrders.value.findIndex(item => item.uid == result.uid);
            if (idx > -1) {
              abxOrders.value = [
                ...abxOrders.value.map((item, index) => index === idx ? result : item),
              ] as IAbxOrder[];
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
            class="px-2 py-1 border-primary border text-primary rounded-sm transition duration-300 hover:bg-primary hover:text-primary-foreground focus:outline-none">
      Add Order
    </button> -->
    <hr>

    <div class="overflow-x-auto mt-4">
      <div
          class="align-middle inline-block min-w-full shadow overflow-hidden bg-background shadow-dashboard px-2 pt-1 rounded-bl-lg rounded-br-lg">
        <table class="min-w-full">
          <thead>
          <tr>
            <th class="px-1 py-1 border-b-2 border-border text-left text-sm leading-4 text-foreground tracking-wider">
              Name
            </th>
            <th class="px-1 py-1 border-b-2 border-border text-left text-sm leading-4 text-foreground tracking-wider">
              Class
            </th>
            <th class="px-1 py-1 border-b-2 border-border"></th>
          </tr>
          </thead>
          <tbody class="bg-background">
          <tr v-for="guideline in abxOrders" :key="guideline?.uid">
            <td class="px-1 py-1 whitespace-no-wrap border-b border-border">
              <div class="flex items-center">
                <div class="text-sm leading-5 text-foreground">{{ guideline?.name }}</div>
              </div>
            </td>   <td class="px-1 py-1 whitespace-no-wrap border-b border-border">
              <div class="flex items-center">
                <div class="text-sm leading-5 text-foreground">{{ guideline?.class_?.name }}</div>
              </div>
            </td>
            <td class="px-1 py-1 whitespace-no-wrap text-right border-b border-border text-sm leading-5">
              <!-- <button @click="FormManager(false, guideline)"
                      class="px-2 py-1 mr-2 border-primary border text-primary rounded-sm transition duration-300 hover:bg-primary hover:text-primary-foreground focus:outline-none">
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
            <span class="text-foreground">Kindom Name</span>
            <input
                class="form-input mt-1 block w-full"
                v-model="form.name"
                placeholder="Name ..."
            />
          </label>
          <label class="block">
              <span class="text-foreground">Class</span>
              <VueMultiselect
              v-model="form.class_"
              :options="abxClasses"
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
            class="-mb-4 w-full border border-primary bg-primary text-primary-foreground rounded-sm px-4 py-2 m-2 transition-colors duration-500 ease select-none hover:bg-primary focus:outline-none focus:shadow-outline"
        >
          Save Order
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
