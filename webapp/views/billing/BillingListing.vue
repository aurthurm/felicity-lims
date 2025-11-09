<script setup lang="ts">
import { ref, reactive, computed, h, defineAsyncComponent, onMounted } from "vue";
import { storeToRefs } from "pinia";
import { useBillingStore } from "@/stores/billing";
import { TestBillType } from "@/types/gql";

const DataTable = defineAsyncComponent(
  () => import("@/components/ui/datatable/FelDataTable.vue")
);

const BillDetail = defineAsyncComponent(
  () => import("@/components/billing/BillDetail.vue")
);

const billingStore = useBillingStore();
const { bills, billPageInfo, fetchingBills } = storeToRefs(billingStore);

// Bill detail drawer state
const showBillDetail = ref(false);
const selectedBill = ref<TestBillType | undefined>(undefined);

// Helper functions
function getStatusBadgeClass(status: string): string {
  const statusMap: Record<string, string> = {
    "pending": "bg-yellow-100 text-yellow-800",
    "received": "bg-blue-100 text-blue-800",
    "approved": "bg-green-100 text-green-800",
    "published": "bg-purple-100 text-purple-800",
    "rejected": "bg-red-100 text-red-800",
    "cancelled": "bg-gray-100 text-gray-800",
  };
  return statusMap[status?.toLowerCase()] || "bg-gray-100 text-gray-800";
}

function openBillDetail(bill: TestBillType): void {
  selectedBill.value = bill;
  showBillDetail.value = true;
}

function closeBillDetail(): void {
  showBillDetail.value = false;
  selectedBill.value = undefined;
}

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
    name: "Bill #",
    value: "billId",
    sortable: false,
    hidden: false,
    customRender: function (bill, _) {
      return h(
        "button",
        {
          onClick: () => openBillDetail(bill),
          type: "button",
          class: "px-2 py-1 font-semibold rounded-md hover:underline transition-colors duration-200 text-left cursor-pointer",
        },
        bill?.billId || "—"
      );
    },
  },
  {
    name: "Client",
    value: "client.name",
    sortable: false,
    hidden: false,
  },
  {
    name: "Patient",
    value: "",
    sortable: false,
    hidden: false,
    customRender: function (bill, _) {
      if (!bill?.orders || bill.orders.length === 0) {
        return h("span", "—");
      }
      const patient = bill.orders[0]?.patient;
      if (!patient) return h("span", "—");
      const fullName = `${patient?.firstName || ""} ${patient?.lastName || ""}`.trim();
      const gender = patient?.gender ? ` (${patient.gender})` : "";
      return h("span", `${fullName}${gender}`);
    },
  },
  {
    name: "Samples",
    value: "",
    sortable: false,
    hidden: false,
    customRender: function (bill, _) {
      if (!bill?.orders || bill.orders.length === 0) {
        return h("span", "—");
      }
      const sampleElements: any[] = [];
      bill.orders.forEach((order: any, orderIdx: number) => {
        if (order.samples && order.samples.length > 0) {
          order.samples.forEach((sample: any, sampleIdx: number) => {
            const statusClass = getStatusBadgeClass(sample?.status);
            sampleElements.push(
              h("div", { key: `${orderIdx}-${sampleIdx}`, class: "mb-2" }, [
                h("span", { class: "font-mono text-sm" }, sample?.sampleId || "—"),
                h("span", { class: "mx-2" }, "•"),
                h("span",
                  { class: `text-xs px-2 py-1 rounded ${statusClass}` },
                  sample?.status || "—"
                ),
              ])
            );
          });
        }
      });
      return h("div", sampleElements.length > 0 ? sampleElements : h("span", "—"));
    },
  },
  {
    name: "Amount Charged",
    value: "totalCharged",
    sortable: false,
    hidden: false,
    customRender: function (bill, _) {
      return h("span", `$${parseFloat(bill?.totalCharged || 0).toFixed(2)}`);
    },
  },
  {
    name: "Amount Paid",
    value: "totalPaid",
    sortable: false,
    hidden: false,
    customRender: function (bill, _) {
      return h("span", `$${parseFloat(bill?.totalPaid || 0).toFixed(2)}`);
    },
  },
  {
    name: "Balance",
    value: "",
    sortable: false,
    hidden: false,
    customRender: function (bill, _) {
      const balance = parseFloat(bill?.totalCharged || 0) - parseFloat(bill?.totalPaid || 0);
      const statusClass = balance > 0 ? "text-red-600" : "text-green-600";
      return h("span", { class: statusClass }, `$${balance.toFixed(2)}`);
    },
  },
  {
    name: "Partial",
    value: "partial",
    sortable: false,
    hidden: false,
    customRender: function (bill, _) {
      const isPartial = bill?.partial ? "Yes" : "No";
      const statusClass = bill?.partial ? "bg-orange-100 text-orange-800" : "bg-green-100 text-green-800";
      return h("span",
        { class: `px-2 py-1 rounded text-sm font-medium ${statusClass}` },
        isPartial
      );
    },
  },
  {
    name: "Status",
    value: "isActive",
    sortable: false,
    hidden: false,
    customRender: function (bill, _) {
      const status = bill?.isActive ? "Active" : "Inactive";
      const statusClass = bill?.isActive ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800";
      return h("span",
        { class: `px-2 py-1 rounded text-sm font-medium ${statusClass}` },
        status
      );
    },
  },
  {
    name: "Date",
    value: "createdAt",
    sortable: false,
    hidden: false,
    customRender: function (bill, _) {
      return h("span", new Date(bill?.createdAt).toLocaleDateString());
    },
  },
]);

