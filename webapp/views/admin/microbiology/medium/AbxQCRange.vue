<script setup lang="ts">
import {computed, defineAsyncComponent, onMounted, reactive, ref, h} from 'vue';
import { useForm } from 'vee-validate';
import * as yup from 'yup';
import { addListsUnique } from '@/utils';
import useApiUtil from '@/composables/api_util';
import { AbxQCRangeType, AbxGuidelineType, AbxMediumType } from "@/types/gql";
import { GetAbxQcRangeAllDocument, GetAbxQcRangeAllQuery, GetAbxQcRangeAllQueryVariables, GetAbxGuidelinesAllDocument, GetAbxGuidelinesAllQuery, GetAbxGuidelinesAllQueryVariables, GetAbxMediumAllDocument, GetAbxMediumAllQuery, GetAbxMediumAllQueryVariables } from "@/graphql/operations/microbiology.queries";
import { AddAbxQcRangeMutation, AddAbxQcRangeMutationVariables, AddAbxQcRangeDocument, EditAbxQcRangeMutation, EditAbxQcRangeMutationVariables, EditAbxQcRangeDocument } from '@/graphql/operations/microbiology.mutations';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import PageHeading from "@/components/common/PageHeading.vue"
const DataTable = defineAsyncComponent(
  () => import('@/components/common/DataTable.vue')
)
const VueMultiselect = defineAsyncComponent(
  () => import('vue-multiselect')
)

const {withClientMutation, withClientQuery} = useApiUtil()

let showModal = ref<boolean>(false);
let formTitle = ref<string>('');
const formAction = ref<boolean>(true);
const currentUid = ref<string | null>(null);

const qcRangeSchema = yup.object({
  guideline: yup.object().required('Guideline is required'),
  year: yup.number().typeError('Year is required').required('Year is required'),
  strain: yup.string().trim().required('Strain is required'),
  referenceTable: yup.string().trim().required('Reference table is required'),
  whonetOrgCode: yup.string().trim().required('Whonet org code is required'),
  antibiotic: yup.string().trim().required('Antibiotic is required'),
  abxTest: yup.string().trim().required('Abx test is required'),
  whonetAbxCode: yup.string().trim().required('Whonet abx code is required'),
  method: yup.string().trim().required('Method is required'),
  medium: yup.object().nullable(),
  minimum: yup.string().trim().nullable(),
  maximum: yup.string().trim().nullable(),
  comments: yup.string().trim().nullable(),
});

const { handleSubmit, resetForm, setValues } = useForm({
  validationSchema: qcRangeSchema,
  initialValues: {
    guideline: null,
    year: '',
    strain: '',
    referenceTable: '',
    whonetOrgCode: '',
    antibiotic: '',
    abxTest: '',
    whonetAbxCode: '',
    method: '',
    medium: null,
    minimum: '',
    maximum: '',
    comments: '',
  },
});

const fetchingQcRanges = ref<boolean>(false);
const qcRanges = ref<AbxQCRangeType[]>([]);

const abxGuidelines = ref<AbxGuidelineType[]>([]);
const abxMediums = ref<AbxMediumType[]>([]);

let abxParams = reactive({
  first: 50,
  after: "",
  text: "",
  sortBy: ["-year"],
  filterAction: false,
});

const qcRangesCount = ref<number>(0);
let qcRangesPageInfo = ref({
  startCursor: "",
  endCursor: "",
  hasNextPage: false,
  hasPreviousPage: false,
});

