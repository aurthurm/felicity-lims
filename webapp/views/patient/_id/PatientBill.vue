<script setup lang="ts">
import { defineAsyncComponent, ref, computed, h } from "vue";
import { useBillingStore, useSampleStore } from "@/stores";
import { storeToRefs } from "pinia";
import { parseDate } from "@/utils/helpers";
import { ITestBill, ITestBillTransaction } from "@/models/billing";
import { ADD_TEST_BILL_TRANSACTION,  CONFIRM_TEST_BILL_TRANSACTION, APPLY_BILL_VOUCHER } from "@/graphql/operations/billing.mutations";
import { useApiUtil, useBillComposable, useNotifyToast } from "@/composables";
import { useField, useForm } from "vee-validate";
import { object, string, number } from "yup";

const LoadingMessage = defineAsyncComponent(
  () => import("@/components/ui/spinners/FelLoadingMessage.vue")
)
const modal = defineAsyncComponent(
  () => import("@/components/ui/FelModal.vue")
)
const FelButton = defineAsyncComponent(
  () => import("@/components/ui/buttons/FelButton.vue")
)
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
const testBill = ref({} as ITestBill);
const selectTestBill = (tb: ITestBill) => {
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
  addTransaction(values as ITestBillTransaction)
});

const newTransaction = () => {
  setFieldValue("testBillUid", testBill.value?.uid)
  setFieldValue("kind", "cash")
  setFieldValue("amount", Math.ceil(Number((testBill?.value?.totalCharged - testBill?.value?.totalPaid).toFixed(2))))
  setFieldValue("notes", "")
  showTransactionModal.value = true;
}

const addTransaction = (values: ITestBillTransaction) => {
  withClientMutation(ADD_TEST_BILL_TRANSACTION, {payload: values}, "createTestBillTransaction"
  ).then((result) => {
    billingStore.addTransaction(result);
    processing.value = false;
    showTransactionModal.value = false;
    toastSuccess("Transaction added.");
  });
}

