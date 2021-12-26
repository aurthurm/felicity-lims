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

        <tab-analyses-profiles v-if="currentTab === 'analyses-profiles'"/>
        <tab-analyses-services v-else-if="currentTab === 'analyses-services'" />
        <tab-analyses-categories v-else-if="currentTab === 'analyses-categories'" />
        <tab-quality-control-levels v-else-if="currentTab === 'quality-control-levels'" />
        <tab-quality-control-templates v-else-if="currentTab === 'quality-control-templates'" />
        <tab-rejection-reasons v-else="currentTab === 'rejection-reasons'" />

  </div>

</template>

<style lang="postcss">
.scroll-section {
  height: 400px;
}

.tab-active {
  border-bottom: 2px solid rgb(194, 193, 193);
  color: rgb(37, 37, 37) !important;
}

.c-active {
  background-color: lightblue;
}
</style>

<script src="./analyses.component.ts" lang="ts"></script>
