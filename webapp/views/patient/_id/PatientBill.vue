<script setup lang="ts">
import { defineAsyncComponent, ref, computed, h } from "vue";
import { useBillingStore } from "@/stores/billing";
import { useSampleStore } from "@/stores/sample";
import { storeToRefs } from "pinia";
import { parseDate } from "@/utils";
import { TestBillType, TestBillTransactionType } from "@/types/gql";
import { 
  AddTestBillTransactionDocument, AddTestBillTransactionMutation, AddTestBillTransactionMutationVariables,
  ConfirmTestBillTransactionDocument, ConfirmTestBillTransactionMutation, ConfirmTestBillTransactionMutationVariables,
  ApplyBillVoucherDocument, ApplyBillVoucherMutation, ApplyBillVoucherMutationVariables
} from "@/graphql/operations/billing.mutations";
import useApiUtil from "@/composables/api_util";
import useBillComposable from "@/composables/bills";
import useNotifyToast from "@/composables/alert_toast";
import { useField, useForm } from "vee-validate";
import { object, string, number } from "yup";

const DataTable = defineAsyncComponent(
  () => import("@/components/ui/datatable/FelDataTable.vue")
)
const props = defineProps({
  patientUid: String
});

const { toastSuccess } = useNotifyToast();
const { withClientMutation } = useApiUtil();

const billingStore = useBillingStore();
const sampleStore = useSampleStore();
const { bills, fetchingBills, transactions, fetchingTransactions } = storeToRefs(billingStore)
const { analysisRequests } = storeToRefs(sampleStore)
billingStore.fetchBillsForPatient(props?.patientUid!);

const kinds = ref(["cash", "medical-aid", "e-payment"])
const showTransactionModal = ref(false);
const testBill = ref({} as TestBillType);
const selectTestBill = (tb: TestBillType) => {
  testBill.value = {...tb};
  billingStore.fetchBillTransactions(tb.uid)
}

const orders = computed(() => {
  const orderUids = testBill?.value?.orders?.map(order => order.uid) ?? [];
  return analysisRequests?.value?.filter(ar => orderUids.includes(ar.uid));
})

function profileAnalysesText(profiles: any[], analyses: any[]): string {
  let names: string[] = [];
  profiles.forEach((p) => names.push(p.name));
  analyses.forEach((a) => names.push(a.name));
  return names.join(", ");
}

const transactionSchema = object({
  testBillUid: string().required(),
  kind: string().required(),
  amount: number().required(),
  notes: string(),
});

const { handleSubmit, errors, setFieldValue } = useForm({
  validationSchema: transactionSchema,
  initialValues: {
    testBillUid: testBill.value?.uid
  } as any,
});

const { value: kind } = useField("kind");
const { value: amount } = useField("amount");
const { value: notes } = useField("notes");

const processing = ref(false);
const submitTransactionForm = handleSubmit((values) => {
  processing.value = true;
  addTransaction(values as TestBillTransactionType)
});

const newTransaction = () => {
  setFieldValue("testBillUid", testBill.value?.uid)
  setFieldValue("kind", "cash")
  setFieldValue("amount", Math.ceil(Number((testBill?.value?.totalCharged - testBill?.value?.totalPaid).toFixed(2))))
  setFieldValue("notes", "")
  showTransactionModal.value = true;
}

const addTransaction = (values: TestBillTransactionType) => {
  withClientMutation<AddTestBillTransactionMutation, AddTestBillTransactionMutationVariables>(AddTestBillTransactionDocument, {payload: values}, "createTestBillTransaction"
  ).then((result) => {
    billingStore.addTransaction(result);
    processing.value = false;
    showTransactionModal.value = false;
    toastSuccess("Transaction added.");
  });
}

const showConfirmTransactionModal = ref(false);
const confirmTransaction = ref({} as TestBillTransactionType);
const submitConfirmTransaction = () => {
  processing.value = true;
  withClientMutation<ConfirmTestBillTransactionMutation, ConfirmTestBillTransactionMutationVariables>(ConfirmTestBillTransactionDocument, 
    {
      uid: confirmTransaction.value.uid,
      notes: confirmTransaction.value.notes
    }, 
    "confirmTestBillTransaction"
  ).then((result) => {
    billingStore.updateTransaction(result);
    processing.value = false;
    showConfirmTransactionModal.value = false;
    toastSuccess("Transaction confirmed.");
  });
}

const tableColumns = ref([
{
    name: "Kind",
    value: "kind",
    sortable: true,
    sortBy: "asc",
    defaultSort: true,
    showInToggler: false,
    hidden: false,
  }, 
  {
    name: "Amount",
    value: "amount",
    sortable: false,
    sortBy: "asc",
    hidden: false,
  },
  {
    name: "Success",
    value: "isSuccess",
    sortable: false,
    sortBy: "asc",
    hidden: false,
  },
  {
    name: "Notes",
    value: "notes",
    sortable: false,
    sortBy: "asc",
    hidden: false,
  },
  {
    name: "Message",
    value: "message",
    sortable: false,
    sortBy: "asc",
    hidden: false,
  },
  {
    name: "Processed",
    value: "processed",
    sortable: false,
    sortBy: "asc",
    hidden: false,
    customRender: function (transaction, _) {
      return h(
        "span",
        {
          innerHTML: transaction.processed ? "Yes" : "Pending confirmation",
        },
        []
      );
    },
  },
  {
    name: "Action",
    sortable: false,
    hidden: false,
    customRender: (transaction, _) => {
      if (!transaction.processed) {
        return h(
          "button",
          {
            onClick() {
              showConfirmTransactionModal.value = true;
              confirmTransaction.value = transaction;
            },
            type: "button",
            class: "bg-primary text-primary-foreground py-1 px-2 rounded-sm leading-none",
          },
          "confirm"
        );
      }
    }
  }
])

