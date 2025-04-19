<script setup lang="ts">
import { ref, reactive, computed, h, defineAsyncComponent } from "vue";
import { storeToRefs } from "pinia";
import { useRoute } from "vue-router";
import { RouterLink } from "vue-router";
import { useWorksheetStore } from "@/stores/worksheet";
import { useUserStore } from "@/stores/user";
import useApiUtil  from "@/composables/api_util";
import { AddWorkSheetDocument, AddWorkSheetMutation, AddWorkSheetMutationVariables } from "@/graphql/operations/worksheet.mutations";
import { IAnalysisService } from "@/models/analysis";
import { useField, useForm } from "vee-validate";
import { object, number } from "yup";
import * as shield from "@/guards";

const modal = defineAsyncComponent(
  () => import("@/components/ui/FelModal.vue")
)
const DataTable = defineAsyncComponent(
  () => import("@/components/ui/datatable/FelDataTable.vue")
)
const PageHeading = defineAsyncComponent(
  () => import("@/components/common/FelPageHeading.vue")
)

const worksheetStore = useWorksheetStore();
const userStore = useUserStore();
const { withClientMutation } = useApiUtil();

const {
  workSheets,
  fetchingWorkSheets,
  workSheetPageInfo,
  workSheetTemplates,
} = storeToRefs(worksheetStore);

const route = useRoute();

let showModal = ref<boolean>(false);

const filterOptions = ref([
  { name: "All", value: "" },
  { name: "Pending", value: "pending" },
  { name: "Awaiting", value: "awaiting" },
  { name: "Approved", value: "approved" },
  { name: "Empty", value: "empty" },
]);

const tableColumns = ref([
  {
    name: "UID",
    value: "uid",
    sortable: true,
    sortBy: "asc",
    defaultSort: true,
    showInToggler: false,
    hidden: true,
  },
  {
    name: "WorkSheet Id",
    value: "workSheetId",
    sortable: false,
    sortBy: "asc",
    hidden: false,
    customRender: function (worksheet, _) {
      return h(RouterLink, {
        to: {
          name: "worksheet-detail",
          params: {
            workSheetUid: worksheet?.uid,
          },
        },
        innerHTML: worksheet?.worksheetId,
      });
    },
  },
  {
    name: "Analysis/Test",
    value: "analysis.name",
    sortable: false,
    sortBy: "asc",
    hidden: false,
  },
  {
    name: "Samples",
    value: "assignedCount",
    sortable: false,
    sortBy: "asc",
    hidden: false,
  },
  {
    name: "Instrument",
    value: "instrument.name",
    sortable: false,
    sortBy: "asc",
    hidden: false,
  },
  {
    name: "Analyst",
    value: "clientPatientId",
    sortable: false,
    sortBy: "asc",
    hidden: false,
    customRender: function (worksheet, _) {
      return h("div", {
        innerHTML: analystName(worksheet?.analyst),
      });
    },
  },
  {
    name: "Status",
    value: "",
    sortable: false,
    sortBy: "asc",
    hidden: false,
    customRender: function (worksheet, _) {
      return h("button", {
        type: "button",
        class: "bg-primary text-white py-1 px-2 rounded-sm leading-none",
        innerHTML: worksheet?.state || "unknown",
      });
    },
  },
]);

worksheetStore.removeWorksheet();

let workSheetParams = reactive({
  first: 25,
  before: "",
  status: "",
  text: "",
  sort: ["-uid"],
  filterAction: false,
});
worksheetStore.fetchWorkSheets(workSheetParams);
worksheetStore.fetchWorkSheetTemplates();
userStore.fetchUsers({});

//
const worksheetSchema = object({
  analystUid: number().required("Analyst is Required").typeError("Analyst is Required"),
  templateUid: number().typeError("Worksheet Template is required"),
  instrumentUid: number(),
  count: number().typeError("Required number of worksheets must be defined"),
});

const { handleSubmit, errors } = useForm({
  validationSchema: worksheetSchema,
  initialValues: {
    count: 1,
    analystUid: undefined,
    templateUid: undefined,
    instrumentUid: undefined,
  },
});

const { value: count } = useField("count");
const { value: analystUid } = useField("analystUid");
const { value: templateUid } = useField("templateUid");
const { value: instrumentUid } = useField("instrumentUid");

