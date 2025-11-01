<script setup lang="ts">
import { ref, computed, watch } from 'vue';

// Types
type ParsedSegment = {
  raw: string;
  fields?: Record<string, ParsedField>;
};

type ParsedField = {
  raw: string;
  repeats?: ParsedRepeat[];
};

type ParsedRepeat = {
  raw: string;
  components?: Record<string, ParsedComponent>;
};

type ParsedComponent = {
  raw: string;
  subcomponents?: Record<string, string>;
};

type ParsedMessage = {
  [segmentId: string]: ParsedSegment[];
};

type MappingKey = 'result' | 'reference_range' | 'result_date' | 'units' | 'sample_id' | 'instrument' | 'result_status';

interface FieldMapping {
  [key: string]: string[];
}

interface ExtractedData {
  [key: string]: any;
}

// Props
interface Props {
  isOpen: boolean;
  instrumentInterface: any;
}

const props = defineProps<Props>();

// Emits
const emit = defineEmits<{
  close: [];
  save: [driverMapping: Record<string, any>];
}>();

// Reactive state
const parsedMessage = ref<ParsedMessage | null>(null);
const rawInput = ref('');
const isLoading = ref(false);
const parseError = ref('');
const mappings = ref<FieldMapping>({
  result: [],
  reference_range: [],
  result_date: [],
  units: [],
  sample_id: [],
  instrument: [],
  result_status: []
});
const extractedData = ref<ExtractedData | null>(null);
const selectedPath = ref<string | null>(null);
const showMappingModal = ref(false);

// Target fields configuration
const targetFields = [
  { key: 'result' as MappingKey, label: 'Result', color: 'bg-blue-100 border-blue-300' },
  { key: 'reference_range' as MappingKey, label: 'Reference Range', color: 'bg-green-100 border-green-300' },
  { key: 'result_date' as MappingKey, label: 'Result Date', color: 'bg-purple-100 border-purple-300' },
  { key: 'units' as MappingKey, label: 'Units', color: 'bg-yellow-100 border-yellow-300' },
  { key: 'sample_id' as MappingKey, label: 'Sample ID', color: 'bg-pink-100 border-pink-300' },
  { key: 'instrument' as MappingKey, label: 'Instrument', color: 'bg-indigo-100 border-indigo-300' },
  { key: 'result_status' as MappingKey, label: 'Result Status (F=Final, P=Preliminary)', color: 'bg-orange-100 border-orange-300' }
];

// Computed driver mapping (from FRONTEND_DRIVER_MAPPING.md)
const driverMapping = computed(() => {
  const driver: Record<string, any> = {};
  
  for (const [fieldName, paths] of Object.entries(mappings.value)) {
    if (paths.length === 0) continue;
    
    // Take the first path (or can be configured to use all)
    const path = paths[0];
    const pathConfig = parsePathToConfig(path);
    
    if (pathConfig) {
      driver[fieldName] = pathConfig;
    }
  }
  
  return driver;
});

// Parse path string to driver config
function parsePathToConfig(path: string): any {
  // Path format: "OBX[0].fields.3.repeats[0].components.1.raw"
  // or simpler: "OBX[0].fields.3"
  
  const parts = path.split('.');
  const segmentMatch = parts[0].match(/^(\w+)\[(\d+)\]$/);
  
  if (!segmentMatch) return null;
  
  const segmentId = segmentMatch[1];
  const segmentIndex = parseInt(segmentMatch[2]);
  
  const config: any = {
    segment: segmentId,
    field: undefined,
    repeat: undefined,
    component: undefined,
    subcomponent: undefined
  };
  
  let fieldMatch = parts[1]?.match(/^fields\.(\d+)$/);
  if (fieldMatch) {
    config.field = parseInt(fieldMatch[1]);
  }
  
  if (parts[2] === 'repeats') {
    const repeatMatch = parts[3]?.match(/^\[(\d+)\]$/);
    if (repeatMatch) {
      config.repeat = parseInt(repeatMatch[1]);
    }
  }
  
  if (parts[4] === 'components') {
    const compMatch = parts[5]?.match(/^(\d+)$/);
    if (compMatch) {
      config.component = parseInt(compMatch[1]);
    }
  }
  
  if (parts[6] === 'subcomponents') {
    const subMatch = parts[7]?.match(/^(\d+)$/);
    if (subMatch) {
      config.subcomponent = parseInt(subMatch[1]);
    }
  }
  
  return config;
}

