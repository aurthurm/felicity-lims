<script setup lang="ts">
import {computed, defineAsyncComponent, onMounted, reactive, ref, h} from 'vue';
import { useForm, useField } from 'vee-validate';
import * as yup from 'yup';
import { addListsUnique } from '@/utils';
import useApiUtil from '@/composables/api_util';
import { AbxExpResPhenotypeType, AbxGuidelineType } from "@/types/gql";
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
const formAction = ref<boolean>(true);
const currentUid = ref<string | null>(null);

const expResPhenotypeSchema = yup.object({
  guideline: yup.object().required('Guideline is required'),
  referenceTable: yup.string().trim().required('Reference table is required'),
  organismCode: yup.string().trim().required('Organism code is required'),
  organismCodeType: yup.string().trim().required('Organism code type is required'),
  exceptionOrganismCode: yup.string().trim().required('Exception organism code is required'),
  exceptionOrganismCodeType: yup.string().trim().required('Exception organism code type is required'),
  abxCode: yup.string().trim().required('Abx code is required'),
  abxCodeType: yup.string().trim().required('Abx code type is required'),
  antibioticExceptions: yup.string().trim().required('Antibiotic exceptions are required'),
});

const { handleSubmit, resetForm, setValues, errors } = useForm({
  validationSchema: expResPhenotypeSchema,
  initialValues: {
    guideline: null,
    referenceTable: '',
    organismCode: '',
    organismCodeType: '',
    exceptionOrganismCode: '',
    exceptionOrganismCodeType: '',
    abxCode: '',
    abxCodeType: '',
    antibioticExceptions: '',
    comments: '',
  },
});
const { value: guideline } = useField<AbxGuidelineType | null>('guideline');
const { value: referenceTable } = useField<string>('referenceTable');
const { value: organismCode } = useField<string>('organismCode');
const { value: organismCodeType } = useField<string>('organismCodeType');
const { value: exceptionOrganismCode } = useField<string>('exceptionOrganismCode');
const { value: exceptionOrganismCodeType } = useField<string>('exceptionOrganismCodeType');
const { value: abxCode } = useField<string>('abxCode');
const { value: abxCodeType } = useField<string>('abxCodeType');
const { value: antibioticExceptions } = useField<string>('antibioticExceptions');
const { value: comments } = useField<string>('comments');

const fetchingExpResPhenotypes = ref<boolean>(false);
const abxExptResPhenotypes = ref<AbxExpResPhenotypeType[]>([]);

const abxGuidelines = ref<AbxGuidelineType[]>([]);

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
        abxGuidelines.value = result as AbxGuidelineType[]
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

const resetExpResPhenotype = () => resetForm();

function FormManager(create: boolean, obj = {} as AbxExpResPhenotypeType): void {
  formAction.value = create;
  showModal.value = true;
  formTitle.value = (create ? 'Create' : 'Edit') + ' ' + "ExpResPhenotype";
  if (create) {
    currentUid.value = null;
    resetForm();
  } else {
    currentUid.value = obj.uid ?? null;
    setValues({
      guideline: obj.guideline ?? null,
      referenceTable: obj.referenceTable ?? '',
      organismCode: obj.organismCode ?? '',
      organismCodeType: obj.organismCodeType ?? '',
      exceptionOrganismCode: obj.exceptionOrganismCode ?? '',
      exceptionOrganismCodeType: obj.exceptionOrganismCodeType ?? '',
      abxCode: obj.abxCode ?? '',
      abxCodeType: obj.abxCodeType ?? '',
      antibioticExceptions: obj.antibioticExceptions ?? '',
      comments: obj.comments ?? '',
    });
  }
}

