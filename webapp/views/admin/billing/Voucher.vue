<script setup lang="ts">
import { ref, defineAsyncComponent, onMounted } from "vue";
import { AddVoucherDocument, AddVoucherMutation, AddVoucherMutationVariables,
  EditVoucherDocument, EditVoucherMutation, EditVoucherMutationVariables } from '@/graphql/operations/billing.mutations';
import { storeToRefs } from "pinia"
import { useBillingStore } from "@/stores/billing";
import useApiUtil  from "@/composables/api_util";
import { VoucherType } from "@/types/gql";
import { useField, useForm } from "vee-validate";
import { object, string, boolean, number, date } from "yup";
import { formatDate } from "@/utils";

const VoucherCodes = defineAsyncComponent(
  () => import("./VoucherCodes.vue")
)

const { withClientMutation } = useApiUtil();
let billingStore = useBillingStore();
const { vouchers, fetchingVouchers } = storeToRefs(billingStore);

onMounted(() => {
  billingStore.fetchVouchers()
})

let showModal = ref<boolean>(false);

const voucherSchema = object({
  uid: string().nullable(),
  name: string().required("Voucher Name is Required"),
  startDate: date().required("Start Date is Required"),
  endDate: date().required("End Date is Required"),
  usageLimit: number().required("Usage Limit is Required"),
  used: string().nullable(),
  oncePerCustomer: boolean().default(true),
  oncePerOrder: boolean().default(true),
});

const { handleSubmit, errors, setFieldValue } = useForm({
  validationSchema: voucherSchema,
  initialValues: {
    "oncePerCustomer": true,
    "oncePerOrder": true,
  } as any,
});

const { value: uid } = useField<string>("uid");
const { value: name } = useField<string>("name");
const { value: startDate } = useField("startDate");
const { value: endDate } = useField("endDate");
const { value: usageLimit } = useField("usageLimit");
const { value: used } = useField("used");
const { value: oncePerCustomer } = useField("oncePerCustomer");
const { value: oncePerOrder } = useField("oncePerOrder");

const submitVoucherForm = handleSubmit((values) => {
  if (!values.uid) addVoucher(values as VoucherType);
  if (values.uid) updateVoucher(values as VoucherType);
});

let selectVoucher = (voucher: VoucherType) => {
  setFieldValue("uid", voucher.uid)
  setFieldValue("name", voucher.name)
  setFieldValue("startDate", formatDate(voucher.startDate, 'DD/MM/YYYY'))
  setFieldValue("endDate", formatDate(voucher.endDate,'DD/MM/YYYY'))
  setFieldValue("usageLimit", voucher.usageLimit)
  setFieldValue("used", voucher.used)
  setFieldValue("oncePerCustomer", voucher.oncePerCustomer)
  setFieldValue("oncePerOrder", voucher.oncePerOrder)
};

let setVoucherToNull = () => {
  setFieldValue("uid", undefined)
  setFieldValue("name", undefined)
  setFieldValue("startDate", undefined)
  setFieldValue("endDate", undefined)
  setFieldValue("usageLimit", undefined)
  setFieldValue("oncePerCustomer", true)
  setFieldValue("oncePerOrder", true)
};

const newVoucher = () => {
  setVoucherToNull()
  showModal.value = true
}

const addVoucher = (vocher: VoucherType) => {
  delete vocher['uid'];
  withClientMutation<AddVoucherMutation, AddVoucherMutationVariables>(AddVoucherDocument, { payload: vocher },"createVoucher")
  .then((result) => billingStore.addVoucher(result))
  .finally(() => (showModal.value = false));
};

const updateVoucher = (vocher: VoucherType) => {
  delete vocher['uid'];
  delete vocher['used'];
  withClientMutation<EditVoucherMutation, EditVoucherMutationVariables>(EditVoucherDocument, 
  { 
    uid: uid?.value, 
    payload: vocher 
  },"updateVoucher")
  .then((result) => billingStore.updateVoucher(result))
  .finally(() => (showModal.value = false));
};
</script>

<style lang="css" scoped>
.voucher-scroll {
  min-height: 500px;
}
</style>

