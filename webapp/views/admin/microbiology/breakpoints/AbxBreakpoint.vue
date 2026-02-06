<script setup lang="ts">
import {computed, defineAsyncComponent, onMounted, reactive, ref, h} from 'vue';
import { useForm } from 'vee-validate';
import * as yup from 'yup';
import { addListsUnique } from '@/utils';
import useApiUtil from '@/composables/api_util';
import { AbxBreakpointType, AbxBreakpointTypeType, AbxGuidelineYearType, AbxHostType, AbxSiteOfInfectionType, AbxTestMethodType } from "@/types/gql";
import { GetAbxBreakpointAllDocument, GetAbxBreakpointAllQuery, GetAbxBreakpointAllQueryVariables, GetAbxBreakpointTypeAllDocument, GetAbxBreakpointTypeAllQuery, GetAbxBreakpointTypeAllQueryVariables, GetAbxGuidelineYearAllDocument, GetAbxGuidelineYearAllQuery, GetAbxGuidelineYearAllQueryVariables, GetAbxHostAllDocument, GetAbxHostAllQuery, GetAbxHostAllQueryVariables, GetAbxSiteOfInfectionAllDocument, GetAbxSiteOfInfectionAllQuery, GetAbxSiteOfInfectionAllQueryVariables, GetAbxTestMethodAllDocument, GetAbxTestMethodAllQuery, GetAbxTestMethodAllQueryVariables } from "@/graphql/operations/microbiology.queries";
import { AddAbxBreakpointMutation, AddAbxBreakpointMutationVariables, AddAbxBreakpointDocument, EditAbxBreakpointMutation, EditAbxBreakpointMutationVariables, EditAbxBreakpointDocument } from '@/graphql/operations/microbiology.mutations';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import PageHeading from "@/components/common/PageHeading.vue"
const DataTable = defineAsyncComponent(
  () => import('@/components/common/DataTable.vue')
)
const VueMultiselect = defineAsyncComponent(
  () => import('vue-multiselect')
)

const {withClientMutation, withClientQuery} = useApiUtil()

let showModal = ref<boolean>(false);
let formTitle = ref<string>('');
const formAction = ref<boolean>(true);
const currentUid = ref<string | null>(null);

const breakpointSchema = yup.object({
  guideline: yup.object().required('Guideline year is required'),
  testMethod: yup.object().required('Test method is required'),
  breakpointType: yup.object().required('Breakpoint type is required'),
  organismCode: yup.string().trim().required('Organism code is required'),
  organismCodeType: yup.string().trim().required('Organism code type is required'),
});

const { handleSubmit, resetForm, setValues, values } = useForm({
  validationSchema: breakpointSchema,
  initialValues: {
    guideline: null,
    year: null,
    testMethod: null,
    potency: '',
    organismCode: '',
    organismCodeType: '',
    breakpointType: null,
    host: null,
    siteOfInfection: null,
    referenceTable: '',
    referenceSequence: '',
    whonetAbxCode: '',
    comments: '',
    r: '',
    i: '',
    sdd: '',
    s: '',
    ecvEcoff: '',
    ecvEcoffTentative: '',
  },
});

const fetchingBreakpoints = ref<boolean>(false);
const antibiotics = ref<AbxBreakpointType[]>([]);

