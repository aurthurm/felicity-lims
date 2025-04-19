<script setup lang="ts">
import {computed, defineAsyncComponent, onMounted, reactive, ref, h} from 'vue';
import { addListsUnique } from '@/utils/helpers';
import useApiUtil from '@/composables/api_util';
import { IAbxQCRange, IAbxGuideline, IAbxMedium } from "@/models/microbiology";
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
let form = reactive({}) as IAbxQCRange;
const formAction = ref<boolean>(true);

const fetchingQcRanges = ref<boolean>(false);
const qcRanges = ref<IAbxQCRange[]>([]);

const abxGuidelines = ref<IAbxGuideline[]>([]);
const abxMediums = ref<IAbxMedium[]>([]);

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
        abxGuidelines.value = result as IAbxGuideline[]
      }
    })
    fetchQcRanges(abxParams);
    withClientQuery<GetAbxMediumAllQuery, GetAbxMediumAllQueryVariables>(
        GetAbxMediumAllDocument, {}, "abxMediumAll"
    ).then((result) => {
      if (result) {
        abxMediums.value = result as IAbxMedium[]
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

const resetQcRange = () => Object.assign(form, {}) as IAbxQCRange;

function FormManager(create: boolean, obj = {} as IAbxQCRange): void {
  formAction.value = create;
  showModal.value = true;
  formTitle.value = (create ? 'Create' : 'Edit') + ' ' + "QcRange";
  if (create) {
    Object.assign(form, {} as IAbxQCRange);
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

  <div class="w-full my-4">
    <!-- <hr>
    <button @click="FormManager(true)"
            class="px-2 py-1 border-primary border text-primary rounded-sm transition duration-300 hover:bg-primary hover:text-primary-foreground focus:outline-none">
      Add QcRange
    </button> -->
    <hr>

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
              <span class="text-foreground">Guidelines</span>
              <VueMultiselect
              v-model="form.guidelines"
              :options="abxGuidelines"
              :searchable="true"
              label="name"
              >
              <!-- track-by="uid" -->
              </VueMultiselect>
            </label>
            <label class="block">
              <span class="text-foreground">Year</span>
              <input
                type="number"
                class="form-input mt-1 block w-full"
                v-model="form.year"
                placeholder="Enter year"
              />
            </label>
          </div>
        </div>

        <!-- Coding Systems -->
        <div class="mb-6">
          <div class="grid grid-cols-3 gap-4">
            <label class="block">
              <span class="text-foreground">Strain</span>
              <input
                class="form-input mt-1 block w-full"
                v-model="form.strain"
                placeholder="Strain"
              />
            </label>
            <label class="block">
              <span class="text-foreground">Reference Table</span>
              <input
                class="form-input mt-1 block w-full"
                v-model="form.referenceTable"
                placeholder="Reference Table"
              />
            </label>
            <label class="block">
              <span class="text-foreground">Whonet Org Code</span>
              <input
                class="form-input mt-1 block w-full"
                v-model="form.whonetOrgCode"
                placeholder="Whonet Org Code"
              />
            </label>
            <label class="block">
              <span class="text-foreground">Antibiotic</span>
              <input
                class="form-input mt-1 block w-full"
                v-model="form.antibiotic"
                placeholder="Antibiotic"
              />
            </label>
            <label class="block">
              <span class="text-foreground">Abx Test</span>
              <input
                class="form-input mt-1 block w-full"
                v-model="form.abxTest"
                placeholder="Abx Test"
              />
            </label>
            <label class="block">
              <span class="text-foreground">Whonet Abx Code</span>
              <input
                class="form-input mt-1 block w-full"
                v-model="form.whonetAbxCode"
                placeholder="Whonet Abx Code"
              />
            </label>
            <label class="block">
              <span class="text-foreground">Method</span>
              <input
                class="form-input mt-1 block w-full"
                v-model="form.method"
                placeholder="Method"
              />
            </label>
            <label class="block">
              <span class="text-foreground">Medium</span>
              <VueMultiselect
              v-model="form.medium"
              :options="abxMediums"
              :searchable="true"
              label="name"
              >
              </VueMultiselect>
            </label>
            <label class="block">
              <span class="text-foreground">Minimum</span>
              <input
                class="form-input mt-1 block w-full"
                v-model="form.minimum"
                placeholder="Minimum"
              />
            </label>
            <label class="block">
              <span class="text-foreground">Maximum</span>
              <input
                class="form-input mt-1 block w-full"
                v-model="form.maximum"
                placeholder="Maximum"
              />
            </label>
          </div>
        </div>

        <!-- Additional Information -->
        <div class="mb-6">
          <label class="block">
            <span class="text-foreground">Comments</span>
            <textarea
              class="form-textarea mt-1 block w-full"
              v-model="form.comments"
              rows="3"
              placeholder="Additional comments..."
            ></textarea>
          </label>
        </div>

        <hr class="my-6"/>
        
        <button
          type="button"
          @click.prevent="saveForm()"
          class="w-full bg-primary text-primary-foreground rounded-md px-4 py-2 transition-colors duration-300 ease-in-out hover:bg-sky-900 focus:outline-none focus:ring-2 focus:ring-sky-500"
        >
          Save QcRange
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
