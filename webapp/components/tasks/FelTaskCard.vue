<script lang="ts">
import { defineAsyncComponent } from 'vue';
const Badge = defineAsyncComponent(
  () => import("@/components/Badge.vue")
)
export default {
  name: "task-card",
  components: {
    Badge
  },
  props: {
    task: {
      type: Object,
      default: () => ({})
    }
  },
  computed: {
    badgeColor(): string {
      const mappings: any = {
        Design: "purple",
        "Feature Request": "teal",
        Backend: "blue",
        QA: "green",
        default: "teal"
      };
      return mappings[this.task.type] || mappings.default;
    }
  }
};
</script>

<template>
  <div class="bg-card rounded-lg border border-border p-4 shadow-sm">
    <div class="flex justify-between items-center">
      <p class="text-sm font-medium text-foreground">{{task.title}}</p>
      <!-- <img
        class="w-6 h-6 rounded-full ml-3"
        src="https://pickaface.net/gallery/avatar/unr_sample_161118_2054_ynlrg.png"
        alt="Avatar"
      > -->
    </div>
    <div class="flex mt-4 justify-between items-center">
      <span class="text-sm text-muted-foreground">{{task.date}}</span>
      <badge v-if="task.type" :color="badgeColor">{{task.type}}</badge>
    </div>
  </div>
</template>