const saveForm = handleSubmit((values) => {
  showModal.value = false;
  withClientMutation<AddWorkSheetMutation, AddWorkSheetMutationVariables>(AddWorkSheetDocument, values, "createWorksheet").then((result) => {
    worksheetStore.addWorksheet(result);
    showModal.value = false;
  });
});

function analysesText(analyses: IAnalysisService[]): string {
  let names: string[] = [];
  analyses?.forEach((a) => names.push(a.name!));
  return names?.join(", ");
}

function showMoreWorkSheets(opts: any): void {
  workSheetParams.first = opts.fetchCount;
  workSheetParams.before = workSheetPageInfo?.value?.endCursor ?? "";
  workSheetParams.text = opts.filterText;
  workSheetParams.status = opts.filterStatus;
  workSheetParams.filterAction = false;
  worksheetStore.fetchWorkSheets(workSheetParams);
}

function searchWorkSheets(opts: any): void {
  workSheetParams.first = 25;
  workSheetParams.before = "";
  workSheetParams.text = opts.filterText;
  workSheetParams.status = opts.filterStatus;
  workSheetParams.filterAction = true;
  worksheetStore.fetchWorkSheets(workSheetParams);
}

const analysts = computed(() => userStore.getUsers);
const analystName = (analyst: any) => {
  if (analyst?.auth?.userName) return analyst?.auth?.userName;
  if (analyst?.firstName) return analyst.firstName + " " + analyst.lastName;
  return "----";
};

const countNone = computed(
  () =>
    workSheets?.value?.length + " of " + worksheetStore.getWorkSheetCount + " WorkSheets"
);
</script>

<template>
  <PageHeading title="Worksheets" />
  <div class="flex justify-between items-center">
    <div>
      <button v-show="shield.hasRights(shield.actions.CREATE, shield.objects.WORKSHEET)" @click.prevent="showModal = true"
        class="p-2 h-10 border-primary border text-primary rounded-sm transition duration-300 hover:bg-primary hover:text-white focus:outline-none">
        Add WorkSheet
      </button>
    </div>
  </div>
  <DataTable 
  :columns="tableColumns" 
  :data="workSheets" 
  :toggleColumns="true" 
  :loading="fetchingWorkSheets"
  :paginable="true" 
  :pageMeta="{
      fetchCount: workSheetParams.first,
      hasNextPage: workSheetPageInfo?.hasNextPage,
      countNone,
  }" 
  :searchable="true" 
  :filterable="true" 
  :filterMeta="{  
      defaultFilter: workSheetParams.status,
      filters: filterOptions,
  }" 
  @onSearch="searchWorkSheets" 
  @onPaginate="showMoreWorkSheets" 
  :selectable="false">
    <template v-slot:footer> </template>
  </DataTable>

  <!-- Location Edit Form Modal -->
  <modal v-if="showModal" @close="showModal = false">
    <template v-slot:header>
      <div>
        <h3>Create Worksheet</h3>
        <hr />
        <ul>
          <li v-for="(error, idx) in Object.values(errors)" :key="idx" class="text-orange-600">
            {{ error }}
          </li>
        </ul>
      </div>
    </template>

    <template v-slot:body>
      <form action="post" class="p-1">
        <div class="grid grid-cols-3 gap-x-4 mb-4">
          <label class="block col-span-1 mb-2">
            <span class="text-gray-700">Analyst</span>
            <select class="form-select block w-full mt-1" v-model="analystUid">
              <option v-for="analyst in analysts" :key="analyst.uid" :value="analyst.uid">
                {{ analystName(analyst) }}
              </option>
            </select>
          </label>
          <label class="block col-span-1 mb-2">
            <span class="text-gray-700">Worksheet Template</span>
            <select class="form-select block w-full mt-1" v-model="templateUid">
              <option value="undefined"></option>
              <option v-for="template in workSheetTemplates" :key="template.uid" :value="template.uid">
                {{ template.name }}
              </option>
            </select>
          </label>
          <label class="block col-span-1 mb-2">
            <span class="text-gray-700">How Many</span>
            <input type="number" class="form-input mt-1 block w-full" v-model="count" min="1" />
          </label>
        </div>

        <hr />
        <button type="button" @click.prevent="saveForm()"
          class="-mb-4 w-full border border-primary bg-primary text-white rounded-sm px-4 py-2 m-2 transition-colors duration-500 ease select-none hover:bg-primary focus:outline-none focus:shadow-outline">
          Save Form
        </button>
      </form>
    </template>
  </modal>
</template>
