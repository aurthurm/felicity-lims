<script setup lang="ts">
import { reactive, onMounted, ref, computed } from "vue";
import { REST_BASE_URL } from "@/conf";
import { useAnalysisStore } from "@/stores/analysis";
import { ReportListingType } from "@/types/reports";
import useAnalyticsComposable from "@/composables/analytics";
import { formatDate } from "@/utils";
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyTitle } from "@/components/ui/empty";
import { Spinner } from "@/components/ui/spinner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MultiSelect } from "@/components/ui/multi-select";
import { Button } from "@/components/ui/button";

const analysisStore = useAnalysisStore();
const { reports, fetchReports, generateReport, deleteReport } = useAnalyticsComposable();
const isLoading = ref(false);
const showForm = ref(false);

const state = reactive({
  listingForm: {
    report_type: "line_listing",
    analyses_uids: [] as string[],
    sample_states: [] as string[],
    date_column: "created_at",
    period_start: "",
    period_end: "",
  } as ReportListingType,
});

const reportTypeOptions = [
  { value: "line_listing", label: "Line Listing" },
] as const;

const dateColumnOptions = [
  { value: "created_at", label: "Created Date" },
  { value: "date_published", label: "Published Date" },
  { value: "date_submitted", label: "Submission Date" },
  { value: "date_verified", label: "Verified Date" },
  { value: "date_cancelled", label: "Cancellation Date" },
  { value: "date_invalidated", label: "Invalidation Date" },
] as const;

const sampleStateOptions = [
  "Published",
  "Verified",
  "To Be Verified",
  "Received",
  "Cancelled",
  "Rejected",
  "Invalidated",
  "Due",
] as const;
const sampleStateDisplayToValue: Record<string, string> = {
  "Published": "published",
  "Verified": "verified",
  "To Be Verified": "to_be_verified",
  "Received": "received",
  "Cancelled": "cancelled",
  "Rejected": "rejected",
  "Invalidated": "invalidated",
  "Due": "due",
};
const sampleStateValueToDisplay: Record<string, string> = Object.fromEntries(
  Object.entries(sampleStateDisplayToValue).map(([k, v]) => [v, k])
);

const analysesOptions = computed(() =>
  analysisStore.analysesServices.map((s) => s.name)
);
const selectedAnalysisNames = computed({
  get: () =>
    state.listingForm.analyses_uids
      .map(
        (uid) => analysisStore.analysesServices.find((s) => s.uid === uid)?.name
      )
      .filter(Boolean) as string[],
  set: (names: string[]) => {
    state.listingForm.analyses_uids = names
      .map(
        (name) => analysisStore.analysesServices.find((s) => s.name === name)?.uid
      )
      .filter(Boolean) as string[];
  },
});

const selectedStateLabels = computed({
  get: () =>
    state.listingForm.sample_states.map(
      (v) => sampleStateValueToDisplay[v] ?? v
    ),
  set: (labels: string[]) => {
    state.listingForm.sample_states = labels.map(
      (l) => sampleStateDisplayToValue[l] ?? l
    );
  },
});

onMounted(async () => {
  isLoading.value = true;
  analysisStore.fetchAnalysesServices({
    first: undefined,
    after: "",
    text: "",
    sortBy: ["name"],
  });
  await fetchReports().finally(() => {
    isLoading.value = false;
  });
});

const saveListingForm = () => {
  generateReport({ ...state.listingForm });
  showForm.value = false;
};

