<template>
  <div 
    class="flex items-center" 
    :class="[
      reverse ? 'flex-row-reverse justify-end' : 'gap-x-3'
    ]"
  >
    <label 
      :for="id" 
      class="text-sm font-medium text-foreground flex items-center"
      :class="[
        reverse ? 'gap-x-reverse gap-x-2' : 'gap-x-2'
      ]"
    >
      <div 
        class="relative inline-block w-9 h-5 align-middle select-none transition duration-200 ease-in"
        :class="[
          reverse ? 'order-first' : 'order-last'
        ]"
      >
        <input
          :id="id"
          :name="name"
          type="checkbox"
          :checked="modelValue"
          @change="updateValue"
          class="peer sr-only"
        />
        <div
          class="absolute inset-0 rounded-full transition-colors duration-200 ease-in"
          :class="{
            'bg-primary': modelValue,
            'bg-muted': !modelValue
          }"
        ></div>
        <div
          class="absolute left-0.5 top-0.5 h-4 w-4 rounded-full transition-transform duration-200 ease-in bg-background shadow-sm ring-0"
          :class="{
            'translate-x-4': modelValue
          }"
        ></div>
      </div>
      <span>{{ label }}</span>
    </label>
  </div>
</template>

<script setup>
const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  label: {
    type: String,
    default: ''
  },
  name: {
    type: String,
    default: 'toggle'
  },
  id: {
    type: String,
    default: () => `toggle-${Math.random().toString(36).substr(2, 9)}`
  },
  reverse: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['update:modelValue']);

const updateValue = (event) => {
  emit('update:modelValue', event.target.checked);
};
</script>