<script setup lang="ts">
  import { toRefs, watch, ref } from 'vue';
  import { useForm } from "vee-validate";
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
  import { Button } from "@/components/ui/button";
  import { Input } from "@/components/ui/input";
  import {FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
  } from "@/components/ui/form";
  import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select";

defineOptions({ name: 'BillingView' })
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
    values: discountValues,
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

  watch(() => discountValues.discountType, (dt, _) => {
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
                <FormField name="amount" v-slot="{ componentField }">
                  <FormItem>
                    <FormLabel>Amount ($)</FormLabel>
                    <FormControl>
                      <div class="relative">
                        <span class="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                        <Input v-bind="componentField" class="pl-8" type="number" min="0.0" step="0.1" placeholder="0.00" />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                </FormField>
              </div>
              <Button type="submit" class="w-full">
                Update Pricing
              </Button>
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
                <FormField name="discountType" v-slot="{ componentField }">
                  <FormItem>
                    <FormLabel>Discount Type</FormLabel>
                    <FormControl>
                      <Select v-bind="componentField">
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem v-for="dtype of discountTypes" :key="dtype" :value="dtype" class="capitalize">
                            {{ dtype }}
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                </FormField>
                <FormField name="valueType" v-slot="{ componentField }">
                  <FormItem>
                    <FormLabel>Value Type</FormLabel>
                    <FormControl>
                      <Select v-bind="componentField">
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem v-for="vtype of valueTypes" :key="vtype" :value="vtype" class="capitalize">
                            {{ vtype }}
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                </FormField>
              </div>

              <div class="grid grid-cols-2 gap-4">
                <FormField name="startDate" v-slot="{ componentField }">
                  <FormItem>
                    <FormLabel>Start Date</FormLabel>
                    <FormControl>
                      <Input v-bind="componentField" type="date" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                </FormField>
                <FormField name="endDate" v-slot="{ componentField }">
                  <FormItem>
                    <FormLabel>End Date</FormLabel>
                    <FormControl>
                      <Input v-bind="componentField" type="date" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                </FormField>
              </div>

              <FormField name="voucherUid" v-slot="{ componentField }">
                <FormItem v-show="discountValues.discountType === 'voucher'">
                  <FormLabel>Voucher</FormLabel>
                  <FormControl>
                    <Select v-bind="componentField">
                      <SelectTrigger>
                        <SelectValue placeholder="Select voucher" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">Select voucher</SelectItem>
                        <SelectItem v-for="voucher of billingStore.vouchers" :key="voucher.uid" :value="voucher.uid">
                          {{ voucher.code }}
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              </FormField>

              <div class="grid grid-cols-2 gap-4">
                <FormField name="valuePercent" v-slot="{ componentField }">
                  <FormItem>
                    <FormLabel>Value Percentage (%)</FormLabel>
                    <FormControl>
                      <Input v-bind="componentField" type="number" min="0" max="100" step="0.1" placeholder="0.00" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                </FormField>
                <FormField name="valueAmount" v-slot="{ componentField }">
                  <FormItem>
                    <FormLabel>Value Amount ($)</FormLabel>
                    <FormControl>
                      <div class="relative">
                        <span class="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                        <Input v-bind="componentField" class="pl-8" type="number" min="0" step="0.1" placeholder="0.00" />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                </FormField>
              </div>

              <FormField name="isActive" type="checkbox" :checked-value="true" :unchecked-value="false" v-slot="{ componentField }">
                <FormItem class="flex items-center space-x-2">
                  <FormControl>
                    <Checkbox id="isActive" v-bind="componentField" />
                  </FormControl>
                  <FormLabel>Active</FormLabel>
                  <FormMessage />
                </FormItem>
              </FormField>

              <Button type="submit" class="w-full">
                Update Discount
              </Button>
            </form>
          </div>
        </div>
      </section>
    </div>
</template>
