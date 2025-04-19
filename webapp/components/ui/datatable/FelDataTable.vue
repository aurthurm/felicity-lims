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
  <div class="relative">
    <div
      v-if="loading"
      class="absolute bg-black bg-opacity-60 z-10 h-full w-full flex items-center justify-center"
    >
      <div class="flex items-center">
        <svg
          aria-hidden="true"
          class="w-8 h-8 mr-2 text-muted-foreground animate-spin text-foreground fill-accent"
          viewBox="0 0 100 101"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
            fill="currentColor"
          />
          <path
            d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
            fill="currentFill"
          />
        </svg>
      </div>
    </div>
    <div>
      <section class="my-2 flex justify-between items-center w-full">
        <div class="w-2/4">
          <div class="flex sm:flex-row flex-col">
            <div class="flex flex-row mb-1 sm:mb-0" v-if="filterable">
              <div class="relative flex justify-between items-center">
                <div><slot name="pre-filter"></slot></div>
                <select
                  v-model="filterStatus"
                  class="appearance-none h-full rounded-l-sm border block w-full bg-background border-border text-foreground py-2 px-4 pr-8 leading-tight focus:outline-none focus:bg-background focus:border-border"
                >
                  <option
                    v-for="filterValue in filterMeta?.filters"
                    :key="filterValue.value"
                    :value="filterValue.value"
                  >
                    {{ toCapitalize(filterValue?.name) }}
                  </option>
                </select>
                <div
                  class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-foreground"
                >
                  <svg
                    class="fill-current h-4 w-4"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                  >
                    <path
                      d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"
                    />
                  </svg>
                </div>
              </div>
            </div>
            <div class="block relative" v-if="searchable">
              <span class="h-full absolute inset-y-0 left-0 flex items-center pl-2">
                <svg viewBox="0 0 24 24" class="h-4 w-4 fill-current text-muted-foreground">
                  <path
                    d="M10 4a6 6 0 100 12 6 6 0 000-12zm-8 6a8 8 0 1114.32 4.906l5.387 5.387a1 1 0 01-1.414 1.414l-5.387-5.387A8 8 0 012 10z"
                  ></path>
                </svg>
              </span>
              <input
                placeholder="Search ..."
                v-model="filterText"
                class="appearance-none rounded-r-sm rounded-l-sm sm:rounded-l-none border border-border border-b block pl-8 pr-6 py-2 w-full bg-background text-sm placeholder-muted-foreground text-foreground focus:bg-background focus:placeholder-foreground focus:text-foreground focus:outline-none"
                @keyup="searchKeyUp()"
                @focus="searchFocus()"
              />
            </div>
            <button
              @click.prevent="searchEntries()"
              class="px-2 py-1 ml-2 border-primary border text-sky-800rounded-smtransition duration-300 hover:bg-primary hover:text-primary-foreground focus:outline-none"
              v-if="searchable || filterable">
              Search
            </button>
          </div>
        </div>

        <div>
          <div v-if="toggleColumns" class="flex justify-between items-center">
            <div>
              <div v-show="openColumns">
                <button
                  v-for="(column, columnIdx) in defaultColumns"
                  :key="columnIdx"
                  class="inline-flex items-center px-2 py-1 mr-2 text-sm font-medium rounded border"
                  :class="[
                    {
                      'text-muted-foreground bg-secondary border-border': column.hidden,
                      'text-primary bg-secondary border-primary': !column.hidden,
                      hidden: !(column.showInToggler ?? true),
                    },
                  ]"
                  @click="toggleColumn(columnIdx)"
                >
                  <svg
                    v-show="!column.hidden"
                    aria-hidden="true"
                    class="w-3 h-3"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clip-rule="evenodd"
                    ></path>
                  </svg>
                  <span class="ml-1">{{ column.name }}</span>
                </button>
              </div>
            </div>
            <button
              class="ml-4 text-xl font-semibold text-primary"
              @click="openColumns = !openColumns"
              v-tooltip="'manage table columns'"
            >
              <font-awesome-icon icon="fa-ellipsis"></font-awesome-icon>
            </button>
          </div>
        </div>
      </section>

      <hr class="mb-4" />

      <table class="min-w-full">
        <thead>
          <tr>
            <th
              v-if="selectable"
              class="px-1 py-1 border-b-2 border-border text-left leading-4 text-foreground tracking-wider"
            >
              <input type="checkbox" :checked="allChecked" @click="(e) => checkAll(e)" />
            </th>
            <th
              v-for="(column, columnIdx) in defaultColumns.filter((c) => !c.hidden)"
              :key="columnIdx"
              class="px-1 py-1 border-b-2 border-border text-left leading-4 text-foreground tracking-wider"
            >
              <div class="flex items-center cursor-pointer" @click="setSorting(column)">
                <span class="mr-1">{{ column.name }}</span>
                <span class="font-thin text-sm" v-if="column.sortable">
                  <font-awesome-icon
                    v-if="!isSorter(column)"
                    icon="fa-sort"
                    class="text-muted-foreground"
                  />
                  <font-awesome-icon
                    v-else-if="sorting?.sortBy === 'asc'"
                    icon="fa-solid fa-arrow-up-wide-short"
                    class="text-foreground"
                  />
                  <font-awesome-icon
                    v-else
                    icon="fa-solid fa-arrow-down-wide-short"
                    class="text-foreground"
                  />
                </span>
              </div>
            </th>
          </tr>
        </thead>
        <tbody class="bg-background">
          <tr v-for="(entry, entryIdx) in entries" :key="entryIdx">
            <td
              v-if="selectable"
              class="px-1 py-1 whitespace-no-wrap border-b border-border"
            >
              <input
                type="checkbox"
                :checked="entry.checked"
                @click="(e) => check(entry, e)"
              />
            </td>
            <td
              v-for="(column, columnIdx) in defaultColumns.filter((c) => !c.hidden)"
              :key="`${entryIdx}_${columnIdx}`"
              class="px-1 py-1 whitespace-no-wrap border-b border-border"
            >
              <span v-if="column.customRender && column">
                <component :is="getValue(entry, column)" />
              </span>
              <span v-else>{{ getValue(entry, column) }}</span>
            </td>
          </tr>
        </tbody>
      </table>

      <section class="flex justify-between my-4">
        <div><slot name="footer"></slot></div>
        <div v-if="paginable" class="flex sm:flex-row flex-col">
          <div>
            <button
              v-show="pageMeta?.hasNextPage"
              class="px-2 py-1 mr-2 border-primary border text-sky-800rounded-smtransition duration-300 hover:bg-primary hover:text-primary-foreground focus:outline-none"
              @click.prevent="paginate"
            >
              Show More
            </button>
          </div>
          <div>
            <div class="flex flex-row mb-1 sm:mb-0">
              <div class="relative">
                <select
                  class="appearance-none h-full rounded-l-sm border block w-full bg-background border-border text-foreground py-2 px-4 pr-8 leading-tight focus:outline-none focus:bg-background focus:border-border"
                  v-model.number="fetchCount"
                  :disabled="!pageMeta?.hasNextPage"
                >
                  <option value="25">25</option>
                  <option value="50">50</option>
                  <option value="100">100</option>
                  <option value="250">250</option>
                  <option value="500">500</option>
                  <option value="1000">1000</option>
                  <option value="5000">5000</option>
                  <option value="10000">10000</option>
                </select>
                <div
                  class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-foreground"
                >
                  <svg
                    class="fill-current h-4 w-4"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                  >
                    <path
                      d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>
          <div class="block relative">
            <input
              :placeholder="pageMeta?.countNone"
              class="appearance-none rounded-r-sm rounded-l-sm sm:rounded-l-none border border-border border-b block pl-8 pr-6 py-2 w-full bg-background text-sm placeholder-muted-foreground text-foreground focus:bg-background focus:placeholder-foreground focus:text-foreground focus:outline-none"
              disabled
            />
          </div>
        </div>
      </section>
    </div>
  </div>
</template>
