<script setup lang="ts">
const props = defineProps(["errandUid"]);
</script>

<template>
  <div class="space-y-6">
    <div 
      v-for="(activity, index) in activities" 
      :key="index" 
      class="relative pl-6 pb-6 border-l-2 border-border last:pb-0"
    >
      <!-- Timeline dot -->
      <div class="absolute left-0 top-0 transform -translate-x-1/2 bg-background p-1 border border-border rounded-full w-4 h-4 flex items-center justify-center">
        <div class="w-2 h-2 bg-primary rounded-full"></div>
      </div>
      
      <!-- Activity content -->
      <div class="space-y-1">
        <div class="text-sm text-muted-foreground">
          Occurred {{ activity.time }} by {{ activity.by }}
        </div>
        <p class="text-sm text-foreground italic">
          {{ activity.action }}
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.space-y-6 > :not([hidden]) ~ :not([hidden]) {
  margin-top: 1.5rem;
}

.space-y-1 > :not([hidden]) ~ :not([hidden]) {
  margin-top: 0.25rem;
}
</style>