<script setup lang="ts">
const props = defineProps(["errandUid"]);
</script>

<template>
<div v-for="(activity, index) in activities" :key="index" class="pl-6 border-l-2 border-border relative pb-6">
    <div class="absolute left-0 top-0 transform -translate-x-1/2 bg-background p-1 border border-border rounded-full w-4 h-4 flex items-center justify-center">
    <div class="w-2 h-2 bg-accent rounded-full"></div>
    </div>
    <div>
    <div class="text-sm text-muted-foreground">occured {{ activity.time }} by {{ activity.by }}</div>
    <p class="text-sm italic">{{ activity.action }}</p>
    </div>
</div>
</template>