<template>
  <div class="p-6">
    <div class="mb-6">
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 class="text-2xl font-semibold text-gray-900 mb-2">Billing Overview</h2>
          <p class="text-gray-600">Comprehensive overview of billing metrics and statistics</p>
        </div>
      </div>
    </div>

    <!-- Date Range Filters -->
    <div class="bg-white rounded-lg shadow p-4 mb-6">
      <div class="flex flex-col gap-4">
        <!-- Preset Period Buttons -->
        <div class="flex flex-wrap gap-2">
          <button
            @click="selectPeriod('this-month')"
            :class="[
              'px-4 py-2 rounded-lg font-medium transition-colors',
              selectedPeriod === 'this-month'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            ]"
          >
            This Month
          </button>
          <button
            @click="selectPeriod('last-month')"
            :class="[
              'px-4 py-2 rounded-lg font-medium transition-colors',
              selectedPeriod === 'last-month'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            ]"
          >
            Last Month
          </button>
          <button
            @click="selectPeriod('this-quarter')"
            :class="[
              'px-4 py-2 rounded-lg font-medium transition-colors',
              selectedPeriod === 'this-quarter'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            ]"
          >
            This Quarter
          </button>
          <button
            @click="selectPeriod('this-year')"
            :class="[
              'px-4 py-2 rounded-lg font-medium transition-colors',
              selectedPeriod === 'this-year'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            ]"
          >
            This Year
          </button>
          <button
            @click="selectPeriod('all-time')"
            :class="[
              'px-4 py-2 rounded-lg font-medium transition-colors',
              selectedPeriod === 'all-time'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            ]"
          >
            All Time
          </button>
          <button
            @click="selectPeriod('custom')"
            :class="[
              'px-4 py-2 rounded-lg font-medium transition-colors',
              selectedPeriod === 'custom'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            ]"
          >
            Custom Range
          </button>
        </div>

        <!-- Custom Date Range Picker -->
        <div v-if="selectedPeriod === 'custom'" class="flex flex-col sm:flex-row gap-4 pt-4 border-t">
          <div class="flex-1">
            <label class="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
            <input
              v-model="customStartDate"
              type="date"
              @change="applyCustomRange"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div class="flex-1">
            <label class="block text-sm font-medium text-gray-700 mb-1">End Date</label>
            <input
              v-model="customEndDate"
              type="date"
              @change="applyCustomRange"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <!-- Date Range Display -->
        <div v-if="selectedPeriod === 'all-time'" class="text-xs text-gray-500">
          Showing metrics for all time
        </div>
        <div v-else class="text-xs text-gray-500">
          From {{ formatDate(dateRange.startDate) }} to {{ formatDate(dateRange.endDate) }}
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="fetching" class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <div class="bg-white rounded-lg shadow p-4 animate-pulse">
        <div class="h-4 bg-gray-200 rounded mb-2 w-3/4"></div>
        <div class="h-8 bg-gray-200 rounded"></div>
      </div>
      <div class="bg-white rounded-lg shadow p-4 animate-pulse">
        <div class="h-4 bg-gray-200 rounded mb-2 w-3/4"></div>
        <div class="h-8 bg-gray-200 rounded"></div>
      </div>
      <div class="bg-white rounded-lg shadow p-4 animate-pulse">
        <div class="h-4 bg-gray-200 rounded mb-2 w-3/4"></div>
        <div class="h-8 bg-gray-200 rounded"></div>
      </div>
      <div class="bg-white rounded-lg shadow p-4 animate-pulse">
        <div class="h-4 bg-gray-200 rounded mb-2 w-3/4"></div>
        <div class="h-8 bg-gray-200 rounded"></div>
      </div>
    </div>

    <!-- Key Metrics -->
    <div v-else class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <div class="bg-white rounded-lg shadow p-4 border-l-4 border-blue-500">
        <div class="flex items-center justify-between mb-2">
          <p class="text-sm text-gray-600">Total Charged</p>
          <div class="group relative inline-block">
            <span class="cursor-help text-gray-400 hover:text-blue-500 transition-colors">
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"/></svg>
            </span>
            <div class="hidden group-hover:block absolute z-10 bottom-full left-0 mb-2 w-48 bg-gray-900 text-white text-xs rounded-lg p-2 shadow-lg">
              Sum of all amounts billed to customers across all bills
            </div>
          </div>
        </div>
        <p class="text-3xl font-bold text-gray-900">${{ metricsData?.keyMetrics?.totalCharged?.toFixed(2) || '0.00' }}</p>
      </div>
      <div class="bg-white rounded-lg shadow p-4 border-l-4 border-green-500">
        <div class="flex items-center justify-between mb-2">
          <p class="text-sm text-gray-600">Total Paid</p>
          <div class="group relative inline-block">
            <span class="cursor-help text-gray-400 hover:text-green-500 transition-colors">
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"/></svg>
            </span>
            <div class="hidden group-hover:block absolute z-10 bottom-full left-0 mb-2 w-48 bg-gray-900 text-white text-xs rounded-lg p-2 shadow-lg">
              Total amount received from customers in successful transactions
            </div>
          </div>
        </div>
        <p class="text-3xl font-bold text-green-600">${{ metricsData?.keyMetrics?.totalPaid?.toFixed(2) || '0.00' }}</p>
      </div>
      <div class="bg-white rounded-lg shadow p-4 border-l-4 border-yellow-500">
        <div class="flex items-center justify-between mb-2">
          <p class="text-sm text-gray-600">Outstanding Balance</p>
          <div class="group relative inline-block">
            <span class="cursor-help text-gray-400 hover:text-yellow-500 transition-colors">
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"/></svg>
            </span>
            <div class="hidden group-hover:block absolute z-10 bottom-full left-0 mb-2 w-48 bg-gray-900 text-white text-xs rounded-lg p-2 shadow-lg">
              Amount still owed by customers (Total Charged - Total Paid)
            </div>
          </div>
        </div>
        <p class="text-3xl font-bold text-yellow-600">${{ metricsData?.keyMetrics?.outstandingBalance?.toFixed(2) || '0.00' }}</p>
      </div>
      <div class="bg-white rounded-lg shadow p-4 border-l-4 border-purple-500">
        <div class="flex items-center justify-between mb-2">
          <p class="text-sm text-gray-600">Collection Rate</p>
          <div class="group relative inline-block">
            <span class="cursor-help text-gray-400 hover:text-purple-500 transition-colors">
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"/></svg>
            </span>
            <div class="hidden group-hover:block absolute z-10 bottom-full right-0 mb-2 w-48 bg-gray-900 text-white text-xs rounded-lg p-2 shadow-lg">
              Percentage of billed amounts that have been paid (Total Paid / Total Charged)
            </div>
          </div>
        </div>
        <p class="text-3xl font-bold text-purple-600">{{ metricsData?.keyMetrics?.collectionRate?.toFixed(1) || '0' }}%</p>
      </div>
    </div>

    <!-- Volume Metrics -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
      <div class="bg-white rounded-lg shadow p-6">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Bill Volume</h3>
        <div class="space-y-3">
          <div class="flex justify-between items-center p-3 bg-gray-50 rounded group relative">
            <div class="flex items-center gap-2">
              <span class="text-gray-600">Active Bills</span>
              <div class="hidden group-hover:block absolute z-10 bottom-full left-0 mb-2 w-48 bg-gray-900 text-white text-xs rounded-lg p-2 shadow-lg whitespace-normal">
                Bills currently in use and being processed
              </div>
              <span class="cursor-help text-gray-400 hover:text-blue-500 transition-colors">
                <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"/></svg>
              </span>
            </div>
            <span class="text-lg font-semibold text-blue-600">{{ metricsData?.volumeMetrics?.activeBills || 0 }}</span>
          </div>
          <div class="flex justify-between items-center p-3 bg-gray-50 rounded group relative">
            <div class="flex items-center gap-2">
              <span class="text-gray-600">Inactive Bills</span>
              <div class="hidden group-hover:block absolute z-10 bottom-full left-0 mb-2 w-48 bg-gray-900 text-white text-xs rounded-lg p-2 shadow-lg whitespace-normal">
                Bills that have been deactivated or archived
              </div>
              <span class="cursor-help text-gray-400 hover:text-gray-500 transition-colors">
                <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"/></svg>
              </span>
            </div>
            <span class="text-lg font-semibold text-gray-600">{{ metricsData?.volumeMetrics?.inactiveBills || 0 }}</span>
          </div>
          <div class="flex justify-between items-center p-3 bg-gray-50 rounded group relative">
            <div class="flex items-center gap-2">
              <span class="text-gray-600">Pending Confirmation</span>
              <div class="hidden group-hover:block absolute z-10 bottom-full left-0 mb-2 w-48 bg-gray-900 text-white text-xs rounded-lg p-2 shadow-lg whitespace-normal">
                Bills awaiting confirmation before final processing
              </div>
              <span class="cursor-help text-gray-400 hover:text-orange-500 transition-colors">
                <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"/></svg>
              </span>
            </div>
            <span class="text-lg font-semibold text-orange-600">{{ metricsData?.volumeMetrics?.pendingConfirmation || 0 }}</span>
          </div>
          <div class="flex justify-between items-center p-3 bg-gray-50 rounded group relative">
            <div class="flex items-center gap-2">
              <span class="text-gray-600">Partial Bills</span>
              <div class="hidden group-hover:block absolute z-10 bottom-full left-0 mb-2 w-48 bg-gray-900 text-white text-xs rounded-lg p-2 shadow-lg whitespace-normal">
                Bills with partial payments or incomplete transactions
              </div>
              <span class="cursor-help text-gray-400 hover:text-red-500 transition-colors">
                <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"/></svg>
              </span>
            </div>
            <span class="text-lg font-semibold text-red-600">{{ metricsData?.volumeMetrics?.partialBills || 0 }}</span>
          </div>
          <div class="flex justify-between items-center p-3 bg-gray-50 rounded group relative">
            <div class="flex items-center gap-2">
              <span class="text-gray-600">Complete Bills</span>
              <div class="hidden group-hover:block absolute z-10 bottom-full left-0 mb-2 w-48 bg-gray-900 text-white text-xs rounded-lg p-2 shadow-lg whitespace-normal">
                Bills that are fully processed and not partial
              </div>
              <span class="cursor-help text-gray-400 hover:text-green-500 transition-colors">
                <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"/></svg>
              </span>
            </div>
            <span class="text-lg font-semibold text-green-600">{{ metricsData?.volumeMetrics?.completeBills || 0 }}</span>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow p-6">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Transactions</h3>
        <div class="space-y-3">
          <div class="flex justify-between items-center p-3 bg-gray-50 rounded group relative">
            <div class="flex items-center gap-2">
              <span class="text-gray-600">Successful</span>
              <div class="hidden group-hover:block absolute z-10 bottom-full left-0 mb-2 w-48 bg-gray-900 text-white text-xs rounded-lg p-2 shadow-lg whitespace-normal">
                Payment transactions that completed successfully
              </div>
              <span class="cursor-help text-gray-400 hover:text-green-500 transition-colors">
                <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"/></svg>
              </span>
            </div>
            <span class="text-lg font-semibold text-green-600">{{ metricsData?.transactionMetrics?.successfulTransactions || 0 }}</span>
          </div>
          <div class="flex justify-between items-center p-3 bg-gray-50 rounded group relative">
            <div class="flex items-center gap-2">
              <span class="text-gray-600">Failed</span>
              <div class="hidden group-hover:block absolute z-10 bottom-full left-0 mb-2 w-48 bg-gray-900 text-white text-xs rounded-lg p-2 shadow-lg whitespace-normal">
                Transactions that failed to process successfully
              </div>
              <span class="cursor-help text-gray-400 hover:text-red-500 transition-colors">
                <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"/></svg>
              </span>
            </div>
            <span class="text-lg font-semibold text-red-600">{{ metricsData?.transactionMetrics?.failedTransactions || 0 }}</span>
          </div>
          <div class="flex justify-between items-center p-3 bg-gray-50 rounded group relative">
            <div class="flex items-center gap-2">
              <span class="text-gray-600">Pending</span>
              <div class="hidden group-hover:block absolute z-10 bottom-full left-0 mb-2 w-48 bg-gray-900 text-white text-xs rounded-lg p-2 shadow-lg whitespace-normal">
                Transactions waiting to be processed
              </div>
              <span class="cursor-help text-gray-400 hover:text-orange-500 transition-colors">
                <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"/></svg>
              </span>
            </div>
            <span class="text-lg font-semibold text-orange-600">{{ metricsData?.transactionMetrics?.pendingTransactions || 0 }}</span>
          </div>
          <div class="flex justify-between items-center p-3 bg-gray-50 rounded group relative">
            <div class="flex items-center gap-2">
              <span class="text-gray-600">Total Amount</span>
              <div class="hidden group-hover:block absolute z-10 bottom-full left-0 mb-2 w-48 bg-gray-900 text-white text-xs rounded-lg p-2 shadow-lg whitespace-normal">
                Sum of all successful transaction amounts
              </div>
              <span class="cursor-help text-gray-400 hover:text-blue-500 transition-colors">
                <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"/></svg>
              </span>
            </div>
            <span class="text-lg font-semibold text-blue-600">${{ metricsData?.transactionMetrics?.totalTransactionAmount?.toFixed(2) || '0.00' }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Discount Metrics -->
    <div class="bg-white rounded-lg shadow p-6">
      <h3 class="text-lg font-semibold text-gray-900 mb-4">Discounts & Vouchers</h3>
      <div class="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div class="p-3 bg-gray-50 rounded group relative">
          <div class="flex items-center gap-2 mb-1">
            <p class="text-sm text-gray-600">Total Discount Amount</p>
            <div class="hidden group-hover:block absolute z-10 bottom-full left-0 mb-2 w-48 bg-gray-900 text-white text-xs rounded-lg p-2 shadow-lg whitespace-normal">
              Sum of all active discount amounts from analysis and profile discounts
            </div>
            <span class="cursor-help text-gray-400 hover:text-blue-500 transition-colors">
              <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"/></svg>
            </span>
          </div>
          <p class="text-xl font-bold text-blue-600">${{ metricsData?.discountMetrics?.totalDiscountAmount?.toFixed(2) || '0.00' }}</p>
        </div>
        <div class="p-3 bg-gray-50 rounded group relative">
          <div class="flex items-center gap-2 mb-1">
            <p class="text-sm text-gray-600">Active Vouchers</p>
            <div class="hidden group-hover:block absolute z-10 bottom-full left-0 mb-2 w-48 bg-gray-900 text-white text-xs rounded-lg p-2 shadow-lg whitespace-normal">
              Vouchers that still have usage limit remaining or unlimited usage
            </div>
            <span class="cursor-help text-gray-400 hover:text-green-500 transition-colors">
              <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"/></svg>
            </span>
          </div>
          <p class="text-xl font-bold text-green-600">{{ metricsData?.discountMetrics?.activeVouchers || 0 }}</p>
        </div>
        <div class="p-3 bg-gray-50 rounded group relative">
          <div class="flex items-center gap-2 mb-1">
            <p class="text-sm text-gray-600">Total Vouchers</p>
            <div class="hidden group-hover:block absolute z-10 bottom-full left-0 mb-2 w-48 bg-gray-900 text-white text-xs rounded-lg p-2 shadow-lg whitespace-normal">
              Total number of vouchers created in the system
            </div>
            <span class="cursor-help text-gray-400 hover:text-purple-500 transition-colors">
              <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"/></svg>
            </span>
          </div>
          <p class="text-xl font-bold text-purple-600">{{ metricsData?.discountMetrics?.totalVouchers || 0 }}</p>
        </div>
        <div class="p-3 bg-gray-50 rounded group relative">
          <div class="flex items-center gap-2 mb-1">
            <p class="text-sm text-gray-600">Redemption Rate</p>
            <div class="hidden group-hover:block absolute z-10 bottom-full left-0 mb-2 w-48 bg-gray-900 text-white text-xs rounded-lg p-2 shadow-lg whitespace-normal">
              Percentage of voucher usage limit that has been redeemed
            </div>
            <span class="cursor-help text-gray-400 hover:text-orange-500 transition-colors">
              <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"/></svg>
            </span>
          </div>
          <p class="text-xl font-bold text-orange-600">{{ metricsData?.discountMetrics?.voucherRedemptionRate?.toFixed(1) || '0' }}%</p>
        </div>
        <div class="p-3 bg-gray-50 rounded group relative">
          <div class="flex items-center gap-2 mb-1">
            <p class="text-sm text-gray-600">Available Usage</p>
            <div class="hidden group-hover:block absolute z-10 bottom-full right-0 mb-2 w-48 bg-gray-900 text-white text-xs rounded-lg p-2 shadow-lg whitespace-normal">
              Count of vouchers with remaining usage availability
            </div>
            <span class="cursor-help text-gray-400 hover:text-indigo-500 transition-colors">
              <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"/></svg>
            </span>
          </div>
          <p class="text-xl font-bold text-indigo-600">{{ metricsData?.discountMetrics?.vouchersWithAvailableUsage || 0 }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, computed } from "vue";
import { useQuery } from "@urql/vue";
import { GetBillingOverviewMetricsDocument } from "@/graphql/operations/billing.queries";

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
