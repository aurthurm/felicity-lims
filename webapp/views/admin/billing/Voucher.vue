<script setup lang="ts">
import { ref, defineAsyncComponent, onMounted } from "vue";
import { AddVoucherDocument, AddVoucherMutation, AddVoucherMutationVariables,
  EditVoucherDocument, EditVoucherMutation, EditVoucherMutationVariables } from '@/graphql/operations/billing.mutations';
import { storeToRefs } from "pinia"
import { useBillingStore } from "@/stores/billing";
import useApiUtil  from "@/composables/api_util";
import { IVoucher } from "@/models/billing";
import { useField, useForm } from "vee-validate";
import { object, string, boolean, number, date } from "yup";
import { formatDate } from "@/utils/helpers";

const LoadingMessage = defineAsyncComponent(
  () => import("@/components/ui/spinners/FelLoadingMessage.vue")
)
const modal = defineAsyncComponent(
  () => import("@/components/ui/FelModal.vue")
)
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
  if (!values.uid) addVoucher(values as IVoucher);
  if (values.uid) updateVoucher(values as IVoucher);
});

let selectVoucher = (voucher: IVoucher) => {
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

const addVoucher = (vocher: IVoucher) => {
  delete vocher['uid'];
  withClientMutation<AddVoucherMutation, AddVoucherMutationVariables>(AddVoucherDocument, { payload: vocher },"createVoucher")
  .then((result) => billingStore.addVoucher(result))
  .finally(() => (showModal.value = false));
};

const updateVoucher = (vocher: IVoucher) => {
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
  <div class="mt-4">
    <div class="flex justify-between">
      <button
        class="px-4 my-2 p-1 text-sm border-primary border text-dark-700 transition-colors duration-150 rounded-sm focus:outline-none hover:bg-primary hover:text-primary-foreground"
        @click="newVoucher">
        Add Voucher
      </button>
    </div>

    <hr />

    <div class="grid grid-cols-12 gap-4 mt-2">
      <section v-motion :initial="{ opacity: 0, y: 100 }" :enter="{ opacity: 1, y: 0, scale: 1 }"
        :variants="{ custom: { scale: 2 } }" :delay="400"
        class="col-span-3 overflow-y-scroll overscroll-contain voucher-scroll">
        <div v-if="fetchingVouchers" class="py-4 text-center bg-background w-full mb-1 rounded-sm shadow border">
          <LoadingMessage message="Fetching vouchers ..." />
        </div>
        <div v-else>
          <a v-for="voucher in vouchers" :key="voucher.uid" @click="selectVoucher(voucher)" :class="[
            'bg-background w-full flex items-center p-1 mb-1 rounded-sm shadow border',
            { 'border-primary bg-emerald-200': voucher.uid === uid },
          ]">
            <div class="flex-grow p-1">
              <div class="font-semibold text-foreground flex justify-between">
                <span>{{ voucher.name }}</span>
                <span class="text-sm text-muted-foreground">{{ voucher.used }} of {{ voucher.usageLimit }}</span>
              </div>
            </div>
          </a>
        </div>
      </section>

      <section v-if="vouchers?.length > 0 && uid" v-motion :initial="{ opacity: 0, y: -100 }"
        :enter="{ opacity: 1, y: 0, scale: 1 }" :variants="{ custom: { scale: 2 } }" :delay="400" class="col-span-9">
        
        <div class="bg-background rounded-sm shadow-sm hover:shadow-xs duration-500 px-4 sm:px-6 md:px-2 py-4" v-motion-slide-top>
          <div class="flex justify-between items-center">
            <h4 class="text-foreground text-l font-bold">{{ name?.toUpperCase() }}</h4>
            <a @click="showModal = true" class="px-2 cursor text-muted-foreground hover:text-foreground">
                <font-awesome-icon icon="pen" />
            </a>
          </div>
          <hr>
          <section class="grid grid-cols-3 gap-x-8">
            <div class="col-span-1">
              <div class="flex justify-between items-center mt-2">
                <span class="text-foreground text-sm font-semibold">Start Date:</span> 
                <span class="text-foreground text-sm md:text-md">{{ startDate }}</span>
              </div>
              <div class="flex justify-between items-center mt-2">
                <span class="text-foreground text-sm font-semibold">End Date:</span> 
                <span class="text-foreground text-sm md:text-md">{{ endDate }}</span>
              </div>
            </div>
            <div class="col-span-1">
              <div class="flex justify-between items-center mt-2">
                <span class="text-foreground text-sm font-semibold">Usage Limit:</span> 
                <span class="text-foreground text-sm md:text-md">{{ usageLimit }}</span>
              </div>
              <div class="flex justify-between items-center mt-2">
                <span class="text-foreground text-sm font-semibold">Used:</span> 
                <span class="text-foreground text-sm md:text-md">{{ used }}</span>
              </div>
            </div>
            <div class="col-span-1">
              <div class="flex justify-between items-center mt-2">
                <span class="text-foreground text-sm font-semibold">Once per customer:</span> 
                <span class="text-foreground text-sm md:text-md">{{ oncePerCustomer ? "Yes" : "No" }}</span>
              </div>
              <div class="flex justify-between items-center mt-2">
                <span class="text-foreground text-sm font-semibold">Once per order:</span> 
                <span class="text-foreground text-sm md:text-md">{{ oncePerOrder ? "Yes" : "No" }}</span>
              </div>
            </div>
          </section>
        </div>
        <VoucherCodes :voucherUid="uid" />
      </section>
    </div>

    <!-- Voucher Form Modal -->
    <modal v-if="showModal" @close="showModal = false" :contentWidth="'w-2/6'">
      <template v-slot:header>
        <h3>Voucher Form</h3>
      </template>
      <template v-slot:body>
        <form>
          <div class="grid grid-cols-4 gap-x-4 mb-4">
            <label class="block col-span-2 mb-2">
              <span class="text-foreground">Voucher Name</span>
              <input
                :class="['form-input mt-1 block w-full', {'border-destructive animate-pulse': errors.name }]"
                type="text"
                v-model="name"
                placeholder="Name ..."
              />
            </label>
            <label class="block col-span-1 mb-2">
              <span class="text-foreground">Start Date</span>
              <input
                :class="['form-input mt-1 block w-full', {'border-destructive animate-pulse': errors.startDate }]"
                type="date"
                v-model="startDate"
              />
            </label>
            <label class="block col-span-1 mb-2">
              <span class="text-foreground">End Date</span>
              <input
                :class="['form-input mt-1 block w-full', {'border-destructive animate-pulse': errors.endDate }]"
                type="date"
                v-model="endDate"
              />
            </label>
          </div>
          <div class="grid grid-cols-4 gap-x-4 mb-4">
            <label class="block col-span-2 mb-2">
              <span class="text-foreground">Usage Limit</span>
              <input
                :class="['form-input mt-1 block w-full', {'border-destructive animate-pulse': errors.usageLimit }]"
                type="number"
                min="1"
                v-model="usageLimit"
              />
            </label>
          </div>
          <div class="grid grid-cols-2 gap-x-4 mb-4">
            <label class="block col-span-1 mb-2">
              <span class="text-foreground">Once Per Customer</span>
              <input
                class="form-checkbox ml-4"
                type="checkbox"
                v-model="oncePerCustomer"
                checked
              />
            </label>
            <label class="block col-span-1 mb-2">
              <span class="text-foreground">Once Per Order</span>
              <input
                class="form-checkbox ml-4"
                type="checkbox"
                v-model="oncePerOrder"
                checked
              />
            </label>
          </div>

          <hr />
          <button type="submit"
            class="-mb-4 border border-primary bg-primary text-primary-foreground rounded-sm px-2 py-1 mt-2 transition-colors duration-500 ease select-none hover:bg-primary focus:outline-none focus:shadow-outline"
            @click.prevent="submitVoucherForm">
            Save Voucher
          </button>
        </form>
      </template>
    </modal>
  </div>
</template>
