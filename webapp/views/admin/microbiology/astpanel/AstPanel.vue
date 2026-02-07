<script setup lang="ts">
import { Button } from "@/components/ui/button";
import { defineAsyncComponent, onMounted, ref } from 'vue';
import { useForm, useField } from 'vee-validate';
import * as yup from 'yup';
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
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyTitle } from "@/components/ui/empty";
import PageHeading from "@/components/common/PageHeading.vue"
const { withClientMutation, withClientQuery } = useApiUtil()

const showModal = ref<boolean>(false);
const formTitle = ref<string>('');
const formAction = ref<boolean>(true);
const currentUid = ref<string | null>(null);
const searchOrgText = ref<string>('');
const searchAbxText = ref<string>('');

const panels = ref<AbxASTPanelType[]>([]);
const antibiotics = ref<AbxAntibioticType[]>([]);
const filteredAntibiotics = ref<AbxAntibioticType[]>([]);
const organisms = ref<AbxOrganismType[]>([]);
const filteredOrganisms = ref<AbxOrganismType[]>([]);

const astPanelSchema = yup.object({
  name: yup.string().trim().required('Panel name is required'),
  selectedAntibiotics: yup.array().of(yup.string().trim()).min(1, 'Select at least one antibiotic'),
  selectedOrganisms: yup.array().of(yup.string().trim()).min(1, 'Select at least one organism'),
});

const { handleSubmit, resetForm, setValues, errors } = useForm({
  validationSchema: astPanelSchema,
  initialValues: {
    name: '',
    description: '',
    selectedAntibiotics: [] as string[],
    selectedOrganisms: [] as string[],
  },
});
const { value: name } = useField<string>('name');
const { value: description } = useField<string>('description');
const { value: selectedAntibiotics } = useField<string[]>('selectedAntibiotics');
const { value: selectedOrganisms } = useField<string[]>('selectedOrganisms');

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
    organisms.value = organisms.value?.filter(org => selectedOrganisms.value.includes(org.uid)) || [];
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
    currentUid.value = null;
    resetForm();
  } else {
    currentUid.value = panel.uid ?? null;
    setValues({
      name: panel.name ?? '',
      description: panel.description ?? '',
      selectedAntibiotics: panel.antibiotics?.map(a => a.uid) || [],
      selectedOrganisms: panel.organisms?.map(o => o.uid) || [],
    });
  }
}

