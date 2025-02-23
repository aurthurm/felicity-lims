<script setup lang="ts">
import {computed, defineAsyncComponent, onMounted, reactive, ref, h} from 'vue';
import { addListsUnique } from '@/utils/helpers';
import useApiUtil from '@/composables/api_util';
import { IAbxBreakpoint, IAbxBreakpointType, IAbxGuideline, IAbxHost, IAbxSiteOfInfection, IAbxTestMethod } from "@/models/microbiology";
import { GetAbxBreakpointAllDocument, GetAbxBreakpointAllQuery, GetAbxBreakpointAllQueryVariables, GetAbxBreakpointTypeAllDocument, GetAbxBreakpointTypeAllQuery, GetAbxBreakpointTypeAllQueryVariables, GetAbxGuidelinesAllDocument, GetAbxGuidelinesAllQuery, GetAbxGuidelinesAllQueryVariables, GetAbxHostAllDocument, GetAbxHostAllQuery, GetAbxHostAllQueryVariables, GetAbxSiteOfInfectionAllDocument, GetAbxSiteOfInfectionAllQuery, GetAbxSiteOfInfectionAllQueryVariables, GetAbxTestMethodAllDocument, GetAbxTestMethodAllQuery, GetAbxTestMethodAllQueryVariables } from "@/graphql/operations/microbiology.queries";
import { AddAbxBreakpointMutation, AddAbxBreakpointMutationVariables, AddAbxBreakpointDocument, EditAbxBreakpointMutation, EditAbxBreakpointMutationVariables, EditAbxBreakpointDocument } from '@/graphql/operations/microbiology.mutations';

const modal = defineAsyncComponent(
  () => import("@/components/ui/FelModal.vue")
)
const DataTable = defineAsyncComponent(
  () => import('@/components/ui/datatable/FelDataTable.vue')
)
const VueMultiselect = defineAsyncComponent(
  () => import('vue-multiselect')
)

const {withClientMutation, withClientQuery} = useApiUtil()

let showModal = ref<boolean>(false);
let formTitle = ref<string>('');
let form = reactive({}) as IAbxBreakpoint;
const formAction = ref<boolean>(true);

const fetchingBreakpoints = ref<boolean>(false);
const antibiotics = ref<IAbxBreakpoint[]>([]);

