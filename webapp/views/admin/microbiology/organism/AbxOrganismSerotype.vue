<script setup lang="ts">
import {computed, defineAsyncComponent, onMounted, reactive, ref, h} from 'vue';
import { addListsUnique } from '@/utils';
import useApiUtil from '@/composables/api_util';
import { AbxOrganismType, AbxOrganismSerotypeType } from "@/types/gql";
import { GetAbxOrganismAllDocument, GetAbxOrganismAllQuery, GetAbxOrganismAllQueryVariables, GetAbxOrganismSerotypeAllDocument, GetAbxOrganismSerotypeAllQuery, GetAbxOrganismSerotypeAllQueryVariables } from "@/graphql/operations/microbiology.queries";
import { AddAbxOrganismSerotypeMutation, AddAbxOrganismSerotypeMutationVariables, AddAbxOrganismSerotypeDocument, EditAbxOrganismSerotypeMutation, EditAbxOrganismSerotypeMutationVariables, EditAbxOrganismSerotypeDocument } from '@/graphql/operations/microbiology.mutations';

const DataTable = defineAsyncComponent(
  () => import('@/components/ui/datatable/FelDataTable.vue')
)
const VueMultiselect = defineAsyncComponent(
  () => import('vue-multiselect')
)

const {withClientMutation, withClientQuery} = useApiUtil()

let showModal = ref<boolean>(false);
let formTitle = ref<string>('');
let form = reactive({}) as AbxOrganismSerotypeType;
const formAction = ref<boolean>(true);

const fetchingOrganismSerotypes = ref<boolean>(false);
const abxOrganismSerotypes = ref<AbxOrganismSerotypeType[]>([]);
const abxOrganisms = ref<AbxOrganismType[]>([]);

let abxParams = reactive({
  first: 50,
  after: "",
  text: "",
  sortBy: ["organism___name"],
  filterAction: false,
});

const organismCount = ref<number>(0);
let organismPageInfo = ref({
  startCursor: "",
  endCursor: "",
  hasNextPage: false,
  hasPreviousPage: false,
});

