<script setup lang="ts">
import { defineAsyncComponent, ref} from "vue";
import { useBillingStore } from "@/stores/billing";
import { storeToRefs } from "pinia";
import { parseDate } from "@/utils";
import { TestBillType } from "@/types/gql";
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyTitle } from "@/components/ui/empty";
import { Spinner } from "@/components/ui/spinner";

const BillDetail = defineAsyncComponent(
  () => import("@/components/billing/BillDetail.vue")
);

const props = defineProps({
  patientUid: String
});


const billingStore = useBillingStore();
const { bills, fetchingBills} = storeToRefs(billingStore)
billingStore.fetchBillsForPatient(props?.patientUid!);

const testBill = ref({} as TestBillType);
const selectTestBill = (tb: TestBillType) => {
  testBill.value = {...tb};
  billingStore.fetchBillTransactions(tb.uid)
}

</script>

<style lang="css" scoped>
.billing-scroll {
  min-height: 350px;
  max-height: calc(100vh - 200px);
}
</style>

<template>
  <div class="space-y-6">
    <div class="grid grid-cols-12 gap-6">
      <section v-motion :initial="{ opacity: 0, y: 100 }" :enter="{ opacity: 1, y: 0, scale: 1 }"
        :variants="{ custom: { scale: 2 } }" :delay="400"
        class="col-span-3 overflow-y-auto overscroll-contain billing-scroll">
        <div v-if="fetchingBills" class="py-4 text-center bg-background w-full mb-2 rounded-lg shadow-sm border border-border">
          <span class="inline-flex items-center gap-2">
            <Spinner class="size-4" />
            <span class="text-sm">Fetching bills ...</span>
          </span>
        </div>
        <div v-else>
          <ul class="space-y-2" v-if="bills?.length > 0">
            <li v-for="bill in bills" :key="bill.uid" :class="[
              'bg-background w-full p-3 rounded-lg shadow-sm border border-border transition-all duration-200 hover:shadow-md',
              { 'border-primary bg-primary/5': bill.uid === testBill.uid },
              ]" 
              @click="selectTestBill(bill)">
              <div class="space-y-1">
                <div class="font-semibold text-foreground">
                  Bill {{ bill.billId?.toLocaleUpperCase() }}
                </div>
                <div class="text-sm text-muted-foreground">{{ parseDate(bill.createdAt) }}</div>
              </div>
            </li>
          </ul>
          <Empty v-else class="bg-background w-full mb-2 shadow-sm border border-border">
            <EmptyContent>
              <EmptyHeader>
                <EmptyTitle>No bills found</EmptyTitle>
                <EmptyDescription>No bills found for this patient.</EmptyDescription>
              </EmptyHeader>
            </EmptyContent>
          </Empty>
        </div>
      </section>

      <!-- Bill Detail -->
      <section class="col-span-9">
        <div v-if="testBill.uid">
          <BillDetail :customerUid="props.patientUid!" :testBill="testBill" />
        </div>
        <Empty v-else class="bg-background w-full mb-2 shadow-sm border border-border">
          <EmptyContent>
            <EmptyHeader>
              <EmptyTitle>No bill selected</EmptyTitle>
              <EmptyDescription>Select a bill to view details.</EmptyDescription>
            </EmptyHeader>
          </EmptyContent>
        </Empty>
      </section>
    </div>
  </div>

</template>
