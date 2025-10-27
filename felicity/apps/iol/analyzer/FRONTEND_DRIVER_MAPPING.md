# Vue.js Frontend Driver Mapping Guide

**Date**: October 27, 2025
**Status**: Implementation Guide for Frontend Development
**Framework**: Vue 3 + Vite + TypeScript + URQL (GraphQL Client)

---

## Overview

This guide explains how the Vue.js frontend should implement the visual driver mapping interface that allows users to:

1. **View parsed ASTM/HL7 message structure** in a tree format
2. **Interactively map message fields** to required output fields
3. **Generate JSON driver configuration** automatically
4. **Persist mappings** via GraphQL mutations

The frontend is responsible for extracting driver mappings and sending them to the backend for persistence.

---

## Architecture

### Data Flow

```
Raw ASTM/HL7 Message
        ↓
    [Backend]
    parse_message()
        ↓
Parsed Message JSON
        ↓
    [GraphQL Query]
    Returns parsed structure
        ↓
    [Vue Frontend]
    Display as interactive tree
        ↓
    User clicks/drags to map fields
        ↓
Driver Mapping JSON Generated
        ↓
    [GraphQL Mutation]
    updateInstrument(driverMapping)
        ↓
Backend persists driver
```

### Component Structure

```
DriverMappingEditor (Parent)
├── ParsedMessageViewer (Left Panel)
│   └── MessageTree (Tree widget)
│       └── TreeNode (Recursive)
├── MappingEditor (Center Panel)
│   ├── RequiredFieldsList
│   ├── FieldMapper (Drag-drop or click-based)
│   └── PathInput (Manual path entry)
├── DriverPreview (Right Panel)
│   └── JSONDisplay
└── Actions
    ├── Test Button
    ├── Save Button
    └── Cancel Button
```

---

## Step 1: Request Parsed Message from Backend

### GraphQL Query

```graphql
query GetParsedMessage($rawMessage: String!) {
  parseMessage(input: {
    rawMessage: $rawMessage
  }) {
    success
    parsedMessage
    error
  }
}
```

### Backend Endpoint (To be created)

```python
# In felicity/api/gql/instrument/query.py

@strawberry.field
async def parse_message(
    self,
    raw_message: str
) -> ParseMessageResult:
    """Parse raw ASTM/HL7 message without driver"""
    from felicity.apps.iol.analyzer.services.transformer import MessageTransformer

    transformer = MessageTransformer()
    try:
        parsed = transformer.parse_message(raw_message)
        return ParseMessageResult(
            success=True,
            parsed_message=parsed,
            error=None
        )
    except Exception as e:
        return ParseMessageResult(
            success=False,
            parsed_message={},
            error=str(e)
        )
```

### Vue Composable

```typescript
// composables/useMessageParser.ts

import { useQuery } from '@urql/vue';
import gql from 'graphql-tag';

const PARSE_MESSAGE_QUERY = gql`
  query GetParsedMessage($rawMessage: String!) {
    parseMessage(input: {
      rawMessage: $rawMessage
    }) {
      success
      parsedMessage
      error
    }
  }
`;

export function useMessageParser() {
  const parseMessage = async (rawMessage: string) => {
    // Execute query
  };

  return { parseMessage };
}
```

---

## Step 2: Display Parsed Message as Tree

### Tree Structure Definition

```typescript
// types/parsedMessage.ts

export interface ParsedSegment {
  raw: string;
  fields: Record<number, ParsedField>;
}

export interface ParsedField {
  raw: string;
  repeats?: ParsedRepeat[];
}

export interface ParsedRepeat {
  raw: string;
  components?: Record<number, ParsedComponent>;
}

export interface ParsedComponent {
  raw: string;
  subcomponents?: Record<number, string>;
}

export interface ParsedMessage {
  [segmentId: string]: ParsedSegment[];
}

// Tree representation for UI
export interface TreeNode {
  id: string; // Unique ID for selection
  label: string;
  value: string; // The raw value
  path: FieldPath; // Path info for mapping
  level: 'segment' | 'field' | 'repeat' | 'component' | 'subcomponent';
  children?: TreeNode[];
  isExpandable: boolean;
}

export interface FieldPath {
  segment: string;
  field?: number;
  repeat?: number;
  component?: number;
  subcomponent?: number;
}
```

### Tree Component

