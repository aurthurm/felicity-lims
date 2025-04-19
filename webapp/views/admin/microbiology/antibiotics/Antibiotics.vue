<script setup lang="ts">
import {computed, defineAsyncComponent, onMounted, reactive, ref, h} from 'vue';
import { addListsUnique } from '@/utils/helpers';
import useApiUtil from '@/composables/api_util';
import { IAbxAntibiotic, IAbxGuideline } from "@/models/microbiology";
import { GetAbxAntibioticAllDocument, GetAbxAntibioticAllQuery, GetAbxAntibioticAllQueryVariables, GetAbxGuidelinesAllDocument, GetAbxGuidelinesAllQuery, GetAbxGuidelinesAllQueryVariables, GetAbxLaboratoryAntibioticsDocument, GetAbxLaboratoryAntibioticsQuery, GetAbxLaboratoryAntibioticsQueryVariables } from "@/graphql/operations/microbiology.queries";
import { AddAbxAntibioticMutation, AddAbxAntibioticMutationVariables, AddAbxAntibioticDocument, EditAbxAntibioticMutation, EditAbxAntibioticMutationVariables, EditAbxAntibioticDocument, UseAbxAntibioticMutation, UseAbxAntibioticMutationVariables, UseAbxAntibioticDocument } from '@/graphql/operations/microbiology.mutations';

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
let form = reactive({}) as IAbxAntibiotic;
const formAction = ref<boolean>(true);

const fetchingAntibiotics = ref<boolean>(false);
const antibiotics = ref<IAbxAntibiotic[]>([]);
const laboratoryAntibiotics = ref<IAbxAntibiotic[]>([]);

