<script setup lang="ts">
import { ref, watch, onMounted, computed } from "vue";
import { AddVoucherCodeDocument, AddVoucherCodeMutation, AddVoucherCodeMutationVariables,
  EditVoucherCodeDocument, EditVoucherCodeMutation, EditVoucherCodeMutationVariables } from '@/graphql/operations/billing.mutations'; 
import { storeToRefs } from "pinia"
import { useBillingStore } from "@/stores/billing";
import useApiUtil  from "@/composables/api_util";
import { VoucherCodeType } from "@/types/gql";
import { useField, useForm } from "vee-validate";
import { object, string, boolean, number } from "yup";

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

const { handleSubmit, errors, setFieldValue } = useForm({
  validationSchema: codeSchema,
  initialValues: {
    "isActive": true,
    "voucherUid": props.voucherUid
  } as any,
});

const { value: uid } = useField("uid");
const { value: voucherUid } = useField("voucherUid");
const { value: code } = useField<string>("code");
const { value: usageLimit } = useField("usageLimit");
const { value: used } = useField("used");
const { value: isActive } = useField("isActive");

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
  withClientMutation<EditVoucherCodeMutation, EditVoucherCodeMutationVariables>(EditVoucherCodeDocument, { uid: uid?.value, payload: vocher },"updateVoucherCode")
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
      <fel-loader message="Fetching voucher codes ..." />
    </div>
    <section v-else class="space-y-6">
      <div class="flex justify-between items-center">
        <h4 class="text-lg font-semibold text-foreground">Voucher Codes</h4>
        <button
          class="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-9 px-4 py-2"
          @click="newVoucherCode">
          Add Voucher Code
        </button>
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
            <button 
              class="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-9 w-9"
              @click="editCode(vcode)">
              <font-awesome-icon icon="pen" class="text-muted-foreground" />
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- Voucher Code Form Modal -->
    <fel-modal v-if="showModal" @close="showModal = false" :contentWidth="'w-2/6'">
      <template v-slot:header>
        <h3 class="text-lg font-semibold text-foreground">Voucher Code Form</h3>
      </template>
      <template v-slot:body>
        <form class="space-y-6">
          <div class="grid grid-cols-2 gap-4">
            <label class="space-y-2">
              <span class="text-sm font-medium text-foreground">Voucher Code</span>
              <input
                :class="['form-input w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50', {'border-destructive animate-pulse': errors.code }]"
                type="text"
                v-model="code"
                placeholder="Code ..."
              />
            </label>
            <label class="space-y-2">
              <span class="text-sm font-medium text-foreground">Usage Limit</span>
              <input
                :class="['form-input w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50', {'border-destructive animate-pulse': errors.usageLimit }]"
                type="number"
                min="1"
                v-model="usageLimit"
              />
            </label>
          </div>
          
          <div class="flex items-center space-x-2">
            <input
              class="form-checkbox h-4 w-4 rounded border-input text-primary focus:ring-primary"
              type="checkbox"
              v-model="isActive"
              checked
            />
            <label class="text-sm font-medium text-foreground">Is Active</label>
          </div>

          <div class="flex justify-end">
            <button 
              type="submit"
              class="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-9 px-4 py-2"
              @click.prevent="submitVoucherForm">
              Save Voucher Code
            </button>
          </div>
        </form>
      </template>
    </fel-modal>
  </div>
</template>
