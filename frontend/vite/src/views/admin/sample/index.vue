<template>
  <div class="mt-4">

        <nav class="bg-white px-6 pt-2 shadow-md mt-2">
          <div class="-mb-px flex justify-start">
            <a
              v-for="tab in tabs"
              :key="tab"
              :class="[
                'no-underline text-gray-500 uppercase tracking-wide font-bold text-xs py-1 mr-8 tab',
                { 'tab-active': currentTab === tab },
              ]"
              @click="currentTab = tab"
              href="#"
            >
              {{ tab }}
            </a>
          </div>
        </nav>

        <tab-sample-types v-if="currentTab === 'sample-types'"/>
        <tab-container-types v-if="currentTab === 'container-types'" />

  </div>

</template>

<style lang="postcss">

</style>

<script src="./sample.component.ts" lang="ts"></script>
