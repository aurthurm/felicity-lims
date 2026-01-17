<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useReflexDesignerStore } from '@/stores/reflexDesigner';
import type { 
  FlowNodeData, 
  TriggerNodeData, 
  BrainNodeData, 
  ConditionNodeData,
  ActionNodeData,
  AdditionNodeData,
  FinalNodeData,
  CriteriaOperator
} from '@/types';
import { OPERATOR_LABELS, OPERATOR_DESCRIPTIONS } from '@/types';

const store = useReflexDesignerStore();

const emit = defineEmits<{
  (e: 'close'): void;
}>();

const localData = ref<FlowNodeData | null>(null);

watch(
  () => store.selectedNode,
  (node) => {
    if (node) {
      localData.value = JSON.parse(JSON.stringify(node.data));
    } else {
      localData.value = null;
    }
  },
  { immediate: true, deep: true }
);

const nodeType = computed(() => localData.value?.nodeType);

const operators: CriteriaOperator[] = ['eq', 'neq', 'gt', 'gte', 'lt', 'lte'];

function saveChanges() {
  if (store.selectedNodeId && localData.value) {
    store.updateNode(store.selectedNodeId, localData.value);
  }
}

function addCriteria() {
  if (localData.value?.nodeType === 'condition') {
    const data = localData.value as ConditionNodeData;
    if (!data.conditionData.criteria) {
      data.conditionData.criteria = [];
    }
    data.conditionData.criteria.push({
      analysis_uid: '',
      operator: 'eq',
      value: '',
      priority: data.conditionData.criteria.length,
    });
  }
}

function removeCriteria(index: number) {
  if (localData.value?.nodeType === 'condition') {
    const data = localData.value as ConditionNodeData;
    data.conditionData.criteria?.splice(index, 1);
  }
}

function close() {
  emit('close');
  store.selectNode(null);
}
</script>

