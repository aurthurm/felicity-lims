import { defineComponent, ref, computed } from 'vue';

import tabSampleTypes from './comps/SampleTypes.vue'
import tabContainerTypes from './comps/ContainerTypes.vue'

export default defineComponent({
  name: 'sample-conf',
  components: {
    tabSampleTypes,
    tabContainerTypes
  },
  setup() {

    let currentTab = ref<string>('sample-types');
    const tabs: string[] = ['sample-types', 'container-types'];
    let currentTabComponent = computed(() => 'tab-' + currentTab.value);
 
    return {
      currentTab,
      tabs,
      currentTabComponent
    };
  },
});