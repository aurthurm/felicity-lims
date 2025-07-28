<script setup lang="ts">
import { computed } from "vue";

interface Props {
  label: string;
  modelValue: string | number;
  type?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  readonly?: boolean;
  error?: string;
  helpText?: string;
  icon?: string;
  prefix?: string;
  suffix?: string;
  maxLength?: number;
  minLength?: number;
  rows?: number; // For textarea
  autoComplete?: string;
  id?: string;
}

interface Emits {
  (e: "update:modelValue", value: string | number): void;
  (e: "blur", event: FocusEvent): void;
  (e: "focus", event: FocusEvent): void;
  (e: "input", event: Event): void;
  (e: "keyup", event: KeyboardEvent): void;
  (e: "keydown", event: KeyboardEvent): void;
}

const props = withDefaults(defineProps<Props>(), {
  type: "text",
  placeholder: "",
  required: false,
  disabled: false,
  readonly: false,
  error: "",
  helpText: "",
  icon: "",
  prefix: "",
  suffix: "",
  rows: 3,
  autoComplete: "off",
});

const emit = defineEmits<Emits>();

const inputId = computed(() => props.id || `input-${Math.random().toString(36).substr(2, 9)}`);

const inputClasses = computed(() => [
  "flex w-full rounded-md border bg-background px-3 py-2 text-sm ring-offset-background",
  "file:border-0 file:bg-transparent file:text-sm file:font-medium",
  "placeholder:text-muted-foreground",
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
  "disabled:cursor-not-allowed disabled:opacity-50",
  "transition-colors duration-200",
  props.type === "textarea" ? "min-h-[80px] resize-vertical" : "h-10",
  props.error 
    ? "border-destructive focus-visible:ring-destructive" 
    : "border-input hover:border-accent-foreground/50",
  props.readonly && "bg-muted cursor-default",
  (props.prefix || props.icon) && "pl-10",
  props.suffix && "pr-10"
]);

const updateValue = (event: Event) => {
  const target = event.target as HTMLInputElement | HTMLTextAreaElement;
  emit("update:modelValue", target.value);
  emit("input", event);
};

const handleBlur = (event: FocusEvent) => {
  emit("blur", event);
};

const handleFocus = (event: FocusEvent) => {
  emit("focus", event);
};

const handleKeyup = (event: KeyboardEvent) => {
  emit("keyup", event);
};

const handleKeydown = (event: KeyboardEvent) => {
  emit("keydown", event);
};
</script>

<template>
  <div class="space-y-2">
    <!-- Label -->
    <label 
      :for="inputId" 
      class="text-sm font-medium text-foreground"
      :class="{ 'text-destructive': error }"
    >
      {{ label }}
      <span v-if="required" class="text-destructive ml-1">*</span>
    </label>

    <!-- Input Container -->
    <div class="relative">
      <!-- Prefix Icon -->
      <div 
        v-if="icon || prefix" 
        class="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground pointer-events-none"
      >
        <i v-if="icon" :class="icon" class="text-sm"></i>
        <span v-else class="text-sm">{{ prefix }}</span>
      </div>

      <!-- Textarea -->
      <textarea
        v-if="type === 'textarea'"
        :id="inputId"
        :value="modelValue"
        :placeholder="placeholder"
        :required="required"
        :disabled="disabled"
        :readonly="readonly"
        :maxlength="maxLength"
        :minlength="minLength"
        :rows="rows"
        :autocomplete="autoComplete"
        :class="inputClasses"
        @input="updateValue"
        @blur="handleBlur"
        @focus="handleFocus"
        @keyup="handleKeyup"
        @keydown="handleKeydown"
      />

      <!-- Regular Input -->
      <input
        v-else
        :id="inputId"
        :type="type"
        :value="modelValue"
        :placeholder="placeholder"
        :required="required"
        :disabled="disabled"
        :readonly="readonly"
        :maxlength="maxLength"
        :minlength="minLength"
        :autocomplete="autoComplete"
        :class="inputClasses"
        @input="updateValue"
        @blur="handleBlur"
        @focus="handleFocus"
        @keyup="handleKeyup"
        @keydown="handleKeydown"
      />

      <!-- Suffix -->
      <div 
        v-if="suffix" 
        class="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground pointer-events-none"
      >
        <span class="text-sm">{{ suffix }}</span>
      </div>

      <!-- Character Count -->
      <div 
        v-if="maxLength && modelValue" 
        class="absolute right-3 bottom-2 text-xs text-muted-foreground pointer-events-none"
      >
        {{ modelValue.toString().length }}/{{ maxLength }}
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
</style>