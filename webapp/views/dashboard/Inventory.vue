<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";
import useApiUtil from "@/composables/api_util";
import {
  GetInventoryKpisDocument,
  GetInventoryKpisQuery,
  GetInventoryKpisQueryVariables,
} from "@/graphql/operations/inventory.queries";
import { InventoryKpiType } from "@/types/gql";

const { withClientQuery } = useApiUtil();

const loading = ref(false);
const error = ref<string | null>(null);
const kpis = ref<InventoryKpiType[]>([]);

const filterText = ref("");
const showLowStock = ref(false);
const showReorderNow = ref(false);
const limit = ref("100");

const filteredKpis = computed(() => {
  let items = kpis.value;
  if (showReorderNow.value) {
    items = items.filter(item => item.reorderNow);
  } else if (showLowStock.value) {
    items = items.filter(item => item.lowStock || item.reorderNow);
  }
  return items;
});

const exportCsv = () => {
  if (filteredKpis.value.length === 0) {
    return;
  }

  const headers = [
    "product_name",
    "current_stock",
    "minimum_level",
    "maximum_level",
    "reorder_point",
    "reorder_quantity",
    "low_stock",
    "reorder_now",
  ];

  const lines = [headers.join(",")];

  filteredKpis.value.forEach(item => {
    const row = [
      item.productName,
      item.currentStock,
      item.minimumLevel,
      item.maximumLevel,
      item.reorderPoint,
      item.reorderQuantity,
      item.lowStock,
      item.reorderNow,
    ].map(value => `"${String(value).replace(/"/g, '""')}"`);
    lines.push(row.join(","));
  });

  const blob = new Blob([lines.join("\n")], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = `inventory-kpis-${new Date().toISOString().slice(0, 10)}.csv`;
  link.click();
  URL.revokeObjectURL(link.href);
};

const fetchKpis = async () => {
  loading.value = true;
  error.value = null;
  try {
    const result = await withClientQuery<GetInventoryKpisQuery, GetInventoryKpisQueryVariables>(
      GetInventoryKpisDocument,
      {
        text: filterText.value || undefined,
        limit: limit.value === "all" ? undefined : Number(limit.value),
      },
      "inventoryKpis",
      "network-only"
    );

    if (Array.isArray(result)) {
      kpis.value = result as InventoryKpiType[];
    } else {
      kpis.value = [];
      error.value = "Invalid inventory KPI data received";
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to load inventory KPIs";
    error.value = message;
  } finally {
    loading.value = false;
  }
};

let fetchTimer: ReturnType<typeof setTimeout> | null = null;
watch([filterText, limit], () => {
  if (fetchTimer) {
    clearTimeout(fetchTimer);
  }
  fetchTimer = setTimeout(() => {
    fetchKpis();
  }, 300);
});

watch([showLowStock, showReorderNow], () => {
  if (showReorderNow.value) {
    showLowStock.value = false;
  }
});

onMounted(() => {
  fetchKpis();
});
</script>

<template>
  <div class="mt-4 space-y-4">
    <div class="flex flex-wrap items-center gap-3">
      <div class="flex items-center gap-2">
        <label class="text-sm font-medium text-foreground">Search</label>
        <input
          v-model="filterText"
          type="text"
          placeholder="Product name"
          class="px-3 py-2 border border-input bg-background text-foreground rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
        />
      </div>
      <div class="flex items-center gap-2">
        <label class="text-sm font-medium text-foreground">Limit</label>
        <select
          v-model="limit"
          class="px-3 py-2 border border-input bg-background text-foreground rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
        >
          <option value="50">50</option>
          <option value="100">100</option>
          <option value="200">200</option>
          <option value="all">All</option>
        </select>
      </div>
      <label class="flex items-center gap-2 text-sm text-foreground">
        <input v-model="showLowStock" type="checkbox" class="h-4 w-4" />
        Low stock
      </label>
      <label class="flex items-center gap-2 text-sm text-foreground">
        <input v-model="showReorderNow" type="checkbox" class="h-4 w-4" />
        Reorder now
      </label>
      <button
        type="button"
        class="ml-auto px-3 py-2 text-sm font-medium rounded-lg border border-input bg-background text-foreground hover:bg-muted transition-colors focus:outline-none focus:ring-2 focus:ring-ring"
        :disabled="filteredKpis.length === 0"
        @click="exportCsv"
      >
        Export CSV
      </button>
    </div>

    <div v-if="loading" class="text-start my-4">
      <beak-loader message="Fetching inventory KPIs..." />
    </div>
    <div v-else-if="error" class="text-sm text-destructive">
      {{ error }}
    </div>

    <div v-else class="overflow-x-auto border border-border rounded-lg">
      <table class="min-w-full divide-y divide-border beak-table">
        <thead class="bg-muted">
          <tr>
            <th class="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">Product</th>
            <th class="px-4 py-3 text-right text-xs font-semibold text-muted-foreground">Current</th>
            <th class="px-4 py-3 text-right text-xs font-semibold text-muted-foreground">Min</th>
            <th class="px-4 py-3 text-right text-xs font-semibold text-muted-foreground">Max</th>
            <th class="px-4 py-3 text-right text-xs font-semibold text-muted-foreground">Reorder Point</th>
            <th class="px-4 py-3 text-right text-xs font-semibold text-muted-foreground">ROQ</th>
            <th class="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">Status</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-border">
          <tr v-for="item in filteredKpis" :key="item.productUid">
            <td class="px-4 py-3 text-sm text-foreground">{{ item.productName }}</td>
            <td class="px-4 py-3 text-sm text-right text-foreground">{{ item.currentStock }}</td>
            <td class="px-4 py-3 text-sm text-right text-foreground">{{ item.minimumLevel }}</td>
            <td class="px-4 py-3 text-sm text-right text-foreground">{{ item.maximumLevel }}</td>
            <td class="px-4 py-3 text-sm text-right text-foreground">{{ item.reorderPoint }}</td>
            <td class="px-4 py-3 text-sm text-right text-foreground">{{ item.reorderQuantity }}</td>
            <td class="px-4 py-3 text-sm">
              <span
                v-if="item.reorderNow"
                class="inline-flex items-center rounded-full bg-destructive/10 text-destructive px-2 py-0.5 text-xs font-semibold"
              >
                Reorder now
              </span>
              <span
                v-else-if="item.lowStock"
                class="inline-flex items-center rounded-full bg-warning/10 text-warning px-2 py-0.5 text-xs font-semibold"
              >
                Low stock
              </span>
              <span
                v-else
                class="inline-flex items-center rounded-full bg-emerald-50 text-emerald-600 px-2 py-0.5 text-xs font-semibold"
              >
                OK
              </span>
            </td>
          </tr>
          <tr v-if="filteredKpis.length === 0">
            <td colspan="7" class="px-4 py-6 text-center text-sm text-muted-foreground">
              No KPI records found.
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
