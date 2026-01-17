<script setup lang="ts">
import { ref } from 'vue';
import type { DragItem, NodeType } from '@/types';
import { DRAG_ITEMS, NODE_COLORS } from '@/types';

const emit = defineEmits<{
  (e: 'dragStart', event: DragEvent, item: DragItem): void;
}>();

const expandedSection = ref<string | null>('nodes');

const sections = [
  { id: 'nodes', label: 'Nodes', items: DRAG_ITEMS },
];

function handleDragStart(event: DragEvent, item: DragItem) {
  if (event.dataTransfer) {
    event.dataTransfer.setData('application/json', JSON.stringify(item));
    event.dataTransfer.effectAllowed = 'copy';
  }
  emit('dragStart', event, item);
}

function getNodeColor(type: NodeType) {
  return NODE_COLORS[type];
}
</script>

<template>
  <aside class="nodes-sidebar">
    <div class="sidebar-header">
      <h2 class="sidebar-title">
        <span class="title-icon">🧬</span>
        Components
      </h2>
      <p class="sidebar-subtitle">Drag to canvas</p>
    </div>

    <div class="sidebar-content">
      <div 
        v-for="section in sections" 
        :key="section.id" 
        class="sidebar-section"
      >
        <button 
          class="section-header"
          @click="expandedSection = expandedSection === section.id ? null : section.id"
        >
          <span class="section-label">{{ section.label }}</span>
          <svg 
            class="section-chevron" 
            :class="{ 'expanded': expandedSection === section.id }"
            width="16" 
            height="16" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            stroke-width="2"
          >
            <path d="M6 9l6 6 6-6" />
          </svg>
        </button>

        <div 
          class="section-content"
          :class="{ 'expanded': expandedSection === section.id }"
        >
          <div
            v-for="item in section.items"
            :key="item.type"
            class="drag-item"
            :style="{
              '--item-border': getNodeColor(item.type).border,
              '--item-accent': getNodeColor(item.type).accent,
            }"
            draggable="true"
            @dragstart="(e) => handleDragStart(e, item)"
          >
            <div class="item-icon">{{ item.icon }}</div>
            <div class="item-info">
              <div class="item-label">{{ item.label }}</div>
              <div class="item-description">{{ item.description }}</div>
            </div>
            <div class="item-drag-indicator">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                <circle cx="8" cy="6" r="2" />
                <circle cx="16" cy="6" r="2" />
                <circle cx="8" cy="12" r="2" />
                <circle cx="16" cy="12" r="2" />
                <circle cx="8" cy="18" r="2" />
                <circle cx="16" cy="18" r="2" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="sidebar-footer">
      <div class="connection-legend">
        <h3 class="legend-title">Connection Rules</h3>
        <div class="legend-items">
          <div class="legend-item">
            <span class="legend-from" style="--color: #3b82f6">Trigger</span>
            <span class="legend-arrow">→</span>
            <span class="legend-to" style="--color: #8b5cf6">Brain</span>
          </div>
          <div class="legend-item">
            <span class="legend-from" style="--color: #8b5cf6">Brain</span>
            <span class="legend-arrow">→</span>
            <span class="legend-to" style="--color: #f59e0b">Condition</span>
          </div>
          <div class="legend-item">
            <span class="legend-from" style="--color: #f59e0b">Condition</span>
            <span class="legend-arrow">→</span>
            <span class="legend-to" style="--color: #10b981">Action</span>
          </div>
          <div class="legend-item">
            <span class="legend-from" style="--color: #10b981">Action</span>
            <span class="legend-arrow">→</span>
            <span class="legend-to" style="--color: #06b6d4">Add</span>
            <span class="legend-or">/</span>
            <span class="legend-to" style="--color: #ec4899">Final</span>
          </div>
        </div>
      </div>
    </div>
  </aside>
</template>

<style scoped>
.nodes-sidebar {
  width: 280px;
  height: 100%;
  background: linear-gradient(180deg, #0f1219 0%, #131722 100%);
  border-right: 1px solid rgba(255, 255, 255, 0.08);
  display: flex;
  flex-direction: column;
  font-family: 'Inter', system-ui, sans-serif;
}

.sidebar-header {
  padding: 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
}

.sidebar-title {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 16px;
  font-weight: 600;
  color: #f3f4f6;
  margin: 0;
}

.title-icon {
  font-size: 20px;
}

.sidebar-subtitle {
  font-size: 12px;
  color: #6b7280;
  margin: 6px 0 0;
}

.sidebar-content {
  flex: 1;
  overflow-y: auto;
  padding: 12px;
}

.sidebar-section {
  margin-bottom: 8px;
}

.section-header {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 12px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 8px;
  color: #d1d5db;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.section-header:hover {
  background: rgba(255, 255, 255, 0.05);
  border-color: rgba(255, 255, 255, 0.1);
}

.section-chevron {
  color: #6b7280;
  transition: transform 0.2s ease;
}

.section-chevron.expanded {
  transform: rotate(180deg);
}

.section-content {
  display: none;
  padding-top: 8px;
}

.section-content.expanded {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.drag-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-left: 3px solid var(--item-border);
  border-radius: 8px;
  cursor: grab;
  transition: all 0.2s ease;
}

.drag-item:hover {
  background: rgba(255, 255, 255, 0.05);
  border-color: var(--item-border);
  transform: translateX(4px);
  box-shadow: 0 4px 12px -2px rgba(0, 0, 0, 0.3);
}

.drag-item:active {
  cursor: grabbing;
  transform: scale(0.98);
}

.item-icon {
  font-size: 20px;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 8px;
}

.item-info {
  flex: 1;
  min-width: 0;
}

.item-label {
  font-size: 13px;
  font-weight: 500;
  color: #e5e7eb;
}

.item-description {
  font-size: 10px;
  color: #6b7280;
  margin-top: 2px;
  line-height: 1.3;
}

.item-drag-indicator {
  color: #4b5563;
  opacity: 0;
  transition: opacity 0.2s ease;
}

.drag-item:hover .item-drag-indicator {
  opacity: 1;
}

.sidebar-footer {
  padding: 16px;
  border-top: 1px solid rgba(255, 255, 255, 0.06);
  background: rgba(0, 0, 0, 0.2);
}

.connection-legend {
  padding: 12px;
  background: rgba(255, 255, 255, 0.02);
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.04);
}

.legend-title {
  font-size: 10px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: #6b7280;
  margin: 0 0 10px;
}

.legend-items {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 10px;
}

.legend-from,
.legend-to {
  color: var(--color);
  font-weight: 500;
}

.legend-arrow {
  color: #4b5563;
}

.legend-or {
  color: #4b5563;
  margin: 0 2px;
}
</style>
