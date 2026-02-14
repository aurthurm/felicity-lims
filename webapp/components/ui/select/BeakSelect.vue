<template>
    <label class="flex flex-col space-y-2">
      <span class="text-sm font-medium text-foreground">{{ label }}</span>
      <select
        :name="name"
        v-model="modelValue"
        class="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground 
               placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring 
               disabled:cursor-not-allowed disabled:opacity-50"
        :disabled="disabled"
      >
        <option v-for="(option, idx) in options" :key="idx" :value="option.value" class="bg-background text-foreground">
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
  