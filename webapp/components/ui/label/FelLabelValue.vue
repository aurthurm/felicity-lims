<script setup lang="ts">
import { defineAsyncComponent } from 'vue';

const FelLink = defineAsyncComponent(
  () => import("@/components/nav/FelLink.vue")
)
defineProps(["label", "value", "link"]);
</script>

<template>
     <div class="flex justify-between">
        <span class="text-gray-800 text-sm font-semibold">{{label}}:</span>
        <FelLink v-if="link" :name="value" :routeName="link.name" :query="link.query" />
        <span v-else class="text-gray-600 text-sm md:text-md">{{value}}</span>
    </div>
</template>
