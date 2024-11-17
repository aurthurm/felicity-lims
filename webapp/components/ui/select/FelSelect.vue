<template>
    <label class="flex justify-between items-center">
      <span class="text-gray-700 mr-2">{{ label }}</span>
      <select
        :name="name"
        v-model="modelValue"
        class="form-input mt-1 block w-full py-1 disabled:opacity-50"
        :disabled="disabled"
      >
        <option v-for="option in options" :key="option.key || option.value" :value="option.value">
          {{ option.label }}
        </option>
      </select>
    </label>
  </template>
  
  <script lang="ts">
  import { defineComponent } from "vue";
  
  export default defineComponent({
    name: "GenericSelect",
    props: {
      label: {
        type: String,
        required: true,
      },
      name: {
        type: String,
        required: true,
      },
      modelValue: {
        type: [String, Number, null],
        required: true,
      },
      options: {
        type: Array as () => Array<{ key?: string | number; value: string | number; label: string }>,
        required: true,
      },
      disabled: {
        type: Boolean,
        default: false,
      },
    },
    emits: ["update:modelValue"],
    setup(props, { emit }) {
      const updateValue = (value: string | number | null) => {
        emit("update:modelValue", value);
      };
  
      return {
        updateValue,
      };
    },
  });
  </script>
  