```vue
<!-- components/ParsedMessageTree.vue -->

<template>
  <div class="parsed-message-viewer">
    <div class="header">
      <h3>Parsed Message Structure</h3>
      <input
        v-model="expandSearch"
        type="text"
        placeholder="Search segments/fields..."
        @input="filterTree"
      >
    </div>

    <div class="tree-container">
      <div v-if="!treeNodes.length" class="empty-state">
        No parsed message. Upload raw message first.
      </div>

      <TreeNode
        v-for="node in filteredNodes"
        :key="node.id"
        :node="node"
        :selected="selectedNodeId === node.id"
        @select="selectNode"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import type { ParsedMessage, TreeNode, FieldPath } from '@/types/parsedMessage';
import TreeNode from './TreeNode.vue';

const props = defineProps<{
  parsedMessage: ParsedMessage;
}>();

const emit = defineEmits<{
  nodeSelected: [node: TreeNode];
}>();

const expandSearch = ref('');
const selectedNodeId = ref<string | null>(null);
const treeNodes = ref<TreeNode[]>([]);

// Convert parsed message to tree nodes
function buildTree(parsedMessage: ParsedMessage): TreeNode[] {
  const nodes: TreeNode[] = [];
  let nodeId = 0;

  for (const [segmentId, segments] of Object.entries(parsedMessage)) {
    segments.forEach((segment, segmentIdx) => {
      const segmentNode: TreeNode = {
        id: `seg-${segmentId}-${segmentIdx}`,
        label: `${segmentId}[${segmentIdx}]`,
        value: segment.raw,
        level: 'segment',
        path: { segment: segmentId },
        isExpandable: true,
        children: buildFieldNodes(
          segmentId,
          segment.fields,
          segmentIdx
        ),
      };
      nodes.push(segmentNode);
    });
  }

  return nodes;
}

function buildFieldNodes(
  segmentId: string,
  fields: Record<number, any>,
  segmentIdx: number
): TreeNode[] {
  const nodes: TreeNode[] = [];

  for (const [fieldNum, field] of Object.entries(fields)) {
    const fieldNumber = parseInt(fieldNum);

    // If field has repeats, show them
    if (field.repeats && field.repeats.length > 0) {
      const fieldNode: TreeNode = {
        id: `fld-${segmentId}-${segmentIdx}-${fieldNumber}`,
        label: `Field ${fieldNumber}`,
        value: field.raw,
        level: 'field',
        path: { segment: segmentId, field: fieldNumber },
        isExpandable: true,
        children: field.repeats.map((repeat, repeatIdx) =>
          buildRepeatNode(
            segmentId,
            fieldNumber,
            repeatIdx,
            repeat,
            segmentIdx
          )
        ),
      };
      nodes.push(fieldNode);
    } else {
      // Simple field, no repeats
      const fieldNode: TreeNode = {
        id: `fld-${segmentId}-${segmentIdx}-${fieldNumber}`,
        label: `Field ${fieldNumber}`,
        value: field.raw,
        level: 'field',
        path: { segment: segmentId, field: fieldNumber },
        isExpandable: false,
      };
      nodes.push(fieldNode);
    }
  }

  return nodes;
}

function buildRepeatNode(
  segmentId: string,
  fieldNum: number,
  repeatIdx: number,
  repeat: any,
  segmentIdx: number
): TreeNode {
  return {
    id: `rep-${segmentId}-${segmentIdx}-${fieldNum}-${repeatIdx}`,
    label: `Repeat ${repeatIdx}`,
    value: repeat.raw,
    level: 'repeat',
    path: {
      segment: segmentId,
      field: fieldNum,
      repeat: repeatIdx,
    },
    isExpandable: !!repeat.components,
    children: repeat.components
      ? buildComponentNodes(
          segmentId,
          fieldNum,
          repeatIdx,
          repeat.components,
          segmentIdx
        )
      : [],
  };
}

function buildComponentNodes(
  segmentId: string,
  fieldNum: number,
  repeatIdx: number,
  components: Record<number, any>,
  segmentIdx: number
): TreeNode[] {
  const nodes: TreeNode[] = [];

  for (const [compNum, comp] of Object.entries(components)) {
    const componentNumber = parseInt(compNum);

    if (comp.subcomponents) {
      const compNode: TreeNode = {
        id: `cmp-${segmentId}-${segmentIdx}-${fieldNum}-${repeatIdx}-${componentNumber}`,
        label: `Component ${componentNumber}`,
        value: comp.raw,
        level: 'component',
        path: {
          segment: segmentId,
          field: fieldNum,
          repeat: repeatIdx,
          component: componentNumber,
        },
        isExpandable: true,
        children: Object.entries(comp.subcomponents).map(([subNum, subVal]) => ({
          id: `sub-${segmentId}-${segmentIdx}-${fieldNum}-${repeatIdx}-${componentNumber}-${subNum}`,
          label: `Subcomponent ${subNum}`,
          value: subVal as string,
          level: 'subcomponent' as const,
          path: {
            segment: segmentId,
            field: fieldNum,
            repeat: repeatIdx,
            component: componentNumber,
            subcomponent: parseInt(subNum),
          },
          isExpandable: false,
        })),
      };
      nodes.push(compNode);
    } else {
      const compNode: TreeNode = {
        id: `cmp-${segmentId}-${segmentIdx}-${fieldNum}-${repeatIdx}-${componentNumber}`,
        label: `Component ${componentNumber}`,
        value: comp.raw,
        level: 'component',
        path: {
          segment: segmentId,
          field: fieldNum,
          repeat: repeatIdx,
          component: componentNumber,
        },
        isExpandable: false,
      };
      nodes.push(compNode);
    }
  }

  return nodes;
}

function selectNode(node: TreeNode) {
  selectedNodeId.value = node.id;
  emit('nodeSelected', node);
}

function filterTree() {
  // Implement search filtering
  // Show nodes matching search term
}

watch(
  () => props.parsedMessage,
  (newMsg) => {
    treeNodes.value = buildTree(newMsg);
  },
  { immediate: true }
);
</script>

<style scoped>
.parsed-message-viewer {
  border: 1px solid #ccc;
  border-radius: 4px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  height: 100%;
}

.header {
  padding: 12px;
  border-bottom: 1px solid #eee;
  background: #f9f9f9;
}

.header h3 {
  margin: 0 0 8px 0;
  font-size: 14px;
  font-weight: 600;
}

.header input {
  width: 100%;
  padding: 4px 8px;
  border: 1px solid #ddd;
  border-radius: 3px;
  font-size: 12px;
}

.tree-container {
  flex: 1;
  overflow-y: auto;
  padding: 8px;
  font-family: 'Monaco', 'Menlo', monospace;
  font-size: 12px;
}

.empty-state {
  padding: 20px;
  text-align: center;
  color: #999;
}
</style>
```

