<script setup lang="ts">
import { ref, toRef, reactive } from "vue";

interface IDataTableColumns {
  name: string;
  value: string;
  sortable: boolean;
  sortBy?: string;
  defaultSort?: boolean;
  showInToggler?: boolean;
  hidden: boolean;
  customRender?: Function;
  customrenderType?: string;
}

interface DataTablePagination {
  hasNextPage?: boolean;
  fetchCount?: number;
  countNone?: string;
}

interface DataTableSearch {
  filters: Array<{ name: string; value: string }>;
  defaultFilter?: string;
}

interface DataTableProps {
  columns: IDataTableColumns[];
  data?: any[];
  toggleColumns: boolean;
  loading?: boolean;
  paginable?: boolean;
  pageMeta?: DataTablePagination;
  searchable?: boolean;
  filterable?: boolean;
  selectable?: boolean;
  filterMeta?: DataTableSearch;
  allChecked?: boolean;
}

const props = defineProps<DataTableProps>();
let defaultColumns = toRef(props, "columns");
let entries = toRef(props, "data");

// Column Toggles
const toggleColumn = (colIdx: number) => {
  const mut = defaultColumns.value[colIdx];
  defaultColumns.value[colIdx] = { ...mut, hidden: !mut.hidden };
};

// Search
const filterStatus = ref(props.filterMeta?.defaultFilter ?? "");
const filterText = ref("");
const searchEntries = () => {
  emit("onSearch", {
    sorting,
    filterStatus: filterStatus.value,
    filterText: filterText.value,
  });
};
const searchKeyUp = () => {
  emit("onSearchKeyUp", {
    sorting,
    filterStatus: filterStatus.value,
    filterText: filterText.value,
  });
};
const searchFocus = () => {
  emit("onSearchFocus", {});
};

// Pagination
const fetchCount = ref(props.pageMeta?.fetchCount ?? 50);
const paginate = () => {
  emit("onPaginate", { fetchCount, sorting, filterStatus, filterText });
};

//
const openColumns = ref(true);

// sorting
const sorting = reactive<IDataTableColumns>({} as IDataTableColumns);
const isSorter = (column: any) => sorting?.name === column?.name;
const setSorting = (column: any) => {
  if (isSorter(column)) {
    Object.assign(sorting, {
      ...column,
      sortBy: [1, "asc"].includes(sorting?.sortBy ?? "") ? "desc" : "asc",
    });
  } else {
    Object.assign(sorting, { ...column, sortBy: column?.sortBy ?? "asc" });
  }
  emit("onSort", {
    sorting,
    filterStatus: filterStatus.value,
    filterText: filterText.value,
  });
};

// Events
const emit = defineEmits([
  "onSort",
  "onPaginate",
  "onSearch",
  "onSearchKeyUp",
  "onSearchFocus",
  "onCheck",
  "onCheckAll",
  "onFetch",
]);

// checking
const checkAll = (e) => {
  emit("onCheckAll", { checked: e.target.checked });
};
const check = (entry, e) => {
  emit("onCheck", { ...entry, checked: e.target.checked });
};

// get value from nested objects
const getValue = (payload, column: IDataTableColumns) => {
  if (column?.customRender !== undefined) {
    return column.customRender(payload, column);
  }
  return column.value.split(".").reduce((acc, val) => acc?.[val], payload);
};

const toCapitalize = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};
</script>

