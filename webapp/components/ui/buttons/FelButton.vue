<template>
  <button
    :class="buttonClasses"
    :disabled="disabled || loading"
  >
    <div class="flex items-center justify-center gap-2">
      <div v-if="loading" 
           class="w-4 h-4 border-2 border-t-transparent rounded-full animate-spin"
           :class="`border-${color}`"
      ></div>
      <span :class="{ 'opacity-0': loading && loadingOnly }">
        <slot />
      </span>
    </div>
  </button>
</template>

<script lang="ts">
import { defineComponent, computed } from "vue";

export default defineComponent({
  name: "FButton",
  props: {
    color: {
      type: String,
      required: true,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    loading: {
      type: Boolean,
      default: false,
    },
    loadingOnly: {
      type: Boolean,
      default: false, // If true, hides text content while loading
    },
  },
  setup(props) {
    const buttonClasses = computed(() => [
      "px-2 py-1 mr-2 border transition duration-300 focus:outline-none disabled:opacity-50 relative",
      props.disabled || props.loading
        ? "cursor-not-allowed"
        : `border-${props.color} text-${props.color} hover:bg-${props.color} hover:text-primary-foreground`,
    ]);

    return {
      buttonClasses,
    };
  },
});
</script>