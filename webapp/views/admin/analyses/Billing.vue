<script setup lang="ts">
  import { toRefs, watch, reactive, ref } from 'vue';
  import { 
    EDIT_PROFILE_PRICING, EDIT_ANALYSIS_PRICING,
    EDIT_ANALYSIS_DISCOUNT, EDIT_PROFILE_DISCOUNT
  } from '../../../graphql/operations/billing.mutations'
  import { useBillingStore } from '../../../stores';
  import { useApiUtil } from '../../../composables';
import { IAnalysisDiscount, IProfileDiscount } from '../../../models/billing';

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
    let mutation = target.value == 'profile' ? EDIT_PROFILE_PRICING : EDIT_ANALYSIS_PRICING;
    let mutationKey = target.value == 'profile' ? "updateProfilePrice" : "updateAnaysisPrice"
    let pricing = target.value == 'profile' ? billingStore.profilePrice : billingStore.analysisPrice;
    withClientMutation(
      mutation,
      { uid: pricing?.uid, payload },
      mutationKey
    ).then((result) => {
      console.log(result)
    });
  };

  const formDiscount = reactive({ 
    discountType: "",
    valueType: "",
    startDate: "",
    endDate: "",
    voucherUid: "",
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
    let mutation = target.value == 'profile' ? EDIT_PROFILE_DISCOUNT : EDIT_ANALYSIS_DISCOUNT;
    let mutationKey = target.value == 'profile' ? "updateProfileDiscount" : "updateAnalysisDiscount"
    let discount = target.value == 'profile' ? billingStore.profileDiscount : billingStore.analyisDiscount;
    withClientMutation(
      mutation,
      { uid: discount?.uid, payload },
      mutationKey
    ).then((result) => {
      console.log(result)
    });
  };

  watch(() => formDiscount.discountType, (dt, _) => {
    if(dt !== 'voucher') {
      formDiscount.voucherUid = "";
    }
  })

</script>

<template>
    <div class="grid grid-cols-12">
      <section class="col-span-6 gap-x-4 pr-4 mb-2">
        <h3 class="font-semibold text-l text-gray-600">Pricing Information</h3>
        <hr>
        <form class="mt-4">
          <div class="">
            <label class="flex justify-start items-center gap-x-4 mb-4">
              <span class="col-span-1 text-gray-700">Amount: $</span>
              <input class="form-input mt-1" v-model="formPricing.amount" type="number" min="0.0" step="0.1" />
            </label>
          </div>
          <button type="button" @click.prevent="updatePricing()"
            class="border border-sky-800 bg-sky-800 text-white rounded-sm mt-4 px-2 py-1 transition-colors duration-500 ease select-none hover:bg-sky-800 focus:outline-none focus:shadow-outline">
            Update Pricing
          </button>
        </form>
      </section>

      <section class="col-span-6 gap-x-4 mb-2 border-l-2 border-l-gray-500 pl-4">
        <h3 class="font-semibold text-l text-gray-600">Discounts Information</h3>
        <hr>

        <form class="mt-4">
          <div class="grid grid-cols-2 gap-4">
            <label class="col-span-1 whitespace-nowrap mb-2 w-full">
              <span class="text-gray-700 w-4/12">Discount Type</span>
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
              <span class="text-gray-700 w-4/12">Value Type</span>
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
              <span class="col-span-1 text-gray-700">Start Date</span>
              <input class="form-input w-full" v-model="formDiscount.startDate" type="date"/>
            </label>
            <label class="col-span-2">
              <span class="col-span-1 text-gray-700">End Date</span>
              <input class="form-input w-full" v-model="formDiscount.endDate" type="date"/>
            </label>
            <label v-show="formDiscount.discountType === 'voucher'"
             class="col-span-2 whitespace-nowrap w-full mb-2">
              <span class="text-gray-700 w-4/12">Voucher</span>
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
              <span class="text-gray-700">Value Percent</span>
              <input class="form-input w-full" v-model="formDiscount.valuePercent" type="number" step="0.1" min="0.0" max="100" />
            </label>
            <label v-show="formDiscount.valueType === 'amount'" class="col-span-1">
              <span class="text-gray-700">Value Amount</span>
              <input class="form-input w-full" v-model="formDiscount.valueAmount" type="number" step="0.1" min="0.0" />
            </label>
          </div>
          <div class="grid grid-cols-2 gap-4 mt-4 mb-2">
            <label class="col-span-4 flex justify-start items-center gap-x-4">
              <span class="col-span-1 text-gray-700">Is Active</span>
              <input class="form-checkbox" v-model="formDiscount.isActive" type="checkbox"/>
            </label>
          </div>
          <hr>
          <button type="button" @click.prevent="updateDiscounting()"
            class="border border-sky-800 bg-sky-800 text-white rounded-sm mt-4 px-2 py-1 transition-colors duration-500 ease select-none hover:bg-sky-800 focus:outline-none focus:shadow-outline">
            Update Discount
          </button>
        </form>
      </section>
    </div>
</template>
