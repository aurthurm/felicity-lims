<script setup lang="ts">
import { computed } from 'vue';
import BaseNode from './BaseNode.vue';
import type { BrainNodeData } from '@/types';

const props = defineProps<{
  id: string;
  data: BrainNodeData;
  selected?: boolean;
}>();

const emit = defineEmits<{
  (e: 'delete'): void;
  (e: 'edit'): void;
}>();

const description = computed(() => 
  props.data.brainData?.description || 'No description'
);

const priority = computed(() => 
  props.data.brainData?.priority ?? 0
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
    <div class="brain-content">
      <div class="description" :class="{ 'empty': !data.brainData?.description }">
        {{ description }}
      </div>
      <div class="info-row">
        <span class="info-label">Priority:</span>
        <span class="priority-badge">{{ priority }}</span>
      </div>
      <div class="logic-hint">
        <span class="logic-icon">⚙️</span>
        <span>Conditions → Actions</span>
      </div>
    </div>
  </BaseNode>
</template>

<style scoped>
.brain-content {
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
  background: rgba(139, 92, 246, 0.08);
  border-radius: 6px;
  border-left: 2px solid #8b5cf6;
}

.description.empty {
  font-style: italic;
  color: #6b7280;
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
  background: rgba(139, 92, 246, 0.2);
  color: #a78bfa;
  padding: 2px 8px;
  border-radius: 4px;
  font-weight: 600;
  font-size: 10px;
}

.logic-hint {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 10px;
  color: #6b7280;
  padding-top: 4px;
  border-top: 1px dashed rgba(255, 255, 255, 0.1);
}

.logic-icon {
  font-size: 12px;
}
</style>
