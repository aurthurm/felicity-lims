<script setup lang="ts">
import { ref, watch, defineAsyncComponent, onMounted, computed } from "vue";
import { AddVoucherCodeDocument, AddVoucherCodeMutation, AddVoucherCodeMutationVariables,
  EditVoucherCodeDocument, EditVoucherCodeMutation, EditVoucherCodeMutationVariables } from '@/graphql/operations/billing.mutations'; 
import { storeToRefs } from "pinia"
import { useBillingStore } from "@/stores/billing";
import useApiUtil  from "@/composables/api_util";
import { IVoucherCode } from "@/models/billing";
import { useField, useForm } from "vee-validate";
import { object, string, boolean, number } from "yup";

const LoadingMessage = defineAsyncComponent(
  () => import("@/components/ui/spinners/FelLoadingMessage.vue")
)

const modal = defineAsyncComponent(
  () => import("@/components/ui/FelModal.vue")
)

const props = defineProps({
  voucherUid: String
})

const { withClientMutation } = useApiUtil();
let billingStore = useBillingStore();
const { fetchingVoucherCodes } = storeToRefs(billingStore);

const codes = computed<IVoucherCode[]>(() => {
  const vouchers = billingStore.getVouchers;
  const index = vouchers?.findIndex(item => item.uid === props.voucherUid);
  if(index > -1) {
    return vouchers[index]?.codes
  };
  return [] as IVoucherCode[];
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
  if (!values.uid) addVoucherCode(values as IVoucherCode);
  if (values.uid) updateVoucherCode(values as IVoucherCode);
});

let editCode = (vcode: IVoucherCode) => {
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

const addVoucherCode = (vcode: IVoucherCode) => {
  delete vcode['uid'];
  withClientMutation<AddVoucherCodeMutation, AddVoucherCodeMutationVariables>(AddVoucherCodeDocument, { payload: vcode },"createVoucherCode")
  .then((result) => billingStore.addVoucherCode(result))
  .finally(() => (showModal.value = false));
};

const updateVoucherCode = (vocher: IVoucherCode) => {
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
  <div class="mt-4">
    <div v-if="fetchingVoucherCodes">
      <LoadingMessage message="Fetching voucher codes ..." />
    </div>
    <section v-else>
          <div class="flex justify-between">
            <h4 class="text-foreground text-l font-semibold">Voucher Codes</h4>
            <button
              class="px-4 my-2 p-1 text-sm border-primary border text-dark-700 transition-colors duration-150 rounded-sm focus:outline-none hover:bg-primary hover:text-primary-foreground"
              @click="newVoucherCode">
              Add Voucher Code
            </button>
          </div>
          <hr>
          <div class="grid grid-cols-5 gap-2 mt-2">
            <div 
            v-for="vcode in codes" :key="vcode.uid"
            class="col-span-1 bg-background rounded-sm shadow-sm hover:shadow-md duration-500 px-2 py-2">
              <div class="font-semibold text-foreground flex justify-between items-center">
                <h5>{{ vcode.code }}</h5>
                <div class="text-sm text-muted-foreground flex-grow text-right">{{ vcode.used }} of {{ vcode.usageLimit }}</div>
                <a class="ml-2 pl-2 text-muted-foreground border-l-2 border-l-gray-400" @click="editCode(vcode)">
                  <font-awesome-icon class="text-xs hover:text-foreground" icon="pen" />
                </a>
              </div>
            </div>
          </div>
      </section>
    </div>

    <modal v-if="showModal" @close="showModal = false" :contentWidth="'w-3/6'">
      <template v-slot:header>
        <h3>Voucher Code Form</h3>
      </template>
      <template v-slot:body>
        <form>
          <div class="grid grid-cols-2 gap-x-4 mb-4">
            <label class="block col-span-1 mb-2">
              <span class="text-foreground">Voucher Code</span>
              <input
                :class="['form-input mt-1 block w-full', {'border-destructive animate-pulse': errors.code }]"
                type="text"
                v-model="code"
                placeholder="Code ..."
              />
            </label>
            <label class="block col-span-1 mb-2">
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
              <span class="text-foreground">Is Active</span>
              <input
                class="form-checkbox ml-4"
                type="checkbox"
                v-model="isActive"
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
</template>
