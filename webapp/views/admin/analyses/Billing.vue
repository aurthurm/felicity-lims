<script setup lang="ts">
  import { toRefs, watch, ref } from 'vue';
  import { useField, useForm } from "vee-validate";
  import { boolean, number, object, string } from "yup";
  import { 
    EditProfilePricingDocument, EditProfilePricingMutation, EditProfilePricingMutationVariables,
    EditAnalysisPricingDocument, EditAnalysisPricingMutation, EditAnalysisPricingMutationVariables,
    EditAnalysisDiscountDocument, EditAnalysisDiscountMutation, EditAnalysisDiscountMutationVariables,
    EditProfileDiscountDocument, EditProfileDiscountMutation, EditProfileDiscountMutationVariables
  } from '@/graphql/operations/billing.mutations'
  import { useBillingStore } from '@/stores/billing';
  import  useApiUtil  from '@/composables/api_util';
  import { AnalysisDiscountType, ProfileDiscountType } from '@/types/gql';

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

  const pricingSchema = object({
    amount: number()
      .min(0, "Amount must be 0 or greater")
      .required("Amount is required"),
  });

  const {
    handleSubmit: handlePricingSubmit,
    errors: pricingErrors,
    setFieldValue: setPricingFieldValue,
  } = useForm({
    validationSchema: pricingSchema,
    initialValues: {
      amount: 0.0,
    },
  });

  const { value: amount } = useField<number>("amount");

  watch(() => billingStore.fetchingPrice, (fetching, old) => {
    if(!fetching) {
      if(target?.value === "profile"){
        setPricingFieldValue("amount", billingStore.profilePrice?.amount ?? 0.0);
      }
      if(target?.value === "analysis"){
        setPricingFieldValue("amount", billingStore.analysisPrice?.amount ?? 0.0);
      }
    }
  });

  const updatePricing = handlePricingSubmit((values) => {
    const payload = { amount: values.amount };
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
  });

  const discountSchema = object({
    discountType: string().required("Discount type is required"),
    valueType: string().required("Value type is required"),
    startDate: string().nullable(),
    endDate: string().nullable(),
    voucherUid: string()
      .nullable()
      .when("discountType", {
        is: "voucher",
        then: schema => schema.required("Voucher is required"),
      }),
    valuePercent: number()
      .min(0, "Value percent must be 0 or greater")
      .max(100, "Value percent must be 100 or less")
      .nullable()
      .when("valueType", {
        is: "percentage",
        then: schema => schema.required("Value percent is required"),
      }),
    valueAmount: number()
      .min(0, "Value amount must be 0 or greater")
      .nullable()
      .when("valueType", {
        is: "amount",
        then: schema => schema.required("Value amount is required"),
      }),
    isActive: boolean().nullable(),
  });

  const {
    handleSubmit: handleDiscountSubmit,
    errors: discountErrors,
    setValues: setDiscountValues,
    setFieldValue: setDiscountFieldValue,
  } = useForm({
    validationSchema: discountSchema,
    initialValues: {
      discountType: "",
      valueType: "",
      startDate: "",
      endDate: "",
      voucherUid: null,
      valuePercent: 0.0,
      valueAmount: 0.0,
      isActive: true,
    },
  });

  const { value: discountType } = useField<string>("discountType");
  const { value: valueType } = useField<string>("valueType");
  const { value: startDate } = useField<string | null>("startDate");
  const { value: endDate } = useField<string | null>("endDate");
  const { value: voucherUid } = useField<string | null>("voucherUid");
  const { value: valuePercent } = useField<number | null>("valuePercent");
  const { value: valueAmount } = useField<number | null>("valueAmount");
  const { value: isActive } = useField<boolean | null>("isActive");

  watch(() => billingStore.fetchingDiscount, (fetching, old) => {
    if(!fetching) {
      let discount = {} as AnalysisDiscountType | ProfileDiscountType
      if(target?.value === "profile"){
        discount = { ...billingStore.profileDiscount } as ProfileDiscountType
      }
      if(target?.value === "analysis"){
        discount = { ...billingStore.analyisDiscount } as AnalysisDiscountType
      }
      setDiscountValues({
        discountType: discount.discountType ?? "",
        valueType: discount.valueType ?? "",
        startDate: discount.startDate ?? "",
        endDate: discount.endDate ?? "",
        voucherUid: discount.voucherUid ?? null,
        valuePercent: discount.valuePercent ?? 0.0,
        valueAmount: discount.valueAmount ?? 0.0,
        isActive: discount.isActive ?? true,
      });
    }
  });

  const discountTypes = ref(["sale", "voucher"])
  const valueTypes = ref(["percentage", "amount"])

  const updateDiscounting = handleDiscountSubmit((values) => {
    const payload = { ...values };
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
  });

  watch(() => discountType.value, (dt, _) => {
    if(dt !== 'voucher') {
      setDiscountFieldValue("voucherUid", null);
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
            <form class="space-y-6" @submit.prevent="updatePricing">
              <div class="space-y-4">
                <label class="space-y-2">
                  <span class="text-sm font-medium text-muted-foreground">Amount ($)</span>
                  <div class="relative">
                    <span class="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                    <input 
                      class="w-full pl-8 px-3 py-2 border border-input bg-background text-foreground rounded-lg focus:outline-none focus:ring-2 focus:ring-ring placeholder:text-muted-foreground" 
                      v-model="amount" 
                      type="number" 
                      min="0.0" 
                      step="0.1" 
                      placeholder="0.00"
                    />
                  </div>
                  <div class="text-sm text-destructive">{{ pricingErrors.amount }}</div>
                </label>
              </div>
              <button 
                type="submit" 
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
            <form class="space-y-6" @submit.prevent="updateDiscounting">
              <div class="grid grid-cols-2 gap-4">
                <label class="space-y-2">
                  <span class="text-sm font-medium text-muted-foreground">Discount Type</span>
                  <select 
                    class="w-full px-3 py-2 border border-input bg-background text-foreground rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                    v-model="discountType"
                  >
                    <option value="">Select type</option>
                    <option v-for="dtype of discountTypes" :key="dtype" :value="dtype" class="capitalize">
                      {{ dtype }}
                    </option>
                  </select>
                  <div class="text-sm text-destructive">{{ discountErrors.discountType }}</div>
                </label>
                <label class="space-y-2">
                  <span class="text-sm font-medium text-muted-foreground">Value Type</span>
                  <select 
                    class="w-full px-3 py-2 border border-input bg-background text-foreground rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                    v-model="valueType"
                  >
                    <option value="">Select type</option>
                    <option v-for="vtype of valueTypes" :key="vtype" :value="vtype" class="capitalize">
                      {{ vtype }}
                    </option>
                  </select>
                  <div class="text-sm text-destructive">{{ discountErrors.valueType }}</div>
                </label>
              </div>

              <div class="grid grid-cols-2 gap-4">
                <label class="space-y-2">
                  <span class="text-sm font-medium text-muted-foreground">Start Date</span>
                  <input 
                    class="w-full px-3 py-2 border border-input bg-background text-foreground rounded-lg focus:outline-none focus:ring-2 focus:ring-ring" 
                    v-model="startDate" 
                    type="date"
                  />
                </label>
                <label class="space-y-2">
                  <span class="text-sm font-medium text-muted-foreground">End Date</span>
                  <input 
                    class="w-full px-3 py-2 border border-input bg-background text-foreground rounded-lg focus:outline-none focus:ring-2 focus:ring-ring" 
                    v-model="endDate" 
                    type="date"
                  />
                </label>
              </div>

              <div v-show="discountType === 'voucher'" class="space-y-2">
                <label>
                  <span class="text-sm font-medium text-muted-foreground">Voucher</span>
                  <select 
                    class="w-full px-3 py-2 border border-input bg-background text-foreground rounded-lg focus:outline-none focus:ring-2 focus:ring-ring mt-2"
                    v-model="voucherUid"
                  >
                    <option value="">Select voucher</option>
                    <option v-for="voucher of billingStore.vouchers" :key="voucher.uid" :value="voucher.uid">
                      {{ voucher.code }}
                    </option>
                  </select>
                  <div class="text-sm text-destructive">{{ discountErrors.voucherUid }}</div>
                </label>
              </div>

              <div class="grid grid-cols-2 gap-4">
                <label class="space-y-2">
                  <span class="text-sm font-medium text-muted-foreground">Value Percentage (%)</span>
                  <input 
                    class="w-full px-3 py-2 border border-input bg-background text-foreground rounded-lg focus:outline-none focus:ring-2 focus:ring-ring" 
                    v-model="valuePercent" 
                    type="number" 
                    min="0" 
                    max="100" 
                    step="0.1"
                    placeholder="0.00"
                  />
                  <div class="text-sm text-destructive">{{ discountErrors.valuePercent }}</div>
                </label>
                <label class="space-y-2">
                  <span class="text-sm font-medium text-muted-foreground">Value Amount ($)</span>
                  <div class="relative">
                    <span class="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                    <input 
                      class="w-full pl-8 px-3 py-2 border border-input bg-background text-foreground rounded-lg focus:outline-none focus:ring-2 focus:ring-ring" 
                      v-model="valueAmount" 
                      type="number" 
                      min="0" 
                      step="0.1"
                      placeholder="0.00"
                    />
                  </div>
                  <div class="text-sm text-destructive">{{ discountErrors.valueAmount }}</div>
                </label>
              </div>

              <div class="flex items-center space-x-2">
                <input 
                  type="checkbox" 
                  id="isActive"
                  v-model="isActive"
                  class="h-4 w-4 rounded border-input bg-background text-primary focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                />
                <label for="isActive" class="text-sm font-medium text-muted-foreground">Active</label>
              </div>

              <button 
                type="submit" 
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