const countNone = computed(
  () => qcRanges?.value?.length + " of " + qcRangesCount.value + " qcRanges"
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
    name: "Year",
    value: "year",
    sortable: false,
    sortBy: "asc",
    hidden: false,
  },
  {
    name: "Strain",
    value: "strain",
    sortable: false,
    sortBy: "asc",
    hidden: false,
  },
  {
    name: "ReferenceTable",
    value: "referenceTable",
    sortable: false,
    sortBy: "asc",
    hidden: false,
  },
  {
    name: "WhonetOrgCode",
    value: "whonetOrgCode",
    sortable: false,
    sortBy: "asc",
    hidden: false,
  },
  {
    name: "Antibiotic",
    value: "antibiotic",
    sortable: false,
    sortBy: "asc",
    hidden: false,
  },
  {
    name: "AbxTest",
    value: "abxTest",
    sortable: false,
    sortBy: "asc",
    hidden: false,
  },
  {
    name: "WhonetAbxCode",
    value: "whonetAbxCode",
    sortable: false,
    sortBy: "asc",
    hidden: false,
  },
  {
    name: "Method",
    value: "method",
    sortable: false,
    sortBy: "asc",
    hidden: false,
  },
  {
    name: "Medium",
    value: "medium.name",
    sortable: false,
    sortBy: "asc",
    hidden: false,
  },
  {
    name: "Minimum",
    value: "minimum",
    sortable: false,
    sortBy: "asc",
    hidden: false,
  },
  {
    name: "Maximum",
    value: "maximum",
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

function fetchQcRanges(params){
  withClientQuery<GetAbxQcRangeAllQuery, GetAbxQcRangeAllQueryVariables>(
      GetAbxQcRangeAllDocument, {
        text: params.text,
        pageSize: params.first,
        sortBy: params.sortBy,
      }, undefined
  ).then(result => {
    const page = result.abxQcRangeAll;
    const abx = page.items;
    if (params.filterAction) {
      qcRanges.value = [];
      qcRanges.value = abx;
    } else {
      qcRanges.value = addListsUnique(qcRanges.value!, abx, 'uid');
    }

    qcRangesCount.value = page?.totalCount;
    qcRangesPageInfo.value = page?.pageInfo;
  }).finally(() => {
    fetchingQcRanges.value = false;
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
    fetchQcRanges(abxParams);
    withClientQuery<GetAbxMediumAllQuery, GetAbxMediumAllQueryVariables>(
        GetAbxMediumAllDocument, {}, "abxMediumAll"
    ).then((result) => {
      if (result) {
        abxMediums.value = result as AbxMediumType[]
      }
    })
  }
)

function searchQcRanges(opts: any) {
  abxParams.first = 100;
  abxParams.after = "";
  abxParams.text = opts.filterText;
  abxParams.filterAction = true;
  fetchQcRanges(abxParams);
}

function showMoreQcRanges(opts: any): void {
  abxParams.first = opts.fetchCount;
  abxParams.after = qcRangesPageInfo?.value?.endCursor!;
  abxParams.text = opts.filterText;
  abxParams.filterAction = false;
  fetchQcRanges(abxParams);
}

const resetQcRange = () => resetForm();

function FormManager(create: boolean, obj = {} as AbxQCRangeType): void {
  formAction.value = create;
  showModal.value = true;
  formTitle.value = (create ? 'Create' : 'Edit') + ' ' + "QcRange";
  if (create) {
    currentUid.value = null;
    resetForm();
  } else {
    currentUid.value = obj.uid ?? null;
    setValues({
      guideline: obj.guideline ?? null,
      year: obj.year ?? '',
      strain: obj.strain ?? '',
      referenceTable: obj.referenceTable ?? '',
      whonetOrgCode: obj.whonetOrgCode ?? '',
      antibiotic: obj.antibiotic ?? '',
      abxTest: obj.abxTest ?? '',
      whonetAbxCode: obj.whonetAbxCode ?? '',
      method: obj.method ?? '',
      medium: obj.medium ?? null,
      minimum: obj.minimum ?? '',
      maximum: obj.maximum ?? '',
      comments: obj.comments ?? '',
    });
  }
}

const saveForm = handleSubmit((formValues) => {
  const payload = {
    guidelineUid: formValues.guideline?.uid!,
    year: Number(formValues.year),
    strain: formValues.strain,
    referenceTable: formValues.referenceTable,
    whonetOrgCode: formValues.whonetOrgCode,
    antibiotic: formValues.antibiotic,
    abxTest: formValues.abxTest,
    whonetAbxCode: formValues.whonetAbxCode,
    method: formValues.method,
    mediumUid: formValues.medium?.uid ?? null,
    minimum: formValues.minimum ?? null,
    maximum: formValues.maximum ?? null,
  };

  if (formAction.value === true) {
    withClientMutation<AddAbxQcRangeMutation, AddAbxQcRangeMutationVariables>(
        AddAbxQcRangeDocument, { payload }, "createAbxQcRange"
    ).then((result) => {
      if(result) {
        qcRanges.value = addListsUnique(qcRanges.value!, [result], 'uid');
      }
    });
  }

  if (formAction.value === false && currentUid.value) {
    withClientMutation<EditAbxQcRangeMutation, EditAbxQcRangeMutationVariables>(
      EditAbxQcRangeDocument, { uid: currentUid.value, payload }, 
      "updateAbxQcRange"
    ).then((result: any) => {
      if(result) {
        const index = qcRanges.value!.findIndex(abx => abx.uid == result.uid);
        qcRanges.value![index] = result;
      }
    });
  }

  showModal.value = false;
});

</script>

<template>

  <PageHeading title="Quality Control range">
    <!-- <Button @click="FormManager(true)">Add Medium</Button> -->
  </PageHeading>

  <div class="rounded-lg shadow-sm bg-card p-6">
    <DataTable 
      :columns="tableColumns" 
      :data="qcRanges" 
      :toggleColumns="true" 
      :loading="fetchingQcRanges" 
      :paginable="true"
      :pageMeta="{
        fetchCount: abxParams.first,
        hasNextPage: true,
        countNone,
      }" 
      :searchable="true" 
      :filterable="false" 
      @onSearchKeyUp="searchQcRanges" 
      @onSearchFocus="resetQcRange"
      @onPaginate="showMoreQcRanges" 
      :selectable="false">
      <template v-slot:footer> </template>
    </DataTable>
  </div>

  <!-- QcRange Form Modal -->
  <Modal v-if="showModal" @close="showModal = false" :content-width="'w-1/2'">
    <template v-slot:header>
      <h3 class="text-xl font-semibold text-foreground">{{ formTitle }}</h3>
    </template>

    <template v-slot:body>
      <Form @submit="saveForm" class="space-y-6 p-4">
        <!-- Basic Information -->
        <div class="space-y-4">
          <h4 class="text-lg font-semibold text-foreground">Basic Information</h4>
          <div class="grid grid-cols-2 gap-4">
            <FormField name="guideline" v-slot="{ value, handleChange }">
              <FormItem>
                <FormLabel>Guidelines</FormLabel>
                <FormControl>
                  <VueMultiselect
                    :model-value="value"
                    @update:model-value="handleChange"
                    :options="abxGuidelines"
                    :searchable="true"
                    label="name"
                    class="mt-1"
                  >
                  </VueMultiselect>
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
            <FormField name="year" v-slot="{ componentField }">
              <FormItem>
                <FormLabel>Year</FormLabel>
                <FormControl>
                  <Input v-bind="componentField" type="number" placeholder="Enter year" />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
          </div>
        </div>

        <!-- Coding Systems -->
        <div class="space-y-4">
          <div class="grid grid-cols-3 gap-4">
            <FormField name="strain" v-slot="{ componentField }">
              <FormItem>
                <FormLabel>Strain</FormLabel>
                <FormControl>
                  <Input v-bind="componentField" placeholder="Strain" />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
            <FormField name="referenceTable" v-slot="{ componentField }">
              <FormItem>
                <FormLabel>Reference Table</FormLabel>
                <FormControl>
                  <Input v-bind="componentField" placeholder="Reference Table" />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
            <FormField name="whonetOrgCode" v-slot="{ componentField }">
              <FormItem>
                <FormLabel>Whonet Org Code</FormLabel>
                <FormControl>
                  <Input v-bind="componentField" placeholder="Whonet Org Code" />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
            <FormField name="antibiotic" v-slot="{ componentField }">
              <FormItem>
                <FormLabel>Antibiotic</FormLabel>
                <FormControl>
                  <Input v-bind="componentField" placeholder="Antibiotic" />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
            <FormField name="abxTest" v-slot="{ componentField }">
              <FormItem>
                <FormLabel>Abx Test</FormLabel>
                <FormControl>
                  <Input v-bind="componentField" placeholder="Abx Test" />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
            <FormField name="whonetAbxCode" v-slot="{ componentField }">
              <FormItem>
                <FormLabel>Whonet Abx Code</FormLabel>
                <FormControl>
                  <Input v-bind="componentField" placeholder="Whonet Abx Code" />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
            <FormField name="method" v-slot="{ componentField }">
              <FormItem>
                <FormLabel>Method</FormLabel>
                <FormControl>
                  <Input v-bind="componentField" placeholder="Method" />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
            <FormField name="medium" v-slot="{ value, handleChange }">
              <FormItem>
                <FormLabel>Medium</FormLabel>
                <FormControl>
                  <VueMultiselect
                    :model-value="value"
                    @update:model-value="handleChange"
                    :options="abxMediums"
                    :searchable="true"
                    label="name"
                    class="mt-1"
                  >
                  </VueMultiselect>
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
            <FormField name="minimum" v-slot="{ componentField }">
              <FormItem>
                <FormLabel>Minimum</FormLabel>
                <FormControl>
                  <Input v-bind="componentField" placeholder="Minimum" />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
            <FormField name="maximum" v-slot="{ componentField }">
              <FormItem>
                <FormLabel>Maximum</FormLabel>
                <FormControl>
                  <Input v-bind="componentField" placeholder="Maximum" />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
          </div>
        </div>

        <!-- Additional Information -->
        <div class="space-y-4">
          <FormField name="comments" v-slot="{ componentField }">
            <FormItem>
              <FormLabel>Comments</FormLabel>
              <FormControl>
                <Textarea v-bind="componentField" rows="3" placeholder="Additional comments..." />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
        </div>

        <hr class="border-border"/>
        
        <Button type="submit" class="w-full">Save QcRange</Button>
      </Form>
    </template>
  </Modal>

</template>


<style scoped>
/* Remove the toggle-checkbox styles as they are not needed */
</style>
