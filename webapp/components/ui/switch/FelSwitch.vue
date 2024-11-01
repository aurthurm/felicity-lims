<template>
  <div 
    class="flex items-center" 
    :class="[
      reverse ? 'flex-row-reverse justify-end' : 'gap-x-3'
    ]"
  >
    <label 
      :for="id" 
      class="text-medium text-gray-700 flex items-center"
      :class="[
        reverse ? 'gap-x-reverse gap-x-2' : 'gap-x-2'
      ]"
    >
      <div 
        class="relative inline-block w-8 align-middle select-none transition duration-200 ease-in"
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
          class="toggle-checkbox absolute block w-4 h-4 rounded-full bg-white border-4 border-gray-300 appearance-none cursor-pointer outline-none transition duration-200 ease-in"
          :class="{
            'translate-x-full': modelValue,
            'border-blue-500': modelValue,
            'bg-white border-gray-300': !modelValue
          }"
        />
        <label
          :for="id"
          class="toggle-label block overflow-hidden h-4 rounded-full cursor-pointer"
          :class="{
            'bg-blue-300': modelValue,
            'bg-gray-300': !modelValue
          }"
        ></label>
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