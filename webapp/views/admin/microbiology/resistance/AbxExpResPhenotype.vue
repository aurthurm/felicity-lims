<script setup lang="ts">
import {computed, defineAsyncComponent, onMounted, reactive, ref, h} from 'vue';
import { addListsUnique } from '@/utils/helpers';
import useApiUtil from '@/composables/api_util';
import { IAbxExpResPhenotype, IAbxGuideline } from "@/models/microbiology";
import { GetAbxExpResPhenotypeAllDocument, GetAbxExpResPhenotypeAllQuery, GetAbxExpResPhenotypeAllQueryVariables, GetAbxGuidelinesAllDocument, GetAbxGuidelinesAllQuery, GetAbxGuidelinesAllQueryVariables } from "@/graphql/operations/microbiology.queries";
import { AddAbxExpResPhenotypeMutation, AddAbxExpResPhenotypeMutationVariables, AddAbxExpResPhenotypeDocument, EditAbxExpResPhenotypeMutation, EditAbxExpResPhenotypeMutationVariables, EditAbxExpResPhenotypeDocument } from '@/graphql/operations/microbiology.mutations';

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
  //         class: "bg-sky-800 text-white py-1 px-2 rounded-sm leading-none",
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

  <div class="w-full my-4">
    <!-- <hr>
    <button @click="FormManager(true)"
            class="px-2 py-1 border-sky-800 border text-sky-800 rounded-sm transition duration-300 hover:bg-sky-800 hover:text-white focus:outline-none">
      Add ExpResPhenotype
    </button> -->
    <hr>

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

  <!-- ExpResPhenotype Form Modal -->
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
              <!-- track-by="uid" -->
              </VueMultiselect>
            </label>
            <label class="block">
              <span class="text-gray-700">Reference Tables</span>
              <input
                class="form-input mt-1 block w-full"
                v-model="form.referenceTable"
                placeholder="Reference Table"
              />
            </label>
          </div>
        </div>

        <!-- Coding Systems -->
        <div class="mb-6">
          <div class="grid grid-cols-2 gap-4">
            <label class="block">
              <span class="text-gray-700">Strain</span>
              <input
                class="form-input mt-1 block w-full"
                v-model="form.strain"
                placeholder="Strain"
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
              <span class="text-gray-700">Exception Organism Code</span>
              <input
                class="form-input mt-1 block w-full"
                v-model="form.exceptionOrganismCode"
                placeholder="Exception Organism Code"
              />
            </label>
            <label class="block">
              <span class="text-gray-700">Exception Organism Code Type</span>
              <input
                class="form-input mt-1 block w-full"
                v-model="form.exceptionOrganismCodeType"
                placeholder="Exception Organism Code Type"
              />
            </label>
            <label class="block">
              <span class="text-gray-700">Abx Code</span>
              <input
                class="form-input mt-1 block w-full"
                v-model="form.abxCode"
                placeholder="Abx Code"
              />
            </label>
            <label class="block">
              <span class="text-gray-700">Abx Code Type</span>
              <input
                class="form-input mt-1 block w-full"
                v-model="form.abxCodeType"
                placeholder="Abx Code Type"
              />
            </label>
            <label class="block">
              <span class="text-gray-700">Antibiotic Exceptions</span>
              <input
                class="form-input mt-1 block w-full"
                v-model="form.antibioticExceptions"
                placeholder="Antibiotic Exceptions"
              />
            </label>
          </div>
        </div>

        <!-- Additional Information -->
        <div class="mb-6">
          <label class="block">
            <span class="text-gray-700">Comments</span>
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
          class="w-full bg-sky-800 text-white rounded-md px-4 py-2 transition-colors duration-300 ease-in-out hover:bg-sky-900 focus:outline-none focus:ring-2 focus:ring-sky-500"
        >
          Save ExpResPhenotype
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
