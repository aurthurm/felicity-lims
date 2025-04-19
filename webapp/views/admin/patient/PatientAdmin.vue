<script setup lang="ts">
import { ref, computed, defineAsyncComponent } from 'vue';
const tabPersonIdentification = defineAsyncComponent(
  () => import('./PersonIdentification.vue')
)

let currentTab = ref<string>('person-identification');
const tabs: string[] = ['person-identification'];
let currentTabComponent = computed(() => 'tab-' + currentTab.value);

</script>

<template>
  <div class="mt-4">

    <nav class="bg-white shadow-md mt-2">
      <div class="-mb-px flex justify-start">
        <a v-for="tab in tabs" :key="tab" :class="[
          'no-underline text-muted-foreground uppercase tracking-wide font-bold text-xs py-1 px-4 tab hover:bg-sky-600 hover:text-gray-200',
          { 'tab-active': currentTab === tab },
        ]" @click="currentTab = tab">
          {{ tab }}
        </a>
      </div>
    </nav>

    <tab-person-identification v-if="currentTab === 'person-identification'" />

  </div>
</template>
