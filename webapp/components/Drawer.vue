<script lang="ts" setup>
import { ref, watch } from "vue";

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
    } else {
      setTimeout(function () {
        notification.value?.classList.remove("translate-x-full");
        notification.value?.classList.add("translate-x-0");
      }, 500);
      drawerNode.value?.classList.remove("hidden");
    }
  }
);
</script>

<template>
  <div ref="drawerNode"
    class="w-full h-screen bg-gray-800 bg-opacity-90 top-0 left-0 overflow-y-auto hidden overflow-x-hidden fixed sticky-0 z-10">
    <div ref="notification"
      class="w-full absolute z-20 right-0 h-full overflow-x-hidden transform translate-x-full transition ease-in-out duration-700">
      <div class=" " :class="[
        'bg-gray-50 h-screen overflow-y-auto p-8 absolute right-0 flex flex-col',
        contentWidth ? contentWidth : 'w-1/3',
      ]">
        <div class="flex items-center justify-between">
          <p tabindex="0" class="focus:outline-none text-2xl font-semibold leading-6 text-gray-800">
            <slot name="header">Drawer Title</slot>
          </p>
          <button role="button" aria-label="close modal"
            class="focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 rounded-sm cursor-pointer"
            @click="() => emit('close')">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18 6L6 18" stroke="#4B5563" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round" />
              <path d="M6 6L18 18" stroke="#4B5563" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </button>
        </div>

        <div class="w-full my-4 py-1 px-2 bg-white shadow-xs flex-1">
          <slot name="body">Drawer Body</slot>
        </div>

        <div class="w-full my-1 py-1 px-2 flex items-center">
          <slot name="footer"></slot>
        </div>
      </div>
    </div>
  </div>
</template>
