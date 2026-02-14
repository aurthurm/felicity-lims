<script setup lang="ts">
interface Props {
  title: string;
  subtitle?: string;

}

const props = withDefaults(defineProps<Props>(), {
  subtitle: undefined
});
</script>

<template>
  <div class="mb-6">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-card-foreground">{{ title }}</h1>
        <div v-if="subtitle || $slots.subtitle" class="mt-1 text-sm text-muted-foreground">
          <slot name="subtitle">{{ subtitle }}</slot>
        </div>
      </div>
      <!-- Right side content  -->
      <div>
        <slot />
      </div>
    </div>
    <hr class="mt-1">
  </div>
</template>
  

  