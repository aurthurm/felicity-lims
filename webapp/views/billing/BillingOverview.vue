<template>
  <div class="space-y-4">
    <!-- Date Range Filters -->
    <div class="flex flex-col gap-2">
      <div class="flex flex-wrap gap-2">
        <Button
          v-for="period in periodOptions"
          :key="period.id"
          :variant="selectedPeriod === period.id ? 'default' : 'outline'"
          size="sm"
          @click="selectPeriod(period.id)"
        >
          {{ period.label }}
        </Button>
      </div>

      <!-- Custom Date Range -->
      <div v-if="selectedPeriod === 'custom'" class="flex flex-col gap-4 border-t border-border pt-4 sm:flex-row">
        <div class="flex-1 space-y-2">
          <Label for="custom-start">Start Date</Label>
          <Input
            id="custom-start"
            v-model="customStartDate"
            type="date"
            @change="applyCustomRange"
          />
        </div>
        <div class="flex-1 space-y-2">
          <Label for="custom-end">End Date</Label>
          <Input
            id="custom-end"
            v-model="customEndDate"
            type="date"
            @change="applyCustomRange"
          />
        </div>
      </div>

      <p class="text-xs text-muted-foreground">
        <template v-if="selectedPeriod === 'all-time'">Showing metrics for all time</template>
        <template v-else>From {{ formatDate(dateRange.startDate) }} to {{ formatDate(dateRange.endDate) }}</template>
      </p>
    </div>

    <hr class="border-border" />

    <!-- Loading State -->
    <div v-if="fetching" class="grid grid-cols-1 gap-4 md:grid-cols-4">
      <Card v-for="i in 4" :key="i" class="p-4">
        <Skeleton class="mb-2 h-4 w-3/4" />
        <Skeleton class="h-8 w-1/2" />
      </Card>
    </div>

    <!-- Key Metrics -->
    <div v-else class="grid grid-cols-1 gap-4 md:grid-cols-4">
      <StatCard
        v-for="metric in keyMetrics"
        :key="metric.key"
        :label="metric.label"
        :tooltip="metric.tooltip"
        :border-class="metric.borderClass"
        :value-class="metric.valueClass"
      >
        {{ metric.formatter(metricsData) }}
      </StatCard>
    </div>

    <!-- Volume & Transactions -->
    <div class="grid grid-cols-1 gap-4 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle class="text-base">Bill Volume</CardTitle>
        </CardHeader>
        <CardContent>
          <div class="space-y-3">
            <div
              v-for="row in volumeRows"
              :key="row.key"
              class="flex items-center justify-between rounded-lg bg-muted/50 px-3 py-2"
            >
              <div class="flex items-center gap-2">
                <span class="text-sm text-muted-foreground">{{ row.label }}</span>
                <Tooltip>
                  <TooltipTrigger as-child>
                    <button
                      type="button"
                      class="inline-flex size-3.5 shrink-0 text-muted-foreground hover:text-foreground focus:outline-none"
                      aria-label="Info"
                    >
                      <svg class="size-3.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
                      </svg>
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="top" class="max-w-[14rem]">{{ row.tooltip }}</TooltipContent>
                </Tooltip>
              </div>
              <span :class="['text-sm font-semibold tabular-nums', row.valueClass]">{{ row.value(metricsData) }}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle class="text-base">Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <div class="space-y-3">
            <div
              v-for="row in transactionRows"
              :key="row.key"
              class="flex items-center justify-between rounded-lg bg-muted/50 px-3 py-2"
            >
              <div class="flex items-center gap-2">
                <span class="text-sm text-muted-foreground">{{ row.label }}</span>
                <Tooltip>
                  <TooltipTrigger as-child>
                    <button
                      type="button"
                      class="inline-flex size-3.5 shrink-0 text-muted-foreground hover:text-foreground focus:outline-none"
                      aria-label="Info"
                    >
                      <svg class="size-3.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
                      </svg>
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="top" class="max-w-[14rem]">{{ row.tooltip }}</TooltipContent>
                </Tooltip>
              </div>
              <span :class="['text-sm font-semibold tabular-nums', row.valueClass]">{{ row.value(metricsData) }}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>

    <!-- Discounts & Vouchers -->
    <Card>
      <CardHeader>
        <CardTitle class="text-base">Discounts & Vouchers</CardTitle>
      </CardHeader>
      <CardContent>
        <div class="grid grid-cols-1 gap-4 md:grid-cols-5">
          <div
            v-for="row in discountRows"
            :key="row.key"
            class="rounded-lg bg-muted/50 p-3"
          >
            <div class="flex items-center gap-1.5">
              <span class="text-sm text-muted-foreground">{{ row.label }}</span>
              <Tooltip>
                <TooltipTrigger as-child>
                  <button
                    type="button"
                    class="inline-flex size-3.5 shrink-0 text-muted-foreground hover:text-foreground focus:outline-none"
                    aria-label="Info"
                  >
                    <svg class="size-3.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
                    </svg>
                  </button>
                </TooltipTrigger>
                <TooltipContent side="top" class="max-w-[14rem]">{{ row.tooltip }}</TooltipContent>
              </Tooltip>
            </div>
            <p :class="['mt-1 text-lg font-bold tabular-nums', row.valueClass]">{{ row.value(metricsData) }}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, computed } from "vue";
