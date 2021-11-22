<template>
  <component :is="layout">
    <!-- <div class="text-center">Flash Messages will come here.</div> -->
    <router-view />
  </component>
</template>

<script lang="ts">
import Swal from 'sweetalert2';
import JSConfetti from 'js-confetti'
import { Notyf } from 'notyf';
import { defineComponent, ref, computed, watch, inject } from 'vue';
import { useRouter } from 'vue-router';
import { mapGetters, mapActions, useStore } from "vuex";
import { ActionTypes } from './store/actions'
const defaultLayout = 'default';
export default defineComponent({
  setup(props, context) {
    const { currentRoute } = useRouter();
    const store = useStore();
    const router = useRouter();

    const jsConfetti = new JSConfetti();
    jsConfetti.addConfetti({
      emojis: ['🌈', '⚡️', '💥', '✨', '💫', '🌸'],
    })

    const notyf = new Notyf({ // https://github.com/caroso1222/notyf
        duration: 5000,
        position: {
          x: 'left',
          y: 'bottom',
        },
        types: [
          {
            type: 'info',
            background: 'blue',
            icon: false
          },
          {
            type: 'warning',
            background: 'orange',
            icon: {
              className: 'material-icons',
              tagName: 'i',
              text: 'warning'
            }
          },
          {
            type: 'error',
            background: 'indianred',
            duration: 2000,
            dismissible: false
          }
        ]
      });
    
    const layout = computed(() => `${currentRoute.value.meta.layout || defaultLayout}-layout`);

    const fireAlert = (options: any) => {
      Swal.fire({
        title: 'Yay!',
        text: options.message,
        icon: options.icon,
        confirmButtonText: 'Cool'
      })
    }

    watch(store.state.toast.alert, (current, prev) => {
      fireAlert(current)
    });

    watch(store.state.toast.notification, (current, prev) => {
      if(!current.data) return;

      let _message = current.data;
      let message = _message

      console.error(message);

      let logout = false;
      if(typeof(message) == 'object'){
        message = message.message
        if(_message.networkError) {
          message = _message.networkError.message
          // only logout on network error
          logout = true;
        }
      }

      if(current.icon === "success"){
        notyf.success(current.message);
      }else if(current.icon ==="info"){
        notyf.open({
          type: 'info',
          message: current.message
        });
      }else if(current.icon ==="warning"){
        notyf.open({
          type: 'warning',
          message: current.message
        });
      }else{
        notyf.error(message);
        if(logout) store.dispatch(ActionTypes.LOG_OUT).then(_ => router.push({ name: "Login" }));
      }
    });

    return {
      layout,
    };
  },
});
</script>