<template>
  <button
    :class="buttonClasses"
    :disabled="disabled"
  >
    <slot />
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
  },
  setup(props) {
    const buttonClasses = computed(() => [
      "px-2 py-1 mr-2 border transition duration-300 focus:outline-none disabled:opacity-50",
      props.disabled
        ? ""
        : `border-${props.color} text-${props.color} hover:bg-${props.color} hover:text-white`,
    ]);

    return {
      buttonClasses,
    };
  },
});
</script>
