<script setup lang="ts">
import { defineAsyncComponent, ref, h, PropType, onMounted, watch } from "vue";
import { useBillingStore } from "@/stores/billing";
import { storeToRefs } from "pinia";
import { TestBillType, TestBillTransactionType, AnalysisRequestType } from "@/types/gql";
import { 
  AddTestBillTransactionDocument, AddTestBillTransactionMutation, AddTestBillTransactionMutationVariables,
  ConfirmTestBillTransactionDocument, ConfirmTestBillTransactionMutation, ConfirmTestBillTransactionMutationVariables,
  ApplyBillVoucherDocument, ApplyBillVoucherMutation, ApplyBillVoucherMutationVariables
} from "@/graphql/operations/billing.mutations";
import { GetOrdersByBillUidDocument, GetOrdersByBillUidQuery, GetOrdersByBillUidQueryVariables } from "@/graphql/operations/billing.queries";
import useApiUtil from "@/composables/api_util";
import useBillComposable from "@/composables/bills";
import useNotifyToast from "@/composables/alert_toast";
import { useForm } from "vee-validate";
import { object, string, number } from "yup";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {FormControl,
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

const DataTable = defineAsyncComponent(
  () => import("@/components/common/DataTable.vue")
)
const props = defineProps({
  customerUid: {
    type: String,
    required: true,
  },
  testBill: {
    type: Object as PropType<TestBillType>,
    required: true,
  },
});

const { toastSuccess } = useNotifyToast();
const { withClientMutation, withClientQuery } = useApiUtil();

const billingStore = useBillingStore();
const { transactions, fetchingTransactions } = storeToRefs(billingStore)

const kinds = ref(["cash", "medical-aid", "e-payment"])
const showTransactionModal = ref(false);

onMounted(() => {
  selectTestBill(props.testBill);
});

watch(() => props.testBill, (newVal) => {
  if (newVal?.uid) {
      selectTestBill(newVal);
    }
  },
  { deep: true }
);

const selectTestBill = (tb: TestBillType) => {
  orders.value = [] as AnalysisRequestType[];
  billingStore.fetchBillTransactions(tb.uid)
  getOrders(tb.uid);
}

const orders = ref([] as AnalysisRequestType[])

const getOrders = async (billUid: string) => {
  const result = await withClientQuery<GetOrdersByBillUidQuery, GetOrdersByBillUidQueryVariables>(
      GetOrdersByBillUidDocument, { uid: billUid }, "ordersByBillUid"
  )
  orders.value = result as unknown as AnalysisRequestType[];
}

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

const { handleSubmit, setFieldValue, values } = useForm({
  validationSchema: transactionSchema,
  initialValues: {
    testBillUid: props.testBill?.uid
  } as any,
});

const processing = ref(false);
const submitTransactionForm = handleSubmit((values) => {
  processing.value = true;
  addTransaction(values as TestBillTransactionType)
});

const newTransaction = () => {
  if (!props.testBill?.uid) return;
  setFieldValue("testBillUid", props.testBill?.uid);
  setFieldValue("kind", "cash")
  setFieldValue("amount", Math.ceil(Number((props.testBill?.totalCharged - props.testBill?.totalPaid).toFixed(2))))
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

watch(showConfirmTransactionModal, (open) => {
  if (!open) return;
  setFieldValue("kind", confirmTransaction.value?.kind ?? "");
  setFieldValue("notes", confirmTransaction.value?.notes ?? "");
});

const submitVoucherCodeForm = () => {
  processing.value = true;
  withClientMutation<ApplyBillVoucherMutation, ApplyBillVoucherMutationVariables>(ApplyBillVoucherDocument, {payload: {
    voucherCode: voucherCodeForm.value?.code,
    testBillUid: props.testBill?.uid,
    customerUid: props.customerUid
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
    <section v-show="testBill.uid" v-motion :initial="{ opacity: 0, y: -100 }"
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
          <Button
              @click.prevent="invoice(testBill)"
              type="button"
          >
              Invoice
          </Button>
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
            <Button v-show="testBill.isActive"
              @click.prevent="newTransaction"
              type="button"
            >
              Add Transaction
            </Button>
            <Button v-show="testBill.isActive"
              @click.prevent="applyVoucher"
              type="button"
            >
              Apply Voucher
            </Button>
          </div>
        </div>
        <div class="bg-background rounded-lg shadow-sm p-6">
          <DataTable 
            :columns="tableColumns" 
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

  <!-- New Transaction Form Modal -->
  <Modal v-if="showTransactionModal" @close="showTransactionModal = false" :contentWidth="'w-3/6'" class="bg-background">
    <template v-slot:header>
      <h3 class="text-xl font-semibold text-foreground">Transaction Form</h3>
    </template>

    <template v-slot:body>
      <form class="space-y-6 p-6" @submit.prevent="submitTransactionForm">
        <div class="grid grid-cols-2 gap-6">
          <FormField name="kind" v-slot="{ componentField }">
            <FormItem>
              <FormLabel>Kind of payment</FormLabel>
              <FormControl>
                <Select v-bind="componentField" :disabled="processing">
                  <SelectTrigger>
                    <SelectValue placeholder="Select kind" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem v-for="kind in kinds" :key="kind" :value="kind">
                      {{ kind }}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
          <FormField name="amount" v-slot="{ componentField }">
            <FormItem>
              <FormLabel>Amount</FormLabel>
              <FormControl>
                <Input v-bind="componentField" type="number" :disabled="processing" />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
        </div>
        <FormField name="notes" v-slot="{ componentField }">
          <FormItem>
            <FormLabel>Notes</FormLabel>
            <FormControl>
              <Input v-bind="componentField" :disabled="processing" />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>

        <div class="flex justify-end">
          <Button type="submit" :disabled="processing">
            Save Transaction
          </Button>
        </div>
      </form>
    </template>
  </Modal>

  <!-- Confirm Transaction Form Modal -->
  <Modal v-if="showConfirmTransactionModal" @close="showConfirmTransactionModal = false" :contentWidth="'w-3/6'" class="bg-background">
    <template v-slot:header>
      <h3 class="text-xl font-semibold text-foreground">Confirm Transaction</h3>
    </template>

    <template v-slot:body>
      <form class="space-y-6 p-6" @submit.prevent="submitConfirmTransaction">
        <h4 class="text-lg font-medium text-foreground">{{ values.kind }} Transaction</h4>
        <FormField name="notes" v-slot="{ componentField }">
          <FormItem>
            <FormLabel>Notes</FormLabel>
            <FormControl>
              <Input v-bind="componentField" :disabled="processing" />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>

        <div class="flex justify-end">
          <Button type="submit" :disabled="processing">
            Confirm Transaction
          </Button>
        </div>
      </form>
    </template>
  </Modal>

  <!-- Voucher Code Form Modal -->
  <Modal v-if="showVoucherModal" @close="showVoucherModal = false" :contentWidth="'w-1/5'" class="bg-background">
    <template v-slot:header>
      <h3 class="text-xl font-semibold text-foreground">Apply Voucher Code</h3>
    </template>

    <template v-slot:body>
      <form class="space-y-6 p-6">
        <FormItem>
          <FormLabel>Voucher Code</FormLabel>
          <FormControl>
            <Input
              type="text"
              v-model="voucherCodeForm.code"
              :disabled="processing"
            />
          </FormControl>
        </FormItem>

        <div class="flex justify-end">
          <Button type="button" :disabled="processing" @click="submitVoucherCodeForm">
            Apply Voucher
          </Button>
        </div>
      </form>
    </template>
  </Modal>
</template>
