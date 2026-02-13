<script setup lang="ts">
import { computed, defineAsyncComponent, onMounted, reactive, ref, h } from 'vue';
import { useForm, useField } from 'vee-validate';
import * as yup from 'yup';
import { addListsUnique } from '@/utils';
import useApiUtil from '@/composables/api_util';
import { AbxClassType, AbxFamilyType, AbxGenusType, AbxKingdomType, AbxOrderType, AbxOrganismType, AbxPhylumType } from "@/types/gql";
import { GetAbxFamilyAllDocument, GetAbxFamilyAllQuery, GetAbxFamilyAllQueryVariables, GetAbxOrderAllDocument, GetAbxOrderAllQuery, GetAbxOrderAllQueryVariables, GetAbxKingdomAllDocument, GetAbxKingdomAllQuery, GetAbxKingdomAllQueryVariables, GetAbxPhylumAllDocument, GetAbxPhylumAllQuery, GetAbxPhylumAllQueryVariables, GetAbxClassAllDocument, GetAbxClassAllQuery, GetAbxClassAllQueryVariables, GetAbxGenusAllDocument, GetAbxGenusAllQuery, GetAbxGenusAllQueryVariables, GetAbxOrganismAllDocument, GetAbxOrganismAllQuery, GetAbxOrganismAllQueryVariables } from "@/graphql/operations/microbiology.queries";
import { AddAbxOrganismMutation, AddAbxOrganismMutationVariables, AddAbxOrganismDocument, EditAbxOrganismMutation, EditAbxOrganismMutationVariables, EditAbxOrganismDocument } from '@/graphql/operations/microbiology.mutations';

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

const organismSchema = yup.object({
  name: yup.string().trim().required('Name is required'),
});

const { handleSubmit, resetForm, setValues, errors } = useForm({
  validationSchema: organismSchema,
  initialValues: {
    name: '',
    whonetOrgCode: '',
    replacedBy: '',
    taxonomicStatus: '',
    common: '',
    organismType: '',
    anaerobe: false,
    morphology: '',
    subkingdomCode: '',
    familyCode: '',
    genusGroup: '',
    genusCode: '',
    speciesGroup: '',
    serovarGroup: '',
    msfGrpClin: '',
    sctCode: '',
    sctText: '',
    gbifTaxonId: '',
    gbifDatasetId: '',
    gbifTaxonomicStatus: '',
    kingdom: null,
    phylum: null,
    class: null,
    order: null,
    family: null,
    genus: null,
    comments: '',
  },
});
const { value: name } = useField<string>('name');
const { value: whonetOrgCode } = useField<string>('whonetOrgCode');
const { value: kingdom } = useField<AbxKingdomType | null>('kingdom');
const { value: phylum } = useField<AbxPhylumType | null>('phylum');
const { value: classValue } = useField<AbxClassType | null>('class');
const { value: order } = useField<AbxOrderType | null>('order');
const { value: family } = useField<AbxFamilyType | null>('family');
const { value: genus } = useField<AbxGenusType | null>('genus');
const { value: organismType } = useField<string>('organismType');
const { value: anaerobe } = useField<boolean>('anaerobe');

const fetchingOrganisms = ref<boolean>(false);
const abxOrganisms = ref<AbxOrganismType[]>([]);
const abxKingdoms = ref<AbxKingdomType[]>([]);
const abxPhylums = ref<AbxPhylumType[]>([]);
const phylums = computed(() => abxPhylums.value.filter((phylumItem) => phylumItem.kingdomUid === kingdom.value?.uid));
const abxClasss = ref<AbxClassType[]>([]);
const classes = computed(() => abxClasss.value.filter((clas_) => clas_.phylumUid === phylum.value?.uid));
const abxOrders = ref<AbxOrderType[]>([]);
const orders = computed(() => abxOrders.value.filter((orderItem) => orderItem.classUid === classValue.value?.uid));
const abxFamilys = ref<AbxFamilyType[]>([]);
const familys = computed(() => abxFamilys.value.filter((familyItem) => familyItem.orderUid === order.value?.uid));
const abxGenuss = ref<AbxGenusType[]>([]);
const genuses = computed(() => abxGenuss.value.filter((genusItem) => genusItem.familyUid === family.value?.uid));