// Handle parsing
async function handleParse() {
  if (!rawInput.value.trim()) {
    parseError.value = 'Please paste a message first';
    return;
  }

  isLoading.value = true;
  parseError.value = '';
  
  try {
    // TODO: Replace with actual GraphQL query when backend is ready
    // For now, we'll use a mock parser
    const parsed = parseMessageMock(rawInput.value);
    parsedMessage.value = parsed;
    
    // Clear previous mappings when new message is parsed
    mappings.value = {
      result: [],
      reference_range: [],
      result_date: [],
      units: [],
      sample_id: [],
      instrument: [],
      result_status: []
    };
    extractedData.value = null;
  } catch (err) {
    console.error('Parse error:', err);
    parseError.value = 'Failed to parse message';
    parsedMessage.value = null;
  } finally {
    isLoading.value = false;
  }
}

// Mock parser - replace with actual GraphQL call
function parseMessageMock(rawMessage: string): ParsedMessage {
  // This is a simplified mock parser
  // In production, this would call the backend parseMessage GraphQL query
  
  const lines = rawMessage.trim().split('\n').filter(l => l.trim());
  const message: ParsedMessage = {};
  
  for (const line of lines) {
    const parts = line.split('|');
    if (parts.length === 0) continue;
    
    const segmentId = parts[0];
    const segment: ParsedSegment = {
      raw: line,
      fields: {}
    };
    
    for (let i = 1; i < parts.length; i++) {
      const fieldValue = parts[i];
      
      // Simple field parsing - check for repeats (^) and components (~)
      if (fieldValue.includes('^') || fieldValue.includes('~')) {
        segment.fields![i.toString()] = {
          raw: fieldValue,
          repeats: [{
            raw: fieldValue,
            components: parseComponents(fieldValue, '^')
          }]
        };
      } else {
        segment.fields![i.toString()] = { raw: fieldValue };
      }
    }
    
    if (!message[segmentId]) {
      message[segmentId] = [];
    }
    message[segmentId].push(segment);
  }
  
  return message;
}

function parseComponents(value: string, separator: string): Record<string, ParsedComponent> {
  const components: Record<string, ParsedComponent> = {};
  const parts = value.split(separator);
  
  for (let i = 0; i < parts.length; i++) {
    components[(i + 1).toString()] = { raw: parts[i] };
  }
  
  return components;
}

// Handle field click
function handleFieldClick(path: string) {
  selectedPath.value = path;
  showMappingModal.value = true;
}

// Add mapping
function addMapping(targetField: MappingKey) {
  if (selectedPath.value) {
    mappings.value[targetField] = [...mappings.value[targetField], selectedPath.value];
    showMappingModal.value = false;
    selectedPath.value = null;
  }
}

// Remove mapping
function removeMapping(targetField: MappingKey, index: number) {
  mappings.value[targetField] = mappings.value[targetField].filter((_, i) => i !== index);
}

// Extract values
function extractValues(obj: any, path: string): any {
  const parts = path.split('.');
  let current = obj;
  
  for (const part of parts) {
    if (current === null || current === undefined) return null;
    if (part.includes('[')) {
      const [key, indexStr] = part.split('[');
      const index = parseInt(indexStr.replace(']', ''));
      current = current[key]?.[index];
    } else {
      current = current[part];
    }
  }
  
  return current;
}

// Apply mappings
function applyMappings() {
  if (!parsedMessage.value) {
    parseError.value = 'Please parse a message first.';
    return;
  }

  const result: ExtractedData = {};
  
  for (const [field, paths] of Object.entries(mappings.value)) {
    if (paths.length === 0) continue;
    
    const values = paths.map(path => extractValues(parsedMessage.value, path)).filter(v => v !== null && v !== undefined);
    
    if (values.length === 1) {
      result[field] = values[0];
    } else if (values.length > 1) {
      result[field] = values;
    }
  }
  
  extractedData.value = result;
  parseError.value = '';
}

