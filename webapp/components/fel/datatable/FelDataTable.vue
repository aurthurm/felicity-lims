<script setup lang="ts">
import { reactive, ref, toRef } from "vue"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Spinner } from "@/components/ui/spinner"
import {
  Table,
  TableBody,
  TableCell,
  TableEmpty,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

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

const props = defineProps<DataTableProps>()
let defaultColumns = toRef(props, "columns")
let entries = toRef(props, "data")

// Column Toggles
const toggleColumn = (colIdx: number) => {
  const mut = defaultColumns.value[colIdx]
  defaultColumns.value[colIdx] = { ...mut, hidden: !mut.hidden }
}

// Search
const filterStatus = ref(props.filterMeta?.defaultFilter ?? "")
const filterText = ref("")
const searchEntries = () => {
  emit("onSearch", {
    sorting,
    filterStatus: filterStatus.value,
    filterText: filterText.value,
  })
}
const searchKeyUp = () => {
  emit("onSearchKeyUp", {
    sorting,
    filterStatus: filterStatus.value,
    filterText: filterText.value,
  })
}
const searchFocus = () => {
  emit("onSearchFocus", {})
}
const updateFilterStatus = (value: string) => {
  filterStatus.value = value
}

// Pagination
const fetchCount = ref(props.pageMeta?.fetchCount ?? 50)
const paginate = () => {
  emit("onPaginate", { fetchCount, sorting, filterStatus, filterText })
}
const updateFetchCount = (value: string) => {
  const nextValue = Number(value)
  fetchCount.value = Number.isNaN(nextValue) ? fetchCount.value : nextValue
}

//
const openColumns = ref(true)

// sorting
const sorting = reactive<IDataTableColumns>({} as IDataTableColumns)
const isSorter = (column: any) => sorting?.name === column?.name
const setSorting = (column: any) => {
  if (isSorter(column)) {
    Object.assign(sorting, {
      ...column,
      sortBy: [1, "asc"].includes(sorting?.sortBy ?? "") ? "desc" : "asc",
    })
  } else {
    Object.assign(sorting, { ...column, sortBy: column?.sortBy ?? "asc" })
  }
  emit("onSort", {
    sorting,
    filterStatus: filterStatus.value,
    filterText: filterText.value,
  })
}

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
])

// checking
const normalizeChecked = (value: boolean | "indeterminate") => value === true
const checkAll = (value: boolean | "indeterminate") => {
  emit("onCheckAll", { checked: normalizeChecked(value) })
}
const check = (entry, value: boolean | "indeterminate") => {
  emit("onCheck", { ...entry, checked: normalizeChecked(value) })
}

// get value from nested objects
const getValue = (payload, column: IDataTableColumns) => {
  if (column?.customRender !== undefined) {
    return column.customRender(payload, column)
  }
  return column.value.split(".").reduce((acc, val) => acc?.[val], payload)
}

const toCapitalize = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1)
}
</script>

