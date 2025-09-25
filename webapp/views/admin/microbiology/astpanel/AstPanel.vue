<script setup lang="ts">
import { defineAsyncComponent, onMounted, reactive, ref } from 'vue';
import useApiUtil from '@/composables/api_util';
import { AbxAntibioticType, AbxASTPanelType, AbxOrganismType } from "@/types/gql";
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
import { addListsUnique } from '@/utils';
import { AbxOrganismCursorPage } from '@/graphql/schema';

const { withClientMutation, withClientQuery } = useApiUtil()

const showModal = ref<boolean>(false);
const formTitle = ref<string>('');
const formAction = ref<boolean>(true);
const searchOrgText = ref<string>('');
const searchAbxText = ref<string>('');

const panels = ref<AbxASTPanelType[]>([]);
const antibiotics = ref<AbxAntibioticType[]>([]);
const filteredAntibiotics = ref<AbxAntibioticType[]>([]);
const organisms = ref<AbxOrganismType[]>([]);
const filteredOrganisms = ref<AbxOrganismType[]>([]);

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
      antibiotics.value = result as AbxAntibioticType[];
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
    organisms.value = addListsUnique(organisms.value, (result as AbxOrganismCursorPage)?.items as AbxOrganismType[], "uid");
    filteredOrganisms.value = [...organisms.value];
  })
}

function fetchPanels() {
  withClientQuery<GetAbxAstPanelAllQuery, GetAbxAstPanelAllQueryVariables>(
    GetAbxAstPanelAllDocument, {}, "abxAstPanelAll"
  ).then((result) => {
    if (result) {
      panels.value = result as AbxASTPanelType[];
      panels.value.forEach(panel => panel.organisms?.forEach(org => organisms.value.push(org)));
    }
  });
}

