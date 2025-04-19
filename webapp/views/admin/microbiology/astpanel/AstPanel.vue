<script setup lang="ts">
import { defineAsyncComponent, onMounted, reactive, ref } from 'vue';
import useApiUtil from '@/composables/api_util';
import { IAbxAntibiotic, IAbxASTPanel, IAbxOrganism } from "@/models/microbiology";
import {
  AddAbxAstPanelDocument,
  AddAbxAstPanelMutation,
  AddAbxAstPanelMutationVariables,
  EditAbxAstPanelDocument,
  EditAbxAstPanelMutation,
  EditAbxAstPanelMutationVariables
} from "@/graphql/operations/microbiology.mutations";
import {
  GetAbxAstPanelAllDocument,
  GetAbxAstPanelAllQuery,
  GetAbxAstPanelAllQueryVariables,
  GetAbxLaboratoryAntibioticsDocument,
  GetAbxLaboratoryAntibioticsQuery,
  GetAbxLaboratoryAntibioticsQueryVariables,
  GetAbxOrganismAllDocument,
  GetAbxOrganismAllQuery,
  GetAbxOrganismAllQueryVariables,
} from "@/graphql/operations/microbiology.queries";
import { addListsUnique } from '@/utils/helpers';
import { AbxOrganismCursorPage } from '@/graphql/schema';

const modal = defineAsyncComponent(
    () => import("@/components/ui/FelModal.vue")
)

const { withClientMutation, withClientQuery } = useApiUtil()

const showModal = ref<boolean>(false);
const formTitle = ref<string>('');
const formAction = ref<boolean>(true);
const searchOrgText = ref<string>('');
const searchAbxText = ref<string>('');

const panels = ref<IAbxASTPanel[]>([]);
const antibiotics = ref<IAbxAntibiotic[]>([]);
const filteredAntibiotics = ref<IAbxAntibiotic[]>([]);
const organisms = ref<IAbxOrganism[]>([]);
const filteredOrganisms = ref<IAbxOrganism[]>([]);

const form = reactive({
  uid: '',
  name: '',
  description: '',
  selectedAntibiotics: [] as string[],
  selectedOrganisms: [] as string[]
});

// Fetch initial data
onMounted(() => {
  fetchAntibiotics();
  fetchOrganisms();
  fetchPanels();
});

// Fetch functions
function fetchAntibiotics() {
  withClientQuery<GetAbxLaboratoryAntibioticsQuery, GetAbxLaboratoryAntibioticsQueryVariables>(
    GetAbxLaboratoryAntibioticsDocument, {}, "abxLaboratoryAntibiotics"
  ).then((result) => {
    if (result) {
      antibiotics.value = result as IAbxAntibiotic[];
      filteredAntibiotics.value = [...antibiotics.value];
    }
  });
}

function fetchOrganisms() {
  withClientQuery<GetAbxOrganismAllQuery, GetAbxOrganismAllQueryVariables>(
      GetAbxOrganismAllDocument, {
        text: searchOrgText.value,
        pageSize: 25,
        sortBy: ["name"],
      }, "abxOrganismAll"
  ).then((result) => {
    // The organism list can be big, so we need to handle keeping selecteds on each search before replacement
    organisms.value = organisms.value?.filter(org => form.selectedOrganisms.includes(org.uid)) || [];
    organisms.value = addListsUnique(organisms.value, (result as AbxOrganismCursorPage)?.items as IAbxOrganism[], "uid");
    filteredOrganisms.value = [...organisms.value];
  })
}

function fetchPanels() {
  withClientQuery<GetAbxAstPanelAllQuery, GetAbxAstPanelAllQueryVariables>(
    GetAbxAstPanelAllDocument, {}, "abxAstPanelAll"
  ).then((result) => {
    if (result) {
      panels.value = result as IAbxASTPanel[];
      panels.value.forEach(panel => panel.organisms?.forEach(org => organisms.value.push(org)));
    }
  });
}

// Form management
function FormManager(create: boolean, panel = {} as IAbxASTPanel): void {
  formAction.value = create;
  showModal.value = true;
  formTitle.value = (create ? 'Create' : 'Edit') + ' AST Panel';
  
  if (create) {
    form.uid = '';
    form.name = '';
    form.description = '';
    form.selectedAntibiotics = [];
    form.selectedOrganisms = [];
  } else {
    form.uid = panel.uid;
    form.name = panel.name;
    form.description = panel.description!;
    form.selectedAntibiotics = panel.antibiotics?.map(a => a.uid) || [];
    form.selectedOrganisms = panel.organisms?.map(o => o.uid) || [];
  }
}

