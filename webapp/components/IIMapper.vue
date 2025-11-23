<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import useApiUtil from '@/composables/api_util';
import { 
  ParseAnalyserMessageMutation, ParseAnalyserMessageMutationVariables, ParseAnalyserMessageDocument,
  ExtractAnalyserMessageMutation, ExtractAnalyserMessageMutationVariables, ExtractAnalyserMessageDocument
} from '@/graphql/operations/iol.mutations';


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

type Separators = {
  field: string;
  component: string;
  repeat: string;
  escape: string;
  subcomponent: string;
}

type MappingKey = 'result' | 'keyword' | 'reference_range' | 'result_date' | 'units' | 'sample_id' | 'instrument' | 'result_status';

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

// API
const { withClientMutation } = useApiUtil();

// Reactive state
const parsedMessage = ref<ParsedMessage | null>(null);
const parsedSeparators = ref<Separators | null>(null);
const rawInput = ref('');
const isLoading = ref(false);
const parseError = ref('');
const mappings = ref<FieldMapping>({
  result: [],
  keyword: [],
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
  { key: 'keyword' as MappingKey, label: 'Keyword', color: 'bg-red-100 border-red-300' },
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

// Debug: Log parsed message structure
const showDebugInfo = ref(false);
const debugInfo = computed(() => {
  if (!parsedMessage.value) return null;
  const firstSegmentKey = Object.keys(parsedMessage.value)[0];
  if (!firstSegmentKey) return null;
  const firstSegment = parsedMessage.value[firstSegmentKey]?.[0];
  return {
    segmentKey: firstSegmentKey,
    segment: firstSegment,
    fieldsKeys: firstSegment?.fields ? Object.keys(firstSegment.fields) : [],
    sampleStructure: firstSegment?.fields?.['0'] ? JSON.stringify(firstSegment.fields['0'], null, 2) : 'Field 0 not found'
  };
});

// Parse path string to driver config
function parsePathToConfig(path: string): any {
  // Supported path formats from frontend rendering:
  // 1. "PID[0].fields.3" -> segment, field
  // 2. "OBX[0].fields.5.components.1" -> segment, field, component
  // 3. "OBX[0].fields.5.components.1.subcomponents.1" -> segment, field, component, subcomponent
  // 4. "OBX[0].fields.3.repeats[0].raw" -> segment, field, repeat (backend structured data)
  // 5. "OBX[0].fields.3.repeats[0].components.1.raw" -> segment, field, repeat, component (backend structured data)

  const config: any = {
    segment: undefined,
    field: undefined,
    component: undefined,
    subcomponent: undefined,
  };

  // Parse segment name and index: "PID[0]" or "OBX[0]"
  const segmentMatch = path.match(/^(\w+)\[(\d+)\]/);
  if (!segmentMatch) return null;
  config.segment = segmentMatch[1];

  // Parse field: "fields.3"
  const fieldMatch = path.match(/\.fields\.(\d+)/);
  if (fieldMatch) {
    config.field = parseInt(fieldMatch[1]);
  }

  // Parse component: "components.1"
  const componentMatch = path.match(/\.components\.(\d+)/);
  if (componentMatch) {
    config.component = parseInt(componentMatch[1]);
  }

  // Parse subcomponent: "subcomponents.1"
  const subcomponentMatch = path.match(/\.subcomponents\.(\d+)/);
  if (subcomponentMatch) {
    config.subcomponent = parseInt(subcomponentMatch[1]);
  }

  // Remove undefined fields to keep config clean
  Object.keys(config).forEach(key => {
    if (config[key] === undefined) {
      delete config[key];
    }
  });

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
    withClientMutation<ParseAnalyserMessageMutation, ParseAnalyserMessageMutationVariables>(ParseAnalyserMessageDocument, { message: rawInput.value } ,"parseAnalyserMessage")
    .then((result) => {
      console.log(result);
      if (result && result.message) {
        parsedSeparators.value = result.seperators as any;
        parsedMessage.value = result.message as any;
        // Clear previous mappings when new message is parsed
        mappings.value = {
          result: [],
          keyword: [],
          reference_range: [],
          result_date: [],
          units: [],
          sample_id: [],
          instrument: [],
          result_status: []
        };
        extractedData.value = null;
      } else {
        parseError.value = 'Failed to parse message';
        parsedMessage.value = null;
        parsedSeparators.value = null;
      }
    });
  } catch (err) {
    console.error('Parse error:', err);
    parseError.value = 'Failed to parse message';
    parsedMessage.value = null;
    parsedSeparators.value = null;
  } finally {
    isLoading.value = false;
  }
}

// Render segment fields (adapted from React version)
function renderSegmentFields(segment: ParsedSegment, segmentKey: string, segmentIndex: number): Array<{type: string, content: string, path?: string}> {
  const parts: Array<{type: string, content: string, path?: string}> = [];
  const raw = segment.raw || '';
  const fields = raw.split(parsedSeparators.value?.field!);

  fields.forEach((field: string, fieldIndex: number) => {
    // Check if we have field data from the parser
    const fieldData = segment.fields?.[String(fieldIndex)];

    if (fieldIndex > 0) {
      parts.push({ type: 'separator', content: parsedSeparators.value?.field! });
    }

    // If we have structured field data with repeats, use it
    if (fieldData?.repeats) {
      const repeats = field.split(parsedSeparators.value?.repeat!);
      const fieldRepeats = fieldData.repeats;

      repeats.forEach((repeat: string, repeatIndex: number) => {
        if (repeatIndex > 0) {
          parts.push({ type: 'separator', content: parsedSeparators.value?.repeat! });
        }

        const path = `${segmentKey}[${segmentIndex}].fields.${fieldIndex}.repeats[${repeatIndex}].raw`;

        // Check if this repeat has components in the parsed data
        if (repeatIndex < fieldRepeats.length && fieldRepeats[repeatIndex]?.components) {
          // Split by backslash for components
          const components = repeat.split(parsedSeparators.value?.component!);

          components.forEach((compStr: string, compIndex: number) => {
            if (compIndex > 0) {
              parts.push({ type: 'separator', content: parsedSeparators.value?.component! });
            }

            const compPath = `${segmentKey}[${segmentIndex}].fields.${fieldIndex}.repeats[${repeatIndex}].components.${compIndex + 1}.raw`;
            parts.push({
              type: 'button',
              content: compStr,
              path: compPath
            });
          });
        } else {
          // No components, render repeat itself
          parts.push({ type: 'button', content: repeat, path: path });
        }
      });
    } else {
      // Fallback: Parse the raw field string on the frontend
      // Split by ^ (component separator) for components
      const components = field.split(parsedSeparators.value?.component!);

      if (components.length > 1) {
        // Field has components
        components.forEach((comp: string, compIndex: number) => {
          if (compIndex > 0) {
            parts.push({ type: 'separator', content: parsedSeparators.value?.component! });
          }

          // Split by & (subcomponent separator) for subcomponents
          const subcomponents = comp.split(parsedSeparators.value?.subcomponent!);

          if (subcomponents.length > 1) {
            // Component has subcomponents
            subcomponents.forEach((subcomp: string, subcompIndex: number) => {
              if (subcompIndex > 0) {
                parts.push({ type: 'separator', content: parsedSeparators.value?.subcomponent! });
              }

              const subcompPath = `${segmentKey}[${segmentIndex}].fields.${fieldIndex}.components.${compIndex + 1}.subcomponents.${subcompIndex + 1}`;
              parts.push({
                type: 'button',
                content: subcomp,
                path: subcompPath
              });
            });
          } else {
            // No subcomponents, render component itself
            const compPath = `${segmentKey}[${segmentIndex}].fields.${fieldIndex}.components.${compIndex + 1}`;
            parts.push({
              type: 'button',
              content: comp,
              path: compPath
            });
          }
        });
      } else {
        // Simple field with no components
        const path = fieldIndex === 0
          ? `${segmentKey}[${segmentIndex}]`
          : `${segmentKey}[${segmentIndex}].fields.${fieldIndex}`;

        parts.push({
          type: 'button',
          content: field,
          path: path
        });
      }
    }
  });

  return parts;
}

// Handle field click
function handleFieldClick(path: string) {
  selectedPath.value = path;
  showMappingModal.value = true;
}

// Handle button hover
function handleButtonHover(event: MouseEvent, isEnter: boolean) {
  const btn = event.currentTarget as HTMLButtonElement;
  if (!btn) return;

  if (isEnter) {
    btn.style.backgroundColor = 'rgba(253, 224, 71, 1)';
    btn.style.borderColor = 'rgb(234, 179, 8)';
    btn.style.fontWeight = '500';
  } else {
    btn.style.backgroundColor = 'rgba(253, 224, 71, 0)';
    btn.style.borderColor = 'rgba(209, 213, 219, 0.5)';
    btn.style.fontWeight = '400';
  }
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

  withClientMutation<ExtractAnalyserMessageMutation, ExtractAnalyserMessageMutationVariables>(
    ExtractAnalyserMessageDocument, { message: rawInput.value, driver: JSON.stringify(driverMapping.value) } ,"extractAnalyserMessage")
    .then((result) => {
      console.log(result);
      if (result && result.message) {
        extractedData.value = result.message as any;
        parseError.value = '';
      } else {
        parseError.value = 'Failed to extract data';
        extractedData.value = null;
      }
  });
}

// Download driver mapping (the formatted driver config that will be saved)
function downloadMappingConfig() {
  const config = {
    driver: driverMapping.value,
    timestamp: new Date().toISOString()
  };
  const blob = new Blob([JSON.stringify(config, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'driver-mapping.json';
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

// Clear all
function clearAll() {
  rawInput.value = '';
  parsedMessage.value = null;
  extractedData.value = null;
  parseError.value = '';
  mappings.value = {
    result: [],
    keyword: [],
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
  <fel-modal v-if="isOpen" @close="emit('close')" contentWidth="w-full max-w-7xl">
    <template v-slot:header>
      <h3 class="text-lg font-semibold text-foreground">
        Driver Mapper - {{ instrumentInterface?.laboratoryInstrument?.labName || 'Instrument' }}
      </h3>
    </template>

    <template v-slot:body>
      <div class="space-y-4">
        <!-- Raw Message Input -->
        <div class="">
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

        <!-- Debug Info Toggle -->
        <div class="flex gap-2">
          <button
            @click="showDebugInfo = !showDebugInfo"
            class="px-3 py-1 text-xs bg-gray-400 text-white rounded hover:bg-gray-500 transition"
          >
            {{ showDebugInfo ? 'Hide' : 'Show' }} Debug Info
          </button>
        </div>

        <!-- Debug Info Panel -->
        <div v-if="showDebugInfo && debugInfo" class="bg-gray-100 border border-gray-300 rounded p-3 text-xs font-mono">
          <div class="mb-2">
            <strong>First Segment:</strong> {{ debugInfo.segmentKey }}
          </div>
          <div class="mb-2">
            <strong>Field Keys:</strong> {{ debugInfo.fieldsKeys.join(', ') }}
          </div>
          <div class="mb-2">
            <strong>Sample Field Structure (Field 0):</strong>
            <pre class="bg-white border border-gray-200 p-2 rounded mt-1 overflow-auto max-h-40">{{ debugInfo.sampleStructure }}</pre>
          </div>
          <div>
            <strong>Full Parsed Message:</strong>
            <pre class="bg-white border border-gray-200 p-2 rounded mt-1 overflow-auto max-h-64">{{ JSON.stringify(parsedMessage, null, 2) }}</pre>
          </div>
        </div>

        <!-- Three Column Layout -->
        <div v-if="parsedMessage" class="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <!-- Left: Parsed Message Segments -->
          <div class="col-span-1 bg-white border border-border rounded-lg shadow p-4 max-h-[500px] overflow-auto">
            <h4 class="text-md font-semibold mb-3 sticky top-0 bg-white pb-2 border-b">Parsed Message Segments</h4>
            <div class="space-y-3 font-mono text-xs">
              <template v-for="(segments, skey) in parsedMessage" :key="skey">
                <div class="mb-6">
                  <template v-for="(segment, sIdx) in segments" :key="`${skey}-${sIdx}`">
                    <div class="mb-3">
                      <div class="font-bold text-blue-600 mb-2">{{ skey }}:</div>
                      
                      <!-- Render clickable segment -->
                      <div v-if="!segment.fields" class="ml-4">
                        <button
                          @click="handleFieldClick(`${skey}[${sIdx}].raw`)"
                          class="hover:bg-yellow-200 px-1 rounded transition-colors"
                        >
                          "{{ segment.raw }}"
                        </button>
                      </div>
                      
                      <div v-else class="ml-4 mt-2 font-mono text-sm break-all">
                        <template v-for="(fieldPart, idx) in renderSegmentFields(segment, skey as string, sIdx)" :key="`fld-${skey}-${sIdx}-${idx}`">
                          <!-- Separator -->
                          <span v-if="fieldPart.type === 'separator'" class="text-gray-400 select-none">{{ fieldPart.content }}</span>
                          <!-- Clickable button -->
                          <button
                            v-else-if="fieldPart.type === 'button' && fieldPart.path"
                            type="button"
                            @click.stop="handleFieldClick(fieldPart.path)"
                            @mouseenter="(e) => handleButtonHover(e as MouseEvent, true)"
                            @mouseleave="(e) => handleButtonHover(e as MouseEvent, false)"
                            class="inline px-1.5 py-0.5 rounded cursor-pointer transition-all duration-200 font-mono text-sm"
                            style="background-color: rgba(253, 224, 71, 0); border: 1px solid rgba(209, 213, 219, 0.5);"
                          >
                            {{ fieldPart.content }}
                          </button>
                          <!-- Plain text -->
                          <span v-else>{{ fieldPart.content }}</span>
                        </template>
                      </div>
                    </div>
                  </template>
                </div>
              </template>
              
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
            <!-- Driver JSON -->
            <div class="mb-4">
              <div class="flex items-center justify-between mb-2">
                <h5 class="text-sm font-semibold text-gray-700">Driver Configuration:</h5>
                <button
                  v-if="Object.keys(driverMapping).length > 0"
                  @click="downloadMappingConfig"
                  class="px-2 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition"
                  title="Download driver configuration"
                >
                  Download
                </button>
              </div>
              <pre class="bg-gray-50 border border-gray-200 p-2 rounded text-xs overflow-auto max-h-[250px]">{{ JSON.stringify(driverMapping, null, 2) }}</pre>
            </div>

            <!-- Extracted Data -->
            <div class="mb-4">
              <div class="flex items-center justify-between mb-2">
                <h5 class="text-sm font-semibold text-gray-700">Extracted Data:</h5>
                <button
                  v-if="extractedData"
                  @click="downloadExtractedData"
                  class="px-2 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700 transition"
                  title="Download extracted data"
                >
                  Download
                </button>
              </div>
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
    class="fixed inset-0 bg-black50 flex items-center justify-center z-50"
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
