<script setup lang="ts">
import {computed, defineAsyncComponent, onMounted, reactive, ref, h} from 'vue';
import { addListsUnique } from '@/utils';
import useApiUtil from '@/composables/api_util';
import { AbxAntibioticType, AbxGuidelineType } from "@/types/gql";
import { GetAbxAntibioticAllDocument, GetAbxAntibioticAllQuery, GetAbxAntibioticAllQueryVariables, GetAbxGuidelinesAllDocument, GetAbxGuidelinesAllQuery, GetAbxGuidelinesAllQueryVariables, GetAbxLaboratoryAntibioticsDocument, GetAbxLaboratoryAntibioticsQuery, GetAbxLaboratoryAntibioticsQueryVariables } from "@/graphql/operations/microbiology.queries";
import { AddAbxAntibioticMutation, AddAbxAntibioticMutationVariables, AddAbxAntibioticDocument, EditAbxAntibioticMutation, EditAbxAntibioticMutationVariables, EditAbxAntibioticDocument, UseAbxAntibioticMutation, UseAbxAntibioticMutationVariables, UseAbxAntibioticDocument } from '@/graphql/operations/microbiology.mutations';

const DataTable = defineAsyncComponent(
  () => import('@/components/ui/datatable/FelDataTable.vue')
)
const VueMultiselect = defineAsyncComponent(
  () => import('vue-multiselect')
)

const {withClientMutation, withClientQuery} = useApiUtil()

let showModal = ref<boolean>(false);
let formTitle = ref<string>('');
let form = reactive({}) as AbxAntibioticType;
const formAction = ref<boolean>(true);

const fetchingAntibiotics = ref<boolean>(false);
const antibiotics = ref<AbxAntibioticType[]>([]);
const laboratoryAntibiotics = ref<AbxAntibioticType[]>([]);

const abxGuidelines = ref<AbxGuidelineType[]>([]);

