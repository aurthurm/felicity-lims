<template>
  <img
    :src="variant === 'dark' ? logoBlackUrl : logoWhiteUrl"
    :class="styling"
    alt="Felicity LIMS LOGO"
    role="img"
    aria-label="Felicity LIMS Logo"
  />
</template>

<script setup lang="ts">
import logoWhiteUrl from '@/assets/logo-white.svg'
import logoBlackUrl from '@/assets/logo-black.svg'

interface Props {
  styling?: string;
  /** Use "dark" for light backgrounds (e.g. white), "light" for dark backgrounds (e.g. gradient) */
  variant?: 'light' | 'dark';
}

withDefaults(defineProps<Props>(), {
  styling: "h-12 w-12",
  variant: "light"
});
</script>