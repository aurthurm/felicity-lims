<template>
  <component :is="layout">
    <!-- <div class="text-center">Flash Messages will come here.</div> -->
    <router-view />
  </component>
</template>

<script lang="ts">
  import { defineComponent, computed } from 'vue';
  import { useRouter } from 'vue-router';
  const defaultLayout = 'default';

  export default defineComponent({
    setup() {
      const { currentRoute } = useRouter();

      const layout = computed(() => `${currentRoute.value.meta.layout || defaultLayout}-layout`);

      return {
        layout,
      };
    },
  });
</script>