let billParams = reactive({
  pageSize: 50,
  afterCursor: "",
  beforeCursor: "",
  text: "",
  isActive: null as boolean | null,
  partial: null as boolean | null,
  clientUid: "",
  sortBy: ["-uid"],
  filterAction: false,
});

// Filter state
const selectedPartial = ref<string | null>(null);
const selectedIsActive = ref<string | null>(null);

// Fetch initial bills
onMounted(() => {
  fetchBills();
});

async function fetchBills() {
  await billingStore.searchBills({
    pageSize: billParams.pageSize,
    afterCursor: billParams.afterCursor || undefined,
    beforeCursor: billParams.beforeCursor || undefined,
    text: billParams.text || undefined,
    isActive: billParams.isActive !== null ? billParams.isActive : undefined,
    partial: billParams.partial !== null ? billParams.partial : undefined,
    clientUid: billParams.clientUid || undefined,
    sortBy: billParams.sortBy,
  });
}

function handlePartialFilter(value: string | null): void {
  if (value === "all") {
    billParams.partial = null;
  } else if (value === "partial") {
    billParams.partial = true;
  } else if (value === "complete") {
    billParams.partial = false;
  }
  billParams.afterCursor = "";
  billParams.beforeCursor = "";
  billParams.filterAction = true;
  selectedPartial.value = value;
  fetchBills();
}

function handleIsActiveFilter(value: string | null): void {
  if (value === "all") {
    billParams.isActive = null;
  } else if (value === "active") {
    billParams.isActive = true;
  } else if (value === "inactive") {
    billParams.isActive = false;
  }
  billParams.afterCursor = "";
  billParams.beforeCursor = "";
  billParams.filterAction = true;
  selectedIsActive.value = value;
  fetchBills();
}

function searchBills(opts: any): void {
  billParams.pageSize = 100;
  billParams.afterCursor = "";
  billParams.beforeCursor = "";
  billParams.text = opts.filterText;
  billParams.filterAction = true;
  fetchBills();
}

function showMoreBills(opts: any): void {
  billParams.pageSize = opts.fetchCount;
  billParams.afterCursor = billPageInfo?.value?.endCursor ?? "";
  billParams.beforeCursor = "";
  billParams.text = opts.filterText;
  billParams.filterAction = false;
  fetchBills();
}

function filterByStatus(status: boolean | null): void {
  billParams.isActive = status;
  billParams.afterCursor = "";
  billParams.beforeCursor = "";
  billParams.filterAction = true;
  fetchBills();
}

const countNone = computed(
  () => `${bills?.value?.length} of ${billPageInfo?.value?.totalCount ?? 0} bills`
);
</script>

<template>
  <div class="space-y-6">
    <!-- Filters -->
    <div class="rounded-lg border border-border bg-card shadow-sm p-4">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <!-- Billing Type Filter -->
        <div>
          <label class="block text-sm font-medium text-foreground mb-2">Billing Type</label>
          <select
            :value="selectedPartial"
            @change="(e) => handlePartialFilter((e.target as HTMLSelectElement).value)"
            class="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="all">All Types</option>
            <option value="complete">Complete Bills</option>
            <option value="partial">Partial Bills</option>
          </select>
        </div>

        <!-- Bill Status Filter -->
        <div>
          <label class="block text-sm font-medium text-foreground mb-2">Bill Status</label>
          <select
            :value="selectedIsActive"
            @change="(e) => handleIsActiveFilter((e.target as HTMLSelectElement).value)"
            class="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Data Table -->
    <div class="rounded-lg border border-border bg-card shadow-sm p-6">
      <DataTable
        :columns="tableColumns"
        :data="bills"
        :toggleColumns="true"
        :loading="fetchingBills"
        :paginable="true"
        :pageMeta="{
          fetchCount: billParams.pageSize,
          hasNextPage: billPageInfo?.hasNextPage,
          countNone,
        }"
        :searchable="true"
        :filterable="false"
        @onSearch="searchBills"
        @onPaginate="showMoreBills"
        :selectable="false"
      />
    </div>
  </div>

  <!-- Bill Detail Drawer -->
  <fel-drawer :show="showBillDetail" @close="closeBillDetail" :content-width="'w-2/4'">
    <template v-slot:header>
      <span>Bill Details</span>
    </template>

    <template v-slot:body>
      <BillDetail v-if="selectedBill"
        :customerUid="selectedBill?.patientUid ?? ''"
        :testBill="selectedBill as TestBillType"
      />
    </template>
  </fel-drawer>
</template>