### Tree Node Component

```vue
<!-- components/TreeNode.vue -->

<template>
  <div class="tree-node">
    <div
      class="node-content"
      :class="{ selected }"
      @click="toggleExpand"
    >
      <span class="expander">
        <i v-if="node.isExpandable" class="icon">
          {{ expanded ? '▼' : '▶' }}
        </i>
        <span v-else class="icon-spacer"></span>
      </span>

      <span class="label">{{ node.label }}</span>
      <span class="value">{{ truncate(node.value, 40) }}</span>

      <button
        v-if="node.level !== 'segment'"
        class="copy-btn"
        @click.stop="copyPath"
        title="Copy path to clipboard"
      >
        📋
      </button>
    </div>

    <div v-if="expanded && node.children?.length" class="children">
      <TreeNode
        v-for="child in node.children"
        :key="child.id"
        :node="child"
        :selected="child.id === selectedNodeId"
        @select="$emit('select', $event)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import type { TreeNode } from '@/types/parsedMessage';

const props = defineProps<{
  node: TreeNode;
  selected?: boolean;
  selectedNodeId?: string;
}>();

const emit = defineEmits<{
  select: [node: TreeNode];
}>();

const expanded = ref(false);

function toggleExpand() {
  if (props.node.isExpandable) {
    expanded.value = !expanded.value;
  }
  emit('select', props.node);
}

function truncate(text: string, length: number) {
  return text.length > length ? text.substring(0, length) + '...' : text;
}

function copyPath() {
  const pathStr = JSON.stringify(props.node.path);
  navigator.clipboard.writeText(pathStr);
}
</script>

<style scoped>
.tree-node {
  user-select: none;
}

.node-content {
  padding: 4px 8px;
  cursor: pointer;
  border-radius: 2px;
  display: flex;
  align-items: center;
  gap: 4px;
  transition: background-color 0.15s;
}

.node-content:hover {
  background-color: #f0f0f0;
}

.node-content.selected {
  background-color: #e8f5ff;
  border-left: 2px solid #2196f3;
  padding-left: 6px;
}

.expander {
  display: inline-flex;
  width: 16px;
  align-items: center;
  justify-content: center;
}

.icon {
  font-size: 12px;
}

.icon-spacer {
  display: inline-block;
  width: 12px;
}

.label {
  font-weight: 600;
  color: #333;
  min-width: 80px;
}

.value {
  color: #666;
  font-size: 11px;
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
}

.copy-btn {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0 4px;
  font-size: 12px;
  opacity: 0.6;
  transition: opacity 0.2s;
}

.copy-btn:hover {
  opacity: 1;
}

.children {
  padding-left: 12px;
  margin-left: 4px;
  border-left: 1px solid #eee;
}
</style>
```

---

## Step 3: Mapping Interface

### Mapping Component

