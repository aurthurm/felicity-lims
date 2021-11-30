import Swal from 'sweetalert2';
import JSConfetti from 'js-confetti'
import { Notyf } from 'notyf';
import  { ref } from 'vue'
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import { ActionTypes } from '../store/actions'

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

const fireAlert = (options: any) => {
    Swal.fire({
      title: 'Yay!',
      text: options.message,
      icon: options.icon,
      confirmButtonText: 'Cool'
    })
}


export default function useNotifyToast(){
    const store = useStore();
    const router = useRouter();

    // Notify Toast Notifications
    const toastSuccess = (message: string) => notyf.success(message);
    const toastInfo = (message: string) => notyf.open({ type: 'info', message });
    const toastWarning = (message: string) => notyf.open({ type: 'warning', message });
    const toastError = (message: string) => notyf.error(message);


    // Swal Modal Notifications
    const swalSuccess = (message: string) => fireAlert({ icon: "success", message });
    const swalInfo = (message: string) => fireAlert({ icon: "info", message });
    const swalWarning = (message: string) => fireAlert({ icon: "warning", message });
    const swalError = (message: string) => fireAlert({ icon: "error", message });

    const logOut = () => {
        store.dispatch(ActionTypes.LOG_OUT).then(_ => router.push({ name: "Login" }));
    }

    // Automatic Error handling from Graphql backend
    const gqlErrorHandler = (error: any) => {
        let _message = error;
        let message = _message
      
        if(typeof(message) == 'object'){
          message = message.message
          if(_message.networkError) {
            message = _message.networkError.message
            // only logout on network error
            swalError("!!OOPS!!: Something just hapenned Please login again :)")
            setTimeout(() => logOut(), 2000)
          }
        }
    }

    // -- 
    return { 
        toastSuccess, toastInfo, toastWarning, toastError,
        swalSuccess, swalInfo, swalWarning, swalError,
        gqlErrorHandler,
        logOut
    }
}






