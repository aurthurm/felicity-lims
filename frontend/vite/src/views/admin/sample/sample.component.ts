import { defineComponent, ref, computed } from 'vue';

import tabSampleTypes from './SampleTypes.vue'
import tabContainerTypes from './ContainerTypes.vue'

export default defineComponent({
  name: 'sample-conf',
  components: {
    tabSampleTypes,
    tabContainerTypes
  },
  setup() {

    let currentTab = ref<string>('sample-types');
    const tabs: string[] = ['sample-types']; //  'container-types'
    let currentTabComponent = computed(() => 'tab-' + currentTab.value);
 
    return {
      currentTab,
      tabs,
      currentTabComponent
    };
  },
});