```vue
<!-- components/DriverMappingInterface.vue -->

<template>
  <div class="mapping-interface">
    <div class="mapping-column">
      <h4>Required Fields</h4>
      <div class="field-list">
        <div
          v-for="field in requiredFields"
          :key="field.name"
          class="field-card"
          :class="{ mapped: mappings[field.name] }"
          draggable
          @dragstart="startDrag($event, field.name)"
        >
          <span class="field-name">{{ field.label }}</span>
          <span v-if="mappings[field.name]" class="field-value">
            ✓ {{ getPathLabel(mappings[field.name]) }}
          </span>
          <span v-else class="field-empty">Empty</span>
        </div>
      </div>
    </div>

    <div class="mapping-controls">
      <div class="instruction">
        Click on a message field, then click a required field to map
      </div>
      <button
        v-if="selectedMessageNode"
        class="btn-map"
        @click="mapSelectedField"
        :disabled="!selectedRequiredField"
      >
        Map: {{ selectedMessageNode.label }} → {{ selectedRequiredField?.label }}
      </button>
      <button
        v-if="selectedMessageNode"
        class="btn-clear"
        @click="clearSelection"
      >
        Clear Selection
      </button>
    </div>

    <div class="mapping-options">
      <label v-if="selectedMapping">
        <input
          v-model="selectedMapping.optional"
          type="checkbox"
        >
        Optional Field
      </label>
      <label v-if="selectedMapping && selectedMapping.field === 'is_final_marker'">
        <span>Final Value Marker:</span>
        <input
          v-model="selectedMapping.final_value"
          type="text"
          placeholder="e.g., F"
        >
      </label>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import type { TreeNode, FieldPath } from '@/types/parsedMessage';

const props = defineProps<{
  selectedMessageNode: TreeNode | null;
}>();

const emit = defineEmits<{
  mappingChanged: [mappings: Record<string, DriverFieldMapping>];
}>();

interface DriverFieldMapping extends FieldPath {
  optional?: boolean;
  final_value?: string;
}

const requiredFields = [
  { name: 'sample_id', label: 'Sample ID' },
  { name: 'test_code', label: 'Test Code' },
  { name: 'test_keyword', label: 'Test Keyword' },
  { name: 'result', label: 'Result' },
  { name: 'unit', label: 'Unit' },
  { name: 'date_tested', label: 'Date Tested' },
  { name: 'tester_name', label: 'Tester Name' },
  { name: 'is_final_marker', label: 'Is Final Marker' },
];

const mappings = ref<Record<string, DriverFieldMapping>>({});
const selectedRequiredField = ref<string | null>(null);
const selectedMapping = ref<DriverFieldMapping | null>(null);

function startDrag(event: DragEvent, fieldName: string) {
  selectedRequiredField.value = fieldName;
  event.dataTransfer!.effectAllowed = 'move';
}

function mapSelectedField() {
  if (!props.selectedMessageNode || !selectedRequiredField.value) return;

  mappings.value[selectedRequiredField.value] = {
    ...props.selectedMessageNode.path,
  };

  selectedMapping.value = mappings.value[selectedRequiredField.value];
  emit('mappingChanged', mappings.value);
}

function clearSelection() {
  selectedRequiredField.value = null;
  selectedMapping.value = null;
}

function getPathLabel(path: FieldPath): string {
  let label = path.segment;
  if (path.field) label += `.${path.field}`;
  if (path.component) label += `.${path.component}`;
  if (path.subcomponent) label += `.${path.subcomponent}`;
  return label;
}
</script>

<style scoped>
.mapping-interface {
  padding: 16px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background: #fafafa;
}

.mapping-column {
  margin-bottom: 16px;
}

.mapping-column h4 {
  margin: 0 0 8px 0;
  font-size: 14px;
  font-weight: 600;
}

.field-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 8px;
}

.field-card {
  padding: 12px;
  background: white;
  border: 1px solid #ddd;
  border-radius: 4px;
  cursor: move;
  transition: all 0.2s;
}

.field-card:hover {
  border-color: #2196f3;
  background: #f5f5f5;
}

.field-card.mapped {
  border-color: #4caf50;
  background: #f1f8f5;
}

.field-name {
  display: block;
  font-weight: 600;
  font-size: 13px;
  margin-bottom: 4px;
}

.field-value {
  display: block;
  font-size: 11px;
  color: #4caf50;
}

.field-empty {
  display: block;
  font-size: 11px;
  color: #999;
  font-style: italic;
}

.mapping-controls {
  padding: 12px;
  background: white;
  border: 1px solid #eee;
  border-radius: 4px;
  margin-bottom: 12px;
}

.instruction {
  font-size: 12px;
  color: #666;
  margin-bottom: 8px;
}

.btn-map,
.btn-clear {
  padding: 6px 12px;
  margin-right: 8px;
  border: 1px solid #ddd;
  border-radius: 3px;
  background: white;
  cursor: pointer;
  font-size: 12px;
  transition: all 0.2s;
}

.btn-map {
  background: #2196f3;
  color: white;
  border-color: #2196f3;
}

.btn-map:hover:not(:disabled) {
  background: #1976d2;
}

.btn-map:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-clear:hover {
  border-color: #999;
  background: #f5f5f5;
}

.mapping-options {
  padding: 12px;
  background: white;
  border: 1px solid #eee;
  border-radius: 4px;
}

.mapping-options label {
  display: block;
  margin-bottom: 8px;
  font-size: 12px;
}

.mapping-options input[type="checkbox"] {
  margin-right: 6px;
}

.mapping-options input[type="text"] {
  padding: 4px 6px;
  border: 1px solid #ddd;
  border-radius: 3px;
  font-size: 11px;
  margin-left: 4px;
}
</style>
```

---

## Step 4: Driver JSON Generation & Preview

### Driver Builder Service

```typescript
// services/driverBuilder.ts

import type { FieldPath } from '@/types/parsedMessage';

export interface DriverFieldMapping extends FieldPath {
  optional?: boolean;
  final_value?: string;
}

export function buildDriver(
  mappings: Record<string, DriverFieldMapping>
): Record<string, any> {
  const driver: Record<string, any> = {};

  for (const [fieldName, mapping] of Object.entries(mappings)) {
    if (!mapping.segment || mapping.field === undefined) {
      continue; // Skip incomplete mappings
    }

    const fieldConfig: any = {
      segment: mapping.segment,
      field: mapping.field,
    };

    // Add optional fields
    if (mapping.repeat !== undefined && mapping.repeat !== null) {
      fieldConfig.repeat = mapping.repeat;
    }
    if (mapping.component !== undefined && mapping.component !== null) {
      fieldConfig.component = mapping.component;
    }
    if (mapping.subcomponent !== undefined && mapping.subcomponent !== null) {
      fieldConfig.subcomponent = mapping.subcomponent;
    }
    if (mapping.optional) {
      fieldConfig.optional = true;
    }
    if (mapping.final_value) {
      fieldConfig.final_value = mapping.final_value;
    }

    driver[fieldName] = fieldConfig;
  }

  return driver;
}

export function validateDriver(driver: Record<string, any>): string[] {
  const errors: string[] = [];

  // Required fields that should be mapped
  const requiredFields = ['sample_id', 'test_code', 'result'];

  for (const field of requiredFields) {
    if (!driver[field]) {
      errors.push(`Missing mapping for required field: ${field}`);
    } else {
      const fieldConfig = driver[field];
      if (!fieldConfig.segment || fieldConfig.field === undefined) {
        errors.push(`Invalid mapping for ${field}: missing segment or field`);
      }
    }
  }

  return errors;
}
```

### Driver Preview Component

