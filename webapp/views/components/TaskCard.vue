<template>
  <div class="bg-white shadow rounded-sm px-3 pt-3 pb-5 border border-white">
    <div class="flex justify-between">
      <p class="text-gray-700 font-semibold font-sans tracking-wide text-sm">{{task.title}}</p>
      <!-- <img
        class="w-6 h-6 rounded-full ml-3"
        src="https://pickaface.net/gallery/avatar/unr_sample_161118_2054_ynlrg.png"
        alt="Avatar"
      > -->
    </div>
    <div class="flex mt-4 justify-between items-center">
      <span class="text-sm text-gray-600">{{task.date}}</span>
      <badge v-if="task.type" :color="badgeColor">{{task.type}}</badge>
    </div>
  </div>
</template>

<script lang="ts">
import Badge from "../../components/Badge.vue";
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
