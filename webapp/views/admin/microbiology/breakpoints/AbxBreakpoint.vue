<script setup lang="ts">
import {computed, defineAsyncComponent, onMounted, reactive, ref, h} from 'vue';
import { addListsUnique } from '@/utils';
import useApiUtil from '@/composables/api_util';
import { AbxBreakpointType, AbxBreakpointTypeType, AbxGuidelineType, AbxHostType, AbxSiteOfInfectionType, AbxTestMethodType } from "@/types/gql";
import { GetAbxBreakpointAllDocument, GetAbxBreakpointAllQuery, GetAbxBreakpointAllQueryVariables, GetAbxBreakpointTypeAllDocument, GetAbxBreakpointTypeAllQuery, GetAbxBreakpointTypeAllQueryVariables, GetAbxGuidelinesAllDocument, GetAbxGuidelinesAllQuery, GetAbxGuidelinesAllQueryVariables, GetAbxHostAllDocument, GetAbxHostAllQuery, GetAbxHostAllQueryVariables, GetAbxSiteOfInfectionAllDocument, GetAbxSiteOfInfectionAllQuery, GetAbxSiteOfInfectionAllQueryVariables, GetAbxTestMethodAllDocument, GetAbxTestMethodAllQuery, GetAbxTestMethodAllQueryVariables } from "@/graphql/operations/microbiology.queries";
import { AddAbxBreakpointMutation, AddAbxBreakpointMutationVariables, AddAbxBreakpointDocument, EditAbxBreakpointMutation, EditAbxBreakpointMutationVariables, EditAbxBreakpointDocument } from '@/graphql/operations/microbiology.mutations';

const DataTable = defineAsyncComponent(
  () => import('@/components/ui/datatable/FelDataTable.vue')
)
const VueMultiselect = defineAsyncComponent(
  () => import('vue-multiselect')
)

const {withClientMutation, withClientQuery} = useApiUtil()

let showModal = ref<boolean>(false);
let formTitle = ref<string>('');
let form = reactive({}) as AbxBreakpointType;
const formAction = ref<boolean>(true);

const fetchingBreakpoints = ref<boolean>(false);
const antibiotics = ref<AbxBreakpointType[]>([]);

const abxGuidelines = ref<AbxGuidelineType[]>([]);
const abxHosts = ref<AbxHostType[]>([]);
const abxBreakpointTypes = ref<AbxBreakpointTypeType[]>([]);
const abxSiteOfInfections = ref<AbxSiteOfInfectionType[]>([]);
const abxTestMethods = ref<AbxTestMethodType[]>([]);

let abxParams = reactive({
  first: 50,
  after: "",
  text: "",
  sortBy: ["-guideline_year___year"],
  filterAction: false,
});

const antibioticCount = ref<number>(0);
let antibioticPageInfo = ref({
  startCursor: "",
  endCursor: "",
  hasNextPage: false,
  hasPreviousPage: false,
});