import { useQuery } from "@urql/vue";
import { GetBillingOverviewMetricsDocument } from "@/graphql/operations/billing.queries";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import StatCard from "@/components/common/StatCard.vue";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

const metricsData = ref<any>(null);
const selectedPeriod = ref<string>("this-month");
const customStartDate = ref<string>("");
const customEndDate = ref<string>("");

const periodOptions = [
  { id: "this-month", label: "This Month" },
  { id: "last-month", label: "Last Month" },
  { id: "this-quarter", label: "This Quarter" },
  { id: "this-year", label: "This Year" },
  { id: "all-time", label: "All Time" },
  { id: "custom", label: "Custom Range" },
];

interface DateRange {
  startDate: Date | null;
  endDate: Date | null;
}

const dateRange = computed<DateRange>(() => {
  if (selectedPeriod.value === "custom") {
    const startDate = customStartDate.value ? new Date(customStartDate.value) : null;
    const endDate = customEndDate.value ? new Date(customEndDate.value) : null;
    return { startDate, endDate };
  }

  const today = new Date();
  let startDate: Date | null;
  let endDate: Date | null = new Date(today);

  switch (selectedPeriod.value) {
    case "this-month":
      startDate = new Date(today.getFullYear(), today.getMonth(), 1);
      endDate = new Date(today.getFullYear(), today.getMonth() + 1, 0);
      break;
    case "last-month":
      startDate = new Date(today.getFullYear(), today.getMonth() - 1, 1);
      endDate = new Date(today.getFullYear(), today.getMonth(), 0);
      break;
    case "this-quarter": {
      const quarter = Math.floor(today.getMonth() / 3);
      startDate = new Date(today.getFullYear(), quarter * 3, 1);
      endDate = new Date(today.getFullYear(), (quarter + 1) * 3, 0);
      break;
    }
    case "this-year":
      startDate = new Date(today.getFullYear(), 0, 1);
      endDate = new Date(today.getFullYear(), 11, 31);
      break;
    default:
      return { startDate: null, endDate: null };
  }

  return { startDate, endDate };
});

const keyMetrics = computed(() => [
  {
    key: "totalCharged",
    label: "Total Charged",
    borderClass: "border-l-primary",
    valueClass: "text-foreground",
    tooltip: "Sum of all amounts billed to customers across all bills",
    formatter: (d: any) => `$${(d?.keyMetrics?.totalCharged ?? 0).toFixed(2)}`,
  },
  {
    key: "totalPaid",
    label: "Total Paid",
    borderClass: "border-l-emerald-500",
    valueClass: "text-emerald-600 dark:text-emerald-400",
    tooltip: "Total amount received from customers in successful transactions",
    formatter: (d: any) => `$${(d?.keyMetrics?.totalPaid ?? 0).toFixed(2)}`,
  },
  {
    key: "outstandingBalance",
    label: "Outstanding Balance",
    borderClass: "border-l-amber-500",
    valueClass: "text-amber-600 dark:text-amber-400",
    tooltip: "Amount still owed by customers (Total Charged - Total Paid)",
    formatter: (d: any) => `$${(d?.keyMetrics?.outstandingBalance ?? 0).toFixed(2)}`,
  },
  {
    key: "collectionRate",
    label: "Collection Rate",
    borderClass: "border-l-violet-500",
    valueClass: "text-violet-600 dark:text-violet-400",
    tooltip: "Percentage of billed amounts that have been paid (Total Paid / Total Charged)",
    formatter: (d: any) => `${(d?.keyMetrics?.collectionRate ?? 0).toFixed(1)}%`,
  },
]);