const showConfirmTransactionModal = ref(false);
const confirmTransaction = ref({} as ITestBillTransaction);
const submitConfirmTransaction = () => {
  processing.value = true;
  withClientMutation(
    CONFIRM_TEST_BILL_TRANSACTION, 
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
            class: "bg-sky-800 text-white py-1 px-2 rounded-sm leading-none",
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
  withClientMutation(APPLY_BILL_VOUCHER, {payload: {
    voucherCode: voucherCodeForm.value?.code,
    testBillUid: testBill.value?.uid,
    customerUid: props.patientUid
  }}, "applyVoucher"
  ).then((_) => (processing.value = false));
}

const { downloadInvoice } = useBillComposable();
const invoice = async (bill: ITestBill) => await downloadInvoice(bill.uid);
</script>

<style lang="css" scoped>
.billing-scroll {
  min-height: 350px;
}
</style>

<template>
  <div class="mt-4">
    <h4 class="text-sm text-gray-800 font-bold">Patient's Order Bills</h4>
    <hr>
    <div class="grid grid-cols-12 gap-4 mt-2">
      <section v-motion :initial="{ opacity: 0, y: 100 }" :enter="{ opacity: 1, y: 0, scale: 1 }"
        :variants="{ custom: { scale: 2 } }" :delay="400"
        class="col-span-3 overflow-y-scroll overscroll-contain billing-scroll">
        <div v-if="fetchingBills" class="py-4 text-center bg-white w-full mb-1 rounded-sm shadow border">
          <LoadingMessage message="Fetching bills ..." />
        </div>
        <div v-else>
          <ul>
            <li v-for="bill in bills" :key="bill.uid" :class="[
              'bg-white w-full flex items-center p-1 mb-1 rounded-sm shadow border',
              { 'border-sky-800 bg-emerald-200': bill.uid === testBill.uid },
              ]" 
              @click="selectTestBill(bill)">
              <div class="flex-grow p-1">
                <div class="font-semibold text-gray-800">
                  <div>{{ bill.billId?.toLocaleUpperCase() }}</div>
                  <div class="text-sm text-gray-400">{{ parseDate(bill.createdAt) }}</div>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </section>

      <section v-show="bills?.length > 0 && testBill.uid" v-motion :initial="{ opacity: 0, y: -100 }"
        :enter="{ opacity: 1, y: 0, scale: 1 }" :variants="{ custom: { scale: 2 } }" :delay="400" class="col-span-9">

        <div class="bg-white rounded-sm shadow-sm hover:shadow-xs duration-500 px-4 sm:px-6 md:px-2 py-4" v-motion-slide-top>
          <div class="flex justify-between items-center">
            <h4 class="text-gray-800 text-l font-bold">{{ testBill.billId?.toLocaleUpperCase() }}</h4>
          </div>
          <hr>
          <section class="grid grid-cols-3 gap-x-8">
            <div class="col-span-1">
              <div class="flex justify-between items-center mt-2">
                <span class="text-gray-800 text-sm font-semibold">Active:</span> 
                <span class="text-gray-600 text-sm md:text-md">{{ testBill.isActive ? "Yes" : "No" }}</span>
              </div>
              <div class="flex justify-between items-center mt-2">
                <span class="text-gray-800 text-sm font-semibold">Confirmed:</span> 
                <span class="text-gray-600 text-sm md:text-md">{{ testBill?.toConfirm ? "No" : "Yes" }}</span>
              </div>
            </div>
            <div class="col-span-1">
              <div class="flex justify-between items-center mt-2">
                <span class="text-gray-800 text-sm font-semibold">Total Charged:</span> 
                <span class="text-gray-600 text-sm md:text-md">{{ testBill?.totalCharged }}</span>
              </div>
              <div class="flex justify-between items-center mt-2">
                <span class="text-gray-800 text-sm font-semibold">Total Paid:</span> 
                <span class="text-gray-600 text-sm md:text-md">{{ testBill?.totalPaid }}</span>
              </div>
            </div>
            <div class="col-span-1">
              <div class="flex justify-between items-center mt-2">
                <span class="text-gray-800 text-sm font-semibold">Partial:</span> 
                <span class="text-gray-600 text-sm md:text-md">{{ testBill?.totalPaid < testBill?.totalCharged ? "Yes" : "No" }}</span>
              </div>
            </div>
          </section>
        </div>
        <div class="mt-4">
          <div class="flex justify-between items-center">
            <h4 class=" text-gray-800 text-l font-semibold">Order Items</h4>
            <button
                class="ml-4 px-2 py-1 mr-2 border-sky-800 border text-sky-800 rounded-sm transition duration-300 hover:bg-sky-800 hover:text-white focus:outline-none"
                @click.prevent="invoice(testBill)">
                Invoice
            </button>
          </div>
          <hr>
          <ul class="mt-4 bg-white rounded-sm shadow-sm hover:shadow-xs duration-500 px-4 sm:px-6 md:px-2 py-4">
            <li class="font-semibold" v-for="order in orders" :key="order.uid">
              <div>{{ order?.requestId }} ({{ order?.clientRequestId }})</div>
              <div class="ml-4 text-sm" v-for="sample in order.samples" :key="sample.uid" v-motion-slide-right>
                <span class="text-gray-400">
                    {{ sample.sampleId }}
                </span> 
                &rArr;
                <span class="ml-2 text-md leading-5 text-sky-600">
                    {{ profileAnalysesText(sample.profiles ?? [], sample.analyses ?? []) }}
                </span>
              </div>
            </li>
          </ul>
        </div>
        <div class="mt-4">
          <div class="flex justify-between items-center">
            <h4 class="text-gray-800 text-l font-semibold">Transactions</h4>
            <div>
              <button v-show="testBill.isActive"
              class="px-2 py-1 mr-2 border-sky-800 border text-sky-800 rounded-sm transition duration-300 hover:bg-sky-800 hover:text-white focus:outline-none"
              @click.prevent="newTransaction">
              Add Transaction
            </button>
            <button v-show="testBill.isActive"
              class="ml-4 px-2 py-1 mr-2 border-sky-800 border text-sky-800 rounded-sm transition duration-300 hover:bg-sky-800 hover:text-white focus:outline-none"
              @click.prevent="applyVoucher">
              Apply Voucher
            </button>
            </div>
          </div>
          <hr>
          <div class="mt-4 bg-white rounded-sm shadow-sm hover:shadow-xs duration-500 px-4 sm:px-6 md:px-2 py-4">
            <DataTable 
            :columns="tableColumns" 
            :data="transactions" 
            :toggleColumns="false" 
            :loading="fetchingTransactions"
            :paginable="false" 
            :searchable="false" :filterable="false" 
            :selectable="false">
                <template v-slot:footer> </template>
            </DataTable>
          </div>
        </div>
      </section>
    </div>
  </div>

  <!-- New Transaction Form Modal -->
  <modal v-if="showTransactionModal" @close="showTransactionModal = false" :contentWidth="'w-3/6'">
      <template v-slot:header>
        <h3>Transaction Form</h3>
      </template>

      <template v-slot:body>
        <form>
          <div class="grid grid-cols-2 gap-x-4 mb-4">
            <label class="whitespace-nowrap mb-2 w-full">
              <span class="text-gray-700 w-4/12">Kind of payment</span>
              <div class="w-full">
                <select 
                :class="['form-select mt-1 w-full', {'border-red-500 animate-pulse': errors.kind }]"
                v-model="kind" 
                :disabled="processing">
                  <option></option>
                  <option v-for="kind of kinds" :key="kind" :value="kind">
                    {{ kind }}
                  </option>
                </select>
                <div class="text-orange-600 w-4/12">{{ errors.gender }}</div>
              </div>
            </label>
            <label class="block col-span-1 mb-2">
              <span class="text-gray-700">Amount</span>
              <input
                :class="['form-input mt-1 block w-full', {'border-red-500 animate-pulse': errors.amount }]"
                type="number"
                v-model="amount"
                :disabled="processing"
              />
            </label>
          </div>
          <div class="grid grid-cols-4 gap-x-4 mb-4">
            <label class="block col-span-4 mb-2">
              <span class="text-gray-700">Notes</span>
              <input
                :class="['form-input mt-1 block w-full', {'border-red-500 animate-pulse': errors.notes }]"
                v-model="notes"
                :disabled="processing"
              />
            </label>
          </div>

          <hr class="mb-4" />
          <FelButton :color="'sky-800'" type="submit" :loading="processing" @click.prevent="submitTransactionForm">
            Save Transaction
          </FelButton>
        </form>
      </template>
  </modal>

  <!-- Confirm Transaction Form Modal -->
  <modal v-if="showConfirmTransactionModal" @close="showConfirmTransactionModal = false" :contentWidth="'w-3/6'">
    <template v-slot:header>
      <h3>Confirm Tranaction</h3>
    </template>

    <template v-slot:body>
      <form>
        <h4>{{ kind }} Transaction </h4>
        <div class="grid grid-cols-4 gap-x-4 mb-4">
          <label class="block col-span-4 mb-2">
            <span class="text-gray-700">Notes</span>
            <input
              :class="['form-input mt-1 block w-full', {'border-red-500 animate-pulse': errors.notes }]"
              v-model="confirmTransaction.notes"
              :disabled="processing"
            />
          </label>
        </div>
        <hr class="mb-4" />
        <FelButton :color="'sky-800'" type="submit" :loading="processing" @click.prevent="submitConfirmTransaction">
          Confirm Transaction
        </FelButton>
      </form>
    </template>
  </modal>


  <!-- Voucher Code Form Modal -->
  <modal v-if="showVoucherModal" @close="showVoucherModal = false" :contentWidth="'w-1/5'">
      <template v-slot:header>
        <h3>Apply Voucher Code Form</h3>
      </template>

      <template v-slot:body>
        <form>
          <div class="grid grid-cols-2 gap-x-4 mb-4">
            <label class="block col-span-2 mb-2">
              <span class="text-gray-700">Voucher Code:</span>
              <input
                :class="['form-input mt-1 block w-full', {'border-red-500 animate-pulse': !voucherCodeForm.code }]"
                type="text"
                v-model="voucherCodeForm.code"
                :disabled="processing"
              />
            </label>
          </div>

          <hr class="mb-4"/>
          <FelButton :color="'sky-800'" type="submit" :loading="processing" @click.prevent="submitVoucherCodeForm">
            Apply Voucher
          </FelButton>
        </form>
      </template>
  </modal>
</template>
