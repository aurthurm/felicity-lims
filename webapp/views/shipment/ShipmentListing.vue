<script setup lang="ts">
import modal from "@/components/ui/FelModal.vue";
import { ref, reactive, computed, h, defineAsyncComponent } from "vue";
import { storeToRefs } from "pinia";
import { useRoute } from "vue-router";
import { RouterLink } from "vue-router";
import { useShipmentStore } from "@/stores/shipment";
import useApiUtil  from "@/composables/api_util";
import { AddShipmentDocument, AddShipmentMutation, AddShipmentMutationVariables } from "@/graphql/operations/shipment.mutations";
import { useField, useForm } from "vee-validate";
import { object, string, number } from "yup";

const PageHeading = defineAsyncComponent(
  () => import("@/components/common/FelPageHeading.vue")
)
const DataTable = defineAsyncComponent(
  () => import("@/components/ui/datatable/FelDataTable.vue")
)

const shipmentStore = useShipmentStore();
const { withClientMutation } = useApiUtil();

const {
  shipments,
  fetchingShipments,
  shipmentPageInfo,
} = storeToRefs(shipmentStore);

const route = useRoute();

let showModal = ref<boolean>(false);

const viewIncoming = ref(false)
const filterOptions = ref([
  { name: "All", value: "" },
  { name: "Due", value: "due" },
  { name: "Awaiting", value: "awaiting" },
  { name: "Failed", value: "failed" },
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
    name: "Shipment Id",
    value: "shipmentId",
    sortable: false,
    sortBy: "asc",
    hidden: false,
    customRender: function (shipment, _) {
      return h(RouterLink, {
        to: {
          name: "shipment-detail",
          params: {
            shipmentUid: shipment?.uid,
          },
        },
        innerHTML: shipment?.shipmentId,
      });
    },
  },
  {
    name: "External Laboratory",
    value: "laboratory.name",
    sortable: false,
    sortBy: "asc",
    hidden: false,
  },
  {
    name: "Courier",
    value: "courier",
    sortable: false,
    sortBy: "asc",
    hidden: false,
  },
  {
    name: "Flow Detail",
    value: "",
    sortable: false,
    sortBy: "asc",
    hidden: false,
  },
  {
    name: "Assigned Count",
    value: "assignedCount",
    sortable: false,
    sortBy: "asc",
    hidden: false,
  }, 
  {
    name: "Current Status",
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
  {
    name: "",
    value: "",
    sortable: false,
    showInToggler: false,
    hidden: false,
    customRender: function (shipment, _) {
      return  shipment.incoming ? h(
            "span",
            { class: "text-green-600" },
            h("i", { class: "fa fa-reply-all" })
          ) : h(
            "span",
            { class: "text-orange-600" },
            h("i", { class: "fa fa-share-from-square" })
          );
    },
  },
]);

shipmentStore.removeShipment();

let shipmentParams = reactive({
  first: 25,
  before: "",
  incoming: viewIncoming.value,
  status: "",
  text: "",
  sort: ["-uid"],
  filterAction: false,
});
shipmentStore.fetcShipments(shipmentParams);
shipmentStore.fetchReferralLaboratories();

//
const shipmentSchema = object({
  laboratoryUid: number().required("Laboratory is Required").typeError("Laboratory is Required"),
  comment: string().nullable(),
  courier: string().required("Courier is required"),
  count: number()
});

const { handleSubmit, errors } = useForm({
  validationSchema: shipmentSchema,
  initialValues: {
    laboratoryUid: undefined,
    comment: "",
    courier: "",
    count: 1
  },
});

const { value: laboratoryUid } = useField("laboratoryUid");
const { value: comment } = useField("comment");
const { value: courier } = useField("courier");
const { value: count } = useField("count");

const saveForm = handleSubmit((values) => {
  showModal.value = false;
  withClientMutation<AddShipmentMutation, AddShipmentMutationVariables>(AddShipmentDocument, { payload: values }, "createShipment").then((result) => {
    shipmentStore.addShipment(result);
    showModal.value = false;
  });
});