let abxParams = reactive({
  first: 50,
  after: "",
  text: "",
  sortBy: ["-name"],
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

// Helper functions for consistent styling
function getGuidelineColor(guideline: string): string {
  const colors = {
    'CLSI': '#E3F2FD',    // Light Blue
    'EUCAST': '#F1F8E9',  // Light Green
    'WHO': '#FFF3E0',     // Light Orange
    'default': '#F5F5F5'  // Light Gray
  };
  return colors[guideline] || colors.default;
}

function getTextColor(guideline: string): string {
  const colors = {
    'CLSI': '#1565C0',    // Dark Blue
    'EUCAST': '#2E7D32',  // Dark Green
    'WHO': '#E65100',     // Dark Orange
    'default': '#616161'  // Dark Gray
  };
  return colors[guideline] || colors.default;
}

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
    name: "Name",
    value: "name",
    sortable: false,
    sortBy: "asc",
    hidden: false,
  },
  {
    name: "Guidelines",
    value: "guidelines",
    sortable: false,
    sortBy: "asc",
    hidden: false,
    customRender: function (abx, _) {
      return h("div", { 
        class: "flex flex-wrap gap-2" 
      }, [
      abx.guidelines?.map(guideline => 
          h("span", {
            class: "px-2 py-1 text-sm rounded-md font-medium",
            style: {
              backgroundColor: getGuidelineColor(guideline.name),
              color: getTextColor(guideline.name)
            }
          }, guideline.name)
        )
      ]);
    },
  },
  {
    name: "WHONET Code",
    value: "whonetAbxCode",
    sortable: false,
    sortBy: "asc",
    hidden: false,
  },
  {
    name: "WHO Code",
    value: "whoCode",
    sortable: false,
    sortBy: "asc",
    hidden: true,
  },
  {
    name: "DIN Code",
    value: "dinCode",
    sortable: false,
    sortBy: "asc",
    hidden: true,
  },
  {
    name: "JAC Code",
    value: "jacCode",
    sortable: false,
    sortBy: "asc",
    hidden: true,
  },
  {
    name: "EUCAST Code",
    value: "eucastCode",
    sortable: false,
    sortBy: "asc",
    hidden: true,
  },
  {
    name: "User Code",
    value: "userCode",
    sortable: false,
    sortBy: "asc",
    hidden: true,
  },
  {
    name: "ABX Number",
    value: "abxNumber",
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
    name: "ATC Code",
    value: "atcCode",
    sortable: false,
    sortBy: "asc",
    hidden: false,
  },
  {
    name: "Class",
    value: "class",
    sortable: false,
    sortBy: "asc",
    hidden: false,
  },
  {
    name: "Subclass",
    value: "subclass",
    sortable: false,
    sortBy: "asc",
    hidden: true,
  },
  {
    name: "Professional Class",
    value: "profClass",
    sortable: false,
    sortBy: "asc",
    hidden: true,
  },
  {
    name: "CIA Category",
    value: "ciaCategory",
    sortable: false,
    sortBy: "asc",
    hidden: false,
  },
  {
    name: "CLSI Order",
    value: "clsiOrder",
    sortable: false,
    sortBy: "asc",
    hidden: false,
  },
  {
    name: "EUCAST Order",
    value: "eucastOrder",
    sortable: false,
    sortBy: "asc",
    hidden: false,
  },
  {
    name: "Human Use",
    value: "human",
    sortable: false,
    sortBy: "asc",
    hidden: false,
  },
  {
    name: "Veterinary Use",
    value: "veterinary",
    sortable: false,
    sortBy: "asc",
    hidden: false,
  },
  {
    name: "Animal Group",
    value: "animalGp",
    sortable: false,
    sortBy: "asc",
    hidden: true,
  },
  {
    name: "LOINC Comp",
    value: "loinccomp",
    sortable: false,
    sortBy: "asc",
    hidden: true,
  },
  {
    name: "LOINC Gen",
    value: "loincgen",
    sortable: false,
    sortBy: "asc",
    hidden: true,
  },
  {
    name: "LOINC Disk",
    value: "loincdisk",
    sortable: false,
    sortBy: "asc",
    hidden: true,
  },
  {
    name: "LOINC MIC",
    value: "loincmic",
    sortable: false,
    sortBy: "asc",
    hidden: true,
  },
  {
    name: "LOINC E-Test",
    value: "loincetest",
    sortable: false,
    sortBy: "asc",
    hidden: true,
  },
  {
    name: "LOINC Slow",
    value: "loincslow",
    sortable: false,
    sortBy: "asc",
    hidden: true,
  },
  {
    name: "LOINC AFB",
    value: "loincafb",
    sortable: false,
    sortBy: "asc",
    hidden: true,
  },
  {
    name: "LOINC SBT",
    value: "loincsbt",
    sortable: false,
    sortBy: "asc",
    hidden: true,
  },
  {
    name: "LOINC MLC",
    value: "loincmlc",
    sortable: false,
    sortBy: "asc",
    hidden: true,
  },
  {
    name: "Comments",
    value: "comments",
    sortable: false,
    sortBy: "asc",
    hidden: true,
  },
  {
    name: "",
    value: "",
    sortable: false,
    sortBy: "asc",
    hidden: false,
    customRender: function (abx, column) {
      if(laboratoryAntibiotics.value.find(labAbx => labAbx.uid == abx.uid)) {
        return h("button", {
          type: "button",
          class: "bg-destructive text-primary-foreground py-1 px-2 rounded-sm leading-none",
          innerHTML: "in use",
          disabled: true,
        }, []);
      }
      return h(
        "button",
        {
          type: "button",
          class: "bg-primary text-primary-foreground py-1 px-2 rounded-sm leading-none",
          innerHTML: "use",
          onClick: () => useAntibiotic(abx),
        },
        []
      );
    },
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

function useAntibiotic(abx) {
  withClientMutation<UseAbxAntibioticMutation, UseAbxAntibioticMutationVariables>(
        UseAbxAntibioticDocument, { uid: abx.uid }, "useAbxAntibiotic"
    ).then((result) => {
      if(result) {
        laboratoryAntibiotics.value.push(result as AbxAntibioticType);
      }
    });
}

function fetchAntibiotics(params){
  withClientQuery<GetAbxAntibioticAllQuery, GetAbxAntibioticAllQueryVariables>(
      GetAbxAntibioticAllDocument, {
        text: params.text,
        pageSize: params.first,
        sortBy: params.sortBy,
      }, undefined
  ).then(result => {
    const page = result.abxAntibioticAll;
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
    fetchingAntibiotics.value = false;
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
    //
    fetchAntibiotics(abxParams);
    //
    withClientQuery<GetAbxLaboratoryAntibioticsQuery, GetAbxLaboratoryAntibioticsQueryVariables>(
        GetAbxLaboratoryAntibioticsDocument, {}, "abxLaboratoryAntibiotics"
    ).then((result) => {
      if (result) {
        laboratoryAntibiotics.value  = result as AbxAntibioticType[]
      }
    })
  }
)

function searchAntibiotics(opts: any) {
  abxParams.first = 100;
  abxParams.after = "";
  abxParams.text = opts.filterText;
  abxParams.filterAction = true;
  fetchAntibiotics(abxParams);
}

function showMoreAntibiotics(opts: any): void {
  abxParams.first = opts.fetchCount;
  abxParams.after = antibioticPageInfo?.value?.endCursor!;
  abxParams.text = opts.filterText;
  abxParams.filterAction = false;
  fetchAntibiotics(abxParams);
}

const resetAntibiotic = () => Object.assign(form, {}) as AbxAntibioticType;

function FormManager(create: boolean, obj = {} as AbxAntibioticType): void {
  formAction.value = create;
  showModal.value = true;
  formTitle.value = (create ? 'Create' : 'Edit') + ' ' + "Antibiotic";
  if (create) {
    Object.assign(form, {} as AbxAntibioticType);
  } else {
    Object.assign(form, {...obj});
  }
}

function saveForm(): void {
  const payload = {
    name: form?.name,
    guidelines: form.guidelines?.map(g => g.uid!),
    whonetAbxCode: form?.whonetAbxCode,
    whoCode: form?.whoCode,
    dinCode: form?.dinCode,
    jacCode: form?.jacCode,
    eucastCode: form?.eucastCode,
    userCode: form?.userCode,
    abxNumber: form?.abxNumber,
    potency: form?.potency,
    atcCode: form?.atcCode,
    class: form?.class,
    subclass: form?.subclass,
    profClass: form?.profClass,
    ciaCategory: form?.ciaCategory,
    clsiOrder: form?.clsiOrder,
    eucastOrder: form?.eucastOrder,
    human: form?.human,
    veterinary: form?.veterinary,
    animalGp: form?.animalGp,
    loinccomp: form?.loinccomp,
    loincgen: form?.loincgen,
    loincdisk: form?.loincdisk,
    loincmic: form?.loincmic,
    loincetest: form?.loincetest,
    loincslow: form?.loincslow,
    loincafb: form?.loincafb,
    loincsbt: form?.loincsbt,
    loincmlc: form?.loincmlc,
    comments: form?.comments,
  }

  if (formAction.value === true) {
    withClientMutation<AddAbxAntibioticMutation, AddAbxAntibioticMutationVariables>(
        AddAbxAntibioticDocument, { payload }, "createAbxAntibiotic"
    ).then((result) => {
      if(result) {
        antibiotics.value = addListsUnique(antibiotics.value!, [result], 'uid');
      }
    });
  }

  if (formAction.value === false) {
    withClientMutation<EditAbxAntibioticMutation, EditAbxAntibioticMutationVariables>(
      EditAbxAntibioticDocument, { uid: form.uid!, payload }, 
      "updateAbxAntibiotic"
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
  <div class="space-y-6">
    <fel-heading title="Antibiotics">
      <fel-button @click="FormManager(true)">Add Antibiotic</fel-button>
    </fel-heading>

    <div class="shadow-sm rounded-lg bg-card p-6">
      <DataTable 
        :columns="tableColumns" 
        :data="antibiotics" 
        :toggleColumns="true" 
        :loading="fetchingAntibiotics" 
        :paginable="true"
        :pageMeta="{
          fetchCount: abxParams.first,
          hasNextPage: true,
          countNone,
        }" 
        :searchable="true" 
        :filterable="false" 
        @onSearchKeyUp="searchAntibiotics" 
        @onSearchFocus="resetAntibiotic"
        @onPaginate="showMoreAntibiotics" 
        :selectable="false">
        <template v-slot:footer> </template>
      </DataTable>
    </div>
  </div>

  <!-- Antibiotic Form Modal -->
  <fel-modal v-if="showModal" @close="showModal = false" :content-width="'w-1/2'">
    <template v-slot:header>
      <h3 class="text-lg font-semibold text-foreground">{{ formTitle }}</h3>
    </template>

    <template v-slot:body>
      <form class="space-y-6">
        <!-- Basic Information -->
        <div class="space-y-4">
          <h4 class="text-lg font-semibold text-foreground">Basic Information</h4>
          <div class="grid grid-cols-2 gap-6">
            <label class="block col-span-1 space-y-2">
              <span class="text-sm font-medium text-foreground">Antibiotic Name</span>
              <input
                class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                v-model="form.name"
                placeholder="Enter antibiotic name"
              />
            </label>
            <label class="block col-span-1 space-y-2">
              <span class="text-sm font-medium text-foreground">Guidelines</span>
              <VueMultiselect
                v-model="form.guidelines"
                :options="abxGuidelines"
                :multiple="true"
                :searchable="true"
                label="name"
                class="multiselect-blue"
              />
            </label>
          </div>
        </div>

        <!-- Coding Systems -->
        <div class="space-y-4">
          <h4 class="text-lg font-semibold text-foreground">Coding Systems</h4>
          <div class="grid grid-cols-3 gap-6">
            <label class="block col-span-1 space-y-2">
              <span class="text-sm font-medium text-foreground">WHONET Code</span>
              <input
                class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                v-model="form.whonetAbxCode"
                placeholder="WHONET code"
              />
            </label>
            <label class="block col-span-1 space-y-2">
              <span class="text-sm font-medium text-foreground">WHO Code</span>
              <input
                class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                v-model="form.whoCode"
                placeholder="WHO code"
              />
            </label>
            <label class="block col-span-1 space-y-2">
              <span class="text-sm font-medium text-foreground">DIN Code</span>
              <input
                class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                v-model="form.dinCode"
                placeholder="DIN code"
              />
            </label>
            <label class="block col-span-1 space-y-2">
              <span class="text-sm font-medium text-foreground">JAC Code</span>
              <input
                class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                v-model="form.jacCode"
                placeholder="JAC code"
              />
            </label>
            <label class="block col-span-1 space-y-2">
              <span class="text-sm font-medium text-foreground">EUCAST Code</span>
              <input
                class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                v-model="form.eucastCode"
                placeholder="EUCAST code"
              />
            </label>
            <label class="block col-span-1 space-y-2">
              <span class="text-sm font-medium text-foreground">User Code</span>
              <input
                class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                v-model="form.userCode"
                placeholder="User code"
              />
            </label>
          </div>
        </div>

        <!-- Classification -->
        <div class="space-y-4">
          <h4 class="text-lg font-semibold text-foreground">Classification</h4>
          <div class="grid grid-cols-2 gap-6">
            <label class="block col-span-1 space-y-2">
              <span class="text-sm font-medium text-foreground">Class</span>
              <input
                class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                v-model="form.class"
                placeholder="Antibiotic class"
              />
            </label>
            <label class="block col-span-1 space-y-2">
              <span class="text-sm font-medium text-foreground">Subclass</span>
              <input
                class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                v-model="form.subclass"
                placeholder="Antibiotic subclass"
              />
            </label>
            <label class="block col-span-1 space-y-2">
              <span class="text-sm font-medium text-foreground">Professional Class</span>
              <input
                class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                v-model="form.profClass"
                placeholder="Professional class"
              />
            </label>
            <label class="block col-span-1 space-y-2">
              <span class="text-sm font-medium text-foreground">CIA Category</span>
              <input
                class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                v-model="form.ciaCategory"
                placeholder="CIA category"
              />
            </label>
          </div>
        </div>

        <!-- Technical Details -->
        <div class="space-y-4">
          <h4 class="text-lg font-semibold text-foreground">Technical Details</h4>
          <div class="grid grid-cols-2 gap-6">
            <label class="block col-span-1 space-y-2">
              <span class="text-sm font-medium text-foreground">ABX Number</span>
              <input
                class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                v-model="form.abxNumber"
                placeholder="ABX number"
              />
            </label>
            <label class="block col-span-1 space-y-2">
              <span class="text-sm font-medium text-foreground">Potency</span>
              <input
                class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                v-model="form.potency"
                placeholder="Potency"
              />
            </label>
            <label class="block col-span-1 space-y-2">
              <span class="text-sm font-medium text-foreground">ATC Code</span>
              <input
                class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                v-model="form.atcCode"
                placeholder="ATC code"
              />
            </label>
          </div>
        </div>

        <!-- Usage -->
        <div class="space-y-4">
          <h4 class="text-lg font-semibold text-foreground">Usage</h4>
          <div class="grid grid-cols-2 gap-6">
            <div class="flex items-center space-x-2">
              <input
                type="checkbox"
                class="h-4 w-4 rounded border-input text-primary focus:ring-primary"
                v-model="form.human"
              />
              <span class="text-sm font-medium text-foreground">Human Use</span>
            </div>
            <div class="flex items-center space-x-2">
              <input
                type="checkbox"
                class="h-4 w-4 rounded border-input text-primary focus:ring-primary"
                v-model="form.veterinary"
              />
              <span class="text-sm font-medium text-foreground">Veterinary Use</span>
            </div>
            <label class="block col-span-2 space-y-2">
              <span class="text-sm font-medium text-foreground">Animal Group</span>
              <input
                class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                v-model="form.animalGp"
                placeholder="Animal group"
              />
            </label>
          </div>
        </div>

        <!-- LOINC Codes -->
        <div class="space-y-4">
          <h4 class="text-lg font-semibold text-foreground">LOINC Codes</h4>
          <div class="grid grid-cols-2 gap-6">
            <label class="block col-span-1 space-y-2">
              <span class="text-sm font-medium text-foreground">LOINC Comp</span>
              <input
                class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                v-model="form.loinccomp"
                placeholder="LOINC comp"
              />
            </label>
            <label class="block col-span-1 space-y-2">
              <span class="text-sm font-medium text-foreground">LOINC Gen</span>
              <input
                class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                v-model="form.loincgen"
                placeholder="LOINC gen"
              />
            </label>
            <label class="block col-span-1 space-y-2">
              <span class="text-sm font-medium text-foreground">LOINC Disk</span>
              <input
                class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                v-model="form.loincdisk"
                placeholder="LOINC disk"
              />
            </label>
            <label class="block col-span-1 space-y-2">
              <span class="text-sm font-medium text-foreground">LOINC MIC</span>
              <input
                class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                v-model="form.loincmic"
                placeholder="LOINC MIC"
              />
            </label>
            <label class="block col-span-1 space-y-2">
              <span class="text-sm font-medium text-foreground">LOINC E-Test</span>
              <input
                class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                v-model="form.loincetest"
                placeholder="LOINC E-test"
              />
            </label>
            <label class="block col-span-1 space-y-2">
              <span class="text-sm font-medium text-foreground">LOINC Slow</span>
              <input
                class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                v-model="form.loincslow"
                placeholder="LOINC slow"
              />
            </label>
            <label class="block col-span-1 space-y-2">
              <span class="text-sm font-medium text-foreground">LOINC AFB</span>
              <input
                class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                v-model="form.loincafb"
                placeholder="LOINC AFB"
              />
            </label>
            <label class="block col-span-1 space-y-2">
              <span class="text-sm font-medium text-foreground">LOINC SBT</span>
              <input
                class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                v-model="form.loincsbt"
                placeholder="LOINC SBT"
              />
            </label>
            <label class="block col-span-1 space-y-2">
              <span class="text-sm font-medium text-foreground">LOINC MLC</span>
              <input
                class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                v-model="form.loincmlc"
                placeholder="LOINC MLC"
              />
            </label>
          </div>
        </div>

        <!-- Additional Information -->
        <div class="space-y-4">
          <h4 class="text-lg font-semibold text-foreground">Additional Information</h4>
          <label class="block space-y-2">
            <span class="text-sm font-medium text-foreground">Comments</span>
            <textarea
              class="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              v-model="form.comments"
              rows="3"
              placeholder="Additional comments..."
            ></textarea>
          </label>
        </div>

        <hr class="border-border" />
        
        <button
          type="button"
          @click.prevent="saveForm()"
          class="inline-flex w-full items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
        >
          Save Antibiotic
        </button>
      </form>
    </template>
  </fel-modal>
</template>

<style lang="postcss" scoped>
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
