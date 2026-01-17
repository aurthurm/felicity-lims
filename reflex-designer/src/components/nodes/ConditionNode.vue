<script setup lang="ts">
import { computed } from 'vue';
import BaseNode from './BaseNode.vue';
import type { ConditionNodeData, CriteriaOperator } from '@/types';
import { OPERATOR_LABELS } from '@/types';

const props = defineProps<{
  id: string;
  data: ConditionNodeData;
  selected?: boolean;
}>();

const emit = defineEmits<{
  (e: 'delete'): void;
  (e: 'edit'): void;
}>();

const description = computed(() => 
  props.data.conditionData?.description || 'No description'
);

const criteriaCount = computed(() => 
  props.data.conditionData?.criteria?.length ?? 0
);

const criteriaPreview = computed(() => {
  const criteria = props.data.conditionData?.criteria || [];
  return criteria.slice(0, 3).map(c => ({
    analysis: c.analysis?.name || 'Unknown',
    operator: OPERATOR_LABELS[c.operator as CriteriaOperator] || c.operator,
    value: c.value,
  }));
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
    <div class="condition-content">
      <div class="description" :class="{ 'empty': !data.conditionData?.description }">
        {{ description }}
      </div>
      
      <div class="criteria-section">
        <div class="criteria-header">
          <span class="criteria-icon">📋</span>
          <span class="criteria-count">{{ criteriaCount }} Criteria</span>
          <span class="and-badge">AND</span>
        </div>
        
        <div v-if="criteriaPreview.length" class="criteria-list">
          <div 
            v-for="(c, i) in criteriaPreview" 
            :key="i" 
            class="criteria-item"
          >
            <span class="criteria-analysis">{{ c.analysis }}</span>
            <span class="criteria-operator">{{ c.operator }}</span>
            <span class="criteria-value">{{ c.value }}</span>
          </div>
          <div v-if="criteriaCount > 3" class="criteria-more">
            +{{ criteriaCount - 3 }} more...
          </div>
        </div>
        <div v-else class="criteria-empty">
          Click edit to add criteria
        </div>
      </div>
      
      <div class="or-hint">
        <span>💡</span>
        <span>Multiple conditions = OR logic</span>
      </div>
    </div>
  </BaseNode>
</template>

<style scoped>
.condition-content {
  margin-top: 8px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.description {
  font-size: 11px;
  color: #9ca3af;
  line-height: 1.4;
  padding: 6px 8px;
  background: rgba(245, 158, 11, 0.08);
  border-radius: 6px;
  border-left: 2px solid #f59e0b;
}

.description.empty {
  font-style: italic;
  color: #6b7280;
}

.criteria-section {
  background: rgba(0, 0, 0, 0.2);
  border-radius: 8px;
  padding: 8px;
}

.criteria-header {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 11px;
  margin-bottom: 6px;
}

.criteria-icon {
  font-size: 12px;
}

.criteria-count {
  color: #fbbf24;
  font-weight: 500;
}

.and-badge {
  margin-left: auto;
  background: rgba(245, 158, 11, 0.2);
  color: #fbbf24;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 9px;
  font-weight: 700;
}

.criteria-list {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.criteria-item {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 10px;
  padding: 4px 6px;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 4px;
}

.criteria-analysis {
  color: #d1d5db;
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.criteria-operator {
  color: #fbbf24;
  font-weight: 600;
}

.criteria-value {
  color: #10b981;
  font-weight: 500;
}

.criteria-more {
  font-size: 10px;
  color: #6b7280;
  font-style: italic;
}

.criteria-empty {
  font-size: 10px;
  color: #6b7280;
  font-style: italic;
}

.or-hint {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 9px;
  color: #6b7280;
  padding-top: 4px;
  border-top: 1px dashed rgba(255, 255, 255, 0.1);
}
</style>
