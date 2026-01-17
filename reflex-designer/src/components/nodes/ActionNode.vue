<script setup lang="ts">
import { computed } from 'vue';
import BaseNode from './BaseNode.vue';
import type { ActionNodeData } from '@/types';

const props = defineProps<{
  id: string;
  data: ActionNodeData;
  selected?: boolean;
}>();

const emit = defineEmits<{
  (e: 'delete'): void;
  (e: 'edit'): void;
}>();

const description = computed(() => 
  props.data.actionData?.description || 'Execute actions when conditions are met'
);

const addCount = computed(() => 
  props.data.actionData?.add_new?.length ?? 0
);

const finalCount = computed(() => 
  props.data.actionData?.finalise?.length ?? 0
);

const priority = computed(() => 
  props.data.actionData?.priority ?? 0
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
    <div class="action-content">
      <div class="description">
        {{ description }}
      </div>
      
      <div class="actions-summary">
        <div class="summary-item">
          <span class="summary-icon">➕</span>
          <span class="summary-label">Additions:</span>
          <span class="summary-count add-count">{{ addCount }}</span>
        </div>
        <div class="summary-item">
          <span class="summary-icon">✅</span>
          <span class="summary-label">Finals:</span>
          <span class="summary-count final-count">{{ finalCount }}</span>
        </div>
      </div>

      <div class="info-row">
        <span class="info-label">Priority:</span>
        <span class="priority-badge">{{ priority }}</span>
      </div>
    </div>
  </BaseNode>
</template>

<style scoped>
.action-content {
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
  background: rgba(16, 185, 129, 0.08);
  border-radius: 6px;
  border-left: 2px solid #10b981;
}

.actions-summary {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 8px;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 8px;
}

.summary-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 11px;
}

.summary-icon {
  font-size: 12px;
}

.summary-label {
  color: #6b7280;
}

.summary-count {
  margin-left: auto;
  padding: 2px 8px;
  border-radius: 4px;
  font-weight: 600;
  font-size: 10px;
}

.add-count {
  background: rgba(6, 182, 212, 0.2);
  color: #22d3ee;
}

.final-count {
  background: rgba(236, 72, 153, 0.2);
  color: #f472b6;
}

.info-row {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 11px;
}

.info-label {
  color: #6b7280;
}

.priority-badge {
  background: rgba(16, 185, 129, 0.2);
  color: #34d399;
  padding: 2px 8px;
  border-radius: 4px;
  font-weight: 600;
  font-size: 10px;
}
</style>
