<script setup lang="ts">
  import { ref, computed, defineAsyncComponent } from 'vue';
  const tabUsers = defineAsyncComponent(
    () => import('./UsersListing.vue')
  )
  const tabGroups = defineAsyncComponent(
    () => import('./Groups.vue')
  )
  const tabPermissions = defineAsyncComponent(
    () => import('./Permissions.vue')
  )

  let currentTab = ref<string>('users');
  const tabs: string[] = ['users', 'groups', 'permissions'];
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
                'no-underline text-muted-foreground uppercase tracking-wide font-bold text-xs py-1 px-4 tab hover:bg-sky-600 hover:text-gray-200',
                { 'tab-active': currentTab === tab },
              ]"
              @click="currentTab = tab"
             
            >
              {{ tab }}
            </a>
          </div>
        </nav>

        <tab-users v-if="currentTab === 'users'"/>
        <tab-groups v-if="currentTab === 'groups'" />
        <tab-permissions v-if="currentTab === 'permissions'" />

  </div>
</template>
