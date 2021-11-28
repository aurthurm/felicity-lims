<template>

  <section class="col-span-12" >

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

    <div>
      <tab-samples v-if="currentTab === 'samples'" />
      <tab-contacts v-if="currentTab === 'contacts'" :clientUid="client?.uid" />
    </div>

  </section>

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

<script lang="ts">
import { useStore } from 'vuex';
import { defineComponent, ref, computed } from 'vue';


import tabSamples from '../../components/SampleListing.vue';
import tabContacts from '../comps/ContactTable.vue';

export default defineComponent({
  name: 'clients-detail',
  components: {
    tabSamples,
    tabContacts,
  },
  setup() {
    const store = useStore();

    let currentTab = ref('samples');
    const tabs = ['samples', 'contacts'];
    let currentTabComponent = computed(() => 'tab-' + currentTab.value);

    let client = computed(() => store.getters.getClient)

    return {
      tabs,
      currentTab,
      currentTabComponent,
      client,
    };
  },
});
</script>