const showVoucherModal = ref(false);
const voucherCodeForm = ref({ code: "" });
const applyVoucher = () => {
  showVoucherModal.value = true;
}

const submitVoucherCodeForm = () => {
  processing.value = true;
  withClientMutation<ApplyBillVoucherMutation, ApplyBillVoucherMutationVariables>(ApplyBillVoucherDocument, {payload: {
    voucherCode: voucherCodeForm.value?.code,
    testBillUid: testBill.value?.uid,
    customerUid: props.patientUid!  
  }}, "applyVoucher"
  ).then((_) => (processing.value = false));
}

const { downloadInvoice } = useBillComposable();
const invoice = async (bill: TestBillType) => await downloadInvoice(bill.uid);
</script>

<style lang="css" scoped>
.billing-scroll {
  min-height: 350px;
  max-height: calc(100vh - 200px);
}
</style>

<template>
  <div class="space-y-6">
    <div class="grid grid-cols-12 gap-6">
      <section v-motion :initial="{ opacity: 0, y: 100 }" :enter="{ opacity: 1, y: 0, scale: 1 }"
        :variants="{ custom: { scale: 2 } }" :delay="400"
        class="col-span-3 overflow-y-auto overscroll-contain billing-scroll">
        <div v-if="fetchingBills" class="py-4 text-center bg-background w-full mb-2 rounded-lg shadow-sm border border-border">
          <fel-loader message="Fetching bills ..." />
        </div>
        <div v-else>
          <ul class="space-y-2" v-if="bills?.length > 0">
            <li v-for="bill in bills" :key="bill.uid" :class="[
              'bg-background w-full p-3 rounded-lg shadow-sm border border-border transition-all duration-200 hover:shadow-md',
              { 'border-primary bg-primary/5': bill.uid === testBill.uid },
              ]" 
              @click="selectTestBill(bill)">
              <div class="space-y-1">
                <div class="font-semibold text-foreground">
                  Bill {{ bill.billId?.toLocaleUpperCase() }}
                </div>
                <div class="text-sm text-muted-foreground">{{ parseDate(bill.createdAt) }}</div>
              </div>
            </li>
          </ul>
          <div v-else class="py-4 text-center bg-background w-full mb-2 rounded-lg shadow-sm border border-border">
            No bills found for this patient.
          </div>
        </div>
      </section>

      <section v-show="bills?.length > 0 && testBill.uid" v-motion :initial="{ opacity: 0, y: -100 }"
        :enter="{ opacity: 1, y: 0, scale: 1 }" :variants="{ custom: { scale: 2 } }" :delay="400" class="col-span-9 space-y-6">

        <div class="bg-background rounded-lg shadow-sm p-6 space-y-4" v-motion-slide-top>
          <div class="flex justify-between items-center">
            <h4 class="text-lg font-semibold text-foreground">{{ testBill.billId?.toLocaleUpperCase() }}</h4>
          </div>
          <div class="grid grid-cols-3 gap-8">
            <div class="space-y-4">
              <div class="flex justify-between items-center">
                <span class="text-sm font-medium text-foreground">Active:</span> 
                <span class="text-sm text-foreground">{{ testBill.isActive ? "Yes" : "No" }}</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-sm font-medium text-foreground">Confirmed:</span> 
                <span class="text-sm text-foreground">{{ testBill?.toConfirm ? "No" : "Yes" }}</span>
              </div>
            </div>
            <div class="space-y-4">
              <div class="flex justify-between items-center">
                <span class="text-sm font-medium text-foreground">Total Charged:</span> 
                <span class="text-sm text-foreground">{{ testBill?.totalCharged }}</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-sm font-medium text-foreground">Total Paid:</span> 
                <span class="text-sm text-foreground">{{ testBill?.totalPaid }}</span>
              </div>
            </div>
            <div class="space-y-4">
              <div class="flex justify-between items-center">
                <span class="text-sm font-medium text-foreground">Partial:</span> 
                <span class="text-sm text-foreground">{{ testBill?.totalPaid < testBill?.totalCharged ? "Yes" : "No" }}</span>
              </div>
            </div>
          </div>
        </div>

        <div class="space-y-4">
          <div class="flex justify-between items-center">
            <h4 class="text-lg font-semibold text-foreground">Order Items</h4>
            <button
                class="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary/50"
                @click.prevent="invoice(testBill)">
                Invoice
            </button>
          </div>
          <ul class="bg-background rounded-lg shadow-sm p-6 space-y-4">
            <li class="space-y-2" v-for="order in orders" :key="order.uid">
              <div class="font-semibold text-foreground">{{ order?.requestId }} ({{ order?.clientRequestId }})</div>
              <div class="space-y-1 pl-4" v-for="sample in order.samples" :key="sample.uid" v-motion-slide-right>
                <span class="text-muted-foreground">
                    {{ sample.sampleId }}
                </span> 
                &rArr;
                <span class="ml-2 text-primary">
                    {{ profileAnalysesText(sample.profiles ?? [], sample.analyses ?? []) }}
                </span>
              </div>
            </li>
          </ul>
        </div>

        <div class="space-y-4">
          <div class="flex justify-between items-center">
            <h4 class="text-lg font-semibold text-foreground">Transactions</h4>
            <div class="space-x-4">
              <button v-show="testBill.isActive"
                class="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary/50"
                @click.prevent="newTransaction">
                Add Transaction
              </button>
              <button v-show="testBill.isActive"
                class="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary/50"
                @click.prevent="applyVoucher">
                Apply Voucher
              </button>
            </div>
          </div>
          <div class="bg-background rounded-lg shadow-sm p-6">
            <DataTable 
              :columns="tableColumns as any" 
              :data="transactions" 
              :toggleColumns="false" 
              :loading="fetchingTransactions"
              :paginable="false" 
              :searchable="false" 
              :filterable="false" 
              :selectable="false">
              <template v-slot:footer> </template>
            </DataTable>
          </div>
        </div>
      </section>
    </div>
  </div>

  <!-- New Transaction Form Modal -->
  <fel-modal v-if="showTransactionModal" @close="showTransactionModal = false" :contentWidth="'w-3/6'" class="bg-background">
    <template v-slot:header>
      <h3 class="text-xl font-semibold text-foreground">Transaction Form</h3>
    </template>

    <template v-slot:body>
      <form class="space-y-6 p-6">
        <div class="grid grid-cols-2 gap-6">
          <label class="space-y-2">
            <span class="text-sm font-medium text-foreground">Kind of payment</span>
            <select 
              :class="['w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2', {'border-destructive': errors.kind }]"
              v-model="kind" 
              :disabled="processing">
              <option></option>
              <option v-for="kind of kinds" :key="kind" :value="kind">
                {{ kind }}
              </option>
            </select>
            <div class="text-sm text-destructive">{{ errors.gender }}</div>
          </label>
          <label class="space-y-2">
            <span class="text-sm font-medium text-foreground">Amount</span>
            <input
              :class="['w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2', {'border-destructive': errors.amount }]"
              type="number"
              v-model="amount"
              :disabled="processing"
            />
          </label>
        </div>
        <label class="space-y-2">
          <span class="text-sm font-medium text-foreground">Notes</span>
          <input
            :class="['w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2', {'border-destructive': errors.notes }]"
            v-model="notes"
            :disabled="processing"
          />
        </label>

        <div class="flex justify-end">
          <fel-button :color="'primary'" type="submit" :loading="processing" @click.prevent="submitTransactionForm">
            Save Transaction
          </fel-button>
        </div>
      </form>
    </template>
  </fel-modal>

  <!-- Confirm Transaction Form Modal -->
  <fel-modal v-if="showConfirmTransactionModal" @close="showConfirmTransactionModal = false" :contentWidth="'w-3/6'" class="bg-background">
    <template v-slot:header>
      <h3 class="text-xl font-semibold text-foreground">Confirm Transaction</h3>
    </template>

    <template v-slot:body>
      <form class="space-y-6 p-6">
        <h4 class="text-lg font-medium text-foreground">{{ kind }} Transaction</h4>
        <label class="space-y-2">
          <span class="text-sm font-medium text-foreground">Notes</span>
          <input
            :class="['w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2', {'border-destructive': errors.notes }]"
            v-model="confirmTransaction.notes"
            :disabled="processing"
          />
        </label>

        <div class="flex justify-end">
          <fel-button :color="'primary'" type="submit" :loading="processing" @click.prevent="submitConfirmTransaction">
            Confirm Transaction
          </fel-button>
        </div>
      </form>
    </template>
  </fel-modal>

  <!-- Voucher Code Form Modal -->
  <fel-modal v-if="showVoucherModal" @close="showVoucherModal = false" :contentWidth="'w-1/5'" class="bg-background">
    <template v-slot:header>
      <h3 class="text-xl font-semibold text-foreground">Apply Voucher Code</h3>
    </template>

    <template v-slot:body>
      <form class="space-y-6 p-6">
        <label class="space-y-2">
          <span class="text-sm font-medium text-foreground">Voucher Code</span>
          <input
            :class="['w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2', {'border-destructive': !voucherCodeForm.code }]"
            type="text"
            v-model="voucherCodeForm.code"
            :disabled="processing"
          />
        </label>

        <div class="flex justify-end">
          <fel-button :color="'primary'" type="submit" :loading="processing" @click.prevent="submitVoucherCodeForm">
            Apply Voucher
          </fel-button>
        </div>
      </form>
    </template>
  </fel-modal>
</template>
