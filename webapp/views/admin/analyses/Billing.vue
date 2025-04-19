<script setup lang="ts">
  import { toRefs, watch, reactive, ref } from 'vue';
  import { 
    EditProfilePricingDocument, EditProfilePricingMutation, EditProfilePricingMutationVariables,
    EditAnalysisPricingDocument, EditAnalysisPricingMutation, EditAnalysisPricingMutationVariables,
    EditAnalysisDiscountDocument, EditAnalysisDiscountMutation, EditAnalysisDiscountMutationVariables,
    EditProfileDiscountDocument, EditProfileDiscountMutation, EditProfileDiscountMutationVariables
  } from '@/graphql/operations/billing.mutations'
  import { useBillingStore } from '@/stores/billing';
  import  useApiUtil  from '@/composables/api_util';
  import { IAnalysisDiscount, IProfileDiscount } from '@/models/billing';

  const  billingStore = useBillingStore()
  const { withClientMutation } = useApiUtil()
    
  const props = defineProps({
      target: {
          type: String,
          required: true,
      },
      targetUid: {
          type: String,
          required: true
      },
  })
  const { target, targetUid } = toRefs(props);

  const getProfileAndPrices = () => {
    billingStore.clear()
    if (target?.value === "profile") {
        billingStore.fetchProfilePrice(targetUid.value);
        billingStore.fetchProfileDiscount(targetUid.value);
      }
      if (target?.value === "analysis"){
        billingStore.fetchAnalysisPrice(targetUid.value);
        billingStore.fetchAnalysisDiscount(targetUid.value);
      }
    billingStore.fetchVouchers()
  }
  getProfileAndPrices()

  watch(() => target.value, (uid, prev) => getProfileAndPrices());
  watch(() => targetUid.value, (uid, prev) => getProfileAndPrices());

  const formPricing = reactive({ amount: 0.0 });
  watch(() => billingStore.fetchingPrice, (fetching, old) => {
    if(!fetching) {
      if(target?.value === "profile"){
        formPricing.amount = billingStore.profilePrice?.amount ?? 0.0;
      }
      if(target?.value === "analysis"){
        formPricing.amount = billingStore.analysisPrice?.amount ?? 0.0;
      }
    }
  });

  const updatePricing = () => {
    const payload = { ...formPricing  };
    let pricing = target.value == 'profile' ? billingStore.profilePrice : billingStore.analysisPrice;
    if(target?.value === "profile"){
        withClientMutation<EditProfilePricingMutation, EditProfilePricingMutationVariables>(
          EditProfilePricingDocument,
          { uid: pricing!.uid, payload },
          "updateProfilePrice"
        ).then();
    } else {
        withClientMutation<EditAnalysisPricingMutation, EditAnalysisPricingMutationVariables>(
          EditAnalysisPricingDocument,
          { uid: pricing!.uid, payload },
          "updateAnalysisPrice"
        ).then();
    }
  };

  const formDiscount = reactive({ 
    discountType: "",
    valueType: "",
    startDate: "",
    endDate: "",
    voucherUid: "" as string | undefined,
    valuePercent: 0.0,
    valueAmount: 0.0,
    isActive: true,
  });
  watch(() => billingStore.fetchingDiscount, (fetching, old) => {
    if(!fetching) {
      let discount = {} as IAnalysisDiscount | IProfileDiscount
      if(target?.value === "profile"){
        discount = { ...billingStore.profileDiscount } as IProfileDiscount
      }
      if(target?.value === "analysis"){
        discount = { ...billingStore.analyisDiscount } as IAnalysisDiscount
      }
      formDiscount.discountType = discount.discountType
      formDiscount.valueType = discount.valueType
      formDiscount.startDate = discount.startDate
      formDiscount.endDate = discount.endDate
      formDiscount.voucherUid = discount.voucherUid
      formDiscount.valuePercent = discount.valuePercent
      formDiscount.valueAmount = discount.valueAmount
      formDiscount.isActive = discount.isActive
    }
  });

  const discountTypes = ref(["sale", "voucher"])
  const valueTypes = ref(["percentage", "amount"])

  const updateDiscounting = () => {
    const payload = { ...formDiscount  };
    let discount = target.value == 'profile' ? billingStore.profileDiscount : billingStore.analyisDiscount;
    if(target.value == 'profile'){
      withClientMutation<EditProfileDiscountMutation, EditProfileDiscountMutationVariables>(
        EditProfileDiscountDocument,
        { uid: discount!.uid, payload },
        "updateProfileDiscount"
      ).then();
    } else {
      withClientMutation<EditAnalysisDiscountMutation, EditAnalysisDiscountMutationVariables>(
        EditAnalysisDiscountDocument,
        { uid: discount!.uid, payload },
        "updateAnalysisDiscount"
      ).then();
    }
  };

  watch(() => formDiscount.discountType, (dt, _) => {
    if(dt !== 'voucher') {
      formDiscount.voucherUid = undefined;
    }
  })