const countNone = computed(
  () => antibiotics?.value?.length + " of " + antibioticCount.value + " antibiotics"
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
    value: "guidelineYear.code",
    sortable: false,
    sortBy: "asc",
    hidden: false,
  },
  {
    name: "Test Method",
    value: "testMethod.name",
    sortable: false,
    sortBy: "asc",
    hidden: false,
  },
  {
    name: "Potency",
    value: "potency",
    sortable: false,
    sortBy: "asc",
    hidden: false,
  },
  {
    name: "OrganismCode",
    value: "organismCode",
    sortable: false,
    sortBy: "asc",
    hidden: false,
  },
  {
    name: "OrganismCodeType",
    value: "organismCodeType",
    sortable: false,
    sortBy: "asc",
    hidden: false,
  },
  {
    name: "BreakpointType",
    value: "breakpointType.name",
    sortable: false,
    sortBy: "asc",
    hidden: false,
  },
  {
    name: "Host",
    value: "host.name",
    sortable: false,
    sortBy: "asc",
    hidden: false,
  },
  {
    name: "SiteOfInfection",
    value: "siteOfInfection.name",
    sortable: false,
    sortBy: "asc",
    hidden: true,
  },
  {
    name: "ReferenceTable",
    value: "referenceTable",
    sortable: false,
    sortBy: "asc",
    hidden: true,
  },
  {
    name: "ReferenceSequence",
    value: "referenceSequence",
    sortable: false,
    sortBy: "asc",
    hidden: true,
  },
  {
    name: "WhonetAbxCode",
    value: "whonetAbxCode",
    sortable: false,
    sortBy: "asc",
    hidden: false,
  },
  {
    name: "R",
    value: "r",
    sortable: false,
    sortBy: "asc",
    hidden: false,
  },
  {
    name: "I",
    value: "i",
    sortable: false,
    sortBy: "asc",
    hidden: false,
  },
  {
    name: "SDD",
    value: "sdd",
    sortable: false,
    sortBy: "asc",
    hidden: false,
  },
  {
    name: "S",
    value: "s",
    sortable: false,
    sortBy: "asc",
    hidden: false,
  },
  {
    name: "EcvEcoff",
    value: "ecvEcoff",
    sortable: false,
    sortBy: "asc",
    hidden: true,
  },
  {
    name: "ecvEcoffTentative",
    value: "EcvEcoffTentative",
    sortable: false,
    sortBy: "asc",
    hidden: true,
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

function fetchBreakpoints(params){
  withClientQuery<GetAbxBreakpointAllQuery, GetAbxBreakpointAllQueryVariables>(
      GetAbxBreakpointAllDocument, {
        text: params.text,
        pageSize: params.first,
        sortBy: params.sortBy,
      }, undefined
  ).then(result => {
    const page = result.abxBreakpointAll;
    const abx = page.items;
    if (params.filterAction) {
      antibiotics.value = [];
      antibiotics.value = abx;
    } else {
      antibiotics.value = addListsUnique(antibiotics.value!, abx, 'uid');
    }

    antibioticCount.value = page?.totalCount;
    antibioticPageInfo.value = page?.pageInfo;
  }).finally(() => {
    fetchingBreakpoints.value = false;
  });
};

onMounted(() =>  {
    withClientQuery<GetAbxGuidelinesAllQuery, GetAbxGuidelinesAllQueryVariables>(
        GetAbxGuidelinesAllDocument, {}, "abxGuidelinesAll"
    ).then((result) => {
      if (result) {
        abxGuidelines.value = result as AbxGuidelineType[]
      }
    })
    fetchBreakpoints(abxParams);
    withClientQuery<GetAbxHostAllQuery, GetAbxHostAllQueryVariables>(
        GetAbxHostAllDocument, {}, "abxHostAll"
    ).then((result) => {
      if (result) {
        abxHosts.value = result as AbxHostType[]
      }
    })
    withClientQuery<GetAbxSiteOfInfectionAllQuery, GetAbxSiteOfInfectionAllQueryVariables>(
        GetAbxSiteOfInfectionAllDocument, {}, "abxSiteOfInfectionAll"
    ).then((result) => {
      if (result) {
        abxSiteOfInfections.value = result as AbxSiteOfInfectionType[]
      }
    })
    withClientQuery<GetAbxTestMethodAllQuery, GetAbxTestMethodAllQueryVariables>(
        GetAbxTestMethodAllDocument, {}, "abxTestMethodAll"
    ).then((result) => {
      if (result) {
        abxTestMethods.value = result as AbxTestMethodType[]
      }
    })
    withClientQuery<GetAbxBreakpointTypeAllQuery, GetAbxBreakpointTypeAllQueryVariables>(
        GetAbxBreakpointTypeAllDocument, {}, "abxBreakpointTypeAll"
    ).then((result) => {
      if (result) {
        abxBreakpointTypes.value = result as AbxBreakpointTypeType[]
      }
    })
  }
)

function searchBreakpoints(opts: any) {
  abxParams.first = 100;
  abxParams.after = "";
  abxParams.text = opts.filterText;
  abxParams.filterAction = true;
  fetchBreakpoints(abxParams);
}

function showMoreBreakpoints(opts: any): void {
  abxParams.first = opts.fetchCount;
  abxParams.after = antibioticPageInfo?.value?.endCursor!;
  abxParams.text = opts.filterText;
  abxParams.filterAction = false;
  fetchBreakpoints(abxParams);
}

const resetBreakpoint = () => Object.assign(form, {}) as AbxBreakpointType;

function FormManager(create: boolean, obj = {} as AbxBreakpointType): void {
  formAction.value = create;
  showModal.value = true;
  formTitle.value = (create ? 'Create' : 'Edit') + ' ' + "Breakpoint";
  if (create) {
    Object.assign(form, {} as AbxBreakpointType);
  } else {
    Object.assign(form, {...obj});
  }
}

function saveForm(): void {
  const payload = {
    guidelineUid: form.guidelineUid,
    year: form.year,
    testMethod: form.testMethod,
    potency: form.potency,
    organismCode: form.organismCode,
    organismCodeType: form.organismCodeType,
    breakpointTypeUid: form.breakpointTypeUid,
    hostUid: form.hostUid,
    siteOfInfectionUid: form.siteOfInfectionUid,
    referenceTable: form.referenceTable,
    referenceSequence: form.referenceSequence,
    whonetAbxCode: form.whonetAbxCode,
    comments: form.comments,
    r: form.r,
    i: form.i,
    sdd: form.sdd,
    s: form.s,
    ecvEcoff: form.ecvEcoff,
    ecvEcoffTentative: form.ecvEcoffTentative,
  }

  if (formAction.value === true) {
    withClientMutation<AddAbxBreakpointMutation, AddAbxBreakpointMutationVariables>(
        AddAbxBreakpointDocument, { payload }, "createAbxBreakpoint"
    ).then((result) => {
      if(result) {
        antibiotics.value = addListsUnique(antibiotics.value!, [result], 'uid');
      }
    });
  }

  if (formAction.value === false) {
    withClientMutation<EditAbxBreakpointMutation, EditAbxBreakpointMutationVariables>(
      EditAbxBreakpointDocument, { uid: form.uid!, payload }, 
      "updateAbxBreakpoint"
    ).then((result: any) => {
      if(result) {
        const index = antibiotics.value!.findIndex(abx => abx.uid == result.uid);
        antibiotics.value![index] = result;
      }
    });
  }

  showModal.value = false;
}

</script>

<template>
  <div class="space-y-6">
    <fel-heading title="Antibiotic Breakpoints">
      <fel-button @click="FormManager(true)">Add Breakpoint</fel-button>
    </fel-heading>

    <div class="rounded-lg shadow-sm bg-card p-6">
      <DataTable 
        :columns="tableColumns" 
        :data="antibiotics" 
        :toggleColumns="true" 
        :loading="fetchingBreakpoints" 
        :paginable="true"
        :pageMeta="{
          fetchCount: abxParams.first,
          hasNextPage: true,
          countNone,
        }" 
        :searchable="true" 
        :filterable="false" 
        @onSearchKeyUp="searchBreakpoints" 
        @onSearchFocus="resetBreakpoint"
        @onPaginate="showMoreBreakpoints" 
        :selectable="false">
        <template v-slot:footer></template>
      </DataTable>
    </div>
  </div>

  <!-- Breakpoint Form Modal -->
  <fel-modal v-if="showModal" @close="showModal = false" :content-width="'w-1/2'">
    <template v-slot:header>
      <h3 class="text-xl font-semibold text-foreground">{{ formTitle }}</h3>
    </template>

    <template v-slot:body>
      <form @submit.prevent="saveForm" class="space-y-6 p-4">
        <!-- Basic Information -->
        <div class="space-y-4">
          <h4 class="text-lg font-semibold text-foreground">Basic Information</h4>
          <div class="grid grid-cols-2 gap-4">
            <label class="block">
              <span class="text-sm font-medium text-foreground">Guidelines</span>
              <VueMultiselect
                v-model="form.guidelines"
                :options="abxGuidelines"
                :searchable="true"
                label="name"
                class="mt-1 multiselect-blue"
              >
              </VueMultiselect>
            </label>
            <label class="block">
              <span class="text-sm font-medium text-foreground">Year</span>
              <input type="number"
                class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                v-model="form.year"
                placeholder="Year"
              />
            </label>
          </div>
        </div>

        <!-- Coding Systems -->
        <div class="space-y-4">
          <h4 class="text-lg font-semibold text-foreground">Coding Systems</h4>
          <div class="grid grid-cols-3 gap-4">
            <label class="block">
              <span class="text-sm font-medium text-foreground">Test Method</span>
              <VueMultiselect
                v-model="form.testMethod"
                :options="abxTestMethods"
                :searchable="true"
                label="name"
                class="mt-1 multiselect-blue"
              >
              </VueMultiselect>
            </label>
            <label class="block">
              <span class="text-sm font-medium text-foreground">Potency</span>
              <input
                class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                v-model="form.potency"
                placeholder="Potency"
              />
            </label>
            <label class="block">
              <span class="text-sm font-medium text-foreground">Organism Code</span>
              <input
                class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                v-model="form.organismCode"
                placeholder="Organism Code"
              />
            </label>
            <label class="block">
              <span class="text-sm font-medium text-foreground">Organism Code Type</span>
              <input
                class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                v-model="form.organismCodeType"
                placeholder="Organism Code Type"
              />
            </label>
            <label class="block">
              <span class="text-sm font-medium text-foreground">Whonet AbxCode</span>
              <input
                class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                v-model="form.whonetAbxCode"
                placeholder="Whonet AbxCode"
              />
            </label>
            <label class="block">
              <span class="text-sm font-medium text-foreground">R</span>
              <input
                class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                v-model="form.r"
                placeholder="R"
              />
            </label>
            <label class="block">
              <span class="text-sm font-medium text-foreground">I</span>
              <input
                class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                v-model="form.i"
                placeholder="I"
              />
            </label>
            <label class="block">
              <span class="text-sm font-medium text-foreground">SDD</span>
              <input
                class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                v-model="form.sdd"
                placeholder="SDD"
              />
            </label>
            <label class="block">
              <span class="text-sm font-medium text-foreground">S</span>
              <input
                class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                v-model="form.s"
                placeholder="S"
              />
            </label>
            <label class="block">
              <span class="text-sm font-medium text-foreground">EcvEcoff</span>
              <input
                class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                v-model="form.ecvEcoff"
                placeholder="EcvEcoff"
              />
            </label>
            <label class="block">
              <span class="text-sm font-medium text-foreground">EcvEcoff Tentative</span>
              <input
                class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                v-model="form.ecvEcoffTentative"
                placeholder="EcvEcoff Tentative"
              />
            </label>
          </div>
        </div>

        <hr class="border-border"/>
        
        <button
          type="submit"
          class="w-full bg-primary text-primary-foreground rounded-md px-4 py-2 transition-colors duration-200 hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
        >
          Save Breakpoint
        </button>
      </form>
    </template>
  </fel-modal>
</template>

<style scoped>
.multiselect-blue {
  @apply rounded-md border-border shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50;
}

.multiselect-blue :deep(.multiselect__tags) {
  @apply border-border rounded-md;
}

.multiselect-blue :deep(.multiselect__single) {
  @apply text-foreground;
}

.multiselect-blue :deep(.multiselect__input) {
  @apply text-foreground;
}

.multiselect-blue :deep(.multiselect__option) {
  @apply text-foreground hover:bg-primary/10;
}

.multiselect-blue :deep(.multiselect__option--highlight) {
  @apply bg-primary text-primary-foreground;
}

.multiselect-blue :deep(.multiselect__option--selected) {
  @apply bg-primary/20 text-foreground;
}
</style>
