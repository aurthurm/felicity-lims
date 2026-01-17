<script setup lang="ts">
import { computed } from 'vue';
import BaseNode from './BaseNode.vue';
import type { AdditionNodeData } from '@/types';

const props = defineProps<{
  id: string;
  data: AdditionNodeData;
  selected?: boolean;
}>();

const emit = defineEmits<{
  (e: 'delete'): void;
  (e: 'edit'): void;
}>();

const analysisName = computed(() => 
  props.data.additionData?.analysis?.name || 'Select an analysis'
);

const count = computed(() => 
  props.data.additionData?.count ?? 1
);

const hasAnalysis = computed(() => 
  !!props.data.additionData?.analysis_uid
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
    <div class="addition-content">
      <div class="analysis-info" :class="{ 'empty': !hasAnalysis }">
        <span class="analysis-label">Analysis:</span>
        <span class="analysis-name">{{ analysisName }}</span>
      </div>
      
      <div class="count-display">
        <span class="count-label">Create instances:</span>
        <span class="count-value">{{ count }}</span>
      </div>
      
      <div class="hint">
        <span class="hint-icon">💉</span>
        <span>Adds new test for further analysis</span>
      </div>
    </div>
  </BaseNode>
</template>

<style scoped>
.addition-content {
  margin-top: 8px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.analysis-info {
  padding: 8px;
  background: rgba(6, 182, 212, 0.1);
  border-radius: 6px;
  border-left: 2px solid #06b6d4;
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
  color: #22d3ee;
}

.empty .analysis-name {
  color: #6b7280;
  font-style: italic;
}

.count-display {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 6px 8px;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 6px;
}

.count-label {
  font-size: 11px;
  color: #6b7280;
}

.count-value {
  font-size: 14px;
  font-weight: 700;
  color: #22d3ee;
  background: rgba(6, 182, 212, 0.2);
  padding: 2px 10px;
  border-radius: 4px;
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
