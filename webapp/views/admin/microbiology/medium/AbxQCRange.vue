<script setup lang="ts">
import {computed, defineAsyncComponent, onMounted, reactive, ref, h} from 'vue';
import { addListsUnique } from '@/utils';
import useApiUtil from '@/composables/api_util';
import { AbxQCRangeType, AbxGuidelineType, AbxMediumType } from "@/types/gql";
import { GetAbxQcRangeAllDocument, GetAbxQcRangeAllQuery, GetAbxQcRangeAllQueryVariables, GetAbxGuidelinesAllDocument, GetAbxGuidelinesAllQuery, GetAbxGuidelinesAllQueryVariables, GetAbxMediumAllDocument, GetAbxMediumAllQuery, GetAbxMediumAllQueryVariables } from "@/graphql/operations/microbiology.queries";
import { AddAbxQcRangeMutation, AddAbxQcRangeMutationVariables, AddAbxQcRangeDocument, EditAbxQcRangeMutation, EditAbxQcRangeMutationVariables, EditAbxQcRangeDocument } from '@/graphql/operations/microbiology.mutations';

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
let form = reactive({}) as AbxQCRangeType;
const formAction = ref<boolean>(true);

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

const resetQcRange = () => Object.assign(form, {}) as AbxQCRangeType;

function FormManager(create: boolean, obj = {} as AbxQCRangeType): void {
  formAction.value = create;
  showModal.value = true;
  formTitle.value = (create ? 'Create' : 'Edit') + ' ' + "QcRange";
  if (create) {
    Object.assign(form, {} as AbxQCRangeType);
  } else {
    Object.assign(form, {...obj});
  }
}

function saveForm(): void {
  const payload = {
    guidelineUid: form.guideline?.uid!,
    year: form.year,
    strain: form.strain,
    referenceTable: form.referenceTable,
    whonetOrgCode: form.whonetOrgCode,
    antibiotic: form.antibiotic,
    abxTest: form.abxTest,
    whonetAbxCode: form.whonetAbxCode,
    method: form.method,
    medium: form.medium,
    minimum: form.minimum,
    maximum: form.maximum,
  }

  if (formAction.value === true) {
    withClientMutation<AddAbxQcRangeMutation, AddAbxQcRangeMutationVariables>(
        AddAbxQcRangeDocument, { payload }, "createAbxQcRange"
    ).then((result) => {
      if(result) {
        qcRanges.value = addListsUnique(qcRanges.value!, [result], 'uid');
      }
    });
  }

  if (formAction.value === false) {
    withClientMutation<EditAbxQcRangeMutation, EditAbxQcRangeMutationVariables>(
      EditAbxQcRangeDocument, { uid: form.uid!, payload }, 
      "updateAbxQcRange"
    ).then((result: any) => {
      if(result) {
        const index = qcRanges.value!.findIndex(abx => abx.uid == result.uid);
        qcRanges.value![index] = result;
      }
    });
  }

  showModal.value = false;
}

</script>

<template>

  <fel-heading title="Quality Control range">
    <!-- <fel-button @click="FormManager(true)">Add Medium</fel-button> -->
  </fel-heading>

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
              class="mt-1"
              >
              <!-- track-by="uid" -->
              </VueMultiselect>
            </label>
            <label class="block">
              <span class="text-sm font-medium text-foreground">Year</span>
              <input
                type="number"
                class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                v-model="form.year"
                placeholder="Enter year"
              />
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
                v-model="form.strain"
                placeholder="Strain"
              />
            </label>
            <label class="block">
              <span class="text-sm font-medium text-foreground">Reference Table</span>
              <input
                class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                v-model="form.referenceTable"
                placeholder="Reference Table"
              />
            </label>
            <label class="block">
              <span class="text-sm font-medium text-foreground">Whonet Org Code</span>
              <input
                class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                v-model="form.whonetOrgCode"
                placeholder="Whonet Org Code"
              />
            </label>
            <label class="block">
              <span class="text-sm font-medium text-foreground">Antibiotic</span>
              <input
                class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                v-model="form.antibiotic"
                placeholder="Antibiotic"
              />
            </label>
            <label class="block">
              <span class="text-sm font-medium text-foreground">Abx Test</span>
              <input
                class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                v-model="form.abxTest"
                placeholder="Abx Test"
              />
            </label>
            <label class="block">
              <span class="text-sm font-medium text-foreground">Whonet Abx Code</span>
              <input
                class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                v-model="form.whonetAbxCode"
                placeholder="Whonet Abx Code"
              />
            </label>
            <label class="block">
              <span class="text-sm font-medium text-foreground">Method</span>
              <input
                class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                v-model="form.method"
                placeholder="Method"
              />
            </label>
            <label class="block">
              <span class="text-sm font-medium text-foreground">Medium</span>
              <VueMultiselect
              v-model="form.medium"
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
                v-model="form.minimum"
                placeholder="Minimum"
              />
            </label>
            <label class="block">
              <span class="text-sm font-medium text-foreground">Maximum</span>
              <input
                class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                v-model="form.maximum"
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
              v-model="form.comments"
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
  </fel-modal>

</template>


<style scoped>
/* Remove the toggle-checkbox styles as they are not needed */
</style>
