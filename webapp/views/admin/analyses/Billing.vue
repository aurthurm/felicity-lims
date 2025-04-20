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
    <div class="grid grid-cols-12 gap-8 p-6">
      <section class="col-span-6">
        <div class="space-y-6">
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-semibold text-foreground">Pricing Information</h3>
          </div>
          <div class="rounded-lg border border-border bg-card p-6">
            <form class="space-y-6">
              <div class="space-y-4">
                <label class="space-y-2">
                  <span class="text-sm font-medium text-muted-foreground">Amount ($)</span>
                  <div class="relative">
                    <span class="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                    <input 
                      class="w-full pl-8 px-3 py-2 border border-input bg-background text-foreground rounded-lg focus:outline-none focus:ring-2 focus:ring-ring placeholder:text-muted-foreground" 
                      v-model="formPricing.amount" 
                      type="number" 
                      min="0.0" 
                      step="0.1" 
                      placeholder="0.00"
                    />
                  </div>
                </label>
              </div>
              <button 
                type="button" 
                @click.prevent="updatePricing()"
                class="w-full bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg px-4 py-2 text-sm font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-ring"
              >
                Update Pricing
              </button>
            </form>
          </div>
        </div>
      </section>

      <section class="col-span-6">
        <div class="space-y-6">
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-semibold text-foreground">Discounts Information</h3>
          </div>
          <div class="rounded-lg border border-border bg-card p-6">
            <form class="space-y-6">
              <div class="grid grid-cols-2 gap-4">
                <label class="space-y-2">
                  <span class="text-sm font-medium text-muted-foreground">Discount Type</span>
                  <select 
                    class="w-full px-3 py-2 border border-input bg-background text-foreground rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                    v-model="formDiscount.discountType"
                  >
                    <option value="">Select type</option>
                    <option v-for="dtype of discountTypes" :key="dtype" :value="dtype" class="capitalize">
                      {{ dtype }}
                    </option>
                  </select>
                </label>
                <label class="space-y-2">
                  <span class="text-sm font-medium text-muted-foreground">Value Type</span>
                  <select 
                    class="w-full px-3 py-2 border border-input bg-background text-foreground rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                    v-model="formDiscount.valueType"
                  >
                    <option value="">Select type</option>
                    <option v-for="vtype of valueTypes" :key="vtype" :value="vtype" class="capitalize">
                      {{ vtype }}
                    </option>
                  </select>
                </label>
              </div>

              <div class="grid grid-cols-2 gap-4">
                <label class="space-y-2">
                  <span class="text-sm font-medium text-muted-foreground">Start Date</span>
                  <input 
                    class="w-full px-3 py-2 border border-input bg-background text-foreground rounded-lg focus:outline-none focus:ring-2 focus:ring-ring" 
                    v-model="formDiscount.startDate" 
                    type="date"
                  />
                </label>
                <label class="space-y-2">
                  <span class="text-sm font-medium text-muted-foreground">End Date</span>
                  <input 
                    class="w-full px-3 py-2 border border-input bg-background text-foreground rounded-lg focus:outline-none focus:ring-2 focus:ring-ring" 
                    v-model="formDiscount.endDate" 
                    type="date"
                  />
                </label>
              </div>

              <div v-show="formDiscount.discountType === 'voucher'" class="space-y-2">
                <label>
                  <span class="text-sm font-medium text-muted-foreground">Voucher</span>
                  <select 
                    class="w-full px-3 py-2 border border-input bg-background text-foreground rounded-lg focus:outline-none focus:ring-2 focus:ring-ring mt-2"
                    v-model="formDiscount.voucherUid"
                  >
                    <option value="">Select voucher</option>
                    <option v-for="voucher of billingStore.vouchers" :key="voucher.uid" :value="voucher.uid">
                      {{ voucher.code }}
                    </option>
                  </select>
                </label>
              </div>

              <div class="grid grid-cols-2 gap-4">
                <label class="space-y-2">
                  <span class="text-sm font-medium text-muted-foreground">Value Percentage (%)</span>
                  <input 
                    class="w-full px-3 py-2 border border-input bg-background text-foreground rounded-lg focus:outline-none focus:ring-2 focus:ring-ring" 
                    v-model="formDiscount.valuePercent" 
                    type="number" 
                    min="0" 
                    max="100" 
                    step="0.1"
                    placeholder="0.00"
                  />
                </label>
                <label class="space-y-2">
                  <span class="text-sm font-medium text-muted-foreground">Value Amount ($)</span>
                  <div class="relative">
                    <span class="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                    <input 
                      class="w-full pl-8 px-3 py-2 border border-input bg-background text-foreground rounded-lg focus:outline-none focus:ring-2 focus:ring-ring" 
                      v-model="formDiscount.valueAmount" 
                      type="number" 
                      min="0" 
                      step="0.1"
                      placeholder="0.00"
                    />
                  </div>
                </label>
              </div>

              <div class="flex items-center space-x-2">
                <input 
                  type="checkbox" 
                  id="isActive"
                  v-model="formDiscount.isActive"
                  class="h-4 w-4 rounded border-input bg-background text-primary focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                />
                <label for="isActive" class="text-sm font-medium text-muted-foreground">Active</label>
              </div>

              <button 
                type="button" 
                @click.prevent="updateDiscounting()"
                class="w-full bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg px-4 py-2 text-sm font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-ring"
              >
                Update Discount
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
</template>