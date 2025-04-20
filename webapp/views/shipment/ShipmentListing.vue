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
        class: "bg-primary text-primary-foreground py-1 px-2 rounded-sm leading-none",
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
            { class: "text-success" },
            h("i", { class: "fa fa-reply-all" })
          ) : h(
            "span",
            { class: "text-destructive" },
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
  <div class="space-y-6">
    <fel-heading>
      <template v-slot:title>Shipments</template>
      <template v-slot:buttons>
        <button
          @click="showModal = true"
          class="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background bg-primary text-primary-foreground hover:bg-primary/90 h-10 py-2 px-4"
          aria-label="Create New Shipment"
        >
          Create New
        </button>
      </template>
    </page-heading>

    <div class="flex items-center space-x-4 mb-4">
      <button
        @click="viewIncoming = !viewIncoming"
        :class="[
          'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background h-10 py-2 px-4',
          viewIncoming
            ? 'bg-primary text-primary-foreground hover:bg-primary/90'
            : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
        ]"
        :aria-pressed="viewIncoming"
      >
        {{ viewIncoming ? 'Incoming' : 'Outgoing' }}
      </button>
    </div>

    <data-table
      :columns="columns"
      :data="shipmentStore.shipments"
      :loading="loading"
      :total="shipmentStore.total"
      :filter-options="filterOptions"
      @load-more="showMoreShipments"
      @search="searchShipments"
      class="bg-background rounded-lg shadow-sm"
    />
  </div>

  <fel-modal v-if="showModal" @close="showModal = false" class="max-w-2xl">
    <template v-slot:header>
      <h3 class="text-lg font-medium leading-6 text-foreground">Create New Shipment</h3>
    </template>

    <template v-slot:validation>
      <div v-if="errors.length" class="bg-destructive/10 text-destructive p-4 rounded-md mb-4">
        <ul class="list-disc list-inside space-y-1">
          <li v-for="(error, index) in errors" :key="index" class="text-sm">
            {{ error }}
          </li>
        </ul>
      </div>
    </template>

    <template v-slot:body>
      <form action="post" class="space-y-6">
        <div class="grid grid-cols-3 gap-6">
          <div class="col-span-1">
            <label class="block space-y-1.5">
              <span class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">External Laboratory</span>
              <select 
                class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                v-model="laboratoryUid"
              >
                <option v-for="laboratory in shipmentStore.laboratories" :key="laboratory.uid" :value="laboratory.uid">
                  {{ laboratory.name }}
                </option>
              </select>
            </label>
          </div>
          
          <div class="col-span-1">
            <label class="block space-y-1.5">
              <span class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Courier</span>
              <input 
                type="text" 
                class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                v-model="courier" 
              />
            </label>
          </div>

          <div class="col-span-1">
            <label class="block space-y-1.5">
              <span class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">How Many</span>
              <input 
                type="number" 
                class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                v-model="count" 
                min="1" 
                default="1"
              />
            </label>
          </div>
        </div>

        <div>
          <label class="block space-y-1.5">
            <span class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Comment</span>
            <textarea
              class="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              rows="2"
              placeholder="Notes ..."
              v-model="comment"
            />
          </label>
        </div>

        <div class="border-t border-border pt-4">
          <button 
            type="button" 
            @click.prevent="saveForm()"
            class="inline-flex w-full items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4"
          >
            Create Shipment
          </button>
        </div>
      </form>
    </template>
  </fel-modal>
</template>
