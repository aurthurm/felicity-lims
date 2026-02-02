<script setup lang="ts">
import { Separator } from "@/components/ui/separator";
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
        <p v-if="subtitle" class="mt-1 text-sm text-muted-foreground">{{ subtitle }}</p>
      </div>
      <!-- Right side content  -->
      <div>
        <slot />
      </div>
    </div>
    <Separator class="mt-1" />
  </div>
</template>
  

  
