<script setup lang="ts">
import { defineAsyncComponent } from 'vue';
const PatientForm = defineAsyncComponent(
  () => import('@/components/person/PatientForm.vue')
)
</script>

<template>
  <div class="space-y-6">
    <section class="max-w-3xl mx-auto bg-background rounded-lg shadow-sm p-6 space-y-6">
      <h1 class="text-2xl font-semibold text-foreground">Add Patient Form</h1>
      <PatientForm :navigate="true" />
    </section>
  </div>
</template>



