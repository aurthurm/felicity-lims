<script setup lang="ts">
import { ref, watch, onMounted, computed } from "vue";
import { AddVoucherCodeDocument, AddVoucherCodeMutation, AddVoucherCodeMutationVariables,
  EditVoucherCodeDocument, EditVoucherCodeMutation, EditVoucherCodeMutationVariables } from '@/graphql/operations/billing.mutations'; 
import { storeToRefs } from "pinia"
import { useBillingStore } from "@/stores/billing";
import useApiUtil  from "@/composables/api_util";
import { VoucherCodeType } from "@/types/gql";
import { useForm } from "vee-validate";
import { object, string, boolean, number } from "yup";
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

const props = defineProps({
  voucherUid: String
})

const { withClientMutation } = useApiUtil();
let billingStore = useBillingStore();
const { fetchingVoucherCodes } = storeToRefs(billingStore);

const codes = computed<VoucherCodeType[]>(() => {
  const vouchers = billingStore.getVouchers;
  const index = vouchers?.findIndex(item => item.uid === props.voucherUid);
  if(index > -1) {
    return vouchers[index]?.codes
  };
  return [] as VoucherCodeType[];
})

onMounted(() => billingStore.fetchVoucherCodes(props.voucherUid!))
watch(() => props.voucherUid, _ =>{
  billingStore.fetchVoucherCodes(props.voucherUid!)
})

let showModal = ref<boolean>(false);
const codeSchema = object({
  uid: string().nullable(),
  voucherUid: string().required(),
  code: string().required("Code is Required"),
  usageLimit: number().required("Usage Limit is Required"),
  used: string().nullable(),
  isActive: boolean().default(true),
});

const { handleSubmit, setFieldValue, values } = useForm({
  validationSchema: codeSchema,
  initialValues: {
    "isActive": true,
    "voucherUid": props.voucherUid
  } as any,
});

const submitVoucherForm = handleSubmit((values) => {
  if (!values.uid) addVoucherCode(values as VoucherCodeType);
  if (values.uid) updateVoucherCode(values as VoucherCodeType);
});

let editCode = (vcode: VoucherCodeType) => {
  setFieldValue("uid", vcode.uid)
  setFieldValue("code", vcode.code)
  setFieldValue("usageLimit", vcode.usageLimit)
  setFieldValue("used", vcode.used)
  setFieldValue("isActive", vcode.isActive)
  showModal.value = true
};

const  newVoucherCode = () => {
  setFieldValue("uid", undefined)
  setFieldValue("voucherUid", props.voucherUid)
  setFieldValue("code", undefined)
  setFieldValue("usageLimit", undefined)
  setFieldValue("used", undefined)
  setFieldValue("isActive", true)
  showModal.value = true
}

const addVoucherCode = (vcode: VoucherCodeType) => {
  delete vcode['uid'];
  withClientMutation<AddVoucherCodeMutation, AddVoucherCodeMutationVariables>(AddVoucherCodeDocument, { payload: vcode },"createVoucherCode")
  .then((result) => billingStore.addVoucherCode(result))
  .finally(() => (showModal.value = false));
};

const updateVoucherCode = (vocher: VoucherCodeType) => {
  delete vocher['uid'];
  delete vocher['used'];
  withClientMutation<EditVoucherCodeMutation, EditVoucherCodeMutationVariables>(EditVoucherCodeDocument, { uid: values.uid, payload: vocher },"updateVoucherCode")
  .then((result) => billingStore.updateVoucherCode(result))
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
    <div v-if="fetchingVoucherCodes" class="rounded-lg border border-border bg-card p-4">
      <span class="inline-flex items-center gap-2">
        <Spinner class="size-4" />
        <span class="text-sm">Fetching voucher codes ...</span>
      </span>
    </div>
    <section v-else class="space-y-6">
      <div class="flex justify-between items-center">
        <h4 class="text-lg font-semibold text-foreground">Voucher Codes</h4>
        <Button @click="newVoucherCode">
          Add Voucher Code
        </Button>
      </div>
      
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        <div 
          v-for="vcode in codes" 
          :key="vcode.uid"
          class="rounded-lg border border-border bg-card p-4 transition-colors hover:bg-accent hover:text-accent-foreground">
          <div class="flex items-center justify-between">
            <div class="space-y-1">
              <h5 class="font-medium text-foreground">{{ vcode.code }}</h5>
              <p class="text-sm text-muted-foreground">{{ vcode.used }} of {{ vcode.usageLimit }}</p>
            </div>
            <Button variant="outline" size="icon" @click="editCode(vcode)">
              <font-awesome-icon icon="pen" class="text-muted-foreground" />
            </Button>
          </div>
        </div>
      </div>
    </section>

    <!-- Voucher Code Form Modal -->
    <Modal v-if="showModal" @close="showModal = false" :contentWidth="'w-2/6'">
      <template v-slot:header>
        <h3 class="text-lg font-semibold text-foreground">Voucher Code Form</h3>
      </template>
      <template v-slot:body>
        <form class="space-y-6" @submit.prevent="submitVoucherForm">
          <div class="grid grid-cols-2 gap-4">
            <FormField name="code" v-slot="{ componentField }">
              <FormItem>
                <FormLabel>Voucher Code</FormLabel>
                <FormControl>
                  <Input v-bind="componentField" placeholder="Code ..." />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
            <FormField name="usageLimit" v-slot="{ componentField }">
              <FormItem>
                <FormLabel>Usage Limit</FormLabel>
                <FormControl>
                  <Input v-bind="componentField" type="number" min="1" />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
          </div>
          
          <FormField name="isActive" type="checkbox" :checked-value="true" :unchecked-value="false" v-slot="{ componentField }">
            <FormItem class="flex items-center space-x-2">
              <FormControl>
                <Checkbox v-bind="componentField" />
              </FormControl>
              <FormLabel>Is Active</FormLabel>
              <FormMessage />
            </FormItem>
          </FormField>

          <div class="flex justify-end">
            <Button type="submit">Save Voucher Code</Button>
          </div>
        </form>
      </template>
    </Modal>
  </div>
</template>
