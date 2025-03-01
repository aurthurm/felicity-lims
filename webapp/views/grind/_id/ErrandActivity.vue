<script setup lang="ts">
import { onMounted } from 'vue';

const props = defineProps(["errandUid"]);

onMounted(() => {
    console.log('ErrandMilestone.vue');
});
</script>

<template>
<div v-for="(activity, index) in activities" :key="index" class="pl-6 border-l-2 border-gray-200 relative pb-6">
    <div class="absolute left-0 top-0 transform -translate-x-1/2 bg-white p-1 border border-blue-300 rounded-full w-4 h-4 flex items-center justify-center">
    <div class="w-2 h-2 bg-blue-500 rounded-full"></div>
    </div>
    <div>
    <div class="text-sm text-gray-500">occured {{ activity.time }} by {{ activity.by }}</div>
    <p class="text-sm italic">{{ activity.action }}</p>
    </div>
</div>
</template>