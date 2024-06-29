<script setup lang="ts">
import { defineAsyncComponent } from 'vue';
const FelLabelValue = defineAsyncComponent(
  () => import("@/components/ui/label/FelLabelValue.vue")
)

defineProps(["items"]);
</script>

<template>
    <div class="grid grid-cols-3 gap-x-4 mt-2">
        <div class="col-span-1">
            <FelLabelValue v-for="item in items" :key="item.label" :label="item.label" :value="item.value" :link="item?.link" />
        </div>
    </div>
</template>
