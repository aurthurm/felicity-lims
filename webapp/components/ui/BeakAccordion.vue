<script setup lang="ts">
import { ref } from "vue";
const props = defineProps({
  show: Boolean,
  compact: Boolean,
});

let show = ref(false);
</script>

<template>
  <transition name="accordion">
    <div :class="compact ? 'my-0.5' : 'rounded-lg my-1'">
      <div :class="compact ? 'text-card-foreground py-1' : 'border border-border bg-card text-card-foreground px-4 p-2 rounded-lg'">
        <button @click="show = !show"
          class="w-full flex justify-between text-card-foreground font-bold hover:text-primary focus:outline-none focus:ring-2 focus:ring-ring" type="button">
          <span class="w-full text-left">
            <slot name="title">Accordion Title</slot>
          </span>
          <span class="ml-2">
            <font-awesome-icon icon="fa-chevron-down" />
          </span>
        </button>
      </div>
      <div v-show="show" :class="compact ? 'text-foreground py-1' : 'border border-border bg-background text-foreground px-4 py-2'">
        <slot name="body">Accordion Body</slot>
      </div>
    </div>
  </transition>
</template>

<style lang="postcss"></style>


