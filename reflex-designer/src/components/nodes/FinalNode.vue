<script setup lang="ts">
import { computed } from 'vue';
import BaseNode from './BaseNode.vue';
import type { FinalNodeData } from '@/types';

const props = defineProps<{
  id: string;
  data: FinalNodeData;
  selected?: boolean;
}>();

const emit = defineEmits<{
  (e: 'delete'): void;
  (e: 'edit'): void;
}>();

const analysisName = computed(() => 
  props.data.finalData?.analysis?.name || 'Select an analysis'
);

const finalValue = computed(() => 
  props.data.finalData?.value || 'Set final value'
);

const hasAnalysis = computed(() => 
  !!props.data.finalData?.analysis_uid
);

const hasValue = computed(() => 
  !!props.data.finalData?.value
);
</script>

<template>
  <BaseNode
    :id="id"
    :data="data"
    :selected="selected"
    @delete="emit('delete')"
    @edit="emit('edit')"
  >
    <div class="final-content">
      <div class="analysis-info" :class="{ 'empty': !hasAnalysis }">
        <span class="analysis-label">Analysis:</span>
        <span class="analysis-name">{{ analysisName }}</span>
      </div>
      
      <div class="value-display" :class="{ 'empty': !hasValue }">
        <span class="value-label">Final Value:</span>
        <span class="value-text">{{ finalValue }}</span>
      </div>
      
      <div class="hint">
        <span class="hint-icon">🏁</span>
        <span>Sets final result and verifies automatically</span>
      </div>
    </div>
  </BaseNode>
</template>

<style scoped>
.final-content {
  margin-top: 8px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.analysis-info {
  padding: 8px;
  background: rgba(236, 72, 153, 0.1);
  border-radius: 6px;
  border-left: 2px solid #ec4899;
}

.analysis-info.empty {
  border-left-color: #6b7280;
  background: rgba(107, 114, 128, 0.1);
}

.analysis-label {
  display: block;
  font-size: 10px;
  color: #6b7280;
  margin-bottom: 2px;
}

.analysis-name {
  font-size: 12px;
  font-weight: 500;
  color: #f472b6;
}

.empty .analysis-name {
  color: #6b7280;
  font-style: italic;
}

.value-display {
  padding: 8px;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 6px;
  text-align: center;
}

.value-display.empty {
  border: 1px dashed rgba(107, 114, 128, 0.3);
}

.value-label {
  display: block;
  font-size: 10px;
  color: #6b7280;
  margin-bottom: 4px;
}

.value-text {
  font-size: 16px;
  font-weight: 700;
  color: #f472b6;
  font-family: 'JetBrains Mono', monospace;
}

.empty .value-text {
  font-size: 11px;
  font-weight: 400;
  color: #6b7280;
  font-style: italic;
}

.hint {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 10px;
  color: #6b7280;
  padding-top: 4px;
  border-top: 1px dashed rgba(255, 255, 255, 0.1);
}

.hint-icon {
  font-size: 12px;
}
</style>
