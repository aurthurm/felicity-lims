<template>
  <img
    src="/webapp/assets/logo-white.svg"
    :class="styling"
    alt="Felicity LIMS LOGO"
  />
</template>

<script setup lang="ts">
defineProps({
  styling: {
    type: String,
    default: "h-12 w-12",
  }
});
</script>