const countNone = computed(
  () => abxOrganismSerotypes?.value?.length + " of " + organismCount.value + " organisms"
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
    name: "Organism",
    value: "organism.name",
    sortable: false,
    sortBy: "asc",
    hidden: false,
  },
  {
    name: "Serotype",
    value: "serotype",
    sortable: false,
    sortBy: "asc",
    hidden: false,
  },
  {
    name: "Serogroup",
    value: "serogroup",
    sortable: false,
    sortBy: "asc",
    hidden: false,
  },
  {
    name: "Subspecies",
    value: "subspecies",
    sortable: false,
    sortBy: "asc",
    hidden: false,
  },
  {
    name: "O Antigens",
    value: "oAntigens",
    sortable: false,
    sortBy: "asc",
    hidden: false,
  },
  {
    name: "H Phase1",
    value: "hPhase1",
    sortable: false,
    sortBy: "asc",
    hidden: false,
  },
  {
    name: "H Phase2",
    value: "hPhase2",
    sortable: false,
    sortBy: "asc",
    hidden: false,
  },
  {
    name: "X997 Check",
    value: "x997Check",
    sortable: false,
    sortBy: "asc",
    hidden: false,
  },
  {
    name: "Fate",
    value: "fate",
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

function fetchOrganismSerotypes(params){
  withClientQuery<GetAbxOrganismSerotypeAllQuery, GetAbxOrganismSerotypeAllQueryVariables>(
      GetAbxOrganismSerotypeAllDocument, {
        text: params.text,
        pageSize: params.first,
        sortBy: params.sortBy,
      }, undefined
  ).then(result => {
    const page = result.abxOrganismSerotypeAll;
    const abx = page.items;
    if (params.filterAction) {
      abxOrganismSerotypes.value = [];
      abxOrganismSerotypes.value = abx;
    } else {
      abxOrganismSerotypes.value = addListsUnique(abxOrganismSerotypes.value!, abx, 'uid');
    }

    organismCount.value = page?.totalCount;
    organismPageInfo.value = page?.pageInfo;
  }).finally(() => {
    fetchingOrganismSerotypes.value = false;
  });
};

function organismSearch(searchQuery, id) {
  if(searchQuery?.length < 3) return;
  withClientQuery<GetAbxOrganismAllQuery, GetAbxOrganismAllQueryVariables>(
        GetAbxOrganismAllDocument, {
          pageSize: 50,
          text: searchQuery,
          sortBy: ["name"],
        }, 
        "abxOrganismAll"
    ).then((result) => {
      if (result) {
        abxOrganisms.value = (result?.items  ?? [])
      }
  });
}

onMounted(() =>  {
    fetchOrganismSerotypes(abxParams);
  }
)

function searchOrganismSerotypes(opts: any) {
  abxParams.first = 100;
  abxParams.after = "";
  abxParams.text = opts.filterText;
  abxParams.filterAction = true;
  fetchOrganismSerotypes(abxParams);
}

function showMoreOrganismSerotypes(opts: any): void {
  abxParams.first = opts.fetchCount;
  abxParams.after = organismPageInfo?.value?.endCursor!;
  abxParams.text = opts.filterText;
  abxParams.filterAction = false;
  fetchOrganismSerotypes(abxParams);
}

const resetOrganismSerotype = () => Object.assign(form, {}) as AbxOrganismSerotypeType;

function FormManager(create: boolean, obj = {} as AbxOrganismSerotypeType): void {
  formAction.value = create;
  showModal.value = true;
  formTitle.value = (create ? 'Create' : 'Edit') + ' ' + "OrganismSerotype";
  if (create) {
    Object.assign(form, {} as AbxOrganismSerotypeType);
  } else {
    Object.assign(form, {...obj});
  }
}

function saveForm(): void {
  const payload = {
    organismUid: form?.organism?.uid!,
    serotype: form?.serotype,
    serogroup: form?.serogroup,
    subspecies: form?.subspecies,
    oAntigens: form?.oAntigens,
    hPhase1: form?.hPhase1,
    hPhase2: form?.hPhase2,
    x997Check: form?.x997Check,
    fate: form?.fate,
  }

  if (formAction.value === true) {
    withClientMutation<AddAbxOrganismSerotypeMutation, AddAbxOrganismSerotypeMutationVariables>(
        AddAbxOrganismSerotypeDocument, { payload }, "createAbxOrganismSerotype"
    ).then((result) => {
      if(result) {
        abxOrganismSerotypes.value = addListsUnique(abxOrganismSerotypes.value!, [result], 'uid');
      }
    });
  }

  if (formAction.value === false) {
    withClientMutation<EditAbxOrganismSerotypeMutation, EditAbxOrganismSerotypeMutationVariables>(
      EditAbxOrganismSerotypeDocument, { uid: form.uid!, payload }, 
      "updateAbxOrganismSerotype"
    ).then((result: any) => {
      if(result) {
        const index = abxOrganismSerotypes.value!.findIndex(abx => abx.uid == result.uid);
        abxOrganismSerotypes.value![index] = result;
      }
    });
  }

  showModal.value = false;
}

</script>

<template>
  <div class="space-y-6">
    <fel-heading title="Organism Serotypes">
      <fel-button @click="FormManager(true)">Add Organism Serotype</fel-button>
    </fel-heading>

    <div class="bg-card p-6 shadow-sm rounded-lg">
      <DataTable 
      :columns="tableColumns" 
      :data="abxOrganismSerotypes" 
      :toggleColumns="true" 
      :loading="fetchingOrganismSerotypes" 
      :paginable="true"
      :pageMeta="{
        fetchCount: abxParams.first,
        hasNextPage: true,
        countNone,
      }" 
      :searchable="true" 
      :filterable="false" 
      @onSearchKeyUp="searchOrganismSerotypes" 
      @onSearchFocus="resetOrganismSerotype"
      @onPaginate="showMoreOrganismSerotypes" 
      :selectable="false">
      <template v-slot:footer> </template>
    </DataTable>
  </div>

  </div>

  <!-- Organism Serotype Edit Form Modal -->
  <fel-modal v-if="showModal" @close="showModal = false" :content-width="'w-1/2'">
    <template v-slot:header>
      <h3 class="text-xl font-semibold text-foreground">{{ formTitle }}</h3>
    </template>

    <template v-slot:body>
      <form @submit.prevent="saveForm" class="space-y-6 p-4">
        <div class="grid grid-cols-2 gap-4">
          <label class="block">
            <span class="text-sm font-medium text-foreground">Organism</span>
            <VueMultiselect
              v-model="form.organism"
              :options="abxOrganisms"
              :searchable="true"
              :close-on-select="true"
              :clear-on-select="false"
              @search-change="organismSearch"
              label="name"
              class="mt-1 multiselect-blue"
            />
          </label>
          <label class="block">
            <span class="text-sm font-medium text-foreground">Serotype</span>
            <input 
              class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              v-model="form.serotype" 
              placeholder="Serotype ..." />
          </label>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <label class="block">
            <span class="text-sm font-medium text-foreground">Serogroup</span>
            <input 
              class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              v-model="form.serogroup" 
              placeholder="Serogroup ..." />
          </label>
          <label class="block">
            <span class="text-sm font-medium text-foreground">Subspecies</span>
            <input 
              class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              v-model="form.subspecies" 
              placeholder="Subspecies ..." />
          </label>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <label class="block">
            <span class="text-sm font-medium text-foreground">O Antigens</span>
            <input 
              class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              v-model="form.oAntigens" 
              placeholder="O Antigens ..." />
          </label>
          <label class="block">
            <span class="text-sm font-medium text-foreground">H Phase1</span>
            <input 
              class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              v-model="form.hPhase1" 
              placeholder="H Phase1 ..." />
          </label>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <label class="block">
            <span class="text-sm font-medium text-foreground">H Phase2</span>
            <input 
              class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              v-model="form.hPhase2" 
              placeholder="H Phase2 ..." />
          </label>
          <label class="block">
            <span class="text-sm font-medium text-foreground">X997 Check</span>
            <input 
              class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              v-model="form.x997Check" 
              placeholder="X997 Check ..." />
          </label>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <label class="block">
            <span class="text-sm font-medium text-foreground">Fate</span>
            <input 
              class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              v-model="form.fate" 
              placeholder="Fate ..." />
          </label>
        </div>

        <hr class="border-border"/>
        
        <button
          type="submit"
          class="w-full bg-primary text-primary-foreground rounded-md px-4 py-2 transition-colors duration-200 hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
        >
          Save Serotype
        </button>
      </form>
    </template>
  </fel-modal>
</template>

<style scoped>
.multiselect-blue {
  @apply rounded-md border-border shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50;
}

.multiselect-blue :deep(.multiselect__tags) {
  @apply border-border rounded-md;
}

.multiselect-blue :deep(.multiselect__single) {
  @apply text-foreground;
}

.multiselect-blue :deep(.multiselect__input) {
  @apply text-foreground;
}

.multiselect-blue :deep(.multiselect__option) {
  @apply text-foreground hover:bg-primary/10;
}

.multiselect-blue :deep(.multiselect__option--highlight) {
  @apply bg-primary text-primary-foreground;
}

.multiselect-blue :deep(.multiselect__option--selected) {
  @apply bg-primary/20 text-foreground;
}
</style>