<template>
  <div 
    class="relative bg-card rounded-lg border border-border" 
    role="region" 
    aria-label="Data Table"
  >
    <!-- Loading overlay -->
    <div
      v-if="loading"
      class="absolute bg-background/80 backdrop-blur-sm z-10 h-full w-full flex items-center justify-center rounded-lg"
      role="status"
      aria-live="polite"
    >
      <div class="flex items-center">
        <svg
          class="w-8 h-8 mr-2 text-primary animate-spin"
          viewBox="0 0 100 101"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path
            d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
            fill="currentColor"
            class="opacity-25"
          />
          <path
            d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
            fill="currentColor"
            class="opacity-75"
          />
        </svg>
        <span class="sr-only">Loading data table...</span>
      </div>
    </div>

    <!-- Table controls -->
    <div class="p-4 space-y-4">
      <section class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <!-- Search and filters -->
        <div class="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <!-- Status filter -->
          <div v-if="filterable" class="w-full sm:w-auto">
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <slot name="pre-filter"></slot>
              </div>
              <select
                v-model="filterStatus"
                class="block w-full rounded-md border border-input bg-background py-2 pl-10 pr-8 text-sm text-foreground focus-visible:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                :aria-label="'Filter by status'"
              >
                <option
                  v-for="filterValue in filterMeta?.filters"
                  :key="filterValue.value"
                  :value="filterValue.value"
                  class="bg-background text-foreground"
                >
                  {{ toCapitalize(filterValue?.name) }}
                </option>
              </select>
              <div
                class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-muted-foreground"
                aria-hidden="true"
              >
                <svg
                  class="h-4 w-4"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fill-rule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clip-rule="evenodd"
                  />
                </svg>
              </div>
            </div>
          </div>

          <!-- Search input -->
          <div v-if="searchable" class="w-full sm:w-auto">
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg
                  class="h-4 w-4 text-muted-foreground"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fill-rule="evenodd"
                    d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                    clip-rule="evenodd"
                  />
                </svg>
              </div>
              <input
                type="text"
                v-model="filterText"
                class="block w-full rounded-md border border-input bg-background py-2 pl-10 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus-visible:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                placeholder="Search..."
                @keyup="searchKeyUp"
                @focus="searchFocus"
                aria-label="Search table"
              />
            </div>
          </div>
        </div>

        <!-- Column visibility toggle -->
        <div v-if="toggleColumns" class="flex items-center gap-2">
          <button
            class="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none border border-input hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2"
            @click="openColumns = !openColumns"
            :aria-expanded="openColumns"
            aria-label="Toggle column visibility"
            id="column-menu-button"
          >
            <font-awesome-icon icon="columns" class="mr-2 h-4 w-4" aria-hidden="true" />
            Columns
          </button>
        </div>
      </section>

      <!-- Column visibility menu -->
      <div
        v-if="toggleColumns && openColumns"
        class="absolute right-4 mt-2 w-48 rounded-md border border-border bg-card p-1 text-card-foreground shadow-md z-10"
        role="menu"
        aria-orientation="vertical"
        aria-labelledby="column-menu-button"
      >
        <div
          v-for="(column, index) in columns"
          :key="column.name"
          class="flex items-center px-2 py-1.5 text-sm hover:bg-accent/50 transition-colors rounded-md"
          role="menuitem"
        >
          <input
            type="checkbox"
            :id="'column-' + index"
            :checked="!column.hidden"
            @change="toggleColumn(index)"
            class="h-4 w-4 rounded border-input text-primary focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            :aria-label="'Toggle ' + column.name + ' column'"
          />
          <label
            :for="'column-' + index"
            class="ml-2 cursor-pointer select-none"
          >
            {{ column.name }}
          </label>
        </div>
      </div>
    </div>

    <!-- Table -->
    <div class="overflow-x-auto">
      <table class="min-w-full divide-y divide-border" role="grid">
        <thead class="bg-muted/50">
          <tr>
            <th
              v-for="column in columns.filter((col) => !col.hidden)"
              :key="column.name"
              scope="col"
              class="px-4 py-3 text-left text-sm font-medium text-muted-foreground"
            >
              <button
                v-if="column.sortable"
                class="group inline-flex items-center gap-1 hover:text-card-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                @click="setSorting(column)"
                :aria-label="'Sort by ' + column.name"
                :aria-sort="isSorter(column) ? (sorting.sortBy === 'asc' ? 'ascending' : 'descending') : 'none'"
              >
                {{ column.name }}
                <svg
                  class="h-4 w-4 transition-transform"
                  :class="{
                    'rotate-180': isSorter(column) && sorting.sortBy === 'desc',
                    'opacity-0 group-hover:opacity-100': !isSorter(column)
                  }"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fill-rule="evenodd"
                    d="M5.293 7.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L6.707 7.707a1 1 0 01-1.414 0z"
                    clip-rule="evenodd"
                  />
                </svg>
              </button>
              <span v-else>{{ column.name }}</span>
            </th>
          </tr>
        </thead>
        <tbody class="divide-y divide-border bg-card">
          <tr
            v-for="(entry, index) in entries"
            :key="index"
            class="hover:bg-accent/50 transition-colors"
            role="row"
          >
            <td
              v-for="column in columns.filter((col) => !col.hidden)"
              :key="column.name"
              class="px-4 py-3 text-sm"
              :class="{
                'text-card-foreground': !column.customrenderType,
                'text-muted-foreground': column.customrenderType === 'muted'
              }"
              role="cell"
            >
              <slot
                v-if="column.customRender"
                :name="column.name"
                :entry="entry"
                :column="column"
              >
                {{ getValue(entry, column) }}
              </slot>
              <template v-else>
                {{ getValue(entry, column) }}
              </template>
            </td>
          </tr>
          <tr v-if="entries?.length === 0" role="row">
            <td
              :colspan="columns.filter((col) => !col.hidden).length"
              class="px-4 py-8 text-center text-sm text-muted-foreground"
              role="cell"
            >
              <div class="flex flex-col items-center gap-2">
                <svg
                  class="h-8 w-8 text-muted-foreground"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fill-rule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 011-1h4a1 1 0 110 2H8a1 1 0 01-1-1z"
                    clip-rule="evenodd"
                  />
                </svg>
                <p>No data available</p>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination -->
    <div
      v-if="paginable && pageMeta?.hasNextPage"
      class="px-4 py-3 border-t border-border"
    >
      <button
        class="w-full inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2"
        @click="paginate"
        :disabled="loading"
        aria-label="Load more data"
      >
        <span v-if="loading" class="flex items-center gap-2">
          <svg
            class="h-4 w-4 animate-spin"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
          >
            <circle
              class="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              stroke-width="4"
            />
            <path
              class="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          Loading...
        </span>
        <span v-else>Load More</span>
      </button>
    </div>
  </div>
</template>
