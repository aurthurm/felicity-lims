<script setup lang="ts">
import { computed } from 'vue';
import BaseNode from './BaseNode.vue';
import type { TriggerNodeData } from '@/types';

const props = defineProps<{
  id: string;
  data: TriggerNodeData;
  selected?: boolean;
}>();

const emit = defineEmits<{
  (e: 'delete'): void;
  (e: 'edit'): void;
}>();

const analysisNames = computed(() => {
  if (!props.data.analyses?.length) return 'No analyses selected';
  return props.data.analyses.map(a => a.name).join(', ');
});
</script>

<template>
  <BaseNode
    :id="id"
    :data="data"
    :selected="selected"
    @delete="emit('delete')"
    @edit="emit('edit')"
  >
    <div class="trigger-content">
      <div class="info-row">
        <span class="info-label">Analyses:</span>
        <span class="info-value" :class="{ 'empty': !data.analyses?.length }">
          {{ analysisNames }}
        </span>
      </div>
      <div class="info-row">
        <span class="info-label">Level:</span>
        <span class="info-value level-badge">{{ data.level }}</span>
      </div>
    </div>
  </BaseNode>
</template>

<style scoped>
.trigger-content {
  margin-top: 8px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.info-row {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  font-size: 11px;
}

.info-label {
  color: #6b7280;
  flex-shrink: 0;
}

.info-value {
  color: #d1d5db;
  word-break: break-word;
}

.info-value.empty {
  color: #6b7280;
  font-style: italic;
}

.level-badge {
  background: rgba(59, 130, 246, 0.2);
  color: #60a5fa;
  padding: 2px 8px;
  border-radius: 4px;
  font-weight: 600;
}
</style>