// Download mapping config
function downloadMappingConfig() {
  const config = { mappings: mappings.value, timestamp: new Date().toISOString() };
  const blob = new Blob([JSON.stringify(config, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'field-mappings.json';
  a.click();
}

// Download extracted data
function downloadExtractedData() {
  if (!extractedData.value) return;
  const blob = new Blob([JSON.stringify(extractedData.value, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'extracted-data.json';
  a.click();
}

// Render clickable segment (adapted from React)
function renderClickableSegment(segmentKey: string, segmentIndex: number, segment: ParsedSegment) {
  // This will be rendered in the template using v-for
  return { segmentKey, segmentIndex, segment };
}

// Clear all
function clearAll() {
  rawInput.value = '';
  parsedMessage.value = null;
  extractedData.value = null;
  parseError.value = '';
  mappings.value = {
    result: [],
    reference_range: [],
    result_date: [],
    units: [],
    sample_id: [],
    instrument: [],
    result_status: []
  };
  selectedPath.value = null;
  showMappingModal.value = false;
}

// Save driver mapping
function saveDriverMapping() {
  emit('save', driverMapping.value);
  emit('close');
}

// Watch for modal close
watch(() => props.isOpen, (newVal) => {
  if (!newVal) {
    clearAll();
  }
});
</script>

<template>
  <fel-modal v-if="isOpen" @close="emit('close')" size="xl">
    <template v-slot:header>
      <h3 class="text-lg font-semibold text-foreground">
        Driver Mapper - {{ instrumentInterface?.laboratoryInstrument?.labName || 'Instrument' }}
      </h3>
    </template>

    <template v-slot:body>
      <div class="space-y-4">
        <!-- Raw Message Input -->
        <div class="border border-border bg-background rounded-lg p-4">
          <h4 class="text-md font-semibold text-foreground mb-3">Paste ASTM/HL7 Message</h4>
          
          <textarea
            v-model="rawInput"
            placeholder='Paste your raw ASTM/HL7 message here'
            class="w-full h-32 p-3 border border-input rounded-md font-mono text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          />
          
          <div class="flex gap-2 mt-2">
            <button
              @click="handleParse"
              :disabled="isLoading"
              class="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition disabled:opacity-50"
            >
              {{ isLoading ? 'Parsing...' : 'Parse Message' }}
            </button>
            
            <button
              v-if="parsedMessage"
              @click="applyMappings"
              class="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
            >
              Extract Data
            </button>
            
            <button
              v-if="parsedMessage && Object.values(mappings).some(m => m.length > 0)"
              @click="downloadMappingConfig"
              class="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition"
            >
              Save Mappings
            </button>
            
            <button
              v-if="parsedMessage"
              @click="clearAll"
              class="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
            >
              Clear
            </button>
          </div>

          <div v-if="parseError" class="mt-2 p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
            ⚠️ {{ parseError }}
          </div>
        </div>

        <!-- Three Column Layout -->
        <div v-if="parsedMessage" class="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <!-- Left: Parsed Message Segments -->
          <div class="col-span-1 bg-white border border-border rounded-lg shadow p-4 max-h-[500px] overflow-auto">
            <h4 class="text-md font-semibold mb-3 sticky top-0 bg-white pb-2 border-b">Parsed Message</h4>
            <div class="space-y-3 font-mono text-xs">
              <div v-for="(segments, segmentKey) in parsedMessage" :key="segmentKey" class="mb-4">
                <div
                  v-for="(segment, segmentIndex) in segments"
                  :key="`${segmentKey}-${segmentIndex}`"
                  class="mb-3"
                >
                  <div class="font-bold text-blue-600 mb-1">{{ segmentKey }}[{{ segmentIndex }}]</div>
                  
                  <!-- Fields -->
                  <div v-if="segment.fields" class="ml-4 space-y-1">
                    <div
                      v-for="(field, fieldKey) in segment.fields"
                      :key="fieldKey"
                      class="hover:bg-gray-100 p-1 rounded cursor-pointer"
                    >
                      <span class="font-semibold text-purple-600">Field {{ fieldKey }}:</span>
                      
                      <!-- Simple field -->
                      <button
                        v-if="!field.repeats"
                        @click="handleFieldClick(`${segmentKey}[${segmentIndex}].fields.${fieldKey}.raw`)"
                        class="hover:bg-yellow-200 px-1 rounded transition-colors"
                      >
                        {{ field.raw || '(empty)' }}
                      </button>
                      
                      <!-- Field with repeats -->
                      <div v-else class="ml-2">
                        <div
                          v-for="(repeat, repeatIndex) in field.repeats"
                          :key="repeatIndex"
                        >
                          <!-- Has components -->
                          <div v-if="repeat.components" class="space-y-0.5">
                            <div
                              v-for="(comp, compKey) in repeat.components"
                              :key="compKey"
                              class="flex items-center gap-1"
                            >
                              <span class="text-gray-400">^</span>
                              <button
                                @click="handleFieldClick(`${segmentKey}[${segmentIndex}].fields.${fieldKey}.repeats[${repeatIndex}].components.${compKey}.raw`)"
                                class="hover:bg-yellow-200 px-1 rounded transition-colors"
                              >
                                {{ comp.raw || '(empty)' }}
                              </button>
                            </div>
                          </div>
                          
                          <!-- No components -->
                          <button
                            v-else
                            @click="handleFieldClick(`${segmentKey}[${segmentIndex}].fields.${fieldKey}.repeats[${repeatIndex}].raw`)"
                            class="hover:bg-yellow-200 px-1 rounded transition-colors"
                          >
                            {{ repeat.raw || '(empty)' }}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div class="p-2 bg-gray-100 rounded text-xs text-gray-600 mt-2">
                💡 Click on any field to map it to a target variable
              </div>
            </div>
          </div>

          <!-- Center: Field Mappings -->
          <div class="col-span-1 bg-white border border-border rounded-lg shadow p-4 max-h-[500px] overflow-auto">
            <h4 class="text-md font-semibold mb-3 sticky top-0 bg-white pb-2 border-b">Field Mappings</h4>
            <div class="space-y-3">
              <div
                v-for="field in targetFields"
                :key="field.key"
                :class="['border-2 rounded-lg p-3', field.color]"
              >
                <h5 class="font-semibold mb-2">{{ field.label }}</h5>
                <div v-if="mappings[field.key].length === 0" class="text-xs text-gray-500 italic">
                  No mappings. Click a field in the segments.
                </div>
                <div v-else class="space-y-1">
                  <div
                    v-for="(path, idx) in mappings[field.key]"
                    :key="idx"
                    class="flex items-center justify-between bg-white rounded p-2 text-xs"
                  >
                    <code class="font-mono text-gray-700 truncate flex-1">{{ path }}</code>
                    <button
                      @click="removeMapping(field.key, idx)"
                      class="p-1 hover:bg-red-100 rounded ml-2 text-red-600"
                      title="Remove mapping"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Right: Extracted Data & Driver Preview -->
          <div class="col-span-1 bg-white border border-border rounded-lg shadow p-4 max-h-[500px] overflow-auto">
            <div class="flex items-center justify-between mb-3 sticky top-0 bg-white pb-2 border-b">
              <h4 class="text-md font-semibold">Driver & Preview</h4>
              <button
                v-if="extractedData"
                @click="downloadExtractedData"
                class="px-2 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition"
              >
                Download
              </button>
            </div>
            
            <!-- Driver JSON -->
            <div class="mb-4">
              <h5 class="text-sm font-semibold mb-2 text-gray-700">Driver Configuration:</h5>
              <pre class="bg-gray-50 border border-gray-200 p-2 rounded text-xs overflow-auto max-h-[200px]">{{ JSON.stringify(driverMapping, null, 2) }}</pre>
            </div>
            
            <!-- Extracted Data -->
            <div class="mb-4">
              <h5 class="text-sm font-semibold mb-2 text-gray-700">Extracted Data:</h5>
              <pre v-if="extractedData" class="bg-gray-50 border border-gray-200 p-2 rounded text-xs overflow-auto max-h-[200px]">
                {{ JSON.stringify(extractedData, null, 2) }}
              </pre>
              <p v-else class="text-xs text-gray-500 italic">Click "Extract Data" to see results</p>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div v-else class="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
          <p class="text-gray-500">Paste a message and click "Parse Message" to begin</p>
        </div>
      </div>
    </template>

    <template v-slot:footer>
      <div class="flex justify-end gap-2">
        <button
          @click="emit('close')"
          class="px-4 py-2 border border-input rounded-md hover:bg-accent hover:text-accent-foreground transition"
        >
          Cancel
        </button>
        <button
          @click="saveDriverMapping"
          :disabled="!driverMapping || Object.keys(driverMapping).length === 0"
          class="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition disabled:opacity-50"
        >
          Save Driver Mapping
        </button>
      </div>
    </template>
  </fel-modal>

  <!-- Mapping Modal -->
  <div
    v-if="showMappingModal && selectedPath"
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    @click.self="showMappingModal = false"
  >
    <div class="bg-white rounded-lg shadow-xl p-6 max-w-2xl w-full mx-4">
      <h3 class="text-xl font-bold mb-4">Map Field to Target Variable</h3>
      
      <div class="mb-4 p-3 bg-gray-100 rounded">
        <p class="text-sm text-gray-600 mb-1">Selected Path:</p>
        <code class="text-sm font-mono text-blue-800 break-all">{{ selectedPath }}</code>
      </div>
      
      <div class="grid grid-cols-2 gap-3 mb-4 max-h-[400px] overflow-auto">
        <button
          v-for="field in targetFields"
          :key="field.key"
          @click="addMapping(field.key)"
          :class="['p-3 border-2 rounded-lg text-left hover:shadow-md transition', field.color]"
        >
          <span class="font-semibold">{{ field.label }}</span>
        </button>
      </div>
      
      <button
        @click="showMappingModal = false; selectedPath = null"
        class="w-full px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition"
      >
        Cancel
      </button>
    </div>
  </div>
</template>

<style scoped>
/* Additional custom styles if needed */
</style>
