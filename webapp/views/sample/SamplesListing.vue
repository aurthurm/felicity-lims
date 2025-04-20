<script setup lang="ts">
import { defineAsyncComponent } from "vue";
import * as shield from "@/guards";
const Samples = defineAsyncComponent(
  () => import("@/components/sample/FelSampleListing.vue")
)
</script>

<template>
  <div>
    <fel-heading title="Samples" class="flex-1" >
      <router-link
          v-show="shield.hasRights(shield.actions.CREATE, shield.objects.SAMPLE)" to="/patients/search"
          class="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary/50"
        >
        Add Laboratory Request
      </router-link>
    </fel-heading>
    <samples class="rounded-lg" />
  </div>
</template>
