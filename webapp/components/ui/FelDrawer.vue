<script lang="ts" setup>
import { ref, watch, onUnmounted } from "vue";
import { Teleport } from "vue";

const props = defineProps({
  show: Boolean,
  contentWidth: String,
});

const emit = defineEmits(["close"]);

let notification: any = ref(null);
let drawerNode: any = ref(null);

watch(
  () => props.show,
  (curr, _) => {
    if (curr !== true) {
      notification.value?.classList.add("translate-x-full");
      notification.value?.classList.remove("translate-x-0");
      setTimeout(function () {
        drawerNode.value?.classList.add("hidden");
      }, 500);
      document.body.style.overflow = "";
    } else {
      setTimeout(function () {
        notification.value?.classList.remove("translate-x-full");
        notification.value?.classList.add("translate-x-0");
      }, 500);
      drawerNode.value?.classList.remove("hidden");
      document.body.style.overflow = "hidden";
    }
  }
);

onUnmounted(() => {
  document.body.style.overflow = "";
});
</script>

<template>
  <Teleport to="body" :disabled="!show">
    <div ref="drawerNode"
      class="w-full h-screen bg-muted/50 backdrop-blur-sm top-0 left-0 overflow-y-auto hidden overflow-x-hidden fixed sticky-0 z-10">
      <div ref="notification"
        class="w-full absolute z-20 right-0 h-full overflow-x-hidden transform translate-x-full transition ease-in-out duration-100">
        <div :class="[
          'bg-card shadow-xl text-card-foreground h-screen overflow-hidden absolute right-0 flex flex-col',
          contentWidth ? contentWidth : 'w-1/3',
        ]">
          <div class="shrink-0 flex items-center justify-between border-b border-border p-8">
            <p tabindex="0" class="focus:outline-none text-2xl font-semibold leading-6 text-card-foreground">
              <slot name="header">Drawer Title</slot>
            </p>
            <button role="button" aria-label="close modal"
              class="focus:outline-none focus:ring-2 focus:ring-ring rounded-lg cursor-pointer text-muted-foreground hover:text-destructive-foreground hover:bg-destructive p-2"
              @click="() => emit('close')">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M18 6L6 18" stroke="currentColor" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round" />
                <path d="M6 6L18 18" stroke="currentColor" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
            </button>
          </div>

          <div class="flex-1 overflow-y-auto p-8">
            <slot name="body">Drawer Body</slot>
          </div>

          <div class="shrink-0 border-t border-border p-8 flex items-center">
            <slot name="footer"></slot>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>
