<template>
  <div class="reflex-result bg-card rounded-lg border border-border p-4">
    <div class="flex justify-between items-start mb-4">
      <div>
        <h3 class="text-lg font-semibold text-foreground">{{ result.analysis.name }}</h3>
        <p class="text-sm text-muted-foreground">
          Instrument: {{ result.laboratoryInstrument?.instrument?.name || 'N/A' }}
        </p>
      </div>
      <div :class="getStatusClass(result.status)">
        {{ result.status }}
      </div>
    </div>

    <div class="grid grid-cols-2 gap-4 mb-4">
      <div>
        <p class="text-sm font-medium text-foreground">Result</p>
        <p class="text-lg">{{ result.result || 'Pending' }}</p>
      </div>
      <div>
        <p class="text-sm font-medium text-foreground">Method</p>
        <p class="text-lg">{{ result.method?.name || 'N/A' }}</p>
      </div>
    </div>

    <div class="border-t border-border pt-4">
      <div class="grid grid-cols-2 gap-4">
        <div>
          <p class="text-sm font-medium text-foreground">Submitted By</p>
          <p class="text-sm">{{ result.submittedBy?.firstName }} {{ result.submittedBy?.lastName }}</p>
          <p class="text-xs text-muted-foreground">
            {{ formatDate(result.dateSubmitted, 'D MMMM YYYY, h:mm:ss a') }}
          </p>
        </div>
        <div v-if="result.verifiedBy?.length">
          <p class="text-sm font-medium text-foreground">Verified By</p>
          <p class="text-sm">{{ result.verifiedBy[0]?.firstName }} {{ result.verifiedBy[0]?.lastName }}</p>
          <p class="text-xs text-muted-foreground">
            {{ formatDate(result.dateVerified, 'D MMMM YYYY, h:mm:ss a') }}
          </p>
        </div>
      </div>
    </div>

    <div class="flex justify-end gap-2 mt-4">
      <button 
        v-if="result.editable"
        @click="$emit('edit', result)"
        class="px-3 py-1 text-sm font-medium text-primary-foreground bg-primary rounded-md hover:bg-primary/90"
      >
        Edit
      </button>
      <button 
        v-if="!result.verifiedBy?.length"
        @click="$emit('verify', result)"
        class="px-3 py-1 text-sm font-medium text-primary-foreground bg-primary rounded-md hover:bg-primary/90"
      >
        Verify
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { IAnalysisResult } from '@/models/analysis';
import { formatDate } from '@/utils';

interface Props {
  result: IAnalysisResult;
}

defineProps<Props>();
defineEmits<{
  (e: 'edit', result: IAnalysisResult): void;
  (e: 'verify', result: IAnalysisResult): void;
}>();

function getStatusClass(status: string | undefined): string {
  const baseClasses = 'px-2 py-1 text-xs font-medium rounded-full';
  switch (status?.toLowerCase()) {
    case 'submitted':
      return `${baseClasses} bg-warning text-warning-foreground`;
    case 'verified':
      return `${baseClasses} bg-success text-success-foreground`;
    case 'rejected':
      return `${baseClasses} bg-destructive text-destructive-foreground`;
    default:
      return `${baseClasses} bg-muted text-muted-foreground`;
  }
}
</script> 