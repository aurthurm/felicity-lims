<script setup lang="ts">
import {computed, defineAsyncComponent, onMounted, reactive, ref, h} from 'vue';
import { useForm, useField } from 'vee-validate';
import * as yup from 'yup';
import { addListsUnique } from '@/utils';
import useApiUtil from '@/composables/api_util';
import { AbxExpertInterpretationRuleType } from "@/types/gql";
import { GetAbxExpertInterpretationRuleAllDocument, GetAbxExpertInterpretationRuleAllQuery, GetAbxExpertInterpretationRuleAllQueryVariables } from "@/graphql/operations/microbiology.queries";
import { AddAbxExpertInterpretationRuleMutation, AddAbxExpertInterpretationRuleMutationVariables, AddAbxExpertInterpretationRuleDocument, EditAbxExpertInterpretationRuleMutation, EditAbxExpertInterpretationRuleMutationVariables, EditAbxExpertInterpretationRuleDocument } from '@/graphql/operations/microbiology.mutations';

const DataTable = defineAsyncComponent(
  () => import('@/components/ui/datatable/FelDataTable.vue')
)

const {withClientMutation, withClientQuery} = useApiUtil()

let showModal = ref<boolean>(false);
let formTitle = ref<string>('');
const formAction = ref<boolean>(true);
const currentUid = ref<string | null>(null);

const expertInterpretationSchema = yup.object({
  ruleCode: yup.string().trim().required('Rule code is required'),
  organismCode: yup.string().trim().required('Organism code is required'),
  organismCodeType: yup.string().trim().required('Organism code type is required'),
  ruleCriteria: yup.string().trim().required('Rule criteria is required'),
  affectedAntibiotics: yup.string().trim().required('Affected antibiotics are required'),
  antibioticExceptions: yup.string().trim().required('Antibiotic exceptions are required'),
});

const { handleSubmit, resetForm, setValues, errors } = useForm({
  validationSchema: expertInterpretationSchema,
  initialValues: {
    ruleCode: '',
    description: '',
    organismCode: '',
    organismCodeType: '',
    ruleCriteria: '',
    affectedAntibiotics: '',
    antibioticExceptions: '',
  },
});
const { value: ruleCode } = useField<string>('ruleCode');
const { value: description } = useField<string>('description');
const { value: organismCode } = useField<string>('organismCode');
const { value: organismCodeType } = useField<string>('organismCodeType');
const { value: ruleCriteria } = useField<string>('ruleCriteria');
const { value: affectedAntibiotics } = useField<string>('affectedAntibiotics');
const { value: antibioticExceptions } = useField<string>('antibioticExceptions');

const fetchingExpertInterpretationRules = ref<boolean>(false);
const abxExptResPhenotypes = ref<AbxExpertInterpretationRuleType[]>([]);

