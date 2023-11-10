<template>
  <button
    :class="[
      'px-2 py-1 mr-2 border transition duration-300 hover:text-white focus:outline-none',
      'border-' + color,
      'text-' + color,
      'hover:bg-' + color,
    ]"
  >
    <slot />
  </button>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "FButton",
  props: {
    color: {
      type: String,
      required: true,
    },
  },
  setup(props) {},
});
</script>
