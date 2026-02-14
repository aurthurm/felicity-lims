<script setup lang="ts">
import {computed, defineAsyncComponent, onMounted, reactive, ref, h} from 'vue';
import { useForm, useField } from 'vee-validate';
import * as yup from 'yup';
import { addListsUnique } from '@/utils';
import useApiUtil from '@/composables/api_util';
import { AbxQCRangeType, AbxGuidelineType, AbxMediumType } from "@/types/gql";
import { GetAbxQcRangeAllDocument, GetAbxQcRangeAllQuery, GetAbxQcRangeAllQueryVariables, GetAbxGuidelinesAllDocument, GetAbxGuidelinesAllQuery, GetAbxGuidelinesAllQueryVariables, GetAbxMediumAllDocument, GetAbxMediumAllQuery, GetAbxMediumAllQueryVariables } from "@/graphql/operations/microbiology.queries";
import { AddAbxQcRangeMutation, AddAbxQcRangeMutationVariables, AddAbxQcRangeDocument, EditAbxQcRangeMutation, EditAbxQcRangeMutationVariables, EditAbxQcRangeDocument } from '@/graphql/operations/microbiology.mutations';

const modal = defineAsyncComponent(
  () => import("@/components/ui/BeakModal.vue")
)
const DataTable = defineAsyncComponent(
  () => import('@/components/ui/datatable/BeakDataTable.vue')
)
const VueMultiselect = defineAsyncComponent(
  () => import('vue-multiselect')
)

const {withClientMutation, withClientQuery} = useApiUtil()

let showModal = ref<boolean>(false);
let formTitle = ref<string>('');
const formAction = ref<boolean>(true);
const currentUid = ref<string | null>(null);

const qcRangeSchema = yup.object({
  guideline: yup.object().required('Guideline is required'),
  year: yup.number().typeError('Year is required').required('Year is required'),
  strain: yup.string().trim().required('Strain is required'),
  referenceTable: yup.string().trim().required('Reference table is required'),
  whonetOrgCode: yup.string().trim().required('Whonet org code is required'),
  antibiotic: yup.string().trim().required('Antibiotic is required'),
  abxTest: yup.string().trim().required('Abx test is required'),
  whonetAbxCode: yup.string().trim().required('Whonet abx code is required'),
  method: yup.string().trim().required('Method is required'),
  medium: yup.object().nullable(),
  minimum: yup.string().trim().nullable(),
  maximum: yup.string().trim().nullable(),
  comments: yup.string().trim().nullable(),
});

const { handleSubmit, resetForm, setValues, errors } = useForm({
  validationSchema: qcRangeSchema,
  initialValues: {
    guideline: null,
    year: '',
    strain: '',
    referenceTable: '',
    whonetOrgCode: '',
    antibiotic: '',
    abxTest: '',
    whonetAbxCode: '',
    method: '',
    medium: null,
    minimum: '',
    maximum: '',
    comments: '',
  },
});
const { value: guideline } = useField<AbxGuidelineType | null>('guideline');
const { value: year } = useField<number | string>('year');
const { value: strain } = useField<string>('strain');
const { value: referenceTable } = useField<string>('referenceTable');
const { value: whonetOrgCode } = useField<string>('whonetOrgCode');
const { value: antibiotic } = useField<string>('antibiotic');
const { value: abxTest } = useField<string>('abxTest');
const { value: whonetAbxCode } = useField<string>('whonetAbxCode');
const { value: method } = useField<string>('method');
const { value: medium } = useField<AbxMediumType | null>('medium');
const { value: minimum } = useField<string>('minimum');
const { value: maximum } = useField<string>('maximum');
const { value: comments } = useField<string>('comments');

const fetchingQcRanges = ref<boolean>(false);
const qcRanges = ref<AbxQCRangeType[]>([]);

const abxGuidelines = ref<AbxGuidelineType[]>([]);
const abxMediums = ref<AbxMediumType[]>([]);

let abxParams = reactive({
  first: 50,
  after: "",
  text: "",
  sortBy: ["-year"],
  filterAction: false,
});

const qcRangesCount = ref<number>(0);
let qcRangesPageInfo = ref({
  startCursor: "",
  endCursor: "",
  hasNextPage: false,
  hasPreviousPage: false,
});

