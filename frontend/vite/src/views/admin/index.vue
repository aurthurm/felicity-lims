<script setup lang="ts">
  import { computed } from 'vue';
  import { useLocationStore } from '../../stores';
  
  const locationStore = useLocationStore()
  const resetSelected = () => locationStore.updateConfRoute("");
  const selectedRoute = computed(() => locationStore.getConfRoute)
</script>

<template>
  <div class="">
    <div class="flex justify-start">
      <span @click="resetSelected" class="mr-4">
        <router-link to="/admin" class="no-underline">
          <h4>Felicity Configurations</h4>
        </router-link>
      </span>
      <span v-if="selectedRoute">&rarr;</span> 
      <span class="ml-4"> {{ selectedRoute }}</span>
    </div>
    <hr>
    <router-view />
  </div>
</template>