let abxParams = reactive({
  first: 50,
  after: "",
  text: "",
  sortBy: ["name"],
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
  () => abxOrganisms?.value?.length + " of " + organismCount.value + " organisms"
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
    name: "Name",
    value: "name",
    sortable: false,
    sortBy: "asc",
    hidden: false,
  },
  {
    name: "whonetOrgCode",
    value: "whonetOrgCode",
    sortable: false,
    sortBy: "asc",
    hidden: false,
  },
  {
    name: "replacedBy",
    value: "replacedBy",
    sortable: false,
    sortBy: "asc",
    hidden: true,
  },
  {
    name: "taxonomicStatus",
    value: "taxonomicStatus",
    sortable: false,
    sortBy: "asc",
    hidden: true,
  },
  {
    name: "common",
    value: "common",
    sortable: false,
    sortBy: "asc",
    hidden: true,
  },
  {
    name: "organismType",
    value: "organismType",
    sortable: false,
    sortBy: "asc",
    hidden: false,
  },
  {
    name: "anaerobe",
    value: "anaerobe",
    sortable: false,
    sortBy: "asc",
    hidden: false,
  },
  {
    name: "morphology",
    value: "morphology",
    sortable: false,
    sortBy: "asc",
    hidden: true,
  },
  {
    name: "subkingdomCode",
    value: "subkingdomCode",
    sortable: false,
    sortBy: "asc",
    hidden: true,
  },
  {
    name: "familyCode",
    value: "familyCode",
    sortable: false,
    sortBy: "asc",
    hidden: true,
  },
  {
    name: "genusGroup",
    value: "genusGroup",
    sortable: false,
    sortBy: "asc",
    hidden: true,
  },
  {
    name: "genusCode",
    value: "genusCode",
    sortable: false,
    sortBy: "asc",
    hidden: true,
  },
  {
    name: "speciesGroup",
    value: "speciesGroup",
    sortable: false,
    sortBy: "asc",
    hidden: true,
  },
  {
    name: "serovarGroup",
    value: "serovarGroup",
    sortable: false,
    sortBy: "asc",
    hidden: true,
  },
  {
    name: "msfGrpClin",
    value: "msfGrpClin",
    sortable: false,
    sortBy: "asc",
    hidden: true,
  },
  {
    name: "sctCode",
    value: "sctCode",
    sortable: false,
    sortBy: "asc",
    hidden: true,
  },
  {
    name: "sctText",
    value: "sctText",
    sortable: false,
    sortBy: "asc",
    hidden: true,
  },
  {
    name: "gbifTaxonId",
    value: "gbifTaxonId",
    sortable: false,
    sortBy: "asc",
    hidden: true,
  },
  {
    name: "gbifDatasetId",
    value: "gbifDatasetId",
    sortable: false,
    sortBy: "asc",
    hidden: true,
  },
  {
    name: "gbifTaxonomicStatus",
    value: "gbifTaxonomicStatus",
    sortable: false,
    sortBy: "asc",
    hidden: true,
  },
  {
    name: "kingdom",
    value: "kingdom.name",
    sortable: false,
    sortBy: "asc",
    hidden: false,
  },
  {
    name: "phylum",
    value: "phylum.name",
    sortable: false,
    sortBy: "asc",
    hidden: false,
  },
  {
    name: "class",
    value: "class_.name",
    sortable: false,
    sortBy: "asc",
    hidden: false,
  },
  {
    name: "order",
    value: "order.name",
    sortable: false,
    sortBy: "asc",
    hidden: false,
  },
  {
    name: "family",
    value: "family.name",
    sortable: false,
    sortBy: "asc",
    hidden: false,
  },
  {
    name: "genus",
    value: "genus.name",
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

function fetchOrganisms(params){
  withClientQuery<GetAbxOrganismAllQuery, GetAbxOrganismAllQueryVariables>(
      GetAbxOrganismAllDocument, {
        text: params.text,
        pageSize: params.first,
        sortBy: params.sortBy,
      }, undefined
  ).then(result => {
    const page = result.abxOrganismAll;
    const abx = page.items;
    if (params.filterAction) {
      abxOrganisms.value = [];
      abxOrganisms.value = abx;
    } else {
      abxOrganisms.value = addListsUnique(abxOrganisms.value!, abx, 'uid');
    }

    organismCount.value = page?.totalCount;
    organismPageInfo.value = page?.pageInfo;
  }).finally(() => {
    fetchingOrganisms.value = false;
  });
};

onMounted(() =>  {
    fetchOrganisms(abxParams);
    //
    withClientQuery<GetAbxOrderAllQuery, GetAbxOrderAllQueryVariables>(
        GetAbxOrderAllDocument, {}, "abxOrderAll"
    ).then((result) => {
      if (result) {
        abxOrders.value = result as AbxOrderType[]
      }
    })
    //
    withClientQuery<GetAbxFamilyAllQuery, GetAbxFamilyAllQueryVariables>(
        GetAbxFamilyAllDocument, {}, "abxFamilyAll"
    ).then((result) => {
      if (result) {
        abxFamilys.value = result as AbxFamilyType[]
      }
    })
    //
    withClientQuery<GetAbxKingdomAllQuery, GetAbxKingdomAllQueryVariables>(
        GetAbxKingdomAllDocument, {}, "abxKingdomAll"
    ).then((result) => {
      if (result) {
        abxKingdoms.value = result as AbxKingdomType[]
      }
    })
    //
    withClientQuery<GetAbxPhylumAllQuery, GetAbxPhylumAllQueryVariables>(
        GetAbxPhylumAllDocument, {}, "abxPhylumAll"
    ).then((result) => {
      if (result) {
        abxPhylums.value = result as AbxPhylumType[]
      }
    })
    //
    withClientQuery<GetAbxGenusAllQuery, GetAbxGenusAllQueryVariables>(
        GetAbxGenusAllDocument, {}, "abxGenusAll"
    ).then((result) => {
      if (result) {
        abxGenuss.value = result as AbxGenusType[]
      }
    })
    //
    withClientQuery<GetAbxClassAllQuery, GetAbxClassAllQueryVariables>(
      GetAbxClassAllDocument, {}, "abxClassAll"
    ).then((result) => {
      if (result) {
        abxClasss.value = result as AbxClassType[]
      }
    })
  }
)

function searchOrganisms(opts: any) {
  abxParams.first = 100;
  abxParams.after = "";
  abxParams.text = opts.filterText;
  abxParams.filterAction = true;
  fetchOrganisms(abxParams);
}

function showMoreOrganisms(opts: any): void {
  abxParams.first = opts.fetchCount;
  abxParams.after = organismPageInfo?.value?.endCursor!;
  abxParams.text = opts.filterText;
  abxParams.filterAction = false;
  fetchOrganisms(abxParams);
}

const resetOrganism = () => resetForm();

function FormManager(create: boolean, obj = {} as AbxOrganismType): void {
  formAction.value = create;
  showModal.value = true;
  formTitle.value = (create ? 'Create' : 'Edit') + ' ' + "Organism";
  if (create) {
    currentUid.value = null;
    resetForm();
  } else {
    currentUid.value = obj.uid ?? null;
    setValues({
      name: obj.name ?? '',
      whonetOrgCode: obj.whonetOrgCode ?? '',
      replacedBy: obj.replacedBy ?? '',
      taxonomicStatus: obj.taxonomicStatus ?? '',
      common: obj.common ?? '',
      organismType: obj.organismType ?? '',
      anaerobe: obj.anaerobe ?? false,
      morphology: obj.morphology ?? '',
      subkingdomCode: obj.subkingdomCode ?? '',
      familyCode: obj.familyCode ?? '',
      genusGroup: obj.genusGroup ?? '',
      genusCode: obj.genusCode ?? '',
      speciesGroup: obj.speciesGroup ?? '',
      serovarGroup: obj.serovarGroup ?? '',
      msfGrpClin: obj.msfGrpClin ?? '',
      sctCode: obj.sctCode ?? '',
      sctText: obj.sctText ?? '',
      gbifTaxonId: obj.gbifTaxonId ?? '',
      gbifDatasetId: obj.gbifDatasetId ?? '',
      gbifTaxonomicStatus: obj.gbifTaxonomicStatus ?? '',
      kingdom: obj.kingdom ?? null,
      phylum: obj.phylum ?? null,
      class: (obj as AbxOrganismType).class ?? (obj as AbxOrganismType).class_ ?? null,
      order: obj.order ?? null,
      family: obj.family ?? null,
      genus: obj.genus ?? null,
      comments: obj.comments ?? '',
    });
  }
}

const saveForm = handleSubmit((formValues) => {
  const payload = {
    name: formValues.name,
    whonetOrgCode: formValues.whonetOrgCode,
    replacedBy: formValues.replacedBy,
    taxonomicStatus: formValues.taxonomicStatus,
    common: formValues.common,
    organismType: formValues.organismType,
    anaerobe: formValues.anaerobe,
    morphology: formValues.morphology,
    subkingdomCode: formValues.subkingdomCode,
    familyCode: formValues.familyCode,
    genusGroup: formValues.genusGroup,
    genusCode: formValues.genusCode,
    speciesGroup: formValues.speciesGroup,
    serovarGroup: formValues.serovarGroup,
    msfGrpClin: formValues.msfGrpClin,
    sctCode: formValues.sctCode,
    sctText: formValues.sctText,
    gbifTaxonId: formValues.gbifTaxonId,
    gbifDatasetId: formValues.gbifDatasetId,
    gbifTaxonomicStatus: formValues.gbifTaxonomicStatus,
    kingdomUid: formValues.kingdom?.uid,
    phylumUid: formValues.phylum?.uid,
    classUid: formValues.class?.uid,
    orderUid: formValues.order?.uid,
    familyUid: formValues.family?.uid,
    genusUid: formValues.genus?.uid,
    comments: formValues.comments,
  }

  if (formAction.value === true) {
    withClientMutation<AddAbxOrganismMutation, AddAbxOrganismMutationVariables>(
        AddAbxOrganismDocument, { payload }, "createAbxOrganism"
    ).then((result) => {
      if(result) {
        abxOrganisms.value = addListsUnique(abxOrganisms.value!, [result], 'uid');
      }
    });
  }

  if (formAction.value === false && currentUid.value) {
    withClientMutation<EditAbxOrganismMutation, EditAbxOrganismMutationVariables>(
      EditAbxOrganismDocument, { uid: currentUid.value, payload }, 
      "updateAbxOrganism"
    ).then((result: any) => {
      if(result) {
        const index = abxOrganisms.value!.findIndex(abx => abx.uid == result.uid);
        abxOrganisms.value![index] = result;
      }
    });
  }

  showModal.value = false;
});

</script>

<template>
  <div class="space-y-6">
    <fel-heading title="Organisms">
      <fel-button @click="FormManager(true)">Add Organism</fel-button>
    </fel-heading>

    <div class="bg-card p-6 shadow-sm rounded-lg">
      <DataTable 
      :columns="tableColumns" 
      :data="abxOrganisms" 
      :toggleColumns="true" 
      :loading="fetchingOrganisms" 
      :paginable="true"
      :pageMeta="{
        fetchCount: abxParams.first,
        hasNextPage: true,
        countNone,
      }" 
      :searchable="true" 
      :filterable="false" 
      @onSearchKeyUp="searchOrganisms" 
      @onSearchFocus="resetOrganism"
      @onPaginate="showMoreOrganisms" 
      :selectable="false">
        <template v-slot:footer> </template>
      </DataTable>
    </div>

  </div>

  <!-- Organism Edit Form Modal -->
  <fel-modal v-if="showModal" @close="showModal = false" :content-width="'w-1/2'">
    <template v-slot:header>
      <h3 class="text-xl font-semibold text-foreground">{{ formTitle }}</h3>
    </template>

    <template v-slot:body>
      <form @submit.prevent="saveForm" class="space-y-6 p-4">
        <div class="grid grid-cols-2 gap-4">
          <label class="block">
            <span class="text-sm font-medium text-foreground">Name</span>
            <input 
              class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              v-model="name" 
              placeholder="Name ..." />
            <p v-if="errors.name" class="text-sm text-destructive">{{ errors.name }}</p>
          </label>
          <label class="block">
            <span class="text-sm font-medium text-foreground">Whonet Org Code</span>
            <input 
              class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              v-model="whonetOrgCode" 
              placeholder="Whonet Org Code ..." />
          </label>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <label class="block">
            <span class="text-sm font-medium text-foreground">Kingdom</span>
            <VueMultiselect
              v-model="kingdom"
              :options="abxKingdoms"
              :searchable="true"
              :close-on-select="true"
              :show-labels="false"
              track-by="uid"
              label="name"
              class="mt-1 multiselect-blue"
            />
          </label>
          <label class="block">
            <span class="text-sm font-medium text-foreground">Phylum</span>
            <VueMultiselect
              v-model="phylum"
              :options="phylums"
              :searchable="true"
              :close-on-select="true"
              :show-labels="false"
              track-by="uid"
              label="name"
              class="mt-1 multiselect-blue"
            />
          </label>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <label class="block">
            <span class="text-sm font-medium text-foreground">Class</span>
            <VueMultiselect
              v-model="classValue"
              :options="classes"
              :searchable="true"
              :close-on-select="true"
              :show-labels="false"
              track-by="uid"
              label="name"
              class="mt-1 multiselect-blue"
            />
          </label>
          <label class="block">
            <span class="text-sm font-medium text-foreground">Order</span>
            <VueMultiselect
              v-model="order"
              :options="orders"
              :searchable="true"
              :close-on-select="true"
              :show-labels="false"
              track-by="uid"
              label="name"
              class="mt-1 multiselect-blue"
            />
          </label>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <label class="block">
            <span class="text-sm font-medium text-foreground">Family</span>
            <VueMultiselect
              v-model="family"
              :options="familys"
              :searchable="true"
              :close-on-select="true"
              :show-labels="false"
              track-by="uid"
              label="name"
              class="mt-1 multiselect-blue"
            />
          </label>
          <label class="block">
            <span class="text-sm font-medium text-foreground">Genus</span>
            <VueMultiselect
              v-model="genus"
              :options="genuses"
              :searchable="true"
              :close-on-select="true"
              :show-labels="false"
              track-by="uid"
              label="name"
              class="mt-1 multiselect-blue"
            />
          </label>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <label class="block">
            <span class="text-sm font-medium text-foreground">Organism Type</span>
            <input 
              class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              v-model="organismType" 
              placeholder="Organism Type ..." />
          </label>
          <label class="block">
            <span class="text-sm font-medium text-foreground">Anaerobe</span>
            <input 
              type="checkbox"
              class="mt-1 h-4 w-4 rounded border-border text-primary focus:ring-primary" 
              v-model="anaerobe" />
          </label>
        </div>

        <hr class="border-border"/>
        
        <button
          type="submit"
          class="w-full bg-primary text-primary-foreground rounded-md px-4 py-2 transition-colors duration-200 hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
        >
          Save Organism
        </button>
      </form>
    </template>
  </fel-modal>
</template>

<style scoped>
@reference "@/assets/css/style.css";
.multiselect-blue {
  @apply rounded-md border-border shadow-sm focus:border-primary focus:ring focus:ring-primary/50;
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
