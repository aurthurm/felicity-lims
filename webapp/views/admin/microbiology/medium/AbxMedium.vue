<script setup lang="ts">
import {defineAsyncComponent, onMounted, reactive, ref} from 'vue';

import useApiUtil from '@/composables/api_util';
import {IAbxMedium} from "@/models/microbiology";
import {
  AddAbxMediumDocument,
  AddAbxMediumMutation,
  AddAbxMediumMutationVariables,
  EditAbxMediumDocument,
  EditAbxMediumMutation,
  EditAbxMediumMutationVariables
} from "@/graphql/operations/microbiology.mutations";
import { GetAbxMediumAllQuery, GetAbxMediumAllQueryVariables, GetAbxMediumAllDocument } from '@/graphql/operations/microbiology.queries';


const modal = defineAsyncComponent(
    () => import("@/components/ui/FelModal.vue")
)

const {withClientMutation, withClientQuery} = useApiUtil()

let showModal = ref<boolean>(false);
let formTitle = ref<string>('');
let form = reactive({}) as IAbxMedium;
const formAction = ref<boolean>(true);

const abxMediums = ref<IAbxMedium[]>([]);

onMounted(() => {
  withClientQuery<GetAbxMediumAllQuery, GetAbxMediumAllQueryVariables>(
      GetAbxMediumAllDocument, {}, "abxMediumAll"
  ).then((result) => {
    if (result) {
      abxMediums.value = result as IAbxMedium[]
    }
  })
})

function FormManager(create: boolean, obj = {} as IAbxMedium): void {
  formAction.value = create;
  showModal.value = true;
  formTitle.value = (create ? 'Create' : 'Edit') + ' ' + "Abx Medium";
  if (create) {
    Object.assign(form, {} as IAbxMedium);
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
    withClientMutation<AddAbxMediumMutation, AddAbxMediumMutationVariables>(
        AddAbxMediumDocument, {payload}, "createAbxMedium"
    ).then((result) => {
      if (result) {
        abxMediums.value.unshift(result as IAbxMedium);
      }
    });
  }

  if (formAction.value === false) {
    withClientMutation<EditAbxMediumMutation, EditAbxMediumMutationVariables>(EditAbxMediumDocument, {
      uid: form.uid!,
      payload
    }, "updateAbxMedium")
        .then((result) => {
          if (result) {
            const idx = abxMediums.value.findIndex(item => item.uid == result.uid);
            if (idx > -1) {
              abxMediums.value = [
                ...abxMediums.value.map((item, index) => index === idx ? result : item),
              ] as IAbxMedium[];
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
      Add Abx Medium
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
              Description
            </th>
            <th class="px-1 py-1 border-b-2 border-border"></th>
          </tr>
          </thead>
          <tbody class="bg-background">
          <tr v-for="medium in abxMediums" :key="medium?.uid">
            <td class="px-1 py-1 whitespace-no-wrap border-b border-border">
              <div class="flex items-center">
                <div class="text-sm leading-5 text-foreground">{{ medium?.name }}</div>
              </div>
            </td>
            <td class="px-1 py-1 whitespace-no-wrap border-b border-border">
              <div class="text-sm leading-5 text-primary">{{ medium?.description }}</div>
            </td>
            <td class="px-1 py-1 whitespace-no-wrap text-right border-b border-border text-sm leading-5">
              <!-- <button @click="FormManager(false, medium)"
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
            <span class="text-foreground">Name</span>
            <input
                class="form-input mt-1 block w-full"
                v-model="form.name"
                placeholder="Name ..."
            />
          </label>
          <label class="block col-span-1 mb-2">
            <span class="text-foreground">Description</span>
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
            class="-mb-4 w-full border border-primary bg-primary text-primary-foreground rounded-sm px-4 py-2 m-2 transition-colors duration-500 ease select-none hover:bg-primary focus:outline-none focus:shadow-outline"
        >
          Save Abx Medium
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