const saveForm = handleSubmit((formValues) => {
  const payload = {
    name: formValues.name,
    description: formValues.description,
    antibiotics: formValues.selectedAntibiotics,
    organisms: formValues.selectedOrganisms
  };

  if (formAction.value) {
    withClientMutation<AddAbxAstPanelMutation, AddAbxAstPanelMutationVariables>(
      AddAbxAstPanelDocument, { payload }, "createAbxAstPanel"
    ).then((result) => {
      if (result) {
        panels.value.unshift(result as AbxASTPanelType);
      }
    });
  } else if (currentUid.value) {
    withClientMutation<EditAbxAstPanelMutation, EditAbxAstPanelMutationVariables>(
      EditAbxAstPanelDocument, {
        uid: currentUid.value,
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
});

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
  <PageHeading title="AST Panels">
    <Button @click="FormManager(true)">Add Panel</Button>      
  </PageHeading>

  <div class="border border-border bg-card rounded-lg shadow-md">
    <div class="relative w-full overflow-auto">
      <Table class="w-full caption-bottom text-sm">
        <TableHeader class="[&_tr]:border-b">
          <TableRow class="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
            <TableHead class="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Name</TableHead>
            <TableHead class="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Description</TableHead>
            <TableHead class="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Organisms</TableHead>
            <TableHead class="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Antibiotics</TableHead>
            <TableHead class="h-12 px-4 text-right align-middle font-medium text-muted-foreground">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody class="[&_tr:last-child]:border-0">
          <TableRow v-for="panel in panels" :key="panel?.uid" class="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
            <TableCell class="px-4 py-3 align-middle whitespace-nowrap text-sm text-foreground">{{ panel?.name }}</TableCell>
            <TableCell class="px-4 py-3 align-middle whitespace-nowrap text-sm text-foreground">{{ panel?.description }}</TableCell>
            <TableCell class="px-4 py-3 align-middle whitespace-nowrap text-sm text-foreground">
              {{ panel?.organisms?.map(org => org.name).join(', ') }}
            </TableCell>
            <TableCell class="px-4 py-3 align-middle whitespace-nowrap text-sm text-foreground">
              {{ panel?.antibiotics?.map(abx => abx.name).join(', ') }}
            </TableCell>
            <TableCell class="px-4 py-3 align-middle text-right text-sm">
              <button @click="FormManager(false, panel)"
                      class="px-3 py-1.5 bg-primary text-primary-foreground rounded-sm transition duration-300 hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2">
                Edit
              </button>
            </TableCell>
          </TableRow>
          <TableEmpty v-if="!panels || panels.length === 0" :colspan="5">
            <Empty class="border-0 bg-transparent p-0">
              <EmptyContent>
                <EmptyHeader>
                  <EmptyTitle>No AST panels found</EmptyTitle>
                  <EmptyDescription>Add a panel to get started.</EmptyDescription>
                </EmptyHeader>
              </EmptyContent>
            </Empty>
          </TableEmpty>
        </TableBody>
      </Table>
    </div>
  </div>

  <!-- Panel Form Modal -->
  <Modal v-if="showModal" @close="showModal = false" contentWidth="max-w-4xl w-[90vw]">
    <template v-slot:header>
      <h3 class="text-xl font-semibold text-foreground">{{ formTitle }}</h3>
    </template>

    <template v-slot:body>
      <form @submit.prevent="saveForm" class="space-y-6 p-4">
        <div class="space-y-4 max-h-[70vh] overflow-y-auto">
          <div class="grid grid-cols-1 gap-4">
            <label class="block">
              <span class="text-sm font-medium text-foreground">Panel Name</span>
              <input
                  v-model="name"
                  class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  placeholder="Enter panel name"
              />
              <p v-if="errors.name" class="text-sm text-destructive">{{ errors.name }}</p>
            </label>
            <label class="block">
              <span class="text-sm font-medium text-foreground">Description</span>
              <textarea
                  v-model="description"
                  rows="2"
                  class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  placeholder="Enter description"
              ></textarea>
            </label>
          </div>

          <!-- Organisms Selection with Selected List -->
          <div class="flex flex-nowrap gap-4">
            <div class="min-w-0 flex-1 space-y-2">
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
                  <Checkbox
                      :checked="selectedOrganisms.includes(org.uid)"
                      @update:checked="(value) => {
                        selectedOrganisms = value
                          ? (selectedOrganisms.includes(org.uid) ? selectedOrganisms : [...selectedOrganisms, org.uid])
                          : selectedOrganisms.filter((uid) => uid !== org.uid);
                      }"
                  />
                  <span class="ml-2 text-sm text-foreground">{{ org.name }}</span>
                </div>
              </div>
              <p v-if="errors.selectedOrganisms" class="text-sm text-destructive">{{ errors.selectedOrganisms }}</p>
            </div>
            
            <!-- Selected Organisms List -->
            <div class="w-48 shrink-0">
              <div class="text-sm font-medium text-foreground mb-1">Selected Organisms</div>
              <div class="border border-border rounded-md p-2 h-64 overflow-y-auto bg-muted/30">
                <div v-for="orgUid in selectedOrganisms" 
                     :key="orgUid" 
                     class="flex items-center justify-between py-1 px-2 mb-1 bg-background rounded-md shadow-sm">
                  <span class="text-sm text-foreground">
                    {{ organisms?.find(o => o.uid === orgUid)?.name }}
                  </span>
                  <button 
                    @click="selectedOrganisms = selectedOrganisms.filter(id => id !== orgUid)"
                    class="text-destructive hover:text-destructive/80 text-sm"
                  >
                    ×
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Antibiotics Selection with Selected List -->
          <div class="flex flex-nowrap gap-4">
            <div class="min-w-0 flex-1 space-y-2">
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
                  <Checkbox
                      :checked="selectedAntibiotics.includes(abx.uid)"
                      @update:checked="(value) => {
                        selectedAntibiotics = value
                          ? (selectedAntibiotics.includes(abx.uid) ? selectedAntibiotics : [...selectedAntibiotics, abx.uid])
                          : selectedAntibiotics.filter((uid) => uid !== abx.uid);
                      }"
                  />
                  <span class="ml-2 text-sm text-foreground">{{ abx.name }}</span>
                </div>
              </div>
              <p v-if="errors.selectedAntibiotics" class="text-sm text-destructive">{{ errors.selectedAntibiotics }}</p>
            </div>
            
            <!-- Selected Antibiotics List -->
            <div class="w-48 shrink-0">
              <div class="text-sm font-medium text-foreground mb-1">Selected Antibiotics</div>
              <div class="border border-border rounded-md p-2 h-64 overflow-y-auto bg-muted/30">
                <div v-for="abxUid in selectedAntibiotics" 
                     :key="abxUid" 
                     class="flex items-center justify-between py-1 px-2 mb-1 bg-background rounded-md shadow-sm">
                  <span class="text-sm text-foreground">
                    {{ antibiotics.find(a => a.uid == abxUid)?.name }}
                  </span>
                  <button 
                    @click="selectedAntibiotics = selectedAntibiotics.filter(id => id !== abxUid)"
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
  </Modal>
</template>

<style scoped>
/* Remove the form-checkbox and form-input classes as they are now directly applied in the template */
</style>