let abxParams = reactive({
  first: 50,
  after: "",
  text: "",
  sortBy: ["rule_code"],
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
    name: "Rule Code",
    value: "ruleCode",
    sortable: false,
    sortBy: "asc",
    hidden: false,
  },
  {
    name: "Description",
    value: "description",
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
    name: "Rule Criteria",
    value: "ruleCriteria",
    sortable: false,
    sortBy: "asc",
    hidden: false,
  },
  {
    name: "Affected Antibiotics",
    value: "affectedAntibiotics",
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

function fetchExpertInterpretationRules(params){
  withClientQuery<GetAbxExpertInterpretationRuleAllQuery, GetAbxExpertInterpretationRuleAllQueryVariables>(
      GetAbxExpertInterpretationRuleAllDocument, {
        text: params.text,
        pageSize: params.first,
        sortBy: params.sortBy,
      }, undefined
  ).then(result => {
    const page = result.abxExpertInterpretationRuleAll;
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
    fetchingExpertInterpretationRules.value = false;
  });
};

onMounted(() =>  {
    fetchExpertInterpretationRules(abxParams);
  }
)

function searchExpertInterpretationRules(opts: any) {
  abxParams.first = 100;
  abxParams.after = "";
  abxParams.text = opts.filterText;
  abxParams.filterAction = true;
  fetchExpertInterpretationRules(abxParams);
}

function showMoreExpertInterpretationRules(opts: any): void {
  abxParams.first = opts.fetchCount;
  abxParams.after = abxExptResPhenotypesPageInfo?.value?.endCursor!;
  abxParams.text = opts.filterText;
  abxParams.filterAction = false;
  fetchExpertInterpretationRules(abxParams);
}

const resetExpertInterpretationRule = () => resetForm();

function FormManager(create: boolean, obj = {} as AbxExpertInterpretationRuleType): void {
  formAction.value = create;
  showModal.value = true;
  formTitle.value = (create ? 'Create' : 'Edit') + ' ' + "ExpertInterpretationRule";
  if (create) {
    currentUid.value = null;
    resetForm();
  } else {
    currentUid.value = obj.uid ?? null;
    setValues({
      ruleCode: obj.ruleCode ?? '',
      description: obj.description ?? '',
      organismCode: obj.organismCode ?? '',
      organismCodeType: obj.organismCodeType ?? '',
      ruleCriteria: obj.ruleCriteria ?? '',
      affectedAntibiotics: obj.affectedAntibiotics ?? '',
      antibioticExceptions: obj.antibioticExceptions ?? '',
    });
  }
}

const saveForm = handleSubmit((formValues) => {
  const payload = {
    ruleCode: formValues.ruleCode,
    description: formValues.description,
    organismCode: formValues.organismCode,
    organismCodeType: formValues.organismCodeType,
    ruleCriteria: formValues.ruleCriteria,
    affectedAntibiotics: formValues.affectedAntibiotics,
    antibioticExceptions: formValues.antibioticExceptions,
  }

  if (formAction.value === true) {
    withClientMutation<AddAbxExpertInterpretationRuleMutation, AddAbxExpertInterpretationRuleMutationVariables>(
        AddAbxExpertInterpretationRuleDocument, { payload }, "createAbxExpertInterpretationRule"
    ).then((result) => {
      if(result) {
        abxExptResPhenotypes.value = addListsUnique(abxExptResPhenotypes.value!, [result], 'uid');
      }
    });
  }

  if (formAction.value === false && currentUid.value) {
    withClientMutation<EditAbxExpertInterpretationRuleMutation, EditAbxExpertInterpretationRuleMutationVariables>(
      EditAbxExpertInterpretationRuleDocument, { uid: currentUid.value, payload }, 
      "updateAbxExpertInterpretationRule"
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
  <fel-heading title="Expert Interpretation Rules">
    <fel-button @click="FormManager(true)">Add Expert Interpretation Rule</fel-button>
  </fel-heading>

  <div class="rounded-lg bg-card p-6 shadow-sm">
    <DataTable 
      :columns="tableColumns" 
      :data="abxExptResPhenotypes" 
      :toggleColumns="true" 
      :loading="fetchingExpertInterpretationRules" 
      :paginable="true"
      :pageMeta="{
        fetchCount: abxParams.first,
        hasNextPage: true,
        countNone,
      }" 
      :searchable="true" 
      :filterable="false" 
      @onSearchKeyUp="searchExpertInterpretationRules" 
      @onSearchFocus="resetExpertInterpretationRule"
      @onPaginate="showMoreExpertInterpretationRules" 
      :selectable="false">
      <template v-slot:footer> </template>
    </DataTable>
  </div>

  <!-- Expert Interpretation Rule Edit Form Modal -->
  <fel-modal v-if="showModal" @close="showModal = false">
    <template v-slot:header>
      <h3 class="text-lg font-semibold text-foreground">{{ formTitle }}</h3>
    </template>

    <template v-slot:body>
      <form @submit.prevent="saveForm" class="space-y-6">
        <div class="grid grid-cols-2 gap-6">
          <label class="block col-span-1 space-y-2">
            <span class="text-sm font-medium text-foreground">Rule Code</span>
            <input 
              class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" 
              v-model="ruleCode" 
              placeholder="Rule Code ..." />
            <p v-if="errors.ruleCode" class="text-sm text-destructive">{{ errors.ruleCode }}</p>
          </label>
          <label class="block col-span-1 space-y-2">
            <span class="text-sm font-medium text-foreground">Description</span>
            <input 
              class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" 
              v-model="description" 
              placeholder="Description ..." />
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
            <span class="text-sm font-medium text-foreground">Rule Criteria</span>
            <input 
              class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" 
              v-model="ruleCriteria" 
              placeholder="Rule Criteria ..." />
            <p v-if="errors.ruleCriteria" class="text-sm text-destructive">{{ errors.ruleCriteria }}</p>
          </label>
          <label class="block col-span-1 space-y-2">
            <span class="text-sm font-medium text-foreground">Affected Antibiotics</span>
            <input 
              class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" 
              v-model="affectedAntibiotics" 
              placeholder="Affected Antibiotics ..." />
            <p v-if="errors.affectedAntibiotics" class="text-sm text-destructive">{{ errors.affectedAntibiotics }}</p>
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


<style scoped>
.toggle-checkbox:checked {
  right: 0;
  border-color: #68D391;
}

.toggle-checkbox:checked + .toggle-label {
  background-color: #68D391;
}
</style>
