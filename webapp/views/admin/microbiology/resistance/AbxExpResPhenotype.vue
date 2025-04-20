<script setup lang="ts">
import {computed, defineAsyncComponent, onMounted, reactive, ref, h} from 'vue';
import { addListsUnique } from '@/utils';
import useApiUtil from '@/composables/api_util';
import { IAbxExpResPhenotype, IAbxGuideline } from "@/models/microbiology";
import { GetAbxExpResPhenotypeAllDocument, GetAbxExpResPhenotypeAllQuery, GetAbxExpResPhenotypeAllQueryVariables, GetAbxGuidelinesAllDocument, GetAbxGuidelinesAllQuery, GetAbxGuidelinesAllQueryVariables } from "@/graphql/operations/microbiology.queries";
import { AddAbxExpResPhenotypeMutation, AddAbxExpResPhenotypeMutationVariables, AddAbxExpResPhenotypeDocument, EditAbxExpResPhenotypeMutation, EditAbxExpResPhenotypeMutationVariables, EditAbxExpResPhenotypeDocument } from '@/graphql/operations/microbiology.mutations';

const DataTable = defineAsyncComponent(
  () => import('@/components/ui/datatable/FelDataTable.vue')
)
const VueMultiselect = defineAsyncComponent(
  () => import('vue-multiselect')
)

const {withClientMutation, withClientQuery} = useApiUtil()

let showModal = ref<boolean>(false);
let formTitle = ref<string>('');
let form = reactive({}) as IAbxExpResPhenotype;
const formAction = ref<boolean>(true);

const fetchingExpResPhenotypes = ref<boolean>(false);
const abxExptResPhenotypes = ref<IAbxExpResPhenotype[]>([]);

const abxGuidelines = ref<IAbxGuideline[]>([]);

let abxParams = reactive({
  first: 50,
  after: "",
  text: "",
  sortBy: ["guideline___name"],
  filterAction: false,
});

const abxExptResPhenotypesCount = ref<number>(0);
let abxExptResPhenotypesPageInfo = ref({
  startCursor: "",
  endCursor: "",
  hasNextPage: false,
  hasPreviousPage: false,
});

const countNone = computed(
  () => abxExptResPhenotypes?.value?.length + " of " + abxExptResPhenotypesCount.value + " abxExptResPhenotypes"
);

const tableColumns = ref([
  {
    name: "UID",
    value: "uid",
    sortable: false,
    sortBy: "asc",
    defaultSort: true,
    showInToggler: false,
    hidden: true,
  },
  {
    name: "Guideline",
    value: "guideline.name",
    sortable: false,
    sortBy: "asc",
    hidden: false,
  },
  {
    name: "Reference Table",
    value: "referenceTable",
    sortable: false,
    sortBy: "asc",
    hidden: false,
  },
  {
    name: "Organism Code",
    value: "organismCode",
    sortable: false,
    sortBy: "asc",
    hidden: false,
  },
  {
    name: "Organism Code Type",
    value: "organismCodeType",
    sortable: false,
    sortBy: "asc",
    hidden: false,
  },
  {
    name: "Exception Organism Code",
    value: "exceptionOrganismCode",
    sortable: false,
    sortBy: "asc",
    hidden: false,
  },
  {
    name: "Exception Organism Code Type",
    value: "exceptionOrganismCodeType",
    sortable: false,
    sortBy: "asc",
    hidden: false,
  },
  {
    name: "Abx Code",
    value: "abxCode",
    sortable: false,
    sortBy: "asc",
    hidden: false,
  },
  {
    name: "Abx Code Type",
    value: "abxCodeType",
    sortable: false,
    sortBy: "asc",
    hidden: false,
  },
  {
    name: "Antibiotic Exceptions",
    value: "antibioticExceptions",
    sortable: false,
    sortBy: "asc",
    hidden: false,
  },
  {
    name: "Comments",
    value: "comments",
    sortable: false,
    sortBy: "asc",
    hidden: false,
  },
  // {
  //   name: "",
  //   value: "",
  //   sortable: false,
  //   sortBy: "asc",
  //   hidden: false,
  //   customRender: function (abx, column) {
  //     return h(
  //       "button",
  //       {
  //         type: "button",
  //         class: "bg-primary text-primary-foreground py-1 px-2 rounded-sm leading-none",
  //         innerHTML: "Edit",
  //         onClick: () => FormManager(false, abx),
  //       },
  //       []
  //     );
  //   },
  // },
]);

