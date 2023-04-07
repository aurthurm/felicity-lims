<script setup lang="ts">
  import PatientForm from './PatientForm.vue';
</script>

<template>
  <section class="w-3/6">
    <h1 class="h1 my-4 font-bold text-dark-700">Add New Patient:</h1>
    <PatientForm :navigate="true" />
  </section>
</template>