function saveForm(): void {
  const payload = {
    name: form.name,
    description: form.description,
    antibiotics: form.selectedAntibiotics,
    organisms: form.selectedOrganisms
  };

  if (formAction.value) {
    withClientMutation<AddAbxAstPanelMutation, AddAbxAstPanelMutationVariables>(
      AddAbxAstPanelDocument, { payload }, "createAbxAstPanel"
    ).then((result) => {
      if (result) {
        panels.value.unshift(result as IAbxASTPanel);
      }
    });
  } else {
    withClientMutation<EditAbxAstPanelMutation, EditAbxAstPanelMutationVariables>(
      EditAbxAstPanelDocument, {
        uid: form.uid,
        payload
      }, "updateAbxAstPanel"
    ).then((result) => {
      if (result) {
        const idx = panels.value.findIndex(item => item.uid === result.uid);
        if (idx > -1) {
          panels.value = [
            ...panels.value.map((item, index) => index === idx ? result : item),
          ] as IAbxASTPanel[];
        }
      }
    });
  }

  showModal.value = false;
}

// Filter functions
function filterAntibiotics() {
  if (!searchAbxText.value) {
    filteredAntibiotics.value = [...antibiotics.value];
    return;
  }
  filteredAntibiotics.value = antibiotics.value.filter(abx => 
    abx.name.toLowerCase().includes(searchAbxText.value.toLowerCase())
  );
}

function filterOrganisms() {
  if (!searchOrgText.value) {
    filteredOrganisms.value = [...organisms.value];
    return;
  }
  fetchOrganisms()
}
</script>

