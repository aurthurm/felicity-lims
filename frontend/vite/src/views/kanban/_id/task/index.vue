<template>
  <div class="pt-4">
    <router-view />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
export default defineComponent({
  name: "Kanban-Task",
  setup() {
    return { };
  },
});
</script>