<template>
  <aside v-if="localData" class="node-editor">
    <div class="editor-header">
      <h2 class="editor-title">
        <span class="title-icon">✏️</span>
        Edit {{ localData.nodeType }}
      </h2>
      <button class="close-btn" @click="close">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M18 6L6 18M6 6l12 12" />
        </svg>
      </button>
    </div>

    <div class="editor-content">
      <!-- Common Fields -->
      <div class="field-group">
        <label class="field-label">Label</label>
        <input 
          v-model="localData.label" 
          type="text" 
          class="field-input"
          placeholder="Node label"
        />
      </div>

      <!-- Trigger Node Fields -->
      <template v-if="nodeType === 'trigger'">
        <div class="field-group">
          <label class="field-label">Reflex Level</label>
          <input 
            v-model.number="(localData as TriggerNodeData).level" 
            type="number" 
            class="field-input"
            min="1"
          />
        </div>
        <div class="field-group">
          <label class="field-label">Triggering Analyses</label>
          <div class="checkbox-list">
            <label 
              v-for="analysis in store.availableAnalyses" 
              :key="analysis.uid"
              class="checkbox-item"
            >
              <input 
                type="checkbox" 
                :value="analysis"
                v-model="(localData as TriggerNodeData).analyses"
              />
              <span class="checkbox-label">{{ analysis.name }}</span>
              <span class="checkbox-keyword">{{ analysis.keyword }}</span>
            </label>
          </div>
        </div>
      </template>

      <!-- Brain Node Fields -->
      <template v-if="nodeType === 'brain'">
        <div class="field-group">
          <label class="field-label">Description</label>
          <textarea 
            v-model="(localData as BrainNodeData).brainData.description" 
            class="field-textarea"
            placeholder="Describe the decision logic..."
            rows="3"
          />
        </div>
        <div class="field-group">
          <label class="field-label">Priority</label>
          <input 
            v-model.number="(localData as BrainNodeData).brainData.priority" 
            type="number" 
            class="field-input"
            min="0"
          />
          <span class="field-hint">Higher priority brains are evaluated first</span>
        </div>
      </template>

      <!-- Condition Node Fields -->
      <template v-if="nodeType === 'condition'">
        <div class="field-group">
          <label class="field-label">Description</label>
          <textarea 
            v-model="(localData as ConditionNodeData).conditionData.description" 
            class="field-textarea"
            placeholder="Describe this condition..."
            rows="2"
          />
        </div>
        
        <div class="field-group">
          <div class="field-header">
            <label class="field-label">Criteria (AND logic)</label>
            <button class="add-btn" @click="addCriteria">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M12 5v14M5 12h14" />
              </svg>
              Add
            </button>
          </div>
          
          <div class="criteria-list">
            <div 
              v-for="(criteria, index) in (localData as ConditionNodeData).conditionData.criteria" 
              :key="index"
              class="criteria-item"
            >
              <div class="criteria-row">
                <select v-model="criteria.analysis_uid" class="field-select flex-2">
                  <option value="">Select Analysis</option>
                  <option 
                    v-for="analysis in store.availableAnalyses" 
                    :key="analysis.uid"
                    :value="analysis.uid"
                  >
                    {{ analysis.name }}
                  </option>
                </select>
                <select v-model="criteria.operator" class="field-select flex-1">
                  <option 
                    v-for="op in operators" 
                    :key="op"
                    :value="op"
                    :title="OPERATOR_DESCRIPTIONS[op]"
                  >
                    {{ OPERATOR_LABELS[op] }}
                  </option>
                </select>
                <input 
                  v-model="criteria.value" 
                  type="text" 
                  class="field-input flex-1"
                  placeholder="Value"
                />
                <button class="remove-btn" @click="removeCriteria(index)">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M18 6L6 18M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            
            <div v-if="!(localData as ConditionNodeData).conditionData.criteria?.length" class="empty-state">
              No criteria defined. Click "Add" to create one.
            </div>
          </div>
        </div>
        
        <div class="field-group">
          <label class="field-label">Priority</label>
          <input 
            v-model.number="(localData as ConditionNodeData).conditionData.priority" 
            type="number" 
            class="field-input"
            min="0"
          />
        </div>
      </template>

      <!-- Action Node Fields -->
      <template v-if="nodeType === 'action'">
        <div class="field-group">
          <label class="field-label">Description</label>
          <textarea 
            v-model="(localData as ActionNodeData).actionData.description" 
            class="field-textarea"
            placeholder="Describe the actions..."
            rows="2"
          />
        </div>
        <div class="field-group">
          <label class="field-label">Priority</label>
          <input 
            v-model.number="(localData as ActionNodeData).actionData.priority" 
            type="number" 
            class="field-input"
            min="0"
          />
        </div>
        <div class="info-box">
          <span class="info-icon">ℹ️</span>
          <span>Connect Addition or Final nodes to define specific actions</span>
        </div>
      </template>

      <!-- Addition Node Fields -->
      <template v-if="nodeType === 'addition'">
        <div class="field-group">
          <label class="field-label">Analysis to Add</label>
          <select 
            v-model="(localData as AdditionNodeData).additionData.analysis_uid" 
            class="field-select"
          >
            <option value="">Select Analysis</option>
            <option 
              v-for="analysis in store.availableAnalyses" 
              :key="analysis.uid"
              :value="analysis.uid"
            >
              {{ analysis.name }} ({{ analysis.keyword }})
            </option>
          </select>
        </div>
        <div class="field-group">
          <label class="field-label">Number of Instances</label>
          <input 
            v-model.number="(localData as AdditionNodeData).additionData.count" 
            type="number" 
            class="field-input"
            min="1"
            max="10"
          />
          <span class="field-hint">How many times to add this analysis</span>
        </div>
      </template>

      <!-- Final Node Fields -->
      <template v-if="nodeType === 'final'">
        <div class="field-group">
          <label class="field-label">Analysis to Finalize</label>
          <select 
            v-model="(localData as FinalNodeData).finalData.analysis_uid" 
            class="field-select"
          >
            <option value="">Select Analysis</option>
            <option 
              v-for="analysis in store.availableAnalyses" 
              :key="analysis.uid"
              :value="analysis.uid"
            >
              {{ analysis.name }} ({{ analysis.keyword }})
            </option>
          </select>
        </div>
        <div class="field-group">
          <label class="field-label">Final Result Value</label>
          <input 
            v-model="(localData as FinalNodeData).finalData.value" 
            type="text" 
            class="field-input"
            placeholder="e.g., Positive, Negative, 42.5"
          />
          <span class="field-hint">This value will be set as the final result</span>
        </div>
      </template>
    </div>

    <div class="editor-footer">
      <button class="btn btn-secondary" @click="close">Cancel</button>
      <button class="btn btn-primary" @click="saveChanges">Save Changes</button>
    </div>
  </aside>
