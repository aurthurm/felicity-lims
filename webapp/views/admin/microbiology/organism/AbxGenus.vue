<script setup lang="ts">
import {defineAsyncComponent, onMounted, reactive, ref} from 'vue';

import useApiUtil from '@/composables/api_util';
import { IAbxFamily, IAbxGenus } from "@/models/microbiology";
import {
  AddAbxGenusDocument,
  AddAbxGenusMutation,
  AddAbxGenusMutationVariables,
  EditAbxGenusDocument,
  EditAbxGenusMutation,
  EditAbxGenusMutationVariables
} from "@/graphql/operations/microbiology.mutations";
import {
  GetAbxFamilyAllDocument,
  GetAbxFamilyAllQuery,
  GetAbxFamilyAllQueryVariables,
  GetAbxGenusAllDocument,
  GetAbxGenusAllQuery,
  GetAbxGenusAllQueryVariables
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
let form = reactive({}) as IAbxGenus;
const formAction = ref<boolean>(true);

const abxGenuss = ref<IAbxGenus[]>([]);
const abxFamilys = ref<IAbxFamily[]>([]);

onMounted(() => {
  withClientQuery<GetAbxGenusAllQuery, GetAbxGenusAllQueryVariables>(
      GetAbxGenusAllDocument, {}, "abxGenusAll"
  ).then((result) => {
    if (result) {
      abxGenuss.value = result as IAbxGenus[]
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

function FormManager(create: boolean, obj = {} as IAbxGenus): void {
  formAction.value = create;
  showModal.value = true;
  formTitle.value = (create ? 'Create' : 'Edit') + ' ' + "Genus";
  if (create) {
    Object.assign(form, {} as IAbxGenus);
  } else {
    Object.assign(form, {...obj});
  }
}

function saveForm(): void {
  const payload = {
    name: form.name,
    familyUid: form.family?.uid
  }

  if (formAction.value === true) {
    withClientMutation<AddAbxGenusMutation, AddAbxGenusMutationVariables>(
        AddAbxGenusDocument, {payload}, "createAbxGenus"
    ).then((result) => {
      if (result) {
        abxGenuss.value.unshift(result as IAbxGenus);
      }
    });
  }

  if (formAction.value === false) {
    withClientMutation<EditAbxGenusMutation, EditAbxGenusMutationVariables>(EditAbxGenusDocument, {
      uid: form.uid!,
      payload
    }, "updateAbxGenus")
        .then((result) => {
          if (result) {
            const idx = abxGenuss.value.findIndex(item => item.uid == result.uid);
            if (idx > -1) {
              abxGenuss.value = [
                ...abxGenuss.value.map((item, index) => index === idx ? result : item),
              ] as IAbxGenus[];
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
      Add Genus
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
              Family
            </th>
            <th class="px-1 py-1 border-b-2 border-border"></th>
          </tr>
          </thead>
          <tbody class="bg-background">
          <tr v-for="guideline in abxGenuss" :key="guideline?.uid">
            <td class="px-1 py-1 whitespace-no-wrap border-b border-border">
              <div class="flex items-center">
                <div class="text-sm leading-5 text-foreground">{{ guideline?.name }}</div>
              </div>
            </td>   <td class="px-1 py-1 whitespace-no-wrap border-b border-border">
              <div class="flex items-center">
                <div class="text-sm leading-5 text-foreground">{{ guideline?.family?.name }}</div>
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
              <span class="text-foreground">Family</span>
              <VueMultiselect
              v-model="form.family"
              :options="abxFamilys"
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
          Save Genus
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
