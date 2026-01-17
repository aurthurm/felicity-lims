<script setup lang="ts">
import { ref, computed } from 'vue';
import { useReflexDesignerStore } from '@/stores/reflexDesigner';

const store = useReflexDesignerStore();

const emit = defineEmits<{
  (e: 'save'): void;
  (e: 'export'): void;
  (e: 'clear'): void;
}>();

const isEditingName = ref(false);
const isEditingDescription = ref(false);

const canSave = computed(() => 
  store.isValidFlow && 
  store.currentRule.name && 
  store.currentRule.description
);

function toggleActive() {
  store.updateRule({ is_active: !store.currentRule.is_active });
}

function handleSave() {
  if (canSave.value) {
    emit('save');
  }
}

function handleExport() {
  emit('export');
}

function handleClear() {
  if (confirm('Are you sure you want to clear the canvas? This cannot be undone.')) {
    store.clearCanvas();
    emit('clear');
  }
}
</script>

<template>
  <header class="rule-header">
    <div class="header-left">
      <div class="logo">
        <span class="logo-icon">🔬</span>
        <span class="logo-text">Felicity LIMS</span>
      </div>
      <div class="breadcrumb">
        <span class="breadcrumb-item">Reflex Rules</span>
        <span class="breadcrumb-sep">/</span>
        <span class="breadcrumb-item current">Designer</span>
      </div>
    </div>

    <div class="header-center">
      <div class="rule-info">
        <div class="rule-name-wrapper" @click="isEditingName = true">
          <input
            v-if="isEditingName"
            v-model="store.currentRule.name"
            type="text"
            class="rule-name-input"
            placeholder="Rule Name"
            @blur="isEditingName = false"
            @keyup.enter="isEditingName = false"
            ref="nameInput"
            autofocus
          />
          <h1 v-else class="rule-name" :class="{ 'empty': !store.currentRule.name }">
            {{ store.currentRule.name || 'Untitled Rule' }}
            <span class="edit-hint">✏️</span>
          </h1>
        </div>
        
        <div class="rule-description-wrapper" @click="isEditingDescription = true">
          <input
            v-if="isEditingDescription"
            v-model="store.currentRule.description"
            type="text"
            class="rule-description-input"
            placeholder="Add a description..."
            @blur="isEditingDescription = false"
            @keyup.enter="isEditingDescription = false"
          />
          <p v-else class="rule-description" :class="{ 'empty': !store.currentRule.description }">
            {{ store.currentRule.description || 'Click to add description...' }}
          </p>
        </div>
      </div>

      <div class="rule-meta">
        <button 
          class="meta-toggle"
          :class="{ 'active': store.currentRule.is_active }"
          @click="toggleActive"
        >
          <span class="toggle-indicator"></span>
          <span class="toggle-label">{{ store.currentRule.is_active ? 'Active' : 'Inactive' }}</span>
        </button>
        
        <div class="priority-control">
          <label class="priority-label">Priority:</label>
          <input
            v-model.number="store.currentRule.priority"
            type="number"
            class="priority-input"
            min="0"
          />
        </div>
      </div>
    </div>

    <div class="header-right">
      <button class="header-btn btn-clear" @click="handleClear" title="Clear Canvas">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
        </svg>
      </button>
      <button class="header-btn btn-export" @click="handleExport" title="Export JSON">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12" />
        </svg>
        Export
      </button>
      <button 
        class="header-btn btn-save" 
        :disabled="!canSave"
        @click="handleSave"
        title="Save Rule"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z" />
          <polyline points="17,21 17,13 7,13 7,21" />
          <polyline points="7,3 7,8 15,8" />
        </svg>
        Save
      </button>
    </div>
  </header>
</template>

<style scoped>
.rule-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  padding: 12px 24px;
  background: linear-gradient(180deg, #0f1219 0%, rgba(15, 18, 25, 0.95) 100%);
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(10px);
  font-family: 'Inter', system-ui, sans-serif;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 20px;
}

