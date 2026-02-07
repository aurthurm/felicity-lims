<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";
import useApiUtil from "@/composables/api_util";
import {
  GetInventoryKpisDocument,
  GetInventoryKpisQuery,
  GetInventoryKpisQueryVariables,
} from "@/graphql/operations/inventory.queries";
import { InventoryKpiType } from "@/types/gql";
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyTitle } from "@/components/ui/empty";
import { Spinner } from "@/components/ui/spinner";

defineOptions({ name: 'InventoryView' })
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
        <Checkbox :checked="showLowStock" @update:checked="(value) => showLowStock = value" />
        Low stock
      </label>
      <label class="flex items-center gap-2 text-sm text-foreground">
        <Checkbox :checked="showReorderNow" @update:checked="(value) => showReorderNow = value" />
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
      <span class="inline-flex items-center gap-2">
        <Spinner class="size-4" />
        <span class="text-sm">Fetching inventory KPIs...</span>
      </span>
    </div>
    <div v-else-if="error" class="text-sm text-destructive">
      {{ error }}
    </div>

    <div v-else class="border border-border bg-card rounded-lg shadow-md">
      <div class="relative w-full overflow-auto">
        <Table class="w-full caption-bottom text-sm">
          <TableHeader class="[&_tr]:border-b">
            <TableRow class="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
              <TableHead class="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Product</TableHead>
              <TableHead class="h-12 px-4 text-right align-middle font-medium text-muted-foreground">Current</TableHead>
              <TableHead class="h-12 px-4 text-right align-middle font-medium text-muted-foreground">Min</TableHead>
              <TableHead class="h-12 px-4 text-right align-middle font-medium text-muted-foreground">Max</TableHead>
              <TableHead class="h-12 px-4 text-right align-middle font-medium text-muted-foreground">Reorder Point</TableHead>
              <TableHead class="h-12 px-4 text-right align-middle font-medium text-muted-foreground">ROQ</TableHead>
              <TableHead class="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody class="[&_tr:last-child]:border-0">
            <TableRow v-for="item in filteredKpis" :key="item.productUid" class="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
            <TableCell class="px-4 py-3 align-middle text-sm text-foreground">{{ item.productName }}</TableCell>
            <TableCell class="px-4 py-3 align-middle text-sm text-right text-foreground">{{ item.currentStock }}</TableCell>
            <TableCell class="px-4 py-3 align-middle text-sm text-right text-foreground">{{ item.minimumLevel }}</TableCell>
            <TableCell class="px-4 py-3 align-middle text-sm text-right text-foreground">{{ item.maximumLevel }}</TableCell>
            <TableCell class="px-4 py-3 align-middle text-sm text-right text-foreground">{{ item.reorderPoint }}</TableCell>
            <TableCell class="px-4 py-3 align-middle text-sm text-right text-foreground">{{ item.reorderQuantity }}</TableCell>
            <TableCell class="px-4 py-3 align-middle text-sm">
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
            </TableCell>
          </TableRow>
          <TableEmpty v-if="filteredKpis.length === 0" :colspan="7">
            <Empty class="border-0 bg-transparent p-0">
              <EmptyContent>
                <EmptyHeader>
                  <EmptyTitle>No KPI records</EmptyTitle>
                  <EmptyDescription>Adjust filters or check back later.</EmptyDescription>
                </EmptyHeader>
              </EmptyContent>
            </Empty>
          </TableEmpty>
        </TableBody>
      </Table>
      </div>
    </div>
  </div>
</template>