// Form management
function FormManager(create: boolean, panel = {} as AbxASTPanelType): void {
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
        panels.value.unshift(result as AbxASTPanelType);
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
          ] as AbxASTPanelType[];
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
  <fel-heading title="AST Panels">
    <fel-button @click="FormManager(true)">Add Panel</fel-button>      
  </fel-heading>

  <div class="overflow-x-auto">
    <div class="align-middle inline-block min-w-full shadow overflow-hidden bg-background shadow-dashboard rounded-lg">
      <table class="min-w-full divide-y divide-border">
        <thead>
          <tr>
            <th class="px-3 py-3.5 text-left text-sm font-semibold text-foreground">Name</th>
            <th class="px-3 py-3.5 text-left text-sm font-semibold text-foreground">Description</th>
            <th class="px-3 py-3.5 text-left text-sm font-semibold text-foreground">Organisms</th>
            <th class="px-3 py-3.5 text-left text-sm font-semibold text-foreground">Antibiotics</th>
            <th class="px-3 py-3.5"></th>
          </tr>
        </thead>
        <tbody class="bg-background divide-y divide-border">
          <tr v-for="panel in panels" :key="panel?.uid">
            <td class="px-3 py-3.5 whitespace-nowrap text-sm text-foreground">{{ panel?.name }}</td>
            <td class="px-3 py-3.5 whitespace-nowrap text-sm text-foreground">{{ panel?.description }}</td>
            <td class="px-3 py-3.5 whitespace-nowrap text-sm text-foreground">
              {{ panel?.organisms?.map(org => org.name).join(', ') }}
            </td>
            <td class="px-3 py-3.5 whitespace-nowrap text-sm text-foreground">
              {{ panel?.antibiotics?.map(abx => abx.name).join(', ') }}
            </td>
            <td class="px-3 py-3.5 whitespace-nowrap text-right text-sm">
              <button @click="FormManager(false, panel)"
                      class="px-3 py-1.5 bg-primary text-primary-foreground rounded-sm transition duration-300 hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2">
                Edit
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>

  <!-- Panel Form Modal -->
  <fel-modal v-if="showModal" @close="showModal = false" :contentWidth="'w-1/2'">
    <template v-slot:header>
      <h3 class="text-xl font-semibold text-foreground">{{ formTitle }}</h3>
    </template>

    <template v-slot:body>
      <form @submit.prevent="saveForm" class="space-y-6 p-4">
        <div class="space-y-4">
          <div class="grid grid-cols-1 gap-4">
            <label class="block">
              <span class="text-sm font-medium text-foreground">Panel Name</span>
              <input
                  v-model="form.name"
                  class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  placeholder="Enter panel name"
              />
            </label>
            <label class="block">
              <span class="text-sm font-medium text-foreground">Description</span>
              <textarea
                  v-model="form.description"
                  rows="2"
                  class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  placeholder="Enter description"
              ></textarea>
            </label>
          </div>

          <!-- Organisms Selection with Selected List -->
          <div class="flex gap-4">
            <div class="w-2/3 space-y-2">
              <label class="block">
                <span class="text-sm font-medium text-foreground">Search Organisms</span>
                <input
                    v-model="searchOrgText"
                    @input="filterOrganisms"
                    class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    placeholder="Search organisms..."
                />
              </label>
              <div class="border border-border rounded-md p-2 h-64 overflow-y-auto">
                <div v-for="org in filteredOrganisms" :key="org.uid" class="flex items-center py-1">
                  <input
                      type="checkbox"
                      :value="org.uid"
                      v-model="form.selectedOrganisms"
                      class="rounded border-border text-primary shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
                  />
                  <span class="ml-2 text-sm text-foreground">{{ org.name }}</span>
                </div>
              </div>
            </div>
            
            <!-- Selected Organisms List -->
            <div class="w-1/3">
              <div class="text-sm font-medium text-foreground mb-1">Selected Organisms</div>
              <div class="border border-border rounded-md p-2 h-72 overflow-y-auto bg-background">
                <div v-for="orgUid in form.selectedOrganisms" 
                     :key="orgUid" 
                     class="flex items-center justify-between py-1 px-2 mb-1 bg-background rounded-md shadow-sm">
                  <span class="text-sm text-foreground">
                    {{ organisms?.find(o => o.uid === orgUid)?.name }}
                  </span>
                  <button 
                    @click="form.selectedOrganisms = form.selectedOrganisms.filter(id => id !== orgUid)"
                    class="text-destructive hover:text-destructive/80 text-sm"
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
                <span class="text-sm font-medium text-foreground">Search Antibiotics</span>
                <input
                    v-model="searchAbxText"
                    @input="filterAntibiotics"
                    class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    placeholder="Search antibiotics..."
                />
              </label>
              <div class="border border-border rounded-md p-2 h-64 overflow-y-auto">
                <div v-for="abx in filteredAntibiotics" :key="abx.uid" class="flex items-center py-1">
                  <input
                      type="checkbox"
                      :value="abx.uid"
                      v-model="form.selectedAntibiotics"
                      class="rounded border-border text-primary shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
                  />
                  <span class="ml-2 text-sm text-foreground">{{ abx.name }}</span>
                </div>
              </div>
            </div>
            
            <!-- Selected Antibiotics List -->
            <div class="w-1/3">
              <div class="text-sm font-medium text-foreground mb-1">Selected Antibiotics</div>
              <div class="border border-border rounded-md p-2 h-72 overflow-y-auto bg-background">
                <div v-for="abxUid in form.selectedAntibiotics" 
                     :key="abxUid" 
                     class="flex items-center justify-between py-1 px-2 mb-1 bg-background rounded-md shadow-sm">
                  <span class="text-sm text-foreground">
                    {{ antibiotics.find(a => a.uid == abxUid)?.name }}
                  </span>
                  <button 
                    @click="form.selectedAntibiotics = form.selectedAntibiotics.filter(id => id !== abxUid)"
                    class="text-destructive hover:text-destructive/80 text-sm"
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
              class="w-full bg-primary text-primary-foreground rounded-sm px-4 py-2 transition-colors duration-300 hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          >
            Save Panel
          </button>
        </div>
      </form>
    </template>
  </fel-modal>
</template>

<style scoped>
/* Remove the form-checkbox and form-input classes as they are now directly applied in the template */
</style>