const saveForm = handleSubmit((formValues) => {
  const payload = {
    guidelineUid: formValues.guideline?.uid!,
    referenceTable: formValues.referenceTable,
    organismCode: formValues.organismCode,
    organismCodeType: formValues.organismCodeType,
    exceptionOrganismCode: formValues.exceptionOrganismCode,
    exceptionOrganismCodeType: formValues.exceptionOrganismCodeType,
    abxCode: formValues.abxCode,
    abxCodeType: formValues.abxCodeType,
    antibioticExceptions: formValues.antibioticExceptions,
    comments: formValues.comments,
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

  if (formAction.value === false && currentUid.value) {
    withClientMutation<EditAbxExpResPhenotypeMutation, EditAbxExpResPhenotypeMutationVariables>(
      EditAbxExpResPhenotypeDocument, { uid: currentUid.value, payload }, 
      "updateAbxExpResPhenotype"
    ).then((result: any) => {
      if(result) {
        const index = abxExptResPhenotypes.value!.findIndex(abx => abx.uid == result.uid);
        abxExptResPhenotypes.value![index] = result;
      }
    });
  }

  showModal.value = false;
});

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
      <form @submit.prevent="saveForm" class="space-y-6">
        <div class="grid grid-cols-2 gap-6">
          <label class="block col-span-1 space-y-2">
            <span class="text-sm font-medium text-foreground">Guideline</span>
            <VueMultiselect
              v-model="guideline"
              :options="abxGuidelines"
              :searchable="true"
              :close-on-select="true"
              :show-labels="false"
              track-by="uid"
              label="name"
              class="multiselect-blue"
            />
            <p v-if="errors.guideline" class="text-sm text-destructive">{{ errors.guideline }}</p>
          </label>
          <label class="block col-span-1 space-y-2">
            <span class="text-sm font-medium text-foreground">Reference Table</span>
            <input 
              class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" 
              v-model="referenceTable" 
              placeholder="Reference Table ..." />
            <p v-if="errors.referenceTable" class="text-sm text-destructive">{{ errors.referenceTable }}</p>
          </label>
        </div>

        <div class="grid grid-cols-2 gap-6">
          <label class="block col-span-1 space-y-2">
            <span class="text-sm font-medium text-foreground">Organism Code</span>
            <input 
              class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" 
              v-model="organismCode" 
              placeholder="Organism Code ..." />
            <p v-if="errors.organismCode" class="text-sm text-destructive">{{ errors.organismCode }}</p>
          </label>
          <label class="block col-span-1 space-y-2">
            <span class="text-sm font-medium text-foreground">Organism Code Type</span>
            <input 
              class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" 
              v-model="organismCodeType" 
              placeholder="Organism Code Type ..." />
            <p v-if="errors.organismCodeType" class="text-sm text-destructive">{{ errors.organismCodeType }}</p>
          </label>
        </div>

        <div class="grid grid-cols-2 gap-6">
          <label class="block col-span-1 space-y-2">
            <span class="text-sm font-medium text-foreground">Exception Organism Code</span>
            <input 
              class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" 
              v-model="exceptionOrganismCode" 
              placeholder="Exception Organism Code ..." />
            <p v-if="errors.exceptionOrganismCode" class="text-sm text-destructive">{{ errors.exceptionOrganismCode }}</p>
          </label>
          <label class="block col-span-1 space-y-2">
            <span class="text-sm font-medium text-foreground">Exception Organism Code Type</span>
            <input 
              class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" 
              v-model="exceptionOrganismCodeType" 
              placeholder="Exception Organism Code Type ..." />
            <p v-if="errors.exceptionOrganismCodeType" class="text-sm text-destructive">{{ errors.exceptionOrganismCodeType }}</p>
          </label>
        </div>

        <div class="grid grid-cols-2 gap-6">
          <label class="block col-span-1 space-y-2">
            <span class="text-sm font-medium text-foreground">Abx Code</span>
            <input 
              class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" 
              v-model="abxCode" 
              placeholder="Abx Code ..." />
            <p v-if="errors.abxCode" class="text-sm text-destructive">{{ errors.abxCode }}</p>
          </label>
          <label class="block col-span-1 space-y-2">
            <span class="text-sm font-medium text-foreground">Abx Code Type</span>
            <input 
              class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" 
              v-model="abxCodeType" 
              placeholder="Abx Code Type ..." />
            <p v-if="errors.abxCodeType" class="text-sm text-destructive">{{ errors.abxCodeType }}</p>
          </label>
        </div>

        <div class="grid grid-cols-2 gap-6">
          <label class="block col-span-1 space-y-2">
            <span class="text-sm font-medium text-foreground">Antibiotic Exceptions</span>
            <input 
              class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" 
              v-model="antibioticExceptions" 
              placeholder="Antibiotic Exceptions ..." />
            <p v-if="errors.antibioticExceptions" class="text-sm text-destructive">{{ errors.antibioticExceptions }}</p>
          </label>
          <label class="block col-span-1 space-y-2">
            <span class="text-sm font-medium text-foreground">Comments</span>
            <input 
              class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" 
              v-model="comments" 
              placeholder="Comments ..." />
          </label>
        </div>

        <hr class="border-border" />
        <button 
          type="submit"
          class="inline-flex w-full items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2">
          Save Form
        </button>
      </form>
    </template>
  </fel-modal>
</template>

<style lang="postcss" scoped>
@reference "@tw";
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
