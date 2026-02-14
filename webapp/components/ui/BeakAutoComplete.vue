<template>
  <div class="relative w-full" :class="{ 'open': openSuggestion }">
    <div class="relative">
      <input
        type="text"
        v-model="query"
        :class="[
          'w-full rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring',
          sizeClasses[size]
        ]"
        :placeholder="placeholder"
        :id="id"
        :aria-label="ariaLabel || placeholder"
        :aria-expanded="openSuggestion"
        :aria-controls="`${id}-listbox`"
        :aria-activedescendant="openSuggestion ? `${id}-option-${current}` : undefined"
        role="combobox"
        autocomplete="off"
        @keydown.enter="enter"
        @keydown.down.prevent="down"
        @keydown.up.prevent="up"
        @keydown.esc="close"
        @input="change"
        @blur="handleBlur"
      />
      <div
        v-if="loading"
        class="absolute inset-y-0 right-0 flex items-center pr-3"
      >
        <svg
          class="h-4 w-4 animate-spin text-muted-foreground"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <circle
            class="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            stroke-width="4"
          ></circle>
          <path
            class="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
      </div>
    </div>

    <ul
      v-if="openSuggestion"
      :id="`${id}-listbox`"
      role="listbox"
      class="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-lg border border-border bg-card py-1 text-base shadow-lg focus:outline-none sm:text-sm"
      @mousedown.prevent
    >
      <li
        v-for="(suggestion, index) in matches"
        :key="index"
        :id="`${id}-option-${index}`"
        role="option"
        :aria-selected="isActive(index)"
        class="relative cursor-pointer select-none px-3 py-2 text-sm"
        :class="{
          'bg-accent text-accent-foreground': isActive(index),
          'text-foreground hover:bg-accent/50': !isActive(index)
        }"
        @mousedown.prevent="suggestionClick(index)"
        @mousemove="current = index"
      >
        <span class="block truncate">{{ suggestion }}</span>
      </li>
      <li
        v-if="matches.length === 0"
        class="relative cursor-default select-none px-3 py-2 text-sm text-muted-foreground"
        role="alert"
      >
        No results found
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

interface Props {
  suggestions: string[];
  modelValue: string;
  placeholder?: string;
  loading?: boolean;
  size?: 'sm' | 'md' | 'lg';
  id?: string;
  ariaLabel?: string;
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: 'Search...',
  loading: false,
  size: 'md',
  id: `fel-autocomplete-${Math.random().toString(36).slice(2, 11)}`
});

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void;
  (e: 'select', value: string): void;
}>();

const query = computed({
  get: () => props.modelValue,
  set: (value: string) => emit('update:modelValue', value)
});

const open = ref(false);
const current = ref(0);

const sizeClasses = {
  sm: 'px-2 py-1 text-sm',
  md: 'px-3 py-2 text-base',
  lg: 'px-4 py-3 text-lg'
} as const;

const matches = computed(() => 
  props.suggestions?.filter(str => 
    str.toLowerCase().includes(props.modelValue.toLowerCase())
  ) ?? []
);

const openSuggestion = computed(() => 
  props.modelValue !== "" && 
  matches.value.length > 0 && 
  open.value
);

function enter(): void {
  if (matches.value[current.value]) {
    query.value = matches.value[current.value];
    emit('select', matches.value[current.value]);
    close();
  }
}

function up(): void {
  if (current.value > 0) {
    current.value--;
  } else {
    current.value = matches.value.length - 1;
  }
}

function down(): void {
  if (current.value < matches.value.length - 1) {
    current.value++;
  } else {
    current.value = 0;
  }
}

function isActive(index: number): boolean {
  return index === current.value;
}

function change(): void {
  if (!open.value) {
    open.value = true;
    current.value = 0;
  }
}

function suggestionClick(index: number): void {
  query.value = matches.value[index];
  emit('select', matches.value[index]);
  close();
}

function close(): void {
  open.value = false;
  current.value = 0;
}

function handleBlur(): void {
  // Delay closing to allow click events to fire
  setTimeout(() => {
    close();
  }, 200);
}
</script>
