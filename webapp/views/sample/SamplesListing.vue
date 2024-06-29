<script setup lang="ts">
import { defineAsyncComponent } from "vue";
const PageHeading = defineAsyncComponent(
  () => import("@/components/common/FelPageHeading.vue")
)
const tabSamples = defineAsyncComponent(
  () => import("@/components/sample/FelSampleListing.vue")
)
</script>

<template>
  <page-heading title="Samples" />
  <tab-samples />
</template>

<style lang="postcss"></style>