</template>

<style scoped>
.node-editor {
  width: 320px;
  height: 100%;
  background: linear-gradient(180deg, #0f1219 0%, #131722 100%);
  border-left: 1px solid rgba(255, 255, 255, 0.08);
  display: flex;
  flex-direction: column;
  font-family: 'Inter', system-ui, sans-serif;
}

.editor-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
}

.editor-title {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 14px;
  font-weight: 600;
  color: #f3f4f6;
  margin: 0;
  text-transform: capitalize;
}

.title-icon {
  font-size: 16px;
}

.close-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  background: rgba(255, 255, 255, 0.05);
  border: none;
  border-radius: 8px;
  color: #9ca3af;
  cursor: pointer;
  transition: all 0.2s ease;
}

.close-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  color: #fff;
}

.editor-content {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.field-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.field-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.field-label {
  font-size: 12px;
  font-weight: 500;
  color: #9ca3af;
}

.field-input,
.field-select,
.field-textarea {
  padding: 10px 12px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  color: #e5e7eb;
  font-size: 13px;
  font-family: inherit;
  transition: all 0.2s ease;
}

.field-input:focus,
.field-select:focus,
.field-textarea:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.field-select {
  cursor: pointer;
}

.field-textarea {
  resize: vertical;
  min-height: 60px;
}

.field-hint {
  font-size: 11px;
  color: #6b7280;
}

.checkbox-list {
  display: flex;
  flex-direction: column;
  gap: 4px;
  max-height: 200px;
  overflow-y: auto;
  padding: 8px;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 8px;
}

.checkbox-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 8px;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.15s ease;
}

.checkbox-item:hover {
  background: rgba(255, 255, 255, 0.05);
}

.checkbox-item input {
  accent-color: #3b82f6;
}

.checkbox-label {
  flex: 1;
  font-size: 12px;
  color: #d1d5db;
}

.checkbox-keyword {
  font-size: 10px;
  color: #6b7280;
  font-family: 'JetBrains Mono', monospace;
}

.add-btn {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 6px 12px;
  background: rgba(59, 130, 246, 0.1);
  border: 1px solid rgba(59, 130, 246, 0.3);
  border-radius: 6px;
  color: #60a5fa;
  font-size: 11px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.add-btn:hover {
  background: rgba(59, 130, 246, 0.2);
  border-color: rgba(59, 130, 246, 0.5);
}

.criteria-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.criteria-item {
  padding: 10px;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.05);
}

.criteria-row {
  display: flex;
  gap: 6px;
  align-items: center;
}

.criteria-row .field-select,
.criteria-row .field-input {
  padding: 8px 10px;
  font-size: 12px;
}

.flex-1 { flex: 1; }
.flex-2 { flex: 2; }

.remove-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  background: rgba(239, 68, 68, 0.1);
  border: none;
  border-radius: 6px;
  color: #f87171;
  cursor: pointer;
  transition: all 0.2s ease;
  flex-shrink: 0;
}

.remove-btn:hover {
  background: rgba(239, 68, 68, 0.2);
}

.empty-state {
  text-align: center;
  padding: 16px;
  font-size: 12px;
  color: #6b7280;
  background: rgba(255, 255, 255, 0.02);
  border-radius: 8px;
  border: 1px dashed rgba(255, 255, 255, 0.1);
}

.info-box {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  padding: 12px;
  background: rgba(59, 130, 246, 0.08);
  border-radius: 8px;
  border: 1px solid rgba(59, 130, 246, 0.2);
}

.info-icon {
  font-size: 14px;
}

.info-box span:last-child {
  font-size: 11px;
  color: #93c5fd;
  line-height: 1.4;
}

.editor-footer {
  display: flex;
  gap: 10px;
  padding: 16px 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.06);
}

.btn {
  flex: 1;
  padding: 10px 16px;
  border: none;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-secondary {
  background: rgba(255, 255, 255, 0.05);
  color: #9ca3af;
}

.btn-secondary:hover {
  background: rgba(255, 255, 255, 0.1);
  color: #d1d5db;
}

.btn-primary {
  background: #3b82f6;
  color: #fff;
}

.btn-primary:hover {
  background: #2563eb;
}
</style>
