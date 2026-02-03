<script setup lang="ts">
import { ref, reactive, computed, h, defineAsyncComponent } from "vue";
import { storeToRefs } from "pinia";
import { useRoute } from "vue-router";
import { RouterLink } from "vue-router";
import { useShipmentStore } from "@/stores/shipment";
import useApiUtil  from "@/composables/api_util";
import { AddShipmentDocument, AddShipmentMutation, AddShipmentMutationVariables } from "@/graphql/operations/shipment.mutations";
import { useForm } from "vee-validate";
import { object, string, number } from "yup";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import PageHeading from "@/components/common/PageHeading.vue"
const DataTable = defineAsyncComponent(
  () => import("@/components/common/DataTable.vue")
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
shipmentStore.fetchShipments(shipmentParams);
shipmentStore.fetchReferralLaboratories();

//
const shipmentSchema = object({
  laboratoryUid: number().required("Laboratory is Required").typeError("Laboratory is Required"),
  comment: string().nullable(),
  courier: string().required("Courier is required"),
  count: number()
});

const { handleSubmit } = useForm({
  validationSchema: shipmentSchema,
  initialValues: {
    laboratoryUid: undefined,
    comment: "",
    courier: "",
    count: 1
  },
});

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
  shipmentParams.incoming = viewIncoming.value;
  shipmentParams.filterAction = false;
  shipmentStore.fetcShipments(shipmentParams);
}

function searchShipments(opts: any): void {
  shipmentParams.first = 25;
  shipmentParams.before = "";
  shipmentParams.text = opts.filterText;
  shipmentParams.status = opts.filterStatus;
  shipmentParams.incoming = viewIncoming.value;
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
    <PageHeading title="Shipments">
      <Button @click="showModal = true">Create New</Button>
    </PageHeading>

    <div class="flex items-center space-x-4 mb-4">
      <Button
        @click="viewIncoming = !viewIncoming"
        :class="[viewIncoming
            ? 'bg-primary text-primary-foreground hover:bg-primary/90'
            : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
        ]"
        :aria-pressed="viewIncoming"
      >
        {{ viewIncoming ? 'Incoming' : 'Outgoing' }}
      </Button>
    </div>

    <div class="bg-card rounded-lg shadow-sm p-6">
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
          <label class="flex items-center">
            <Checkbox :checked="viewIncoming" @update:checked="(value) => viewIncoming = value" />
            <span class="mx-2">InBound</span>
          </label>
        </template>
        <template v-slot:footer> </template>
      </DataTable>
    </div>
  </div>

  <Modal v-if="showModal" @close="showModal = false" >
    <template v-slot:header>
      <h3 class="text-lg font-medium leading-6 text-foreground">Create New Shipment</h3>
    </template>

    <template v-slot:body>
      <Form class="space-y-6" @submit="saveForm">
        <div class="grid grid-cols-3 gap-6">
          <FormField name="laboratoryUid" v-slot="{ componentField }">
            <FormItem>
              <FormLabel>External Laboratory</FormLabel>
              <FormControl>
                <Select v-bind="componentField">
                  <SelectTrigger>
                    <SelectValue placeholder="Select a laboratory" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem v-for="laboratory in shipmentStore.laboratories" :key="laboratory.uid" :value="laboratory.uid">
                      {{ laboratory.name }}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
          
          <FormField name="courier" v-slot="{ componentField }">
            <FormItem>
              <FormLabel>Courier</FormLabel>
              <FormControl>
                <Input v-bind="componentField" placeholder="Courier" />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>

          <FormField name="count" v-slot="{ componentField }">
            <FormItem>
              <FormLabel>How Many</FormLabel>
              <FormControl>
                <Input v-bind="componentField" type="number" min="1" />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
        </div>

        <FormField name="comment" v-slot="{ componentField }">
          <FormItem>
            <FormLabel>Comment</FormLabel>
            <FormControl>
              <Textarea v-bind="componentField" rows="2" placeholder="Notes ..." />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>

        <div class="border-t border-border pt-4">
          <Button type="submit" class="w-full">Create Shipment</Button>
        </div>
      </Form>
    </template>
  </Modal>
</template>