const volumeRows = [
  { key: "activeBills", label: "Active Bills", tooltip: "Bills currently in use and being processed", valueClass: "text-primary", value: (d: any) => d?.volumeMetrics?.activeBills ?? 0 },
  { key: "inactiveBills", label: "Inactive Bills", tooltip: "Bills that have been deactivated or archived", valueClass: "text-muted-foreground", value: (d: any) => d?.volumeMetrics?.inactiveBills ?? 0 },
  { key: "pendingConfirmation", label: "Pending Confirmation", tooltip: "Bills awaiting confirmation before final processing", valueClass: "text-orange-600 dark:text-orange-400", value: (d: any) => d?.volumeMetrics?.pendingConfirmation ?? 0 },
  { key: "partialBills", label: "Partial Bills", tooltip: "Bills with partial payments or incomplete transactions", valueClass: "text-destructive", value: (d: any) => d?.volumeMetrics?.partialBills ?? 0 },
  { key: "completeBills", label: "Complete Bills", tooltip: "Bills that are fully processed and not partial", valueClass: "text-emerald-600 dark:text-emerald-400", value: (d: any) => d?.volumeMetrics?.completeBills ?? 0 },
];

const transactionRows = [
  { key: "successful", label: "Successful", tooltip: "Payment transactions that completed successfully", valueClass: "text-emerald-600 dark:text-emerald-400", value: (d: any) => d?.transactionMetrics?.successfulTransactions ?? 0 },
  { key: "failed", label: "Failed", tooltip: "Transactions that failed to process successfully", valueClass: "text-destructive", value: (d: any) => d?.transactionMetrics?.failedTransactions ?? 0 },
  { key: "pending", label: "Pending", tooltip: "Transactions waiting to be processed", valueClass: "text-orange-600 dark:text-orange-400", value: (d: any) => d?.transactionMetrics?.pendingTransactions ?? 0 },
  { key: "totalAmount", label: "Total Amount", tooltip: "Sum of all successful transaction amounts", valueClass: "text-primary", value: (d: any) => `$${(d?.transactionMetrics?.totalTransactionAmount ?? 0).toFixed(2)}` },
];

const discountRows = [
  { key: "totalDiscountAmount", label: "Total Discount Amount", tooltip: "Sum of all active discount amounts from analysis and profile discounts", valueClass: "text-primary", value: (d: any) => `$${(d?.discountMetrics?.totalDiscountAmount ?? 0).toFixed(2)}` },
  { key: "activeVouchers", label: "Active Vouchers", tooltip: "Vouchers that still have usage limit remaining or unlimited usage", valueClass: "text-emerald-600 dark:text-emerald-400", value: (d: any) => d?.discountMetrics?.activeVouchers ?? 0 },
  { key: "totalVouchers", label: "Total Vouchers", tooltip: "Total number of vouchers created in the system", valueClass: "text-violet-600 dark:text-violet-400", value: (d: any) => d?.discountMetrics?.totalVouchers ?? 0 },
  { key: "voucherRedemptionRate", label: "Redemption Rate", tooltip: "Percentage of voucher usage limit that has been redeemed", valueClass: "text-orange-600 dark:text-orange-400", value: (d: any) => `${(d?.discountMetrics?.voucherRedemptionRate ?? 0).toFixed(1)}%` },
  { key: "vouchersWithAvailableUsage", label: "Available Usage", tooltip: "Count of vouchers with remaining usage availability", valueClass: "text-primary", value: (d: any) => d?.discountMetrics?.vouchersWithAvailableUsage ?? 0 },
];

const { data, fetching, executeQuery } = useQuery({
  query: GetBillingOverviewMetricsDocument,
  variables: computed(() => {
    if (selectedPeriod.value === "all-time") {
      return { startDate: null, endDate: null };
    }
    return {
      startDate: dateRange.value.startDate?.toISOString(),
      endDate: dateRange.value.endDate?.toISOString(),
    };
  }),
});

onMounted(() => {
  executeQuery({ requestPolicy: "network-only" });
});

watch(
  () => selectedPeriod.value,
  () => {
    executeQuery({ requestPolicy: "network-only" });
  }
);

watch(
  () => data.value?.billingOverviewMetrics,
  (metrics: any) => {
    if (metrics) {
      metricsData.value = metrics;
    }
  },
  { deep: true }
);

const formatDate = (date: Date | null): string => {
  if (!date) return "";
  return date.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
};

const selectPeriod = (period: string) => {
  selectedPeriod.value = period;
};

const applyCustomRange = () => {
  if (customStartDate.value && customEndDate.value) {
    executeQuery({ requestPolicy: "network-only" });
  }
};
</script>