<template>
  <div class="w-full my-4">
    <div class="flex justify-between items-center mb-4">
      <h2 class="text-xl font-semibold">AST Panels</h2>
      <button @click="FormManager(true)"
              class="px-4 py-2 border-primary border text-primary rounded-sm transition duration-300 hover:bg-primary hover:text-primary-foreground focus:outline-none">
        Add Panel
      </button>
    </div>
    <hr>

    <div class="overflow-x-auto mt-4">
      <div class="align-middle inline-block min-w-full shadow overflow-hidden bg-background shadow-dashboard px-2 pt-1 rounded-bl-lg rounded-br-lg">
        <table class="min-w-full">
          <thead>
            <tr>
              <th class="px-1 py-1 border-b-2 border-border text-left text-sm leading-4 text-foreground tracking-wider">Name</th>
              <th class="px-1 py-1 border-b-2 border-border text-left text-sm leading-4 text-foreground tracking-wider">Description</th>
              <th class="px-1 py-1 border-b-2 border-border text-left text-sm leading-4 text-foreground tracking-wider">Organisms</th>
              <th class="px-1 py-1 border-b-2 border-border text-left text-sm leading-4 text-foreground tracking-wider">Antibiotics</th>
              <th class="px-1 py-1 border-b-2 border-border"></th>
            </tr>
          </thead>
          <tbody class="bg-background">
            <tr v-for="panel in panels" :key="panel?.uid">
              <td class="px-1 py-1 whitespace-no-wrap border-b border-border">
                <div class="text-sm leading-5 text-foreground">{{ panel?.name }}</div>
              </td>
              <td class="px-1 py-1 whitespace-no-wrap border-b border-border">
                <div class="text-sm leading-5 text-primary">{{ panel?.description }}</div>
              </td>
              <td class="px-1 py-1 whitespace-no-wrap border-b border-border">
                <div class="text-sm leading-5 text-primary">
                  {{ panel?.organisms?.map(org => org.name).join(', ') }}
                </div>
              </td>
              <td class="px-1 py-1 whitespace-no-wrap border-b border-border">
                <div class="text-sm leading-5 text-primary">
                  {{ panel?.antibiotics?.map(abx => abx.name).join(', ') }}
                </div>
              </td>
              <td class="px-1 py-1 whitespace-no-wrap text-right border-b border-border text-sm leading-5">
                <button @click="FormManager(false, panel)"
                        class="px-2 py-1 border-primary border text-primary rounded-sm transition duration-300 hover:bg-primary hover:text-primary-foreground focus:outline-none">
                  Edit
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>

  <!-- Panel Form Modal -->
  <modal v-if="showModal" @close="showModal = false" :contentWidth="'w-1/2'">
    <template v-slot:header>
      <h3>{{ formTitle }}</h3>
    </template>

    <template v-slot:body>
      <form @submit.prevent="saveForm" class="p-4">
        <div class="space-y-4">
          <div class="grid grid-cols-1 gap-4">
            <label class="block">
              <span class="text-foreground">Panel Name</span>
              <input
                  v-model="form.name"
                  class="form-input mt-1 block w-full"
                  placeholder="Enter panel name"
              />
            </label>
            <label class="block">
              <span class="text-foreground">Description</span>
              <textarea
                  v-model="form.description"
                  rows="2"
                  class="form-input mt-1 block w-full"
                  placeholder="Enter description"
              ></textarea>
            </label>
          </div>

          <!-- Organisms Selection with Selected List -->
          <div class="flex gap-4">
            <div class="w-2/3 space-y-2">
              <label class="block">
                <span class="text-foreground">Search Organisms</span>
                <input
                    v-model="searchOrgText"
                    @input="filterOrganisms"
                    class="form-input mt-1 block w-full"
                    placeholder="Search organisms..."
                />
              </label>
              <div class="border p-2 h-64 overflow-y-auto">
                <div v-for="org in filteredOrganisms" :key="org.uid" class="flex items-center py-1">
                  <input
                      type="checkbox"
                      :value="org.uid"
                      v-model="form.selectedOrganisms"
                      class="form-checkbox"
                  />
                  <span class="ml-2">{{ org.name }}</span>
                </div>
              </div>
            </div>
            
            <!-- Selected Organisms List -->
            <div class="w-1/3">
              <div class="text-foreground mb-1">Selected Organisms</div>
              <div class="border p-2 h-72 overflow-y-auto bg-background">
                <div v-for="orgUid in form.selectedOrganisms" 
                     :key="orgUid" 
                     class="flex items-center justify-between py-1 px-2 mb-1 bg-background rounded shadow-sm">
                  <span class="text-sm">
                    {{ organisms?.find(o => o.uid === orgUid)?.name }}
                  </span>
                  <button 
                    @click="form.selectedOrganisms = form.selectedOrganisms.filter(id => id !== orgUid)"
                    class="text-destructive hover:text-destructive text-sm"
                  >
                    ×
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Antibiotics Selection with Selected List -->
          <div class="flex gap-4">
            <div class="w-2/3 space-y-2">
              <label class="block">
                <span class="text-foreground">Search Antibiotics</span>
                <input
                    v-model="searchAbxText"
                    @input="filterAntibiotics"
                    class="form-input mt-1 block w-full"
                    placeholder="Search antibiotics..."
                />
              </label>
              <div class="border p-2 h-64 overflow-y-auto">
                <div v-for="abx in filteredAntibiotics" :key="abx.uid" class="flex items-center py-1">
                  <input
                      type="checkbox"
                      :value="abx.uid"
                      v-model="form.selectedAntibiotics"
                      class="form-checkbox"
                  />
                  <span class="ml-2">{{ abx.name }}</span>
                </div>
              </div>
            </div>
            
            <!-- Selected Antibiotics List -->
            <div class="w-1/3">
              <div class="text-foreground mb-1">Selected Antibiotics</div>
              <div class="border p-2 h-72 overflow-y-auto bg-background">
                <div v-for="abxUid in form.selectedAntibiotics" 
                     :key="abxUid" 
                     class="flex items-center justify-between py-1 px-2 mb-1 bg-background rounded shadow-sm">
                  <span class="text-sm">
                    {{ antibiotics.find(a => a.uid == abxUid)?.name }}
                  </span>
                  <button 
                    @click="form.selectedAntibiotics = form.selectedAntibiotics.filter(id => id !== abxUid)"
                    class="text-destructive hover:text-destructive text-sm"
                  >
                    ×
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="mt-6">
          <button
              type="submit"
              class="w-full bg-primary text-primary-foreground rounded-sm px-4 py-2 transition-colors duration-300 hover:bg-primary focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2"
          >
            Save Panel
          </button>
        </div>
      </form>
    </template>
  </modal>
</template>

<style scoped>
.form-checkbox {
  @apply rounded border-border text-primary shadow-sm focus:border-sky-300 focus:ring focus:ring-offset-0 focus:ring-sky-200 focus:ring-opacity-50;
}

.form-input {
  @apply mt-1 block w-full rounded-md border-border shadow-sm focus:border-sky-300 focus:ring focus:ring-sky-200 focus:ring-opacity-50;
}
</style>