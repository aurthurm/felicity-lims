<script setup lang="ts">
import {computed, defineAsyncComponent, onMounted, reactive, ref, h} from 'vue';
import { addListsUnique } from '@/utils/helpers';
import useApiUtil from '@/composables/api_util';
import { IAbxExpertInterpretationRule, IAbxGuideline } from "@/models/microbiology";
import { GetAbxExpertInterpretationRuleAllDocument, GetAbxExpertInterpretationRuleAllQuery, GetAbxExpertInterpretationRuleAllQueryVariables } from "@/graphql/operations/microbiology.queries";
import { AddAbxExpertInterpretationRuleMutation, AddAbxExpertInterpretationRuleMutationVariables, AddAbxExpertInterpretationRuleDocument, EditAbxExpertInterpretationRuleMutation, EditAbxExpertInterpretationRuleMutationVariables, EditAbxExpertInterpretationRuleDocument } from '@/graphql/operations/microbiology.mutations';

const modal = defineAsyncComponent(
  () => import("@/components/ui/FelModal.vue")
)
const DataTable = defineAsyncComponent(
  () => import('@/components/ui/datatable/FelDataTable.vue')
)

const {withClientMutation, withClientQuery} = useApiUtil()

let showModal = ref<boolean>(false);
let formTitle = ref<string>('');
let form = reactive({}) as IAbxExpertInterpretationRule;
const formAction = ref<boolean>(true);

const fetchingExpertInterpretationRules = ref<boolean>(false);
const abxExptResPhenotypes = ref<IAbxExpertInterpretationRule[]>([]);

const abxGuidelines = ref<IAbxGuideline[]>([]);

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

const resetExpertInterpretationRule = () => Object.assign(form, {}) as IAbxExpertInterpretationRule;

function FormManager(create: boolean, obj = {} as IAbxExpertInterpretationRule): void {
  formAction.value = create;
  showModal.value = true;
  formTitle.value = (create ? 'Create' : 'Edit') + ' ' + "ExpertInterpretationRule";
  if (create) {
    Object.assign(form, {} as IAbxExpertInterpretationRule);
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

  <div class="w-full my-4">
    <!-- <hr>
    <button @click="FormManager(true)"
            class="px-2 py-1 border-primary border text-primary rounded-sm transition duration-300 hover:bg-primary hover:text-primary-foreground focus:outline-none">
      Add ExpertInterpretationRule
    </button> -->
    <hr>

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

  <!-- ExpertInterpretationRule Form Modal -->
  <modal v-if="showModal" @close="showModal = false" :content-width="'w-1/2'">
    <template v-slot:header>
      <h3>{{ formTitle }}</h3>
    </template>

    <template v-slot:body>
      <form action="post" class="p-4">
        <!-- Basic Information -->
        <div class="mb-6">
          <div class="grid grid-cols-2 gap-4">
            <label class="block">
              <span class="text-foreground">Rule Code</span>
              <input
                class="form-input mt-1 block w-full"
                v-model="form.ruleCode"
                placeholder="Rule Code"
              />
            </label>
            <label class="block">
              <span class="text-foreground">Description</span>
              <input
                class="form-input mt-1 block w-full"
                v-model="form.description"
                placeholder="Description"
              />
            </label>
            <label class="block">
              <span class="text-foreground">Organism Code</span>
              <input
                class="form-input mt-1 block w-full"
                v-model="form.organismCode"
                placeholder="Organism Code"
              />
            </label>
            <label class="block">
              <span class="text-foreground">Organism Code Type</span>
              <input
                class="form-input mt-1 block w-full"
                v-model="form.organismCodeType"
                placeholder="Organism Code Type"
              />
            </label>
            <label class="block">
              <span class="text-foreground">Rule Criteria</span>
              <input
                class="form-input mt-1 block w-full"
                v-model="form.ruleCriteria"
                placeholder="Rule Criteria"
              />
            </label>
            <label class="block">
              <span class="text-foreground">Affected Antibiotics</span>
              <input
                class="form-input mt-1 block w-full"
                v-model="form.affectedAntibiotics"
                placeholder="Affected Antibiotics"
              />
            </label>
            <label class="block">
              <span class="text-foreground">Antibiotic Exceptions</span>
              <input
                class="form-input mt-1 block w-full"
                v-model="form.antibioticExceptions"
                placeholder="Antibiotic Exceptions"
              />
            </label>
          </div>
        </div>
        <!-- Coding Systems -->
        <div class="mb-6">
          <div class="grid grid-cols-2 gap-4">
            <label class="block">
              <span class="text-foreground">Strain</span>
              <input
                class="form-input mt-1 block w-full"
                v-model="form.strain"
                placeholder="Strain"
              />
            </label>
            <label class="block">
              <span class="text-foreground">Organism Code</span>
              <input
                class="form-input mt-1 block w-full"
                v-model="form.organismCode"
                placeholder="Organism Code"
              />
            </label>
            <label class="block">
              <span class="text-foreground">Organism Code Type</span>
              <input
                class="form-input mt-1 block w-full"
                v-model="form.organismCodeType"
                placeholder="Organism Code Type"
              />
            </label>
            <label class="block">
              <span class="text-foreground">Exception Organism Code</span>
              <input
                class="form-input mt-1 block w-full"
                v-model="form.exceptionOrganismCode"
                placeholder="Exception Organism Code"
              />
            </label>
            <label class="block">
              <span class="text-foreground">Exception Organism Code Type</span>
              <input
                class="form-input mt-1 block w-full"
                v-model="form.exceptionOrganismCodeType"
                placeholder="Exception Organism Code Type"
              />
            </label>
            <label class="block">
              <span class="text-foreground">Abx Code</span>
              <input
                class="form-input mt-1 block w-full"
                v-model="form.abxCode"
                placeholder="Abx Code"
              />
            </label>
            <label class="block">
              <span class="text-foreground">Abx Code Type</span>
              <input
                class="form-input mt-1 block w-full"
                v-model="form.abxCodeType"
                placeholder="Abx Code Type"
              />
            </label>
            <label class="block">
              <span class="text-foreground">Antibiotic Exceptions</span>
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
          Save ExpertInterpretationRule
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
