import Swal from 'sweetalert2';
import JSConfetti from 'js-confetti'
import { Notyf } from 'notyf';

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
        duration: 10000,
        dismissible: true
      }
    ]
});

const fireAlert = async (options: any) => {
    await Swal.fire({
      title: 'Yay!',
      text: options.message,
      icon: options.icon,
      confirmButtonText: 'Cool'
    })
}


export default function useNotifyToast(){

    // Notify Toast Notifications
    const toastSuccess = (message: string) => notyf.success(message);
    const toastInfo = (message: string) => notyf.open({ type: 'info', message });
    const toastWarning = (message: string) => notyf.open({ type: 'warning', message });
    const toastError = (message: string) => notyf.error(message);


    // Swal Modal Notifications
    const swalSuccess = (message: string) => fireAlert({ icon: "success", message });
    const swalInfo = (message: string) => fireAlert({ icon: "info", message });
    const swalWarning = (message: string) => fireAlert({ icon: "warning", message });
    const swalError = async (message: string) => await fireAlert({ icon: "error", message });

    // Automatic Error handling from Graphql backend
    const gqlErrorHandler = (error: any) => {
      console.log(error);
      if(typeof(error) == 'object'){
        if(error.graphQLErrors) {
          const gErrors = new Set()
          error.graphQLErrors?.forEach((err :any) => gErrors.add(err.message))
          gErrors?.forEach((err :any) => toastError(err))
        }
        if(error.networkError) {
          toastError(error.networkError.message);
          swalError("!!OOPS!!: Something just hapenned Please login again :)")
        }
      }
    }

    const gqlResponseHandler = (res: any):any => {
      if(res.error) gqlErrorHandler(res.error);
      return res.data;
    }

    const gqlOpertionalErrorHandler = (res: any):any => {
      if(res.__typename === 'OperationError') {
        swalError(res.error + "\n" + res.suggestion);
        return;
      };
      return res;
    }

    // -- 
    return { 
        toastSuccess, toastInfo, toastWarning, toastError,
        swalSuccess, swalInfo, swalWarning, swalError,
        gqlResponseHandler, gqlErrorHandler, gqlOpertionalErrorHandler 
    }
}






