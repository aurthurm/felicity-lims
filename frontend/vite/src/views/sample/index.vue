<template>
  <div class="">
    <router-view />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
export default defineComponent({
  name: "sample-view",
  setup() {
    return { };
  },
});
</script>