```vue
<!-- components/DriverPreview.vue -->

<template>
  <div class="driver-preview">
    <div class="header">
      <h4>Driver Configuration (JSON)</h4>
      <button class="btn-copy" @click="copyDriver">
        📋 Copy JSON
      </button>
    </div>

    <div class="validation-messages" v-if="validationErrors.length">
      <div v-for="error in validationErrors" :key="error" class="error">
        ⚠️ {{ error }}
      </div>
    </div>

    <pre class="json-display">{{ JSON.stringify(driver, null, 2) }}</pre>

    <div class="statistics">
      <div class="stat">
        <span class="label">Fields Mapped:</span>
        <span class="value">{{ mappedFieldCount }}</span>
      </div>
      <div class="stat">
        <span class="label">Optional Fields:</span>
        <span class="value">{{ optionalFieldCount }}</span>
      </div>
      <div class="stat">
        <span class="label">Validation:</span>
        <span
          class="value"
          :class="{ valid: isValid, invalid: !isValid }"
        >
          {{ isValid ? '✓ Valid' : '✗ Invalid' }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { buildDriver, validateDriver } from '@/services/driverBuilder';
import type { DriverFieldMapping } from '@/services/driverBuilder';

const props = defineProps<{
  mappings: Record<string, DriverFieldMapping>;
}>();

const driver = computed(() => buildDriver(props.mappings));
const validationErrors = computed(() => validateDriver(driver.value));
const isValid = computed(() => validationErrors.value.length === 0);

const mappedFieldCount = computed(() => {
  return Object.keys(props.mappings).filter(
    k => props.mappings[k].segment && props.mappings[k].field
  ).length;
});

const optionalFieldCount = computed(() => {
  return Object.values(props.mappings).filter(m => m.optional).length;
});

function copyDriver() {
  const json = JSON.stringify(driver.value, null, 2);
  navigator.clipboard.writeText(json);
  // Show success message
}
</script>

<style scoped>
.driver-preview {
  padding: 16px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background: white;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.header h4 {
  margin: 0;
  font-size: 14px;
  font-weight: 600;
}

.btn-copy {
  padding: 4px 8px;
  background: #f5f5f5;
  border: 1px solid #ddd;
  border-radius: 3px;
  cursor: pointer;
  font-size: 12px;
  transition: all 0.2s;
}

.btn-copy:hover {
  background: #eee;
  border-color: #999;
}

.validation-messages {
  margin-bottom: 12px;
}

.error {
  padding: 8px;
  background: #fce4ec;
  border: 1px solid #f8bbd0;
  border-radius: 3px;
  color: #c2185b;
  font-size: 12px;
  margin-bottom: 4px;
}

.json-display {
  background: #f5f5f5;
  border: 1px solid #ddd;
  border-radius: 3px;
  padding: 12px;
  font-size: 11px;
  font-family: 'Monaco', 'Menlo', monospace;
  max-height: 300px;
  overflow-y: auto;
  margin-bottom: 12px;
  color: #333;
}

.statistics {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
}

.stat {
  padding: 8px;
  background: #fafafa;
  border: 1px solid #eee;
  border-radius: 3px;
  font-size: 12px;
}

.label {
  font-weight: 600;
  display: block;
  margin-bottom: 4px;
}

.value {
  color: #666;
}

.value.valid {
  color: #4caf50;
}

.value.invalid {
  color: #f44336;
}
</style>
```

---

## Step 5: Save Driver via GraphQL Mutation

### GraphQL Mutations

```graphql
# Update generic instrument driver
mutation UpdateInstrumentDriver(
  $uid: String!
  $driverMapping: JSON!
) {
  updateInstrument(
    uid: $uid
    input: {
      driverMapping: $driverMapping
    }
  ) {
    uid
    name
    driverMapping
  }
}

# Update lab-specific instrument driver
mutation UpdateLaboratoryInstrumentDriver(
  $uid: String!
  $driverMapping: JSON!
) {
  updateLaboratoryInstrument(
    uid: $uid
    input: {
      driverMapping: $driverMapping
    }
  ) {
    uid
    driverMapping
  }
}
```

### Composable for GraphQL Mutations

```typescript
// composables/useDriverMutation.ts

import { useMutation } from '@urql/vue';
import gql from 'graphql-tag';

const UPDATE_INSTRUMENT_DRIVER = gql`
  mutation UpdateInstrumentDriver(
    $uid: String!
    $driverMapping: JSON!
  ) {
    updateInstrument(
      uid: $uid
      input: {
        driverMapping: $driverMapping
      }
    ) {
      uid
      name
      driverMapping
    }
  }
`;

const UPDATE_LAB_INSTRUMENT_DRIVER = gql`
  mutation UpdateLaboratoryInstrumentDriver(
    $uid: String!
    $driverMapping: JSON!
  ) {
    updateLaboratoryInstrument(
      uid: $uid
      input: {
        driverMapping: $driverMapping
      }
    ) {
      uid
      driverMapping
    }
  }
`;

export function useDriverMutation() {
  const updateInstrument = useMutation(UPDATE_INSTRUMENT_DRIVER);
  const updateLabInstrument = useMutation(UPDATE_LAB_INSTRUMENT_DRIVER);

  const saveInstrumentDriver = async (uid: string, driver: Record<string, any>) => {
    const result = await updateInstrument.executeMutation({
      uid,
      driverMapping: driver,
    });

    return result;
  };

  const saveLabInstrumentDriver = async (uid: string, driver: Record<string, any>) => {
    const result = await updateLabInstrument.executeMutation({
      uid,
      driverMapping: driver,
    });

    return result;
  };

  return {
    saveInstrumentDriver,
    saveLabInstrumentDriver,
  };
}
```

---

## Step 6: Complete Editor Component

### Main Editor Component

