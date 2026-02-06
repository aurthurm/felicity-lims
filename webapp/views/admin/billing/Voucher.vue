<script setup lang="ts">
import { ref, defineAsyncComponent, onMounted } from "vue";
import { AddVoucherDocument, AddVoucherMutation, AddVoucherMutationVariables,
  EditVoucherDocument, EditVoucherMutation, EditVoucherMutationVariables } from '@/graphql/operations/billing.mutations';
import { storeToRefs } from "pinia"
import { useBillingStore } from "@/stores/billing";
import useApiUtil  from "@/composables/api_util";
import { VoucherType } from "@/types/gql";
import { useForm } from "vee-validate";
import { object, string, boolean, number, date } from "yup";
import { formatDate } from "@/utils";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import {FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import PageHeading from "@/components/common/PageHeading.vue"
defineOptions({ name: 'VoucherView' })
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

const { handleSubmit, setFieldValue, values } = useForm({
  validationSchema: voucherSchema,
  initialValues: {
    "oncePerCustomer": true,
    "oncePerOrder": true,
  } as any,
});

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
  setFieldValue("used", undefined)
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
    <PageHeading title="Vouchers">
      <Button @click="newVoucher">Add Voucher</Button>
    </PageHeading>

    <div class="rounded-lg border border-border bg-card p-6">
      <div class="grid grid-cols-12 gap-6">
        <section v-motion :initial="{ opacity: 0, y: 100 }" :enter="{ opacity: 1, y: 0, scale: 1 }"
          :variants="{ custom: { scale: 2 } }" :delay="400"
          class="col-span-3 overflow-y-auto overscroll-contain voucher-scroll">
          <div v-if="fetchingVouchers" class="rounded-lg border border-border bg-card p-4">
            <span class="inline-flex items-center gap-2">
              <Spinner class="size-4" />
              <span class="text-sm">Fetching vouchers ...</span>
            </span>
          </div>
          <div v-else class="space-y-2">
            <Button v-for="voucher in vouchers" :key="voucher.uid" @click="selectVoucher(voucher)" 
              class="w-full flex items-center p-4 rounded-lg border transition-colors hover:bg-accent hover:text-accent-foreground"
              :class="[
                voucher.uid === values.uid 
                  ? 'border-primary bg-primary/10' 
                  : 'border-border bg-card'
              ]"
              variant="ghost"
              type="button"
            >
              <div class="grow">
                <div class="flex justify-between items-center">
                  <span class="font-medium text-foreground">{{ voucher.name }}</span>
                  <span class="text-sm text-muted-foreground">{{ voucher.used }} of {{ voucher.usageLimit }}</span>
                </div>
              </div>
            </Button>
          </div>
        </section>

        <section v-if="vouchers?.length > 0 && values.uid" v-motion :initial="{ opacity: 0, y: -100 }"
          :enter="{ opacity: 1, y: 0, scale: 1 }" :variants="{ custom: { scale: 2 } }" :delay="400" 
          class="col-span-9 space-y-6">
          
          <div class="rounded-lg border border-border bg-card p-6" v-motion-slide-top>
            <div class="flex justify-between items-center mb-4">
              <h4 class="text-lg font-semibold text-foreground">{{ values.name?.toUpperCase() }}</h4>
              <Button variant="outline" size="icon" @click="showModal = true">
                <font-awesome-icon icon="pen" class="text-muted-foreground" />
              </Button>
            </div>
            
            <div class="grid grid-cols-3 gap-8">
              <div class="space-y-4">
                <div class="flex justify-between items-center">
                  <span class="text-sm font-medium text-muted-foreground">Start Date:</span> 
                  <span class="text-sm text-foreground">{{ values.startDate }}</span>
                </div>
                <div class="flex justify-between items-center">
                  <span class="text-sm font-medium text-muted-foreground">End Date:</span> 
                  <span class="text-sm text-foreground">{{ values.endDate }}</span>
                </div>
              </div>
              <div class="space-y-4">
                <div class="flex justify-between items-center">
                  <span class="text-sm font-medium text-muted-foreground">Usage Limit:</span> 
                  <span class="text-sm text-foreground">{{ values.usageLimit }}</span>
                </div>
                <div class="flex justify-between items-center">
                  <span class="text-sm font-medium text-muted-foreground">Used:</span> 
                  <span class="text-sm text-foreground">{{ values.used }}</span>
                </div>
              </div>
              <div class="space-y-4">
                <div class="flex justify-between items-center">
                  <span class="text-sm font-medium text-muted-foreground">Once per customer:</span> 
                  <span class="text-sm text-foreground">{{ values.oncePerCustomer ? "Yes" : "No" }}</span>
                </div>
                <div class="flex justify-between items-center">
                  <span class="text-sm font-medium text-muted-foreground">Once per order:</span> 
                  <span class="text-sm text-foreground">{{ values.oncePerOrder ? "Yes" : "No" }}</span>
                </div>
              </div>
            </div>
          </div>
          <VoucherCodes :voucherUid="values.uid" />
        </section>
      </div>
    </div>

    <!-- Voucher Form Modal -->
    <Modal v-if="showModal" @close="showModal = false" :contentWidth="'w-2/6'">
      <template v-slot:header>
        <h3 class="text-lg font-semibold text-foreground">Voucher Form</h3>
      </template>
      <template v-slot:body>
        <form class="space-y-6" @submit.prevent="submitVoucherForm">
          <div class="grid grid-cols-4 gap-4">
            <FormField name="name" v-slot="{ componentField }">
              <FormItem class="col-span-2">
                <FormLabel>Voucher Name</FormLabel>
                <FormControl>
                  <Input v-bind="componentField" placeholder="Name ..." />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
            <FormField name="startDate" v-slot="{ componentField }">
              <FormItem class="col-span-1">
                <FormLabel>Start Date</FormLabel>
                <FormControl>
                  <Input v-bind="componentField" type="date" />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
            <FormField name="endDate" v-slot="{ componentField }">
              <FormItem class="col-span-1">
                <FormLabel>End Date</FormLabel>
                <FormControl>
                  <Input v-bind="componentField" type="date" />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
          </div>
          <div class="grid grid-cols-4 gap-4">
            <FormField name="usageLimit" v-slot="{ componentField }">
              <FormItem class="col-span-2">
                <FormLabel>Usage Limit</FormLabel>
                <FormControl>
                  <Input v-bind="componentField" type="number" min="1" />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <FormField name="oncePerCustomer" type="checkbox" :checked-value="true" :unchecked-value="false" v-slot="{ componentField }">
              <FormItem class="flex items-center space-x-2">
                <FormControl>
                  <Checkbox v-bind="componentField" />
                </FormControl>
                <FormLabel>Once Per Customer</FormLabel>
                <FormMessage />
              </FormItem>
            </FormField>
            <FormField name="oncePerOrder" type="checkbox" :checked-value="true" :unchecked-value="false" v-slot="{ componentField }">
              <FormItem class="flex items-center space-x-2">
                <FormControl>
                  <Checkbox v-bind="componentField" />
                </FormControl>
                <FormLabel>Once Per Order</FormLabel>
                <FormMessage />
              </FormItem>
            </FormField>
          </div>

          <div class="flex justify-end">
            <Button type="submit">Save Voucher</Button>
          </div>
        </form>
      </template>
    </Modal>
  </div>
</template>