function showMoreShipments(opts: any): void {
  shipmentParams.first = opts.fetchCount;
  shipmentParams.before = shipmentPageInfo?.value?.endCursor ?? "";
  shipmentParams.text = opts.filterText;
  shipmentParams.status = opts.filterStatus;
  shipmentParams.incoming =  viewIncoming.value,
  shipmentParams.filterAction = false;
  shipmentStore.fetcShipments(shipmentParams);
}

function searchShipments(opts: any): void {
  shipmentParams.first = 25;
  shipmentParams.before = "";
  shipmentParams.text = opts.filterText;
  shipmentParams.status = opts.filterStatus;
  shipmentParams.incoming =  viewIncoming.value,
  shipmentParams.filterAction = true;
  shipmentStore.clearShipment()
  shipmentStore.fetcShipments(shipmentParams);
}

const countNone = computed(
  () =>
    shipments?.value?.length + " of " + shipmentStore.getShipmentCount + " Shipments"
);
</script>

<template>
  <PageHeading title="Shipments" />
  <div class="flex justify-between items-center">
    <div>
      <!-- v-show="shield.hasRights(shield.actions.CREATE, shield.objects.SHIPMENT)" -->
      <button  @click.prevent="showModal = true"
        class="p-2 h-10 border-primary border text-primary rounded-sm transition duration-300 hover:bg-primary hover:text-white focus:outline-none">
        Add Shipment
      </button>
    </div>
  </div>
  <DataTable 
    :columns="tableColumns" 
    :data="shipments" 
    :toggleColumns="true" 
    :loading="fetchingShipments"
    :paginable="true" 
    :pageMeta="{
        fetchCount: shipmentParams.first,
        hasNextPage: shipmentPageInfo?.hasNextPage,
        countNone,
    }" 
    :searchable="true" 
    :filterable="true" 
    :filterMeta="{
      defaultFilter: shipmentParams.status,
      filters: filterOptions,
    }" 
    @onSearch="searchShipments" 
    @onPaginate="showMoreShipments" 
    :selectable="false"
  >
    <template v-slot:pre-filter>
      <label class="flex">
        <input type="checkbox" v-model="viewIncoming"> <span class="mx-2">InBound</span>
      </label>
    </template>
    <template v-slot:footer> </template>
  </DataTable>

  <!-- Location Edit Form Modal -->
  <modal v-if="showModal" @close="showModal = false">
    <template v-slot:header>
      <div>
        <h3>Create Shipment</h3>
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
            <span class="text-gray-700">External Laboratory</span>
            <select class="form-select block w-full mt-1" v-model="laboratoryUid">
              <option v-for="laboratory in shipmentStore.laboratories" :key="laboratory.uid" :value="laboratory.uid">
                {{ laboratory.name }}
              </option>
            </select>
          </label>
          <label class="block col-span-1 mb-2">
            <span class="text-gray-700">Courier</span>
            <input type="text" class="form-input mt-1 block w-full" v-model="courier" />
          </label>
          <label class="block col-span-1 mb-2">
            <span class="text-gray-700">How Many</span>
            <input type="number" class="form-input mt-1 block w-full" v-model="count" min="1" default=1/>
          </label>
        </div>
        <div class="grid grid-cols-3 gap-x-4 mb-4">
          <label class="block col-span-3 mb-2">
            <span class="text-gray-700">Comment</span>
            <textarea
              class="form-input mt-1 block w-full"
              rows="2"
              placeholder="Notes ..."
              v-model="comment"
            />
          </label>
        </div>

        <hr />
        <button type="button" @click.prevent="saveForm()"
          class="-mb-4 w-full border border-primary bg-primary text-white rounded-sm px-4 py-2 m-2 transition-colors duration-500 ease select-none hover:bg-primary focus:outline-none focus:shadow-outline">
          Create Shipment
        </button>
      </form>
    </template>
  </modal>
</template>
