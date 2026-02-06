<script setup lang="ts">
import { defineAsyncComponent } from 'vue';

defineOptions({ name: 'StorageView' });

const ContainerView = defineAsyncComponent(() => import('./ContainerView.vue'));
</script>

<template>
  <ContainerView />
</template>