<template>
  <div class="relative">
    <div
      v-if="loading"
      class="absolute z-10 h-full w-full"
    >
      <div class="flex h-full w-full items-center justify-center gap-2">
        <Spinner class="size-6" />
        <span>Loading...</span>
      </div>
    </div>

    <div :class="{ 'opacity-50 blur-sm': loading }">
      <section class="my-2 flex flex-wrap items-center justify-between gap-4">
        <div class="flex flex-wrap items-center gap-2">
          <div v-if="filterable" class="flex items-center gap-2">
            <slot name="pre-filter"></slot>
            <Select
              :model-value="filterStatus"
              @update:model-value="updateFilterStatus"
            >
              <SelectTrigger class="w-[160px]">
                <SelectValue placeholder="Filter..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem
                  v-for="filterValue in filterMeta?.filters"
                  :key="filterValue.value"
                  :value="filterValue.value"
                >
                  {{ toCapitalize(filterValue?.name) }}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div v-if="searchable" class="w-64">
            <Input
              v-model="filterText"
              placeholder="Search..."
              @keyup="searchKeyUp()"
              @focus="searchFocus()"
            />
          </div>
          <Button
            v-if="searchable || filterable"
            variant="secondary"
            @click.prevent="searchEntries()"
          >
            Search
          </Button>
        </div>

        <div class="flex-1">
          <div v-if="toggleColumns" class="flex items-center justify-end">
            <div v-show="openColumns" class="flex flex-wrap gap-2">
              <Button
                v-for="(column, columnIdx) in defaultColumns"
                :key="columnIdx"
                v-show="column.showInToggler ?? true"
                size="sm"
                :variant="column.hidden ? 'outline' : 'secondary'"
                @click="toggleColumn(columnIdx)"
              >
                <span>{{ column.name }}</span>
              </Button>
            </div>
            <Tooltip>
              <TooltipTrigger as-child>
                <Button
                  class="ml-2"
                  variant="ghost"
                  size="icon"
                  @click="openColumns = !openColumns"
                >
                  <font-awesome-icon icon="fa-ellipsis"></font-awesome-icon>
                </Button>
              </TooltipTrigger>
              <TooltipContent>Manage table columns</TooltipContent>
            </Tooltip>
          </div>
        </div>
      </section>

      <hr class="mb-4" />

      <div class="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead v-if="selectable">
                <Checkbox
                  :checked="allChecked"
                  @update:checked="checkAll"
                  aria-label="Select all"
                />
              </TableHead>
              <TableHead
                v-for="(column, columnIdx) in defaultColumns.filter((c) => !c.hidden)"
                :key="columnIdx"
              >
                <div
                  class="flex items-center gap-1"
                  :class="column.sortable ? 'cursor-pointer' : ''"
                  @click="column.sortable && setSorting(column)"
                >
                  <span>{{ column.name }}</span>
                  <span v-if="column.sortable">
                    <font-awesome-icon
                      v-if="!isSorter(column)"
                      icon="fa-sort"
                    />
                    <font-awesome-icon
                      v-else-if="sorting?.sortBy === 'asc'"
                      icon="fa-solid fa-arrow-up-wide-short"
                    />
                    <font-awesome-icon
                      v-else
                      icon="fa-solid fa-arrow-down-wide-short"
                    />
                  </span>
                </div>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow v-for="(entry, entryIdx) in entries || []" :key="entryIdx">
              <TableCell v-if="selectable">
                <Checkbox
                  :checked="entry.checked"
                  @update:checked="(value) => check(entry, value)"
                  aria-label="Select row"
                />
              </TableCell>
              <TableCell
                v-for="(column, columnIdx) in defaultColumns.filter((c) => !c.hidden)"
                :key="`${entryIdx}_${columnIdx}`"
              >
                <span v-if="column.customRender && column">
                  <component :is="getValue(entry, column)" />
                </span>
                <span v-else>{{ getValue(entry, column) }}</span>
              </TableCell>
            </TableRow>
            <TableEmpty
              v-if="!loading && (!entries || entries.length === 0)"
              :colspan="defaultColumns.filter(c => !c.hidden).length + (selectable ? 1 : 0)"
            >
              No data available.
            </TableEmpty>
          </TableBody>
        </Table>
      </div>

      <section class="flex flex-wrap justify-between items-center my-4 gap-4">
        <div><slot name="footer"></slot></div>
        <div v-if="paginable" class="flex sm:flex-row flex-col items-center gap-2">
          <div>
            <Button
              v-show="pageMeta?.hasNextPage"
              variant="outline"
              @click.prevent="paginate"
              :disabled="loading"
            >
              Show More
            </Button>
          </div>
          <div class="flex flex-row">
            <Select
              :model-value="String(fetchCount)"
              :disabled="loading || !pageMeta?.hasNextPage"
              @update:model-value="updateFetchCount"
            >
              <SelectTrigger class="w-[120px]">
                <SelectValue placeholder="Rows" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="25">25</SelectItem>
                <SelectItem value="50">50</SelectItem>
                <SelectItem value="100">100</SelectItem>
                <SelectItem value="250">250</SelectItem>
                <SelectItem value="500">500</SelectItem>
                <SelectItem value="1000">1000</SelectItem>
                <SelectItem value="5000">5000</SelectItem>
                <SelectItem value="10000">10000</SelectItem>
              </SelectContent>
            </Select>
          </div>
           <div class="block relative" v-if="pageMeta?.countNone">
            <Input
              :placeholder="pageMeta?.countNone"
              disabled
            />
          </div>
        </div>
      </section>
    </div>
  </div>
</template>