.logo {
  display: flex;
  align-items: center;
  gap: 10px;
}

.logo-icon {
  font-size: 24px;
}

.logo-text {
  font-size: 16px;
  font-weight: 700;
  color: #f3f4f6;
  letter-spacing: -0.5px;
}

.breadcrumb {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
}

.breadcrumb-item {
  color: #6b7280;
}

.breadcrumb-item.current {
  color: #d1d5db;
  font-weight: 500;
}

.breadcrumb-sep {
  color: #4b5563;
}

.header-center {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 24px;
}

.rule-info {
  text-align: center;
}

.rule-name-wrapper {
  cursor: pointer;
}

.rule-name {
  font-size: 18px;
  font-weight: 600;
  color: #f3f4f6;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 8px;
  justify-content: center;
}

.rule-name.empty {
  color: #6b7280;
}

.edit-hint {
  font-size: 12px;
  opacity: 0;
  transition: opacity 0.2s ease;
}

.rule-name-wrapper:hover .edit-hint {
  opacity: 0.5;
}

.rule-name-input {
  font-size: 18px;
  font-weight: 600;
  color: #f3f4f6;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(59, 130, 246, 0.5);
  border-radius: 6px;
  padding: 4px 12px;
  text-align: center;
  outline: none;
}

.rule-description-wrapper {
  cursor: pointer;
  margin-top: 4px;
}

.rule-description {
  font-size: 12px;
  color: #9ca3af;
  margin: 0;
}

.rule-description.empty {
  color: #6b7280;
  font-style: italic;
}

.rule-description-input {
  font-size: 12px;
  color: #9ca3af;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(59, 130, 246, 0.5);
  border-radius: 4px;
  padding: 2px 8px;
  text-align: center;
  outline: none;
  min-width: 200px;
}

.rule-meta {
  display: flex;
  align-items: center;
  gap: 16px;
}

.meta-toggle {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 12px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.meta-toggle:hover {
  background: rgba(255, 255, 255, 0.05);
}

.meta-toggle.active {
  background: rgba(16, 185, 129, 0.1);
  border-color: rgba(16, 185, 129, 0.3);
}

.toggle-indicator {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #6b7280;
  transition: background 0.2s ease;
}

.meta-toggle.active .toggle-indicator {
  background: #10b981;
  box-shadow: 0 0 8px rgba(16, 185, 129, 0.5);
}

.toggle-label {
  font-size: 11px;
  font-weight: 500;
  color: #9ca3af;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.meta-toggle.active .toggle-label {
  color: #34d399;
}

.priority-control {
  display: flex;
  align-items: center;
  gap: 8px;
}

.priority-label {
  font-size: 11px;
  color: #6b7280;
}

.priority-input {
  width: 50px;
  padding: 4px 8px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 6px;
  color: #e5e7eb;
  font-size: 12px;
  text-align: center;
}

.priority-input:focus {
  outline: none;
  border-color: rgba(59, 130, 246, 0.5);
}

.header-right {
  display: flex;
  align-items: center;
  gap: 10px;
}

.header-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  border: none;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-clear {
  background: rgba(255, 255, 255, 0.03);
  color: #9ca3af;
  padding: 8px;
}

.btn-clear:hover {
  background: rgba(239, 68, 68, 0.1);
  color: #f87171;
}

.btn-export {
  background: rgba(255, 255, 255, 0.05);
  color: #d1d5db;
}

.btn-export:hover {
  background: rgba(255, 255, 255, 0.1);
  color: #fff;
}

.btn-save {
  background: #3b82f6;
  color: #fff;
}

.btn-save:hover:not(:disabled) {
  background: #2563eb;
}

.btn-save:disabled {
  background: rgba(59, 130, 246, 0.3);
  color: rgba(255, 255, 255, 0.5);
  cursor: not-allowed;
}
</style>
