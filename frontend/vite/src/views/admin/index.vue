<template>
  <div class="">
    <div class="flex justify-start">
      <span @click="resetSelected" class="mr-4">
        <router-link to="/admin" class="no-underline">
          <h4>Felicity Configurations</h4>
        </router-link>
      </span>
      <span v-if="selectedRoute">&rarr;</span> 
      <span class="ml-4"> {{ selectedRoute }}</span>
    </div>
    <hr>
    <router-view />
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';
import { useStore } from 'vuex';
import { ActionTypes } from '../../store/modules/admin';
export default defineComponent({
  name: "admin",
  setup() {
    const store = useStore();
    const resetSelected = () => store.dispatch(ActionTypes.SET_CONF_ROUTE, "");
    const selectedRoute = computed(() => store.getters.getConfRoute)
    return { selectedRoute, resetSelected };
  },
});
</script>