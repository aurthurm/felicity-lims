<script setup lang="ts">
import {computed, defineAsyncComponent, onMounted, reactive, ref, h} from 'vue';
import { addListsUnique } from '@/utils/helpers';
import useApiUtil from '@/composables/api_util';
import { IAbxKingdom, IAbxOrganism, IAbxOrganismSerotype } from "@/models/microbiology";
import { GetAbxOrganismAllDocument, GetAbxOrganismAllQuery, GetAbxOrganismAllQueryVariables, GetAbxOrganismSerotypeAllDocument, GetAbxOrganismSerotypeAllQuery, GetAbxOrganismSerotypeAllQueryVariables } from "@/graphql/operations/microbiology.queries";
import { AddAbxOrganismSerotypeMutation, AddAbxOrganismSerotypeMutationVariables, AddAbxOrganismSerotypeDocument, EditAbxOrganismSerotypeMutation, EditAbxOrganismSerotypeMutationVariables, EditAbxOrganismSerotypeDocument } from '@/graphql/operations/microbiology.mutations';

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
let form = reactive({}) as IAbxOrganismSerotype;
const formAction = ref<boolean>(true);

const fetchingOrganismSerotypes = ref<boolean>(false);
const abxOrganismSerotypes = ref<IAbxOrganismSerotype[]>([]);
const abxOrganisms = ref<IAbxOrganism[]>([]);

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

const resetOrganismSerotype = () => Object.assign(form, {}) as IAbxOrganismSerotype;

function FormManager(create: boolean, obj = {} as IAbxOrganismSerotype): void {
  formAction.value = create;
  showModal.value = true;
  formTitle.value = (create ? 'Create' : 'Edit') + ' ' + "OrganismSerotype";
  if (create) {
    Object.assign(form, {} as IAbxOrganismSerotype);
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

  <div class="w-full my-4">
    <!-- <hr>
    <button @click="FormManager(true)"
            class="px-2 py-1 border-primary border text-primary rounded-sm transition duration-300 hover:bg-primary hover:text-primary-foreground focus:outline-none">
      Add OrganismSerotype
    </button> -->
    <hr>

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

  <!-- OrganismSerotype Form Modal -->
  <modal v-if="showModal" @close="showModal = false" :content-width="'w-1/2'">
    <template v-slot:header>
      <h3>{{ formTitle }}</h3>
    </template>

    <template v-slot:body>
      <form @submit.prevent="saveForm" class="p-4">
        <!-- Basic Information -->
        <div class="mb-6">
          <div class="grid grid-cols-2 gap-4">
            <label class="block">
                <span class="text-foreground">Organism</span>
                <VueMultiselect
                v-model="form.organism"
                :options="abxOrganisms"
                :searchable="true"
                :close-on-select="true"
                :clear-on-select="false"
                @search-change="organismSearch"
                label="name"
                >
                </VueMultiselect>
            </label>
            <label class="block">
              <span class="text-foreground">Serotype</span>
              <input class="form-input mt-1 block w-full" v-model="form.serotype" placeholder="Serotype" />
            </label>
            <label class="block">
              <span class="text-foreground">Serogroup</span>
              <input class="form-input mt-1 block w-full" v-model="form.serogroup" placeholder="Serogroup" />
            </label>
            <label class="block">
              <span class="text-foreground">Subspecies</span>
              <input class="form-input mt-1 block w-full" v-model="form.subspecies" placeholder="Subspecies" />
            </label>
            <label class="block">
              <span class="text-foreground">O Antigens</span>
              <input class="form-input mt-1 block w-full" v-model="form.oAntigens" placeholder="O Antigens" />
            </label>
            <label class="block">
              <span class="text-foreground">H Phase1</span>
              <input class="form-input mt-1 block w-full" v-model="form.hPhase1" placeholder="H Phase1" />
            </label>
            <label class="block">
              <span class="text-foreground">H Phase2</span>
              <input class="form-input mt-1 block w-full" v-model="form.hPhase2" placeholder="H Phase2" />
            </label>
            <label class="block">
              <span class="text-foreground">X997 Check</span>
              <input class="form-input mt-1 block w-full" v-model="form.x997Check" placeholder="X997 Check" />
            </label>
            <label class="block">
              <span class="text-foreground">Fate</span>
              <input class="form-input mt-1 block w-full" v-model="form.fate" placeholder="fate" />
            </label>
          </div>
        </div>

        <hr class="my-6"/>
        
        <button
          type="submit"
          class="w-full bg-primary text-primary-foreground rounded-md px-4 py-2 transition-colors duration-300 ease-in-out hover:bg-sky-900 focus:outline-none focus:ring-2 focus:ring-sky-500"
        >
          Save OrganismSerotype
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