```vue
<!-- components/DriverMappingEditor.vue -->

<template>
  <div class="driver-editor-container">
    <!-- Header -->
    <div class="editor-header">
      <h2>Configure ASTM/HL7 Driver Mapping</h2>
      <div class="info">
        <span v-if="instrumentName">
          Instrument: <strong>{{ instrumentName }}</strong>
        </span>
        <span v-if="isLabSpecific" class="lab-specific">
          Lab-Specific Override
        </span>
      </div>
    </div>

    <!-- Raw Message Input -->
    <div class="raw-message-section">
      <label>Raw ASTM/HL7 Message:</label>
      <textarea
        v-model="rawMessage"
        placeholder="Paste raw ASTM/HL7 message here..."
        rows="4"
        @change="parseMessage"
      ></textarea>
      <button @click="parseMessage" class="btn-parse">
        Parse Message
      </button>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="loading">
      Parsing message...
    </div>

    <!-- Error State -->
    <div v-if="parseError" class="error-banner">
      ❌ {{ parseError }}
    </div>

    <!-- Three-Panel Layout -->
    <div class="editor-layout" v-if="parsedMessage">
      <!-- Left Panel: Parsed Message Tree -->
      <div class="left-panel">
        <ParsedMessageTree
          :parsed-message="parsedMessage"
          @node-selected="selectedMessageNode = $event"
        />
      </div>

      <!-- Center Panel: Mapping Interface -->
      <div class="center-panel">
        <DriverMappingInterface
          :selected-message-node="selectedMessageNode"
          @mapping-changed="mappings = $event"
        />
      </div>

      <!-- Right Panel: Driver Preview -->
      <div class="right-panel">
        <DriverPreview :mappings="mappings" />
      </div>
    </div>

    <!-- Action Buttons -->
    <div class="action-buttons">
      <button
        @click="saveDriver"
        class="btn-save"
        :disabled="!isValid || isSaving"
      >
        {{ isSaving ? 'Saving...' : 'Save Driver' }}
      </button>
      <button
        @click="testDriver"
        class="btn-test"
        :disabled="!isValid"
      >
        Test Driver
      </button>
      <button @click="resetForm" class="btn-cancel">
        Cancel
      </button>
    </div>

    <!-- Test Results -->
    <div v-if="testResults" class="test-results">
      <h4>Test Results</h4>
      <pre>{{ JSON.stringify(testResults, null, 2) }}</pre>
    </div>

    <!-- Success Message -->
    <div v-if="successMessage" class="success-banner">
      ✓ {{ successMessage }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useMessageParser } from '@/composables/useMessageParser';
import { useDriverMutation } from '@/composables/useDriverMutation';
import { buildDriver, validateDriver } from '@/services/driverBuilder';
import ParsedMessageTree from './ParsedMessageTree.vue';
import DriverMappingInterface from './DriverMappingInterface.vue';
import DriverPreview from './DriverPreview.vue';
import type { TreeNode } from '@/types/parsedMessage';
import type { DriverFieldMapping } from '@/services/driverBuilder';

const props = defineProps<{
  instrumentUid?: string;
  instrumentName?: string;
  isLabSpecific?: boolean;
  initialDriver?: Record<string, any>;
}>();

const emit = defineEmits<{
  saved: [driver: Record<string, any>];
  cancelled: [];
}>();

const { parseMessage: parseMessageApi } = useMessageParser();
const { saveInstrumentDriver, saveLabInstrumentDriver } = useDriverMutation();

// State
const rawMessage = ref('');
const parsedMessage = ref<Record<string, any> | null>(null);
const mappings = ref<Record<string, DriverFieldMapping>>({});
const selectedMessageNode = ref<TreeNode | null>(null);
const isLoading = ref(false);
const isSaving = ref(false);
const parseError = ref('');
const successMessage = ref('');
const testResults = ref<any | null>(null);

// Computed
const driver = computed(() => buildDriver(mappings.value));
const validationErrors = computed(() => validateDriver(driver.value));
const isValid = computed(() => validationErrors.value.length === 0);

// Methods
async function parseMessage() {
  if (!rawMessage.value.trim()) {
    parseError.value = 'Please paste a raw message first';
    return;
  }

  isLoading.value = true;
  parseError.value = '';

  try {
    const result = await parseMessageApi(rawMessage.value);
    if (result.success) {
      parsedMessage.value = result.parsedMessage;
      // Reset mappings when new message parsed
      mappings.value = {};
      selectedMessageNode.value = null;
    } else {
      parseError.value = result.error || 'Failed to parse message';
    }
  } catch (error: any) {
    parseError.value = error.message || 'Error parsing message';
  } finally {
    isLoading.value = false;
  }
}

async function testDriver() {
  if (!isValid.value) return;

  isLoading.value = true;
  try {
    // Call backend to test driver with current raw message
    const result = await testDriverWithMessage(
      props.instrumentUid,
      rawMessage.value,
      driver.value
    );
    testResults.value = result;
  } finally {
    isLoading.value = false;
  }
}

async function saveDriver() {
  if (!isValid.value || !props.instrumentUid) return;

  isSaving.value = true;
  successMessage.value = '';

  try {
    let result;
    if (props.isLabSpecific) {
      result = await saveLabInstrumentDriver(props.instrumentUid, driver.value);
    } else {
      result = await saveInstrumentDriver(props.instrumentUid, driver.value);
    }

    if (result.error) {
      parseError.value = result.error;
    } else {
      successMessage.value = 'Driver saved successfully!';
      emit('saved', driver.value);
      // Reset form after successful save
      setTimeout(() => {
        resetForm();
      }, 2000);
    }
  } catch (error: any) {
    parseError.value = error.message || 'Error saving driver';
  } finally {
    isSaving.value = false;
  }
}

function resetForm() {
  rawMessage.value = '';
  parsedMessage.value = null;
  mappings.value = {};
  selectedMessageNode.value = null;
  parseError.value = '';
  successMessage.value = '';
  testResults.value = null;
}

// Load initial driver if provided
if (props.initialDriver) {
  // Convert driver back to mappings (reverse process)
  // This is optional, mainly for editing existing drivers
}
</script>

<style scoped>
.driver-editor-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 20px;
}

.editor-header {
  margin-bottom: 24px;
  border-bottom: 2px solid #eee;
  padding-bottom: 12px;
}

.editor-header h2 {
  margin: 0 0 8px 0;
  font-size: 20px;
}

.info {
  font-size: 12px;
  color: #666;
}

.lab-specific {
  background: #fff3cd;
  padding: 2px 6px;
  border-radius: 3px;
  margin-left: 8px;
  font-size: 11px;
  font-weight: 600;
}

.raw-message-section {
  margin-bottom: 24px;
  padding: 16px;
  background: #fafafa;
  border: 1px solid #eee;
  border-radius: 4px;
}

.raw-message-section label {
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
  font-size: 13px;
}

.raw-message-section textarea {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 3px;
  font-family: 'Monaco', 'Menlo', monospace;
  font-size: 12px;
  resize: vertical;
}

.btn-parse {
  margin-top: 8px;
  padding: 8px 16px;
  background: #2196f3;
  color: white;
  border: none;
  border-radius: 3px;
  cursor: pointer;
  font-size: 12px;
  font-weight: 600;
  transition: all 0.2s;
}

.btn-parse:hover {
  background: #1976d2;
}

.loading {
  padding: 20px;
  text-align: center;
  color: #2196f3;
  font-weight: 600;
}

.error-banner {
  padding: 12px 16px;
  background: #ffebee;
  border: 1px solid #ef5350;
  border-radius: 4px;
  color: #c62828;
  margin-bottom: 16px;
  font-size: 13px;
}

.success-banner {
  padding: 12px 16px;
  background: #e8f5e9;
  border: 1px solid #66bb6a;
  border-radius: 4px;
  color: #2e7d32;
  margin-top: 16px;
  font-size: 13px;
}

.editor-layout {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 16px;
  margin-bottom: 24px;
  height: 500px;
}

.left-panel,
.center-panel,
.right-panel {
  overflow: hidden;
  border: 1px solid #ddd;
  border-radius: 4px;
  background: white;
}

@media (max-width: 1200px) {
  .editor-layout {
    grid-template-columns: 1fr;
    height: auto;
    gap: 12px;
  }

  .left-panel,
  .center-panel,
  .right-panel {
    height: 400px;
  }
}

.action-buttons {
  display: flex;
  gap: 8px;
  margin-bottom: 24px;
}

.btn-save,
.btn-test,
.btn-cancel {
  padding: 10px 16px;
  border: 1px solid #ddd;
  border-radius: 3px;
  background: white;
  cursor: pointer;
  font-size: 12px;
  font-weight: 600;
  transition: all 0.2s;
}

.btn-save {
  background: #4caf50;
  color: white;
  border-color: #4caf50;
}

.btn-save:hover:not(:disabled) {
  background: #388e3c;
}

.btn-save:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-test {
  background: #ff9800;
  color: white;
  border-color: #ff9800;
}

.btn-test:hover:not(:disabled) {
  background: #f57c00;
}

.btn-test:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-cancel {
  background: #f5f5f5;
}

.btn-cancel:hover {
  border-color: #999;
  background: #eeeeee;
}

.test-results {
  padding: 16px;
  background: #f5f5f5;
  border: 1px solid #ddd;
  border-radius: 4px;
  margin-top: 16px;
}

.test-results h4 {
  margin: 0 0 12px 0;
  font-size: 13px;
  font-weight: 600;
}

.test-results pre {
  margin: 0;
  background: white;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 3px;
  font-size: 11px;
  overflow-x: auto;
  max-height: 200px;
  overflow-y: auto;
}
</style>
```

