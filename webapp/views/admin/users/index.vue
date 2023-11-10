<script setup lang="ts">
  import { ref, computed, defineAsyncComponent } from 'vue';
  const tabUsers = defineAsyncComponent(
    () => import('./Users.vue')
  )
  const tabGroups = defineAsyncComponent(
    () => import('./Groups.vue')
  )

  let currentTab = ref<string>('users');
  const tabs: string[] = ['users', 'groups'];
  let currentTabComponent = computed(() => 'tab-' + currentTab.value);
</script>


<template>
  <div class="mt-4">

        <nav class="bg-white shadow-md mt-2">
          <div class="-mb-px flex justify-start">
            <a
              v-for="tab in tabs"
              :key="tab"
              :class="[
                'no-underline text-gray-500 uppercase tracking-wide font-bold text-xs py-1 px-4 tab hover:bg-sky-600 hover:text-gray-200',
                { 'tab-active': currentTab === tab },
              ]"
              @click="currentTab = tab"
              href="#"
            >
              {{ tab }}
            </a>
          </div>
        </nav>

        <tab-users v-if="currentTab === 'users'"/>
        <tab-groups v-if="currentTab === 'groups'" />

  </div>
</template>
