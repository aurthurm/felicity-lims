<script setup lang="ts">
import { watch } from "vue";
import { useFormContext } from "vee-validate";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useBillingStore } from "@/stores/billing";

const { setFieldValue, values } = useFormContext();
const billingStore = useBillingStore();

watch(
  () => values.discountType,
  (dt) => {
    if (dt !== "voucher") {
      setFieldValue("voucherUid", null);
    }
  }
);
</script>

<template>
  <FormField name="voucherUid" v-slot="{ componentField }">
    <FormItem v-show="values.discountType === 'voucher'">
      <FormLabel>Voucher</FormLabel>
      <FormControl>
        <Select v-bind="componentField">
          <SelectTrigger>
            <SelectValue placeholder="Select voucher" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem v-for="voucher of billingStore.vouchers" :key="voucher.uid" :value="voucher.uid">
              {{ voucher.code }}
            </SelectItem>
          </SelectContent>
        </Select>
      </FormControl>
      <FormMessage />
    </FormItem>
  </FormField>
</template>
