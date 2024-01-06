<script setup lang="ts">
import { defineAsyncComponent } from "vue";
const PageHeading = defineAsyncComponent(
  () => import("../components/PageHeading.vue")
)
const tabSamples = defineAsyncComponent(
  () => import("../components/SampleListing.vue")
)
</script>

<template>
  <page-heading title="Samples" />
  <tab-samples />
</template>

<style lang="postcss"></style>
