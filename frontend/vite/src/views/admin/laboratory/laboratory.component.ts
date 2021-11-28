import { defineComponent, ref, computed } from 'vue';

import tabLaboratory from './comps/Laboratory.vue'
import tabDepartments from './comps/Departments.vue'

export default defineComponent({
  name: 'instruments-conf',
  components: {
    tabLaboratory,
    tabDepartments
  },
  setup() {

    let currentTab = ref<string>('laboratory');
    const tabs: string[]= ['laboratory', 'departments'];
    let currentTabComponent = computed(() => 'tab-' + currentTab.value);
 
    return {
      currentTab,
      tabs,
      currentTabComponent
    };
  },
});