<template>
  <div class="space-y-6">
    <fel-heading title="Vouchers">
      <fel-button @click="newVoucher">Add Voucher</fel-button>
    </fel-heading>

    <div class="rounded-lg border border-border bg-card p-6">
      <div class="grid grid-cols-12 gap-6">
        <section v-motion :initial="{ opacity: 0, y: 100 }" :enter="{ opacity: 1, y: 0, scale: 1 }"
          :variants="{ custom: { scale: 2 } }" :delay="400"
          class="col-span-3 overflow-y-auto overscroll-contain voucher-scroll">
          <div v-if="fetchingVouchers" class="rounded-lg border border-border bg-card p-4">
            <fel-loader message="Fetching vouchers ..." />
          </div>
          <div v-else class="space-y-2">
            <button v-for="voucher in vouchers" :key="voucher.uid" @click="selectVoucher(voucher)" 
              class="w-full flex items-center p-4 rounded-lg border transition-colors hover:bg-accent hover:text-accent-foreground"
              :class="[
                voucher.uid === uid 
                  ? 'border-primary bg-primary/10' 
                  : 'border-border bg-card'
              ]">
              <div class="flex-grow">
                <div class="flex justify-between items-center">
                  <span class="font-medium text-foreground">{{ voucher.name }}</span>
                  <span class="text-sm text-muted-foreground">{{ voucher.used }} of {{ voucher.usageLimit }}</span>
                </div>
              </div>
            </button>
          </div>
        </section>

        <section v-if="vouchers?.length > 0 && uid" v-motion :initial="{ opacity: 0, y: -100 }"
          :enter="{ opacity: 1, y: 0, scale: 1 }" :variants="{ custom: { scale: 2 } }" :delay="400" 
          class="col-span-9 space-y-6">
          
          <div class="rounded-lg border border-border bg-card p-6" v-motion-slide-top>
            <div class="flex justify-between items-center mb-4">
              <h4 class="text-lg font-semibold text-foreground">{{ name?.toUpperCase() }}</h4>
              <button @click="showModal = true" 
                class="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-9 w-9">
                <font-awesome-icon icon="pen" class="text-muted-foreground" />
              </button>
            </div>
            
            <div class="grid grid-cols-3 gap-8">
              <div class="space-y-4">
                <div class="flex justify-between items-center">
                  <span class="text-sm font-medium text-muted-foreground">Start Date:</span> 
                  <span class="text-sm text-foreground">{{ startDate }}</span>
                </div>
                <div class="flex justify-between items-center">
                  <span class="text-sm font-medium text-muted-foreground">End Date:</span> 
                  <span class="text-sm text-foreground">{{ endDate }}</span>
                </div>
              </div>
              <div class="space-y-4">
                <div class="flex justify-between items-center">
                  <span class="text-sm font-medium text-muted-foreground">Usage Limit:</span> 
                  <span class="text-sm text-foreground">{{ usageLimit }}</span>
                </div>
                <div class="flex justify-between items-center">
                  <span class="text-sm font-medium text-muted-foreground">Used:</span> 
                  <span class="text-sm text-foreground">{{ used }}</span>
                </div>
              </div>
              <div class="space-y-4">
                <div class="flex justify-between items-center">
                  <span class="text-sm font-medium text-muted-foreground">Once per customer:</span> 
                  <span class="text-sm text-foreground">{{ oncePerCustomer ? "Yes" : "No" }}</span>
                </div>
                <div class="flex justify-between items-center">
                  <span class="text-sm font-medium text-muted-foreground">Once per order:</span> 
                  <span class="text-sm text-foreground">{{ oncePerOrder ? "Yes" : "No" }}</span>
                </div>
              </div>
            </div>
          </div>
          <VoucherCodes :voucherUid="uid" />
        </section>
      </div>
    </div>

    <!-- Voucher Form Modal -->
    <fel-modal v-if="showModal" @close="showModal = false" :contentWidth="'w-2/6'">
      <template v-slot:header>
        <h3 class="text-lg font-semibold text-foreground">Voucher Form</h3>
      </template>
      <template v-slot:body>
        <form class="space-y-6">
          <div class="grid grid-cols-4 gap-4">
            <label class="block col-span-2 space-y-2">
              <span class="text-sm font-medium text-foreground">Voucher Name</span>
              <input
                :class="['form-input w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50', {'border-destructive animate-pulse': errors.name }]"
                type="text"
                v-model="name"
                placeholder="Name ..."
              />
            </label>
            <label class="block col-span-1 space-y-2">
              <span class="text-sm font-medium text-foreground">Start Date</span>
              <input
                :class="['form-input w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50', {'border-destructive animate-pulse': errors.startDate }]"
                type="date"
                v-model="startDate"
              />
            </label>
            <label class="block col-span-1 space-y-2">
              <span class="text-sm font-medium text-foreground">End Date</span>
              <input
                :class="['form-input w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50', {'border-destructive animate-pulse': errors.endDate }]"
                type="date"
                v-model="endDate"
              />
            </label>
          </div>
          <div class="grid grid-cols-4 gap-4">
            <label class="block col-span-2 space-y-2">
              <span class="text-sm font-medium text-foreground">Usage Limit</span>
              <input
                :class="['form-input w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50', {'border-destructive animate-pulse': errors.usageLimit }]"
                type="number"
                min="1"
                v-model="usageLimit"
              />
            </label>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <label class="flex items-center space-x-2">
              <input
                class="form-checkbox h-4 w-4 rounded border-input text-primary focus:ring-primary"
                type="checkbox"
                v-model="oncePerCustomer"
                checked
              />
              <span class="text-sm font-medium text-foreground">Once Per Customer</span>
            </label>
            <label class="flex items-center space-x-2">
              <input
                class="form-checkbox h-4 w-4 rounded border-input text-primary focus:ring-primary"
                type="checkbox"
                v-model="oncePerOrder"
                checked
              />
              <span class="text-sm font-medium text-foreground">Once Per Order</span>
            </label>
          </div>

          <div class="flex justify-end">
            <button 
              type="submit"
              class="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-9 px-4 py-2"
              @click.prevent="submitVoucherForm">
              Save Voucher
            </button>
          </div>
        </form>
      </template>
    </fel-modal>
  </div>
</template>