const abxGuidelines = ref<IAbxGuideline[]>([]);
const abxHosts = ref<IAbxHost[]>([]);
const abxBreakpointTypes = ref<IAbxBreakpointType[]>([]);
const abxSiteOfInfections = ref<IAbxSiteOfInfection[]>([]);
const abxTestMethods = ref<IAbxTestMethod[]>([]);

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
  //         class: "bg-sky-800 text-white py-1 px-2 rounded-sm leading-none",
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
        abxGuidelines.value = result as IAbxGuideline[]
      }
    })
    fetchBreakpoints(abxParams);
    withClientQuery<GetAbxHostAllQuery, GetAbxHostAllQueryVariables>(
        GetAbxHostAllDocument, {}, "abxHostAll"
    ).then((result) => {
      if (result) {
        abxHosts.value = result as IAbxHost[]
      }
    })
    withClientQuery<GetAbxSiteOfInfectionAllQuery, GetAbxSiteOfInfectionAllQueryVariables>(
        GetAbxSiteOfInfectionAllDocument, {}, "abxSiteOfInfectionAll"
    ).then((result) => {
      if (result) {
        abxSiteOfInfections.value = result as IAbxSiteOfInfection[]
      }
    })
    withClientQuery<GetAbxTestMethodAllQuery, GetAbxTestMethodAllQueryVariables>(
        GetAbxTestMethodAllDocument, {}, "abxTestMethodAll"
    ).then((result) => {
      if (result) {
        abxTestMethods.value = result as IAbxTestMethod[]
      }
    })
    withClientQuery<GetAbxBreakpointTypeAllQuery, GetAbxBreakpointTypeAllQueryVariables>(
        GetAbxBreakpointTypeAllDocument, {}, "abxBreakpointTypeAll"
    ).then((result) => {
      if (result) {
        abxBreakpointTypes.value = result as IAbxBreakpointType[]
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

const resetBreakpoint = () => Object.assign(form, {}) as IAbxBreakpoint;

function FormManager(create: boolean, obj = {} as IAbxBreakpoint): void {
  formAction.value = create;
  showModal.value = true;
  formTitle.value = (create ? 'Create' : 'Edit') + ' ' + "Breakpoint";
  if (create) {
    Object.assign(form, {} as IAbxBreakpoint);
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

  <div class="w-full my-4">
    <!-- <hr>
    <button @click="FormManager(true)"
            class="px-2 py-1 border-sky-800 border text-sky-800 rounded-sm transition duration-300 hover:bg-sky-800 hover:text-white focus:outline-none">
      Add Breakpoint
    </button> -->
    <hr>

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
    <template v-slot:footer> </template>
  </DataTable>

  </div>

  <!-- Breakpoint Form Modal -->
  <modal v-if="showModal" @close="showModal = false" :content-width="'w-1/2'">
    <template v-slot:header>
      <h3>{{ formTitle }}</h3>
    </template>

    <template v-slot:body>
      <form action="post" class="p-4">
        <!-- Basic Information -->
        <div class="mb-6">
          <h4 class="text-lg font-semibold mb-4">Basic Information</h4>
          <div class="grid grid-cols-2 gap-4">
            <label class="block">
              <span class="text-gray-700">Guidelines</span>
              <VueMultiselect
              v-model="form.guidelines"
              :options="abxGuidelines"
              :searchable="true"
              label="name"
              >
              </VueMultiselect>
            </label>
            <label class="block">
              <span class="text-gray-700">Year</span>
              <input type="number"
                class="form-input mt-1 block w-full"
                v-model="form.year"
                placeholder="Year"
              />
            </label>
          </div>
        </div>

        <!-- Coding Systems -->
        <div class="mb-6">
          <div class="grid grid-cols-3 gap-4">
            <label class="block">
              <span class="text-gray-700">Test Method</span>
              <VueMultiselect
              v-model="form.testMethod"
              :options="abxTestMethods"
              :searchable="true"
              label="name"
              >
              </VueMultiselect>
            </label>
            <label class="block">
              <span class="text-gray-700">Potency</span>
              <input
                class="form-input mt-1 block w-full"
                v-model="form.potency"
                placeholder="Potency"
              />
            </label>
            <label class="block">
              <span class="text-gray-700">Organism Code</span>
              <input
                class="form-input mt-1 block w-full"
                v-model="form.organismCode"
                placeholder="Organism Code"
              />
            </label>
            <label class="block">
              <span class="text-gray-700">Organism Code Type</span>
              <input
                class="form-input mt-1 block w-full"
                v-model="form.organismCodeType"
                placeholder="Organism Code Type"
              />
            </label>
            <label class="block">
              <span class="text-gray-700">Breakpoint Type</span>
              <VueMultiselect
              v-model="form.breakpointType"
              :options="abxBreakpointTypes"
              :searchable="true"
              label="name"
              >
              </VueMultiselect>
            </label>
            <label class="block">
              <span class="text-gray-700">Host</span>
              <VueMultiselect
              v-model="form.host"
              :options="abxHosts"
              :searchable="true"
              label="name"
              >
              </VueMultiselect>
            </label>
            <label class="block">
              <span class="text-gray-700">Site Of Infection</span>
              <VueMultiselect
              v-model="form.siteOfInfection"
              :options="abxSiteOfInfections"
              :searchable="true"
              label="name"
              >
              </VueMultiselect>
            </label>
            <label class="block">
              <span class="text-gray-700">Reference Table</span>
              <input
                class="form-input mt-1 block w-full"
                v-model="form.referenceTable"
                placeholder="Reference Table"
              />
            </label>
            <label class="block">
              <span class="text-gray-700">Reference Sequence</span>
              <input
                class="form-input mt-1 block w-full"
                v-model="form.referenceSequence"
                placeholder="Reference Sequence"
              />
            </label>
            <label class="block">
              <span class="text-gray-700">Whonet AbxCode</span>
              <input
                class="form-input mt-1 block w-full"
                v-model="form.whonetAbxCode"
                placeholder="Whonet AbxCode"
              />
            </label>
            <label class="block">
              <span class="text-gray-700">R</span>
              <input
                class="form-input mt-1 block w-full"
                v-model="form.r"
                placeholder="R"
              />
            </label>
            <label class="block">
              <span class="text-gray-700">I</span>
              <input
                class="form-input mt-1 block w-full"
                v-model="form.i"
                placeholder="I"
              />
            </label>
            <label class="block">
              <span class="text-gray-700">SDD</span>
              <input
                class="form-input mt-1 block w-full"
                v-model="form.sdd"
                placeholder="SDD"
              />
            </label>
            <label class="block">
              <span class="text-gray-700">S</span>
              <input
                class="form-input mt-1 block w-full"
                v-model="form.s"
                placeholder="S"
              />
            </label>
            <label class="block">
              <span class="text-gray-700">EcvEcoff</span>
              <input
                class="form-input mt-1 block w-full"
                v-model="form.ecvEcoff"
                placeholder="EcvEcoff"
              />
            </label>
            <label class="block">
              <span class="text-gray-700">EcvEcoff Tentative</span>
              <input
                class="form-input mt-1 block w-full"
                v-model="form.ecvEcoffTentative"
                placeholder="EcvEcoff Tentative"
              />
            </label>
          </div>
        </div>

        <hr class="my-6"/>
        
        <button
          type="button"
          @click.prevent="saveForm()"
          class="w-full bg-sky-800 text-white rounded-md px-4 py-2 transition-colors duration-300 ease-in-out hover:bg-sky-900 focus:outline-none focus:ring-2 focus:ring-sky-500"
        >
          Save Breakpoint
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