const downloadReport = (report: any) => {
  const link = document.createElement("a");
  link.download = report.report_type + "-" + report.crated_at;
  link.href = REST_BASE_URL + "/" + report.location;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
</script>

<template>
  <div class="mt-4">
    <div class="flex justify-between items-center mb-4">
      <h1 class="text-xl text-foreground font-semibold">Line Listing Reports</h1>
      <button
        class="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90"
        @click="showForm = true"
      >
        Generate Report
      </button>
    </div>

    <div v-if="isLoading" class="text-center py-4">
      <span class="inline-flex items-center gap-2">
        <Spinner class="size-4" />
        <span class="text-sm">Loading reports...</span>
      </span>
    </div>

    <Empty v-else-if="!reports?.length" class="py-6">
      <EmptyContent>
        <EmptyHeader>
          <EmptyTitle>No reports yet</EmptyTitle>
          <EmptyDescription>Once a download request has been made, your reports will appear here.</EmptyDescription>
        </EmptyHeader>
      </EmptyContent>
    </Empty>

    <div v-else class="overflow-x-auto">
      <Table class="min-w-full bg-background shadow rounded-sm border border-foreground">
        <TableHeader>
          <TableRow>
            <TableHead class="px-4 py-2 border-b border-foreground text-left text-foreground">
              <Checkbox />
            </TableHead>
            <TableHead class="px-4 py-2 border-b border-foreground text-left text-foreground">
              Report Type
            </TableHead>
            <TableHead class="px-4 py-2 border-b border-foreground text-left text-foreground">
              Generated By
            </TableHead>
            <TableHead class="px-4 py-2 border-b border-foreground text-left text-foreground">
              Date Generated
            </TableHead>
            <TableHead class="px-4 py-2 border-b border-foreground text-left text-foreground">
              Period Start
            </TableHead>
            <TableHead class="px-4 py-2 border-b border-foreground text-left text-foreground">
              Period End
            </TableHead>
            <TableHead class="px-4 py-2 border-b border-foreground text-left text-foreground">
              Status
            </TableHead>
            <TableHead class="px-4 py-2 border-b border-foreground"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow v-for="report in reports" :key="report.uid" class="hover:bg-accent/50">
            <TableCell class="px-4 py-2 border-b border-foreground">
              <Checkbox />
            </TableCell>
            <TableCell class="px-4 py-2 border-b border-foreground text-primary">
              {{ report.report_type }}
            </TableCell>
            <TableCell class="px-4 py-2 border-b border-foreground text-primary">
              {{ report?.created_by?.first_name }}
              {{ report?.created_by?.last_name }}
            </TableCell>
            <TableCell class="px-4 py-2 border-b border-foreground text-primary">
              {{ formatDate(report?.created_at, 'YYYY-MM-DD HH:mm') }}
            </TableCell>
            <TableCell class="px-4 py-2 border-b border-foreground text-primary">
              {{ formatDate(report?.period_start, 'YYYY-MM-DD HH:mm') }}
            </TableCell>
            <TableCell class="px-4 py-2 border-b border-foreground text-primary">
              {{ formatDate(report?.period_end, 'YYYY-MM-DD HH:mm') }}
            </TableCell>
            <TableCell class="px-4 py-2 border-b border-foreground">
              <span
                :class="{'bg-success/10 text-success': report?.status?.toLocaleLowerCase() === 'ready',
                  'bg-warning/10 text-warning': report?.status?.toLocaleLowerCase() === 'processing',
                  'bg-destructive/10 text-destructive': report?.status?.toLocaleLowerCase() === 'failed',
                }"
                class="px-2 py-1 rounded-full text-sm"
              >
                {{ report?.status }}
              </span>
            </TableCell>
            <TableCell class="px-4 py-2 border-b border-foreground text-right space-x-2">
              <button
                v-if="report.status?.toLowerCase() === 'ready'"
                class="px-3 py-1 border border-primary text-primary rounded-md hover:bg-primary hover:text-primary-foreground"
                @click="downloadReport(report)"
              >
                Download
              </button>
              <button
                v-if="['ready', 'failed', 'pending'].includes(report.status?.toLowerCase() ?? '')"
                class="px-3 py-1 border border-destructive text-destructive rounded-md hover:bg-destructive hover:text-destructive-foreground"
                @click="deleteReport(report)"
              >
                Delete
              </button>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>

    <Modal v-if="showForm" @close="showForm = false" :content-width="'w-3/4'">
      <template v-slot:header>
        <h3 class="text-lg font-semibold text-foreground">Generate Line Listing Report</h3>
      </template>
      <template v-slot:body>
        <form @submit.prevent="saveListingForm" class="space-y-4">
          <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div class="space-y-2">
              <label class="block text-sm font-medium text-foreground">Report Type</label>
              <Select
                :model-value="state.listingForm.report_type"
                @update:model-value="(v) => (state.listingForm.report_type = v)"
              >
                <SelectTrigger class="w-full">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem
                    v-for="opt in reportTypeOptions"
                    :key="opt.value"
                    :value="opt.value"
                  >
                    {{ opt.label }}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div class="space-y-2 sm:col-span-2 lg:col-span-1">
              <label class="block text-sm font-medium text-foreground">Analyses</label>
              <MultiSelect
                v-model="selectedAnalysisNames"
                :options="analysesOptions"
                placeholder="Select analyses..."
                search-placeholder="Search analyses..."
                empty-message="No analyses found."
              />
            </div>
            <div class="space-y-2">
              <label class="block text-sm font-medium text-foreground">States</label>
              <MultiSelect
                v-model="selectedStateLabels"
                :options="[...sampleStateOptions]"
                placeholder="Select states..."
                search-placeholder="Search states..."
                empty-message="No states found."
              />
            </div>
          </div>

          <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div class="space-y-2">
              <label class="block text-sm font-medium text-foreground">Period Date Criteria</label>
              <Select
                :model-value="state.listingForm.date_column"
                @update:model-value="(v) => (state.listingForm.date_column = v)"
              >
                <SelectTrigger class="w-full">
                  <SelectValue placeholder="Select criteria" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem
                    v-for="opt in dateColumnOptions"
                    :key="opt.value"
                    :value="opt.value"
                  >
                    {{ opt.label }}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div class="space-y-2">
              <label class="block text-sm font-medium text-foreground">Period Start</label>
              <input
                v-model="state.listingForm.period_start"
                type="datetime-local"
                class="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs outline-none transition-[color,box-shadow] focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
                required
              />
            </div>
            <div class="space-y-2">
              <label class="block text-sm font-medium text-foreground">Period End</label>
              <input
                v-model="state.listingForm.period_end"
                type="datetime-local"
                class="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs outline-none transition-[color,box-shadow] focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
                required
              />
            </div>
          </div>

          <div class="flex justify-end gap-2">
            <Button type="button" variant="outline" @click="showForm = false">
              Cancel
            </Button>
            <Button type="submit" :disabled="isLoading">
              Generate
            </Button>
          </div>
        </form>
      </template>
    </Modal>
  </div>
</template>
