<template>
  <Transition
    appear
    name="modal"
    @after-leave="$emit('after-leave')"
  >
    <div 
      v-if="true"
      class="modal-mask fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 backdrop-blur-sm"
      @click="handleOutsideClick"
      role="dialog"
      aria-modal="true"
    >
      <div 
        class="min-h-screen px-4 flex items-center justify-center"
      >
        <Transition
          name="modal-inner"
          appear
        >
          <div 
            :class="[
              'modal-container bg-white rounded-lg shadow-xl transform',
              'max-h-[90vh] overflow-y-auto',
              contentWidth ? contentWidth : 'w-full max-w-2xl'
            ]"
            @click.stop
            ref="modalRef"
          >
            <div class="p-6">
              <!-- Header -->
              <div class="flex items-center justify-between mb-4">
                <div class="flex-1">
                  <slot name="header">
                    <h3 class="text-lg font-semibold text-gray-900">
                      Default Header
                    </h3>
                  </slot>
                </div>
                <button
                  @click="$emit('close')"
                  class="inline-flex items-center justify-center w-8 h-8 ml-4 text-gray-400 
                         transition-colors duration-200 rounded-full hover:text-red-500 
                         hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500"
                  aria-label="Close modal"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <!-- Divider -->
              <div class="h-px bg-gray-200 my-4"></div>

              <!-- Body -->
              <div class="modal-body">
                <slot name="body">
                  Default body content
                </slot>
              </div>

              <!-- Divider -->
              <div class="h-px bg-gray-200 my-4"></div>

              <!-- Footer -->
              <div class="modal-footer">
                <slot name="footer">
                  <div class="flex justify-end space-x-3">
                    <button
                      class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border 
                             border-gray-300 rounded-md shadow-sm hover:bg-gray-50 
                             focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                      @click="$emit('close')"
                    >
                      Cancel
                    </button>
                  </div>
                </slot>
              </div>
            </div>
          </div>
        </Transition>
      </div>
    </div>
  </Transition>
</template>

<script lang="ts">
import { defineComponent, onMounted, onUnmounted, ref } from 'vue'

export default defineComponent({
  name: 'enhanced-modal',
  props: {
    contentWidth: String,
  },
  emits: ['close', 'after-leave'],
  setup(props, { emit }) {
    const modalRef = ref<HTMLElement | null>(null)

    const handleOutsideClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      if (!modalRef.value?.contains(target)) {
        emit('close')
      }
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        emit('close')
      }
    }

    // Prevent body scroll when modal is open
    const lockScroll = () => {
      document.body.style.overflow = 'hidden'
    }

    const unlockScroll = () => {
      document.body.style.overflow = ''
    }

    onMounted(() => {
      document.addEventListener('keydown', handleEscape)
      lockScroll()
    })

    onUnmounted(() => {
      document.removeEventListener('keydown', handleEscape)
      unlockScroll()
    })

    return {
      modalRef,
      handleOutsideClick
    }
  }
})
</script>

<style lang="postcss" scoped>
.modal-mask {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-inner-enter-active,
.modal-inner-leave-active {
  transition: all 0.3s ease-out;
}

.modal-inner-enter-from {
  opacity: 0;
  transform: scale(0.9);
}

.modal-inner-leave-to {
  opacity: 0;
  transform: scale(0.95);
}

.modal-inner-enter-to,
.modal-inner-leave-from {
  opacity: 1;
  transform: scale(1);
}
</style>