<template>
  <img
    src="/webapp/assets/logo-white.svg"
    :class="styling"
    alt="Beak LIMS LOGO"
    role="img"
    aria-label="Beak LIMS Logo"
  />
</template>

<script setup lang="ts">
interface Props {
  styling?: string;
}

withDefaults(defineProps<Props>(), {
  styling: "h-12 w-12"
});
</script>