<template>
  <div class="pt-4">
    <router-view />
  </div>
</template>

<script>
import { defineComponent, computed } from 'vue';
export default defineComponent({
  name: "Kanban-Task",
  setup() {
    return { };
  },
});
</script>