function fetchExpResPhenotypes(params){
  withClientQuery<GetAbxExpResPhenotypeAllQuery, GetAbxExpResPhenotypeAllQueryVariables>(
      GetAbxExpResPhenotypeAllDocument, {
        text: params.text,
        pageSize: params.first,
        sortBy: params.sortBy,
      }, undefined
  ).then(result => {
    const page = result.abxExpectedResistancePhenotypeAll;
    const abx = page.items;
    if (params.filterAction) {
      abxExptResPhenotypes.value = [];
      abxExptResPhenotypes.value = abx;
    } else {
      abxExptResPhenotypes.value = addListsUnique(abxExptResPhenotypes.value!, abx, 'uid');
    }

    abxExptResPhenotypesCount.value = page?.totalCount;
    abxExptResPhenotypesPageInfo.value = page?.pageInfo;
  }).finally(() => {
    fetchingExpResPhenotypes.value = false;
  });
};

onMounted(() =>  {
    fetchExpResPhenotypes(abxParams);
    withClientQuery<GetAbxGuidelinesAllQuery, GetAbxGuidelinesAllQueryVariables>(
        GetAbxGuidelinesAllDocument, {}, "abxGuidelinesAll"
    ).then((result) => {
      if (result) {
        abxGuidelines.value = result as IAbxGuideline[]
      }
    })
  }
)

function searchExpResPhenotypes(opts: any) {
  abxParams.first = 100;
  abxParams.after = "";
  abxParams.text = opts.filterText;
  abxParams.filterAction = true;
  fetchExpResPhenotypes(abxParams);
}

function showMoreExpResPhenotypes(opts: any): void {
  abxParams.first = opts.fetchCount;
  abxParams.after = abxExptResPhenotypesPageInfo?.value?.endCursor!;
  abxParams.text = opts.filterText;
  abxParams.filterAction = false;
  fetchExpResPhenotypes(abxParams);
}

const resetExpResPhenotype = () => Object.assign(form, {}) as IAbxExpResPhenotype;

function FormManager(create: boolean, obj = {} as IAbxExpResPhenotype): void {
  formAction.value = create;
  showModal.value = true;
  formTitle.value = (create ? 'Create' : 'Edit') + ' ' + "ExpResPhenotype";
  if (create) {
    Object.assign(form, {} as IAbxExpResPhenotype);
  } else {
    Object.assign(form, {...obj});
  }
}

function saveForm(): void {
  const payload = {
    guidelineUid: form.guideline?.uid!,
    referenceTable: form.referenceTable,
    organismCode: form.organismCode,
    organismCodeType: form.organismCodeType,
    exceptionOrganismCode: form.exceptionOrganismCode,
    exceptionOrganismCodeType: form.exceptionOrganismCodeType,
    abxCode: form.abxCode,
    abxCodeType: form.abxCodeType,
    antibioticExceptions: form.antibioticExceptions,
    comments: form.comments,
  }

  if (formAction.value === true) {
    withClientMutation<AddAbxExpResPhenotypeMutation, AddAbxExpResPhenotypeMutationVariables>(
        AddAbxExpResPhenotypeDocument, { payload }, "createAbxExpResPhenotype"
    ).then((result) => {
      if(result) {
        abxExptResPhenotypes.value = addListsUnique(abxExptResPhenotypes.value!, [result], 'uid');
      }
    });
  }

  if (formAction.value === false) {
    withClientMutation<EditAbxExpResPhenotypeMutation, EditAbxExpResPhenotypeMutationVariables>(
      EditAbxExpResPhenotypeDocument, { uid: form.uid!, payload }, 
      "updateAbxExpResPhenotype"
    ).then((result: any) => {
      if(result) {
        const index = abxExptResPhenotypes.value!.findIndex(abx => abx.uid == result.uid);
        abxExptResPhenotypes.value![index] = result;
      }
    });
  }

  showModal.value = false;
}

</script>

