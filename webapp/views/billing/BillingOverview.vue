<template>
  <div class="space-y-6">
    <div>
      <h1 class="text-xl text-foreground font-semibold">Billing Overview</h1>
      <hr class="my-2" />
      <p class="text-muted-foreground text-sm">Comprehensive overview of billing metrics and statistics</p>
    </div>

    <!-- Date Range Filters -->
    <div class="rounded-lg border border-border bg-card shadow-sm p-4">
      <div class="flex flex-col gap-4">
        <!-- Preset Period Buttons -->
        <div class="flex flex-wrap gap-2">
          <button
            @click="selectPeriod('this-month')"
            :class="[
              'px-3 py-1.5 rounded-md text-sm font-medium transition-colors',
              selectedPeriod === 'this-month'
                ? 'bg-primary text-primary-foreground'
                : 'border border-border bg-background text-foreground hover:bg-muted'
            ]"
          >
            This Month
          </button>
          <button
            @click="selectPeriod('last-month')"
            :class="[
              'px-3 py-1.5 rounded-md text-sm font-medium transition-colors',
              selectedPeriod === 'last-month'
                ? 'bg-primary text-primary-foreground'
                : 'border border-border bg-background text-foreground hover:bg-muted'
            ]"
          >
            Last Month
          </button>
          <button
            @click="selectPeriod('this-quarter')"
            :class="[
              'px-3 py-1.5 rounded-md text-sm font-medium transition-colors',
              selectedPeriod === 'this-quarter'
                ? 'bg-primary text-primary-foreground'
                : 'border border-border bg-background text-foreground hover:bg-muted'
            ]"
          >
            This Quarter
          </button>
          <button
            @click="selectPeriod('this-year')"
            :class="[
              'px-3 py-1.5 rounded-md text-sm font-medium transition-colors',
              selectedPeriod === 'this-year'
                ? 'bg-primary text-primary-foreground'
                : 'border border-border bg-background text-foreground hover:bg-muted'
            ]"
          >
            This Year
          </button>
          <button
            @click="selectPeriod('all-time')"
            :class="[
              'px-3 py-1.5 rounded-md text-sm font-medium transition-colors',
              selectedPeriod === 'all-time'
                ? 'bg-primary text-primary-foreground'
                : 'border border-border bg-background text-foreground hover:bg-muted'
            ]"
          >
            All Time
          </button>
          <button
            @click="selectPeriod('custom')"
            :class="[
              'px-3 py-1.5 rounded-md text-sm font-medium transition-colors',
              selectedPeriod === 'custom'
                ? 'bg-primary text-primary-foreground'
                : 'border border-border bg-background text-foreground hover:bg-muted'
            ]"
          >
            Custom Range
          </button>
        </div>

        <!-- Custom Date Range Picker -->
        <div v-if="selectedPeriod === 'custom'" class="flex flex-col sm:flex-row gap-4 pt-4 border-t border-border">
          <div class="flex-1">
            <label class="block text-sm font-medium text-foreground mb-1">Start Date</label>
            <input
              v-model="customStartDate"
              type="date"
              @change="applyCustomRange"
              class="w-full px-3 py-2 border border-input bg-background text-foreground rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <div class="flex-1">
            <label class="block text-sm font-medium text-foreground mb-1">End Date</label>
            <input
              v-model="customEndDate"
              type="date"
              @change="applyCustomRange"
              class="w-full px-3 py-2 border border-input bg-background text-foreground rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
        </div>

        <!-- Date Range Display -->
        <div v-if="selectedPeriod === 'all-time'" class="text-xs text-muted-foreground">
          Showing metrics for all time
        </div>
        <div v-else class="text-xs text-muted-foreground">
          From {{ formatDate(dateRange.startDate) }} to {{ formatDate(dateRange.endDate) }}
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="fetching" class="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div class="rounded-lg border border-border bg-card shadow-sm p-4 animate-pulse">
        <div class="h-4 bg-muted rounded-sm mb-2 w-3/4"></div>
        <div class="h-8 bg-muted rounded-sm"></div>
      </div>
      <div class="rounded-lg border border-border bg-card shadow-sm p-4 animate-pulse">
        <div class="h-4 bg-muted rounded-sm mb-2 w-3/4"></div>
        <div class="h-8 bg-muted rounded-sm"></div>
      </div>
      <div class="rounded-lg border border-border bg-card shadow-sm p-4 animate-pulse">
        <div class="h-4 bg-muted rounded-sm mb-2 w-3/4"></div>
        <div class="h-8 bg-muted rounded-sm"></div>
      </div>
      <div class="rounded-lg border border-border bg-card shadow-sm p-4 animate-pulse">
        <div class="h-4 bg-muted rounded-sm mb-2 w-3/4"></div>
        <div class="h-8 bg-muted rounded-sm"></div>
      </div>
    </div>

    <!-- Key Metrics -->
    <div v-else class="grid grid-cols-1 md:grid-cols-4 gap-4">
      <StatCard
        title="Total Charged"
        :value="`$${metricsData?.keyMetrics?.totalCharged?.toFixed(2) || '0.00'}`"
        variant="primary"
        tooltip="Sum of all amounts billed to customers across all bills"
      />
      <StatCard
        title="Total Paid"
        :value="`$${metricsData?.keyMetrics?.totalPaid?.toFixed(2) || '0.00'}`"
        variant="success"
        tooltip="Total amount received from customers in successful transactions"
      />
      <StatCard
        title="Outstanding Balance"
        :value="`$${metricsData?.keyMetrics?.outstandingBalance?.toFixed(2) || '0.00'}`"
        variant="warning"
        tooltip="Amount still owed by customers (Total Charged - Total Paid)"
      />
      <StatCard
        title="Collection Rate"
        :value="`${metricsData?.keyMetrics?.collectionRate?.toFixed(1) || '0'}%`"
        variant="accent"
        tooltip="Percentage of billed amounts that have been paid (Total Paid / Total Charged)"
        tooltip-position="right"
      />
    </div>

    <!-- Volume Metrics -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div class="rounded-lg border border-border bg-card shadow-sm p-4">
        <h3 class="text-lg font-semibold text-foreground mb-3">Bill Volume</h3>
        <div class="space-y-2">
          <div class="flex justify-between items-center p-3 bg-muted rounded-md group relative">
            <div class="flex items-center gap-2">
              <span class="text-muted-foreground">Active Bills</span>
              <div class="hidden group-hover:block absolute z-10 bottom-full left-0 mb-2 w-48 bg-popover text-popover-foreground text-xs rounded-md p-2 shadow-md border border-border whitespace-normal">
                Bills currently in use and being processed
              </div>
              <span class="cursor-help text-muted-foreground hover:text-primary transition-colors">
                <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"/></svg>
              </span>
            </div>
            <span class="text-lg font-semibold text-primary">{{ metricsData?.volumeMetrics?.activeBills || 0 }}</span>
          </div>
          <div class="flex justify-between items-center p-3 bg-muted rounded-md group relative">
            <div class="flex items-center gap-2">
              <span class="text-muted-foreground">Inactive Bills</span>
              <div class="hidden group-hover:block absolute z-10 bottom-full left-0 mb-2 w-48 bg-popover text-popover-foreground text-xs rounded-md p-2 shadow-md border border-border whitespace-normal">
                Bills that have been deactivated or archived
              </div>
              <span class="cursor-help text-muted-foreground hover:text-muted-foreground transition-colors">
                <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"/></svg>
              </span>
            </div>
            <span class="text-lg font-semibold text-muted-foreground">{{ metricsData?.volumeMetrics?.inactiveBills || 0 }}</span>
          </div>
          <div class="flex justify-between items-center p-3 bg-muted rounded-md group relative">
            <div class="flex items-center gap-2">
              <span class="text-muted-foreground">Pending Confirmation</span>
              <div class="hidden group-hover:block absolute z-10 bottom-full left-0 mb-2 w-48 bg-popover text-popover-foreground text-xs rounded-md p-2 shadow-md border border-border whitespace-normal">
                Bills awaiting confirmation before final processing
              </div>
              <span class="cursor-help text-muted-foreground hover:text-warning transition-colors">
                <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"/></svg>
              </span>
            </div>
            <span class="text-lg font-semibold text-warning">{{ metricsData?.volumeMetrics?.pendingConfirmation || 0 }}</span>
          </div>
          <div class="flex justify-between items-center p-3 bg-muted rounded-md group relative">
            <div class="flex items-center gap-2">
              <span class="text-muted-foreground">Partial Bills</span>
              <div class="hidden group-hover:block absolute z-10 bottom-full left-0 mb-2 w-48 bg-popover text-popover-foreground text-xs rounded-md p-2 shadow-md border border-border whitespace-normal">
                Bills with partial payments or incomplete transactions
              </div>
              <span class="cursor-help text-muted-foreground hover:text-destructive transition-colors">
                <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"/></svg>
              </span>
            </div>
            <span class="text-lg font-semibold text-destructive">{{ metricsData?.volumeMetrics?.partialBills || 0 }}</span>
          </div>
          <div class="flex justify-between items-center p-3 bg-muted rounded-md group relative">
            <div class="flex items-center gap-2">
              <span class="text-muted-foreground">Complete Bills</span>
              <div class="hidden group-hover:block absolute z-10 bottom-full left-0 mb-2 w-48 bg-popover text-popover-foreground text-xs rounded-md p-2 shadow-md border border-border whitespace-normal">
                Bills that are fully processed and not partial
              </div>
              <span class="cursor-help text-muted-foreground hover:text-success transition-colors">
                <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"/></svg>
              </span>
            </div>
            <span class="text-lg font-semibold text-success">{{ metricsData?.volumeMetrics?.completeBills || 0 }}</span>
          </div>
        </div>
      </div>

      <div class="rounded-lg border border-border bg-card shadow-sm p-4">
        <h3 class="text-lg font-semibold text-foreground mb-3">Transactions</h3>
        <div class="space-y-2">
          <div class="flex justify-between items-center p-3 bg-muted rounded-md group relative">
            <div class="flex items-center gap-2">
              <span class="text-muted-foreground">Successful</span>
              <div class="hidden group-hover:block absolute z-10 bottom-full left-0 mb-2 w-48 bg-popover text-popover-foreground text-xs rounded-md p-2 shadow-md border border-border whitespace-normal">
                Payment transactions that completed successfully
              </div>
              <span class="cursor-help text-muted-foreground hover:text-success transition-colors">
                <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"/></svg>
              </span>
            </div>
            <span class="text-lg font-semibold text-success">{{ metricsData?.transactionMetrics?.successfulTransactions || 0 }}</span>
          </div>
          <div class="flex justify-between items-center p-3 bg-muted rounded-md group relative">
            <div class="flex items-center gap-2">
              <span class="text-muted-foreground">Failed</span>
              <div class="hidden group-hover:block absolute z-10 bottom-full left-0 mb-2 w-48 bg-popover text-popover-foreground text-xs rounded-md p-2 shadow-md border border-border whitespace-normal">
                Transactions that failed to process successfully
              </div>
              <span class="cursor-help text-muted-foreground hover:text-destructive transition-colors">
                <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"/></svg>
              </span>
            </div>
            <span class="text-lg font-semibold text-destructive">{{ metricsData?.transactionMetrics?.failedTransactions || 0 }}</span>
          </div>
          <div class="flex justify-between items-center p-3 bg-muted rounded-md group relative">
            <div class="flex items-center gap-2">
              <span class="text-muted-foreground">Pending</span>
              <div class="hidden group-hover:block absolute z-10 bottom-full left-0 mb-2 w-48 bg-popover text-popover-foreground text-xs rounded-md p-2 shadow-md border border-border whitespace-normal">
                Transactions waiting to be processed
              </div>
              <span class="cursor-help text-muted-foreground hover:text-warning transition-colors">
                <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"/></svg>
              </span>
            </div>
            <span class="text-lg font-semibold text-warning">{{ metricsData?.transactionMetrics?.pendingTransactions || 0 }}</span>
          </div>
          <div class="flex justify-between items-center p-3 bg-muted rounded-md group relative">
            <div class="flex items-center gap-2">
              <span class="text-muted-foreground">Total Amount</span>
              <div class="hidden group-hover:block absolute z-10 bottom-full left-0 mb-2 w-48 bg-popover text-popover-foreground text-xs rounded-md p-2 shadow-md border border-border whitespace-normal">
                Sum of all successful transaction amounts
              </div>
              <span class="cursor-help text-muted-foreground hover:text-primary transition-colors">
                <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"/></svg>
              </span>
            </div>
            <span class="text-lg font-semibold text-primary">${{ metricsData?.transactionMetrics?.totalTransactionAmount?.toFixed(2) || '0.00' }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Discount Metrics -->
    <div class="rounded-lg border border-border bg-card shadow-sm p-4">
      <h3 class="text-lg font-semibold text-foreground mb-3">Discounts & Vouchers</h3>
      <div class="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div class="p-3 bg-muted rounded-md group relative">
          <div class="flex items-center gap-2 mb-1">
            <p class="text-sm text-muted-foreground">Total Discount Amount</p>
            <div class="hidden group-hover:block absolute z-10 bottom-full left-0 mb-2 w-48 bg-popover text-popover-foreground text-xs rounded-md p-2 shadow-md border border-border whitespace-normal">
              Sum of all active discount amounts from analysis and profile discounts
            </div>
            <span class="cursor-help text-muted-foreground hover:text-primary transition-colors">
              <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"/></svg>
            </span>
          </div>
          <p class="text-xl font-bold text-primary">${{ metricsData?.discountMetrics?.totalDiscountAmount?.toFixed(2) || '0.00' }}</p>
        </div>
        <div class="p-3 bg-muted rounded-md group relative">
          <div class="flex items-center gap-2 mb-1">
            <p class="text-sm text-muted-foreground">Active Vouchers</p>
            <div class="hidden group-hover:block absolute z-10 bottom-full left-0 mb-2 w-48 bg-popover text-popover-foreground text-xs rounded-md p-2 shadow-md border border-border whitespace-normal">
              Vouchers that still have usage limit remaining or unlimited usage
            </div>
            <span class="cursor-help text-muted-foreground hover:text-success transition-colors">
              <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"/></svg>
            </span>
          </div>
          <p class="text-xl font-bold text-success">{{ metricsData?.discountMetrics?.activeVouchers || 0 }}</p>
        </div>
        <div class="p-3 bg-muted rounded-md group relative">
          <div class="flex items-center gap-2 mb-1">
            <p class="text-sm text-muted-foreground">Total Vouchers</p>
            <div class="hidden group-hover:block absolute z-10 bottom-full left-0 mb-2 w-48 bg-popover text-popover-foreground text-xs rounded-md p-2 shadow-md border border-border whitespace-normal">
              Total number of vouchers created in the system
            </div>
            <span class="cursor-help text-muted-foreground hover:text-accent transition-colors">
              <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"/></svg>
            </span>
          </div>
          <p class="text-xl font-bold text-accent">{{ metricsData?.discountMetrics?.totalVouchers || 0 }}</p>
        </div>
        <div class="p-3 bg-muted rounded-md group relative">
          <div class="flex items-center gap-2 mb-1">
            <p class="text-sm text-muted-foreground">Redemption Rate</p>
            <div class="hidden group-hover:block absolute z-10 bottom-full left-0 mb-2 w-48 bg-popover text-popover-foreground text-xs rounded-md p-2 shadow-md border border-border whitespace-normal">
              Percentage of voucher usage limit that has been redeemed
            </div>
            <span class="cursor-help text-muted-foreground hover:text-warning transition-colors">
              <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"/></svg>
            </span>
          </div>
          <p class="text-xl font-bold text-warning">{{ metricsData?.discountMetrics?.voucherRedemptionRate?.toFixed(1) || '0' }}%</p>
        </div>
        <div class="p-3 bg-muted rounded-md group relative">
          <div class="flex items-center gap-2 mb-1">
            <p class="text-sm text-muted-foreground">Available Usage</p>
            <div class="hidden group-hover:block absolute z-10 bottom-full right-0 mb-2 w-48 bg-popover text-popover-foreground text-xs rounded-md p-2 shadow-md border border-border whitespace-normal">
              Count of vouchers with remaining usage availability
            </div>
            <span class="cursor-help text-muted-foreground hover:text-accent transition-colors">
              <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"/></svg>
            </span>
          </div>
          <p class="text-xl font-bold text-accent">{{ metricsData?.discountMetrics?.vouchersWithAvailableUsage || 0 }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, computed } from "vue";
import { useQuery } from "@urql/vue";
import { GetBillingOverviewMetricsDocument } from "@/graphql/operations/billing.queries";
import StatCard from "@/components/ui/StatCard.vue";

const metricsData = ref<any>(null);
const selectedPeriod = ref<string>('this-month');
const customStartDate = ref<string>('');
const customEndDate = ref<string>('');

interface DateRange {
  startDate: Date | null;
  endDate: Date | null;
}

const dateRange = computed<DateRange>(() => {
  // Handle custom date range
  if (selectedPeriod.value === 'custom') {
    const startDate = customStartDate.value ? new Date(customStartDate.value) : null;
    const endDate = customEndDate.value ? new Date(customEndDate.value) : null;
    return { startDate, endDate };
  }

  const today = new Date();
  let startDate: Date | null;
  let endDate: Date | null = new Date(today);

  switch (selectedPeriod.value) {
    case 'this-month':
      startDate = new Date(today.getFullYear(), today.getMonth(), 1);
      endDate = new Date(today.getFullYear(), today.getMonth() + 1, 0);
      break;
    case 'last-month':
      startDate = new Date(today.getFullYear(), today.getMonth() - 1, 1);
      endDate = new Date(today.getFullYear(), today.getMonth(), 0);
      break;
    case 'this-quarter':
      const quarter = Math.floor(today.getMonth() / 3);
      startDate = new Date(today.getFullYear(), quarter * 3, 1);
      endDate = new Date(today.getFullYear(), (quarter + 1) * 3, 0);
      break;
    case 'this-year':
      startDate = new Date(today.getFullYear(), 0, 1);
      endDate = new Date(today.getFullYear(), 11, 31);
      break;
    default: // 'all-time'
      return { startDate: null, endDate: null };
  }

  return { startDate, endDate };
});

const { data, fetching, executeQuery } = useQuery({
  query: GetBillingOverviewMetricsDocument,
  variables: computed(() => {
    if (selectedPeriod.value === 'all-time') {
      return { startDate: null, endDate: null };
    }
    return {
      startDate: dateRange.value.startDate?.toISOString(),
      endDate: dateRange.value.endDate?.toISOString(),
    };
  }),
});

// Refetch on component mount to ensure fresh data
onMounted(() => {
  executeQuery({ requestPolicy: 'network-only' });
});

// Refetch when date range changes
watch(
  () => selectedPeriod.value,
  () => {
    executeQuery({ requestPolicy: 'network-only' });
  }
);

// Watch for changes in data
watch(
  () => data.value?.billingOverviewMetrics,
  (metrics: any) => {
    if (metrics) {
      metricsData.value = metrics;
    }
  },
  { deep: true }
);

// Helper function to format dates
const formatDate = (date: Date | null): string => {
  if (!date) return '';
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  };
  return date.toLocaleDateString('en-US', options);
};

// Handle period selection
const selectPeriod = (period: string) => {
  selectedPeriod.value = period;
};

// Apply custom date range and fetch metrics
const applyCustomRange = () => {
  // Only apply if both dates are selected
  if (customStartDate.value && customEndDate.value) {
    executeQuery({ requestPolicy: 'network-only' });
  }
};
</script>