</script>

<template>
    <div class="grid grid-cols-12">
      <section class="col-span-6 gap-x-4 pr-4 mb-2">
        <h3 class="font-semibold text-l text-foreground">Pricing Information</h3>
        <hr>
        <form class="mt-4">
          <div class="">
            <label class="flex justify-start items-center gap-x-4 mb-4">
              <span class="col-span-1 text-foreground">Amount: $</span>
              <input class="form-input mt-1" v-model="formPricing.amount" type="number" min="0.0" step="0.1" />
            </label>
          </div>
          <button type="button" @click.prevent="updatePricing()"
            class="border border-primary bg-primary text-primary-foreground rounded-sm mt-4 px-2 py-1 transition-colors duration-500 ease select-none hover:bg-primary focus:outline-none focus:shadow-outline">
            Update Pricing
          </button>
        </form>
      </section>

      <section class="col-span-6 gap-x-4 mb-2 border-l-2 border-l-gray-500 pl-4">
        <h3 class="font-semibold text-l text-foreground">Discounts Information</h3>
        <hr>

        <form class="mt-4">
          <div class="grid grid-cols-2 gap-4">
            <label class="col-span-1 whitespace-nowrap mb-2 w-full">
              <span class="text-foreground w-4/12">Discount Type</span>
              <div class="w-full">
                <select class="form-select mt-1 w-full"
                v-model="formDiscount.discountType">
                  <option></option>
                  <option v-for="dtype of discountTypes" :key="dtype" :value="dtype">
                    {{ dtype }}
                  </option>
                </select>
              </div>
            </label>
            <label class="col-span-1 whitespace-nowrap mb-2 w-full">
              <span class="text-foreground w-4/12">Value Type</span>
              <div class="w-full">
                <select class="form-select mt-1 w-full"
                v-model="formDiscount.valueType">
                  <option></option>
                  <option v-for="vtype of valueTypes" :key="vtype" :value="vtype">
                    {{ vtype }}
                  </option>
                </select>
              </div>
            </label>
          </div>
          <div class="grid grid-cols-4 gap-4 mt-1">
            <label class="col-span-2">
              <span class="col-span-1 text-foreground">Start Date</span>
              <input class="form-input w-full" v-model="formDiscount.startDate" type="date"/>
            </label>
            <label class="col-span-2">
              <span class="col-span-1 text-foreground">End Date</span>
              <input class="form-input w-full" v-model="formDiscount.endDate" type="date"/>
            </label>
            <label v-show="formDiscount.discountType === 'voucher'"
             class="col-span-2 whitespace-nowrap w-full mb-2">
              <span class="text-foreground w-4/12">Voucher</span>
              <div class="w-full">
                <select class="form-select mt-1 w-full"
                v-model="formDiscount.voucherUid">
                  <option></option>
                  <option v-for="voucher of billingStore.vouchers" :key="voucher.uid" :value="voucher.uid">
                    {{ voucher.name }}
                  </option>
                </select>
              </div>
            </label>
          </div>
          <div class="grid grid-cols-2 gap-x-4 mt-1">
            <label v-show="formDiscount.valueType === 'percentage'" class="col-span-1">
              <span class="text-foreground">Value Percent</span>
              <input class="form-input w-full" v-model="formDiscount.valuePercent" type="number" step="0.01" min="0.00" max="1" />
              <span class="italic leading text-xs">Example: 0.05 for 5%</span>
            </label>
            <label v-show="formDiscount.valueType === 'amount'" class="col-span-1">
              <span class="text-foreground">Value Amount</span>
              <input class="form-input w-full" v-model="formDiscount.valueAmount" type="number" step="0.1" min="0.0" />
            </label>
          </div>
          <div class="grid grid-cols-2 gap-4 mt-4 mb-2">
            <label class="col-span-4 flex justify-start items-center gap-x-4">
              <span class="col-span-1 text-foreground">Is Active</span>
              <input class="form-checkbox" v-model="formDiscount.isActive" type="checkbox"/>
            </label>
          </div>
          <hr>
          <button type="button" @click.prevent="updateDiscounting()"
            class="border border-primary bg-primary text-primary-foreground rounded-sm mt-4 px-2 py-1 transition-colors duration-500 ease select-none hover:bg-primary focus:outline-none focus:shadow-outline">
            Update Discount
          </button>
        </form>
      </section>
    </div>
</template>