---

## Step 7: Message Parsing Endpoint (Backend)

Add this GraphQL query to the backend:

```python
# felicity/api/gql/instrument/query.py

import strawberry
from typing import Optional
from felicity.apps.iol.analyzer.services.transformer import MessageTransformer

@strawberry.type
class ParseMessageResult:
    success: bool
    parsed_message: Optional[dict] = None
    error: Optional[str] = None

@strawberry.type
class InstrumentQuery:
    @strawberry.field
    async def parse_message(self, raw_message: str) -> ParseMessageResult:
        """
        Parse raw ASTM/HL7 message into structured JSON without applying driver.
        Used by frontend for interactive mapping.
        """
        if not raw_message or not raw_message.strip():
            return ParseMessageResult(
                success=False,
                error="Raw message is empty"
            )

        try:
            transformer = MessageTransformer()
            parsed = transformer.parse_message(raw_message)
            return ParseMessageResult(
                success=True,
                parsed_message=parsed,
                error=None
            )
        except Exception as e:
            return ParseMessageResult(
                success=False,
                error=f"Failed to parse message: {str(e)}"
            )

    @strawberry.field
    async def test_driver(
        self,
        instrument_uid: str,
        raw_message: str,
        driver_mapping: dict
    ) -> ParseMessageResult:
        """
        Test driver mapping with actual raw message.
        Returns extracted results without persisting.
        """
        from felicity.apps.instrument.services import (
            InstrumentService, LaboratoryInstrumentService
        )

        try:
            transformer = MessageTransformer()

            # In real implementation, would fetch services properly
            result = await transformer.transform_message(
                raw_message,
                instrument_uid,
                lab_instrument_service=LaboratoryInstrumentService(),
                instrument_service=InstrumentService()
            )

            return ParseMessageResult(
                success=result['success'],
                parsed_message=result if result['success'] else None,
                error=result.get('error')
            )
        except Exception as e:
            return ParseMessageResult(
                success=False,
                error=f"Failed to test driver: {str(e)}"
            )
```

