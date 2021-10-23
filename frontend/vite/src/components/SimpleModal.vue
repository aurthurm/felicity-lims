<template>
    <div class="modal-mask">
      <div class="modal-wrapper" @click="$emit('close')">
        <div 
          @click.stop
         :class="[
                'modal-container max-h-screen overflow-y-scroll',
                contentWidth ? contentWidth : 'w-3/4',
              ]">

          <div class="modal-header">
            <div class="flex justify-between">
              <slot name="header">
                default header
              </slot>
              <button @click="$emit('close')" class="ml-4 inline-flex items-center justify-center w-8 h-8 mr-2  text-red-500 transition-colors duration-150 bg-white rounded-full border-red-200 border focus:outline-none hover:border-red-500">
                 <font-awesome-icon icon="times" />
              </button> 
            </div>
          </div>
          <hr>

          <div class="modal-body">
            <slot name="body">
              default body
            </slot>
          </div>
          
          <hr>
          <div class="modal-footer">
            <slot name="footer">
              <div class="flex justify-end">
                <button class="modal-default-button text-red-500 border-red-200 border rounded py-1 px-2 transition-colors hover:outline-none hover:border-red-500" 
                @click="$emit('close')">
                  Cancel
                </button>
              </div>
            </slot>
          </div>
          
        </div>
      </div>
    </div>
</template>


<script lang="ts">
import { defineComponent, onMounted } from 'vue';
export default defineComponent({
  name: 'simple-modal',
  props: {
    contentWidth: String,
  },
  setup(props, { emit }) {

    onMounted(() => {
      document.addEventListener("keydown", (e) => {
        if (e.keyCode == 27) {
            emit('close');
        }
      });
    })

    return {}
  },
});
</script>

<style lang="postcss">

.modal-mask {
  position: fixed;
  z-index: 9998;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: table;
  transition: opacity 0.6s ease;
}

.modal-wrapper {
  display: table-cell;
  vertical-align: middle;
}

.modal-container {
  /* max-width: 70%; */
  margin: 0px auto;
  padding: 20px 30px;
  background-color: #fff;
  border-radius: 2px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
  transition: all 0.6s ease;
  font-family: Helvetica, Arial, sans-serif;
}

.modal-header h3 {
  margin-top: 0;
  color: #42b983;
}

.modal-body {
  margin: 20px 0;
}

.modal-default-button {
  display: block;
  margin-top: 1rem;
}

.modal-enter {
  opacity: 0;
}

.modal-leave-active {
  opacity: 0;
}

.modal-enter .modal-container,
.modal-leave-active .modal-container {
  -webkit-transform: scale(1.1);
  transform: scale(1.1);
}

</style>

