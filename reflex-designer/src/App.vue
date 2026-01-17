<script setup lang="ts">
import { computed } from 'vue';
import { useReflexDesignerStore } from '@/stores/reflexDesigner';
import RuleHeader from '@/components/RuleHeader.vue';
import NodesSidebar from '@/components/NodesSidebar.vue';
import FlowCanvas from '@/components/FlowCanvas.vue';
import NodeEditor from '@/components/NodeEditor.vue';

const store = useReflexDesignerStore();

const showEditor = computed(() => store.selectedNode !== null);

function handleSave() {
  const rule = store.exportToReflexRule();
  if (rule) {
    console.log('Saving rule:', rule);
    // TODO: API call to save rule
    alert('Rule saved successfully! (Check console for data)');
  } else {
    alert('Please complete the flow before saving.');
  }
}

function handleExport() {
  const rule = store.exportToReflexRule();
  const data = {
    rule,
    nodes: store.nodes,
    edges: store.edges,
  };
  
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `reflex-rule-${store.currentRule.name || 'export'}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

function handleClear() {
  store.updateRule({
    name: '',
    description: '',
    is_active: true,
    priority: 0,
  });
}

function handleEditorClose() {
  store.selectNode(null);
}
</script>

<template>
  <div class="reflex-designer">
    <RuleHeader 
      @save="handleSave"
      @export="handleExport"
      @clear="handleClear"
    />
    
    <div class="designer-body">
      <NodesSidebar />
      
      <FlowCanvas />
      
      <transition name="slide">
        <NodeEditor 
          v-if="showEditor"
          @close="handleEditorClose"
        />
      </transition>
    </div>
  </div>
</template>

<style>
/* Global styles */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600;700&display=swap');

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html, body, #app {
  height: 100%;
  margin: 0;
  overflow: hidden;
}

body {
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
  background: #0a0d14;
  color: #e5e7eb;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* Scrollbar styling */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.2);
}

::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.2);
}
</style>

<style scoped>
.reflex-designer {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: #0a0d14;
}

.designer-body {
  flex: 1;
  display: flex;
  overflow: hidden;
}

/* Slide transition for editor panel */
.slide-enter-active,
.slide-leave-active {
  transition: transform 0.3s ease, opacity 0.3s ease;
}

.slide-enter-from,
.slide-leave-to {
  transform: translateX(100%);
  opacity: 0;
}
</style>