const abxGuidelines = ref<AbxGuidelineYearType[]>([]);
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
    withClientQuery<GetAbxGuidelineYearAllQuery, GetAbxGuidelineYearAllQueryVariables>(
        GetAbxGuidelineYearAllDocument, {}, "abxGuidelineYearAll"
    ).then((result) => {
      if (result) {
        abxGuidelines.value = result as AbxGuidelineYearType[]
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

const resetBreakpoint = () => resetForm();

function FormManager(create: boolean, obj = {} as AbxBreakpointType): void {
  formAction.value = create;
  showModal.value = true;
  formTitle.value = (create ? 'Create' : 'Edit') + ' ' + "Breakpoint";
  if (create) {
    currentUid.value = null;
    resetForm();
  } else {
    currentUid.value = obj.uid ?? null;
    setValues({
      guideline: abxGuidelines.value.find(item => item.uid === obj.guidelineYearUid) ?? obj.guidelineYear ?? null,
      year: (obj as AbxBreakpointType & { year?: number | null }).year ?? obj.guidelineYear?.year ?? null,
      testMethod: abxTestMethods.value.find(item => item.uid === obj.testMethodUid) ?? obj.testMethod ?? null,
      potency: obj.potency ?? '',
      organismCode: obj.organismCode ?? '',
      organismCodeType: obj.organismCodeType ?? '',
      breakpointType: abxBreakpointTypes.value.find(item => item.uid === obj.breakpointTypeUid) ?? obj.breakpointType ?? null,
      host: abxHosts.value.find(item => item.uid === obj.hostUid) ?? obj.host ?? null,
      siteOfInfection: abxSiteOfInfections.value.find(item => item.uid === obj.siteOfInfectionUid) ?? obj.siteOfInfection ?? null,
      referenceTable: obj.referenceTable ?? '',
      referenceSequence: obj.referenceSequence ?? '',
      whonetAbxCode: obj.whonetAbxCode ?? '',
      comments: obj.comments ?? '',
      r: obj.r ?? '',
      i: obj.i ?? '',
      sdd: obj.sdd ?? '',
      s: obj.s ?? '',
      ecvEcoff: obj.ecvEcoff ?? '',
      ecvEcoffTentative: obj.ecvEcoffTentative ?? '',
    });
  }
}

const saveForm = handleSubmit((formValues) => {
  const payload = {
    guidelineUid: formValues.guideline?.uid,
    year: formValues.year,
    testMethod: formValues.testMethod?.uid ?? '',
    potency: formValues.potency,
    organismCode: formValues.organismCode,
    organismCodeType: formValues.organismCodeType,
    breakpointTypeUid: formValues.breakpointType?.uid ?? '',
    hostUid: formValues.host?.uid,
    siteOfInfectionUid: formValues.siteOfInfection?.uid,
    referenceTable: formValues.referenceTable,
    referenceSequence: formValues.referenceSequence,
    whonetAbxCode: formValues.whonetAbxCode,
    comments: formValues.comments,
    r: formValues.r,
    i: formValues.i,
    sdd: formValues.sdd,
    s: formValues.s,
    ecvEcoff: formValues.ecvEcoff,
    ecvEcoffTentative: formValues.ecvEcoffTentative,
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

  if (formAction.value === false && currentUid.value) {
    withClientMutation<EditAbxBreakpointMutation, EditAbxBreakpointMutationVariables>(
      EditAbxBreakpointDocument, { uid: currentUid.value, payload }, 
      "updateAbxBreakpoint"
    ).then((result: any) => {
      if(result) {
        const index = antibiotics.value!.findIndex(abx => abx.uid == result.uid);
        antibiotics.value![index] = result;
      }
    });
  }

  showModal.value = false;
});

</script>

<template>
  <div class="space-y-6">
    <PageHeading title="Antibiotic Breakpoints">
      <Button @click="FormManager(true)">Add Breakpoint</Button>
    </PageHeading>

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
  <Modal v-if="showModal" @close="showModal = false" :content-width="'w-1/2'">
    <template v-slot:header>
      <h3 class="text-xl font-semibold text-foreground">{{ formTitle }}</h3>
    </template>

    <template v-slot:body>
      <form @submit.prevent="saveForm" class="space-y-6 p-4">
        <!-- Basic Information -->
        <div class="space-y-4">
          <h4 class="text-lg font-semibold text-foreground">Basic Information</h4>
          <div class="grid grid-cols-2 gap-4">
            <FormField name="guideline" v-slot="{ value, handleChange }">
              <FormItem>
                <FormLabel>Guidelines</FormLabel>
                <FormControl>
                  <VueMultiselect
                    :model-value="value"
                    @update:model-value="handleChange"
                    :options="abxGuidelines"
                    :searchable="true"
                    label="code"
                    class="mt-1 multiselect-blue"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
            <FormField name="year" v-slot="{ componentField }">
              <FormItem>
                <FormLabel>Year</FormLabel>
                <FormControl>
                  <Input v-bind="componentField" type="number" placeholder="Year" />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
          </div>
        </div>

        <!-- Coding Systems -->
        <div class="space-y-4">
          <h4 class="text-lg font-semibold text-foreground">Coding Systems</h4>
          <div class="grid grid-cols-3 gap-4">
            <label class="block">
              <span class="text-sm font-medium text-foreground">Test Method</span>
              <VueMultiselect
                v-model="testMethod"
                :options="abxTestMethods"
                :searchable="true"
                label="name"
                class="mt-1 multiselect-blue"
              >
              </VueMultiselect>
              <p v-if="errors.testMethod" class="text-sm text-destructive">{{ errors.testMethod }}</p>
            </label>
            <label class="block">
              <span class="text-sm font-medium text-foreground">Potency</span>
              <input
                class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                v-model="potency"
                placeholder="Potency"
              />
            </label>
            <label class="block">
              <span class="text-sm font-medium text-foreground">Organism Code</span>
              <input
                class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                v-model="organismCode"
                placeholder="Organism Code"
              />
              <p v-if="errors.organismCode" class="text-sm text-destructive">{{ errors.organismCode }}</p>
            </label>
            <label class="block">
              <span class="text-sm font-medium text-foreground">Organism Code Type</span>
              <input
                class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                v-model="organismCodeType"
                placeholder="Organism Code Type"
              />
              <p v-if="errors.organismCodeType" class="text-sm text-destructive">{{ errors.organismCodeType }}</p>
            </label>
            <label class="block">
              <span class="text-sm font-medium text-foreground">Breakpoint Type</span>
              <VueMultiselect
                v-model="breakpointType"
                :options="abxBreakpointTypes"
                :searchable="true"
                label="name"
                class="mt-1 multiselect-blue"
              >
              </VueMultiselect>
              <p v-if="errors.breakpointType" class="text-sm text-destructive">{{ errors.breakpointType }}</p>
            </label>
            <label class="block">
              <span class="text-sm font-medium text-foreground">Whonet AbxCode</span>
              <input
                class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                v-model="whonetAbxCode"
                placeholder="Whonet AbxCode"
              />
            </label>
            <label class="block">
              <span class="text-sm font-medium text-foreground">Host</span>
              <VueMultiselect
                v-model="host"
                :options="abxHosts"
                :searchable="true"
                label="name"
                class="mt-1 multiselect-blue"
              >
              </VueMultiselect>
            </label>
            <label class="block">
              <span class="text-sm font-medium text-foreground">Site of Infection</span>
              <VueMultiselect
                v-model="siteOfInfection"
                :options="abxSiteOfInfections"
                :searchable="true"
                label="name"
                class="mt-1 multiselect-blue"
              >
              </VueMultiselect>
            </label>
            <label class="block">
              <span class="text-sm font-medium text-foreground">R</span>
              <input
                class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                v-model="r"
                placeholder="R"
              />
            </label>
            <label class="block">
              <span class="text-sm font-medium text-foreground">I</span>
              <input
                class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                v-model="i"
                placeholder="I"
              />
            </label>
            <label class="block">
              <span class="text-sm font-medium text-foreground">SDD</span>
              <input
                class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                v-model="sdd"
                placeholder="SDD"
              />
            </label>
            <label class="block">
              <span class="text-sm font-medium text-foreground">S</span>
              <input
                class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                v-model="s"
                placeholder="S"
              />
            </label>
            <label class="block">
              <span class="text-sm font-medium text-foreground">EcvEcoff</span>
              <input
                class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                v-model="ecvEcoff"
                placeholder="EcvEcoff"
              />
            </label>
            <label class="block">
              <span class="text-sm font-medium text-foreground">EcvEcoff Tentative</span>
              <input
                class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                v-model="ecvEcoffTentative"
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
  </Modal>
</template>

<style scoped>
@reference "@/assets/css/style.css";
.multiselect-blue {
  @apply rounded-md border-border shadow-sm focus:border-primary focus:ring focus:ring-primary/50;
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
