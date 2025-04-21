<script setup lang="ts">
import {computed, defineAsyncComponent, onMounted, reactive, ref, h} from 'vue';
import { addListsUnique } from '@/utils';
import useApiUtil from '@/composables/api_util';
import { AbxExpertInterpretationRuleType, AbxGuidelineType } from "@/types/gql";
import { GetAbxExpertInterpretationRuleAllDocument, GetAbxExpertInterpretationRuleAllQuery, GetAbxExpertInterpretationRuleAllQueryVariables } from "@/graphql/operations/microbiology.queries";
import { AddAbxExpertInterpretationRuleMutation, AddAbxExpertInterpretationRuleMutationVariables, AddAbxExpertInterpretationRuleDocument, EditAbxExpertInterpretationRuleMutation, EditAbxExpertInterpretationRuleMutationVariables, EditAbxExpertInterpretationRuleDocument } from '@/graphql/operations/microbiology.mutations';

const DataTable = defineAsyncComponent(
  () => import('@/components/ui/datatable/FelDataTable.vue')
)

const {withClientMutation, withClientQuery} = useApiUtil()

let showModal = ref<boolean>(false);
let formTitle = ref<string>('');
let form = reactive({}) as AbxExpertInterpretationRuleType;
const formAction = ref<boolean>(true);

const fetchingExpertInterpretationRules = ref<boolean>(false);
const abxExptResPhenotypes = ref<AbxExpertInterpretationRuleType[]>([]);

const abxGuidelines = ref<AbxGuidelineType[]>([]);

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

const resetExpertInterpretationRule = () => Object.assign(form, {}) as AbxExpertInterpretationRuleType;

function FormManager(create: boolean, obj = {} as AbxExpertInterpretationRuleType): void {
  formAction.value = create;
  showModal.value = true;
  formTitle.value = (create ? 'Create' : 'Edit') + ' ' + "ExpertInterpretationRule";
  if (create) {
    Object.assign(form, {} as AbxExpertInterpretationRuleType);
  } else {
    Object.assign(form, {...obj});
  }
}

function saveForm(): void {
  const payload = {
    ruleCode: form.ruleCode,
    description: form.description,
    organismCode: form.organismCode,
    organismCodeType: form.organismCodeType,
    ruleCriteria: form.ruleCriteria,
    affectedAntibiotics: form.affectedAntibiotics,
    antibioticExceptions: form.antibioticExceptions,
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

  if (formAction.value === false) {
    withClientMutation<EditAbxExpertInterpretationRuleMutation, EditAbxExpertInterpretationRuleMutationVariables>(
      EditAbxExpertInterpretationRuleDocument, { uid: form.uid!, payload }, 
      "updateAbxExpertInterpretationRule"
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
      <form class="space-y-6">
        <div class="grid grid-cols-2 gap-6">
          <label class="block col-span-1 space-y-2">
            <span class="text-sm font-medium text-foreground">Rule Code</span>
            <input 
              class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" 
              v-model="form.ruleCode" 
              placeholder="Rule Code ..." />
          </label>
          <label class="block col-span-1 space-y-2">
            <span class="text-sm font-medium text-foreground">Description</span>
            <input 
              class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" 
              v-model="form.description" 
              placeholder="Description ..." />
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
            <span class="text-sm font-medium text-foreground">Rule Criteria</span>
            <input 
              class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" 
              v-model="form.ruleCriteria" 
              placeholder="Rule Criteria ..." />
          </label>
          <label class="block col-span-1 space-y-2">
            <span class="text-sm font-medium text-foreground">Affected Antibiotics</span>
            <input 
              class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" 
              v-model="form.affectedAntibiotics" 
              placeholder="Affected Antibiotics ..." />
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


<style scoped>
.toggle-checkbox:checked {
  right: 0;
  border-color: #68D391;
}

.toggle-checkbox:checked + .toggle-label {
  background-color: #68D391;
}
</style>