const abxGuidelines = ref<IAbxGuideline[]>([]);

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
        laboratoryAntibiotics.value.push(result as IAbxAntibiotic);
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
        abxGuidelines.value = result as IAbxGuideline[]
      }
    })
    //
    fetchAntibiotics(abxParams);
    //
    withClientQuery<GetAbxLaboratoryAntibioticsQuery, GetAbxLaboratoryAntibioticsQueryVariables>(
        GetAbxLaboratoryAntibioticsDocument, {}, "abxLaboratoryAntibiotics"
    ).then((result) => {
      if (result) {
        laboratoryAntibiotics.value  = result as IAbxAntibiotic[]
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

const resetAntibiotic = () => Object.assign(form, {}) as IAbxAntibiotic;

function FormManager(create: boolean, obj = {} as IAbxAntibiotic): void {
  formAction.value = create;
  showModal.value = true;
  formTitle.value = (create ? 'Create' : 'Edit') + ' ' + "Antibiotic";
  if (create) {
    Object.assign(form, {} as IAbxAntibiotic);
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

  <div class="w-full my-4">
    <!-- <hr>
    <button @click="FormManager(true)"
            class="px-2 py-1 border-primary border text-primary rounded-sm transition duration-300 hover:bg-primary hover:text-primary-foreground focus:outline-none">
      Add Antibiotic
    </button> -->
    <hr>

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

  <!-- Antibiotic Form Modal -->
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
              <span class="text-foreground">Antibiotic Name</span>
              <input
                class="form-input mt-1 block w-full"
                v-model="form.name"
                placeholder="Enter antibiotic name"
              />
            </label>
            <label class="block">
              <span class="text-foreground">Guidelines</span>
              <VueMultiselect
              v-model="form.guidelines"
              :options="abxGuidelines"
              :multiple="true"
              :searchable="true"
              label="name"
              >
              <!-- track-by="uid" -->
              </VueMultiselect>
            </label>
          </div>
        </div>

        <div class="mb-6">
        </div>

        <!-- Coding Systems -->
        <div class="mb-6">
          <h4 class="text-lg font-semibold mb-4">Coding Systems</h4>
          <div class="grid grid-cols-3 gap-4">
            <label class="block">
              <span class="text-foreground">WHONET Code</span>
              <input
                class="form-input mt-1 block w-full"
                v-model="form.whonetAbxCode"
                placeholder="WHONET code"
              />
            </label>
            <label class="block">
              <span class="text-foreground">WHO Code</span>
              <input
                class="form-input mt-1 block w-full"
                v-model="form.whoCode"
                placeholder="WHO code"
              />
            </label>
            <label class="block">
              <span class="text-foreground">DIN Code</span>
              <input
                class="form-input mt-1 block w-full"
                v-model="form.dinCode"
                placeholder="DIN code"
              />
            </label>
            <label class="block">
              <span class="text-foreground">JAC Code</span>
              <input
                class="form-input mt-1 block w-full"
                v-model="form.jacCode"
                placeholder="JAC code"
              />
            </label>
            <label class="block">
              <span class="text-foreground">EUCAST Code</span>
              <input
                class="form-input mt-1 block w-full"
                v-model="form.eucastCode"
                placeholder="EUCAST code"
              />
            </label>
            <label class="block">
              <span class="text-foreground">User Code</span>
              <input
                class="form-input mt-1 block w-full"
                v-model="form.userCode"
                placeholder="User code"
              />
            </label>
          </div>
        </div>

        <!-- Classification -->
        <div class="mb-6">
          <h4 class="text-lg font-semibold mb-4">Classification</h4>
          <div class="grid grid-cols-2 gap-4">
            <label class="block">
              <span class="text-foreground">Class</span>
              <input
                class="form-input mt-1 block w-full"
                v-model="form.class"
                placeholder="Antibiotic class"
              />
            </label>
            <label class="block">
              <span class="text-foreground">Subclass</span>
              <input
                class="form-input mt-1 block w-full"
                v-model="form.subclass"
                placeholder="Antibiotic subclass"
              />
            </label>
            <label class="block">
              <span class="text-foreground">Professional Class</span>
              <input
                class="form-input mt-1 block w-full"
                v-model="form.profClass"
                placeholder="Professional class"
              />
            </label>
            <label class="block">
              <span class="text-foreground">CIA Category</span>
              <input
                class="form-input mt-1 block w-full"
                v-model="form.ciaCategory"
                placeholder="CIA category"
              />
            </label>
          </div>
        </div>

        <!-- Technical Details -->
        <div class="mb-6">
          <h4 class="text-lg font-semibold mb-4">Technical Details</h4>
          <div class="grid grid-cols-2 gap-4">
            <label class="block">
              <span class="text-foreground">ABX Number</span>
              <input
                class="form-input mt-1 block w-full"
                v-model="form.abxNumber"
                placeholder="ABX number"
              />
            </label>
            <label class="block">
              <span class="text-foreground">Potency</span>
              <input
                class="form-input mt-1 block w-full"
                v-model="form.potency"
                placeholder="Potency"
              />
            </label>
            <label class="block">
              <span class="text-foreground">ATC Code</span>
              <input
                class="form-input mt-1 block w-full"
                v-model="form.atcCode"
                placeholder="ATC code"
              />
            </label>
          </div>
        </div>

        <!-- Usage -->
        <div class="mb-6">
          <h4 class="text-lg font-semibold mb-4">Usage</h4>
          <div class="grid grid-cols-2 gap-4">
            <div class="flex items-center">
              <input
                type="checkbox"
                class="form-checkbox"
                v-model="form.human"
              />
              <span class="ml-2 text-foreground">Human Use</span>
            </div>
            <div class="flex items-center">
              <input
                type="checkbox"
                class="form-checkbox"
                v-model="form.veterinary"
              />
              <span class="ml-2 text-foreground">Veterinary Use</span>
            </div>
            <label class="block col-span-2">
              <span class="text-foreground">Animal Group</span>
              <input
                class="form-input mt-1 block w-full"
                v-model="form.animalGp"
                placeholder="Animal group"
              />
            </label>
          </div>
        </div>

        <!-- LOINC Codes -->
        <div class="mb-6">
          <h4 class="text-lg font-semibold mb-4">LOINC Codes</h4>
          <div class="grid grid-cols-2 gap-4">
            <label class="block">
              <span class="text-foreground">LOINC Comp</span>
              <input
                class="form-input mt-1 block w-full"
                v-model="form.loinccomp"
                placeholder="LOINC comp"
              />
            </label>
            <label class="block">
              <span class="text-foreground">LOINC Gen</span>
              <input
                class="form-input mt-1 block w-full"
                v-model="form.loincgen"
                placeholder="LOINC gen"
              />
            </label>
            <label class="block">
              <span class="text-foreground">LOINC Disk</span>
              <input
                class="form-input mt-1 block w-full"
                v-model="form.loincdisk"
                placeholder="LOINC disk"
              />
            </label>
            <label class="block">
              <span class="text-foreground">LOINC MIC</span>
              <input
                class="form-input mt-1 block w-full"
                v-model="form.loincmic"
                placeholder="LOINC MIC"
              />
            </label>
            <label class="block">
              <span class="text-foreground">LOINC E-Test</span>
              <input
                class="form-input mt-1 block w-full"
                v-model="form.loincetest"
                placeholder="LOINC E-test"
              />
            </label>
            <label class="block">
              <span class="text-foreground">LOINC Slow</span>
              <input
                class="form-input mt-1 block w-full"
                v-model="form.loincslow"
                placeholder="LOINC slow"
              />
            </label>
            <label class="block">
              <span class="text-foreground">LOINC AFB</span>
              <input
                class="form-input mt-1 block w-full"
                v-model="form.loincafb"
                placeholder="LOINC AFB"
              />
            </label>
            <label class="block">
              <span class="text-foreground">LOINC SBT</span>
              <input
                class="form-input mt-1 block w-full"
                v-model="form.loincsbt"
                placeholder="LOINC SBT"
              />
            </label>
            <label class="block">
              <span class="text-foreground">LOINC MLC</span>
              <input
                class="form-input mt-1 block w-full"
                v-model="form.loincmlc"
                placeholder="LOINC MLC"
              />
            </label>
          </div>
        </div>

        <!-- Additional Information -->
        <div class="mb-6">
          <h4 class="text-lg font-semibold mb-4">Additional Information</h4>
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
          Save Antibiotic
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
