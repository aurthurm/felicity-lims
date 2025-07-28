<script setup lang="ts">
import { computed } from "vue";

interface Option {
  value: string | number;
  label: string;
  disabled?: boolean;
  group?: string;
}

interface Props {
  label: string;
  modelValue: string | number | string[] | number[];
  options: Option[];
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  error?: string;
  helpText?: string;
  multiple?: boolean;
  searchable?: boolean;
  clearable?: boolean;
  id?: string;
}

interface Emits {
  (e: "update:modelValue", value: string | number | string[] | number[]): void;
  (e: "change", value: string | number | string[] | number[]): void;
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: "Select an option...",
  required: false,
  disabled: false,
  error: "",
  helpText: "",
  multiple: false,
  searchable: false,
  clearable: false,
});

const emit = defineEmits<Emits>();

const selectId = computed(() => props.id || `select-${Math.random().toString(36).substr(2, 9)}`);

const selectClasses = computed(() => [
  "flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm",
  "ring-offset-background focus-visible:outline-none focus-visible:ring-2",
  "focus-visible:ring-ring focus-visible:ring-offset-2",
  "disabled:cursor-not-allowed disabled:opacity-50",
  "transition-colors duration-200",
  props.error 
    ? "border-destructive focus-visible:ring-destructive" 
    : "border-input hover:border-accent-foreground/50"
]);

const groupedOptions = computed(() => {
  const groups: Record<string, Option[]> = {};
  const ungrouped: Option[] = [];

  props.options.forEach(option => {
    if (option.group) {
      if (!groups[option.group]) {
        groups[option.group] = [];
      }
      groups[option.group].push(option);
    } else {
      ungrouped.push(option);
    }
  });

  return { groups, ungrouped };
});

const selectedLabels = computed(() => {
  if (!props.modelValue) return "";
  
  if (Array.isArray(props.modelValue)) {
    return props.modelValue
      .map(value => props.options.find(opt => opt.value === value)?.label)
      .filter(Boolean)
      .join(", ");
  }
  
  return props.options.find(opt => opt.value === props.modelValue)?.label || "";
});

const updateValue = (event: Event) => {
  const target = event.target as HTMLSelectElement;
  
  if (props.multiple) {
    const values = Array.from(target.selectedOptions).map(option => option.value);
    emit("update:modelValue", values);
    emit("change", values);
  } else {
    emit("update:modelValue", target.value);
    emit("change", target.value);
  }
};

const clearSelection = () => {
  if (props.multiple) {
    emit("update:modelValue", []);
    emit("change", []);
  } else {
    emit("update:modelValue", "");
    emit("change", "");
  }
};

const isSelected = (value: string | number) => {
  if (Array.isArray(props.modelValue)) {
    return props.modelValue.includes(value);
  }
  return props.modelValue === value;
};
</script>

<template>
  <div class="space-y-2">
    <!-- Label -->
    <label 
      :for="selectId" 
      class="text-sm font-medium text-foreground"
      :class="{ 'text-destructive': error }"
    >
      {{ label }}
      <span v-if="required" class="text-destructive ml-1">*</span>
    </label>

    <!-- Select Container -->
    <div class="relative">
      <!-- Multiple Select (Custom) -->
      <div v-if="multiple" class="space-y-2">
        <!-- Selected Values Display -->
        <div 
          :class="selectClasses"
          class="min-h-[2.5rem] h-auto py-2 cursor-pointer"
          @click="$refs.hiddenSelect?.focus()"
        >
          <div v-if="selectedLabels" class="flex flex-wrap gap-1">
            <span 
              v-for="(value, index) in (modelValue as string[] | number[])" 
              :key="index"
              class="inline-flex items-center rounded-md bg-primary/10 text-primary px-2 py-1 text-xs font-medium"
            >
              {{ options.find(opt => opt.value === value)?.label }}
              <button
                type="button"
                @click.stop="updateValue({ target: { selectedOptions: (modelValue as string[] | number[]).filter(v => v !== value).map(v => ({ value: v })) } } as any)"
                class="ml-1 hover:text-primary/80"
              >
                <i class="fas fa-times"></i>
              </button>
            </span>
          </div>
          <span v-else class="text-muted-foreground">{{ placeholder }}</span>
        </div>

        <!-- Hidden Select for Form Validation -->
        <select
          ref="hiddenSelect"
          :id="selectId"
          :multiple="true"
          :required="required"
          :disabled="disabled"
          class="sr-only"
          @change="updateValue"
        >
          <option 
            v-for="option in options" 
            :key="option.value" 
            :value="option.value"
            :selected="isSelected(option.value)"
            :disabled="option.disabled"
          >
            {{ option.label }}
          </option>
        </select>

        <!-- Options List -->
        <div class="border border-input rounded-md max-h-48 overflow-y-auto">
          <div class="p-2 space-y-1">
            <label 
              v-for="option in options" 
              :key="option.value"
              class="flex items-center space-x-2 p-2 hover:bg-accent rounded cursor-pointer"
              :class="{ 'opacity-50': option.disabled }"
            >
              <input
                type="checkbox"
                :value="option.value"
                :checked="isSelected(option.value)"
                :disabled="option.disabled"
                @change="updateValue"
                class="h-4 w-4 text-primary focus:ring-ring border-gray-300 rounded"
              />
              <span class="text-sm">{{ option.label }}</span>
            </label>
          </div>
        </div>
      </div>

      <!-- Single Select -->
      <select
        v-else
        :id="selectId"
        :value="modelValue"
        :required="required"
        :disabled="disabled"
        :class="selectClasses"
        @change="updateValue"
      >
        <option value="" disabled>{{ placeholder }}</option>
        
        <!-- Ungrouped Options -->
        <option 
          v-for="option in groupedOptions.ungrouped" 
          :key="option.value" 
          :value="option.value"
          :disabled="option.disabled"
        >
          {{ option.label }}
        </option>

        <!-- Grouped Options -->
        <optgroup 
          v-for="(groupOptions, groupName) in groupedOptions.groups" 
          :key="groupName" 
          :label="groupName"
        >
          <option 
            v-for="option in groupOptions" 
            :key="option.value" 
            :value="option.value"
            :disabled="option.disabled"
          >
            {{ option.label }}
          </option>
        </optgroup>
      </select>

      <!-- Clear Button -->
      <button
        v-if="clearable && modelValue && !disabled"
        type="button"
        @click="clearSelection"
        class="absolute right-8 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
      >
        <i class="fas fa-times"></i>
      </button>

      <!-- Dropdown Icon -->
      <div class="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground pointer-events-none">
        <i class="fas fa-chevron-down"></i>
      </div>
    </div>

    <!-- Error Message -->
    <p v-if="error" class="text-sm text-destructive flex items-center">
      <i class="fas fa-exclamation-circle mr-1"></i>
      {{ error }}
    </p>

    <!-- Help Text -->
    <p v-else-if="helpText" class="text-sm text-muted-foreground">
      {{ helpText }}
    </p>
  </div>
</template>

<style scoped>
.transition-colors {
  transition-property: color, background-color, border-color;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 200ms;
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
</style>