const countNone = computed(
  () => qcRanges?.value?.length + " of " + qcRangesCount.value + " qcRanges"
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
    name: "Year",
    value: "year",
    sortable: false,
    sortBy: "asc",
    hidden: false,
  },
  {
    name: "Strain",
    value: "strain",
    sortable: false,
    sortBy: "asc",
    hidden: false,
  },
  {
    name: "ReferenceTable",
    value: "referenceTable",
    sortable: false,
    sortBy: "asc",
    hidden: false,
  },
  {
    name: "WhonetOrgCode",
    value: "whonetOrgCode",
    sortable: false,
    sortBy: "asc",
    hidden: false,
  },
  {
    name: "Antibiotic",
    value: "antibiotic",
    sortable: false,
    sortBy: "asc",
    hidden: false,
  },
  {
    name: "AbxTest",
    value: "abxTest",
    sortable: false,
    sortBy: "asc",
    hidden: false,
  },
  {
    name: "WhonetAbxCode",
    value: "whonetAbxCode",
    sortable: false,
    sortBy: "asc",
    hidden: false,
  },
  {
    name: "Method",
    value: "method",
    sortable: false,
    sortBy: "asc",
    hidden: false,
  },
  {
    name: "Medium",
    value: "medium.name",
    sortable: false,
    sortBy: "asc",
    hidden: false,
  },
  {
    name: "Minimum",
    value: "minimum",
    sortable: false,
    sortBy: "asc",
    hidden: false,
  },
  {
    name: "Maximum",
    value: "maximum",
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

function fetchQcRanges(params){
  withClientQuery<GetAbxQcRangeAllQuery, GetAbxQcRangeAllQueryVariables>(
      GetAbxQcRangeAllDocument, {
        text: params.text,
        pageSize: params.first,
        sortBy: params.sortBy,
      }, undefined
  ).then(result => {
    const page = result.abxQcRangeAll;
    const abx = page.items;
    if (params.filterAction) {
      qcRanges.value = [];
      qcRanges.value = abx;
    } else {
      qcRanges.value = addListsUnique(qcRanges.value!, abx, 'uid');
    }

    qcRangesCount.value = page?.totalCount;
    qcRangesPageInfo.value = page?.pageInfo;
  }).finally(() => {
    fetchingQcRanges.value = false;
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
    fetchQcRanges(abxParams);
    withClientQuery<GetAbxMediumAllQuery, GetAbxMediumAllQueryVariables>(
        GetAbxMediumAllDocument, {}, "abxMediumAll"
    ).then((result) => {
      if (result) {
        abxMediums.value = result as AbxMediumType[]
      }
    })
  }
)

function searchQcRanges(opts: any) {
  abxParams.first = 100;
  abxParams.after = "";
  abxParams.text = opts.filterText;
  abxParams.filterAction = true;
  fetchQcRanges(abxParams);
}

function showMoreQcRanges(opts: any): void {
  abxParams.first = opts.fetchCount;
  abxParams.after = qcRangesPageInfo?.value?.endCursor!;
  abxParams.text = opts.filterText;
  abxParams.filterAction = false;
  fetchQcRanges(abxParams);
}

const resetQcRange = () => resetForm();

function FormManager(create: boolean, obj = {} as AbxQCRangeType): void {
  formAction.value = create;
  showModal.value = true;
  formTitle.value = (create ? 'Create' : 'Edit') + ' ' + "QcRange";
  if (create) {
    currentUid.value = null;
    resetForm();
  } else {
    currentUid.value = obj.uid ?? null;
    setValues({
      guideline: obj.guideline ?? null,
      year: obj.year ?? '',
      strain: obj.strain ?? '',
      referenceTable: obj.referenceTable ?? '',
      whonetOrgCode: obj.whonetOrgCode ?? '',
      antibiotic: obj.antibiotic ?? '',
      abxTest: obj.abxTest ?? '',
      whonetAbxCode: obj.whonetAbxCode ?? '',
      method: obj.method ?? '',
      medium: obj.medium ?? null,
      minimum: obj.minimum ?? '',
      maximum: obj.maximum ?? '',
      comments: obj.comments ?? '',
    });
  }
}

const saveForm = handleSubmit((formValues) => {
  const payload = {
    guidelineUid: formValues.guideline?.uid!,
    year: Number(formValues.year),
    strain: formValues.strain,
    referenceTable: formValues.referenceTable,
    whonetOrgCode: formValues.whonetOrgCode,
    antibiotic: formValues.antibiotic,
    abxTest: formValues.abxTest,
    whonetAbxCode: formValues.whonetAbxCode,
    method: formValues.method,
    mediumUid: formValues.medium?.uid ?? null,
    minimum: formValues.minimum ?? null,
    maximum: formValues.maximum ?? null,
  };

  if (formAction.value === true) {
    withClientMutation<AddAbxQcRangeMutation, AddAbxQcRangeMutationVariables>(
        AddAbxQcRangeDocument, { payload }, "createAbxQcRange"
    ).then((result) => {
      if(result) {
        qcRanges.value = addListsUnique(qcRanges.value!, [result], 'uid');
      }
    });
  }

  if (formAction.value === false && currentUid.value) {
    withClientMutation<EditAbxQcRangeMutation, EditAbxQcRangeMutationVariables>(
      EditAbxQcRangeDocument, { uid: currentUid.value, payload }, 
      "updateAbxQcRange"
    ).then((result: any) => {
      if(result) {
        const index = qcRanges.value!.findIndex(abx => abx.uid == result.uid);
        qcRanges.value![index] = result;
      }
    });
  }

  showModal.value = false;
});

</script>

<template>

  <beak-heading title="Quality Control range">
    <!-- <beak-button @click="FormManager(true)">Add Medium</beak-button> -->
  </beak-heading>

  <div class="rounded-lg shadow-sm bg-card p-6">
    <DataTable 
      :columns="tableColumns" 
      :data="qcRanges" 
      :toggleColumns="true" 
      :loading="fetchingQcRanges" 
      :paginable="true"
      :pageMeta="{
        fetchCount: abxParams.first,
        hasNextPage: true,
        countNone,
      }" 
      :searchable="true" 
      :filterable="false" 
      @onSearchKeyUp="searchQcRanges" 
      @onSearchFocus="resetQcRange"
      @onPaginate="showMoreQcRanges" 
      :selectable="false">
      <template v-slot:footer> </template>
    </DataTable>
  </div>

  <!-- QcRange Form Modal -->
  <beak-modal v-if="showModal" @close="showModal = false" :content-width="'w-1/2'">
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
              v-model="guideline"
              :options="abxGuidelines"
              :searchable="true"
              label="name"
              class="mt-1"
              >
              <!-- track-by="uid" -->
              </VueMultiselect>
              <p v-if="errors.guideline" class="text-sm text-destructive">{{ errors.guideline }}</p>
            </label>
            <label class="block">
              <span class="text-sm font-medium text-foreground">Year</span>
              <input
                type="number"
                class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                v-model.number="year"
                placeholder="Enter year"
              />
              <p v-if="errors.year" class="text-sm text-destructive">{{ errors.year }}</p>
            </label>
          </div>
        </div>

        <!-- Coding Systems -->
        <div class="space-y-4">
          <div class="grid grid-cols-3 gap-4">
            <label class="block">
              <span class="text-sm font-medium text-foreground">Strain</span>
              <input
                class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                v-model="strain"
                placeholder="Strain"
              />
              <p v-if="errors.strain" class="text-sm text-destructive">{{ errors.strain }}</p>
            </label>
            <label class="block">
              <span class="text-sm font-medium text-foreground">Reference Table</span>
              <input
                class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                v-model="referenceTable"
                placeholder="Reference Table"
              />
              <p v-if="errors.referenceTable" class="text-sm text-destructive">{{ errors.referenceTable }}</p>
            </label>
            <label class="block">
              <span class="text-sm font-medium text-foreground">Whonet Org Code</span>
              <input
                class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                v-model="whonetOrgCode"
                placeholder="Whonet Org Code"
              />
              <p v-if="errors.whonetOrgCode" class="text-sm text-destructive">{{ errors.whonetOrgCode }}</p>
            </label>
            <label class="block">
              <span class="text-sm font-medium text-foreground">Antibiotic</span>
              <input
                class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                v-model="antibiotic"
                placeholder="Antibiotic"
              />
              <p v-if="errors.antibiotic" class="text-sm text-destructive">{{ errors.antibiotic }}</p>
            </label>
            <label class="block">
              <span class="text-sm font-medium text-foreground">Abx Test</span>
              <input
                class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                v-model="abxTest"
                placeholder="Abx Test"
              />
              <p v-if="errors.abxTest" class="text-sm text-destructive">{{ errors.abxTest }}</p>
            </label>
            <label class="block">
              <span class="text-sm font-medium text-foreground">Whonet Abx Code</span>
              <input
                class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                v-model="whonetAbxCode"
                placeholder="Whonet Abx Code"
              />
              <p v-if="errors.whonetAbxCode" class="text-sm text-destructive">{{ errors.whonetAbxCode }}</p>
            </label>
            <label class="block">
              <span class="text-sm font-medium text-foreground">Method</span>
              <input
                class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                v-model="method"
                placeholder="Method"
              />
              <p v-if="errors.method" class="text-sm text-destructive">{{ errors.method }}</p>
            </label>
            <label class="block">
              <span class="text-sm font-medium text-foreground">Medium</span>
              <VueMultiselect
              v-model="medium"
              :options="abxMediums"
              :searchable="true"
              label="name"
              class="mt-1"
              >
              </VueMultiselect>
            </label>
            <label class="block">
              <span class="text-sm font-medium text-foreground">Minimum</span>
              <input
                class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                v-model="minimum"
                placeholder="Minimum"
              />
            </label>
            <label class="block">
              <span class="text-sm font-medium text-foreground">Maximum</span>
              <input
                class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                v-model="maximum"
                placeholder="Maximum"
              />
            </label>
          </div>
        </div>

        <!-- Additional Information -->
        <div class="space-y-4">
          <label class="block">
            <span class="text-sm font-medium text-foreground">Comments</span>
            <textarea
              class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              v-model="comments"
              rows="3"
              placeholder="Additional comments..."
            ></textarea>
          </label>
        </div>

        <hr class="border-border"/>
        
        <button
          type="submit"
          class="w-full bg-primary text-primary-foreground rounded-sm px-4 py-2 transition-colors duration-300 hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
        >
          Save QcRange
        </button>
      </form>
    </template>
  </beak-modal>

</template>


<style scoped>
/* Remove the toggle-checkbox styles as they are not needed */
</style>
