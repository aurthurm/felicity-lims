<script setup lang="ts">
import { ref, nextTick, watch } from 'vue';

interface Props {
  modelValue: string;
  disabled?: boolean;
  placeholder?: string;
  requiredClicks?: number;
  type?: string;
  id?: string;
  class?: string;
}

const props = withDefaults(defineProps<Props>(), {
  disabled: false,
  placeholder: '',
  requiredClicks: 3,
  type: 'text',
  id: '',
  class: '',
});

const emit = defineEmits<{
  'update:modelValue': [value: string];
}>();

// State
const isProtected = ref(true);
const inputValue = ref(props.modelValue);
const inputRef = ref<HTMLInputElement>();
const clickCount = ref(0);
const clickTimeout = ref<ReturnType<typeof setTimeout>>();

// Watch for external model changes
watch(() => props.modelValue, (newValue) => {
  inputValue.value = newValue;
});

// Handle clicks to unlock
const handleProtectedClick = (event: Event) => {
  if (props.disabled || !isProtected.value) return;
  
  event.preventDefault();
  event.stopPropagation();
  
  clickCount.value++;
  
  // Clear existing timeout
  if (clickTimeout.value) {
    clearTimeout(clickTimeout.value);
  }
  
  // Check if we reached required clicks
  if (clickCount.value >= props.requiredClicks) {
    unlockInput();
    return;
  }
  
  // Reset click count after timeout
  clickTimeout.value = setTimeout(() => {
    clickCount.value = 0;
  }, 1500);
};

// Unlock input for editing
const unlockInput = async () => {
  isProtected.value = false;
  clickCount.value = 0;
  if (clickTimeout.value) {
    clearTimeout(clickTimeout.value);
  }
  await nextTick();
  inputRef.value?.focus();
  inputRef.value?.select();
};

// Lock input (protect it again)
const lockInput = () => {
  isProtected.value = true;
  clickCount.value = 0;
  if (clickTimeout.value) {
    clearTimeout(clickTimeout.value);
  }
};

// Handle input changes
const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement;
  inputValue.value = target.value;
  emit('update:modelValue', target.value);
};

// Handle key events
const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Enter') {
    lockInput();
    inputRef.value?.blur();
  } else if (event.key === 'Escape') {
    inputValue.value = props.modelValue;
    emit('update:modelValue', props.modelValue);
    lockInput();
    inputRef.value?.blur();
  }
};

// Handle blur (lock when focus is lost)
const handleBlur = () => {
  setTimeout(() => {
    lockInput();
  }, 200);
};
</script>

<template>
  <div class="relative">
    <!-- Protected State -->
    <div
      v-if="isProtected"
      @click="handleProtectedClick"
      :class="[
        'relative cursor-pointer transition-all duration-200 group select-none',
        disabled 
          ? 'cursor-not-allowed opacity-50' 
          : 'hover:ring-2 hover:ring-primary/20 hover:bg-primary/5',
        clickCount > 0 && !disabled && 'ring-2 ring-primary/30 bg-primary/10'
      ]"
      :title="disabled ? 'Input is disabled' : `Click ${requiredClicks} times quickly to unlock for editing (${clickCount}/${requiredClicks})`"
    >
      <!-- Input Display -->
      <div
        :class="[
          'w-full px-3 py-2 bg-background border border-border rounded-md text-sm transition-colors duration-200',
          disabled
            ? 'bg-muted text-muted-foreground cursor-not-allowed'
            : clickCount > 0
            ? 'border-primary bg-primary/5 text-foreground'
            : 'text-foreground group-hover:border-primary/50'
        ]"
      >
        <span v-if="inputValue" class="text-foreground">{{ inputValue }}</span>
        <span v-else class="text-muted-foreground">{{ placeholder }}</span>
      </div>

      <!-- Lock/Progress Indicator -->
      <div
        v-if="!disabled"
        class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none"
      >
        <!-- Click Progress -->
        <div 
          v-if="clickCount > 0" 
          class="flex items-center space-x-1 bg-background/95 backdrop-blur-sm px-2 py-1 rounded-md shadow-sm border border-border"
        >
          <div class="flex space-x-1">
            <div 
              v-for="i in requiredClicks" 
              :key="i"
              :class="[
                'w-1.5 h-1.5 rounded-full transition-all duration-200',
                i <= clickCount ? 'bg-primary' : 'bg-muted'
              ]"
            />
          </div>
          <span class="text-xs text-muted-foreground ml-1">
            {{ requiredClicks - clickCount }} more
          </span>
        </div>

        <!-- Lock Icon -->
        <div 
          v-else
          class="text-muted-foreground bg-background/80 backdrop-blur-sm p-1 rounded transition-colors duration-200 group-hover:text-primary"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
          </svg>
        </div>
      </div>
    </div>

    <!-- Unlocked State -->
    <div v-else class="relative">
      <input
        ref="inputRef"
        :id="id"
        :value="inputValue"
        :type="type"
        :placeholder="placeholder"
        :disabled="disabled"
        @input="handleInput"
        @keydown="handleKeydown"
        @blur="handleBlur"
        class="w-full px-3 py-2 bg-background border-2 border-primary text-foreground rounded-md text-sm placeholder:text-muted-foreground transition-colors duration-200 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
      />
      
      <!-- Unlocked Icon -->
      <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
        <div class="text-primary bg-background/90 backdrop-blur-sm p-1 rounded">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2 2v6a2 2 0 002 2z"/>
          </svg>
        </div>
      </div>
    </div>
  </div>
</template>