<template>
  <fel-heading title="Expected Resistance Phenotypes">
    <fel-button @click="FormManager(true)">Add Expected Resistance Phenotype</fel-button>
  </fel-heading>

  <div class="rounded-lg bg-card p-6 shadow-sm">
    <DataTable 
      :columns="tableColumns" 
      :data="abxExptResPhenotypes" 
      :toggleColumns="true" 
      :loading="fetchingExpResPhenotypes" 
      :paginable="true"
      :pageMeta="{
        fetchCount: abxParams.first,
        hasNextPage: true,
        countNone,
      }" 
      :searchable="true" 
      :filterable="false" 
      @onSearchKeyUp="searchExpResPhenotypes" 
      @onSearchFocus="resetExpResPhenotype"
      @onPaginate="showMoreExpResPhenotypes" 
      :selectable="false">
      <template v-slot:footer> </template>
    </DataTable>
  </div>

  <!-- Expected Resistance Phenotype Edit Form Modal -->
  <fel-modal v-if="showModal" @close="showModal = false">
    <template v-slot:header>
      <h3 class="text-lg font-semibold text-foreground">{{ formTitle }}</h3>
    </template>

    <template v-slot:body>
      <form class="space-y-6">
        <div class="grid grid-cols-2 gap-6">
          <label class="block col-span-1 space-y-2">
            <span class="text-sm font-medium text-foreground">Guideline</span>
            <VueMultiselect
              v-model="form.guideline"
              :options="abxGuidelines"
              :searchable="true"
              :close-on-select="true"
              :show-labels="false"
              track-by="uid"
              label="name"
              class="multiselect-blue"
            />
          </label>
          <label class="block col-span-1 space-y-2">
            <span class="text-sm font-medium text-foreground">Reference Table</span>
            <input 
              class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" 
              v-model="form.referenceTable" 
              placeholder="Reference Table ..." />
          </label>
        </div>

        <div class="grid grid-cols-2 gap-6">
          <label class="block col-span-1 space-y-2">
            <span class="text-sm font-medium text-foreground">Organism Code</span>
            <input 
              class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" 
              v-model="form.organismCode" 
              placeholder="Organism Code ..." />
          </label>
          <label class="block col-span-1 space-y-2">
            <span class="text-sm font-medium text-foreground">Organism Code Type</span>
            <input 
              class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" 
              v-model="form.organismCodeType" 
              placeholder="Organism Code Type ..." />
          </label>
        </div>

        <div class="grid grid-cols-2 gap-6">
          <label class="block col-span-1 space-y-2">
            <span class="text-sm font-medium text-foreground">Exception Organism Code</span>
            <input 
              class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" 
              v-model="form.exceptionOrganismCode" 
              placeholder="Exception Organism Code ..." />
          </label>
          <label class="block col-span-1 space-y-2">
            <span class="text-sm font-medium text-foreground">Exception Organism Code Type</span>
            <input 
              class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" 
              v-model="form.exceptionOrganismCodeType" 
              placeholder="Exception Organism Code Type ..." />
          </label>
        </div>

        <div class="grid grid-cols-2 gap-6">
          <label class="block col-span-1 space-y-2">
            <span class="text-sm font-medium text-foreground">Abx Code</span>
            <input 
              class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" 
              v-model="form.abxCode" 
              placeholder="Abx Code ..." />
          </label>
          <label class="block col-span-1 space-y-2">
            <span class="text-sm font-medium text-foreground">Abx Code Type</span>
            <input 
              class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" 
              v-model="form.abxCodeType" 
              placeholder="Abx Code Type ..." />
          </label>
        </div>

        <div class="grid grid-cols-2 gap-6">
          <label class="block col-span-1 space-y-2">
            <span class="text-sm font-medium text-foreground">Antibiotic Exceptions</span>
            <input 
              class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" 
              v-model="form.antibioticExceptions" 
              placeholder="Antibiotic Exceptions ..." />
          </label>
          <label class="block col-span-1 space-y-2">
            <span class="text-sm font-medium text-foreground">Comments</span>
            <input 
              class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" 
              v-model="form.comments" 
              placeholder="Comments ..." />
          </label>
        </div>

        <hr class="border-border" />
        <button 
          type="button" 
          @click.prevent="saveForm()"
          class="inline-flex w-full items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2">
          Save Form
        </button>
      </form>
    </template>
  </fel-modal>
</template>

<style lang="postcss" scoped>
.multiselect-blue {
  @apply rounded-md border border-input bg-background;
}

.multiselect-blue .multiselect__tags {
  @apply border-0 bg-transparent px-3 py-2 text-sm;
}

.multiselect-blue .multiselect__single {
  @apply mb-0 text-sm text-foreground;
}

.multiselect-blue .multiselect__input {
  @apply text-sm text-foreground;
}

.multiselect-blue .multiselect__option {
  @apply text-sm text-foreground;
}

.multiselect-blue .multiselect__option--highlight {
  @apply bg-primary text-primary-foreground;
}

.multiselect-blue .multiselect__option--selected {
  @apply bg-primary/20 text-primary;
}
</style>