---

## Workflow Summary

### For Users

1. **Connect new instrument** → Receive first ASTM/HL7 message
2. **Open Driver Mapping Editor** → Paste raw message
3. **Parse Message** → See structured tree view
4. **Map Fields** → Click message fields and select required output fields
5. **Review Driver JSON** → See generated driver configuration
6. **Test Driver** → Verify extraction works correctly
7. **Save Driver** → Persists to instrument or laboratory instrument

### Data Flow

```
┌─────────────────────────────────────────────────────────────┐
│                     Vue Frontend                              │
├─────────────────────────────────────────────────────────────┤
│  1. User pastes raw message                                  │
│  2. Frontend sends: parseMessage(rawMessage)                 │
│     → Backend: transformer.parse_message()                   │
│     ← Returns: Parsed message JSON                           │
│  3. Frontend displays as interactive tree                    │
│  4. User clicks message field and selects required field     │
│  5. Frontend generates driver JSON                           │
│  6. Frontend sends: testDriver(instrumentUid, driver)        │
│     → Backend: transformer.transform_message()               │
│     ← Returns: Extracted results                             │
│  7. User saves: updateInstrument(uid, driverMapping)         │
│     → Backend persists to database                           │
└─────────────────────────────────────────────────────────────┘
```

---

## Key Decisions

### 1. Tree-Based Visualization
- Hierarchical display of parsed message
- Users can drill down to exact field/component/subcomponent
- Search/filter for large messages

### 2. Click-Based Mapping
- Intuitive: click message field → click required output field
- Visual feedback showing mapped fields
- Optional fields configurable per mapping

### 3. Real-Time Driver Preview
- Shows generated JSON as user maps fields
- Validation warnings for incomplete mappings
- Copy button for easy sharing

### 4. Test Before Save
- Users can verify extraction works correctly
- Shows actual extracted results with test data
- Prevents bad drivers from being saved

### 5. Lab-Specific Overrides
- UI distinguishes between generic and lab-specific drivers
- Same interface works for both scenarios
- Fallback logic transparent to user

---

## Implementation Checklist

### Backend Tasks
- [ ] Create `parseMessage` GraphQL query
- [ ] Create `testDriver` GraphQL query
- [ ] Add mutations for `updateInstrument(driverMapping)`
- [ ] Add mutations for `updateLaboratoryInstrument(driverMapping)`
- [ ] Ensure JSON type handling in GraphQL schema

### Frontend Tasks
- [ ] Create types for ParsedMessage structure
- [ ] Implement ParsedMessageTree component
- [ ] Implement TreeNode component with recursion
- [ ] Implement DriverMappingInterface component
- [ ] Implement DriverPreview component
- [ ] Implement driverBuilder service
- [ ] Implement DriverMappingEditor parent component
- [ ] Create useMessageParser composable
- [ ] Create useDriverMutation composable
- [ ] Add route for driver mapping editor
- [ ] Integrate into instrument management pages

### Testing Tasks
- [ ] Unit tests for driverBuilder service
- [ ] Tests for tree building logic
- [ ] Integration tests with real ASTM/HL7 samples
- [ ] End-to-end testing of mapping → save → extraction workflow

---

## Example Usage

### User Journey

```
1. Admin opens IOL Settings
2. Selects "Configure Instrument Drivers"
3. Selects instrument: "Sysmex Analyzer XE-5000"
4. Pastes first received ASTM message
5. Clicks "Parse Message"
   → Tree shows: H[0] > Field 1: "Sysmex", Field 2: "..."
   → Tree shows: P[0] > Field 3: "Order123", ...
   → Tree shows: R[0] > Field 2: "WBC", Field 3: "7.5", Field 4: "K/uL"
   → Tree shows: R[1] > Field 2: "RBC", Field 3: "4.2", Field 4: "M/uL"
6. Maps:
   - sample_id ← P[0] Field 3
   - test_code ← R[0] Field 2 (applies to all R segments)
   - result ← R[0] Field 3
   - unit ← R[0] Field 4
7. Sees driver JSON generated
8. Clicks "Test Driver"
   → Shows extracted: sample_id="Order123", results=[{test_code:"WBC", result:"7.5", unit:"K/uL"}, ...]
9. Clicks "Save Driver"
   → Driver persisted to Sysmex Analyzer instrument
10. All future messages from any lab using Sysmex auto-extracts using this driver
```

---

## Advanced Features (Future)

### Batch Mapping
- Map multiple similar segments at once
- Define patterns for extracting multiple results

### Driver Versioning
- Save multiple driver versions
- Rollback to previous version
- Comments/notes on driver changes

### Visual Mapping Builder
- Drag-and-drop from tree to fields
- Visual path indicator
- Validation warnings in-place

### Driver Templates
- Pre-built drivers for common instruments
- Community-shared drivers
- Import/export functionality

---

## Conclusion

The Vue.js frontend provides an intuitive visual interface for creating driver mappings without any coding. The workflow is straightforward:

1. **Parse** raw message into visible tree
2. **Map** message fields to output fields
3. **Preview** generated JSON driver
4. **Test** extraction works correctly
5. **Save** driver for future use

All driver generation and persistence is handled by the frontend and backend working together, enabling users to easily configure new instruments.
