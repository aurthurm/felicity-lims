<template>
  <div class="">
    <router-view />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
export default defineComponent({
  name: "kanban-view",
  setup() {
    return { };
  },
});
</script>