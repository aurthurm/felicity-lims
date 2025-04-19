<script setup lang="ts">
  import { ref, computed, defineAsyncComponent } from 'vue';
  const tabCodingStandard = defineAsyncComponent(
    () => import('./CodingStandard.vue')
  )

  let currentTab = ref<string>('coding-standard');
  const tabs: string[] = ['coding-standard'];
  let currentTabComponent = computed(() => 'tab-' + currentTab.value);

 </script>

<template>
  <div class="mt-4">

        <nav class="bg-background shadow-md mt-2">
          <div class="-mb-px flex justify-start">
            <a
              v-for="tab in tabs"
              :key="tab"
              :class="[
                'no-underline text-muted-foreground uppercase tracking-wide font-bold text-xs py-1 px-4 tab hover:bg-primary hover:text-muted-foreground',
                { 'tab-active': currentTab === tab },
              ]"
              @click="currentTab = tab"
             
            >
              {{ tab }}
            </a>
          </div>
        </nav>

        <tab-coding-standard v-if="currentTab === 'coding-standard'"/>

  </div>

</template>
